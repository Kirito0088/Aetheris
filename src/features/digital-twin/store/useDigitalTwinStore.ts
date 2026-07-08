import { create } from 'zustand';
import type { DigitalTwinState } from '../types';

export const useDigitalTwinStore = create<DigitalTwinState>((set) => ({
  interaction: {
    hoveredId: null,
    selectedId: null,
  },
  camera: {
    currentPath: 'intro',
    isTransitioning: false,
  },
  environment: {
    gridVisible: false,
    axesVisible: false,
    reducedMotion: false,
  },
  
  setHovered: (id) => 
    set((state) => ({
      interaction: { ...state.interaction, hoveredId: id }
    })),
    
  setSelected: (id) => 
    set((state) => ({
      interaction: { ...state.interaction, selectedId: id }
    })),
    
  goToPath: (path) => 
    set((state) => ({
      camera: { ...state.camera, currentPath: path }
    })),
    
  setTransitioning: (isTransitioning) => 
    set((state) => ({
      camera: { ...state.camera, isTransitioning }
    })),
    
  setGridVisible: (visible) => 
    set((state) => ({
      environment: { ...state.environment, gridVisible: visible }
    })),
    
  setAxesVisible: (visible) => 
    set((state) => ({
      environment: { ...state.environment, axesVisible: visible }
    })),
    
  setReducedMotion: (reduced) => 
    set((state) => ({
      environment: { ...state.environment, reducedMotion: reduced }
    })),
}));
