import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimateIn } from "@/components/shared/animate-in";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for monitoring a personal project or blog.",
    features: [
      "1 monitor",
      "5-minute check interval",
      "Email alerts",
      "1 status page",
      "PageGuard branding",
    ],
    cta: "Get Started Free",
    href: "/auth/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "$9",
    description: "For teams and businesses that need reliable monitoring.",
    features: [
      "Unlimited monitors",
      "1-minute check interval",
      "Email alerts",
      "Unlimited status pages",
      "No PageGuard branding",
    ],
    cta: "Upgrade to Pro",
    href: "/auth/signup",
    featured: true,
  },
];

export function PricingTable() {
  return (
    <section className="bg-muted/30 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <AnimateIn>
          <div className="text-center">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
              Pricing
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
              Start free. Upgrade when you need more monitors or faster checks.
            </p>
          </div>
        </AnimateIn>

        {/* Stats row */}
        <AnimateIn delay={80}>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3">
            {[
              { label: "Free plan", value: "Always" },
              { label: "Pro starting at", value: "$9/mo" },
              { label: "Money-back", value: "30 days" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/60 bg-white/50 p-3 text-center transition-all duration-200 hover:border-border hover:bg-white hover:shadow-sm"
              >
                <div className="text-sm font-semibold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimateIn>

        <div className="mt-8 grid gap-8 sm:mx-auto sm:max-w-3xl sm:grid-cols-2">
          {plans.map((plan, i) => (
            <AnimateIn key={plan.name} delay={150 + 100 * i}>
              <div
                className={`group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 ${
                  plan.featured
                    ? "bento-accent-blue border-primary/20 bg-white shadow-lg shadow-primary/5 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
                    : "bento-accent-teal border-border bg-white hover:-translate-y-1 hover:border-border/80 hover:shadow-lg"
                }`}
              >
                {/* Decorative corner */}
                <div
                  className="pointer-events-none absolute -top-10 -right-10 h-20 w-20 rounded-full opacity-[0.04]"
                  style={{
                    background: `radial-gradient(circle, ${plan.featured ? "#3b82f6" : "#14b8a6"}, transparent 70%)`,
                  }}
                />

                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-blue-400 px-3 py-0.5 text-xs font-medium text-primary-foreground shadow-sm">
                    Popular
                  </span>
                )}

                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-success"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="mt-6 block">
                  <Button
                    className="w-full transition-all group-hover:shadow-md"
                    variant={plan.featured ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Link to full pricing page */}
        <AnimateIn delay={400}>
          <div className="mt-10 text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              View full pricing details
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
