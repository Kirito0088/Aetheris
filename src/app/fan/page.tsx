"use client";

import React from "react";
import { AIRecommendation } from "@/features/intelligence/components/AIRecommendation";
import { ArrowRight, MapPin, Ticket } from "lucide-react";

export default function FanPage() {
  return (
    <div className="p-4 space-y-6 max-w-md mx-auto relative">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[400px] bg-brand-blue/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Wallet Pass Style Card */}
      <div className="relative bg-surface-elevated rounded-3xl p-6 shadow-elevation-3 border border-border-subtle overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-blue to-brand-emerald" />
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-[length:var(--font-size-2xl)] font-bold text-text-primary tracking-tight">Azteca</h1>
            <p className="text-[length:var(--font-size-sm)] text-text-secondary font-medium">Matchday: Mexico vs Argentina</p>
          </div>
          <div className="bg-brand-emerald/10 text-brand-emerald px-2.5 py-1 rounded-full text-[length:var(--font-size-xs)] font-bold tracking-wide uppercase flex items-center gap-1.5 border border-brand-emerald/20">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
            45 mins
          </div>
        </div>

        {/* Ticket Details Grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-border-subtle pt-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-text-secondary mb-1">
              <Ticket className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Your Seat</span>
            </div>
            <div className="text-[length:var(--font-size-lg)] font-bold text-text-primary">Sec 102, Row G</div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-text-secondary mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Entry Gate</span>
            </div>
            <div className="text-[length:var(--font-size-lg)] font-bold text-text-primary">Gate C</div>
          </div>
        </div>
        
        {/* Cutouts for pass look */}
        <div className="absolute top-[68%] -left-3 w-6 h-6 bg-surface-base rounded-full border-r border-border-subtle" />
        <div className="absolute top-[68%] -right-3 w-6 h-6 bg-surface-base rounded-full border-l border-border-subtle" />
      </div>

      {/* AI Recommendation */}
      <div className="pt-2">
        <h2 className="text-[length:var(--font-size-xs)] font-bold text-text-tertiary uppercase tracking-wider mb-3 px-1">AI Assistant</h2>
        <AIRecommendation
          title="Smart Route Available"
          description="Gate C is currently busy. Routing you through Gate D will save you 12 minutes."
          actionLabel="Show Route"
          type="routing"
        />
      </div>

      {/* Quick Links */}
      <div className="space-y-3 pt-2">
        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-border-subtle hover:bg-surface-sunken active:scale-[0.98] transition-all shadow-elevation-1 group">
          <span className="font-medium text-text-primary text-[length:var(--font-size-sm)]">Order Food to Seat</span>
          <ArrowRight className="w-[18px] h-[18px] text-text-tertiary group-hover:text-text-secondary transition-colors" />
        </button>
        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-border-subtle hover:bg-surface-sunken active:scale-[0.98] transition-all shadow-elevation-1 group">
          <span className="font-medium text-text-primary text-[length:var(--font-size-sm)]">Report an Issue</span>
          <ArrowRight className="w-[18px] h-[18px] text-text-tertiary group-hover:text-text-secondary transition-colors" />
        </button>
      </div>
    </div>
  );
}
