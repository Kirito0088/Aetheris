'use client';

import type { ReactNode } from 'react';
import { STADIUM_CONFIG } from './stadium-config';

/**
 * StadiumSpatialAdapter — The Scene Adapter layer.
 *
 * This is the single source of truth for transforming the GLB model
 * into the routing coordinate system. No other component should apply
 * world transforms to the stadium.
 *
 * Responsibilities:
 * - Scale: Maps GLB units (~548 span) to routing coordinate space (~220 span)
 * - Position: Centers the stadium at the world origin with ground alignment
 * - Rotation: Corrects any coordinate system differences
 * - Future: Supports stadium replacement by changing only this adapter
 *           and the stadium-config.ts values
 *
 * Architecture:
 * ```
 * SceneManager
 *   └── StadiumSpatialAdapter (this component — applies transforms)
 *         └── StadiumGLB (visual rendering only)
 * ```
 *
 * The Invisible Interaction Layer is rendered OUTSIDE this adapter
 * because it operates directly in routing coordinate space.
 */
export function StadiumSpatialAdapter({ children }: { children: ReactNode }) {
  const { scale, position, rotation } = STADIUM_CONFIG.transform;

  return (
    <group
      name="stadium-spatial-adapter"
      scale={scale}
      position={position}
      rotation={rotation}
    >
      {children}
    </group>
  );
}
