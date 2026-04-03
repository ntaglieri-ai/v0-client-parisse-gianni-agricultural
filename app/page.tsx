import { HeroSection } from "@/components/home/hero-section";
import { Territory } from "@/components/home/territory";
import { TrustSection } from "@/components/home/trust-section";
import { ProductCategories } from "@/components/home/product-categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { PackagingSection } from "@/components/home/packaging-section";
import { FinalCta } from "@/components/home/final-cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Territory />
      <TrustSection />
      <ProductCategories />
      <HowItWorks />
      <PackagingSection />
      <FinalCta />
    </>
  );
}
