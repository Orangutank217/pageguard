import { AnimateIn } from "@/components/shared/animate-in";

const features = [
  {
    title: "Real-time Alerts",
    description:
      "Get instant email notifications when your site goes down. Know about issues before your customers do.",
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        className="h-10 w-10"
        aria-hidden="true"
      >
        <rect x="8" y="4" width="24" height="32" rx="4" stroke="#3b82f6" strokeWidth="2" fill="none" />
        <rect x="12" y="8" width="6" height="4" rx="1" fill="#3b82f6" opacity="0.4" />
        <rect x="22" y="8" width="6" height="4" rx="1" fill="#3b82f6" opacity="0.4" />
        <rect x="12" y="16" width="16" height="2" rx="1" fill="#3b82f6" opacity="0.6" />
        <rect x="12" y="22" width="12" height="2" rx="1" fill="#3b82f6" opacity="0.5" />
        <circle cx="20" cy="30" r="3" fill="#ef4444" />
        <path d="M20 27v3h-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Beautiful Status Pages",
    description:
      "Share a public status page with your users. Custom branding, real-time updates, and historical uptime.",
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        className="h-10 w-10"
        aria-hidden="true"
      >
        <rect x="4" y="6" width="32" height="28" rx="3" stroke="#22c55e" strokeWidth="2" fill="none" />
        <rect x="8" y="10" width="24" height="4" rx="1" fill="#22c55e" opacity="0.3" />
        <circle cx="12" cy="20" r="4" fill="#22c55e" />
        <path d="M16 26l4 4 8-8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "1-Minute Check Intervals",
    description:
      "Pro plans check your sites every minute. Free plans check every 5 minutes. Never miss an outage.",
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        className="h-10 w-10"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="14" stroke="#f59e0b" strokeWidth="2" fill="none" />
        <circle cx="20" cy="20" r="14" stroke="#f59e0b" strokeWidth="2" strokeDasharray="10 76" strokeDashoffset="-5" fill="none" opacity="0.3" />
        <path d="M20 12v8l6 3" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="3" fill="#f59e0b" />
      </svg>
    ),
  },
  {
    title: "Detailed Analytics",
    description:
      "Track response times, uptime percentages, and check history. Export data anytime for your records.",
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        className="h-10 w-10"
        aria-hidden="true"
      >
        <rect x="4" y="10" width="6" height="20" rx="1.5" fill="#a78bfa" opacity="0.6" />
        <rect x="14" y="6" width="6" height="24" rx="1.5" fill="#a78bfa" />
        <rect x="24" y="14" width="6" height="16" rx="1.5" fill="#a78bfa" opacity="0.6" />
        <rect x="4" y="30" width="28" height="3" rx="1.5" fill="#a78bfa" opacity="0.3" />
        <circle cx="17" cy="10" r="2" fill="#a78bfa" />
        <path d="M15 12l-4 6 6 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      </svg>
    ),
  },
];

export function FeaturesGrid() {
  return (
    <section
      id="features"
      className="bg-background px-6 py-20 sm:py-28"
    >
      <AnimateIn>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to sleep soundly
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-foreground">
            PageGuard gives you full visibility into your site&apos;s
            availability with minimal setup.
          </p>
        </div>
      </AnimateIn>

      <div className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <AnimateIn key={feature.title} delay={100 * (i + 1)}>
            <div className="group rounded-xl border border-border bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
              <div className="mb-4 transition-colors duration-200 group-hover:scale-110 group-hover:opacity-90">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
