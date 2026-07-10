'use client';

import { useFrame } from '@react-three/fiber';
import { STADIUM_CONFIG } from '../../digital-twin/stadium/stadium-config';

/**
 * LandingCameraController — Slow cinematic orbit for the landing page.
 *
 * Uses camera profile from STADIUM_CONFIG to frame the production
 * GLB stadium. The orbit showcases the full stadium exterior with
 * a gentle, sweeping motion (~3 minutes per full revolution).
 */
export function LandingCameraController() {
  const { orbitRadius, orbitHeight, orbitSpeed, lookAtTarget } = STADIUM_CONFIG.camera.profiles.landing;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const angle = time * orbitSpeed;

    state.camera.position.set(
      Math.cos(angle) * orbitRadius,
      orbitHeight,
      Math.sin(angle) * orbitRadius
    );

    state.camera.lookAt(lookAtTarget[0], lookAtTarget[1], lookAtTarget[2]);
    state.camera.updateProjectionMatrix();
  });

  return null;
}
