"use client";

import React from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function VolunteerPage() {
  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <div className="space-y-1">
        <h1 className="text-[length:var(--font-size-2xl)] font-bold text-text-primary tracking-tight">Your Tasks</h1>
        <p className="text-[length:var(--font-size-sm)] font-medium text-text-secondary">2 Active, 1 Pending</p>
      </div>

      <div className="space-y-4">
        {/* High Priority Task */}
        <div className="p-4 rounded-xl bg-surface-elevated border-2 border-state-danger/30 shadow-glow-blue relative overflow-hidden ring-1 ring-state-danger/10">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-state-danger" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-state-danger/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <div className="w-8 h-8 rounded-full bg-state-danger/10 flex items-center justify-center">
                <AlertTriangle className="w-[18px] h-[18px] text-state-danger" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-state-danger bg-state-danger/10 px-2 py-0.5 rounded-sm">High Priority</span>
                <span className="text-xs font-semibold text-state-danger">2 min ago</span>
              </div>
              <h3 className="text-[length:var(--font-size-base)] font-bold text-text-primary leading-tight mb-2 tracking-tight">Crowd Congestion at Gate C</h3>
              <p className="text-[length:var(--font-size-sm)] text-text-secondary leading-relaxed mb-4">
                Please deploy to Gate C to assist with crowd dispersion. Guide fans to Gate D if possible.
              </p>
              <div className="flex gap-2 relative z-10">
                <button className="flex-1 bg-state-danger text-white font-semibold text-[length:var(--font-size-sm)] py-2.5 rounded-lg shadow-elevation-1 hover:opacity-90 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-danger focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated">
                  Accept Task
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Standard Task */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-border-strong shadow-elevation-1 relative overflow-hidden hover:border-brand-blue/50 transition-colors group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue" />
          <div className="flex items-start gap-4">
            <div className="flex-1 pl-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-sm">Standard</span>
                <span className="text-xs font-medium text-text-tertiary">15 min ago</span>
              </div>
              <h3 className="text-[length:var(--font-size-base)] font-bold text-text-primary leading-tight mb-2 tracking-tight">Wheelchair Assistance</h3>
              <p className="text-[length:var(--font-size-sm)] text-text-secondary leading-relaxed mb-4">
                Fan requested assistance from Entry Gate A to Section 102.
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-surface-base border border-border-strong hover:border-brand-blue hover:bg-brand-blue/5 text-text-primary font-medium text-[length:var(--font-size-sm)] py-2.5 rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue">
                  <CheckCircle className="w-[18px] h-[18px] text-brand-blue" /> Mark Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
