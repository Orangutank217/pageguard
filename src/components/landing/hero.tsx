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

      {/* Decorative floating blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-80 w-80 rounded-full bg-blue-400/5 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />

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

        {/* Stats bar — bento style */}
        <AnimateIn delay={500}>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-3">
            {[
              { value: "10K+", label: "Checks daily" },
              { value: "99.9%", label: "Avg. uptime" },
              { value: "30 day", label: "Money back" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border/40 bg-white/50 p-3 text-center backdrop-blur-sm transition-all duration-200 hover:border-border/60 hover:bg-white/80 hover:shadow-sm"
              >
                <div className="text-lg font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
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
