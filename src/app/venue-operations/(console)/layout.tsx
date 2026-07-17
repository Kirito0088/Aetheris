import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default async function VenueOperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <div className="flex h-full w-full bg-[var(--surface-base)] overflow-hidden">
        <Sidebar _persona="venue-operations" />
        <div className="flex flex-col flex-1 min-w-0">
          <Header title="Venue Operations" />
          <ContentContainer className="flex-1 overflow-y-auto p-6">
            {children}
          </ContentContainer>
        </div>
      </div>
    </AppLayout>
  );
}

