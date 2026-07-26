"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { CreateStatusPageModal } from "./create-modal";
import { FileText, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import type { StatusPage } from "@/types/database";

export default function StatusPagesPage() {
  const [pages, setPages] = useState<(StatusPage & { monitor_ids: string[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

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
          <h1 className="text-2xl font-bold text-foreground">Status Pages</h1>
          <p className="text-sm text-muted-foreground">
            Create public status pages to share with your customers
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Create Status Page
        </Button>
      </div>

      {pages.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-12 w-12" />}
          title="No status pages yet"
          description="Create a public status page to keep your customers informed about your services."
          actionLabel="Create Status Page"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Card key={page.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {page.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      /status/{page.slug}
                    </p>
                  </div>
                  <Badge variant={page.is_public ? "default" : "secondary"}>
                    {page.is_public ? "Public" : "Private"}
                  </Badge>
                </div>
                {page.description && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {page.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{page.monitor_ids?.length ?? 0} monitors linked</span>
                </div>
                <div className="mt-3 flex gap-2">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateStatusPageModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={fetchPages}
      />
    </div>
  );
}
