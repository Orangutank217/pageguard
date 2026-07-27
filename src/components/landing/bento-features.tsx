"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Animate on scroll (local, lightweight)                            */
/* ------------------------------------------------------------------ */
function BentoAnimateIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          o.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
        transition: `opacity 0.5s ease-out ${delay}ms, transform 0.5s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature data                                                      */
/* ------------------------------------------------------------------ */
interface Feature {
  title: string;
  description: string;
  accent: "red" | "green" | "amber" | "purple";
  icon: React.ReactNode;
  content?: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "Real-time Alerts",
    description:
      "Get instant email notifications when your site goes down. Know about issues before your customers do.",
    accent: "red",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10" aria-hidden="true">
        <rect x="8" y="4" width="24" height="32" rx="4" stroke="#ef4444" strokeWidth="2" fill="none" />
        <rect x="12" y="8" width="6" height="4" rx="1" fill="#ef4444" opacity="0.4" />
        <rect x="22" y="8" width="6" height="4" rx="1" fill="#ef4444" opacity="0.4" />
        <rect x="12" y="16" width="16" height="2" rx="1" fill="#ef4444" opacity="0.6" />
        <rect x="12" y="22" width="12" height="2" rx="1" fill="#ef4444" opacity="0.5" />
        <circle cx="20" cy="30" r="3" fill="#ef4444" />
        <path d="M20 27v3h-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    content: (
      <div className="mt-3 flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          Active alerts
        </span>
        <span className="text-muted-foreground">&lt; 30s response</span>
      </div>
    ),
  },
  {
    title: "Beautiful Status Pages",
    description:
      "Share a public status page with your users. Custom branding, real-time updates, and historical uptime.",
    accent: "green",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10" aria-hidden="true">
        <rect x="4" y="6" width="32" height="28" rx="3" stroke="#22c55e" strokeWidth="2" fill="none" />
        <rect x="8" y="10" width="24" height="4" rx="1" fill="#22c55e" opacity="0.3" />
        <circle cx="12" cy="20" r="4" fill="#22c55e" />
        <path d="M16 26l4 4 8-8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    content: (
      <div className="mt-4 overflow-hidden rounded-lg border border-green-200 bg-green-50/50 p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-green-800">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          All Systems Operational
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-green-700">pguard.com</span>
            <span className="font-medium text-green-600">99.99%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-700">api.pguard.com</span>
            <span className="font-medium text-green-600">99.95%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-700">app.pguard.com</span>
            <span className="font-medium text-green-600">100%</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "1-Minute Check Intervals",
    description:
      "Pro plans check your sites every minute. Free plans check every 5 minutes. Never miss an outage.",
    accent: "amber",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10" aria-hidden="true">
        <circle cx="20" cy="20" r="14" stroke="#f59e0b" strokeWidth="2" fill="none" />
        <circle cx="20" cy="20" r="14" stroke="#f59e0b" strokeWidth="2" strokeDasharray="10 76" strokeDashoffset="-5" fill="none" opacity="0.3" />
        <path d="M20 12v8l6 3" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="3" fill="#f59e0b" />
      </svg>
    ),
    content: (
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-2.5 text-center">
          <div className="font-bold text-amber-700">1 min</div>
          <div className="text-amber-600">Pro</div>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-2.5 text-center">
          <div className="font-bold text-amber-700">5 min</div>
          <div className="text-amber-600">Free</div>
        </div>
      </div>
    ),
  },
  {
    title: "Detailed Analytics",
    description:
      "Track response times, uptime percentages, and check history. Export data anytime for your records.",
    accent: "purple",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10" aria-hidden="true">
        <rect x="4" y="10" width="6" height="20" rx="1.5" fill="#a78bfa" opacity="0.6" />
        <rect x="14" y="6" width="6" height="24" rx="1.5" fill="#a78bfa" />
        <rect x="24" y="14" width="6" height="16" rx="1.5" fill="#a78bfa" opacity="0.6" />
        <rect x="4" y="30" width="28" height="3" rx="1.5" fill="#a78bfa" opacity="0.3" />
        <circle cx="17" cy="10" r="2" fill="#a78bfa" />
        <path d="M15 12l-4 6 6 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      </svg>
    ),
    content: (
      <div className="mt-3">
        {/* Mini sparkline */}
        <div className="flex items-end gap-0.5">
          {[35, 52, 48, 62, 45, 58, 70, 55, 63, 50, 42, 38].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{
                height: `${h * 0.35}px`,
                background: `linear-gradient(to top, #a78bfa${i > 6 ? "80" : "40"}, #c4b5fd${i > 6 ? "60" : "30"})`,
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>12:00</span>
          <span>18:00</span>
          <span>Now</span>
        </div>
      </div>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Accent helpers                                                    */
/* ------------------------------------------------------------------ */
const accentMap: Record<string, { border: string; bg: string; iconBg: string }> = {
  red:    { border: "bento-accent-red",    bg: "bg-gradient-to-br from-red-50/40 to-transparent", iconBg: "bg-red-100" },
  green:  { border: "bento-accent-green",  bg: "bg-gradient-to-br from-green-50/40 to-transparent", iconBg: "bg-green-100" },
  amber:  { border: "bento-accent-amber",  bg: "bg-gradient-to-br from-amber-50/40 to-transparent", iconBg: "bg-amber-100" },
  purple: { border: "bento-accent-purple", bg: "bg-gradient-to-br from-purple-50/40 to-transparent", iconBg: "bg-purple-100" },
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export function BentoFeatures() {
  return (
    <section id="features" className="bg-background px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <BentoAnimateIn>
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
              Features
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to sleep soundly
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
              PageGuard gives you full visibility into your site&apos;s
              availability with minimal setup.
            </p>
          </div>
        </BentoAnimateIn>

        {/* Bento Grid — 4 features: asymmetric 3-col layout */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Alerts — col 1 */}
          <BentoAnimateIn delay={100}>
            <div
              className={`group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${accentMap[features[0].accent].border} ${accentMap[features[0].accent].bg}`}
            >
              <div className="p-6">
                <div className={`mb-4 inline-flex rounded-lg p-2.5 ${accentMap[features[0].accent].iconBg}`}>
                  {features[0].icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {features[0].title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {features[0].description}
                </p>
                {features[0].content}
              </div>
              {/* Decorative corner blob */}
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-[0.06]"
                style={{ background: "radial-gradient(circle, #ef4444, transparent 70%)" }}
              />
            </div>
          </BentoAnimateIn>

          {/* Card 2: Status Pages — col 2-3 (larger) */}
          <BentoAnimateIn delay={150}>
            <div
              className={`group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:col-span-2 ${accentMap[features[1].accent].border} ${accentMap[features[1].accent].bg}`}
            >
              <div className="flex flex-col p-6 sm:flex-row sm:items-start sm:gap-6">
                <div className="shrink-0">
                  <div className={`mb-4 inline-flex rounded-lg p-2.5 ${accentMap[features[1].accent].iconBg}`}>
                    {features[1].icon}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {features[1].title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {features[1].description}
                  </p>
                  {features[1].content}
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-[0.06]"
                style={{ background: "radial-gradient(circle, #22c55e, transparent 70%)" }}
              />
            </div>
          </BentoAnimateIn>

          {/* Card 3: Check Intervals — col 1 */}
          <BentoAnimateIn delay={200}>
            <div
              className={`group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${accentMap[features[2].accent].border} ${accentMap[features[2].accent].bg}`}
            >
              <div className="p-6">
                <div className={`mb-4 inline-flex rounded-lg p-2.5 ${accentMap[features[2].accent].iconBg}`}>
                  {features[2].icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {features[2].title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {features[2].description}
                </p>
                {features[2].content}
              </div>
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-[0.06]"
                style={{ background: "radial-gradient(circle, #f59e0b, transparent 70%)" }}
              />
            </div>
          </BentoAnimateIn>

          {/* Card 4: Analytics — col 2-3 (spans to fill space) */}
          <BentoAnimateIn delay={250}>
            <div
              className={`group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:col-span-2 ${accentMap[features[3].accent].border} ${accentMap[features[3].accent].bg}`}
            >
              <div className="flex flex-col p-6 sm:flex-row sm:items-start sm:gap-6">
                <div className="shrink-0">
                  <div className={`mb-4 inline-flex rounded-lg p-2.5 ${accentMap[features[3].accent].iconBg}`}>
                    {features[3].icon}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {features[3].title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {features[3].description}
                  </p>
                  {features[3].content}
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-[0.06]"
                style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)" }}
              />
            </div>
          </BentoAnimateIn>
        </div>
      </div>
    </section>
  );
}
