import React from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { DigitalTwinCanvas } from "@/features/digital-twin/components";

export default function LiveStadiumPage() {
  return (
    <PageTransition className="w-full h-full relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute top-8 left-8 z-[var(--z-content)] pointer-events-none">
        <h1 className="text-[var(--font-size-2xl)] font-semibold text-[var(--text-primary)]">
          Live Stadium
        </h1>
        <p className="text-[var(--text-secondary)]">Living Digital Twin Foundation</p>
      </div>
      
      <div className="w-full h-full absolute inset-0 z-0">
        <DigitalTwinCanvas />
      </div>
    </PageTransition>
  );
}
