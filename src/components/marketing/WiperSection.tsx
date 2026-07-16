"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

export function WiperSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wiperRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!containerRef.current || !wiperRef.current || !rightContentRef.current || !leftContentRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
        }
      });

      // The wiper starts at the left (0%) and moves to the right (100%)
      // revealing the right side (digital view) over the left side (human view)
      tl.to(wiperRef.current, {
        left: "100%",
        ease: "none",
      }, 0);

      // The right content (digital overlay) is clipped initially and revealed
      tl.to(rightContentRef.current, {
        clipPath: "inset(0 0% 0 0)",
        ease: "none",
      }, 0);

      // Parallax effect on the text
      tl.fromTo(".wiper-text-1", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 0.1);
      tl.to(".wiper-text-1", { y: -50, opacity: 0, duration: 0.2 }, 0.4);
      
      tl.fromTo(".wiper-text-2", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 0.6);
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-[var(--surface-base)] overflow-hidden">
      
      {/* Base Layer: Humanity (Left side concept, but fills screen initially) */}
      <div ref={leftContentRef} className="absolute inset-0 w-full h-full">
        <Image 
          src="/images/fans.jpg" // We need a placeholder for fans
          alt="Fans cheering in the stadium"
          fill
          className="object-cover object-center grayscale opacity-80 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-[var(--surface-base)]/20" />
      </div>

      {/* Reveal Layer: Technology/Data (Revealed by wiper) */}
      <div 
        ref={rightContentRef} 
        className="absolute inset-0 w-full h-full bg-[var(--surface-base)]"
        style={{ clipPath: "inset(0 100% 0 0)" }}
      >
        <div className="absolute inset-0 opacity-30" 
             style={{ 
               backgroundImage: 'radial-gradient(var(--brand-blue) 1px, transparent 1px)',
               backgroundSize: '32px 32px'
             }} 
        />
        {/* Glowing Nodes Visualization */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw]">
           <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[var(--brand-blue)] rounded-full blur-[60px] opacity-60" />
           <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-[var(--brand-emerald)] rounded-full blur-[80px] opacity-50" />
           
           {/* UI Elements */}
           <div className="absolute top-1/3 right-1/3 bg-white/90 p-3 rounded-lg border border-black/10 text-xs font-mono">
             NODE_72 ACTIVE
           </div>
        </div>
      </div>

      {/* The Wiper Blade (Apple-style vertical glass blade) */}
      <div 
        ref={wiperRef}
        className="absolute top-0 bottom-0 w-4 md:w-8 bg-white/40 backdrop-blur-3xl border-x border-white/60 shadow-[0_0_40px_rgba(255,255,255,0.8)] z-20 -ml-2 md:-ml-4"
        style={{ left: "0%" }}
      >
        {/* Glowing edge indicator */}
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--brand-blue)] to-transparent opacity-50" />
      </div>

      {/* Floating Copy */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center text-center px-6">
        <h2 className="wiper-text-1 text-4xl md:text-6xl font-serif font-medium text-[var(--text-primary)] max-w-3xl absolute">
          In the chaos of 80,000 voices...
        </h2>
        <h2 className="wiper-text-2 text-4xl md:text-6xl font-sans font-semibold tracking-tight text-[var(--text-primary)] max-w-3xl absolute opacity-0">
          Clarity emerges instantly.
        </h2>
      </div>
    </section>
  );
}
