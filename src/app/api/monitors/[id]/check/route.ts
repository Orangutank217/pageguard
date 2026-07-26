import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
      error_message: null,
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

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify ownership
  const { data: monitor } = await supabase
    .from("monitors")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!monitor) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  // Perform the check
  const result = await performCheck(monitor.url);

  // Record the check
  const { data: check } = await supabase
    .from("checks")
    .insert({
      monitor_id: id,
      ...result,
    })
    .select()
    .single();

  // Detect status change
  const { data: previousCheck } = await supabase
    .from("checks")
    .select("is_up")
    .eq("monitor_id", id)
    .order("checked_at", { ascending: false })
    .limit(1)
    .single();

  const wasPreviouslyUp = previousCheck?.is_up ?? true; // assume up if no previous

  if (wasPreviouslyUp && !result.is_up) {
    // Site just went down — create incident
    await supabase.from("incidents").insert({
      monitor_id: id,
      started_at: new Date().toISOString(),
      reason: `Status: ${result.status_code ?? "Error"} — ${result.error_message ?? "Unknown"}`,
    });
  } else if (!wasPreviouslyUp && result.is_up) {
    // Site came back up — close latest open incident
    const { data: openIncident } = await supabase
      .from("incidents")
      .select("*")
      .eq("monitor_id", id)
      .is("resolved_at", null)
      .order("started_at", { ascending: false })
      .limit(1)
      .single();

    if (openIncident) {
      const resolvedAt = new Date().toISOString();
      const durationSeconds = Math.round(
        (new Date().getTime() - new Date(openIncident.started_at).getTime()) / 1000
      );
      await supabase
        .from("incidents")
        .update({
          resolved_at: resolvedAt,
          duration_seconds: durationSeconds,
        })
        .eq("id", openIncident.id);
    }
  }

  return NextResponse.json(check);
}
