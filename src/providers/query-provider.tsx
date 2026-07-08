"use client";

/**
 * Aetheris Query Provider
 *
 * Wraps the application in TanStack Query's QueryClientProvider.
 *
 * Configuration:
 * - staleTime: 60s (operational data changes frequently but not every render)
 * - gcTime: 5min (retain unused data in cache briefly)
 * - retry: 1 (fail fast for better user feedback — ENGINEERING_STANDARDS.md)
 * - refetchOnWindowFocus: false (avoids unnecessary re-fetches in 3D context)
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Instantiate QueryClient inside useState to avoid shared instances
  // across server renders (Next.js App Router requirement).
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 60 seconds
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
