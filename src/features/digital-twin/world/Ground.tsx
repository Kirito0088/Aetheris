import { Plane } from '@react-three/drei';

export function Ground() {
  return (
    <Plane
      args={[1000, 1000]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 0]} // Slightly below origin to prevent z-fighting with the grid
      receiveShadow
    >
      <meshStandardMaterial color="#1a1a1a" roughness={1} metalness={0} />
    </Plane>
  );
}
