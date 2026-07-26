"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusDot } from "@/components/dashboard/status-dot";
import { UptimeStats } from "@/components/dashboard/uptime-stats";
import { ResponseTimeChart } from "@/components/dashboard/response-time-chart";
import { ChecksTable } from "@/components/dashboard/checks-table";
import { IncidentsTable } from "@/components/dashboard/incidents-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Monitor, Check, Incident } from "@/types/database";

export default function MonitorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [checks, setChecks] = useState<Check[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [uptimeStats, setUptimeStats] = useState<{
    "24h": number | null;
    "7d": number | null;
    "30d": number | null;
  }>({ "24h": null, "7d": null, "30d": null });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const supabase = createClient();

    const { data: mon } = await supabase
      .from("monitors")
      .select("*")
      .eq("id", id)
      .single();
    if (!mon) {
      toast.error("Monitor not found");
      router.push("/dashboard");
      return;
    }
    setMonitor(mon);

    // Checks
    const { data: chk } = await supabase
      .from("checks")
      .select("*")
      .eq("monitor_id", id)
      .order("checked_at", { ascending: false })
      .limit(50);
    setChecks(chk ?? []);

    // Incidents
    const { data: inc } = await supabase
      .from("incidents")
      .select("*")
      .eq("monitor_id", id)
      .order("started_at", { ascending: false });
    setIncidents(inc ?? []);

    // Uptime stats for 3 periods
    const periods: [string, string][] = [
      ["24h", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()],
      ["7d", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()],
      ["30d", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()],
    ];

    const stats: Record<string, number | null> = {};
    for (const [key, since] of periods) {
      const { data: periodChecks } = await supabase
        .from("checks")
        .select("is_up")
        .eq("monitor_id", id)
        .gte("checked_at", since);
      const total = periodChecks?.length ?? 0;
      const up = periodChecks?.filter((c) => c.is_up).length ?? 0;
      stats[key] = total > 0 ? Math.round((up / total) * 1000) / 10 : null;
    }
    setUptimeStats(stats as typeof uptimeStats);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleTestNow = async () => {
    const res = await fetch(`/api/monitors/${id}/check`, { method: "POST" });
    if (!res.ok) {
      toast.error("Check failed");
      return;
    }
    toast.success("Check completed");
    fetchData();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this monitor and all its data?")) return;
    const res = await fetch(`/api/monitors/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Monitor deleted");
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!monitor) return null;

  const latestCheck = checks[0] ?? null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Monitors
        </Button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusDot isUp={latestCheck?.is_up ?? null} className="h-4 w-4" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {monitor.name}
              </h1>
              <p className="text-sm text-muted-foreground">{monitor.url}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleTestNow}>
              <Play className="mr-1 h-4 w-4" />
              Test Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Uptime Stats */}
      <div className="mb-6">
        <UptimeStats
          uptime24h={uptimeStats["24h"]}
          uptime7d={uptimeStats["7d"]}
          uptime30d={uptimeStats["30d"]}
        />
      </div>

      {/* Response Time Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            Response Time (last 20 checks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponseTimeChart checks={checks} />
        </CardContent>
      </Card>

      {/* Tabs: Checks / Incidents */}
      <Tabs defaultValue="checks">
        <TabsList>
          <TabsTrigger value="checks">
            Recent Checks ({checks.length})
          </TabsTrigger>
          <TabsTrigger value="incidents">
            Incidents ({incidents.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="checks" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <ChecksTable checks={checks} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="incidents" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <IncidentsTable incidents={incidents} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
