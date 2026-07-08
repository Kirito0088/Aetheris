import type { ThreeEvent } from '@react-three/fiber';
import { Cylinder, Ring, Box } from '@react-three/drei';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';

export function StadiumFoundation() {
  const setHovered = useDigitalTwinStore((state) => state.setHovered);
  const setSelected = useDigitalTwinStore((state) => state.setSelected);
  const hoveredId = useDigitalTwinStore((state) => state.interaction.hoveredId);
  const selectedId = useDigitalTwinStore((state) => state.interaction.selectedId);

  const handlePointerOver = (id: string) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(id);
  };

  const handlePointerOut = () => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(null);
  };

  const handleClick = (id: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelected(id === selectedId ? null : id);
  };

  const getMaterialProps = (id: string, defaultColor: string) => {
    if (selectedId === id) return { color: "#3182ce", roughness: 0.3, emissive: "#2b6cb0", emissiveIntensity: 0.4 };
    if (hoveredId === id) return { color: "#63b3ed", roughness: 0.4, emissive: "#3182ce", emissiveIntensity: 0.2 };
    return { color: defaultColor, roughness: 0.7 };
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Pitch */}
      <Box 
        args={[100, 1, 60]} 
        position={[0, 0.5, 0]} 
        receiveShadow 
        castShadow
        onPointerOver={handlePointerOver('pitch')}
        onPointerOut={handlePointerOut()}
        onClick={handleClick('pitch')}
      >
        <meshStandardMaterial {...getMaterialProps('pitch', '#2d3748')} />
      </Box>

      {/* Lower Tier */}
      <Cylinder 
        args={[80, 70, 10, 64]} 
        position={[0, 5, 0]} 
        receiveShadow 
        castShadow
        onPointerOver={handlePointerOver('lower-tier')}
        onPointerOut={handlePointerOut()}
        onClick={handleClick('lower-tier')}
      >
        <meshStandardMaterial {...getMaterialProps('lower-tier', '#4a5568')} />
      </Cylinder>

      {/* Upper Tier */}
      <Cylinder 
        args={[100, 90, 15, 64]} 
        position={[0, 15, 0]} 
        receiveShadow 
        castShadow
        onPointerOver={handlePointerOver('upper-tier')}
        onPointerOut={handlePointerOut()}
        onClick={handleClick('upper-tier')}
      >
        <meshStandardMaterial {...getMaterialProps('upper-tier', '#4a5568')} />
      </Cylinder>

      {/* Outer Structure / Roof Ring */}
      <Ring 
        args={[95, 110, 64]} 
        position={[0, 25, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow 
        castShadow
        onPointerOver={handlePointerOver('roof')}
        onPointerOut={handlePointerOut()}
        onClick={handleClick('roof')}
      >
        <meshStandardMaterial {...getMaterialProps('roof', '#e2e8f0')} metalness={0.1} side={2} />
      </Ring>
    </group>
  );
}
