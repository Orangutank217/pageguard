import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      "50 checks stored per monitor",
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
      "Custom domain (coming soon)",
      "1,000 checks stored per monitor",
    ],
    cta: "Upgrade to Pro",
    href: "/auth/signup",
    featured: true,
  },
];

export function PricingTable() {
  return (
    <section className="bg-background px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-foreground">
          Start free. Upgrade when you need more monitors or faster checks.
        </p>
        <div className="mt-12 grid gap-8 sm:mx-auto sm:max-w-3xl sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-6 ${
                plan.featured
                  ? "border-primary/30 bg-white shadow-lg shadow-primary/5 ring-1 ring-primary/10"
                  : "border-border bg-white"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                  Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-foreground">
                {plan.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
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
          ))}
        </div>
      </div>
    </section>
  );
}
