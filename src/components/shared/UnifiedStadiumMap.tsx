"use client";

import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useDatabaseStore, type DBZone, type DBIncident, type CrowdDensity, type Priority } from "@/store/useDatabaseStore";
import { type Tables } from "@/types/supabase";

export interface UnifiedStadiumMapHandle {
  focusZone: (zoneId: string) => void;
  resetView: () => void;
}

interface UnifiedStadiumMapProps {
  mode: 'fan' | 'volunteer' | 'operations';
  zones?: Tables<'zones'>[];
  incidents?: Tables<'incidents'>[];
}

// Map logical zones to SVG coordinates for zoom focusing
const ZONE_COORDINATES: Record<string, { x: number, y: number, scale: number }> = {
  'north-gate': { x: -50, y: 100, scale: 2 },
  'south-gate': { x: -50, y: -150, scale: 2 },
  'sector-104': { x: -150, y: 0, scale: 2.2 },
  'vip-lounge': { x: 150, y: 0, scale: 2.2 },
  'concourse-east': { x: 0, y: 0, scale: 1.5 },
};

export const UnifiedStadiumMap = forwardRef<UnifiedStadiumMapHandle, UnifiedStadiumMapProps>(
  ({ mode, zones: zonesProp, incidents: incidentsProp }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const storeData = useDatabaseStore();

    // Normalize zones from either zonesProp (Tables<'zones'>[]) or storeData.zones
    const zonesList = React.useMemo<DBZone[]>(() => {
      if (zonesProp) {
        return zonesProp.map((z) => ({
          id: z.id,
          name: z.name,
          crowdDensity: z.crowd_density as CrowdDensity,
          metrics: {
            throughput: z.throughput,
            capacity: z.capacity,
          },
        }));
      }
      return Object.values(storeData.zones);
    }, [zonesProp, storeData.zones]);

    // Normalize incidents from either incidentsProp (Tables<'incidents'>[]) or storeData.incidents
    const incidentsList = React.useMemo<DBIncident[]>(() => {
      if (incidentsProp) {
        return incidentsProp.map((inc) => ({
          id: inc.id,
          title: inc.title,
          description: inc.description,
          status: inc.status as "open" | "assigned" | "resolved",
          priority: inc.priority as Priority,
          locationZoneId: inc.location_zone_id,
          reportedAt: inc.reported_at,
        }));
      }
      return Object.values(storeData.incidents);
    }, [incidentsProp, storeData.incidents]);
    
    // Framer Motion 60fps buttery smooth values
    const scale = useMotionValue(1);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 150 }; // Premium Apple-like spring
    const smoothScale = useSpring(scale, springConfig);
    const smoothX = useSpring(x, springConfig);
    const smoothY = useSpring(y, springConfig);

    const [isDragging, setIsDragging] = useState(false);
    const [selectedZone, setSelectedZone] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      focusZone: (zoneId: string) => {
        setSelectedZone(zoneId);
        const coords = ZONE_COORDINATES[zoneId];
        if (coords) {
          scale.set(coords.scale);
          x.set(coords.x);
          y.set(coords.y);
        }
      },
      resetView: () => {
        setSelectedZone(null);
        scale.set(1);
        x.set(0);
        y.set(0);
      }
    }));

    const getZoneColor = (zone: DBZone) => {
      // Operations mode sees real-time heatmaps based on throughput vs capacity
      if (mode === 'operations') {
        const ratio = zone.metrics.throughput / (zone.metrics.capacity || 1);
        if (ratio > 0.8) return 'var(--state-danger)';
        if (ratio > 0.5) return 'var(--state-warning)';
        return 'var(--state-info)';
      }
      
      // Fan/Volunteer see semantic density
      switch (zone.crowdDensity) {
        case 'low': return 'var(--crowd-low)';
        case 'medium': return 'var(--crowd-medium)';
        case 'high': return 'var(--crowd-high)';
        case 'critical': return 'var(--crowd-critical)';
        default: return 'var(--state-neutral)';
      }
    };

    return (
      <div className="relative w-full h-full min-h-[400px] overflow-hidden rounded-3xl bg-surface-base border border-border-subtle shadow-elevation-1">
        
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-surface-elevated/80 backdrop-blur-md p-1.5 rounded-xl border border-border-subtle shadow-elevation-2">
          <button 
            onClick={() => scale.set(Math.min(scale.get() + 0.5, 3))}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-nav-hover active:scale-95 transition-all text-text-secondary hover:text-text-primary font-medium"
          >
            +
          </button>
          <div className="w-full h-px bg-border-subtle" />
          <button 
            onClick={() => scale.set(Math.max(scale.get() - 0.5, 0.5))}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-nav-hover active:scale-95 transition-all text-text-secondary hover:text-text-primary font-medium"
          >
            -
          </button>
        </div>

        {/* Map Container */}
        <motion.div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
          style={{ scale: smoothScale, x: smoothX, y: smoothY }}
          drag
          dragConstraints={{ left: -400, right: 400, top: -300, bottom: 300 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
          whileTap={{ cursor: "grabbing" }}
        >
          {/* SVG Map: Clean, Architectural 2D Style */}
          <svg viewBox="0 0 800 600" className="w-full h-full max-w-[800px] drop-shadow-sm" style={{ overflow: 'visible' }}>
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Stadium Outer Ring */}
            <rect x="200" y="100" width="400" height="400" rx="200" fill="var(--surface-sunken)" stroke="var(--border-strong)" strokeWidth="1.5" />
            
            {/* Pitch */}
            <rect x="330" y="220" width="140" height="160" rx="12" fill="var(--surface-base)" stroke="var(--border-strong)" strokeWidth="1.5" />
            <circle cx="400" cy="300" r="25" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" />
            <line x1="330" y1="300" x2="470" y2="300" stroke="var(--border-strong)" strokeWidth="1.5" />

            {/* Render Zones Dynamically */}
            {zonesList.map(zone => {
              const isSelected = selectedZone === zone.id;
              const color = getZoneColor(zone);
              const pathData = getPathForZone(zone.id);

              return (
                <motion.path
                  key={zone.id}
                  d={pathData}
                  fill={color}
                  fillOpacity={isSelected ? 0.3 : 0.08}
                  stroke={isSelected ? 'var(--brand-blue)' : color}
                  strokeWidth={isSelected ? 3 : 1.5}
                  strokeOpacity={isSelected ? 1 : 0.6}
                  whileHover={!isDragging ? { fillOpacity: 0.25 } : {}}
                  onTap={() => {
                    if (!isDragging && mode !== 'operations') {
                      setSelectedZone(zone.id === selectedZone ? null : zone.id);
                    }
                  }}
                  className={mode === 'operations' ? "cursor-default" : "cursor-pointer"}
                  style={{ filter: isSelected ? 'url(#glow)' : 'none' }}
                />
              );
            })}

            {/* Render Incidents (Operations Mode Only) */}
            {mode === 'operations' && incidentsList.map(inc => {
              if (inc.status === 'resolved') return null;
              const coords = ZONE_COORDINATES[inc.locationZoneId];
              if (!coords) return null;
              
              // Reverse mapping coordinates for visual placement
              const cx = 400 - coords.x;
              const cy = 300 - coords.y;

              return (
                <motion.g key={inc.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <circle cx={cx} cy={cy} r="20" fill="var(--state-danger)" fillOpacity="0.2" className="animate-ping" />
                  <circle cx={cx} cy={cy} r="8" fill="var(--state-danger)" />
                </motion.g>
              );
            })}
          </svg>
        </motion.div>
      </div>
    );
  }
);

UnifiedStadiumMap.displayName = 'UnifiedStadiumMap';

// SVG Path helper
function getPathForZone(id: string): string {
  switch(id) {
    case 'north-gate': return "M300,100 C350,80 450,80 500,100 L460,160 C420,150 380,150 340,160 Z";
    case 'south-gate': return "M300,500 C350,520 450,520 500,500 L460,440 C420,450 380,450 340,440 Z";
    case 'sector-104': return "M500,100 C580,180 580,420 500,500 L440,440 C480,380 480,220 440,160 Z";
    case 'vip-lounge': return "M300,100 C220,180 220,420 300,500 L360,440 C320,380 320,220 360,160 Z";
    default: return "";
  }
}
