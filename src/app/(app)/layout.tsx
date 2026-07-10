'use client';

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { DigitalTwinCanvas } from "@/features/digital-twin/components";
import { TicketOnboardingModal, useExperienceDirector } from "@/features/experience";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const syncFromStorage = useExperienceDirector((s) => s.syncFromStorage);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    syncFromStorage();
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).useExperienceDirector = useExperienceDirector;
      // Dynamically load useSpatialStore on the client side
      import("@/features/digital-twin/store/useSpatialStore").then((mod) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).useSpatialStore = mod.useSpatialStore;
      });
    }
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [syncFromStorage]);

  return (
    <AppLayout>
      {/* 3D Digital Twin Canvas - Persistent in layout background */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <DigitalTwinCanvas />
      </div>

      {/* Subtle warm-white gradient overlay for UI panel legibility */}
      <div className="absolute inset-0 z-1 pointer-events-none" style={{ background: 'linear-gradient(to top, hsla(40,38%,98%,0.85) 0%, hsla(40,38%,98%,0.3) 50%, transparent 100%)' }} />
      <div className="absolute inset-0 z-1 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 20%, hsla(40,38%,98%,0.5) 85%)' }} />

      {/* Main UI layer - pointer-events-none lets clicks fall through to the canvas */}
      <div className="relative z-10 flex h-full w-full bg-transparent overflow-hidden pointer-events-none">
        {/* Sidebar and Main panels need to restore pointer events for themselves */}
        <div className="pointer-events-auto flex h-full">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 min-h-0 min-w-0 pointer-events-none">
          <div className="pointer-events-auto">
            <Header />
          </div>
          <ContentContainer className="pointer-events-none flex-1">
            {children}
          </ContentContainer>
        </div>
      </div>

      {/* Fan Onboarding Modal - Only show after hydration and storage sync */}
      {mounted && <TicketOnboardingModal />}
    </AppLayout>
  );
}
