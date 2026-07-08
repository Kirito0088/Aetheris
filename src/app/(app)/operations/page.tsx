import React from "react";
import { PageTransition } from "@/components/ui/PageTransition";

export default function OperationsPage() {
  return (
    <PageTransition className="w-full h-full p-8">
      <h1 className="text-[var(--font-size-2xl)] font-semibold text-[var(--text-primary)] mb-2">
        Venue Control
      </h1>
      <p className="text-[var(--text-secondary)] max-w-2xl">
        Operational insights and crowd intelligence will be available in Phase 3.
      </p>
    </PageTransition>
  );
}
