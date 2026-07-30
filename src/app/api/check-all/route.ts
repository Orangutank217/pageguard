import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlanLimits } from "@/lib/plan-limits";

async function performCheck(url: string) {
  const start = Date.now();
  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(10000),
      redirect: "follow",
    });
    const duration = Date.now() - start;
    return {
      status_code: response.status,
      response_time_ms: duration,
      is_up: response.status >= 200 && response.status < 400,
      error_message: null as string | null,
    };
  } catch (err: unknown) {
    const duration = Date.now() - start;
    return {
      status_code: null,
      response_time_ms: duration,
      is_up: false,
      error_message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PageGuard <alerts@pageguard.app>",
        to,
        subject,
        text,
      }),
    });
    if (!res.ok) {
      console.error("Failed to send email:", await res.text());
    }
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

export async function POST(request: NextRequest) {
  console.log("[check-all] POST received", {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    body: await request.clone().text().catch(() => "(no body)"),
  });
  return handleCheckAll(request);
}

export async function GET(request: NextRequest) {
  console.log("[check-all] GET received", {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  });
  return handleCheckAll(request);
}

async function handleCheckAll(request: NextRequest) {
  // Verify cron secret
  const auth = request.headers.get("x-cron-secret");
  if (auth !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Fetch all active monitors that are due
  const { data: monitors, error: fetchError } = await supabase
    .from("monitors")
    .select("*, profiles!inner(plan, email, paddle_subscription_id)")
    .eq("is_active", true);

  if (fetchError) {
    console.error("Failed to fetch monitors:", fetchError);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const now = new Date().toISOString();
  const results: { monitor: string; status: string }[] = [];

  // Parallel checks with concurrency limit of 5
  const concurrencyLimit = 5;
  const chunks = [];
  for (let i = 0; i < (monitors ?? []).length; i += concurrencyLimit) {
    chunks.push((monitors ?? []).slice(i, i + concurrencyLimit));
  }

  for (const chunk of chunks) {
    const chunkResults = await Promise.allSettled(
      chunk.map(async (monitor) => {
        // Check if monitor is due
        const { data: lastCheck } = await supabase
          .from("checks")
          .select("checked_at, is_up")
          .eq("monitor_id", monitor.id)
          .order("checked_at", { ascending: false })
          .limit(1)
          .single();

        const lastTime = lastCheck?.checked_at
          ? new Date(lastCheck.checked_at).getTime()
          : 0;
        const dueTime = lastTime + monitor.interval_minutes * 60 * 1000;

        if (dueTime > Date.now()) {
          return { monitor: monitor.name, status: "skipped" };
        }

        // Perform check
        const result = await performCheck(monitor.url);

        // Record check
        await supabase.from("checks").insert({
          monitor_id: monitor.id,
          ...result,
          checked_at: now,
        });

        // Update monitor's updated_at
        await supabase
          .from("monitors")
          .update({ updated_at: now })
          .eq("id", monitor.id);

        // Detect status change
        const wasUp = lastCheck?.is_up ?? true; // assume up if no previous check

        // Email recipient
        const alertEmail = monitor.alert_email || monitor.profiles?.email;

        if (wasUp && !result.is_up) {
          // Site just went DOWN
          await supabase.from("incidents").insert({
            monitor_id: monitor.id,
            started_at: now,
            reason: `Status: ${result.status_code ?? "Error"} — ${result.error_message ?? "Unknown"}`,
          });

          if (alertEmail) {
            await sendEmail({
              to: alertEmail,
              subject: `[PageGuard] ${monitor.url} is DOWN`,
              text: [
                `Site: ${monitor.url}`,
                `Status: ${result.status_code ?? "Connection Error"}`,
                `Response Time: ${result.response_time_ms}ms`,
                `Detected: ${new Date().toUTCString()}`,
                ``,
                `View in dashboard:`,
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/monitors/${monitor.id}`,
              ].join("\n"),
            });
          }
        } else if (!wasUp && result.is_up) {
          // Site came BACK UP
          const { data: openIncident } = await supabase
            .from("incidents")
            .select("*")
            .eq("monitor_id", monitor.id)
            .is("resolved_at", null)
            .order("started_at", { ascending: false })
            .limit(1)
            .single();

          if (openIncident) {
            const resolvedAt = new Date().toISOString();
            const durationSeconds = Math.round(
              (Date.now() - new Date(openIncident.started_at).getTime()) / 1000
            );
            await supabase
              .from("incidents")
              .update({
                resolved_at: resolvedAt,
                duration_seconds: durationSeconds,
              })
              .eq("id", openIncident.id);
          }

          if (alertEmail) {
            await sendEmail({
              to: alertEmail,
              subject: `[PageGuard] ${monitor.url} is BACK UP`,
              text: [
                `Site: ${monitor.url}`,
                `Status: ${result.status_code}`,
                `Response Time: ${result.response_time_ms}ms`,
                `Detected: ${new Date().toUTCString()}`,
                ``,
                `View in dashboard:`,
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/monitors/${monitor.id}`,
              ].join("\n"),
            });
          }
        }

        // Prune old checks per plan limit
        const plan = (monitor as any).profiles?.plan ?? "free";
        const limits = getPlanLimits(plan);
        const maxChecks = limits.maxChecksPerMonitor;

        try {
          await supabase.rpc("delete_old_checks", {
            p_monitor_id: monitor.id,
            p_count: 0, // Will delete excess
          });
        } catch {
          // Manual pruning if RPC signature mismatch
          const { count } = await supabase
            .from("checks")
            .select("*", { count: "exact", head: true })
            .eq("monitor_id", monitor.id);

          if (count && count > maxChecks) {
            const excess = count - maxChecks;
            const { data: oldChecks } = await supabase
              .from("checks")
              .select("id")
              .eq("monitor_id", monitor.id)
              .order("checked_at", { ascending: true })
              .limit(excess);

            if (oldChecks?.length) {
              await supabase
                .from("checks")
                .delete()
                .in(
                  "id",
                  oldChecks.map((c) => c.id)
                );
            }
          }
        }

        return { monitor: monitor.name, status: "checked" };
      })
    );

    results.push(
      ...chunkResults.map((r) =>
        r.status === "fulfilled"
          ? r.value
          : { monitor: "unknown", status: "error" }
      )
    );
  }

  return NextResponse.json({
    checked: results.filter((r) => r.status === "checked").length,
    skipped: results.filter((r) => r.status === "skipped").length,
    errors: results.filter((r) => r.status === "error").length,
    total: results.length,
  });
}
