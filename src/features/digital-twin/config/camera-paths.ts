import { SCENE_LANDMARKS } from './scene-landmarks';

export interface CameraPath {
  position: readonly [number, number, number];
  target: readonly [number, number, number];
  transitionDuration?: number;
}

export const CAMERA_PATHS = {
  intro: {
    position: [0, 150, 250],
    target: SCENE_LANDMARKS.pitchCenter,
    transitionDuration: 4,
  },
  overview: {
    position: SCENE_LANDMARKS.overview,
    target: SCENE_LANDMARKS.pitchCenter,
    transitionDuration: 2,
  },
  mainEntrance: {
    position: SCENE_LANDMARKS.mainEntrance,
    target: [0, 10, 50],
    transitionDuration: 1.5,
  },
  gateA: {
    position: SCENE_LANDMARKS.westGate,
    target: [SCENE_LANDMARKS.westGate[0] + 20, SCENE_LANDMARKS.westGate[1], 0],
    transitionDuration: 1.5,
  },
} as const satisfies Record<string, CameraPath>;

export type CameraPathName = keyof typeof CAMERA_PATHS;
