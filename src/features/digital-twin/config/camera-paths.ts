import { STADIUM_CONFIG } from '../stadium/stadium-config';

export interface CameraPath {
  position: readonly [number, number, number];
  target: readonly [number, number, number];
  transitionDuration?: number;
}

const profiles = STADIUM_CONFIG.camera.profiles;

export const CAMERA_PATHS = {
  intro: {
    position: profiles.hero.position,
    target: profiles.hero.target,
    transitionDuration: profiles.hero.transitionDuration,
  },
  overview: {
    position: profiles.overview.position,
    target: profiles.overview.target,
    transitionDuration: profiles.overview.transitionDuration,
  },
  mainEntrance: {
    position: profiles.navigation.position,
    target: profiles.navigation.target,
    transitionDuration: profiles.navigation.transitionDuration,
  },
  gateA: {
    position: [-90, 15, -90] as const,
    target: [0, 5, -96] as const,
    transitionDuration: 1.5,
  },
} as const satisfies Record<string, CameraPath>;

export type CameraPathName = keyof typeof CAMERA_PATHS;
