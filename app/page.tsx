import { HeroSection } from "@/components/home/hero-section";
import { MarsicaSection } from "@/components/home/marsica-section";
import { TrustSection } from "@/components/home/trust-section";
import { ProductCategories } from "@/components/home/product-categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { PackagingSection } from "@/components/home/packaging-section";
import { FinalCta } from "@/components/home/final-cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarsicaSection />
      <TrustSection />
      <ProductCategories />
      <HowItWorks />
      <PackagingSection />
      <FinalCta />
    </>
  );
}
