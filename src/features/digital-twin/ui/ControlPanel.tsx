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
  Flame,
  Sparkles,
  Utensils,
  Navigation2,
  Calendar,
  ShieldAlert,
  Sliders
} from "lucide-react";
import { useExperienceDirector, playConfirmationSound, playClickSound } from "@/features/experience";

export const ControlPanel = React.memo(function ControlPanel() {
  const cameraMode = useSpatialStore((state) => state.cameraMode);
  const setCameraMode = useSpatialStore((state) => state.setCameraMode);
  const resetToOverview = useSpatialStore((state) => state.resetToOverview);
  const selectedId = useSpatialStore((state) => state.selectedId);

  // Experience director roles & audio
  const role = useExperienceDirector((state) => state.role);

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
    if (!selectedId) return "Stadium Overview";
    const selected = EntityRegistry.getInstance().getById(selectedId);
    if (!selected) return "Stadium Overview";
    
    if (selected.type === "zone") {
      return selected.name;
    }
    
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
    playConfirmationSound();

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
        setCameraMode("focus");
        playConfirmationSound();

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

  // Shortcut queries for Fan Experience
  const triggerFanShortcut = (type: 'food' | 'restroom' | 'elevator') => {
    playClickSound();
    if (type === 'food') {
      setRoutingStartId('gate:b');
      setRoutingEndId('poi:food-01');
      setRoutingType('standard');
    } else if (type === 'restroom') {
      setRoutingStartId('gate:a');
      setRoutingEndId('poi:restroom-01');
      setRoutingType('accessible');
    } else {
      setRoutingStartId('gate:d');
      setRoutingEndId('poi:elevator-01');
      setRoutingType('accessible');
    }
  };

  return (
    <div
      className="w-80 max-h-[88vh] overflow-y-auto select-none pointer-events-auto scrollbar-none"
      style={{
        background: 'var(--surface-glass-strong)',
        backdropFilter: 'blur(var(--blur-xl))',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--elevation-3)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-primary)',
      }}
      role="region"
      aria-label="Stadium Operational Command Panel"
    >
      <div className="space-y-5">
        {/* Header */}
        <header
          className="flex items-center justify-between pb-4"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--brand-blue)', color: 'white' }}
            >
              <span className="text-[9px] font-bold">A</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {role === 'fan' ? "Stadium Guide" : "Operations Console"}
              </h2>
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                {role === 'fan' ? "Spectator View" : "Organizer View"}
              </span>
            </div>
          </div>
        </header>

        {/* Context Card */}
        <section
          className="space-y-2 p-3.5 rounded-xl text-xs"
          style={{
            background: 'var(--surface-sunken)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--text-tertiary)' }}>Venue</span>
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Lusail Stadium</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--text-tertiary)' }}>Focus</span>
            <span className="font-medium" style={{ color: 'var(--brand-blue)' }}>{activeZoneName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--text-tertiary)' }}>Camera</span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: 'hsla(214, 86%, 55%, 0.08)',
                color: 'var(--brand-blue)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {cameraMode}
            </span>
          </div>
        </section>

        {/* Camera Reset */}
        {cameraMode !== "overview" && !timelineState.isPlaying && (
          <button
            onClick={resetToOverview}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
            style={{
              background: 'var(--surface-sunken)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Camera</span>
          </button>
        )}

        {/* FAN EXPERIENCE HUD */}
        {role === 'fan' && (
          <div className="space-y-5">
            {/* Quick Actions */}
            <section className="space-y-3" aria-label="Spectator Shortcuts">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Quick Actions
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => triggerFanShortcut('food')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer hover:scale-[0.98]"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--elevation-1)',
                  }}
                >
                  <Utensils className="w-4 h-4 mb-1.5" style={{ color: 'var(--brand-blue)' }} />
                  <span className="text-[9px] font-medium" style={{ color: 'var(--text-secondary)' }}>Food</span>
                </button>

                <button
                  onClick={() => triggerFanShortcut('restroom')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer hover:scale-[0.98]"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--elevation-1)',
                  }}
                >
                  <Navigation2 className="w-4 h-4 mb-1.5" style={{ color: 'var(--brand-emerald)' }} />
                  <span className="text-[9px] font-medium" style={{ color: 'var(--text-secondary)' }}>Restrooms</span>
                </button>

                <button
                  onClick={() => triggerFanShortcut('elevator')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer hover:scale-[0.98]"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--elevation-1)',
                  }}
                >
                  <Accessibility className="w-4 h-4 mb-1.5" style={{ color: 'var(--brand-gold)' }} />
                  <span className="text-[9px] font-medium" style={{ color: 'var(--text-secondary)' }}>Lifts</span>
                </button>
              </div>
            </section>

            {/* Match Info */}
            <section
              className="space-y-2 p-3.5 rounded-xl"
              style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--brand-blue)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Match Info</span>
              </div>
              <div className="space-y-1.5 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                <div className="flex justify-between">
                  <span>Next Match</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>CAN vs ARG</span>
                </div>
                <div className="flex justify-between">
                  <span>Recommended Gate</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Gate B (East)</span>
                </div>
              </div>
            </section>

            {/* AI Insights */}
            <section
              className="space-y-2 p-3.5 rounded-xl relative overflow-hidden"
              style={{
                background: 'var(--color-blue-50)',
                border: '1px solid hsla(214, 86%, 55%, 0.12)',
              }}
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--brand-blue)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--brand-blue)' }}>AI Insight</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Crowd analysis suggests exiting via <span className="font-semibold" style={{ color: 'var(--brand-blue)' }}>South Gate C</span> for a 4-minute faster egress.
              </p>
            </section>
          </div>
        )}

        {/* ORGANIZER HUD */}
        {role === 'organizer' && (
          <div className="space-y-5">
            {/* Route Planner */}
            <section className="space-y-3" aria-label="Route Planner">
              <div className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Route Planner
                </span>
              </div>

              {/* Start Point */}
              <div className="space-y-1">
                <label className="text-[10px] font-medium block" style={{ color: 'var(--text-tertiary)' }}>
                  Start
                </label>
                <select
                  value={routingStartId || ""}
                  onChange={(e) => setRoutingStartId(e.target.value || null)}
                  className="w-full rounded-xl px-3 py-2.5 text-xs outline-none transition-all"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="">Select start…</option>
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
                <label className="text-[10px] font-medium block" style={{ color: 'var(--text-tertiary)' }}>
                  Destination
                </label>
                <select
                  value={routingEndId || ""}
                  onChange={(e) => setRoutingEndId(e.target.value || null)}
                  className="w-full rounded-xl px-3 py-2.5 text-xs outline-none transition-all"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="">Select destination…</option>
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

              {/* Route Profiles */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium block" style={{ color: 'var(--text-tertiary)' }}>
                  Route Type
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["standard", "accessible", "vip", "emergency"] as RouteType[]).map((type) => {
                    const Icon = {
                      standard: Navigation,
                      accessible: Accessibility,
                      vip: Crown,
                      emergency: Flame,
                    }[type];
                    
                    const isActive = routingType === type;
                    const activeColor = {
                      standard: 'var(--brand-blue)',
                      accessible: 'var(--brand-emerald)',
                      vip: 'var(--brand-gold)',
                      emergency: 'var(--brand-red)',
                    }[type];

                    return (
                      <button
                        key={type}
                        onClick={() => setRoutingType(type)}
                        className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all cursor-pointer text-center"
                        style={{
                          background: isActive ? `color-mix(in srgb, ${activeColor} 8%, white)` : 'var(--surface-elevated)',
                          border: `1px solid ${isActive ? `color-mix(in srgb, ${activeColor} 25%, transparent)` : 'var(--border-subtle)'}`,
                          color: isActive ? activeColor : 'var(--text-tertiary)',
                        }}
                        title={`${type.charAt(0).toUpperCase() + type.slice(1)} route`}
                      >
                        <Icon className="w-3.5 h-3.5 mb-1" />
                        <span className="text-[8px] font-semibold capitalize">{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Route */}
              {activeRoute && (
                <div
                  className="p-3.5 rounded-xl space-y-3"
                  style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[9px] block" style={{ color: 'var(--text-tertiary)' }}>Distance</span>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        {activeRoute.distanceMeters}m
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] block" style={{ color: 'var(--text-tertiary)' }}>Est. Time</span>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        {Math.floor(activeRoute.estimatedWalkTime / 60)}m {activeRoute.estimatedWalkTime % 60}s
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px]">
                    <span style={{ color: 'var(--text-tertiary)' }}>Accessibility</span>
                    <span
                      className="font-semibold px-2 py-0.5 rounded-full text-[9px]"
                      style={{
                        background: activeRoute.accessible ? 'var(--color-green-50)' : 'var(--color-amber-50)',
                        color: activeRoute.accessible ? 'var(--brand-emerald)' : 'var(--brand-gold)',
                      }}
                    >
                      {activeRoute.accessible ? "Step-Free" : "Stairs Involved"}
                    </span>
                  </div>

                  {/* Journey Controls */}
                  <div
                    className="pt-3 space-y-2"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}
                  >
                    <span className="text-[9px] font-medium block" style={{ color: 'var(--text-tertiary)' }}>
                      Flythrough Preview
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {!timelineState.isPlaying ? (
                        <button
                          onClick={handlePlayJourney}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
                          style={{
                            background: 'var(--brand-emerald)',
                            color: 'white',
                            boxShadow: 'var(--glow-emerald)',
                          }}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Follow Path</span>
                        </button>
                      ) : (
                        <>
                          {timelineState.isPaused ? (
                            <button
                              onClick={handleResumeJourney}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
                              style={{
                                background: 'var(--brand-gold)',
                                color: 'white',
                              }}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Resume</span>
                            </button>
                          ) : (
                            <button
                              onClick={handlePauseJourney}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
                              style={{
                                background: 'var(--brand-gold)',
                                color: 'white',
                              }}
                            >
                              <Pause className="w-3.5 h-3.5" />
                              <span>Pause</span>
                            </button>
                          )}
                          <button
                            onClick={handleStopJourney}
                            className="px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
                            style={{
                              background: 'var(--surface-elevated)',
                              border: '1px solid var(--border-default)',
                              color: 'var(--text-secondary)',
                            }}
                            title="Stop"
                          >
                            <Square className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </>
                      )}
                    </div>

                    {timelineState.isPlaying && (
                      <div className="space-y-1">
                        <div
                          className="w-full rounded-full h-1.5 overflow-hidden"
                          style={{ background: 'var(--border-default)' }}
                        >
                          <div 
                            className="h-full rounded-full transition-all duration-100 ease-out"
                            style={{
                              width: `${timelineState.progress * 100}%`,
                              background: 'var(--brand-emerald)',
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px]" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                          <span>Progress</span>
                          <span>{Math.round(timelineState.progress * 100)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reset */}
              {routingStartId && routingEndId && (
                <button
                  onClick={clearRoute}
                  className="w-full py-2 text-center text-[10px] font-medium cursor-pointer transition-opacity hover:opacity-70"
                  style={{
                    color: 'var(--text-tertiary)',
                    borderTop: '1px dashed var(--border-default)',
                  }}
                >
                  Reset Route
                </button>
              )}
            </section>

            {/* Active Incidents */}
            <section className="space-y-2.5" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Active Incidents
                </span>
              </div>

              <div className="space-y-2">
                <div
                  className="p-3 rounded-xl flex items-start gap-2.5"
                  style={{
                    background: 'var(--color-red-50)',
                    border: '1px solid hsla(0, 78%, 55%, 0.15)',
                  }}
                >
                  <div>
                    <span
                      className="text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase"
                      style={{
                        background: 'hsla(0, 78%, 55%, 0.1)',
                        color: 'var(--brand-red)',
                      }}
                    >
                      Critical
                    </span>
                    <p className="text-[10px] font-medium mt-1" style={{ color: 'var(--text-primary)' }}>Medical assistance: Gate A</p>
                    <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Steward dispatched (2m ago)</p>
                  </div>
                </div>
              </div>
            </section>

            {/* AI Insights (Organizer) */}
            <section
              className="space-y-2 p-3.5 rounded-xl relative overflow-hidden"
              style={{
                background: 'var(--color-blue-50)',
                border: '1px solid hsla(214, 86%, 55%, 0.12)',
              }}
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--brand-blue)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--brand-blue)' }}>AI Recommendation</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Dispatch <span className="font-semibold" style={{ color: 'var(--brand-blue)' }}>Steward 14</span> to North Stand Gate A for visual guidance headset sync requests.
              </p>
            </section>
          </div>
        )}

        {/* Layer Manager */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
          <div className="flex items-center gap-1.5 mb-3">
            <Eye className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
              Display Layers
            </span>
          </div>
          <LayerManager />
        </div>

        {/* Selection Legend */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
          <SelectionLegend />
        </div>

        {/* Footer */}
        <footer
          className="flex items-center justify-between text-[10px] pt-3"
          style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-disabled)' }}
        >
          <div className="flex items-center gap-1">
            <Keyboard className="w-3 h-3" />
            <span>Tab / Esc navigable</span>
          </div>
          <span>FIFA WC 2026</span>
        </footer>
      </div>
    </div>
  );
});
export default ControlPanel;
