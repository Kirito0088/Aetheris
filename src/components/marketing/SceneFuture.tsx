"use client";

import React, { useState } from "react";
import { motion, useTransform, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLandingMotion } from "@/components/marketing/LandingDirector";

/*
  Scene 6: FUTURE
  Goal: Transition seamlessly from marketing to the product experience.
  Emotion: Anticipation, readiness.
  Visual Focus: Minimalist CTA that expands into the application shell.
  Motion Language: Fades in. On click, expands to fill screen.
  Transition: Pushes router seamlessly once the screen is engulfed.
  Memory Hook: "Enter Aetheris."
*/

export function SceneFuture() {
  const router = useRouter();
  const { scrollYProgress } = useLandingMotion();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Progress Phase: 0.85 to 1.0
  const opacity = useTransform(scrollYProgress, [0.85, 0.90], [0, 1]);
  const y = useTransform(scrollYProgress, [0.85, 0.90], ["10%", "0%"]);

  const handleEnterApp = () => {
    setIsTransitioning(true);
    // Lock scroll
    document.body.style.overflow = "hidden";
    
    // After animation expands (e.g. 600ms), route to the app
    setTimeout(() => {
      router.push("/experience");
    }, 600);
  };

  return (
    <>
      <motion.div 
        className="absolute inset-0 z-50 w-full h-full flex flex-col items-center justify-center bg-[var(--surface-base)] pointer-events-none"
        style={{ opacity, y }}
      >
        <div className="text-center max-w-3xl px-6 pointer-events-auto">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight text-[var(--text-primary)] mb-8">
            The Future is <br/><span className="italic text-[var(--text-secondary)]">Operational.</span>
          </h2>
          
          <p className="text-xl md:text-2xl font-sans text-[var(--text-secondary)] mb-12">
            Experience the official AI-powered Stadium Intelligence Platform.
          </p>
          
          <button
            onClick={handleEnterApp}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--brand-blue)] text-white font-medium rounded-full overflow-hidden hover:scale-105 active:scale-95 transition-transform"
          >
            <span className="relative z-10">Enter Aetheris</span>
            <svg className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* The Application Transition Takeover */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ clipPath: "circle(0% at 50% 70%)", opacity: 0 }}
            animate={{ clipPath: "circle(150% at 50% 70%)", opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-[var(--surface-sunken)] flex items-center justify-center"
          >
            {/* Minimal loading indicator for the OS feel */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-8 h-8 rounded-full border-2 border-[var(--brand-blue)] border-t-transparent animate-spin" />
              <div className="text-xs font-mono text-[var(--text-secondary)] tracking-widest uppercase">
                Initializing Aetheris Core
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
