import type { ReactNode } from 'react';
import { Bvh } from '@react-three/drei';

interface BoundsProps {
  children?: ReactNode;
}

/**
 * Defines the raycasting bounds for the scene.
 * Wraps the world in a BVH (Bounding Volume Hierarchy) for optimized raycasting performance.
 */
export function Bounds({ children }: BoundsProps) {
  return (
    <Bvh firstHitOnly>
      {children}
    </Bvh>
  );
}
