import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ContentContainer } from "@/components/layout/ContentContainer";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-0 min-w-0">
        <Header />
        <ContentContainer>{children}</ContentContainer>
      </div>
    </AppLayout>
  );
}
