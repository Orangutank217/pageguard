"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MonitorWithLatest } from "@/types/database";
import { toast } from "sonner";

export function useMonitors() {
  const [monitors, setMonitors] = useState<MonitorWithLatest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMonitors = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("monitors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load monitors");
      return;
    }

    // Fetch latest check + uptime for each monitor
    const monitorsWithData = await Promise.all(
      (data ?? []).map(async (monitor) => {
        const { data: checks } = await supabase
          .from("checks")
          .select("id, is_up, response_time_ms, checked_at, status_code, error_message")
          .eq("monitor_id", monitor.id)
          .order("checked_at", { ascending: false })
          .limit(6);

        const recentChecks = checks ?? [];
        const latestCheck = recentChecks[0] ?? null;

        // Uptime % (30 days)
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
          ...monitor,
          latest_check: latestCheck,
          uptime_percent_30d: uptimePercent,
          recent_checks: recentChecks.slice(0, 5).map((c) => ({
            response_time_ms: c.response_time_ms,
            checked_at: c.checked_at,
          })),
        } as MonitorWithLatest;
      })
    );

    setMonitors(monitorsWithData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMonitors();
  }, [fetchMonitors]);

  const triggerCheck = async (monitorId: string) => {
    const res = await fetch(`/api/monitors/${monitorId}/check`, {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error ?? "Check failed");
      return;
    }
    toast.success("Check complete");
    fetchMonitors();
  };

  const deleteMonitor = async (monitorId: string) => {
    const res = await fetch(`/api/monitors/${monitorId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete monitor");
      return;
    }
    toast.success("Monitor deleted");
    fetchMonitors();
  };

  return { monitors, loading, fetchMonitors, triggerCheck, deleteMonitor };
}
