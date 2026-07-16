"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import { useLandingMotion } from "@/components/marketing/LandingDirector";

/*
  Scene 2: UNDERSTANDING
  Goal: Introduce the core platform concept (The Living Canvas).
  Emotion: Clarity, revelation.
  Visual Focus: Abstract wireframe arena with live UI floating coordinates.
  Motion Language: Fade-in and slight scale up as Scene 1 blurs out.
  Transition: Exits by scaling massively so the user "flies through" the canvas into the next scene.
  Memory Hook: "Every turnstile fused into a single fabric."
*/

export function SceneUnderstanding() {
  const { scrollYProgress } = useLandingMotion();

  // Progress Phase: 0.15 to 0.40
  // Enters as Scene 1 exits (0.15 - 0.25)
  // Exits by flying through (0.35 - 0.45)
  const opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.45], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.15, 0.35, 0.45], [0.95, 1, 3]);

  return (
    <motion.div 
      className="absolute inset-0 z-20 w-full h-full flex items-center justify-center pointer-events-none"
      style={{ opacity }}
    >
      <motion.div 
        style={{ scale }}
        className="absolute inset-0 w-full h-full flex items-center justify-center"
      >
        {/* Placeholder for Point Cloud / 3D Element */}
        <div className="w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] max-w-4xl max-h-4xl border border-black/5 rounded-full flex items-center justify-center relative">
          <div className="w-[60vw] h-[60vw] md:w-[45vw] md:h-[45vw] max-w-3xl max-h-3xl border border-black/10 rounded-full" />
          <div className="w-[40vw] h-[40vw] md:w-[30vw] md:h-[30vw] max-w-2xl max-h-2xl border border-black/15 rounded-full absolute" />
        </div>
        
        {/* UI Overlays anchored */}
        <div className="absolute top-1/3 left-1/4 bg-white/80 backdrop-blur-md p-4 border border-black/10 rounded-xl shadow-[var(--shadow-elevation-3)]">
          <div className="text-xs font-mono text-[var(--text-secondary)] uppercase">Zone A</div>
          <div className="text-lg font-medium text-[var(--text-primary)]">Capacity: 92%</div>
        </div>
        <div className="absolute bottom-1/3 right-1/4 bg-white/80 backdrop-blur-md p-4 border border-black/10 rounded-xl shadow-[var(--shadow-elevation-3)]">
          <div className="text-xs font-mono text-[var(--text-secondary)] uppercase">Flow Rate</div>
          <div className="text-lg font-medium text-[var(--text-primary)]">+1,240 / min</div>
        </div>
      </motion.div>

      <div className="relative z-30 text-center max-w-4xl px-6">
        <h2 className="text-4xl md:text-7xl font-sans font-semibold tracking-tight text-[var(--text-primary)] mb-6">
          The Living Canvas.
        </h2>
        <p className="text-xl md:text-3xl font-serif text-[var(--text-secondary)] leading-relaxed mx-auto max-w-2xl text-balance">
          Every turnstile, camera, and sensor fused into a single spatial intelligence fabric.
        </p>
      </div>
    </motion.div>
  );
}
