"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Coffee, Plus, Minus, Layers, Navigation } from "lucide-react";

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
  activeLayers = {
    crowd: true,
    heatmap: true,
    facilities: true,
    volunteers: true,
    aiRoute: true,
    accessibility: true,
  },
}: VenueGuideProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  // Estadio Azteca inspired structural definition
  const zones = [
    {
      id: "north-gate",
      label: "North Gate Entrance (Acceso 1)",
      // Outer concourse arch
      renderPath: "M 130 90 Q 200 60 270 90 L 260 115 Q 200 90 140 115 Z",
      hitboxPath: "M 120 80 Q 200 50 280 80 L 270 125 Q 200 95 130 125 Z",
      color: "var(--brand-blue)",
      type: "gate",
    },
    {
      id: "south-gate",
      label: "South Gate Entrance (Acceso 2)",
      renderPath: "M 130 510 Q 200 540 270 510 L 260 485 Q 200 510 140 485 Z",
      hitboxPath: "M 120 520 Q 200 550 280 520 L 270 475 Q 200 505 130 475 Z",
      color: "var(--brand-blue)",
      type: "gate",
    },
    {
      id: "east-concourse",
      label: "East Concourse (Tlalpan)",
      renderPath: "M 270 90 Q 350 170 350 300 Q 350 430 270 510 L 260 485 Q 325 415 325 300 Q 325 185 260 115 Z",
      hitboxPath: "M 280 80 Q 370 170 370 300 Q 370 430 280 520 L 250 475 Q 310 410 310 300 Q 310 190 250 125 Z",
      color: "var(--brand-emerald)",
      type: "concourse",
    },
    {
      id: "west-concourse",
      label: "West Concourse (Insurgentes)",
      renderPath: "M 130 90 Q 50 170 50 300 Q 50 430 130 510 L 140 485 Q 75 415 75 300 Q 75 185 140 115 Z",
      hitboxPath: "M 120 80 Q 30 170 30 300 Q 30 430 120 520 L 150 475 Q 90 410 90 300 Q 90 190 150 125 Z",
      color: "var(--brand-emerald)",
      type: "concourse",
    },
    {
      id: "seating-upper",
      label: "General Upper Tier (Sección 400/500)",
      renderPath: "M 140 135 Q 200 110 260 135 Q 300 200 300 300 Q 300 400 260 465 Q 200 490 140 465 Q 100 400 100 300 Q 100 200 140 135 Z",
      hitboxPath: "M 140 135 Q 200 110 260 135 Q 300 200 300 300 Q 300 400 260 465 Q 200 490 140 465 Q 100 400 100 300 Q 100 200 140 135 Z",
      color: "#eab308",
      type: "seating",
    },
    {
      id: "vip-suites",
      label: "Platea VIP & Suites",
      renderPath: "M 155 170 Q 200 150 245 170 Q 275 210 275 300 Q 275 390 245 430 Q 200 450 155 430 Q 125 390 125 300 Q 125 210 155 170 Z",
      hitboxPath: "M 155 170 Q 200 150 245 170 Q 275 210 275 300 Q 275 390 245 430 Q 200 450 155 430 Q 125 390 125 300 Q 125 210 155 170 Z",
      color: "#8b5cf6",
      type: "vip",
    },
  ];

  // Particle positions for crowd flow
  const crowdParticles = [
    { cx: 310, cy: 200 },
    { cx: 330, cy: 300 },
    { cx: 290, cy: 400 },
    { cx: 90, cy: 220 },
    { cx: 70, cy: 310 },
    { cx: 110, cy: 390 },
  ];

  // Volunteer indicators
  const volunteers = [
    { id: "v1", x: 230, y: 100, name: "Sofia M." },
    { id: "v2", x: 310, y: 260, name: "Mateo R." },
    { id: "v3", x: 90, y: 350, name: "Elena G." },
  ];

  const handleZoneClick = (id: string) => {
    onZoneSelect?.(id);
  };

  return (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center relative select-none">
      <div className="relative w-full max-w-[500px] aspect-[2/3] mx-auto">
        <svg
          viewBox="0 0 400 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.25)]"
        >
          {/* STADIUM BASE: Estadio Azteca Sweeping Roof Ring */}
          <rect
            x="20"
            y="40"
            width="360"
            height="520"
            rx="180"
            fill="var(--surface-base)"
            stroke="var(--border-subtle)"
            strokeWidth="6"
          />
          <rect
            x="30"
            y="50"
            width="340"
            height="500"
            rx="170"
            fill="transparent"
            stroke="var(--border-strong)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.3"
          />

          {/* RENDERING LAYER: Visual styles only (pointer-events-none) */}
          <g className="pointer-events-none">
            {zones.map((zone) => {
              const isSelected = selectedZone === zone.id;
              const isHovered = hoveredZone === zone.id;
              const isAnySelected = !!selectedZone;
              const isActive = isSelected || isHovered;

              let fill = "var(--surface-sunken)";
              let opacity = 0.65;

              if (isAnySelected) {
                opacity = isSelected ? 1 : 0.15;
              } else if (isHovered) {
                opacity = 0.95;
              }

              if (isActive) {
                fill = zone.color;
              }

              return (
                <path
                  key={`render-${zone.id}`}
                  d={zone.renderPath}
                  fill={fill}
                  stroke={isActive ? "white" : "var(--border-subtle)"}
                  strokeWidth={isActive ? 2 : 1}
                  style={{
                    opacity,
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              );
            })}
          </g>

          {/* THE FIELD (Azteca Pitch) */}
          <g className="pointer-events-none">
            <rect
              x="170"
              y="220"
              width="60"
              height="160"
              fill="#1b4332"
              stroke="#ffffff33"
              strokeWidth="2"
              opacity={selectedZone ? 0.2 : 0.9}
              style={{ transition: "opacity 0.3s" }}
            />
            {/* Center circle */}
            <circle
              cx="200"
              cy="300"
              r="20"
              fill="transparent"
              stroke="#ffffff22"
              strokeWidth="1.5"
              opacity={selectedZone ? 0.2 : 0.9}
            />
            {/* Center line */}
            <line
              x1="170"
              y1="300"
              x2="230"
              y2="300"
              stroke="#ffffff22"
              strokeWidth="1.5"
              opacity={selectedZone ? 0.2 : 0.9}
            />
          </g>

          {/* CROWD FLOW LAYER: Smooth particle flow */}
          {activeLayers.crowd && !selectedZone && (
            <g className="pointer-events-none">
              {crowdParticles.map((pt, i) => (
                <motion.circle
                  key={`crowd-pt-${i}`}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="3.5"
                  fill="var(--brand-emerald)"
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2 + (i % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </g>
          )}

          {/* HEATMAP LAYER: Soft radial glows */}
          {activeLayers.heatmap && (
            <g className="pointer-events-none" style={{ mixBlendMode: "screen" }}>
              <AnimatePresence>
                {hoveredZone === "north-gate" && (
                  <motion.circle
                    cx="200"
                    cy="80"
                    r="40"
                    fill="url(#redGlow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                {selectedZone === "east-concourse" && (
                  <motion.circle
                    cx="300"
                    cy="300"
                    r="60"
                    fill="url(#amberGlow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.55 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
            </g>
          )}

          {/* AI ROUTES LAYER: Dashed animated path */}
          {activeLayers.aiRoute && selectedZone === "north-gate" && (
            <g className="pointer-events-none">
              <motion.path
                d="M 200 80 Q 290 80 300 240 L 260 240"
                fill="none"
                stroke="var(--brand-blue)"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray="6 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              {/* User indicator at end of path */}
              <circle cx="260" cy="240" r="6" fill="var(--brand-blue)" />
              <circle cx="260" cy="240" r="14" stroke="var(--brand-blue)" strokeWidth="1.5" className="animate-ping" />
            </g>
          )}

          {/* ACCESSIBILITY ROUTE */}
          {activeLayers.accessibility && selectedZone === "north-gate" && (
            <g className="pointer-events-none">
              <motion.path
                d="M 200 80 L 100 80 L 90 260"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
              />
              <circle cx="90" cy="260" r="6" fill="#8b5cf6" />
            </g>
          )}

          {/* VOLUNTEER PINS */}
          {activeLayers.volunteers && !selectedZone && (
            <g className="pointer-events-none">
              {volunteers.map((vol) => (
                <g key={vol.id} transform={`translate(${vol.x}, ${vol.y})`}>
                  <circle cx="0" cy="0" r="6" fill="white" className="filter drop-shadow" />
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="4"
                    fill="var(--brand-blue)"
                    animate={{ scale: [0.9, 1.2, 0.9] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <circle cx="0" cy="0" r="10" stroke="var(--brand-blue)" strokeWidth="1.5" opacity="0.3" className="animate-pulse" />
                </g>
              ))}
            </g>
          )}

          {/* FACILITIES ICON LAYER */}
          {activeLayers.facilities && !selectedZone && (
            <g className="pointer-events-none opacity-80">
              {/* Medical Station North */}
              <g transform="translate(200, 100)">
                <rect x="-6" y="-6" width="12" height="12" rx="2.5" fill="#ef4444" />
                <path d="M -3 0 L 3 0 M 0 -3 L 0 3" stroke="white" strokeWidth="1.5" />
              </g>
              {/* Security East */}
              <g transform="translate(310, 300)">
                <rect x="-6" y="-6" width="12" height="12" rx="2.5" fill="var(--brand-blue)" />
                <Shield className="w-2.5 h-2.5 text-white" style={{ transform: "translate(-5px, -5px)" }} />
              </g>
              {/* Concession West */}
              <g transform="translate(90, 300)">
                <rect x="-6" y="-6" width="12" height="12" rx="2.5" fill="#eab308" />
                <Coffee className="w-2.5 h-2.5 text-white" style={{ transform: "translate(-5px, -5px)" }} />
              </g>
            </g>
          )}

          {/* GATES PULSE */}
          <circle cx="200" cy="65" r="5" fill="var(--brand-blue)" className="animate-ping" opacity="0.4" />
          <circle cx="200" cy="535" r="5" fill="var(--brand-blue)" className="animate-ping" opacity="0.4" />

          {/* INTERACTION/HITBOX LAYER: Large stable hitboxes (pointer-events-auto) */}
          <g className="pointer-events-auto fill-transparent stroke-transparent cursor-pointer">
            {zones.map((zone) => (
              <path
                key={`hitbox-${zone.id}`}
                d={zone.hitboxPath}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => handleZoneClick(zone.id)}
              />
            ))}
          </g>

          {/* Gradients definitions */}
          <defs>
            <radialGradient id="redGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* Dynamic Hover Tooltip (Linear/Framer style) */}
        <AnimatePresence>
          {hoveredZone && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 8, scale: 0.96, filter: "blur(4px)" }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
            >
              <div className="bg-surface-elevated/95 border border-border-subtle px-3 py-2.5 rounded-xl shadow-elevation-3 backdrop-blur-2xl flex flex-col items-center min-w-[140px]">
                <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">Select Zone</span>
                <span className="text-[length:var(--font-size-sm)] font-medium text-text-primary text-center leading-tight">
                  {zones.find((z) => z.id === hoveredZone)?.label}
                </span>
                
                {/* Premium subtle glow underneath */}
                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Map Controls (Apple Maps Style) */}
      <div className="absolute top-4 right-4 flex flex-col gap-3 z-20">
        <div className="flex flex-col bg-surface-base/70 backdrop-blur-2xl border border-border-subtle rounded-xl shadow-elevation-2 overflow-hidden ring-1 ring-black/5">
          <button className="p-2.5 hover:bg-nav-hover transition-colors border-b border-border-subtle group" aria-label="Zoom In">
            <Plus className="w-[18px] h-[18px] text-text-secondary group-hover:text-text-primary transition-colors" />
          </button>
          <button className="p-2.5 hover:bg-nav-hover transition-colors group" aria-label="Zoom Out">
            <Minus className="w-[18px] h-[18px] text-text-secondary group-hover:text-text-primary transition-colors" />
          </button>
        </div>

        <button className="p-2.5 bg-surface-base/70 backdrop-blur-2xl border border-border-subtle rounded-xl shadow-elevation-2 hover:bg-nav-hover transition-colors group ring-1 ring-black/5" aria-label="Map Layers">
          <Layers className="w-[18px] h-[18px] text-text-secondary group-hover:text-text-primary transition-colors" />
        </button>

        <button className="p-2.5 bg-surface-base/70 backdrop-blur-2xl border border-border-subtle rounded-xl shadow-elevation-2 hover:bg-nav-hover transition-colors group ring-1 ring-black/5 mt-2" aria-label="Recenter">
          <Navigation className="w-[18px] h-[18px] text-brand-blue" fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
