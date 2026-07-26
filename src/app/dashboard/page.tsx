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
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
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
