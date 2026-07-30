"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { CreateStatusPageModal } from "./create-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, ExternalLink, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { StatusPage } from "@/types/database";

export default function StatusPagesPage() {
  const [pages, setPages] = useState<(StatusPage & { monitor_ids: string[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingPage, setDeletingPage] = useState<StatusPage | null>(null);

  const fetchPages = async () => {
    const res = await fetch("/api/status-pages");
    if (res.ok) {
      const data = await res.json();
      setPages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/status/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  const executeDelete = async () => {
    if (!deletingPage) return;
    const res = await fetch(`/api/status-pages/${deletingPage.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Status page deleted");
      setDeletingPage(null);
      fetchPages();
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-[#e5e5ea]" />
          <div className="mt-1.5 h-4 w-72 animate-pulse rounded-lg bg-[#e5e5ea]" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#e5e5ea] bg-white p-5 shadow-sm">
              <div className="mb-3 h-5 w-3/4 animate-pulse rounded-lg bg-[#e5e5ea]" />
              <div className="mb-2 h-4 w-1/2 animate-pulse rounded-lg bg-[#e5e5ea]" />
              <div className="mb-4 h-8 w-full animate-pulse rounded-lg bg-[#e5e5ea]" />
              <div className="flex gap-2">
                <div className="h-8 flex-1 animate-pulse rounded-lg bg-[#e5e5ea]" />
                <div className="h-8 w-10 animate-pulse rounded-lg bg-[#e5e5ea]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            Status Pages
          </h1>
          <p className="mt-0.5 text-sm text-[#86868b]">
            Create public status pages to share with your customers
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <FileText className="mr-1.5 h-4 w-4" />
          Create Status Page
        </Button>
      </div>

      {pages.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-12 w-12 text-[#86868b]" />}
          title="No status pages yet"
          description="Create a public status page to keep your customers informed about your services."
          actionLabel="Create Status Page"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <div
              key={page.id}
              className="rounded-2xl border border-[#e5e5ea] bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1d1d1f] truncate">
                    {page.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-[#86868b] truncate">
                    /status/{page.slug}
                  </p>
                </div>
                <Badge variant={page.is_public ? "default" : "secondary"} className="shrink-0 ml-2">
                  {page.is_public ? "Public" : "Private"}
                </Badge>
              </div>
              {page.description && (
                <p className="mt-3 text-sm text-[#86868b] line-clamp-2">
                  {page.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs text-[#86868b]">
                <span>{page.monitor_ids?.length ?? 0} monitors linked</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => copyLink(page.slug)}
                >
                  <Copy className="mr-1 h-3 w-3" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(`/status/${page.slug}`, "_blank")
                  }
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => setDeletingPage(page)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateStatusPageModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={fetchPages}
      />

      <Dialog
        open={!!deletingPage}
        onOpenChange={(open) => !open && setDeletingPage(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Status Page</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deletingPage?.title}</strong>? This will also unlink all
              monitors from this status page. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingPage(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={executeDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
