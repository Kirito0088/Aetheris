"use client";

import React from "react";
import { VenueGuide } from "@/features/intelligence/components/VenueGuide";

export default function VolunteerGuidePage() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 shrink-0 bg-[var(--surface-base)] z-10 border-b border-[var(--border-subtle)]">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Venue Operations Guide</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Operational view with active incident mapping.</p>
      </div>
      <div className="flex-1 relative bg-[var(--surface-sunken)] p-4">
        <VenueGuide />
      </div>
    </div>
  );
}
