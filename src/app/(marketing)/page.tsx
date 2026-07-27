import { Hero } from "@/components/landing/hero";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { PricingTable } from "@/components/landing/pricing-table";
import { CtaSection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeaturesGrid />
      <PricingTable />
      <CtaSection />
    </>
  );
}
