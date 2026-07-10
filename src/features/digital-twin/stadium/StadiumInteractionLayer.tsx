'use client';

import { useCallback } from 'react';
import { Box, Ring } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceDirector } from '../../experience/director/ExperienceDirector';

/**
 * StadiumInteractionLayer — GLB-anchored invisible interaction volumes.
 *
 * All interaction volumes are positioned to naturally overlay the
 * actual stadium geometry. They are NOT floating boxes — they wrap
 * the stands, gates, pitch, and roof of the Jeju World Cup Stadium.
 *
 * These are operational entities anchored onto the stadium.
 * The GLB is the spatial reference — not the other way around.
 */
export function StadiumInteractionLayer() {
  const hoveredId = useExperienceDirector((state) => state.hoveredEntityId);
  const selectedId = useExperienceDirector((state) => state.selectedEntityId);
  const setHoveredEntity = useExperienceDirector((state) => state.setHoveredEntity);
  const setSelectedEntity = useExperienceDirector((state) => state.setSelectedEntity);

  const handlePointerOver = useCallback(
    (id: string, position: [number, number, number]) => (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHoveredEntity(id, position);
      document.body.style.cursor = 'pointer';
    },
    [setHoveredEntity]
  );

  const handlePointerOut = useCallback(
    () => (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHoveredEntity(null, null);
      document.body.style.cursor = 'default';
    },
    [setHoveredEntity]
  );

  const handleClick = useCallback(
    (id: string, position: [number, number, number]) => (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      setSelectedEntity(
        id === selectedId ? null : id,
        id === selectedId ? null : position
      );
    },
    [selectedId, setSelectedEntity]
  );

  const getInteractionMaterial = (id: string) => {
    if (selectedId === id) {
      return (
        <meshBasicMaterial
          transparent
          opacity={0.18}
          color="#2f7ff0"
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      );
    }
    if (hoveredId === id) {
      return (
        <meshBasicMaterial
          transparent
          opacity={0.10}
          color="#4f96f5"
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      );
    }
    return (
      <meshBasicMaterial
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    );
  };

  return (
    <group name="stadium-interaction-layer">
      {/* ── Pitch ── flat rectangle at field level */}
      <Box
        args={[70, 1, 44]}
        position={[0, 0.5, 0]}
        onPointerOver={handlePointerOver('pitch', [0, 0.5, 0])}
        onPointerOut={handlePointerOut()}
        onClick={handleClick('pitch', [0, 0.5, 0])}
      >
        {getInteractionMaterial('pitch')}
      </Box>

      {/* ── North Stand ── wraps seating bowl north end */}
      <Box
        args={[70, 14, 22]}
        position={[0, 8, -58]}
        onPointerOver={handlePointerOver('north-stand', [0, 8, -58])}
        onPointerOut={handlePointerOut()}
        onClick={handleClick('north-stand', [0, 8, -58])}
      >
        {getInteractionMaterial('north-stand')}
      </Box>

      {/* ── South Stand ── wraps seating bowl south end */}
      <Box
        args={[70, 14, 22]}
        position={[0, 8, 58]}
        onPointerOver={handlePointerOver('south-stand', [0, 8, 58])}
        onPointerOut={handlePointerOut()}
        onClick={handleClick('south-stand', [0, 8, 58])}
      >
        {getInteractionMaterial('south-stand')}
      </Box>

      {/* ── East Stand ── wraps east seating */}
      <Box
        args={[22, 14, 70]}
        position={[72, 8, 0]}
        onPointerOver={handlePointerOver('east-stand', [72, 8, 0])}
        onPointerOut={handlePointerOut()}
        onClick={handleClick('east-stand', [72, 8, 0])}
      >
        {getInteractionMaterial('east-stand')}
      </Box>

      {/* ── West Stand ── wraps west seating + VIP */}
      <Box
        args={[22, 14, 70]}
        position={[-72, 8, 0]}
        onPointerOver={handlePointerOver('west-stand', [-72, 8, 0])}
        onPointerOut={handlePointerOut()}
        onClick={handleClick('west-stand', [-72, 8, 0])}
      >
        {getInteractionMaterial('west-stand')}
      </Box>

      {/* ── Roof canopy ring ── at actual roof height from GLB */}
      <Ring
        args={[76, 95, 72]}
        position={[0, 26, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={handlePointerOver('roof', [0, 26, 0])}
        onPointerOut={handlePointerOut()}
        onClick={handleClick('roof', [0, 26, 0])}
      >
        {getInteractionMaterial('roof')}
      </Ring>

      {/* ── Gate Interaction Zones ── at the stadium perimeter */}
      <Box
        args={[14, 6, 4]}
        position={[0, 3, -88]}
        onPointerOver={handlePointerOver('gate-a', [0, 3, -88])}
        onPointerOut={handlePointerOut()}
        onClick={handleClick('gate-a', [0, 3, -88])}
      >
        {getInteractionMaterial('gate-a')}
      </Box>

      <Box
        args={[4, 6, 14]}
        position={[92, 3, 0]}
        onPointerOver={handlePointerOver('gate-b', [92, 3, 0])}
        onPointerOut={handlePointerOut()}
        onClick={handleClick('gate-b', [92, 3, 0])}
      >
        {getInteractionMaterial('gate-b')}
      </Box>

      <Box
        args={[14, 6, 4]}
        position={[0, 3, 88]}
        onPointerOver={handlePointerOver('gate-c', [0, 3, 88])}
        onPointerOut={handlePointerOut()}
        onClick={handleClick('gate-c', [0, 3, 88])}
      >
        {getInteractionMaterial('gate-c')}
      </Box>

      <Box
        args={[4, 6, 14]}
        position={[-92, 3, 0]}
        onPointerOver={handlePointerOver('gate-d', [-92, 3, 0])}
        onPointerOut={handlePointerOut()}
        onClick={handleClick('gate-d', [-92, 3, 0])}
      >
        {getInteractionMaterial('gate-d')}
      </Box>
    </group>
  );
}
