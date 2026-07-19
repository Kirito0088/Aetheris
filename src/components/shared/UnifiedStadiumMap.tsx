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
  criticalZoneIds?: string[];
}

// Map logical zones to SVG coordinates for zoom focusing
const ZONE_COORDINATES: Record<string, { x: number, y: number, scale: number }> = {
  'north-gate': { x: 0, y: 100, scale: 2 },
  'south-gate': { x: 0, y: -100, scale: 2 },
  'sector-104': { x: -200, y: 0, scale: 2.2 },
  'vip-lounge': { x: 200, y: 0, scale: 2.2 },
  'concourse-east': { x: -150, y: 100, scale: 2 },
};

// Fixed incident marker positions per zone in the new SVG layout
const INCIDENT_POSITIONS: Record<string, { cx: number, cy: number }> = {
  'north-gate': { cx: 400, cy: 150 },
  'south-gate': { cx: 400, cy: 450 },
  'sector-104': { cx: 630, cy: 300 },
  'vip-lounge': { cx: 170, cy: 300 },
  'concourse-east': { cx: 600, cy: 170 },
};

// Telemetry sensor positions (operations mode)
const SENSOR_POSITIONS = [
  { cx: 300, cy: 150 },
  { cx: 500, cy: 150 },
  { cx: 300, cy: 450 },
];

export const UnifiedStadiumMap = forwardRef<UnifiedStadiumMapHandle, UnifiedStadiumMapProps>(
  ({ mode, zones: zonesProp, incidents: incidentsProp, criticalZoneIds = [] }, ref) => {
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

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-4 right-4 z-20 glass-panel px-3 py-2 rounded-xl flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--stitch-accent-red)]" />
            <span className="font-data text-xs text-text-secondary">Critical Incident</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-blue)]" />
            <span className="font-data text-xs text-text-secondary">Active Sensor</span>
          </div>
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
          {/* SVG Map: Stitch Elliptical Venue Design */}
          <svg viewBox="0 0 800 600" className="w-full h-full max-w-[800px] drop-shadow-2xl opacity-90" style={{ overflow: 'visible' }}>
            <defs>
              {/* Glow filter for selected zones */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              {/* Pitch gradient */}
              <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0f2f0" />
                <stop offset="100%" stopColor="#e2e6e2" />
              </linearGradient>
            </defs>

            {/* Outer Perimeter */}
            <ellipse cx="400" cy="300" rx="350" ry="280" fill="none" stroke="#e5e5e2" strokeWidth="2" />
            <ellipse cx="400" cy="300" rx="320" ry="250" fill="#f9f9f8" stroke="#d4d4d2" strokeWidth="1" />

            {/* VIP Corner Wedges (static decorative) */}
            <path d="M 150 200 L 250 120 L 280 180 L 220 230 Z" fill="var(--surface-sunken)" stroke="var(--stitch-outline-variant)" strokeWidth="1" />
            <path d="M 650 200 L 550 120 L 520 180 L 580 230 Z" fill="var(--surface-sunken)" stroke="var(--stitch-outline-variant)" strokeWidth="1" />
            <path d="M 150 400 L 250 480 L 280 420 L 220 370 Z" fill="var(--surface-sunken)" stroke="var(--stitch-outline-variant)" strokeWidth="1" />
            <path d="M 650 400 L 550 480 L 520 420 L 580 370 Z" fill="var(--surface-sunken)" stroke="var(--stitch-outline-variant)" strokeWidth="1" />

            {/* Render Zones Dynamically */}
            {zonesList.map(zone => {
              const isSelected = selectedZone === zone.id;
              const isCritical = zone.crowdDensity === 'critical' || criticalZoneIds.includes(zone.id);
              const color = getZoneColor(zone);
              const pathData = getPathForZone(zone.id);

              return (
                <React.Fragment key={zone.id}>
                  {isCritical && (
                    <motion.path
                      d={pathData}
                      fill="var(--state-danger)"
                      stroke="var(--state-danger)"
                      strokeWidth={3}
                      animate={{ fillOpacity: [0.15, 0.35, 0.15] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      style={{ pointerEvents: "none" }}
                    />
                  )}
                  <motion.path
                    d={pathData}
                    fill={color}
                    fillOpacity={isSelected ? 0.3 : 0.08}
                    stroke={isCritical ? 'var(--state-danger)' : (isSelected ? 'var(--brand-blue)' : color)}
                    strokeWidth={isCritical ? 2.5 : (isSelected ? 3 : 1.5)}
                    strokeOpacity={isCritical ? 0.8 : (isSelected ? 1 : 0.6)}
                    whileHover={!isDragging ? { fillOpacity: 0.25 } : {}}
                    onTap={() => {
                      if (!isDragging && mode !== 'operations') {
                        setSelectedZone(zone.id === selectedZone ? null : zone.id);
                      }
                    }}
                    className={mode === 'operations' ? "cursor-default" : "cursor-pointer"}
                    style={{ filter: isSelected ? 'url(#glow)' : 'none' }}
                  />
                </React.Fragment>
              );
            })}

            {/* Field / Pitch with markings */}
            <rect x="250" y="200" width="300" height="200" rx="10" fill="url(#pitchGrad)" stroke="var(--stitch-outline-variant)" strokeWidth="2" />
            {/* Center line */}
            <line x1="400" y1="200" x2="400" y2="400" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
            {/* Center circle */}
            <circle cx="400" cy="300" r="40" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
            {/* Left penalty box */}
            <rect x="250" y="250" width="50" height="100" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
            {/* Right penalty box */}
            <rect x="500" y="250" width="50" height="100" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" />

            {/* Telemetry Nodes (Operations mode) */}
            {mode === 'operations' && SENSOR_POSITIONS.map((pos, i) => (
              <motion.circle
                key={`sensor-${i}`}
                cx={pos.cx}
                cy={pos.cy}
                r={6}
                fill="var(--brand-blue)"
                opacity={0.8}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: i * 0.1 }}
              />
            ))}

            {/* Render Incidents */}
            {mode === 'operations' && incidentsList.map(inc => {
              if (inc.status === 'resolved') return null;
              const pos = INCIDENT_POSITIONS[inc.locationZoneId];
              if (!pos) return null;

              return (
                <motion.g key={inc.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  {/* Ping animation ring */}
                  <circle cx={pos.cx} cy={pos.cy} r="16" fill="var(--stitch-accent-red)" fillOpacity="0.2" className="animate-ping" />
                  {/* Solid core */}
                  <circle cx={pos.cx} cy={pos.cy} r="8" fill="var(--stitch-accent-red)" />
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

// SVG Path helper – Stitch elliptical venue paths
function getPathForZone(id: string): string {
  switch(id) {
    case 'north-gate': return "M 250 120 C 350 70 450 70 550 120 L 520 180 C 440 140 360 140 280 180 Z";
    case 'south-gate': return "M 250 480 C 350 530 450 530 550 480 L 520 420 C 440 460 360 460 280 420 Z";
    case 'sector-104': return "M 650 200 C 700 270 700 330 650 400 L 580 370 C 620 320 620 280 580 230 Z";
    case 'vip-lounge': return "M 150 200 C 100 270 100 330 150 400 L 220 370 C 180 320 180 280 220 230 Z";
    case 'concourse-east': return "M 650 200 L 550 120 L 520 180 L 580 230 Z";
    default: return "";
  }
}
