"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { getSmartWayfinding } from "@/app/actions/intelligence";
import { useRealtimeZones } from "@/hooks";

interface SmartWayfindingBannerProps {
  fanSector: string;
  fanGate: string;
}

export function SmartWayfindingBanner({ fanSector, fanGate }: SmartWayfindingBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { zones, loading: zonesLoading, error: zonesError } = useRealtimeZones();
  
  const [recommendation, setRecommendation] = useState<{ recommendation: string; suggestedRoute: string } | null>(null);
  const [loadingRec, setLoadingRec] = useState(true);
  const [recError, setRecError] = useState(false);

  useEffect(() => {
    async function fetchWayfinding() {
      if (zonesLoading) return;
      if (zonesError) {
        setRecError(true);
        setLoadingRec(false);
        return;
      }
      try {
        const result = await getSmartWayfinding(fanSector, fanGate, zones);
        if (result.data) {
          setRecommendation(result.data);
        } else {
          setRecError(true);
        }
      } catch {
        setRecError(true);
      } finally {
        setLoadingRec(false);
      }
    }
    fetchWayfinding();
  }, [fanSector, fanGate, zones, zonesLoading, zonesError]);

  if (!isVisible || recError || zonesError) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div 
            className="bg-surface-elevated rounded-2xl border border-border-subtle shadow-elevation-2 p-5 relative overflow-hidden flex mb-6"
            role="alert"
            aria-live="polite"
          >
            {/* Left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-brand-blue to-brand-emerald" />
            
            <div className="flex-1 ml-2">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-brand-blue" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                  AI Navigation
                </span>
              </div>
              
              {loadingRec || zonesLoading ? (
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-surface-sunken rounded-lg animate-pulse w-3/4" />
                  <div className="h-4 bg-surface-sunken rounded-lg animate-pulse w-1/2" />
                </div>
              ) : (
                <>
                  <p className="text-text-primary font-medium text-sm md:text-base mb-1">
                    {recommendation?.recommendation || `Head towards Gate ${fanGate} via the main concourse.`}
                  </p>
                  <p className="text-text-secondary text-xs md:text-sm">
                    {recommendation?.suggestedRoute || `Suggested route based on live crowd data`}
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-sunken transition-colors"
              aria-label="Dismiss navigation recommendation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
