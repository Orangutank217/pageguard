import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimateIn } from "@/components/shared/animate-in";

export function CtaSection() {
  return (
    <section className="bg-primary px-6 py-20 sm:py-28">
      <AnimateIn>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Start monitoring in 30 seconds
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Add your first URL, choose your check interval, and we&apos;ll alert
            you if it ever goes down. No credit card required.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 px-8 text-base shadow-lg transition-all hover:shadow-xl"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </AnimateIn>
    </section>
  );
}
