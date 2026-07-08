import { create } from "zustand";
import * as THREE from "three";
import { LAYER_CONFIGS } from "../layers/layer-config";

export type CameraMode = "overview" | "focus" | "navigation";

interface SpatialState {
  // Camera State
  cameraMode: CameraMode;
  cameraTarget: THREE.Vector3;
  cameraPosition: THREE.Vector3;

  // Active Layers (keys correspond to LayerConfig IDs)
  activeLayers: Record<string, boolean>;

  // Interaction States
  hoveredId: string | null;
  selectedId: string | null;

  // Actions
  setCameraMode: (mode: CameraMode) => void;
  focusOnTarget: (position: THREE.Vector3, target: THREE.Vector3) => void;
  resetToOverview: () => void;
  toggleLayer: (layerId: string) => void;
  setLayerActive: (layerId: string, active: boolean) => void;
  setHoveredId: (id: string | null) => void;
  setSelectedId: (id: string | null) => void;
  clearSelection: () => void;
}

// Default positions based on an architectural overview
const DEFAULT_OVERVIEW_POS = new THREE.Vector3(120, 100, 150);
const DEFAULT_TARGET = new THREE.Vector3(0, 5, 0);

// Initialize active layers from LAYER_CONFIGS defaults
const initialLayers = LAYER_CONFIGS.reduce<Record<string, boolean>>((acc, layer) => {
  acc[layer.id] = layer.defaultActive;
  return acc;
}, {});

export const useSpatialStore = create<SpatialState>((set) => ({
  cameraMode: "overview",
  cameraTarget: DEFAULT_TARGET.clone(),
  cameraPosition: DEFAULT_OVERVIEW_POS.clone(),

  activeLayers: initialLayers,
  hoveredId: null,
  selectedId: null,

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

  toggleLayer: (layerId) =>
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [layerId]: !state.activeLayers[layerId],
      },
    })),

  setLayerActive: (layerId, active) =>
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [layerId]: active,
      },
    })),

  setHoveredId: (id) => set({ hoveredId: id }),

  setSelectedId: (id) => set({ selectedId: id }),

  clearSelection: () => set({ selectedId: null, hoveredId: null }),
}));
