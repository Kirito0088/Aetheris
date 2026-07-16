"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import Image from "next/image";
import { useLandingMotion } from "@/components/marketing/LandingDirector";
import { TelemetryTicker } from "@/components/marketing/TelemetryTicker";
import { ReticleOverlay } from "@/components/marketing/ReticleOverlay";

/*
  Scene 1: WONDER
  Goal: Establish scale, prestige, and the "live" broadcast nature of Aetheris.
  Emotion: Awe, anticipation.
  Visual Focus: Massive cinematic stadium view with raw data telemetry.
  Motion Language: Slow, inevitable scale-in.
  Transition: Blurs out as the Living Canvas wireframe fades in.
  Memory Hook: "The World is Welcome."
*/

export function SceneWonder() {
  const { scrollYProgress } = useLandingMotion();

  // Progress Phase: 0.0 to 0.20
  const opacity = useTransform(scrollYProgress, [0.15, 0.25], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);
  const filter = useTransform(scrollYProgress, [0, 0.2], ["blur(0px)", "blur(12px)"]);
  const y = useTransform(scrollYProgress, [0, 0.2], ["0%", "-10%"]);

  return (
    <motion.div 
      className="absolute inset-0 z-10 w-full h-full pointer-events-none"
      style={{ opacity }}
    >
      <div className="absolute inset-0 pointer-events-auto">
        <TelemetryTicker />
        <ReticleOverlay />
      </div>

      <motion.div 
        className="absolute inset-0 z-0 origin-center"
        style={{ scale, filter, y }}
      >
        <Image 
          src="/images/stadium-hero.jpg" 
          alt="World-class stadium in morning light"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-[var(--surface-base)]" />
      </motion.div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-24 px-6 md:px-12 lg:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl lg:text-10xl font-serif font-medium tracking-tight text-[var(--text-primary)] leading-[0.9]">
            The World<br />
            <span className="text-[var(--text-secondary)] italic">is Welcome.</span>
          </h1>
        </motion.div>
      </div>
    </motion.div>
  );
}
