"use client";

import React from "react";
import type { MatchPhase } from "../store/useMatchdayStore";
import { useMatchdayStore } from "../store/useMatchdayStore";
import clsx from "clsx";
import { motion } from "framer-motion";

const PHASES: { id: MatchPhase; label: string }[] = [
  { id: 'before-gates-open', label: 'Closed' },
  { id: 'arrival', label: 'Arrival' },
  { id: 'pre-match', label: 'Pre-Match' },
  { id: 'kickoff', label: 'Kickoff' },
  { id: 'first-half', label: '1st Half' },
  { id: 'half-time', label: 'Half-time' },
  { id: 'second-half', label: '2nd Half' },
  { id: 'full-time', label: 'Full Time' },
  { id: 'exit', label: 'Exit' },
];

export function MatchdayTimeline() {
  const currentPhase = useMatchdayStore((s) => s.currentPhase);
  const setPhase = useMatchdayStore((s) => s.setPhase);

  return (
    <div className="w-full py-4 pb-10 overflow-x-auto scrollbar-hide">
      <div className="flex items-center min-w-max px-8">
        {PHASES.map((phase, index) => {
          const isActive = currentPhase === phase.id;
          const isPast = PHASES.findIndex(p => p.id === currentPhase) > index;
          
          return (
            <div key={phase.id} className="flex items-center">
              {/* Connector line */}
              {index > 0 && (
                <div className={clsx(
                  "h-[2px] w-16 md:w-24 shrink-0 transition-colors duration-500 rounded-full",
                  isPast || isActive ? "bg-brand-blue" : "bg-border-subtle"
                )} />
              )}
              
              {/* Phase Node */}
              <button
                onClick={() => setPhase(phase.id)}
                className="relative flex flex-col items-center gap-2 group outline-none"
              >
                <div className="relative flex items-center justify-center w-5 h-5">
                  <div className={clsx(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300 z-10",
                    isActive ? "bg-brand-blue" : 
                    isPast ? "bg-brand-blue" : "bg-surface-sunken border border-border-strong"
                  )} />
                  {isActive && (
                    <motion.div
                      layoutId="active-timeline-node"
                      className="absolute inset-0 rounded-full border-2 border-brand-blue/30"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </div>
                <span className={clsx(
                  "text-[10px] uppercase tracking-wider font-semibold absolute top-7 whitespace-nowrap transition-colors duration-300",
                  isActive ? "text-brand-blue font-bold" : 
                  isPast ? "text-text-secondary" : "text-text-tertiary group-hover:text-text-secondary"
                )}>
                  {phase.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
