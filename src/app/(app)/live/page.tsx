"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { ControlPanel } from "@/features/digital-twin/ui";
import { LoadingExperience, useExperienceDirector, MOTION_TIMINGS, MOTION_EASINGS } from "@/features/experience";

export default function LiveStadiumPage() {
  const expState = useExperienceDirector((s) => s.state);
  const role = useExperienceDirector((s) => s.role);

  // HUD should reveal only after initial system boot & environment reveal is complete (reaches INTERACTIVE)
  const showHUD = expState === 'INTERACTIVE' || expState === 'FOCUS' || expState === 'ROUTE' || expState === 'IDLE';

  return (
    <PageTransition className="w-full h-full relative overflow-hidden bg-transparent">
      {/* Cinematic Boot/Loading Overlay */}
      <LoadingExperience />

      {/* Title block - with progressive typography motion */}
      <AnimatePresence>
        {showHUD && (
          <motion.div 
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: MOTION_TIMINGS.transition / 1000, 
              ease: MOTION_EASINGS.decelerate,
              delay: 0.1
            }}
            className="absolute top-8 left-8 z-[var(--z-content)] pointer-events-none"
          >
            <motion.h1 
              initial={{ letterSpacing: "0.15em" }}
              animate={{ letterSpacing: "0.02em" }}
              transition={{ duration: MOTION_TIMINGS.hero / 1000, ease: MOTION_EASINGS.emphasized }}
              className="text-[var(--font-size-2xl)] font-bold text-[var(--text-primary)] tracking-tight font-sans"
            >
              Live Stadium
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: MOTION_TIMINGS.transition / 1000 }}
              className="text-[var(--text-tertiary)] text-xs mt-0.5"
            >
              {role === 'fan' ? "Interactive Stadium Guide" : "Operations Console"}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HTML Operational Control Panel overlay - materializes with weight & depth */}
      <AnimatePresence>
        {showHUD && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: MOTION_TIMINGS.transition / 1000, 
              ease: MOTION_EASINGS.decelerate,
              delay: 0.2
            }}
            className="absolute top-8 right-8 z-[var(--z-content)] pointer-events-auto"
          >
            <ControlPanel />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Control panel sits in z-10 over the persistent canvas */}
    </PageTransition>
  );
}

