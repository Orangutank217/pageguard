import { MarketingNav } from "@/components/landing/marketing-nav";
import { MarketingFooter } from "@/components/landing/marketing-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingNav />
      <div id="app-content">
        <main className="flex-1">{children}</main>
        <MarketingFooter />
      </div>
    </>
  );
}
