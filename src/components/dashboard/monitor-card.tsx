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

const BENTO_ACCENTS = [
  "bento-accent-blue",
  "bento-accent-green",
  "bento-accent-amber",
  "bento-accent-purple",
  "bento-accent-rose",
  "bento-accent-teal",
  "bento-accent-red",
];

export function MonitorCard({ monitor, onCheck, onDelete }: MonitorCardProps) {
  const router = useRouter();
  const lastCheck = monitor.latest_check;
  const isUp = lastCheck?.is_up ?? null;
  const lastCheckTime = lastCheck?.checked_at
    ? formatRelativeTime(lastCheck.checked_at)
    : "Never";

  // Stable accent based on monitor id
  const accentIndex =
    monitor.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    BENTO_ACCENTS.length;
  const accentClass = BENTO_ACCENTS[accentIndex];

  // Sparkline data
  const sparklineData = monitor.recent_checks ?? [];
  const maxTime = Math.max(...sparklineData.map((c) => c.response_time_ms ?? 0), 1);

  return (
    <Card className={`${accentClass} transition-all duration-200 hover:shadow-md`}>
      <CardContent className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <StatusDot isUp={isUp} className="mt-1 shrink-0" />
            <div className="min-w-0">
              <button
                onClick={() => router.push(`/dashboard/monitors/${monitor.id}`)}
                className="cursor-pointer font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors text-left truncate max-w-full"
              >
                {monitor.name}
              </button>
              <p className="mt-0.5 text-sm text-[#86868b] truncate">
                {monitor.url}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-[#f5f5f7] transition-colors">
              <MoreHorizontal className="h-4 w-4 text-[#86868b]" />
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
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-[#86868b]">Last Check</div>
            <div className="mt-0.5 font-medium text-[#1d1d1f]">{lastCheckTime}</div>
          </div>
          <div>
            <div className="text-xs text-[#86868b]">Uptime (30d)</div>
            <div className="mt-0.5 font-medium text-[#1d1d1f]">
              {monitor.uptime_percent_30d !== null
                ? `${monitor.uptime_percent_30d}%`
                : "\u2014"}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#86868b]">Response</div>
            <div className="mt-0.5 font-medium text-[#1d1d1f]">
              {lastCheck?.response_time_ms != null
                ? `${lastCheck.response_time_ms}ms`
                : "\u2014"}
            </div>
          </div>
        </div>

        {/* Sparkline */}
        {sparklineData.length > 0 && (
          <div className="mt-4 flex items-end gap-0.5 h-6">
            {sparklineData.map((c, i) => {
              const height = ((c.response_time_ms ?? 0) / maxTime) * 24;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-[#0071e3]/20"
                  style={{ height: `${Math.max(height, 3)}px` }}
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
