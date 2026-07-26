"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface AddMonitorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddMonitorModal({
  open,
  onOpenChange,
  onSuccess,
}: AddMonitorModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [intervalMinutes, setIntervalMinutes] = useState("5");
  const [alertEmail, setAlertEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/monitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        url: url.startsWith("http") ? url : `https://${url}`,
        interval_minutes: parseInt(intervalMinutes),
        alert_email: alertEmail || undefined,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(
        typeof err.error === "string" ? err.error : "Failed to create monitor"
      );
      setLoading(false);
      return;
    }

    toast.success("Monitor created!");
    setName("");
    setUrl("");
    setAlertEmail("");
    setLoading(false);
    onOpenChange(false);
    onSuccess();
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Monitor</DialogTitle>
          <DialogDescription>
            Enter the URL you want to monitor. We&apos;ll check it every few
            minutes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="My Website"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                http:// or https:// will be added automatically if missing
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval">Check Interval</Label>
              <Select
                value={intervalMinutes}
                onValueChange={(val) => val && setIntervalMinutes(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every 1 minute (Pro)</SelectItem>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="10">Every 10 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alertEmail">Alert Email (optional)</Label>
              <Input
                id="alertEmail"
                type="email"
                placeholder="alerts@example.com"
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Defaults to your account email if not specified
              </p>
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
              {loading ? "Creating..." : "Create Monitor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
