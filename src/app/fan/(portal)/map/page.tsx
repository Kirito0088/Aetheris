"use client";

import React from "react";
import { InteractiveStadiumMap } from "@/components/ui/InteractiveStadiumMap";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function MapPage() {
  const { t } = useLanguage();

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto relative min-h-screen flex flex-col">
      {/* Premium ambient glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] md:w-[80%] h-[500px] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Page Header */}
      <div className="mb-6 mt-4 md:mt-0">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-[length:var(--font-size-3xl)] md:text-[length:var(--font-size-4xl)] font-bold text-text-primary tracking-tight">
            {t('liveStadiumMap') || 'Stadium Map'}
          </h1>
        </motion.div>
      </div>

      {/* Map Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.1 }}
        className="flex-1 min-h-[600px] w-full bg-surface-elevated rounded-3xl p-2 md:p-4 shadow-elevation-3 border border-border-subtle"
      >
        <InteractiveStadiumMap />
      </motion.div>
    </div>
  );
}
