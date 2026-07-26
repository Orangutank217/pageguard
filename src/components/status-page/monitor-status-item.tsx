import { StatusDot } from "@/components/dashboard/status-dot";
import { TimelineBar } from "@/components/status-page/timeline-bar";

interface MonitorStatusItemProps {
  name: string;
  url: string;
  isUp: boolean | null;
  uptimePercent: number | null;
  checks: { is_up: boolean; checked_at: string }[];
}

export function MonitorStatusItem({
  name,
  url,
  isUp,
  uptimePercent,
  checks,
}: MonitorStatusItemProps) {
  return (
    <div className="rounded-lg border border-border bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <StatusDot isUp={isUp} className="mt-1" />
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{url}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">
            {uptimePercent !== null ? `${uptimePercent}%` : "—"}
          </div>
          <div className="text-xs text-muted-foreground">uptime (30d)</div>
        </div>
      </div>
      <div className="mt-3">
        <TimelineBar checks={checks} />
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>24 hours ago</span>
        <span>Now</span>
      </div>
    </div>
  );
}
