"use client";

import { useRouter } from "next/navigation";
import { StatusDot } from "@/components/dashboard/status-dot";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Play, Trash2, ExternalLink } from "lucide-react";
import type { MonitorWithLatest } from "@/types/database";

interface MonitorCardProps {
  monitor: MonitorWithLatest;
  onCheck: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MonitorCard({ monitor, onCheck, onDelete }: MonitorCardProps) {
  const router = useRouter();
  const lastCheck = monitor.latest_check;
  const isUp = lastCheck?.is_up ?? null;
  const lastCheckTime = lastCheck?.checked_at
    ? formatRelativeTime(lastCheck.checked_at)
    : "Never";

  // Response time sparkline from recent checks
  const sparklineData = monitor.recent_checks ?? [];
  const maxTime = Math.max(...sparklineData.map((c) => c.response_time_ms ?? 0), 1);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <StatusDot isUp={isUp} className="mt-1" />
            <div>
              <button
                onClick={() => router.push(`/dashboard/monitors/${monitor.id}`)}
                className="cursor-pointer font-semibold text-foreground hover:text-primary"
              >
                {monitor.name}
              </button>
              <p className="mt-0.5 text-sm text-muted-foreground">{monitor.url}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onCheck(monitor.id)}>
                <Play className="mr-2 h-4 w-4" />
                Test Now
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/monitors/${monitor.id}`)}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                data-variant="destructive"
                onClick={() => onDelete(monitor.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Metrics row */}
        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Last Check</div>
            <div className="font-medium">{lastCheckTime}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Uptime (30d)</div>
            <div className="font-medium">
              {monitor.uptime_percent_30d !== null
                ? `${monitor.uptime_percent_30d}%`
                : "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Response</div>
            <div className="font-medium">
              {lastCheck?.response_time_ms != null
                ? `${lastCheck.response_time_ms}ms`
                : "—"}
            </div>
          </div>
        </div>

        {/* Sparkline */}
        {sparklineData.length > 0 && (
          <div className="mt-3 flex items-end gap-0.5">
            {sparklineData.map((c, i) => {
              const height = ((c.response_time_ms ?? 0) / maxTime) * 24;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-primary/30"
                  style={{ height: `${Math.max(height, 4)}px` }}
                  title={`${c.response_time_ms}ms`}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
