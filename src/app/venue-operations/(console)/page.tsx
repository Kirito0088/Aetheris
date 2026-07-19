"use client";

/**
 * Venue Operations Dashboard — Stitch Design Integration
 *
 * Complete visual rebuild matching the Stitch "Venue Operations Map" design.
 * Uses the Stitch bento-grid layout with editorial typography.
 *
 * DATA PIPELINES (preserved 1:1):
 * - useRealtimeIncidents() → Supabase realtime incidents feed
 * - useRealtimeZones() → Supabase realtime zone telemetry
 * - handleResolveIncident() → optimistic UI + Supabase mutation
 * - IntelligencePanel → Gemini AI crowd predictions
 * - UnifiedStadiumMap → shared SVG map component
 */

import React, { useEffect, useRef, useState } from "react";
import { UnifiedStadiumMap } from "@/components/shared/UnifiedStadiumMap";
import { useRealtimeIncidents, useRealtimeZones } from "@/hooks";
import {
  AlertTriangle,
  Brain,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { IntelligencePanel } from "@/components/shared/IntelligencePanel";

// =============================================================================
// ANIMATION VARIANTS (Stitch cinematic choreography)
// =============================================================================

const CINEMATIC_EASE = [0.2, 0.8, 0.2, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 280,
      damping: 26,
    },
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function VenueOperationsDashboard() {
  const { incidents, loading: incidentsLoading } = useRealtimeIncidents();
  const { zones, loading: zonesLoading } = useRealtimeZones();
  const [currentTime, setCurrentTime] = useState("--:--:--");
  const [criticalZoneIds, setCriticalZoneIds] = useState<string[]>([]);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [optimisticallyResolvedIds, setOptimisticallyResolvedIds] = useState<
    Set<string>
  >(() => new Set());
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [showAiBanner, setShowAiBanner] = useState(true);
  const resolveInFlight = useRef(new Set<string>());
  const prefersReducedMotion = useReducedMotion();

  // -------------------------------------------------------------------------
  // Incident resolution handler (optimistic UI + Supabase mutation)
  // -------------------------------------------------------------------------
  const handleResolveIncident = async (incidentId: string) => {
    if (resolveInFlight.current.has(incidentId)) return;

    resolveInFlight.current.add(incidentId);
    setOptimisticallyResolvedIds(
      (previous) => new Set(previous).add(incidentId),
    );
    setResolveError(null);
    try {
      setResolvingId(incidentId);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("incidents")
        .update({ status: "resolved" })
        .eq("id", incidentId)
        .select("id")
        .maybeSingle();

      if (error || !data) {
        throw (
          error ??
          new Error("This incident is no longer available to resolve.")
        );
      }
    } catch (err) {
      console.error("Unexpected error resolving incident:", err);
      setOptimisticallyResolvedIds((previous) => {
        const next = new Set(previous);
        next.delete(incidentId);
        return next;
      });
      setResolveError(
        err instanceof Error
          ? err.message
          : "Unable to resolve the incident. Please try again.",
      );
    } finally {
      resolveInFlight.current.delete(incidentId);
      setResolvingId(null);
    }
  };

  // -------------------------------------------------------------------------
  // Clock (client-only to prevent hydration mismatch)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const updateCurrentTime = () =>
      setCurrentTime(new Date().toLocaleTimeString());
    updateCurrentTime();
    const intervalId = window.setInterval(updateCurrentTime, 1_000);
    return () => window.clearInterval(intervalId);
  }, []);

  // -------------------------------------------------------------------------
  // Loading State (Stitch bento skeleton)
  // -------------------------------------------------------------------------
  if (incidentsLoading || zonesLoading) {
    return (
      <div className="p-12 max-w-[1600px] mx-auto w-full animate-pulse">
        {/* AI Banner Skeleton */}
        <div className="bento-card mb-6 h-20 flex items-center gap-6 border-l-4 border-l-[var(--brand-blue)]">
          <div className="w-12 h-12 rounded-full bg-[var(--surface-sunken)]" />
          <div className="flex-grow space-y-2">
            <div className="h-3 w-48 bg-[var(--surface-sunken)] rounded" />
            <div className="h-5 w-96 bg-[var(--surface-sunken)] rounded" />
          </div>
        </div>
        {/* Grid Skeleton */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 bento-card h-[calc(100vh-280px)] flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-[var(--brand-blue)]/20 border-t-[var(--brand-blue)] animate-spin" />
          </div>
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bento-card h-32" />
            <div className="bento-card h-64" />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Derived data
  // -------------------------------------------------------------------------
  const totalCapacity = zones.reduce((acc, z) => acc + (z.capacity || 0), 0);
  const currentThroughput = zones.reduce(
    (acc, z) => acc + (z.throughput || 0),
    0,
  );
  const occupancyPercent =
    totalCapacity > 0
      ? Math.round((currentThroughput / totalCapacity) * 100)
      : 0;

  const activeIncidents = incidents.filter(
    (incident) => !optimisticallyResolvedIds.has(incident.id),
  );
  const criticalZones = zones.filter(
    (z) => z.crowd_density === "critical" || z.crowd_density === "high",
  );

  // Find the first AI recommendation text
  const aiRecommendation =
    criticalZones.length > 0
      ? `Head towards Gate C to alleviate ${criticalZones[0]?.name || "Sector 104"} congestion. Redirecting crowd flow.`
      : "All zones operating within normal parameters. No action required.";

  return (
    <motion.div
      className="p-6 lg:p-12 max-w-[1600px] mx-auto w-full"
      variants={prefersReducedMotion ? undefined : containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ================================================================= */}
      {/* AI Operations Recommendation Banner                               */}
      {/* ================================================================= */}
      <AnimatePresence>
        {showAiBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" }}
            transition={{
              duration: 0.5,
              ease: CINEMATIC_EASE,
            }}
            className="bento-card flex items-center gap-6 py-4 px-6 mb-6 border-l-4 border-l-[var(--brand-blue)] relative overflow-hidden"
          >
            {/* Gradient accent background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-blue)]/5 to-transparent pointer-events-none" />

            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-[var(--brand-blue)]/10 flex items-center justify-center text-[var(--brand-blue)] shrink-0 relative z-10">
              <Brain className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-grow relative z-10">
              <h3
                className="text-xs font-bold tracking-[0.05em] uppercase text-[var(--brand-blue)] mb-1 flex items-center gap-2"
                style={{ fontFamily: "var(--font-data)" }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Operations Recommendation
              </h3>
              <p
                className="text-base text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {aiRecommendation}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowAiBanner(false)}
              className="shrink-0 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-2 rounded-full hover:bg-[var(--surface-sunken)] transition-colors relative z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* Main Bento Grid: 8-col Map + 4-col Telemetry                     */}
      {/* ================================================================= */}
      <div className="grid grid-cols-12 gap-6">
        {/* ─────────────────────────────────────────────────────────────── */}
        {/* LEFT: Interactive Stadium Map (8 cols)                          */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          className="col-span-12 lg:col-span-8 flex flex-col h-[calc(100vh-220px)]"
        >
          <div className="bento-card flex-grow flex flex-col relative overflow-hidden !p-0">
            {/* Map Header */}
            <div className="p-6 border-b border-[var(--stitch-stone-200)]/60 flex justify-between items-center z-10 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <h2
                  className="text-2xl font-medium text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  Live Venue Map
                </h2>
                <span
                  className="text-xs text-[var(--text-tertiary)] px-2 py-1 rounded bg-[var(--surface-sunken)] font-medium"
                  style={{ fontFamily: "var(--font-data)" }}
                >
                  {currentTime}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 border border-[var(--stitch-stone-200)] rounded text-[var(--text-tertiary)] hover:bg-[var(--surface-sunken)] transition-colors">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button className="p-2 border border-[var(--stitch-stone-200)] rounded text-[var(--text-tertiary)] hover:bg-[var(--surface-sunken)] transition-colors">
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div className="flex-grow relative">
              <UnifiedStadiumMap
                mode="operations"
                zones={zones}
                incidents={incidents}
                criticalZoneIds={criticalZoneIds}
              />
            </div>
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* RIGHT: Feeds & Telemetry (4 cols)                              */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-[calc(100vh-220px)] overflow-y-auto pr-2 pb-8 stitch-scrollbar">
          {/* ─── Venue Telemetry ─── */}
          <motion.div variants={itemVariants} className="bento-card !p-6">
            <h3
              className="text-xs font-bold tracking-[0.05em] uppercase text-[var(--text-tertiary)] mb-4 border-b border-[var(--stitch-stone-200)] pb-2"
              style={{ fontFamily: "var(--font-data)" }}
            >
              Venue Telemetry
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span
                  className="block text-[10px] font-bold tracking-[0.05em] uppercase text-[var(--text-tertiary)]"
                  style={{ fontFamily: "var(--font-data)" }}
                >
                  Occupancy
                </span>
                <span
                  className="text-lg font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-data)" }}
                >
                  {currentThroughput.toLocaleString()}
                </span>
                <span className="text-xs text-[var(--state-success)] block">
                  {occupancyPercent}% Capacity
                </span>
              </div>
              <div>
                <span
                  className="block text-[10px] font-bold tracking-[0.05em] uppercase text-[var(--text-tertiary)]"
                  style={{ fontFamily: "var(--font-data)" }}
                >
                  Ingress Flow
                </span>
                <span
                  className="text-lg font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-data)" }}
                >
                  {criticalZones.length > 0
                    ? `${criticalZones[0]?.throughput || 420}/min`
                    : "420/min"}
                </span>
                <span className="text-xs text-[var(--state-warning)] block">
                  {criticalZones.length > 0
                    ? `Delay at ${criticalZones[0]?.name}`
                    : "Normal Flow"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* ─── AI Intelligence Panel ─── */}
          <motion.div
            variants={itemVariants}
            className="bento-card !p-0 overflow-hidden"
          >
            <IntelligencePanel
              zones={zones}
              incidents={incidents}
              onCriticalZonesChange={setCriticalZoneIds}
            />
          </motion.div>

          {/* ─── Active Incidents Feed ─── */}
          <motion.div
            variants={itemVariants}
            className="bento-card !p-0 flex-grow flex flex-col"
          >
            {/* Incidents Header */}
            <div className="p-6 border-b border-[var(--stitch-stone-200)] flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[var(--stitch-accent-red)]" />
                <h2
                  className="text-2xl font-medium text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  Active Incidents
                </h2>
              </div>
              <span
                className="bg-[var(--stitch-error-container)] text-[var(--stitch-on-error-container)] px-2 py-1 rounded text-[10px] font-bold tracking-[0.05em] uppercase"
                style={{ fontFamily: "var(--font-data)" }}
              >
                {activeIncidents.length} OPEN
              </span>
            </div>

            {/* Incidents List */}
            <div className="p-6 flex flex-col gap-4">
              {resolveError && (
                <p
                  role="alert"
                  className="rounded-lg border border-[var(--state-danger)]/30 bg-[var(--state-danger)]/10 p-3 text-xs font-medium text-[var(--state-danger)]"
                >
                  {resolveError}
                </p>
              )}

              <AnimatePresence mode="popLayout">
                {activeIncidents.map((inc) => {
                  const zone = zones.find(
                    (z) => z.id === inc.location_zone_id,
                  );
                  const isHigh =
                    inc.priority === "high" || (inc.priority as string) === "critical";

                  return (
                    <motion.div
                      key={inc.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        transition: { duration: 0.2 },
                      }}
                      data-testid="active-incident-card"
                      aria-label={`Incident: ${inc.title}`}
                      className={`border border-[var(--stitch-stone-200)] rounded-lg p-4 border-l-4 ${
                        isHigh
                          ? "border-l-[var(--stitch-accent-red)]"
                          : "border-l-[var(--state-warning)]"
                      } bg-[var(--stitch-surface)] relative`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`text-[10px] font-bold tracking-[0.05em] uppercase ${
                            isHigh
                              ? "text-[var(--stitch-accent-red)]"
                              : "text-[var(--state-warning)]"
                          }`}
                          style={{ fontFamily: "var(--font-data)" }}
                        >
                          PRIORITY: {inc.priority?.toUpperCase() || "MEDIUM"}
                        </span>
                        <span
                          className="text-xs text-[var(--text-tertiary)]"
                          style={{ fontFamily: "var(--font-data)" }}
                        >
                          {new Date(inc.reported_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <h4
                        className="text-lg font-semibold text-[var(--text-primary)] mb-1"
                        style={{ fontFamily: "var(--font-headline)" }}
                      >
                        {inc.title}
                      </h4>
                      <p
                        className="text-sm text-[var(--text-tertiary)] mb-4"
                        style={{ fontFamily: "var(--font-data)" }}
                      >
                        {zone?.name || inc.location_zone_id}
                      </p>
                      {inc.description && (
                        <p className="mb-3 line-clamp-2 text-xs text-[var(--text-secondary)]">
                          {inc.description}
                        </p>
                      )}
                      <button
                        onClick={() => handleResolveIncident(inc.id)}
                        disabled={resolvingId === inc.id}
                        className="w-full py-2 bg-white border border-[var(--stitch-stone-200)] rounded text-xs font-bold tracking-[0.05em] uppercase text-[var(--text-primary)] hover:bg-[var(--surface-sunken)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                        style={{ fontFamily: "var(--font-data)" }}
                      >
                        {resolvingId === inc.id ? (
                          <>
                            <span className="w-3 h-3 border-2 border-[var(--text-tertiary)]/35 border-t-[var(--text-primary)] rounded-full animate-spin" />
                            Resolving...
                          </>
                        ) : (
                          "DISPATCH & RESOLVE"
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {activeIncidents.length === 0 && (
                <div
                  className="h-24 flex items-center justify-center text-sm text-[var(--text-tertiary)]"
                  style={{ fontFamily: "var(--font-data)" }}
                >
                  No active incidents.
                </div>
              )}
            </div>
          </motion.div>

          {/* ─── Zone Density Radar ─── */}
          <motion.div variants={itemVariants} className="bento-card !p-6">
            <h2
              className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              <span className="w-2 h-2 rounded-full bg-[var(--brand-blue)]" />
              Density Alerts
            </h2>
            <div className="space-y-2">
              {criticalZones.map((zone) => (
                <div
                  key={zone.id}
                  className="flex items-center justify-between p-3 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-lg"
                >
                  <span
                    className="text-sm text-[var(--text-primary)]"
                    style={{ fontFamily: "var(--font-data)" }}
                  >
                    {zone.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[10px] text-[var(--text-tertiary)]"
                      style={{ fontFamily: "var(--font-data)" }}
                    >
                      {zone.throughput} pax/min
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                        (zone.crowd_density as string) === "critical"
                          ? "bg-[var(--state-danger)]"
                          : "bg-[var(--state-warning)]"
                      }`}
                    />
                  </div>
                </div>
              ))}
              {criticalZones.length === 0 && (
                <p
                  className="text-xs text-[var(--text-tertiary)] text-center py-4"
                  style={{ fontFamily: "var(--font-data)" }}
                >
                  All zones within normal limits.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
