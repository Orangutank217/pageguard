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

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#34c759]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function PricingTable() {
  return (
    <section className="bg-[#f5f5f7] px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <AnimateIn>
          <div className="text-center">
            <span className="inline-block rounded-full bg-[#0071e3]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#005bbf] uppercase">
              Pricing
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
              Start free. Upgrade when you need more monitors or faster checks.
            </p>
          </div>
        </AnimateIn>

        {/* Stats row */}
        <AnimateIn delay={80}>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-2">
            {[
              { label: "Free plan", value: "Always" },
              { label: "Pro starting at", value: "$9/mo" },
              { label: "Money-back", value: "30 days" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[#e5e5ea] bg-white p-3 text-center shadow-sm"
              >
                <div className="text-sm font-semibold text-[#1d1d1f]">{stat.value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimateIn>

        {/* Pricing cards */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          {plans.map((plan, i) => (
            <AnimateIn key={plan.name} delay={150 + 100 * i}>
              <div
                className={`relative rounded-2xl border p-6 transition-all duration-200 ${
                  plan.featured
                    ? "border-[#0071e3]/20 bg-white shadow-md"
                    : "border-[#e5e5ea] bg-white shadow-sm"
                }`}
              >
                {/* Popular badge */}
                {plan.featured && (
                  <span className="absolute -top-2.5 left-6 rounded-full bg-[#0071e3] px-3 py-0.5 text-[11px] font-medium text-white shadow-sm">
                    Popular
                  </span>
                )}

                <h3 className="text-lg font-semibold text-[#1d1d1f]">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-[#1d1d1f]">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{plan.description}</p>

                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-[#1d1d1f]">
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="mt-6 block">
                  <Button
                    className="w-full"
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
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#005bbf] transition-colors hover:text-[#005bbf]"
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
