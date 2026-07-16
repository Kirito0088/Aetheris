"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Activity, GitMerge } from "lucide-react";

export function WhySection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section 
      ref={containerRef}
      id="capabilities"
      className="relative w-full bg-white py-32 px-4 md:py-48"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-24 lg:flex-row lg:items-start lg:gap-16">
        
        {/* Left: Editorial Statement */}
        <div className="lg:sticky lg:top-32 lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-balance text-4xl font-semibold tracking-tighter text-[#111111] md:text-5xl lg:text-6xl">
              The invisible infrastructure of crowd safety.
            </h2>
            <p className="mt-6 text-balance text-lg text-gray-500 md:text-xl">
              When 80,000 people gather, instinct isn't enough. Aetheris processes millions of spatial data points per second to predict bottlenecks before they form, transforming chaos into an orchestrated symphony.
            </p>
          </motion.div>
        </div>

        {/* Right: Bento Grid of Capabilities */}
        <div className="lg:w-1/2">
          <motion.div 
            style={{ y }}
            className="flex flex-col gap-6"
          >
            <CapabilityCard
              icon={<Activity className="h-6 w-6 text-[#111111]" />}
              title="Predictive Flow"
              description="Anticipate congestion up to 45 minutes before it occurs using advanced machine learning models trained on millions of crowd movements."
              delay={0.1}
            />
            <CapabilityCard
              icon={<Shield className="h-6 w-6 text-[#111111]" />}
              title="Anomaly Detection"
              description="Instantly flag unusual movement patterns, abandoned objects, or density spikes that deviate from the expected baseline."
              delay={0.2}
            />
            <CapabilityCard
              icon={<GitMerge className="h-6 w-6 text-[#111111]" />}
              title="Dynamic Redirection"
              description="Automatically trigger digital signage updates and staff alerts to smoothly redistribute crowd density across the venue."
              delay={0.3}
            />
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}

function CapabilityCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className="group flex flex-col gap-4 rounded-3xl border border-black/5 bg-[#FAFAFA] p-8 transition-colors hover:bg-black/[0.02]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-[#111111]">{title}</h3>
      <p className="text-base text-gray-500 leading-relaxed">{description}</p>
    </motion.div>
  );
}
