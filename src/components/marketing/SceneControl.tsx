"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import Image from "next/image";
import { useLandingMotion } from "@/components/marketing/LandingDirector";

/*
  Scene 5: CONTROL
  Goal: Ground the platform in human operators.
  Emotion: Focus, empowerment.
  Visual Focus: High contrast operator portrait with decisive flat UI.
  Motion Language: Parallax entry and subtle scale of the portrait.
  Transition: Slides up/fades in as Telemetry exits.
  Memory Hook: "Empowering the people in the room."
*/

export function SceneControl() {
  const { scrollYProgress } = useLandingMotion();

  // Progress Phase: 0.70 to 0.90
  const opacity = useTransform(scrollYProgress, [0.70, 0.75, 0.85, 0.90], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.70, 0.75, 0.85, 0.90], ["10%", "0%", "0%", "-10%"]);
  const portraitScale = useTransform(scrollYProgress, [0.70, 0.85], [0.95, 1.05]);

  return (
    <motion.div 
      className="absolute inset-0 z-50 w-full h-full flex flex-col items-center justify-center bg-[var(--surface-base)] pointer-events-none"
      style={{ opacity, y }}
    >
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center px-6 pointer-events-auto">
        
        {/* Left: Text & UI Fragments */}
        <div className="order-2 lg:order-1 flex flex-col items-start">
          <h2 className="text-4xl md:text-6xl font-sans font-semibold tracking-tight text-[var(--text-primary)] mb-8">
            Empowering the <br/>people in the room.
          </h2>
          
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed mb-12 max-w-lg">
            Aetheris doesn't replace venue operators; it gives them superhuman spatial awareness. Making complex decisions simple, fast, and unerringly accurate.
          </p>

          {/* Floating UI Widget */}
          <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-medium text-[var(--text-tertiary)] uppercase">Action Required</span>
              <span className="w-2 h-2 rounded-full bg-[var(--brand-blue)] animate-pulse" />
            </div>
            <p className="font-medium text-[var(--text-primary)] mb-4">
              Divert East Concourse traffic to Level 2.
            </p>
            <div className="flex gap-3">
              <button className="flex-1 bg-black text-white text-sm font-medium py-2 rounded-lg hover:bg-black/80 transition-colors">Execute</button>
              <button className="flex-1 bg-[var(--surface-base)] text-[var(--text-primary)] text-sm font-medium py-2 rounded-lg border border-black/10 hover:bg-[var(--surface-sunken)] transition-colors">Dismiss</button>
            </div>
          </div>
        </div>

        {/* Right: High Contrast Portrait */}
        <div className="order-1 lg:order-2 relative">
          <motion.div
            style={{ scale: portraitScale }}
            className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-3xl overflow-hidden bg-[var(--surface-sunken)]"
          >
            <Image 
              src="/images/operator.jpg" 
              alt="Venue Operator at command center"
              fill
              className="object-cover grayscale contrast-125 mix-blend-multiply" 
            />
            {/* Subtle overlay to soften */}
            <div className="absolute inset-0 bg-black/5" />
          </motion.div>
          
          {/* Decorative Technical Accents */}
          <div className="absolute -bottom-6 -right-6 text-xs font-mono text-[var(--text-tertiary)] rotate-90 origin-bottom-right">
            OP-ID: 4492 // SECTOR 7G
          </div>
        </div>

      </div>
    </motion.div>
  );
}
