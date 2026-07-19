"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useFanExperienceStore, type CrowdDensity, type StadiumZone } from "@/store/useFanExperienceStore";

export function InteractiveStadiumMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { zones, activeZoneId, setActiveZone } = useFanExperienceStore();
  
  // Motion values for pan and zoom
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for fluid interactions (UI UX Pro Max)
  const springConfig = { damping: 25, stiffness: 120 };
  const smoothScale = useSpring(scale, springConfig);
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const [isDragging, setIsDragging] = useState(false);

  // Handle zoom controls
  const handleZoom = (direction: 'in' | 'out') => {
    const currentScale = scale.get();
    const newScale = direction === 'in' 
      ? Math.min(currentScale + 0.5, 3) 
      : Math.max(currentScale - 0.5, 0.5);
    scale.set(newScale);
  };

  const getDensityColor = (density: CrowdDensity) => {
    switch (density) {
      case 'low': return 'var(--crowd-low)';
      case 'medium': return 'var(--crowd-medium)';
      case 'high': return 'var(--crowd-high)';
      case 'critical': return 'var(--crowd-critical)';
      default: return 'var(--state-neutral)';
    }
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-3xl bg-surface-base border border-border-subtle shadow-elevation-1">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-surface-elevated/80 backdrop-blur-md p-1.5 rounded-xl border border-border-subtle shadow-elevation-2">
        <button 
          onClick={() => handleZoom('in')}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-nav-hover active:scale-95 transition-all text-text-secondary hover:text-text-primary font-medium"
        >
          +
        </button>
        <div className="w-full h-px bg-border-subtle" />
        <button 
          onClick={() => handleZoom('out')}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-nav-hover active:scale-95 transition-all text-text-secondary hover:text-text-primary font-medium"
        >
          -
        </button>
      </div>

      <motion.div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
        style={{
          scale: smoothScale,
          x: smoothX,
          y: smoothY,
        }}
        drag
        dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setTimeout(() => setIsDragging(false), 100)} // Prevent click on drag end
        whileTap={{ cursor: "grabbing" }}
      >
        <svg 
          viewBox="0 0 800 600" 
          className="w-full h-full max-w-[800px] drop-shadow-sm"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base Pitch */}
          <rect x="250" y="150" width="300" height="200" rx="20" fill="var(--surface-sunken)" stroke="var(--border-strong)" strokeWidth="2" />
          <circle cx="400" cy="250" r="40" fill="none" stroke="var(--border-strong)" strokeWidth="2" />
          <line x1="400" y1="150" x2="400" y2="350" stroke="var(--border-strong)" strokeWidth="2" />
          <rect x="250" y="200" width="40" height="100" fill="none" stroke="var(--border-strong)" strokeWidth="2" />
          <rect x="510" y="200" width="40" height="100" fill="none" stroke="var(--border-strong)" strokeWidth="2" />

          {/* Zones */}
          {/* North Gate */}
          <StadiumZonePath 
            id="north-gate" 
            d="M200,100 C300,50 500,50 600,100 L550,150 C450,120 350,120 250,150 Z" 
            zone={zones['north-gate']}
            isActive={activeZoneId === 'north-gate'}
            onClick={() => !isDragging && setActiveZone('north-gate')}
          />
          
          {/* South Gate */}
          <StadiumZonePath 
            id="south-gate" 
            d="M200,400 C300,450 500,450 600,400 L550,350 C450,380 350,380 250,350 Z" 
            zone={zones['south-gate']}
            isActive={activeZoneId === 'south-gate'}
            onClick={() => !isDragging && setActiveZone('south-gate')}
          />

          {/* Sector 104 (East) */}
          <StadiumZonePath 
            id="sector-104" 
            d="M600,100 C650,200 650,300 600,400 L550,350 C580,280 580,220 550,150 Z" 
            zone={zones['sector-104']}
            isActive={activeZoneId === 'sector-104'}
            onClick={() => !isDragging && setActiveZone('sector-104')}
          />

          {/* VIP Lounge (West) */}
          <StadiumZonePath 
            id="vip-lounge" 
            d="M200,100 C150,200 150,300 200,400 L250,350 C220,280 220,220 250,150 Z" 
            zone={zones['vip-lounge']}
            isActive={activeZoneId === 'vip-lounge'}
            onClick={() => !isDragging && setActiveZone('vip-lounge')}
          />

          {/* East Concourse */}
          <StadiumZonePath 
            id="concourse-east" 
            d="M600,200 C620,250 620,300 600,300 L550,280 C560,260 560,240 550,220 Z" 
            zone={zones['concourse-east']}
            isActive={activeZoneId === 'concourse-east'}
            onClick={() => !isDragging && setActiveZone('concourse-east')}
          />

          {/* Wayfinding Path (Animated) */}
          {activeZoneId === 'sector-104' && (
            <motion.path
              d="M400,50 L400,100 L500,120 L575,250"
              fill="none"
              stroke="var(--brand-blue)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          )}
          
          {/* Pulse marker for Active Zone */}
          {activeZoneId === 'sector-104' && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
            >
              <circle cx="575" cy="250" r="12" fill="var(--brand-blue)" fillOpacity="0.2" />
              <circle cx="575" cy="250" r="6" fill="var(--brand-blue)" />
            </motion.g>
          )}
        </svg>
      </motion.div>

      {/* Active Zone Info Panel */}
      <AnimatePresence mode="wait">
        {activeZoneId && zones[activeZoneId] && (
          <motion.div 
            key={activeZoneId}
            layoutId="fan-zone-info"
            className="absolute bottom-4 left-4 right-4 bg-surface-elevated/90 backdrop-blur-xl p-4 rounded-2xl border border-border-subtle shadow-elevation-3 origin-bottom"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex items-start justify-between">
            <div>
              <h3 className="text-text-primary font-bold tracking-tight text-[length:var(--font-size-lg)]">
                {zones[activeZoneId].name}
              </h3>
              <p className="text-text-secondary text-[length:var(--font-size-sm)] mt-1">
                {zones[activeZoneId].description}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary mb-1">Density</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: getDensityColor(zones[activeZoneId].density) }} />
                <span className="text-text-primary font-medium text-[length:var(--font-size-sm)] capitalize">
                  {zones[activeZoneId].density}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StadiumZonePath({ 
  id: _id, 
  d, 
  zone, 
  isActive, 
  onClick 
}: { 
  id: string; 
  d: string; 
  zone?: StadiumZone; 
  isActive: boolean; 
  onClick: () => void;
}) {
  const getDensityColor = (density: CrowdDensity) => {
    switch (density) {
      case 'low': return 'var(--crowd-low)';
      case 'medium': return 'var(--crowd-medium)';
      case 'high': return 'var(--crowd-high)';
      case 'critical': return 'var(--crowd-critical)';
      default: return 'var(--state-neutral)';
    }
  };

  const baseColor = zone ? getDensityColor(zone.density) : 'var(--surface-sunken)';
  
  return (
    <motion.path
      d={d}
      fill={baseColor}
      fillOpacity={isActive ? 0.4 : 0.15}
      stroke={isActive ? 'var(--brand-blue)' : baseColor}
      strokeWidth={isActive ? 3 : 1}
      strokeOpacity={isActive ? 1 : 0.5}
      onClick={onClick}
      onTap={onClick}
      whileHover={{ fillOpacity: 0.3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="cursor-pointer"
      style={{ filter: isActive ? 'url(#glow)' : 'none' }}
    />
  );
}
