import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MonitorStatusItem } from "@/components/status-page/monitor-status-item";
import { PageGuardLogo, PageGuardFooter } from "@/components/shared/pageguard-branding";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicStatusPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch status page
  const { data: page } = await supabase
    .from("status_pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!page || !page.is_public) {
    notFound();
  }

  // Fetch linked monitors
  const { data: links } = await supabase
    .from("status_page_monitors")
    .select("monitor_id")
    .eq("status_page_id", page.id);

  const monitorIds = links?.map((l) => l.monitor_id) ?? [];

  if (monitorIds.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <PageGuardLogo className="mb-8 justify-center text-lg" />
          <div className="rounded-xl border border-border bg-white p-8 text-center">
            <h1 className="text-xl font-bold text-foreground">
              {page.title}
            </h1>
            {page.description && (
              <p className="mt-2 text-muted-foreground">{page.description}</p>
            )}
            <p className="mt-6 text-muted-foreground">
              No monitors linked to this status page yet.
            </p>
          </div>
          <PageGuardFooter />
        </div>
      </div>
    );
  }

  // Fetch monitor data
  const { data: monitors } = await supabase
    .from("monitors")
    .select("*")
    .in("id", monitorIds);

  // Fetch latest check and uptime for each monitor
  const monitorsWithStatus = await Promise.all(
    (monitors ?? []).map(async (monitor) => {
      const { data: latestCheck } = await supabase
        .from("checks")
        .select("id, is_up, response_time_ms, checked_at, status_code")
        .eq("monitor_id", monitor.id)
        .order("checked_at", { ascending: false })
        .limit(1)
        .single();

      // Last 24h checks for timeline
      const dayAgo = new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString();
      const { data: recentChecks } = await supabase
        .from("checks")
        .select("is_up, checked_at")
        .eq("monitor_id", monitor.id)
        .gte("checked_at", dayAgo)
        .order("checked_at", { ascending: false });

      // Uptime 30d
      const thirtyDaysAgo = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString();
      const { data: uptimeChecks } = await supabase
        .from("checks")
        .select("is_up")
        .eq("monitor_id", monitor.id)
        .gte("checked_at", thirtyDaysAgo);

      const total = uptimeChecks?.length ?? 0;
      const up = uptimeChecks?.filter((c) => c.is_up).length ?? 0;
      const uptimePercent = total > 0 ? Math.round((up / total) * 1000) / 10 : null;

      return {
        name: monitor.name,
        url: monitor.url,
        isUp: latestCheck?.is_up ?? null,
        uptimePercent,
        checks: (recentChecks ?? []).map((c) => ({
          is_up: c.is_up,
          checked_at: c.checked_at,
        })),
      };
    })
  );

  const lastUpdated = monitorsWithStatus.reduce((latest: string | null, m) => {
    const checkTimes = m.checks.map((c) => c.checked_at);
    const max = checkTimes.length > 0 ? checkTimes.sort().reverse()[0] : null;
    if (!max) return latest;
    if (!latest) return max;
    return max > latest ? max : latest;
  }, null);

  const lastUpdatedText = lastUpdated
    ? formatRelativeTime(lastUpdated)
    : "No data";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <PageGuardLogo className="mb-8 justify-center text-lg" />

        <div className="rounded-xl border border-border bg-white p-6 sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              {page.title}
            </h1>
            {page.description && (
              <p className="mt-2 text-muted-foreground">{page.description}</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Last updated {lastUpdatedText}
            </p>
          </div>

          {/* Overall status badge */}
          <div className="mt-6">
            {monitorsWithStatus.every((m) => m.isUp !== false) ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-1.5 text-sm font-medium text-success">
                <span className="h-2 w-2 rounded-full bg-success" />
                All Systems Operational
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-1.5 text-sm font-medium text-destructive">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                Some Systems Degraded
              </div>
            )}
          </div>

          {/* Monitor list */}
          <div className="mt-6 space-y-4">
            {monitorsWithStatus.map((m) => (
              <MonitorStatusItem
                key={m.name}
                name={m.name}
                url={m.url}
                isUp={m.isUp}
                uptimePercent={m.uptimePercent}
                checks={m.checks}
              />
            ))}
          </div>
        </div>

        <PageGuardFooter />
      </div>
    </div>
  );
}

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
