import { HeroSection } from "@/components/home/hero-section";
import { TerritorySection } from "@/components/home/territory-section";
import { TrustSection } from "@/components/home/trust-section";
import { ProductCategories } from "@/components/home/product-categories";
import { TraceabilitySection } from "@/components/home/traceability-section";
import { PackagingSection } from "@/components/home/packaging-section";
import { PurchaseSection } from "@/components/home/purchase-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TerritorySection />
      <TrustSection />
      <ProductCategories />
      <TraceabilitySection />
      <PackagingSection />
      <PurchaseSection />
    </>
  );
}
