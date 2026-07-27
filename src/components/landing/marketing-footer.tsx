import Link from "next/link";
import { PageGuardLogo } from "@/components/shared/pageguard-branding";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t bg-background px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="text-foreground"><PageGuardLogo className="text-sm" /></span>
          <span>&copy; {new Date().getFullYear()} PageGuard. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="/refund" className="transition-colors hover:text-foreground">
            Refund
          </Link>
          <a
            href="https://github.com/Orangutank217/pageguard"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            aria-label="PageGuard on GitHub"
          >
            <GitHubIcon className="h-4 w-4" />
          </a>
          <a
            href="https://x.com/pageguard"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            aria-label="PageGuard on X (Twitter)"
          >
            <TwitterIcon className="h-4 w-4" />
          </a>
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
