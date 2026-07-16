"use client";

import React, { useEffect, useState } from "react";
import { motion, useTransform } from "framer-motion";
import { useLandingMotion } from "@/components/marketing/LandingDirector";
import { formatNumber } from "@/utils/format";

/*
  Scene 4: TRUST
  Goal: Showcase global scale and real-time processing capabilities.
  Emotion: Confidence, reliability.
  Visual Focus: Data-dense grid tracking global flow rates.
  Motion Language: Slides up into view as the wiper scene fades out.
  Transition: Fades out as the Operator scene takes focus.
  Memory Hook: "4 billion data points per hour."
*/

export function SceneTrust() {
  const { scrollYProgress } = useLandingMotion();
  const [flowRate, setFlowRate] = useState(124350);
  const [incidents] = useState(3);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowRate(prev => prev + Math.floor(Math.random() * 100));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Progress Phase: 0.55 to 0.75
  const opacity = useTransform(scrollYProgress, [0.55, 0.60, 0.70, 0.75], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.55, 0.60, 0.70, 0.75], ["10%", "0%", "0%", "-10%"]);

  return (
    <motion.div 
      className="absolute inset-0 z-40 w-full h-full flex flex-col items-center justify-center bg-[var(--surface-base)] pointer-events-none"
      style={{ opacity, y }}
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-0 border-l border-[var(--border-default)] pointer-events-auto px-6">
        
        {/* Editorial Heading Column */}
        <div className="md:col-span-5 p-8 md:p-12 border-r border-b border-t md:border-t-0 border-[var(--border-default)] bg-[var(--surface-base)]">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight text-[var(--text-primary)] mb-6">
            Scale requires <br/><span className="italic">absolute precision.</span>
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-sm">
            Across 16 host cities and 104 matches, Aetheris processes over 4 billion spatial data points per hour. It doesn't just monitor—it orchestrates.
          </p>
        </div>

        {/* Telemetry Cells */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 border-b border-t md:border-t-0 border-[var(--border-default)]">
          
          {/* Global Flow Rate */}
          <div className="p-8 border-r border-b sm:border-b-0 border-[var(--border-default)] bg-[var(--surface-base)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-12">
              <span className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider">Metric // 01</span>
              <div className="w-2 h-2 bg-[var(--brand-emerald)] rounded-full animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-mono text-[var(--text-secondary)] uppercase mb-2">Global Flow Rate (Fans/Hr)</div>
              <div className="text-4xl md:text-5xl font-mono text-[var(--text-primary)] font-medium tracking-tight">
                {formatNumber(flowRate)}
              </div>
            </div>
          </div>

          {/* Active Incidents */}
          <div className="p-8 bg-[var(--surface-base)] flex flex-col justify-between border-b sm:border-b-0 border-[var(--border-default)]">
            <div className="flex items-center justify-between mb-12">
              <span className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider">Metric // 02</span>
              <div className="w-2 h-2 bg-[var(--brand-blue)] rounded-full" />
            </div>
            <div>
              <div className="text-xs font-mono text-[var(--text-secondary)] uppercase mb-2">Automated Interventions</div>
              <div className="text-4xl md:text-5xl font-mono text-[var(--text-primary)] font-medium tracking-tight">
                {incidents} <span className="text-lg text-[var(--text-tertiary)] font-sans">Active</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
