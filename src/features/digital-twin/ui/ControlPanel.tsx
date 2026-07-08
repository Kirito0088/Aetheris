"use client";

import React, { useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
import { useSpatialStore } from "../store/useSpatialStore";
import { LayerManager } from "./LayerManager";
import { SelectionLegend } from "./SelectionLegend";
import { EntityRegistry } from "../registry/EntityRegistry";
import { CameraTimeline } from "../camera/CameraTimeline";
import type { RouteType } from "../../navigation/graph/Graph";
import { 
  RotateCcw, 
  Keyboard, 
  Eye, 
  Navigation, 
  Play, 
  Pause, 
  Square, 
  Accessibility, 
  Crown, 
  Flame
} from "lucide-react";
import { clsx } from "clsx";

export const ControlPanel = React.memo(function ControlPanel() {
  const cameraMode = useSpatialStore((state) => state.cameraMode);
  const setCameraMode = useSpatialStore((state) => state.setCameraMode);
  const resetToOverview = useSpatialStore((state) => state.resetToOverview);
  const selectedId = useSpatialStore((state) => state.selectedId);

  // Routing State
  const routingStartId = useSpatialStore((state) => state.routingStartId);
  const routingEndId = useSpatialStore((state) => state.routingEndId);
  const routingType = useSpatialStore((state) => state.routingType);
  const activeRoute = useSpatialStore((state) => state.activeRoute);
  
  const setRoutingStartId = useSpatialStore((state) => state.setRoutingStartId);
  const setRoutingEndId = useSpatialStore((state) => state.setRoutingEndId);
  const setRoutingType = useSpatialStore((state) => state.setRoutingType);
  const clearRoute = useSpatialStore((state) => state.clearRoute);
  
  const updateAnimationProgress = useSpatialStore((state) => state.updateAnimationProgress);
  const updateTimelineState = useSpatialStore((state) => state.updateTimelineState);
  const timelineState = useSpatialStore((state) => state.timelineState);

  // Instantiate the camera timeline controller
  const timelineRef = useRef<CameraTimeline | null>(null);
  if (!timelineRef.current) {
    timelineRef.current = new CameraTimeline();
  }

  // Get all entities grouped by category for dropdowns
  const gates = useMemo(() => EntityRegistry.getInstance().getByType("gate"), []);
  const zones = useMemo(() => EntityRegistry.getInstance().getByType("zone"), []);
  const pois = useMemo(() => EntityRegistry.getInstance().getByType("poi"), []);

  // Compute active/focus zone under inspection
  const activeZoneName = useMemo(() => {
    if (!selectedId) return "Stadium Shell";
    const selected = EntityRegistry.getInstance().getById(selectedId);
    if (!selected) return "Stadium Shell";
    
    if (selected.type === "zone") {
      return selected.name;
    }
    
    // Find connected zone from registry or name mapping
    if (selectedId.includes("gate:a") || selectedId.includes("medical-01") || selectedId.includes("restroom-01") || selectedId.includes("exit-01")) {
      return "North Stand Area";
    }
    if (selectedId.includes("gate:b") || selectedId.includes("restroom-02") || selectedId.includes("food-01") || selectedId.includes("info-01")) {
      return "East Stand Area";
    }
    if (selectedId.includes("gate:c") || selectedId.includes("medical-02") || selectedId.includes("restroom-03") || selectedId.includes("exit-02")) {
      return "South Stand Area";
    }
    if (selectedId.includes("gate:d") || selectedId.includes("restroom-04") || selectedId.includes("food-02") || selectedId.includes("elevator-01") || selectedId.includes("vip")) {
      return "West VIP Suite Area";
    }
    return "Main Concourse";
  }, [selectedId]);

  // Cleanup timeline on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.cancel();
      }
    };
  }, []);

  const handlePlayJourney = () => {
    if (!activeRoute || !timelineRef.current) return;

    // Define cinematic travel time (at ~10m/s speed, min 6s, max 16s)
    const duration = Math.max(6, Math.min(16, activeRoute.distanceMeters / 8));

    setCameraMode("route-follow");
    timelineRef.current.play(
      duration,
      (progress) => {
        updateAnimationProgress(progress);
        if (timelineRef.current) {
          updateTimelineState(timelineRef.current.getState());
        }
      },
      () => {
        // Journey complete, focus on the destination node
        setCameraMode("focus");
        const lastNodeId = activeRoute.nodes[activeRoute.nodes.length - 1];
        if (lastNodeId) {
          const destNode = EntityRegistry.getInstance().getById(lastNodeId);
          if (destNode) {
            useSpatialStore.getState().focusOnTarget(
              new THREE.Vector3(destNode.position[0] + 30, destNode.position[1] + 40, destNode.position[2] + 50),
              new THREE.Vector3(...destNode.position)
            );
          }
        }
        if (timelineRef.current) {
          updateTimelineState(timelineRef.current.getState());
        }
      }
    );
  };

  const handlePauseJourney = () => {
    if (timelineRef.current) {
      timelineRef.current.pause();
      updateTimelineState(timelineRef.current.getState());
    }
  };

  const handleResumeJourney = () => {
    if (timelineRef.current) {
      timelineRef.current.resume();
      updateTimelineState(timelineRef.current.getState());
    }
  };

  const handleStopJourney = () => {
    if (timelineRef.current) {
      timelineRef.current.cancel();
      setCameraMode("overview");
      updateTimelineState(timelineRef.current.getState());
    }
  };

  return (
    <div
      className={clsx(
        "w-80 max-h-[88vh] overflow-y-auto select-none",
        "bg-neutral-950/85 backdrop-blur-lg border border-neutral-800 rounded-2xl p-4 space-y-4",
        "pointer-events-auto shadow-2xl transition-all duration-300",
        "scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent text-white"
      )}
      role="region"
      aria-label="Stadium Operational Command Panel"
    >
      {/* HUD Header */}
      <header className="flex items-center justify-between border-b border-neutral-900 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h2 className="text-xs font-bold tracking-widest uppercase font-mono">
            AETHERIS HUD
          </h2>
        </div>
        <span className="text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
          OPERATIONAL DECK
        </span>
      </header>

      {/* Venue Overview info */}
      <section className="space-y-1 bg-neutral-900/30 border border-neutral-900 p-2.5 rounded-xl font-mono text-[10px] text-neutral-400">
        <div className="flex justify-between">
          <span>VENUE:</span>
          <span className="text-white font-semibold">BC Place Vancouver</span>
        </div>
        <div className="flex justify-between">
          <span>ACTIVE ZONE:</span>
          <span className="text-blue-400 font-semibold">{activeZoneName}</span>
        </div>
        <div className="flex justify-between">
          <span>VIEWPORT MODE:</span>
          <span className="text-emerald-400 font-semibold uppercase">{cameraMode}</span>
        </div>
      </section>

      {/* 3D Camera reset / controls */}
      {cameraMode !== "overview" && !timelineState.isPlaying && (
        <button
          onClick={resetToOverview}
          className="w-full flex items-center justify-center space-x-1.5 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 rounded-lg text-xs font-medium transition-all focus:ring-1 focus:ring-blue-500/50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Camera to Overview</span>
        </button>
      )}

      {/* Tactical Route Planner */}
      <section className="border-t border-neutral-900 pt-3 space-y-3" aria-label="Route Planner">
        <div className="flex items-center space-x-1.5">
          <Navigation className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Tactical Navigation
          </span>
        </div>

        {/* Start Point */}
        <div className="space-y-1">
          <label className="text-[9px] text-neutral-500 uppercase font-mono tracking-wider block">
            Start Location
          </label>
          <select
            value={routingStartId || ""}
            onChange={(e) => setRoutingStartId(e.target.value || null)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-blue-500 focus:text-white"
          >
            <option value="">-- Choose Start Node --</option>
            <optgroup label="Gates & Entrances">
              {gates.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </optgroup>
            <optgroup label="Stadium Zones">
              {zones.map((z) => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </optgroup>
            <optgroup label="Points of Interest">
              {pois.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* End Point */}
        <div className="space-y-1">
          <label className="text-[9px] text-neutral-500 uppercase font-mono tracking-wider block">
            Destination
          </label>
          <select
            value={routingEndId || ""}
            onChange={(e) => setRoutingEndId(e.target.value || null)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-blue-500 focus:text-white"
          >
            <option value="">-- Choose Destination --</option>
            <optgroup label="Gates & Entrances">
              {gates.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </optgroup>
            <optgroup label="Stadium Zones">
              {zones.map((z) => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </optgroup>
            <optgroup label="Points of Interest">
              {pois.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Route Type buttons */}
        <div className="space-y-1">
          <label className="text-[9px] text-neutral-500 uppercase font-mono tracking-wider block mb-1">
            Routing Profile
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(["standard", "accessible", "vip", "emergency"] as RouteType[]).map((type) => {
              const Icon = {
                standard: Navigation,
                accessible: Accessibility,
                vip: Crown,
                emergency: Flame,
              }[type];
              
              const activeStyles = {
                standard: "bg-blue-600/20 text-blue-400 border-blue-500/35",
                accessible: "bg-green-600/20 text-green-400 border-green-500/35",
                vip: "bg-amber-600/20 text-amber-400 border-amber-500/35",
                emergency: "bg-red-600/20 text-red-400 border-red-500/35",
              }[type];

              const isActive = routingType === type;

              return (
                <button
                  key={type}
                  onClick={() => setRoutingType(type)}
                  className={clsx(
                    "flex flex-col items-center justify-center py-1.5 px-1 border rounded-lg transition-all focus:outline-none",
                    isActive
                      ? activeStyles
                      : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/70"
                  )}
                  title={`${type.toUpperCase()} Routing Profile`}
                  aria-label={`${type} route type`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  <span className="text-[8px] font-mono uppercase tracking-tighter leading-none">
                    {type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Route Path Metadata */}
        {activeRoute && (
          <div className="bg-neutral-900/50 border border-neutral-850 p-2.5 rounded-xl space-y-2">
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-400">
              <div>
                <span>DISTANCE:</span>
                <span className="block text-white text-xs font-bold">{activeRoute.distanceMeters} meters</span>
              </div>
              <div>
                <span>EST. WALK:</span>
                <span className="block text-white text-xs font-bold">
                  {Math.floor(activeRoute.estimatedWalkTime / 60)}m {activeRoute.estimatedWalkTime % 60}s
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1.5 border-t border-neutral-900">
              <span className="text-[9px] font-mono text-neutral-500">ACCESSIBILITY:</span>
              <span
                className={clsx(
                  "text-[9px] font-bold px-1.5 py-0.5 rounded",
                  activeRoute.accessible
                    ? "bg-green-950/40 text-green-400 border border-green-900/30"
                    : "bg-amber-950/40 text-amber-500 border border-amber-900/30"
                )}
              >
                {activeRoute.accessible ? "Fully Step-Free" : "Stairs on Route"}
              </span>
            </div>

            {/* Cinematic Travel timeline playback buttons */}
            <div className="pt-2 border-t border-neutral-900 space-y-2">
              <span className="text-[9px] font-mono text-neutral-500 block uppercase tracking-wider">
                Cinematic Camera Journey
              </span>
              
              <div className="flex items-center space-x-2">
                {!timelineState.isPlaying ? (
                  <button
                    onClick={handlePlayJourney}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 rounded-lg text-xs font-medium transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Journey</span>
                  </button>
                ) : (
                  <>
                    {timelineState.isPaused ? (
                      <button
                        onClick={handleResumeJourney}
                        className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 hover:text-yellow-300 border border-yellow-500/20 rounded-lg text-xs font-medium transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Resume</span>
                      </button>
                    ) : (
                      <button
                        onClick={handlePauseJourney}
                        className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 hover:text-yellow-300 border border-yellow-500/20 rounded-lg text-xs font-medium transition-all"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </button>
                    )}
                    <button
                      onClick={handleStopJourney}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-750 rounded-lg text-xs font-medium transition-all"
                      title="Stop Journey"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </>
                )}
              </div>

              {/* Progress bar */}
              {timelineState.isPlaying && (
                <div className="space-y-1">
                  <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-neutral-850">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-100 ease-out" 
                      style={{ width: `${timelineState.progress * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-neutral-500">
                    <span>PROGRESS:</span>
                    <span>{Math.round(timelineState.progress * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clear selection */}
        {routingStartId && routingEndId && (
          <button
            onClick={clearRoute}
            className="w-full py-1 text-center text-neutral-500 hover:text-neutral-300 text-[10px] font-mono border-t border-dashed border-neutral-900"
          >
            Reset Planner
          </button>
        )}
      </section>

      {/* Layer Toggle Manager */}
      <div className="border-t border-neutral-900 pt-3">
        <div className="flex items-center space-x-1.5 mb-2.5">
          <Eye className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Layer Overlays
          </span>
        </div>
        <LayerManager />
      </div>

      {/* Entity Selection Details / Dynamic Metadata */}
      <div className="border-t border-neutral-900 pt-3">
        <SelectionLegend />
      </div>

      {/* Accessibility / Help footer */}
      <footer className="flex items-center justify-between border-t border-neutral-900 pt-3 text-[9px] text-neutral-500">
        <div className="flex items-center space-x-1 font-mono">
          <Keyboard className="w-2.5 h-2.5" />
          <span>Tab / Esc navigable</span>
        </div>
        <span className="font-mono">FIFA WC 2026</span>
      </footer>
    </div>
  );
});
export default ControlPanel;
