import Link from "next/link";

export function PageGuardLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-semibold ${className ?? ""}`}>
      <ShieldIcon className="h-5 w-5 text-primary" />
      <span>PageGuard</span>
    </Link>
  );
}

export function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function PageGuardFooter() {
  return (
    <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
      Powered by{" "}
      <Link
        href="https://pageguard.app"
        className="font-medium text-foreground hover:underline"
      >
        PageGuard
      </Link>
    </div>
  );
}
