/**
 * Aetheris Application Store
 *
 * Global application-level state using Zustand v5.
 *
 * State management priority (ENGINEERING_STANDARDS.md):
 * 1. Local state (useState)
 * 2. Shared context (React context)
 * 3. Global state (Zustand) ← only when multiple independent features need it
 *
 * This store holds only truly global concerns:
 * - application readiness
 * - UI theme/environment
 * - global loading state
 *
 * Feature-specific state belongs in feature-level stores.
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type EnvironmentPreset } from "@/lib/design-tokens";

// =============================================================================
// STATE INTERFACE
// =============================================================================

interface AppState {
  // Application readiness
  /** Whether the application has completed initial loading */
  isReady: boolean;

  // Digital Twin environment
  /** Current 3D environment preset (day/night/event/emergency) */
  environmentPreset: EnvironmentPreset;

  // Global loading state
  /** Whether a full-screen loading overlay is active */
  isGlobalLoading: boolean;
  /** Message displayed during global loading */
  globalLoadingMessage: string | null;
}

// =============================================================================
// ACTION INTERFACE
// =============================================================================

interface AppActions {
  /** Mark the application as ready (after initial providers hydrate) */
  setReady: (ready: boolean) => void;

  /** Switch the 3D environment preset */
  setEnvironmentPreset: (preset: EnvironmentPreset) => void;

  /** Show a full-screen loading overlay */
  showGlobalLoading: (message?: string) => void;

  /** Hide the full-screen loading overlay */
  hideGlobalLoading: () => void;
}

// =============================================================================
// STORE DEFINITION
// =============================================================================

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    (set) => ({
      // Initial state
      isReady: false,
      environmentPreset: "day",
      isGlobalLoading: false,
      globalLoadingMessage: null,

      // Actions
      setReady: (ready) => set({ isReady: ready }, false, "app/setReady"),

      setEnvironmentPreset: (preset) =>
        set({ environmentPreset: preset }, false, "app/setEnvironmentPreset"),

      showGlobalLoading: (message?: string) =>
        set(
          { isGlobalLoading: true, globalLoadingMessage: message ?? null },
          false,
          "app/showGlobalLoading",
        ),

      hideGlobalLoading: () =>
        set(
          { isGlobalLoading: false, globalLoadingMessage: null },
          false,
          "app/hideGlobalLoading",
        ),
    }),
    {
      name: "aetheris/app",
      enabled: process.env["NEXT_PUBLIC_APP_ENV"] !== "production",
    },
  ),
);
