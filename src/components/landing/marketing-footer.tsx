import Link from "next/link";
import { PageGuardLogo } from "@/components/shared/pageguard-branding";

export function MarketingFooter() {
  return (
    <footer className="border-t bg-background px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <PageGuardLogo className="text-sm" />
          <span>&copy; {new Date().getFullYear()} PageGuard. All rights reserved.</span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="/refund" className="transition-colors hover:text-foreground">
            Refund
          </Link>
          <Link href="/auth/signin" className="transition-colors hover:text-foreground">
            Sign In
          </Link>
          <Link href="/auth/signup" className="transition-colors hover:text-foreground">
            Sign Up
          </Link>
        </div>
      </div>
    </footer>
  );
}
