import { AnimateIn } from "@/components/shared/animate-in";

export function Hero() {
  return (
    <section className="animate-gradient relative overflow-hidden bg-gradient-to-b from-primary/20 via-primary/5 to-background px-6 pb-20 pt-16 sm:pb-28 sm:pt-20">
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-6xl text-center">
        <AnimateIn delay={0}>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Know when your site goes down.
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Before your customers do.
            </span>
          </h1>
        </AnimateIn>

        <AnimateIn delay={150}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Simple uptime monitoring with beautiful status pages. Get alerted by
            email the instant your site goes down — no complex setup required.
          </p>
        </AnimateIn>

        <AnimateIn delay={300}>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/auth/signup"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25"
            >
              Start Monitoring Free
            </a>
            <a
              href="#features"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium text-foreground transition-all hover:bg-muted"
            >
              Learn More
            </a>
          </div>
        </AnimateIn>

        <AnimateIn delay={450}>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required &middot; Free plan included
          </p>
        </AnimateIn>

        <AnimateIn delay={600}>
          <div className="relative mx-auto mt-14 max-w-4xl">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/30 via-primary/10 to-blue-400/30 opacity-50 blur-xl" />
            <div className="relative overflow-hidden rounded-xl border border-border/50 bg-white shadow-2xl">
              <img
                src="/dashboard-preview.svg"
                alt="PageGuard dashboard preview showing monitors, status indicators, response time chart, and summary statistics"
                className="w-full"
                loading="eager"
              />
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
