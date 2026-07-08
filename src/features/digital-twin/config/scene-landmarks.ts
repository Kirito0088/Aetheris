export const SCENE_LANDMARKS = {
  origin: [0, 0, 0] as const,
  pitchCenter: [0, 0, 0] as const,
  overview: [0, 100, 150] as const,
  mainEntrance: [0, 10, 80] as const,
  westGate: [-80, 10, 0] as const,
  eastGate: [80, 10, 0] as const,
  northStand: [0, 30, -60] as const,
  southStand: [0, 30, 60] as const,
} as const;

export type LandmarkName = keyof typeof SCENE_LANDMARKS;
