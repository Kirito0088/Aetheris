import type { ReactNode } from 'react';
import { SCENE_LANDMARKS } from '../config/scene-landmarks';

interface OriginProps {
  children?: ReactNode;
}

/**
 * Establishes the world origin.
 * All spatial capabilities (navigation, AI overlays) should reference this.
 */
export function Origin({ children }: OriginProps) {
  return (
    <group position={SCENE_LANDMARKS.origin}>
      {children}
    </group>
  );
}
