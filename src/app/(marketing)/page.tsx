import { Hero } from "@/components/landing/hero";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { PricingTable } from "@/components/landing/pricing-table";
import { CtaSection } from "@/components/landing/cta-section";
import { PageGuardFooter } from "@/components/shared/pageguard-branding";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeaturesGrid />
      <PricingTable />
      <CtaSection />
      <footer className="bg-background px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PageGuard. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/auth/signin" className="hover:text-foreground">
              Sign In
            </Link>
            <Link href="/auth/signup" className="hover:text-foreground">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
