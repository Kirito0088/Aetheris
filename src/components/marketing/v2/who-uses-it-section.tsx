"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Building2, Landmark, TowerControl, ShieldCheck } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function WhoUsesItSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !scrollContainerRef.current) return;

    const sections = gsap.utils.toArray(".venue-card");
    const container = scrollContainerRef.current;

    const scrollTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => `+=${container.offsetWidth}`,
      }
    });

    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#111111] text-white">
      <div className="flex h-screen w-full flex-col">
        {/* Header */}
        <div className="flex w-full items-center justify-between p-8 md:px-16 md:pt-16">
          <h2 className="text-3xl font-semibold tracking-tighter text-white md:text-5xl">
            Trusted by the <br /> world's most complex venues.
          </h2>
          <span className="hidden rounded-full border border-white/20 px-4 py-2 text-sm font-medium uppercase tracking-widest text-white md:inline-block">
            Deployment Partners
          </span>
        </div>

        {/* Horizontal Scroll Container */}
        <div ref={scrollContainerRef} className="flex h-full w-[400vw] items-center pb-24 md:pb-0">
          <VenueCard 
            icon={<Landmark className="h-10 w-10 text-white" />}
            title="National Stadiums"
            stats="80,000+ Capacity"
            description="Processing 4M+ data points during peak entry windows to ensure seamless fan ingress."
          />
          <VenueCard 
            icon={<Building2 className="h-10 w-10 text-white" />}
            title="Olympic Parks"
            stats="Multi-Venue Topology"
            description="Coordinating crowd flow across 15+ adjacent venues, transit hubs, and fan zones simultaneously."
          />
          <VenueCard 
            icon={<TowerControl className="h-10 w-10 text-white" />}
            title="Transit Hubs"
            stats="Continuous Flow"
            description="Managing the critical intersection between public transport and venue perimeters."
          />
          <VenueCard 
            icon={<ShieldCheck className="h-10 w-10 text-white" />}
            title="Global Tournaments"
            stats="FIFA World Cup 2026™"
            description="The official intelligence backbone for the largest sporting event in human history."
          />
        </div>
      </div>
    </section>
  );
}

function VenueCard({ icon, title, stats, description }: { icon: React.ReactNode, title: string, stats: string, description: string }) {
  return (
    <div className="venue-card flex w-screen items-center justify-center px-4 md:px-16">
      <div className="flex w-full max-w-4xl flex-col gap-8 md:flex-row md:items-center md:gap-16">
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 md:h-48 md:w-48">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="mb-2 text-sm font-medium uppercase tracking-widest text-gray-500">{stats}</span>
          <h3 className="text-4xl font-semibold tracking-tighter text-white md:text-6xl">{title}</h3>
          <p className="mt-6 max-w-lg text-lg text-gray-400 md:text-xl leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
