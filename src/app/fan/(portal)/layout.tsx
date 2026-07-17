import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { FanSidebar } from "@/components/layout/FanSidebar";
import { BottomNav } from "@/components/ui/BottomNav";
import { LanguageProvider } from "@/context/LanguageContext";

export default async function FanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <AppLayout>
        {/* Desktop Sidebar (hidden on mobile) */}
        <FanSidebar />
        
        <div className="flex flex-col flex-1 h-full w-full bg-[var(--surface-base)] overflow-hidden relative">
          <main className="flex-1 overflow-y-auto pb-24 md:pb-8 w-full">
            {children}
          </main>
          
          {/* Mobile bottom navigation (hidden on desktop) */}
          <BottomNav persona="fan" />
        </div>
      </AppLayout>
    </LanguageProvider>
  );
}

