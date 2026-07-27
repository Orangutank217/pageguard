"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimateIn } from "@/components/shared/animate-in";

const plans = [
  {
    name: "Free",
    monthlyPrice: "$0",
    annualPrice: "$0",
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
    monthlyPrice: "$9",
    annualPrice: "$7",
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

const comparisonRows = [
  { label: "Monitors", free: "1", pro: "Unlimited" },
  { label: "Check interval", free: "5 minutes", pro: "1 minute" },
  { label: "Email alerts", free: true, pro: true },
  { label: "Status pages", free: "1", pro: "Unlimited" },
  { label: "PageGuard branding", free: true, pro: false },
  { label: "Custom domain", free: "\u2014", pro: "Coming soon" },
  { label: "Checks stored per monitor", free: "50", pro: "1,000" },
  { label: "Historical data", free: "7 days", pro: "90 days" },
  { label: "Team members", free: "1", pro: "Up to 5" },
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-4 w-4 shrink-0 text-[#34c759]"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#c7c7cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
  );
}

const faqs = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes. You can upgrade from Free to Pro at any time, or downgrade from Pro to Free. When downgrading, your monitors and data remain intact but will be subject to Free plan limits after the current billing period ends.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We use Paddle as our payment processor, which accepts all major credit cards, debit cards, and PayPal. Paddle also handles VAT and sales tax automatically based on your location.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "The Free plan is always available with no time limit. If you upgrade to Pro and change your mind within 30 days, we offer a full money-back guarantee.",
  },
  {
    q: "What happens if I exceed my plan limits?",
    a: "You won't lose any data. If you exceed your plan limits (e.g., add a second monitor on the Free plan), we'll notify you and suggest upgrading to Pro to unlock full access.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. You can cancel your Pro subscription from the dashboard settings at any time. You'll continue to have Pro access until the end of your current billing period.",
  },
  {
    q: "Do you offer custom plans for larger teams?",
    a: "We're working on team plans with additional seats, longer data retention, and priority support. Contact us at support@pguard.co if you need something beyond the current Pro plan.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      {/* ─────────────── Hero ─────────────── */}
      <section className="relative overflow-hidden bg-[#f5f5f7] px-6 pb-20 pt-16 sm:pb-28 sm:pt-20">
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(#1d1d1f 1px, transparent 1px), linear-gradient(90deg, #1d1d1f 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-6xl text-center">
          <AnimateIn>
            <span className="inline-block rounded-full bg-[#0071e3]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#005bbf] uppercase">
              Pricing
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
              Start free. Upgrade when you need more monitors or faster checks.
              No hidden fees, no surprises.
            </p>
          </AnimateIn>

          {/* Stats row */}
          <AnimateIn delay={80}>
            <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-2">
              {[
                { value: "10K+", label: "Checks daily" },
                { value: "99.9%", label: "Avg. uptime" },
                { value: "30 day", label: "Money back" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-[#e5e5ea] bg-white p-3 text-center shadow-sm"
                >
                  <div className="text-sm font-semibold text-[#1d1d1f]">{s.value}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </AnimateIn>

          {/* Billing toggle */}
          <AnimateIn delay={120}>
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className={`text-sm font-medium ${!annual ? "text-[#1d1d1f]" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={annual}
                aria-label="Toggle annual billing"
                onClick={() => setAnnual(!annual)}
                className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ${
                  annual ? "bg-[#0071e3]" : "bg-[#e5e5ea]"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    annual ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${annual ? "text-[#1d1d1f]" : "text-muted-foreground"}`}>
                Annual
              </span>
              {annual && (
                <span className="rounded-full bg-[#34c759]/10 px-2.5 py-0.5 text-xs font-semibold text-[#34c759]">
                  Save 20%
                </span>
              )}
            </div>
          </AnimateIn>

          {/* Plan cards */}
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            {plans.map((plan, i) => (
              <AnimateIn key={plan.name} delay={200 + 100 * i}>
                <div
                  className={`relative rounded-2xl border p-6 text-left transition-all duration-200 ${
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
                      {annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {annual ? "/mo, billed annually" : "/month"}
                    </span>
                  </div>
                  {annual && plan.annualPrice !== "$0" && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      ${parseInt(plan.annualPrice) * 12}/year
                    </p>
                  )}
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
        </div>
      </section>

      {/* ─────────────── Feature comparison table ─────────────── */}
      <section className="bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <AnimateIn>
            <div className="text-center">
              <span className="inline-block rounded-full bg-[#0071e3]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#005bbf] uppercase">
                Comparison
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">
                Compare plans side by side
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
                Everything you need to know before choosing your plan.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div className="mt-12 overflow-hidden rounded-2xl border border-[#e5e5ea] bg-white shadow-sm">
              {/* Header */}
              <div className="grid grid-cols-3 gap-0 border-b border-[#e5e5ea] bg-[#f5f5f7]">
                <div className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Feature
                </div>
                <div className="px-6 py-4 text-center text-sm font-semibold text-[#1d1d1f]">
                  Free
                </div>
                <div className="px-6 py-4 text-center text-sm font-semibold text-[#005bbf]">
                  Pro
                </div>
              </div>
              {/* Rows */}
              {comparisonRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-3 gap-0 transition-colors hover:bg-[#f5f5f7] ${
                    i < comparisonRows.length - 1 ? "border-b border-[#e5e5ea]" : ""
                  }`}
                >
                  <div className="px-6 py-4 text-left text-sm font-medium text-[#1d1d1f]">
                    {row.label}
                  </div>
                  <div className="flex items-center justify-center px-6 py-4 text-sm text-muted-foreground">
                    {row.free === true ? <CheckIcon /> : row.free === false ? <MinusIcon /> : row.free}
                  </div>
                  <div className="flex items-center justify-center px-6 py-4 text-sm font-medium text-[#1d1d1f]">
                    {row.pro === true ? <CheckIcon /> : row.pro === false ? <MinusIcon /> : row.pro}
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─────────────── FAQ ─────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <AnimateIn>
            <div className="text-center">
              <span className="inline-block rounded-full bg-[#0071e3]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#005bbf] uppercase">
                FAQ
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
                Everything you need to know about our pricing and billing.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div className="mt-12 space-y-2">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group overflow-hidden rounded-xl border border-[#e5e5ea] bg-white shadow-sm transition-all duration-200"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-[#1d1d1f]">
                    <span>{faq.q}</span>
                    <svg
                      className="ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="border-t border-[#e5e5ea] px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─────────────── CTA ─────────────── */}
      <section className="bg-white px-6 py-20 sm:py-28">
        <AnimateIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">
              Start monitoring in 30 seconds
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Add your first URL, choose your check interval, and we&apos;ll alert
              you if it ever goes down.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="px-8 text-base shadow-sm"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-[#1d1d1f]"
              >
                Learn more about features
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </AnimateIn>
      </section>
    </>
  );
}
