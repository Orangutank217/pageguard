import { cn } from "@/lib/utils";

export function StatusDot({
  isUp,
  className,
}: {
  isUp: boolean | null;
  className?: string;
}) {
  if (isUp === null) {
    return (
      <span
        className={cn(
          "inline-block h-3 w-3 rounded-full bg-gray-300",
          className
        )}
        title="No checks yet"
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-block h-3 w-3 rounded-full",
        isUp ? "status-dot-up" : "status-dot-down",
        className
      )}
      title={isUp ? "Up" : "Down"}
    />
  );
}
