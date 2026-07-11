"use client";

import React, { useState, useEffect } from "react";
import { VenueGuide } from "@/features/intelligence/components/VenueGuide";
import { AIRecommendation } from "@/features/intelligence/components/AIRecommendation";
import { Users, Clock, Navigation, Activity, Info, Eye, Layers, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SPRING_FAST, MOTION_PRESETS } from "@/features/intelligence/data/motion-config";

interface SparklineProps {
  data: number[];
  color: string;
}

function Sparkline({ data, color }: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * 120;
      const y = 30 - ((val - min) / (range || 1)) * 25;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="120" height="30" className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

interface RadialProgressProps {
  percentage: number;
  color: string;
  size?: number;
}

function RadialProgress({ percentage, color, size = 60 }: RadialProgressProps) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="var(--border-subtle)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-[var(--text-primary)]">{percentage}%</span>
    </div>
  );
}

export default function VenueGuidePage() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  
  // Dynamic Layers toggle
  const [layers, setLayers] = useState({
    crowd: true,
    heatmap: true,
    facilities: true,
    volunteers: true,
    aiRoute: true,
    accessibility: true,
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdated(now.toTimeString().split(" ")[0] || "");
    };
    updateTime();
    const interval = setInterval(updateTime, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId === selectedZone ? null : zoneId);
  };

  const getZoneContext = (zoneId: string | null) => {
    if (!zoneId) {
      return {
        title: "Estadio Azteca Overview",
        crowd: "Moderate (65%)",
        status: "Normal Operations",
        recommendation: "All primary gates are flowing smoothly. Monitor North Concourse for potential post-match congestion.",
        queueTime: "Avg 4 mins",
        walkingTime: "N/A",
        confidence: 98,
        trend: [45, 50, 52, 60, 68, 65],
        health: "Healthy",
        healthColor: "var(--brand-emerald)",
        queueProgress: 35,
      };
    }
    
    if (zoneId === "north-gate") {
      return {
        title: "North Gate Entrance (Acceso 1)",
        crowd: "High (88%)",
        status: "Action Required",
        recommendation: "Redirect incoming fans to East Gate. Dispatch 3 volunteers for queue management.",
        queueTime: "12 mins",
        walkingTime: "2 mins from Transit Hub",
        confidence: 94,
        trend: [50, 62, 70, 80, 85, 88],
        health: "Congested",
        healthColor: "#ef4444",
        queueProgress: 82,
      };
    }

    if (zoneId === "south-gate") {
      return {
        title: "South Gate Entrance (Acceso 2)",
        crowd: "Low (35%)",
        status: "Normal Operations",
        recommendation: "Gate operating with low occupancy. No actions required.",
        queueTime: "2 mins",
        walkingTime: "4 mins from South Parking",
        confidence: 97,
        trend: [20, 25, 30, 32, 35, 35],
        health: "Optimal",
        healthColor: "var(--brand-emerald)",
        queueProgress: 18,
      };
    }

    if (zoneId === "vip-suites") {
      return {
        title: "Platea VIP & Suites",
        crowd: "Moderate (55%)",
        status: "Normal Operations",
        recommendation: "VIP suites checking in. Private shuttle links fully operational.",
        queueTime: "1 min",
        walkingTime: "1 min from VIP Parking",
        confidence: 99,
        trend: [40, 45, 48, 50, 52, 55],
        health: "Optimal",
        healthColor: "var(--brand-emerald)",
        queueProgress: 8,
      };
    }
    
    return {
      title: `${zoneId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
      crowd: "Low (30%)",
      status: "Normal",
      recommendation: "Operating efficiently. No immediate action required.",
      queueTime: "1 min",
      walkingTime: "5 mins",
      confidence: 96,
      trend: [25, 27, 28, 30, 29, 30],
      health: "Optimal",
      healthColor: "var(--brand-emerald)",
      queueProgress: 12,
    };
  };

  const context = getZoneContext(selectedZone);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <motion.div {...MOTION_PRESETS.pageTransition} className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Compass className="w-6 h-6 text-[var(--brand-blue)]" /> Venue Guide
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">Estadio Azteca Digital Twin & Dynamic Contextual Intelligence</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Last update: <span className="font-semibold text-[var(--text-secondary)]">{lastUpdated}</span>
        </div>
      </div>

      {/* Layers Bar */}
      <div className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] p-3 rounded-xl shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider pr-2 border-r border-[var(--border-subtle)]">
          <Layers className="w-3.5 h-3.5" /> Map Layers
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(layers).map(([key, active]) => (
            <button
              key={key}
              onClick={() => toggleLayer(key as keyof typeof layers)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5
                ${active 
                  ? "bg-blue-500/10 text-[var(--brand-blue)] border-[var(--brand-blue)]/30" 
                  : "bg-[var(--surface-base)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                }
              `}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Stadium Map Area */}
        <div className="lg:col-span-3 bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border-subtle)] shadow-sm relative overflow-hidden flex flex-col min-h-[450px]">
          <div className="absolute top-4 left-4 z-10 bg-[var(--surface-base)]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-semibold flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            Live Map Active
          </div>
          
          <div className="flex-1 w-full h-full p-4 relative flex items-center justify-center">
            <VenueGuide selectedZone={selectedZone} onZoneSelect={handleZoneSelect} activeLayers={layers} />
          </div>
        </div>

        {/* Dynamic Context Panel */}
        <div className="bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border-subtle)] shadow-sm flex flex-col overflow-hidden">
          {/* Header section with status health */}
          <div className="p-5 border-b border-[var(--border-subtle)] bg-[var(--surface-base)] flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                {context.title}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Estadio Azteca Zone Context</p>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: `${context.healthColor}15`, color: context.healthColor, border: `1px solid ${context.healthColor}30` }}
            >
              {context.health}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[var(--brand-emerald)]" /> Crowd Level
                </div>
                <div className="text-sm font-bold text-[var(--text-primary)]">{context.crowd}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-500" /> Queue Time
                </div>
                <div className="text-sm font-bold text-[var(--text-primary)]">{context.queueTime}</div>
              </div>
              
              <div className="space-y-1 col-span-2">
                <div className="text-xs font-semibold text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[var(--brand-blue)]" /> Walking Time
                </div>
                <div className="text-sm font-medium text-[var(--text-primary)]">{context.walkingTime}</div>
              </div>
            </div>

            <div className="h-px w-full bg-[var(--border-subtle)]" />

            {/* AI Confidence & Sparkline Trends */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[var(--text-tertiary)]">AI Confidence</div>
                <div className="pt-1">
                  <RadialProgress percentage={context.confidence} color="var(--brand-blue)" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[var(--text-tertiary)]">Crowd Trend</div>
                <div className="pt-2">
                  <Sparkline data={context.trend} color={context.healthColor} />
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-[var(--border-subtle)]" />

            {/* Queue Evolution progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[var(--text-tertiary)]">Capacity Load</span>
                <span className="font-bold text-[var(--text-primary)]">{context.queueProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--surface-base)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${context.queueProgress}%` }}
                  transition={SPRING_FAST}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </div>

            <div className="h-px w-full bg-[var(--border-subtle)]" />

            {/* AI Context Recommendation changes */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedZone || "default"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[var(--brand-blue)]" />
                  AI Recommendation
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {context.recommendation}
                </p>

                {selectedZone === "north-gate" && (
                  <div className="pt-2">
                    <AIRecommendation
                      title="Gate C Bottleneck Mitigation"
                      description="AI suggests routing North flow through East Gate."
                      actionLabel="Reroute Paths"
                      type="routing"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
