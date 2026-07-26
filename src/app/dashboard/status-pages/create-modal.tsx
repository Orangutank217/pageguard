"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
interface MonitorOption {
  id: string;
  name: string;
}

interface CreateStatusPageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateStatusPageModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateStatusPageModalProps) {
  const [monitors, setMonitors] = useState<MonitorOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMonitors, setSelectedMonitors] = useState<string[]>([]);
  const [host, setHost] = useState("pageguard.app");

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  useEffect(() => {
    if (open) {
      const supabase = createClient();
      supabase
        .from("monitors")
        .select("id, name")
        .order("name")
        .then(({ data }) => setMonitors(data ?? []));
    }
  }, [open]);

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/status-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        description: description || undefined,
        monitor_ids: selectedMonitors,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(
        typeof err.error === "string" ? err.error : "Failed to create status page"
      );
      setLoading(false);
      return;
    }

    toast.success("Status page created!");
    setTitle("");
    setSlug("");
    setDescription("");
    setSelectedMonitors([]);
    setLoading(false);
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Status Page</DialogTitle>
          <DialogDescription>
            Share your service status with your customers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="My Service Status"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>{host}/status/</span>
                <Input
                  id="slug"
                  placeholder="my-service"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  pattern="[a-z0-9-]+"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description (optional)</Label>
              <Textarea
                id="desc"
                placeholder="Current status of all our services"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Monitors to Display</Label>
              <div className="max-h-32 space-y-1 overflow-y-auto">
                {monitors.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No monitors yet. Create monitors first.
                  </p>
                )}
                {monitors.map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-2 rounded p-1 text-sm hover:bg-accent/50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMonitors.includes(m.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMonitors([...selectedMonitors, m.id]);
                        } else {
                          setSelectedMonitors(
                            selectedMonitors.filter((id) => id !== m.id)
                          );
                        }
                      }}
                      className="h-4 w-4 rounded border-border text-primary"
                    />
                    {m.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
