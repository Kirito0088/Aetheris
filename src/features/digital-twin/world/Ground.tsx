import type { ThreeEvent } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import { useExperienceDirector } from '../../experience/director/ExperienceDirector';

/**
 * Ground — Multi-layer terrain beneath the stadium.
 * Creates a natural environment that grounds the stadium in reality
 * instead of a floating black slab.
 *
 * Layers (bottom to top):
 * 1. Outer terrain — large earth-tone plane extending to horizon fog
 * 2. Inner grass surround — green area around the stadium perimeter
 * 3. Stadium plaza — slightly raised walkway ring
 *
 * Click on ground deselects the current entity (returns to overview).
 */
export function Ground() {
  const setSelectedEntity = useExperienceDirector((state) => state.setSelectedEntity);

  const handleGroundClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedEntity(null, null);
  };

  return (
    <group name="ground-system">
      {/* Layer 1: Outer terrain — extends well past the fog boundary */}
      <Plane
        args={[2000, 2000]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.3, 0]}
        receiveShadow
        onClick={handleGroundClick}
      >
        <meshStandardMaterial color="#c4bfb0" roughness={0.98} metalness={0} />
      </Plane>

      {/* Layer 2: Green surround — grass/landscaping around the stadium */}
      <Plane
        args={[500, 500]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.15, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#7da668" roughness={0.92} metalness={0} />
      </Plane>

      {/* Layer 3: Stadium plaza — paved area immediately around the building */}
      <Plane
        args={[280, 250]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#a8a296" roughness={0.88} metalness={0} />
      </Plane>
    </group>
  );
}
export default Ground;
