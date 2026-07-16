"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { formatNumber } from "@/utils/format";

export function TelemetryGrid() {
  const [flowRate, setFlowRate] = useState(124350);
  const [incidents] = useState(3);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowRate(prev => prev + Math.floor(Math.random() * 100));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-[var(--surface-base)] flex flex-col items-center justify-center px-6 py-24 border-t border-[var(--border-default)]">
      
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-0 border-l border-[var(--border-default)]">
        
        {/* Editorial Heading Column */}
        <div className="md:col-span-5 p-8 md:p-12 border-r border-b border-[var(--border-default)]">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight text-[var(--text-primary)] mb-6">
            Scale requires <br/><span className="italic">absolute precision.</span>
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-sm">
            Across 16 host cities and 104 matches, Aetheris processes over 4 billion spatial data points per hour. It doesn't just monitor—it orchestrates.
          </p>
        </div>

        {/* Telemetry Cells */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 border-b border-[var(--border-default)]">
          
          {/* Global Flow Rate */}
          <div className="p-8 border-r border-b sm:border-b-0 border-[var(--border-default)] flex flex-col justify-between">
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
          <div className="p-8 border-r border-[var(--border-default)] flex flex-col justify-between bg-white/40">
            <div className="flex items-center justify-between mb-12">
              <span className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider">Metric // 02</span>
              <div className="w-2 h-2 bg-[var(--brand-blue)] rounded-full" />
            </div>
            <div>
              <div className="text-xs font-mono text-[var(--text-secondary)] uppercase mb-2">Active Predictions</div>
              <div className="text-4xl md:text-5xl font-mono text-[var(--text-primary)] font-medium tracking-tight">
                0{incidents}
              </div>
            </div>
          </div>
        </div>

        {/* Wide Bottom Cell */}
        <div className="md:col-span-12 p-8 md:p-12 border-r border-b border-[var(--border-default)] bg-[var(--surface-elevated)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="text-xs font-mono text-[var(--brand-blue)] uppercase tracking-widest mb-3">Live Intervention</div>
              <h3 className="text-2xl md:text-3xl font-sans font-semibold text-[var(--text-primary)]">
                Congestion detected at Estadio Azteca, Gate 4.
              </h3>
              <p className="text-[var(--text-secondary)] mt-2">
                Automated VIP rerouting via concourse B initiated. Crowd density normalized in 4m 12s.
              </p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full border border-[var(--border-default)] text-sm font-medium hover:bg-[var(--surface-base)] transition-colors whitespace-nowrap"
            >
              View Incident Report
            </motion.button>
          </div>
        </div>

      </div>
    </section>
  );
}
