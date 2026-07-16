"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { formatNumber } from "@/utils/format";

export function TelemetryTicker() {
  const [flowRate, setFlowRate] = useState(4200);

  // Simulate live data
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowRate((prev) => prev + Math.floor(Math.random() * 50) - 10);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-24 right-6 md:right-12 lg:right-24 z-20 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-1.5 h-1.5 rounded-full bg-[var(--brand-emerald)]"
        />
        <span className="text-xs font-mono font-medium text-[var(--text-primary)] uppercase tracking-wider">
          LIVE
        </span>
      </div>
      <div className="h-4 w-[1px] bg-black/10" />
      <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">
        Venue 04 Flow Rate: +{formatNumber(flowRate)}/hr
      </span>
    </div>
  );
}
