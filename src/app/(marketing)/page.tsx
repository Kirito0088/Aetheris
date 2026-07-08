import React from "react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageTransition } from "@/components/ui/PageTransition";
import { ArrowRight } from "lucide-react";

export default function MarketingPage() {
  return (
    <PageTransition className="min-h-screen flex flex-col justify-center bg-[var(--surface-base)]">
      <main className="max-w-5xl mx-auto px-6 w-full flex flex-col gap-12 sm:gap-16">
        
        {/* Step 1: Aetheris */}
        <FadeIn delay={0.2} duration={0.8}>
          <h1 className="text-[var(--font-size-5xl)] sm:text-[var(--font-size-6xl)] font-bold tracking-tighter text-[var(--text-primary)]">
            Aetheris
          </h1>
        </FadeIn>

        {/* Step 2: AI-powered Spatial Intelligence */}
        <FadeIn delay={1.0} duration={0.8}>
          <h2 className="text-[var(--font-size-2xl)] sm:text-[var(--font-size-3xl)] font-medium tracking-tight text-[var(--text-secondary)]">
            AI-powered Spatial Intelligence
          </h2>
        </FadeIn>

        {/* Step 3: Living Digital Twin */}
        <FadeIn delay={1.8} duration={0.8}>
          <div className="flex flex-col gap-2 border-l-2 border-[var(--nav-active)] pl-6 py-2">
            <h3 className="text-[var(--font-size-xl)] font-medium text-[var(--text-primary)]">
              Living Digital Twin
            </h3>
            <p className="text-[var(--text-tertiary)] max-w-lg">
              Interact with a living, intelligent environment. Calm, precise, and spatially aware.
            </p>
          </div>
        </FadeIn>

        {/* Step 4: FIFA World Cup Stadium Operations */}
        <FadeIn delay={2.6} duration={0.8}>
          <p className="text-[var(--font-size-lg)] text-[var(--text-secondary)] font-medium tracking-wide uppercase text-sm">
            FIFA World Cup 2026 • Stadium Operations
          </p>
        </FadeIn>

        {/* Call to action */}
        <FadeIn delay={3.4} duration={0.8} className="pt-8">
          <Link
            href="/live"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--surface-inverse)] text-[var(--text-inverse)] font-medium rounded-[var(--radius-full)] hover:bg-white transition-colors duration-[var(--duration-fast)]"
          >
            Enter Platform
            <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeIn>

      </main>
    </PageTransition>
  );
}
