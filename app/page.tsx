import Image from "next/image";
import Link from "next/link";
import { HeroSection } from "@/components/home/hero-section";
import { TrustSection } from "@/components/home/trust-section";
import { ProductCategories } from "@/components/home/product-categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { PackagingSection } from "@/components/home/packaging-section";
import { TerritorySection } from "@/components/home/territory-section";
import { FinalCta } from "@/components/home/final-cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <ProductCategories />
      <HowItWorks />
      <PackagingSection />
      <TerritorySection />
      <FinalCta />
    </>
  );
}
