"use client";

import React from "react";
import { UnifiedStadiumMap } from "@/components/shared/UnifiedStadiumMap";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function MapPage() {
  const { t } = useLanguage();

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto relative min-h-[100dvh] pb-24 flex flex-col font-sans">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[120%] md:w-[80%] h-[500px] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Page Header */}
      <div className="mb-4 mt-2 md:mt-0">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h1
            className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            {t("liveStadiumMap") || "Stadium Map"}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Interactive spatial map of Estadio Azteca with live zone telemetry.
          </p>
        </motion.div>
      </div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.1 }}
        className="flex-1 min-h-[500px] md:min-h-[650px] w-full bg-surface-elevated rounded-3xl p-2 md:p-4 shadow-elevation-3 border border-border-subtle"
      >
        <UnifiedStadiumMap mode="fan" />
      </motion.div>
    </div>
  );
}
