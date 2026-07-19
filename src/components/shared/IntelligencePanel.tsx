"use client";

import React, { useEffect, useState, useRef } from "react";
import { type Tables } from "@/types/supabase";
import { getVenueIntelligence, type VenueIntelligenceResult } from "@/app/actions/intelligence";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

interface IntelligencePanelProps {
  zones: Tables<'zones'>[];
  incidents: Tables<'incidents'>[];
  onCriticalZonesChange?: (zoneIds: string[]) => void;
}

export function IntelligencePanel({ zones, incidents, onCriticalZonesChange }: IntelligencePanelProps) {
  const [data, setData] = useState<VenueIntelligenceResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const lastFetchRef = useRef<number>(0);
  const onCriticalZonesChangeRef = useRef(onCriticalZonesChange);

  useEffect(() => {
    onCriticalZonesChangeRef.current = onCriticalZonesChange;
  }, [onCriticalZonesChange]);

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout;

    const fetchIntelligence = async () => {
      setLoading(true);
      const { data: result, error: fetchError } = await getVenueIntelligence(
        zones.map(z => ({
          id: z.id,
          name: z.name,
          crowd_density: z.crowd_density || 'low',
          throughput: z.throughput || 0,
          capacity: z.capacity || 0,
        })),
        incidents.map(i => ({
          id: i.id,
          title: i.title,
          description: i.description || '',
          priority: i.priority || 'low',
          status: i.status || 'open',
          location_zone_id: i.location_zone_id || '',
        }))
      );

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError);
      } else if (result) {
        setData(result);
        setError(null);
        if (onCriticalZonesChangeRef.current) {
          const criticalIds = result.predictions
            .filter(p => p.severity === 'critical')
            .map(p => p.zoneId);
          onCriticalZonesChangeRef.current(criticalIds);
        }
      }
      setLoading(false);
      lastFetchRef.current = Date.now();
    };

    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchRef.current;

    if (timeSinceLastFetch >= 30000) {
      fetchIntelligence();
    } else {
      timer = setTimeout(fetchIntelligence, 30000 - timeSinceLastFetch);
    }

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [zones, incidents]);

  if (loading && !data) {
    return (
      <div className="p-5 flex flex-col gap-4 animate-pulse">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-brand-blue" />
          <h2 className="text-[length:var(--font-size-base)] font-bold text-text-primary">Venue Intelligence</h2>
        </div>
        <div className="h-6 w-32 bg-surface-base rounded-md" />
        <div className="h-4 w-full bg-surface-base rounded-md" />
        <div className="space-y-3 mt-4">
          <div className="h-24 bg-surface-base rounded-xl border border-border-subtle" />
          <div className="h-24 bg-surface-base rounded-xl border border-border-subtle" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-brand-blue" />
          <h2 className="text-[length:var(--font-size-base)] font-bold text-text-primary">Venue Intelligence</h2>
        </div>
        <div className="text-[length:var(--font-size-sm)] text-text-secondary bg-surface-base p-4 rounded-xl border border-border-subtle">
          AI unavailable. {error}
        </div>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20';
      case 'moderate': return 'text-state-warning bg-state-warning/10 border-state-warning/20';
      case 'high':
      case 'critical': return 'text-state-danger bg-state-danger/10 border-state-danger/20';
      default: return 'text-text-secondary bg-surface-base border-border-subtle';
    }
  };
  
  const getSeverityBorderColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-brand-blue';
      case 'warning': return 'bg-state-warning';
      case 'critical': return 'bg-state-danger';
      default: return 'bg-border-subtle';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'info': return 'text-brand-blue bg-brand-blue/10';
      case 'warning': return 'text-state-warning bg-state-warning/10';
      case 'critical': return 'text-state-danger bg-state-danger/10';
      default: return 'text-text-secondary bg-surface-base';
    }
  };

  return (
    <div className="p-5 flex flex-col gap-4 bg-surface-elevated">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-blue" />
          <h2 className="text-[length:var(--font-size-base)] font-bold text-text-primary">Venue Intelligence</h2>
        </div>
        <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getRiskColor(data.overallRisk)}`}>
          {data.overallRisk} Risk
        </div>
      </div>
      
      <p className="text-[length:var(--font-size-sm)] text-text-secondary">
        {data.summary}
      </p>

      <div className="mt-2 space-y-3">
        <AnimatePresence>
          {data.predictions.map((pred, idx) => (
            <motion.div
              key={`${pred.zoneId}-${idx}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative p-4 rounded-xl border border-border-subtle bg-surface-base shadow-elevation-1 overflow-hidden"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${getSeverityBorderColor(pred.severity)}`} />
              <div className="flex justify-between items-start mb-1 pl-2">
                <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded ${getSeverityBadge(pred.severity)}`}>
                  {pred.severity}
                </span>
                <span className="text-[10px] font-mono text-text-tertiary">{pred.zoneId}</span>
              </div>
              <h3 className="text-[length:var(--font-size-sm)] font-bold text-text-primary mt-2 mb-1 pl-2">{pred.title}</h3>
              <p className="text-xs text-text-secondary pl-2">{pred.description}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
