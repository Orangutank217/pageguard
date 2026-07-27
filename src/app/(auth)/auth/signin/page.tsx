"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageGuardLogo, ShieldIcon } from "@/components/shared/pageguard-branding";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const errorParam = searchParams.get("error");
  const errorDetail = searchParams.get("error_detail");
  const errorCode = searchParams.get("error_code");

  useEffect(() => {
    if (errorParam === "auth_failed") {
      let msg = "Sign-in failed. ";
      if (errorDetail) {
        msg += `Supabase says: ${errorDetail}`;
        if (errorCode) msg += ` (code: ${errorCode})`;
      } else {
        msg += "This usually means your account could not be created. If signing up with Google, please try email signup instead.";
      }
      toast.error(msg, { duration: 10000 });
    } else if (errorParam === "session_missing") {
      toast.error("No session found. Please try signing in again.", { duration: 6000 });
    } else if (errorParam === "no_code") {
      toast.error("No authentication code received. This is likely a Supabase Auth configuration issue.", { duration: 8000 });
    } else if (errorParam) {
      toast.error(`Authentication error: ${errorParam}${errorDetail ? ` - ${errorDetail}` : ""}`, { duration: 6000 });
    }
  }, [errorParam, errorDetail, errorCode]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${appUrl}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="w-full max-w-sm animate-fade-in-up shadow-xl">
      <CardHeader className="text-center">
        <div className="mb-3 flex justify-center">
          <PageGuardLogo />
        </div>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your PageGuard account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <div className="animate-gradient relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-primary/15 via-primary/5 to-background px-4">
      {/* Background decor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none absolute -top-40 -right-40 text-primary/5">
        <ShieldIcon className="h-96 w-96" />
      </div>
      <div className="pointer-events-none absolute -bottom-32 -left-32 text-primary/5 rotate-45">
        <ShieldIcon className="h-64 w-64" />
      </div>

      <Suspense
        fallback={
          <div className="w-full max-w-sm animate-pulse">
            <div className="rounded-xl border border-border bg-white p-8">
              <div className="mx-auto mb-6 h-6 w-32 rounded bg-muted" />
              <div className="mx-auto mb-8 h-4 w-48 rounded bg-muted" />
              <div className="space-y-4">
                <div className="h-10 rounded bg-muted" />
                <div className="h-10 rounded bg-muted" />
                <div className="h-10 rounded bg-muted" />
              </div>
              <div className="my-4 h-px bg-border" />
              <div className="h-10 rounded bg-muted" />
            </div>
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}
