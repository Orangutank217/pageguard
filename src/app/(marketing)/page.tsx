import { Hero } from "@/components/landing/hero";
import { BentoFeatures } from "@/components/landing/bento-features";
import { PricingTable } from "@/components/landing/pricing-table";
import { CtaSection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <BentoFeatures />
      <PricingTable />
      <CtaSection />
    </>
  );
}
