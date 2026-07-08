import { create } from "zustand";
import * as THREE from "three";
import { LAYER_CONFIGS } from "../layers/layer-config";
import type { RouteType } from "../../navigation/graph/Graph";
import type { RouteResult } from "../../navigation/routing/RouteTypes";
import { GraphBuilder } from "../../navigation/graph/GraphBuilder";
import { RoutingEngine } from "../../navigation/routing/RoutingEngine";

export type CameraMode = "overview" | "focus" | "route-follow";

interface TimelineState {
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
}

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

  // Routing State
  routingStartId: string | null;
  routingEndId: string | null;
  routingType: RouteType;
  activeRoute: RouteResult | null;

  // Animation Timeline State
  routeAnimationProgress: number;
  timelineState: TimelineState;

  // Actions
  setCameraMode: (mode: CameraMode) => void;
  focusOnTarget: (position: THREE.Vector3, target: THREE.Vector3) => void;
  resetToOverview: () => void;
  toggleLayer: (layerId: string) => void;
  setLayerActive: (layerId: string, active: boolean) => void;
  setHoveredId: (id: string | null) => void;
  setSelectedId: (id: string | null) => void;
  clearSelection: () => void;

  // Routing Actions
  setRoutingStartId: (id: string | null) => void;
  setRoutingEndId: (id: string | null) => void;
  setRoutingType: (type: RouteType) => void;
  calculateRoute: () => void;
  clearRoute: () => void;

  // Timeline Actions
  updateAnimationProgress: (progress: number) => void;
  updateTimelineState: (state: TimelineState) => void;
}

// Default positions based on an architectural overview
const DEFAULT_OVERVIEW_POS = new THREE.Vector3(0, 100, 150);
const DEFAULT_TARGET = new THREE.Vector3(0, 5, 0);

// Initialize active layers from LAYER_CONFIGS defaults
const initialLayers = LAYER_CONFIGS.reduce<Record<string, boolean>>((acc, layer) => {
  acc[layer.id] = layer.defaultActive;
  return acc;
}, {});

// Build static graph and routing engine instances once
const routingGraph = GraphBuilder.build();
const routingEngine = new RoutingEngine(routingGraph);

export const useSpatialStore = create<SpatialState>((set, get) => ({
  cameraMode: "overview",
  cameraTarget: DEFAULT_TARGET.clone(),
  cameraPosition: DEFAULT_OVERVIEW_POS.clone(),

  activeLayers: initialLayers,
  hoveredId: null,
  selectedId: null,

  routingStartId: null,
  routingEndId: null,
  routingType: "standard",
  activeRoute: null,

  routeAnimationProgress: 0,
  timelineState: {
    isPlaying: false,
    isPaused: false,
    progress: 0,
  },

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

  setRoutingStartId: (id) => {
    set({ routingStartId: id });
    get().calculateRoute();
  },

  setRoutingEndId: (id) => {
    set({ routingEndId: id });
    get().calculateRoute();
  },

  setRoutingType: (type) => {
    set({ routingType: type });
    get().calculateRoute();
  },

  calculateRoute: () => {
    const { routingStartId, routingEndId, routingType } = get();
    if (!routingStartId || !routingEndId) {
      set({ activeRoute: null });
      return;
    }

    if (routingStartId === routingEndId) {
      set({ activeRoute: null });
      return;
    }

    const route = routingEngine.findRoute(routingStartId, routingEndId, routingType);
    set({ activeRoute: route });
  },

  clearRoute: () =>
    set({
      routingStartId: null,
      routingEndId: null,
      activeRoute: null,
      routeAnimationProgress: 0,
      timelineState: { isPlaying: false, isPaused: false, progress: 0 },
    }),

  updateAnimationProgress: (progress) =>
    set({ routeAnimationProgress: progress }),

  updateTimelineState: (state) =>
    set({ timelineState: state }),
}));
