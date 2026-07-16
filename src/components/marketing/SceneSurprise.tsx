"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import Image from "next/image";
import { useLandingMotion } from "@/components/marketing/LandingDirector";

/*
  Scene 3: THE SURPRISE (The Wiper)
  Goal: Reveal the invisible intelligence layer over raw human emotion.
  Emotion: Wonder, insight.
  Visual Focus: Crowd movement covered by the digital layer.
  Motion Language: Glass blade wiping across the screen, revealing data.
  Transition: The entire scene slides up/fades out as Telemetry takes over.
  Memory Hook: "The impossible became visible."
*/

export function SceneSurprise() {
  const { scrollYProgress } = useLandingMotion();

  // Progress Phase: 0.35 to 0.60
  // Enter: 0.35 - 0.40
  // Wiper Sweep: 0.40 - 0.55
  // Exit: 0.55 - 0.60

  const sceneOpacity = useTransform(scrollYProgress, [0.35, 0.40, 0.55, 0.60], [0, 1, 1, 0]);
  const sceneY = useTransform(scrollYProgress, [0.35, 0.40, 0.55, 0.60], ["10%", "0%", "0%", "-10%"]);

  // The wiper moves from 0% to 100% left
  const wiperLeft = useTransform(scrollYProgress, [0.40, 0.55], ["0%", "100%"]);
  // The digital layer clip path follows the wiper
  const digitalClip = useTransform(scrollYProgress, [0.40, 0.55], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);

  // Text Parallax inside the digital view
  const text1Y = useTransform(scrollYProgress, [0.42, 0.48], [50, 0]);
  const text1Opacity = useTransform(scrollYProgress, [0.42, 0.48, 0.52, 0.55], [0, 1, 1, 0]);

  const text2Y = useTransform(scrollYProgress, [0.48, 0.54], [50, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.48, 0.54, 0.55, 0.60], [0, 1, 1, 0]);

  return (
    <motion.div 
      className="absolute inset-0 z-30 w-full h-full pointer-events-none bg-[var(--surface-base)]"
      style={{ opacity: sceneOpacity, y: sceneY }}
    >
      {/* Base Layer: Humanity (Left side concept, but fills screen initially) */}
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src="/images/fans.jpg" 
          alt="Fans cheering in the stadium"
          fill
          className="object-cover object-center grayscale opacity-80 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-[var(--surface-base)]/20" />
      </div>

      {/* Reveal Layer: Technology/Data (Revealed by wiper) */}
      <motion.div 
        className="absolute inset-0 w-full h-full bg-[var(--surface-base)]"
        style={{ clipPath: digitalClip }}
      >
        <div className="absolute inset-0 opacity-30" 
             style={{ 
               backgroundImage: 'radial-gradient(var(--brand-blue) 1px, transparent 1px)',
               backgroundSize: '32px 32px'
             }} 
        />
        {/* Glowing Nodes Visualization */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw]">
           <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[var(--brand-blue)] rounded-full blur-[60px] opacity-60" />
           <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-[var(--brand-emerald)] rounded-full blur-[80px] opacity-50" />
           
           {/* UI Elements */}
           <div className="absolute top-1/3 right-1/3 bg-white/90 p-3 rounded-lg border border-black/10 text-xs font-mono">
             NODE_72 ACTIVE
           </div>
        </div>
        
        {/* Parallax Typography inside the digital layer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div style={{ y: text1Y, opacity: text1Opacity }} className="absolute text-center">
             <h2 className="text-4xl md:text-6xl lg:text-8xl font-serif text-[var(--text-primary)]">
               We see the <span className="italic text-[var(--brand-blue)]">unseen.</span>
             </h2>
          </motion.div>
          <motion.div style={{ y: text2Y, opacity: text2Opacity }} className="absolute text-center mt-32 md:mt-48">
             <p className="text-xl md:text-2xl font-sans text-[var(--text-secondary)]">
               Transforming chaos into calculated precision.
             </p>
          </motion.div>
        </div>
      </motion.div>

      {/* The Wiper Blade (Apple-style vertical glass blade) */}
      <motion.div 
        className="absolute top-0 bottom-0 w-4 md:w-8 bg-white/40 backdrop-blur-3xl border-x border-white/60 shadow-[0_0_40px_rgba(255,255,255,0.8)] z-40 -ml-2 md:-ml-4"
        style={{ left: wiperLeft }}
      >
        {/* Glowing edge indicator */}
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--brand-blue)] to-transparent opacity-50" />
      </motion.div>

    </motion.div>
  );
}
