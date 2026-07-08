import React from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[var(--surface-base)] text-[var(--text-primary)] overflow-hidden">
      {children}
    </div>
  );
}
