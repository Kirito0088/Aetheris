"use client";

import React, { useEffect, useRef, useState } from "react";
import { UnifiedStadiumMap } from "@/components/shared/UnifiedStadiumMap";
import { useRealtimeIncidents, useRealtimeZones } from "@/hooks";
import { Users, AlertTriangle, ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { IntelligencePanel } from "@/components/shared/IntelligencePanel";

export default function VenueOperationsDashboard() {
  const { incidents, loading: incidentsLoading } = useRealtimeIncidents();
  const { zones, loading: zonesLoading } = useRealtimeZones();
  const [currentTime, setCurrentTime] = useState("--:--:--");
  const [criticalZoneIds, setCriticalZoneIds] = useState<string[]>([]);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [optimisticallyResolvedIds, setOptimisticallyResolvedIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [resolveError, setResolveError] = useState<string | null>(null);
  const resolveInFlight = useRef(new Set<string>());

  const handleResolveIncident = async (incidentId: string) => {
    if (resolveInFlight.current.has(incidentId)) return;

    resolveInFlight.current.add(incidentId);
    setOptimisticallyResolvedIds((previous) => new Set(previous).add(incidentId));
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
        throw error ?? new Error("This incident is no longer available to resolve.");
      }
    } catch (err) {
      console.error("Unexpected error resolving incident:", err);
      setOptimisticallyResolvedIds((previous) => {
        const next = new Set(previous);
        next.delete(incidentId);
        return next;
      });
      setResolveError(
        err instanceof Error ? err.message : "Unable to resolve the incident. Please try again.",
      );
    } finally {
      resolveInFlight.current.delete(incidentId);
      setResolvingId(null);
    }
  };

  // Render a stable SSR/client placeholder first. Reading the clock during
  // render creates different HTML on the server and browser and can abort
  // hydration for this operational dashboard.
  useEffect(() => {
    const updateCurrentTime = () => setCurrentTime(new Date().toLocaleTimeString());
    updateCurrentTime();
    const intervalId = window.setInterval(updateCurrentTime, 1_000);
    return () => window.clearInterval(intervalId);
  }, []);

  if (incidentsLoading || zonesLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-screen flex flex-col font-sans animate-pulse">
        {/* Header Skeleton */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-border-subtle">
          <div>
            <div className="h-8 w-64 bg-surface-base rounded-md mb-2" />
            <div className="h-4 w-40 bg-surface-base rounded-md" />
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="h-10 w-36 bg-surface-base rounded-lg" />
            <div className="h-6 w-24 bg-surface-base rounded-md" />
          </div>
        </header>

        {/* Main Grid Layout Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
          {/* Spatial Canvas Skeleton */}
          <section className="xl:col-span-8 flex flex-col bg-surface-elevated rounded-3xl border border-border-subtle shadow-elevation-1 p-4 min-h-[500px] xl:min-h-[700px]">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
              <div className="h-5 w-48 bg-surface-base rounded-md" />
              <div className="h-5 w-24 bg-surface-base rounded-md" />
            </div>
            <div className="flex-1 bg-surface-base rounded-2xl flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-brand-blue/20 border-t-brand-blue animate-spin" />
            </div>
          </section>

          {/* Telemetry Bento Skeleton */}
          <section className="xl:col-span-4 flex flex-col gap-4">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-elevated rounded-2xl p-5 border border-border-subtle shadow-elevation-1 h-32 flex flex-col justify-between">
                <div className="h-4 w-20 bg-surface-base rounded-md" />
                <div className="h-8 w-24 bg-surface-base rounded-md" />
                <div className="h-3 w-16 bg-surface-base rounded-md" />
              </div>
              <div className="bg-surface-elevated rounded-2xl p-5 border border-border-subtle shadow-elevation-1 h-32 flex flex-col justify-between">
                <div className="h-4 w-20 bg-surface-base rounded-md" />
                <div className="h-8 w-24 bg-surface-base rounded-md" />
                <div className="h-3 w-16 bg-surface-base rounded-md" />
              </div>
            </div>

            {/* Active Incidents */}
            <div className="bg-surface-elevated rounded-2xl p-5 border border-border-subtle shadow-elevation-1 flex-1 flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 w-32 bg-surface-base rounded-md" />
                <div className="h-5 w-16 bg-surface-base rounded-md" />
              </div>
              <div className="space-y-3">
                <div className="h-24 bg-surface-base rounded-xl border border-border-subtle" />
                <div className="h-24 bg-surface-base rounded-xl border border-border-subtle" />
              </div>
            </div>

            {/* Zone Density Radar */}
            <div className="bg-surface-elevated rounded-2xl p-5 border border-border-subtle shadow-elevation-1">
              <div className="h-4 w-32 bg-surface-base rounded-md mb-4" />
              <div className="space-y-2">
                <div className="h-10 bg-surface-base rounded-lg border border-border-subtle" />
                <div className="h-10 bg-surface-base rounded-lg border border-border-subtle" />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const totalCapacity = zones.reduce((acc, z) => acc + (z.capacity || 0), 0);
  const currentThroughput = zones.reduce((acc, z) => acc + (z.throughput || 0), 0);
  
  const activeIncidents = incidents.filter((incident) => !optimisticallyResolvedIds.has(incident.id));
  const criticalZones = zones.filter(z => z.crowd_density === 'critical' || z.crowd_density === 'high');

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-border-subtle">
        <div>
          <h1 className="text-[length:var(--font-size-3xl)] font-bold text-text-primary tracking-tight">Estadio Azteca Command</h1>
          <p className="text-[length:var(--font-size-sm)] text-text-secondary font-medium mt-1">Global Matchday Operations • Live Telemetry</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-surface-elevated border border-border-subtle px-4 py-2 rounded-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-emerald"></span>
            </span>
            <span className="text-[length:var(--font-size-sm)] font-bold font-mono text-brand-emerald tracking-wide">SYSTEM NOMINAL</span>
          </div>
          <div className="text-[length:var(--font-size-sm)] font-mono text-text-tertiary">
            <Clock className="inline w-4 h-4 mr-1 mb-0.5" />
            {currentTime}
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
        
        {/* Spatial Canvas (Left Panel - Span 7 or 8) */}
        <section className="xl:col-span-8 flex flex-col bg-surface-elevated rounded-3xl border border-border-subtle shadow-elevation-1 p-2">
          <div className="px-4 py-3 flex items-center justify-between border-b border-border-subtle mb-2">
            <h2 className="text-[length:var(--font-size-base)] font-bold text-text-primary flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-blue" /> Unified Spatial Canvas
            </h2>
            <div className="flex gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-surface-sunken px-2 py-1 rounded text-text-secondary">Heatmap</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-surface-sunken px-2 py-1 rounded text-text-secondary">Incidents</span>
            </div>
          </div>
          <div className="flex-1 min-h-[500px] xl:min-h-[700px] relative rounded-2xl overflow-hidden">
            <UnifiedStadiumMap mode="operations" zones={zones} incidents={incidents} criticalZoneIds={criticalZoneIds} />
          </div>
        </section>

        {/* Telemetry Bento (Right Panel - Span 4 or 5) */}
        <section className="xl:col-span-4 flex flex-col gap-4">
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-elevated rounded-2xl p-5 border border-border-subtle shadow-elevation-1">
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <Users className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Live Throughput</span>
              </div>
              <div className="text-[length:var(--font-size-3xl)] font-bold text-text-primary font-mono tracking-tight flex items-baseline gap-2">
                {currentThroughput.toLocaleString()}
                <span className="text-[length:var(--font-size-sm)] text-state-danger flex items-center"><ArrowUpRight className="w-4 h-4" /> 12%</span>
              </div>
              <p className="text-[10px] text-text-tertiary font-mono uppercase mt-1">Pax / Minute</p>
            </div>
            
            <div className="bg-surface-elevated rounded-2xl p-5 border border-border-subtle shadow-elevation-1">
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Capacity Load</span>
              </div>
              <div className="text-[length:var(--font-size-3xl)] font-bold text-text-primary font-mono tracking-tight flex items-baseline gap-2">
                {totalCapacity > 0 ? Math.round((currentThroughput / totalCapacity) * 100) : 0}%
                <span className="text-[length:var(--font-size-sm)] text-brand-emerald flex items-center"><ArrowDownRight className="w-4 h-4" /></span>
              </div>
              <p className="text-[10px] text-text-tertiary font-mono uppercase mt-1">Total Venue</p>
            </div>
          </div>

          {/* AI Intelligence Panel */}
          <div className="bg-surface-elevated rounded-2xl border border-border-subtle shadow-elevation-1 overflow-hidden">
            <IntelligencePanel
              zones={zones}
              incidents={incidents}
              onCriticalZonesChange={setCriticalZoneIds}
            />
          </div>

          {/* Active Incidents */}
          <div className="bg-surface-elevated rounded-2xl p-5 border border-border-subtle shadow-elevation-1 flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-state-danger" />
                <h2 className="text-[length:var(--font-size-base)] font-bold text-text-primary">Active Incidents</h2>
              </div>
              <span className="bg-state-danger/10 text-state-danger text-[10px] font-bold px-2 py-1 rounded-md">{activeIncidents.length} Open</span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              {resolveError && (
                <p role="alert" className="rounded-lg border border-state-danger/30 bg-state-danger/10 p-3 text-xs font-medium text-state-danger">
                  {resolveError}
                </p>
              )}
              {activeIncidents.map(inc => {
                const zone = zones.find(z => z.id === inc.location_zone_id);
                return (
                  <motion.article
                    key={inc.id}
                    layout
                    data-testid="active-incident-card"
                    aria-label={`Incident: ${inc.title}`}
                    className="p-4 rounded-xl border border-border-subtle bg-surface-base hover:border-state-danger/30 transition-colors group relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-state-danger" />
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-state-danger uppercase tracking-wider font-bold">Priority: {inc.priority}</span>
                      <span className="text-[10px] font-mono text-text-tertiary">{new Date(inc.reported_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <h3 className="text-[length:var(--font-size-sm)] font-bold text-text-primary mb-1">{inc.title}</h3>
                    <p className="text-[length:var(--font-size-xs)] text-text-secondary font-mono mb-3">{zone?.name || inc.location_zone_id}</p>
                    <p className="mb-3 line-clamp-2 text-xs text-text-secondary">{inc.description}</p>
                    
                    <button 
                      onClick={() => handleResolveIncident(inc.id)}
                      disabled={resolvingId === inc.id}
                      className="text-[10px] font-bold uppercase tracking-wider bg-surface-sunken hover:bg-surface-elevated border border-border-strong px-3 py-1.5 rounded transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      {resolvingId === inc.id ? (
                        <>
                          <span className="w-3 h-3 border-2 border-text-secondary/35 border-t-text-primary rounded-full animate-spin" />
                          Resolving...
                        </>
                      ) : (
                        "Dispatch & Resolve"
                      )}
                    </button>
                  </motion.article>
                );
              })}
              {activeIncidents.length === 0 && (
                <div className="h-full flex items-center justify-center text-[length:var(--font-size-sm)] text-text-tertiary font-mono">
                  No active incidents.
                </div>
              )}
            </div>
          </div>

          {/* Zone Density Radar */}
          <div className="bg-surface-elevated rounded-2xl p-5 border border-border-subtle shadow-elevation-1">
            <h2 className="text-[length:var(--font-size-sm)] font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-blue" /> Density Alerts
            </h2>
            <div className="space-y-2">
              {criticalZones.map(zone => (
                <div key={zone.id} className="flex items-center justify-between p-3 bg-surface-base border border-border-subtle rounded-lg">
                  <span className="text-[length:var(--font-size-sm)] font-mono text-text-primary">{zone.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-text-tertiary">{zone.throughput} pax/min</span>
                    <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${zone.crowd_density === 'critical' ? 'bg-state-danger' : 'bg-state-warning'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}
