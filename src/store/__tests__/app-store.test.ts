import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@/store/app-store";

// Capture the initial state (includes actions in Zustand v5)
const initialState = useAppStore.getInitialState();

beforeEach(() => {
  // Merge-reset state without wiping actions (do NOT pass `true` as 2nd arg)
  useAppStore.setState(initialState);
});

describe("useAppStore", () => {
  describe("initial state", () => {
    it("has correct default values", () => {
      const state = useAppStore.getState();

      expect(state.isReady).toBe(false);
      expect(state.environmentPreset).toBe("day");
      expect(state.isGlobalLoading).toBe(false);
      expect(state.globalLoadingMessage).toBeNull();
    });
  });

  describe("setReady", () => {
    it("sets isReady to true", () => {
      useAppStore.getState().setReady(true);
      expect(useAppStore.getState().isReady).toBe(true);
    });

    it("sets isReady back to false", () => {
      useAppStore.getState().setReady(true);
      useAppStore.getState().setReady(false);
      expect(useAppStore.getState().isReady).toBe(false);
    });
  });

  describe("setEnvironmentPreset", () => {
    it("changes preset to night", () => {
      useAppStore.getState().setEnvironmentPreset("night");
      expect(useAppStore.getState().environmentPreset).toBe("night");
    });

    it("changes preset to event", () => {
      useAppStore.getState().setEnvironmentPreset("event");
      expect(useAppStore.getState().environmentPreset).toBe("event");
    });

    it("changes preset to emergency", () => {
      useAppStore.getState().setEnvironmentPreset("emergency");
      expect(useAppStore.getState().environmentPreset).toBe("emergency");
    });
  });

  describe("showGlobalLoading", () => {
    it("sets isGlobalLoading to true with a message", () => {
      useAppStore.getState().showGlobalLoading("Loading...");
      const state = useAppStore.getState();

      expect(state.isGlobalLoading).toBe(true);
      expect(state.globalLoadingMessage).toBe("Loading...");
    });

    it("sets globalLoadingMessage to null when called without argument", () => {
      useAppStore.getState().showGlobalLoading();
      const state = useAppStore.getState();

      expect(state.isGlobalLoading).toBe(true);
      expect(state.globalLoadingMessage).toBeNull();
    });
  });

  describe("hideGlobalLoading", () => {
    it("resets both isGlobalLoading and globalLoadingMessage", () => {
      useAppStore.getState().showGlobalLoading("Please wait...");
      useAppStore.getState().hideGlobalLoading();
      const state = useAppStore.getState();

      expect(state.isGlobalLoading).toBe(false);
      expect(state.globalLoadingMessage).toBeNull();
    });
  });

  describe("action composition", () => {
    it("showGlobalLoading then hideGlobalLoading returns to idle state", () => {
      useAppStore.getState().showGlobalLoading("Initializing...");
      expect(useAppStore.getState().isGlobalLoading).toBe(true);

      useAppStore.getState().hideGlobalLoading();
      expect(useAppStore.getState().isGlobalLoading).toBe(false);
      expect(useAppStore.getState().globalLoadingMessage).toBeNull();
    });

    it("multiple actions do not interfere with each other", () => {
      useAppStore.getState().setReady(true);
      useAppStore.getState().setEnvironmentPreset("night");
      useAppStore.getState().showGlobalLoading("Loading scene...");

      const state = useAppStore.getState();
      expect(state.isReady).toBe(true);
      expect(state.environmentPreset).toBe("night");
      expect(state.isGlobalLoading).toBe(true);
      expect(state.globalLoadingMessage).toBe("Loading scene...");
    });
  });
});
