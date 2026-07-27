import { cn } from "@/lib/utils";

interface UptimeStatsProps {
  uptime24h: number | null;
  uptime7d: number | null;
  uptime30d: number | null;
}

function colorClass(value: number | null): string {
  if (value === null) return "text-[#1d1d1f]";
  if (value >= 99.9) return "text-[#34c759]";
  if (value >= 95) return "text-[#ff9f0a]";
  return "text-[#ff3b30]";
}

export function UptimeStats({ uptime24h, uptime7d, uptime30d }: UptimeStatsProps) {
  const stats = [
    { label: "Last 24 hours", value: uptime24h },
    { label: "Last 7 days", value: uptime7d },
    { label: "Last 30 days", value: uptime30d },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-[#e5e5ea] bg-white p-5 text-center shadow-sm"
        >
          <div className={cn("text-3xl font-semibold tracking-tight", colorClass(s.value))}>
            {s.value !== null ? `${s.value}%` : "\u2014"}
          </div>
          <div className="mt-1 text-xs text-[#86868b]">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
