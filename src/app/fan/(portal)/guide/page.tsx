"use client";

import React from "react";
import { UnifiedStadiumMap } from "@/components/shared/UnifiedStadiumMap";
import { useDatabaseStore } from "@/store/useDatabaseStore";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Map as MapIcon, ArrowRight } from "lucide-react";

export default function GuidePage() {
  const { incidents } = useDatabaseStore();
  
  // Show high-priority incidents as active alerts for the fan
  const activeAlerts = Object.values(incidents).filter(i => i.status !== 'resolved' && i.priority === 'high');

  return (
    <div className="flex flex-col h-full w-full relative bg-surface-base">
      
      {/* Absolute top alerts overlay */}
      <div className="absolute top-4 left-4 right-4 z-30 pointer-events-none flex flex-col gap-2">
        <AnimatePresence>
          {activeAlerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="pointer-events-auto bg-surface-elevated/90 backdrop-blur-xl border border-state-danger/30 p-4 rounded-2xl shadow-elevation-3 flex items-start gap-3 w-full max-w-md mx-auto"
            >
              <div className="mt-0.5">
                <AlertCircle className="w-5 h-5 text-state-danger animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="text-[length:var(--font-size-sm)] font-bold text-text-primary">{alert.title}</h3>
                <p className="text-[length:var(--font-size-xs)] text-text-secondary mt-0.5">{alert.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Map Canvas */}
      <div className="flex-1 w-full relative">
        <UnifiedStadiumMap mode="fan" />
      </div>

      {/* Bottom Sheet / Legend (Overlaying the map) */}
      <div className="absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="bg-surface-elevated/90 backdrop-blur-2xl border border-border-subtle p-5 rounded-3xl shadow-elevation-3"
        >
          <div className="flex items-center gap-2 mb-4">
            <MapIcon className="w-5 h-5 text-brand-blue" />
            <h2 className="text-[length:var(--font-size-base)] font-bold text-text-primary tracking-tight">Interactive Guide</h2>
          </div>
          
          <div className="space-y-3 mb-5">
            <div className="flex items-center justify-between text-[length:var(--font-size-sm)]">
              <span className="text-text-secondary flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--crowd-low)]" /> Low Traffic
              </span>
            </div>
            <div className="flex items-center justify-between text-[length:var(--font-size-sm)]">
              <span className="text-text-secondary flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--crowd-medium)]" /> Moderate
              </span>
            </div>
            <div className="flex items-center justify-between text-[length:var(--font-size-sm)]">
              <span className="text-text-secondary flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--crowd-high)]" /> Busy
              </span>
            </div>
          </div>

          <button className="w-full flex items-center justify-between bg-surface-sunken hover:bg-surface-base border border-border-subtle text-text-primary px-4 py-3 rounded-xl transition-all shadow-elevation-1 group active:scale-95 text-[length:var(--font-size-sm)] font-semibold">
            Find Amenities
            <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-brand-blue transition-colors" />
          </button>
        </motion.div>
      </div>

    </div>
  );
}
