import { cn } from "@/lib/utils";

interface TimelineBarProps {
  checks: { is_up: boolean; checked_at: string }[];
}

export function TimelineBar({ checks }: TimelineBarProps) {
  // Create 24 hourly segments for the last 24 hours
  const now = Date.now();
  const segments: ("up" | "down" | "empty")[] = [];

  for (let i = 23; i >= 0; i--) {
    const hourStart = now - (i + 1) * 60 * 60 * 1000;
    const hourEnd = now - i * 60 * 60 * 1000;

    const hourChecks = checks.filter((c) => {
      const t = new Date(c.checked_at).getTime();
      return t >= hourStart && t < hourEnd;
    });

    if (hourChecks.length === 0) {
      segments.push("empty");
    } else if (hourChecks.some((c) => !c.is_up)) {
      segments.push("down");
    } else {
      segments.push("up");
    }
  }

  return (
    <div className="flex gap-0.5">
      {segments.map((seg, i) => (
        <div
          key={i}
          className={cn(
            "h-3 flex-1 rounded-sm",
            seg === "up" && "bg-success",
            seg === "down" && "bg-destructive",
            seg === "empty" && "bg-gray-200"
          )}
          title={
            seg === "up"
              ? "All checks passed"
              : seg === "down"
              ? "Some checks failed"
              : "No checks"
          }
        />
      ))}
    </div>
  );
}
