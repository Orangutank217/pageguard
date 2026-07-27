"use client";

import { useState } from "react";
import { useMonitors } from "@/hooks/use-monitors";
import { MonitorCard } from "@/components/dashboard/monitor-card";
import { AddMonitorModal } from "@/components/dashboard/add-monitor-modal";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Plus, Activity } from "lucide-react";

export default function DashboardPage() {
  const { monitors, loading, fetchMonitors, triggerCheck, deleteMonitor } =
    useMonitors();
  const [modalOpen, setModalOpen] = useState(false);

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-4 w-56 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-white p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-3 w-3 animate-pulse rounded-full bg-muted" />
                <div className="h-5 flex-1 animate-pulse rounded bg-muted" />
              </div>
              <div className="mb-4 h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="mt-4 flex gap-2">
                <div className="h-8 flex-1 animate-pulse rounded bg-muted" />
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Monitors</h1>
          <p className="text-sm text-muted-foreground">
            Monitor the uptime of your websites
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Monitor
        </Button>
      </div>

      {monitors.length === 0 ? (
        <EmptyState
          icon={<Activity className="h-12 w-12" />}
          title="No monitors yet"
          description="Add your first URL to start monitoring its uptime. We'll alert you if it ever goes down."
          actionLabel="Add Monitor"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {monitors.map((monitor) => (
            <MonitorCard
              key={monitor.id}
              monitor={monitor}
              onCheck={triggerCheck}
              onDelete={deleteMonitor}
            />
          ))}
        </div>
      )}

      <AddMonitorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={fetchMonitors}
      />
    </div>
  );
}
