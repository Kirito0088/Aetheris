import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import type { Group } from "three";
import type { POIEntityConfig } from "./types";
import { useSpatialStore } from "../store/useSpatialStore";
import { useSpatialSelection } from "../interaction/useSpatialSelection";

interface POIEntityProps {
  config: POIEntityConfig;
}

export const POIEntity = React.memo(function POIEntity({ config }: POIEntityProps) {
  const { id, position, metadata } = config;
  const groupRef = useRef<Group>(null);

  const hoveredId = useSpatialStore((state) => state.hoveredId);
  const selectedId = useSpatialStore((state) => state.selectedId);

  const isHovered = hoveredId === id;
  const isSelected = selectedId === id;

  const interactionProps = useSpatialSelection({ id, position });

  // Floating animation using refs for high performance (no React re-renders)
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating: sin wave offset based on elapsed time
      const time = state.clock.getElapsedTime();
      const floatOffset = Math.sin(time * 2 + position[0] + position[2]) * 0.3;
      groupRef.current.position.y = position[1] + floatOffset + 1; // raised slightly
      
      // Gentle rotation for extra high-tech polish
      groupRef.current.rotation.y = time * 0.5;
    }
  });

  // Category specific coloring
  const poiColor = useMemo(() => {
    switch (metadata.category) {
      case "medical":
        return "#f56565"; // Red
      case "restroom":
        return "#3182ce"; // Blue
      case "food-court":
        return "#ed8936"; // Orange
      case "information":
        return "#ecc94b"; // Yellow
      case "elevator":
        return "#9f7aea"; // Purple
      case "exit":
        return "#48bb78"; // Green
      case "parking":
        return "#718096"; // Slate
      default:
        return "#a0aec0";
    }
  }, [metadata.category]);

  const pinMaterial = useMemo(() => {
    const isDimmed = selectedId !== null && !isSelected;
    
    let opacity = 0.9;
    let emissiveIntensity = 0.4;
    const baseColor = isSelected ? "#ffffff" : poiColor;

    if (isHovered) {
      emissiveIntensity = 0.8;
    }
    if (isSelected) {
      emissiveIntensity = 1.0;
    }

    if (isDimmed) {
      opacity = 0.15;
      emissiveIntensity = 0.05;
    }

    return {
      color: baseColor,
      transparent: true,
      opacity,
      roughness: isSelected ? 0.1 : 0.2,
      metalness: isSelected ? 0.9 : 0.8,
      emissive: baseColor,
      emissiveIntensity,
    };
  }, [isSelected, isHovered, poiColor, selectedId]);

  const outlineColor = isSelected ? "#3182ce" : isHovered ? "#ffffff" : "#1a202c";

  return (
    <group ref={groupRef} position={[position[0], position[1] + 1, position[2]]} {...interactionProps}>
      {/* Upper Spherical Pin Head */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshStandardMaterial {...pinMaterial} />
        <Edges visible color={outlineColor} lineWidth={isSelected ? 1.5 : 0.8} />
      </mesh>

      {/* Lower Pointed Cone */}
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[1.0, 1.8, 4]} />
        <meshStandardMaterial {...pinMaterial} />
        <Edges visible color={outlineColor} lineWidth={isSelected ? 1.5 : 0.8} />
      </mesh>

      {/* Ground Shadow/Aura Ring for positioning help */}
      <mesh position={[0, -position[1] - 0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0, isSelected ? 3 : isHovered ? 2.5 : 1.5, 32]} />
        <meshBasicMaterial
          color={poiColor}
          transparent
          opacity={
            selectedId !== null && !isSelected
              ? 0.02
              : isSelected
                ? 0.4
                : isHovered
                  ? 0.25
                  : 0.1
          }
          side={2}
        />
      </mesh>
    </group>
  );
});
