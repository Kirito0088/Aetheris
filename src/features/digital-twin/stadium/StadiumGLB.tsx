'use client';

import { useGLTF } from '@react-three/drei';
import { STADIUM_CONFIG } from './stadium-config';

/**
 * StadiumGLB — Pure rendering component for the production stadium GLB model.
 *
 * This component is ONLY the visual rendering layer.
 * It does NOT handle:
 * - Interaction (hover, select, click)
 * - Routing (navigation graph, pathfinding)
 * - Entity state (zones, gates, POIs)
 *
 * Those responsibilities belong to the Invisible Interaction Layer
 * and Entity Registry, which operate independently of this mesh.
 *
 * The GLB preserves its original PBR materials, textures, and mesh
 * hierarchy exactly as exported from Sketchfab. No modifications
 * are made to the model — only integration.
 *
 * @see StadiumSpatialAdapter for coordinate transformation
 * @see StadiumInteractionLayer for user interaction
 * @see stadium-config.ts for all configuration values
 */
export function StadiumGLB() {
  const { scene } = useGLTF(STADIUM_CONFIG.asset.path);

  return (
    <primitive
      object={scene}
      castShadow
      receiveShadow
    />
  );
}

// Eagerly preload the stadium asset so it begins downloading
// as soon as this module is imported (before React renders).
// This is critical for the 80 MB asset — start loading immediately.
useGLTF.preload(STADIUM_CONFIG.asset.path);
