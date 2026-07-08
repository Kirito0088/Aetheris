"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  
  // Contextual labels based on pathname
  let contextualLabel = "Operational Overview";
  if (pathname.includes("/live")) contextualLabel = "Live Digital Twin";
  if (pathname.includes("/navigation")) contextualLabel = "Intelligent Routing";
  if (pathname.includes("/accessibility")) contextualLabel = "Accessibility Guidance";
  if (pathname.includes("/operations")) contextualLabel = "Venue Control";

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-[var(--border-subtle)] bg-[var(--surface-base)] shrink-0 z-[var(--z-navigation)]">
      <div className="flex items-center gap-4">
        <span className="text-[var(--font-size-sm)] font-medium text-[var(--text-secondary)]">
          Lusail Stadium
        </span>
        <span className="w-1 h-1 rounded-full bg-[var(--border-default)]" />
        <span className="text-[var(--font-size-sm)] font-medium text-[var(--text-primary)]">
          {contextualLabel}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--state-success)] animate-pulse" />
          <span className="text-[var(--font-size-xs)] font-medium text-[var(--text-secondary)]">
            Live
          </span>
        </div>
      </div>
    </header>
  );
}
