import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { BottomNav } from "@/components/ui/BottomNav";

export default function FanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <div className="flex flex-col h-full w-full bg-[var(--surface-base)] overflow-hidden">
        <ContentContainer className="flex-1 overflow-y-auto pb-20">
          {children}
        </ContentContainer>
        
        {/* Mobile bottom navigation */}
        <BottomNav persona="fan" />
      </div>
    </AppLayout>
  );
}
