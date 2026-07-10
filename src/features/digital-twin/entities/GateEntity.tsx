import React, { useMemo } from "react";
import { Edges } from "@react-three/drei";
import type { GateEntityConfig } from "./types";
import { useSpatialStore } from "../store/useSpatialStore";
import { useSpatialSelection } from "../interaction/useSpatialSelection";

interface GateEntityProps {
  config: GateEntityConfig;
}

export const GateEntity = React.memo(function GateEntity({ config }: GateEntityProps) {
  const { id, position, color, metadata } = config;

  const hoveredId = useSpatialStore((state) => state.hoveredId);
  const selectedId = useSpatialStore((state) => state.selectedId);

  const isHovered = hoveredId === id;
  const isSelected = selectedId === id;

  const interactionProps = useSpatialSelection({ id, position });

  // Gate status color
  const statusColor = useMemo(() => {
    switch (metadata.status) {
      case "open":
        return "#48bb78"; // Safe Green
      case "restricted":
        return "#ed8936"; // Operational Orange
      case "closed":
        return "#e53e3e"; // Restrictive Red
      default:
        return color;
    }
  }, [metadata.status, color]);

  // Combined visual material configurations
  const frameMaterial = useMemo(() => {
    const isDimmed = selectedId !== null && !isSelected;
    
    let baseColor = isSelected ? "#2563eb" : color;
    let opacity = 0.8;
    let metalness = 0.4;
    let roughness = 0.3;

    if (isHovered) {
      baseColor = isSelected ? "#60a5fa" : "#e2e8f0";
    }

    if (isDimmed) {
      opacity = 0.12;
      metalness = 0.1;
      roughness = 0.8;
    }

    return {
      color: baseColor,
      transparent: true,
      opacity,
      metalness,
      roughness,
      emissive: isSelected ? "#3b82f6" : "#000000",
      emissiveIntensity: isSelected ? 0.4 : 0,
    };
  }, [isSelected, isHovered, color, selectedId]);

  const glowMaterial = useMemo(() => {
    const isDimmed = selectedId !== null && !isSelected;
    return {
      color: statusColor,
      transparent: true,
      opacity: isDimmed ? 0.03 : isSelected ? 0.75 : isHovered ? 0.55 : 0.25,
      emissive: statusColor,
      emissiveIntensity: isDimmed ? 0.05 : isSelected ? 1.2 : isHovered ? 0.7 : 0.3,
    };
  }, [isSelected, isHovered, statusColor, selectedId]);

  // Edges outlines
  const edgeColor = isSelected ? "#63b3ed" : isHovered ? "#ffffff" : "#4a5568";
  const edgeLineWidth = isSelected ? 1.2 : isHovered ? 0.8 : 0.4;

  return (
    <group position={position} {...interactionProps}>
      {/* Base Plate */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.2, 3]} />
        <meshStandardMaterial {...frameMaterial} />
        <Edges visible color={edgeColor} lineWidth={edgeLineWidth} />
      </mesh>

      {/* Left Pillar */}
      <mesh position={[-2.7, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 6, 0.6]} />
        <meshStandardMaterial {...frameMaterial} />
        <Edges visible color={edgeColor} lineWidth={edgeLineWidth} />
      </mesh>

      {/* Right Pillar */}
      <mesh position={[2.7, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 6, 0.6]} />
        <meshStandardMaterial {...frameMaterial} />
        <Edges visible color={edgeColor} lineWidth={edgeLineWidth} />
      </mesh>

      {/* Top Beam */}
      <mesh position={[0, 6.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.6, 0.6]} />
        <meshStandardMaterial {...frameMaterial} />
        <Edges visible color={edgeColor} lineWidth={edgeLineWidth} />
      </mesh>

      {/* Status Pane (Indicator Glow) */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[4.8, 5.6, 0.1]} />
        <meshStandardMaterial {...glowMaterial} />
      </mesh>
    </group>
  );
});
