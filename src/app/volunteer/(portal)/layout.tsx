import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { BottomNav } from "@/components/ui/BottomNav";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <div className="flex flex-col h-full w-full bg-[var(--surface-base)] overflow-hidden">
        {/* Top Header for Volunteer indicating active zone/status */}
        <header className="px-4 py-3 bg-[var(--surface-elevated)] border-b border-[var(--border-subtle)] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-emerald)] animate-pulse" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">On Duty</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium text-[var(--text-secondary)] px-2.5 py-1 rounded-md bg-[var(--surface-base)]">
              Zone C • Gate B
            </div>
            <SignOutButton variant="header" />
          </div>
        </header>

        <ContentContainer className="flex-1 overflow-y-auto pb-20">
          {children}
        </ContentContainer>
        
        {/* Mobile bottom navigation */}
        <BottomNav persona="volunteer" />
      </div>
    </AppLayout>
  );
}

