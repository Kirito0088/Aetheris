import { create } from "zustand";
import * as THREE from "three";

export type CameraMode = "overview" | "focus" | "navigation";

interface SpatialState {
  // Camera State
  cameraMode: CameraMode;
  cameraTarget: THREE.Vector3;
  cameraPosition: THREE.Vector3;
  
  // Actions
  setCameraMode: (mode: CameraMode) => void;
  focusOnTarget: (position: THREE.Vector3, target: THREE.Vector3) => void;
  resetToOverview: () => void;
}

// Default positions based on an architectural overview
const DEFAULT_OVERVIEW_POS = new THREE.Vector3(100, 100, 100);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

export const useSpatialStore = create<SpatialState>((set) => ({
  cameraMode: "overview",
  cameraTarget: DEFAULT_TARGET.clone(),
  cameraPosition: DEFAULT_OVERVIEW_POS.clone(),

  setCameraMode: (mode) => set({ cameraMode: mode }),

  focusOnTarget: (position, target) =>
    set({
      cameraMode: "focus",
      cameraPosition: position.clone(),
      cameraTarget: target.clone(),
    }),

  resetToOverview: () =>
    set({
      cameraMode: "overview",
      cameraPosition: DEFAULT_OVERVIEW_POS.clone(),
      cameraTarget: DEFAULT_TARGET.clone(),
    }),
}));
