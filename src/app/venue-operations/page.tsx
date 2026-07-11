"use client";

import React from "react";
import { MatchdayTimeline } from "@/features/intelligence/components/MatchdayTimeline";
import { VenueGuide } from "@/features/intelligence/components/VenueGuide";
import { AIRecommendation } from "@/features/intelligence/components/AIRecommendation";
import { StatusIndicator, CrowdIndicator } from "@/features/intelligence/components/Indicators";
import { VENUE_ZONES } from "@/features/intelligence/data/venue-data";

export default function VenueOperationsDashboard() {
  return (
    <div className="space-y-6">
      {/* Top Section: Timeline & Quick Stats */}
      <section className="bg-surface-elevated rounded-2xl p-6 border border-border-subtle shadow-elevation-1">
        <h2 className="text-[length:var(--font-size-base)] font-semibold text-text-primary mb-4 tracking-tight">
          Matchday Timeline
        </h2>
        <MatchdayTimeline />
      </section>

      {/* Middle Section: Intelligence & Venue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <section className="bg-surface-elevated rounded-2xl p-6 border border-border-subtle shadow-elevation-1 flex-1 flex flex-col min-h-[500px]">
            <h2 className="text-[length:var(--font-size-base)] font-semibold text-text-primary mb-4 tracking-tight">
              Operational Venue Guide
            </h2>
            <div className="flex-1 relative rounded-xl border border-border-subtle overflow-hidden bg-surface-base">
              <VenueGuide />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-[length:var(--font-size-base)] font-semibold text-text-primary mb-4 tracking-tight">
              AI Insights
            </h2>
            <div className="space-y-4">
              <AIRecommendation
                title="Congestion Predicted"
                description="Gate C is experiencing a 15% higher influx than predicted. Recommend rerouting incoming Fan paths to Gate D."
                actionLabel="Dispatch Volunteers"
                type="dispatch"
              />
              <AIRecommendation
                title="Concession Optimization"
                description="Level 1 Food stands will peak in 12 mins. Recommend opening 3 additional registers."
                actionLabel="Notify Vendors"
                type="info"
              />
            </div>
          </section>

          <section className="bg-surface-elevated rounded-2xl p-6 border border-border-subtle shadow-elevation-1">
            <h2 className="text-[length:var(--font-size-base)] font-semibold text-text-primary mb-4 tracking-tight">
              Zone Status
            </h2>
            <div className="space-y-2">
              {VENUE_ZONES.map(zone => (
                <div key={zone.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-base border border-border-subtle/50 hover:border-border-subtle transition-colors group">
                  <div className="flex items-center gap-3">
                    <StatusIndicator status={zone.status as "normal" | "warning" | "critical" | "offline"} pulse={zone.status === 'critical'} />
                    <span className="text-[length:var(--font-size-sm)] font-medium text-text-primary group-hover:text-brand-blue transition-colors">{zone.name}</span>
                  </div>
                  <CrowdIndicator density={zone.crowdDensity as "low" | "medium" | "high"} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
