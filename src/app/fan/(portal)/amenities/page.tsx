"use client";

import React from "react";
import { Pizza, Wifi } from "lucide-react";
import { AMENITIES } from "@/features/intelligence/data/venue-data";

export default function FanAmenitiesPage() {
  return (
    <div className="p-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Amenities</h1>
        <p className="text-sm text-[var(--text-secondary)]">Find what you need nearby.</p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button className="px-4 py-2 rounded-full bg-[var(--brand-blue)] text-white text-sm font-medium whitespace-nowrap shadow-sm border border-blue-600">All</button>
        <button className="px-4 py-2 rounded-full bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-medium whitespace-nowrap">Food & Drink</button>
        <button className="px-4 py-2 rounded-full bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-medium whitespace-nowrap">Restrooms</button>
        <button className="px-4 py-2 rounded-full bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-medium whitespace-nowrap">Medical</button>
      </div>

      <div className="space-y-4">
        {AMENITIES.map((amenity) => (
          <div key={amenity.id} className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              {amenity.type === 'food' ? <Pizza className="w-5 h-5 text-blue-500" /> : <Wifi className="w-5 h-5 text-blue-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[var(--text-primary)] truncate">{amenity.name}</h3>
              <p className="text-xs text-[var(--text-secondary)] truncate">{amenity.location}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-[var(--state-warning)]">{amenity.waitTime} min</div>
              <div className="text-[10px] text-[var(--text-tertiary)] uppercase font-medium">Wait</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
