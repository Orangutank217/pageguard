import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageGuardLogo } from "@/components/shared/pageguard-branding";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-white px-6 pb-20 pt-8 sm:pb-32 sm:pt-12">
      {/* Nav */}
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <PageGuardLogo className="text-lg" />
        <div className="flex items-center gap-4">
          <Link
            href="/auth/signin"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">Get Started Free</Button>
          </Link>
        </div>
      </div>

      {/* Hero Content */}
      <div className="mx-auto mt-20 max-w-4xl text-center sm:mt-28">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Know when your site goes down.
          <br />
          <span className="text-primary">Before your customers do.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
          Simple uptime monitoring with beautiful status pages. Free forever for
          1 site.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/auth/signup">
            <Button size="lg" className="px-8 text-base">
              Start Monitoring Free
            </Button>
          </Link>
          <Link
            href="/status/example"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            View example status page &rarr;
          </Link>
        </div>
      </div>

      {/* Dashboard Preview Placeholder */}
      <div className="mx-auto mt-16 max-w-5xl rounded-xl border border-border bg-white p-2 shadow-lg shadow-primary/5 sm:p-4">
        <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
              <span className="h-2 w-2 rounded-full bg-success" />
              All systems operational
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Dashboard preview — 3 monitors, 99.8% uptime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
