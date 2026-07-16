"use client";

import React, { createContext, useContext, useRef } from "react";
import { useScroll } from "framer-motion";
import type { MotionValue } from "framer-motion";

interface LandingMotionContextType {
  scrollYProgress: MotionValue<number>;
}

const LandingMotionContext = createContext<LandingMotionContextType | null>(null);

export function useLandingMotion() {
  const context = useContext(LandingMotionContext);
  if (!context) {
    throw new Error("useLandingMotion must be used within a LandingDirector");
  }
  return context;
}

export function LandingDirector({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Single global choreography timeline (0 to 1 over 600vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <LandingMotionContext.Provider value={{ scrollYProgress }}>
      <div ref={containerRef} className="relative h-[600vh] w-full bg-[var(--surface-base)]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {children}
        </div>
      </div>
    </LandingMotionContext.Provider>
  );
}
