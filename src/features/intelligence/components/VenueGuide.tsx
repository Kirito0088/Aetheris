"use client";

import React, { useRef } from "react";
import { UnifiedStadiumMap, type UnifiedStadiumMapHandle } from "@/components/shared/UnifiedStadiumMap";
import { useDatabaseStore } from "@/store/useDatabaseStore";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

interface VenueGuideProps {
  selectedZone?: string | null;
  onZoneSelect?: (zone: string) => void;
  activeLayers?: {
    crowd: boolean;
    heatmap: boolean;
    facilities: boolean;
    volunteers: boolean;
    aiRoute: boolean;
    accessibility: boolean;
  };
}

export function VenueGuide({
  selectedZone,
  onZoneSelect,
}: VenueGuideProps) {
  const mapRef = useRef<UnifiedStadiumMapHandle>(null);
  const { zones } = useDatabaseStore();

  const selectedZoneData = selectedZone ? zones[selectedZone] : null;

  return (
    <div className="w-full h-full min-h-[500px] relative rounded-3xl overflow-hidden bg-surface-base border border-border-subtle shadow-elevation-1 flex flex-col">
      {/* Main Stadium Map Component */}
      <div className="flex-1 w-full h-full relative">
        <UnifiedStadiumMap
          ref={mapRef}
          mode="volunteer"
        />
      </div>

      {/* Selected Zone Bottom Sheet Overlay */}
      <AnimatePresence mode="wait">
        {selectedZoneData && (
          <motion.div
            key={selectedZoneData.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-4 left-4 right-4 bg-surface-elevated/95 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-border-subtle shadow-elevation-3 z-20"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-brand-blue" />
                  <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                    Zone Inspector
                  </span>
                </div>
                <h3 className="text-text-primary font-bold tracking-tight text-lg">
                  {selectedZoneData.name}
                </h3>
                <p className="text-text-secondary text-sm mt-1">
                  {selectedZoneData.metrics.throughput} pax/min throughput • {selectedZoneData.metrics.capacity.toLocaleString()} capacity
                </p>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary mb-1">
                  Density Status
                </span>
                <div className="flex items-center gap-2 bg-surface-sunken px-3 py-1.5 rounded-full border border-border-subtle">
                  <span
                    className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                      selectedZoneData.crowdDensity === "critical"
                        ? "bg-state-danger"
                        : selectedZoneData.crowdDensity === "high"
                        ? "bg-state-warning"
                        : "bg-state-success"
                    }`}
                  />
                  <span className="text-text-primary font-bold text-xs capitalize">
                    {selectedZoneData.crowdDensity}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onZoneSelect?.("")}
              className="mt-3 w-full py-2 text-xs font-bold text-text-tertiary hover:text-text-primary text-center bg-surface-sunken hover:bg-surface-elevated border border-border-subtle rounded-xl transition-all active:scale-[0.98]"
            >
              Close Inspector
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
