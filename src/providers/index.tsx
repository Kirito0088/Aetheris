"use client";

/**
 * Aetheris Root Providers
 *
 * Composes all application-level providers into a single wrapper.
 * This is the only place where provider nesting is managed.
 *
 * Ordering matters:
 * 1. QueryProvider — data fetching foundation
 *
 * Future providers (later phases) will be added here:
 * - AuthProvider (Phase 2)
 * - ThemeProvider (Phase 2)
 */

import { QueryProvider } from "./query-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <QueryProvider>{children}</QueryProvider>;
}
