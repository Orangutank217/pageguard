import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimateIn } from "@/components/shared/animate-in";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-primary px-6 py-20 sm:py-28">
      {/* Decorative bento elements */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-primary-foreground/[0.04] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-primary-foreground/[0.04] blur-2xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/[0.02] blur-3xl" />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <AnimateIn>
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Start monitoring in 30 seconds
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Add your first URL, choose your check interval, and we&apos;ll alert
            you if it ever goes down. No credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/signup">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 text-base shadow-lg transition-all hover:shadow-xl"
              >
                Get Started Free
              </Button>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              View pricing
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
