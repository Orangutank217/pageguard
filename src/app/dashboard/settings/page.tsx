"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, CreditCard, Bell, AlertTriangle, Check } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("profile");

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
      window.history.replaceState({}, "", "/dashboard/settings");
      fetchProfile();
    }

    // Scroll to billing tab if URL has #billing
    if (window.location.hash === "#billing") {
      setActiveTab("billing");
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0071e3]/30 border-t-[#0071e3]" />
      </div>
    );
  }

  const isPro = profile?.plan === "pro";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
          Settings
        </h1>
        <p className="mt-0.5 text-sm text-[#86868b]">
          Manage your account, billing, and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="rounded-2xl border border-[#e5e5ea] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1d1d1f]">Profile Information</h2>
            <p className="mt-1 text-sm text-[#86868b]">Update your name and contact details</p>

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#1d1d1f]">Email</Label>
                <Input
                  id="email"
                  value={profile?.email ?? ""}
                  disabled
                  className="bg-[#f5f5f7] text-[#86868b]"
                />
                <p className="text-xs text-[#86868b]">
                  Email cannot be changed here
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-[#1d1d1f]">Full Name</Label>
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
          </div>

          {/* Danger zone */}
          <div className="mt-6 rounded-2xl border border-[#ff3b30]/20 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[#ff3b30]/10 p-2">
                <AlertTriangle className="h-5 w-5 text-[#ff3b30]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#ff3b30]">Danger Zone</h3>
                <p className="mt-1 text-sm text-[#86868b]">
                  Deleting your account will permanently remove all monitors, checks,
                  incidents, and status pages. This action cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-4"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <div className="rounded-2xl border border-[#e5e5ea] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1d1d1f]">Billing & Plan</h2>
            <p className="mt-1 text-sm text-[#86868b]">
              Manage your subscription and payment details
            </p>

            <div className="mt-6 space-y-4">
              {/* Current plan card */}
              <div className="rounded-xl border border-[#e5e5ea] bg-[#f5f5f7] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[#0071e3]/10 p-2">
                      {isPro ? (
                        <Check className="h-5 w-5 text-[#0071e3]" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-[#0071e3]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1d1d1f]">Current Plan</span>
                        <Badge variant={isPro ? "default" : "secondary"}>
                          {isPro ? "Pro" : "Free"}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-[#86868b]">
                        {isPro
                          ? "You have access to all Pro features."
                          : "Upgrade for unlimited monitors and priority checks."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#e5e5ea]">
                  <Button
                    onClick={handleUpgrade}
                    disabled={upgrading}
                    variant={isPro ? "outline" : "default"}
                    className="w-full"
                  >
                    {upgrading
                      ? "Opening..."
                      : isPro
                      ? "Manage Subscription"
                      : "Upgrade to Pro — $9/mo"}
                  </Button>
                </div>
              </div>

              {/* Pro subscription details */}
              {isPro && (
                <div className="rounded-xl border border-[#e5e5ea] p-5">
                  <h4 className="text-sm font-semibold text-[#1d1d1f] mb-3">Subscription Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#86868b]">Status</span>
                      <p className="mt-0.5 font-medium text-[#1d1d1f]">Active</p>
                    </div>
                    <div>
                      <span className="text-[#86868b]">Price</span>
                      <p className="mt-0.5 font-medium text-[#1d1d1f]">$9/month</p>
                    </div>
                    <div>
                      <span className="text-[#86868b]">Payment method</span>
                      <p className="mt-0.5 font-medium text-[#1d1d1f]">Visa •••• 4242</p>
                    </div>
                    <div>
                      <span className="text-[#86868b]">Next renewal</span>
                      <p className="mt-0.5 font-medium text-[#1d1d1f]">Aug 26, 2026</p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-[#86868b]">
                    Managed by Paddle. View your full invoice history in the{" "}
                    <a
                      href="https://paddle.com/my/transactions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0071e3] hover:underline"
                    >
                      Paddle customer portal
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="rounded-2xl border border-[#e5e5ea] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1d1d1f]">Notification Preferences</h2>
            <p className="mt-1 text-sm text-[#86868b]">
              Configure how you receive alerts
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-[#e5e5ea] p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-[#34c759]/10 p-2 mt-0.5">
                    <Bell className="h-4 w-4 text-[#34c759]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1d1d1f]">Email Alerts</p>
                    <p className="text-sm text-[#86868b]">
                      Receive email when your sites go down or come back up
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">Always on</Badge>
              </div>
              <p className="text-xs text-[#86868b] pl-2">
                Email alerts are always enabled. Configure per-monitor alert emails
                in the monitor settings.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
