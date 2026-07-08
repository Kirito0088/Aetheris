import type { CameraPathName } from '../config/camera-paths';

export interface InteractionState {
  hoveredId: string | null;
  selectedId: string | null;
}

export interface CameraState {
  currentPath: CameraPathName;
  isTransitioning: boolean;
}

export interface EnvironmentState {
  gridVisible: boolean;
  axesVisible: boolean;
  reducedMotion: boolean;
}

export interface DigitalTwinState {
  interaction: InteractionState;
  camera: CameraState;
  environment: EnvironmentState;
  
  // Actions
  setHovered: (id: string | null) => void;
  setSelected: (id: string | null) => void;
  goToPath: (path: CameraPathName) => void;
  setTransitioning: (isTransitioning: boolean) => void;
  setGridVisible: (visible: boolean) => void;
  setAxesVisible: (visible: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
}
