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
        <div className="mb-8">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-[#e5e5ea]" />
          <div className="mt-1.5 h-4 w-64 animate-pulse rounded-lg bg-[#e5e5ea]" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#e5e5ea] bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-3 w-3 animate-pulse rounded-full bg-[#e5e5ea]" />
                <div className="h-5 flex-1 animate-pulse rounded-lg bg-[#e5e5ea]" />
              </div>
              <div className="mb-4 h-4 w-3/4 animate-pulse rounded-lg bg-[#e5e5ea]" />
              <div className="h-4 w-1/2 animate-pulse rounded-lg bg-[#e5e5ea]" />
              <div className="mt-4 flex gap-2">
                <div className="h-8 flex-1 animate-pulse rounded-lg bg-[#e5e5ea]" />
                <div className="h-8 w-16 animate-pulse rounded-lg bg-[#e5e5ea]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            Monitors
          </h1>
          <p className="mt-0.5 text-sm text-[#86868b]">
            Monitor the uptime and performance of your websites
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Monitor
        </Button>
      </div>

      {monitors.length === 0 ? (
        <EmptyState
          icon={<Activity className="h-12 w-12 text-[#86868b]" />}
          title="No monitors yet"
          description="Add your first URL to start monitoring its uptime. We'll alert you if it ever goes down."
          actionLabel="Add Monitor"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
