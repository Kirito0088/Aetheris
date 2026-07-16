import React from "react";
import { FluidNav } from "@/components/marketing/v2/fluid-nav";
import { HeroSection } from "@/components/marketing/v2/hero-section";
import { WhySection } from "@/components/marketing/v2/why-section";
import { WithoutItSection } from "@/components/marketing/v2/without-it-section";
import { HowItWorksSection } from "@/components/marketing/v2/how-it-works-section";
import { ShowMeSection } from "@/components/marketing/v2/show-me-section";
import { WhoUsesItSection } from "@/components/marketing/v2/who-uses-it-section";
import { WhyTrustItSection } from "@/components/marketing/v2/why-trust-it-section";
import { FooterPortal } from "@/components/marketing/v2/footer-portal";

export default function MarketingPage() {
  return (
    <main className="bg-[#FBFBFA] text-[#111111] font-sans antialiased selection:bg-[#004B87]/20 selection:text-[#111111]">
      <FluidNav />
      <HeroSection />
      <WhySection />
      <WithoutItSection />
      <HowItWorksSection />
      <ShowMeSection />
      <WhoUsesItSection />
      <WhyTrustItSection />
      <FooterPortal />
    </main>
  );
}
