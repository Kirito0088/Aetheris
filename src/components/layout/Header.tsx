"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useExperienceDirector, MOTION_TIMINGS, MOTION_EASINGS, playConfirmationSound } from "@/features/experience";

export function Header() {
  const pathname = usePathname();
  const audioEnabled = useExperienceDirector((s) => s.audioEnabled);
  const setAudioEnabled = useExperienceDirector((s) => s.setAudioEnabled);
  
  // Contextual labels based on pathname
  let contextualLabel = "Operational Overview";
  if (pathname.includes("/live")) contextualLabel = "Live Digital Twin";
  if (pathname.includes("/navigation")) contextualLabel = "Intelligent Routing";
  if (pathname.includes("/accessibility")) contextualLabel = "Accessibility Guidance";
  if (pathname.includes("/operations")) contextualLabel = "Venue Control";

  const handleToggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    
    // Play a confirmation tone if unmuting
    if (nextState) {
      // Small timeout to allow state update to apply
      setTimeout(() => {
        playConfirmationSound();
      }, 50);
    }
  };

  return (
    <motion.header 
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: MOTION_TIMINGS.transition / 1000, 
        ease: MOTION_EASINGS.decelerate,
        delay: 0.1
      }}
      className="h-16 flex items-center justify-between px-8 border-b border-[var(--border-subtle)] bg-[var(--surface-base)] shrink-0 z-[var(--z-navigation)]"
    >
      <div className="flex items-center gap-4">
        <span className="text-[var(--font-size-sm)] font-medium text-[var(--text-secondary)]">
          Lusail Stadium
        </span>
        <span className="w-1 h-1 rounded-full bg-[var(--border-default)]" />
        <span className="text-[var(--font-size-sm)] font-medium text-[var(--text-primary)]">
          {contextualLabel}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Audio Toggle Controls */}
        <button
          onClick={handleToggleAudio}
          className="flex items-center justify-center p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--nav-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
          title={audioEnabled ? "Mute Synthesizer" : "Unmute Synthesizer (Muted by default)"}
          aria-label={audioEnabled ? "Mute audio" : "Unmute audio"}
        >
          {audioEnabled ? (
            <Volume2 className="w-4 h-4 text-blue-500" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        <div className="flex items-center gap-2 border-l border-[var(--border-subtle)] pl-4">
          <span className="w-2 h-2 rounded-full bg-[var(--state-success)] animate-pulse" />
          <span className="text-[var(--font-size-xs)] font-medium text-[var(--text-secondary)]">
            Live
          </span>
        </div>
      </div>
    </motion.header>
  );
}

