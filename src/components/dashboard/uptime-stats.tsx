import { Card, CardContent } from "@/components/ui/card";

interface UptimeStatsProps {
  uptime24h: number | null;
  uptime7d: number | null;
  uptime30d: number | null;
}

export function UptimeStats({ uptime24h, uptime7d, uptime30d }: UptimeStatsProps) {
  const stats = [
    { label: "Last 24 hours", value: uptime24h },
    { label: "Last 7 days", value: uptime7d },
    { label: "Last 30 days", value: uptime30d },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {s.value !== null ? `${s.value}%` : "—"}
            </div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
