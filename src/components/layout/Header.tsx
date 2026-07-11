"use client";

import React from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useExperienceDirector, MOTION_TIMINGS, MOTION_EASINGS } from "@/features/experience";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const audioEnabled = useExperienceDirector((s) => s.audioEnabled);
  const setAudioEnabled = useExperienceDirector((s) => s.setAudioEnabled);
  
  return (
    <motion.header 
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: MOTION_TIMINGS.transition / 1000, 
        ease: MOTION_EASINGS.decelerate,
        delay: 0.1
      }}
      className="h-14 flex items-center justify-between px-6 border-b border-border-subtle bg-surface-base/80 backdrop-blur-md shrink-0 z-navigation sticky top-0"
    >
      <div className="flex items-center gap-2 text-[length:var(--font-size-sm)] font-medium">
        <span className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer px-2 py-1 -ml-2 rounded-md hover:bg-surface-sunken">
          Estadio Azteca
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-text-tertiary">
          <path d="m9 18 6-6-6-6"/>
        </svg>
        <span className="text-text-primary px-2 py-1 rounded-md">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-border-subtle bg-surface-elevated shadow-elevation-1 hover:bg-surface-sunken hover:border-border-strong text-text-secondary hover:text-text-primary transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          {audioEnabled ? <Volume2 className="w-[18px] h-[18px] text-brand-blue" /> : <VolumeX className="w-[18px] h-[18px]" />}
        </button>

        <div className="flex items-center gap-2 h-8 px-3 rounded-md bg-state-success/10 border border-state-success/20 text-state-success">
          <span className="w-2 h-2 rounded-full bg-state-success animate-pulse" />
          <span className="text-[length:var(--font-size-xs)] font-semibold tracking-wide uppercase">
            Live
          </span>
        </div>
      </div>
    </motion.header>
  );
}
