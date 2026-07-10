import { STADIUM_CONFIG } from '../stadium/stadium-config';

const profiles = STADIUM_CONFIG.camera.profiles;

/**
 * Scene landmarks — key spatial points derived from GLB geometry.
 * All values match the post-transform world coordinates.
 */
export const SCENE_LANDMARKS = {
  origin: [0, 0, 0] as const,
  pitchCenter: [0, 0.5, 0] as const,
  overview: profiles.overview.position,
  mainEntrance: [0, 2, 88] as const,      // Gate C south
  westGate: [-92, 2, 0] as const,          // Gate D
  eastGate: [92, 2, 0] as const,           // Gate B
  northStand: [0, 8, -58] as const,        // North stand center
  southStand: [0, 8, 58] as const,         // South stand center
} as const;

export type LandmarkName = keyof typeof SCENE_LANDMARKS;
