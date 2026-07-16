"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export function HowItWorksSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.2], [100, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef}
      id="scale"
      className="relative h-[300vh] w-full bg-[#111111]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Background Twin Image */}
        <motion.div 
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/digital_twin_overlay.jpg"
            alt="Digital twin architectural wireframe"
            fill
            className="object-cover object-center opacity-70"
          />
          {/* Subtle gradient to blend edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#111111]/80" />
        </motion.div>

        {/* Content Overlay */}
        <motion.div 
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center"
        >
          <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white">
            Architecture
          </span>
          <h2 className="text-balance text-4xl font-semibold tracking-tighter text-white md:text-6xl lg:text-7xl">
            Digital Twin Topology
          </h2>
          <p className="mt-8 max-w-2xl text-balance text-lg text-gray-400 md:text-xl">
            We map your entire operation in 3D. Every turnstile, concourse, and exit is tracked in real-time, overlaying predictive AI onto physical reality.
          </p>

          <div className="mt-16 flex flex-col gap-4 md:flex-row md:gap-8">
            <StatCard value="Sub-50ms" label="Latency" />
            <StatCard value="99.99%" label="Uptime SLA" />
            <StatCard value="2M+" label="Data points / sec" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex w-48 flex-col items-center rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
      <div className="text-3xl font-semibold tracking-tight text-white">{value}</div>
      <div className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-400">{label}</div>
    </div>
  );
}
