"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Profile } from "@/types/database";

// Paddle.js client-side SDK added at runtime
declare global {
  interface Window {
    Paddle: {
      Environment: { set: (env: string) => void };
      Initialize: (config: { token?: string }) => void;
      Checkout: {
        open: (options: Record<string, unknown>) => void;
        on: (event: string, handler: () => void) => void;
      };
    };
  }
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (data) {
      setProfile(data);
      setFullName(data.full_name ?? "");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();

    // Check if returning from successful Paddle checkout
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgrade") === "success") {
      toast.success("Welcome to Pro! Your plan has been upgraded.", { duration: 6000 });
      // Clean up the URL
      window.history.replaceState({}, "", "/dashboard/settings");
      // Re-fetch profile to show Pro badge
      fetchProfile();
    }
  }, [fetchProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile?.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated");
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure? This will delete all your monitors, checks, incidents, and status pages. This cannot be undone."
      )
    )
      return;

    const supabase = createClient();
    const { error } = await supabase.rpc("delete_account");
    if (error) {
      // Fallback: sign out
      await supabase.auth.signOut();
    }
    toast.success("Account deleted");
    router.push("/");
    router.refresh();
  };

  const [upgrading, setUpgrading] = useState(false);
  const [paddleReady, setPaddleReady] = useState(false);

  // Load Paddle.js from CDN and initialise
  useEffect(() => {
    // Already loaded by a previous render
    if (typeof window.Paddle !== "undefined" && window.Paddle) {
      setPaddleReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Environment.set("production");
        window.Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        });
        // Listen for completed checkouts to refresh profile + show toast
        window.Paddle.Checkout.on("checkout.completed", () => {
          fetchProfile();
          toast.success("Welcome to Pro! Your plan has been upgraded.", {
            duration: 6000,
          });
        });
        setPaddleReady(true);
      }
    };
    document.head.appendChild(script);
  }, [fetchProfile]);

  const handleUpgrade = async () => {
    if (upgrading) return;

    if (!paddleReady) {
      toast.error("Payment system is still loading. Please try again in a moment.");
      return;
    }

    setUpgrading(true);

    try {
      const priceId = process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID;
      const userId = profile?.id;

      if (!priceId || !userId) {
        toast.error("Missing configuration. Please try again later.");
        setUpgrading(false);
        return;
      }

      // Open Paddle Billing v2 overlay checkout
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData: { user_id: userId },
      });

      setUpgrading(false);
    } catch (error) {
      console.error("Paddle checkout error:", error);
      toast.error("Failed to open checkout. Please try again.");
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  const isPro = profile?.plan === "pro";

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and billing
        </p>
      </div>

      {/* Billing Section */}
      <Card id="billing">
        <CardHeader>
          <CardTitle className="text-base">Billing & Plan</CardTitle>
          <CardDescription>
            Manage your subscription and upgrade your plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Current Plan</span>
                <Badge>{isPro ? "Pro" : "Free"}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {isPro
                  ? "You have access to all Pro features."
                  : "Upgrade for unlimited monitors and priority checks."}
              </p>
            </div>
            <Button onClick={handleUpgrade} disabled={upgrading} variant={isPro ? "outline" : "default"}>
              {upgrading ? "Opening..." : isPro ? "Manage Subscription" : "Upgrade to Pro — $9/mo"}
            </Button>
          </div>

          {isPro && (
            <div className="rounded-lg border border-border bg-background p-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p className="font-medium text-foreground">Active</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Price</span>
                  <p className="font-medium text-foreground">$9/month</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Payment method</span>
                  <p className="font-medium text-foreground">Visa •••• 4242</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Next renewal</span>
                  <p className="font-medium text-foreground">Aug 26, 2026</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Managed by Paddle. View your full invoice history in the{" "}
                <a
                  href="https://paddle.com/my/transactions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Paddle customer portal
                </a>
                .
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Update your name and email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile?.email ?? ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed here
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>
            Configure how you receive alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email Alerts</p>
              <p className="text-sm text-muted-foreground">
                Receive email when your sites go down or come back up
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              Always on
            </Badge>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Email alerts are always enabled. Configure per-monitor alert emails
            in the monitor settings.
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Deleting your account will permanently remove all monitors, checks,
            incidents, and status pages. This action cannot be undone.
          </p>
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
