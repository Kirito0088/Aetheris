'use client';

import { Suspense } from 'react';
import { StadiumGLB } from './StadiumGLB';
import { StadiumSpatialAdapter } from './StadiumSpatialAdapter';
import { StadiumInteractionLayer } from './StadiumInteractionLayer';

/**
 * StadiumFoundation — Phase 6 Production GLB Stadium.
 *
 * Composes the three-layer stadium architecture:
 *
 * 1. StadiumSpatialAdapter — Scene Adapter that transforms GLB coordinates
 *    to match the routing coordinate system. The ONLY place transforms live.
 *
 * 2. StadiumGLB — Pure visual rendering of the production GLB model.
 *    No business logic. No interaction handling.
 *
 * 3. StadiumInteractionLayer — Invisible colliders for hover/select/click.
 *    Operates in routing coordinate space, completely independent of the GLB.
 *
 * Architecture (mandatory):
 * ```
 * StadiumFoundation
 *   ├── StadiumSpatialAdapter (transforms)
 *   │     └── StadiumGLB (visual rendering)
 *   └── StadiumInteractionLayer (invisible colliders, routing coordinates)
 * ```
 *
 * This architecture ensures:
 * - The GLB can be replaced without affecting routing or interaction
 * - Business logic never depends on mesh names
 * - The rendering layer is separate from the intelligence layer
 * - The Scene Adapter is the only place transforms exist
 *
 * @see stadium-config.ts for all configuration values
 */
export function StadiumFoundation() {
  return (
    <group name="stadium-foundation">
      {/* Visual Stadium (GLB) — wrapped in spatial adapter for coordinate mapping */}
      <StadiumSpatialAdapter>
        <Suspense fallback={null}>
          <StadiumGLB />
        </Suspense>
      </StadiumSpatialAdapter>

      {/* Invisible Interaction Layer — operates in routing coordinate space */}
      {/* Rendered OUTSIDE the SpatialAdapter because it uses routing coordinates directly */}
      <StadiumInteractionLayer />
    </group>
  );
}

export default StadiumFoundation;
