import React, { useMemo } from "react";
import { Edges } from "@react-three/drei";
import type { ZoneEntityConfig } from "./types";
import { useSpatialStore } from "../store/useSpatialStore";
import { useSpatialSelection } from "../interaction/useSpatialSelection";

interface ZoneEntityProps {
  config: ZoneEntityConfig;
}

export const ZoneEntity = React.memo(function ZoneEntity({ config }: ZoneEntityProps) {
  const { id, position, shape, args, color } = config;

  const hoveredId = useSpatialStore((state) => state.hoveredId);
  const selectedId = useSpatialStore((state) => state.selectedId);

  const isHovered = hoveredId === id;
  const isSelected = selectedId === id;

  const interactionProps = useSpatialSelection({ id, position });

  // Calculate material properties
  const materialProps = useMemo(() => {
    const isDimmed = selectedId !== null && !isSelected;
    
    let opacity = 0.15;
    let emissiveIntensity = 0.0;
    let mainColor = color;

    if (isSelected) {
      opacity = 0.65;
      emissiveIntensity = 0.45;
      mainColor = "#2563eb"; // Premium selection blue
    } else if (isHovered) {
      opacity = 0.35;
      emissiveIntensity = 0.2;
    } else if (isDimmed) {
      opacity = 0.04; // Dim non-selected zones to 4% opacity
    }

    return {
      color: mainColor,
      transparent: true,
      opacity,
      roughness: isSelected ? 0.3 : 0.6,
      metalness: isSelected ? 0.4 : 0.1,
      emissive: isSelected ? "#3b82f6" : mainColor,
      emissiveIntensity: isDimmed ? 0 : emissiveIntensity,
      depthWrite: false, // Prevents Z-fighting and opacity overlap issues
    };
  }, [isSelected, isHovered, color, selectedId]);

  // Outline (Edges) properties
  const outlineProps = useMemo(() => {
    const isDimmed = selectedId !== null && !isSelected;
    if (isSelected) {
      return {
        visible: true,
        color: "#60a5fa",
        threshold: 15,
        lineWidth: 2.0,
      };
    }
    if (isHovered) {
      return {
        visible: true,
        color: "#ffffff",
        threshold: 15,
        lineWidth: 1.2,
      };
    }
    if (isDimmed) {
      return {
        visible: true,
        color: color,
        threshold: 15,
        lineWidth: 0.15,
      };
    }
    return {
      visible: true,
      color: color,
      threshold: 15,
      lineWidth: 0.6,
    };
  }, [isSelected, isHovered, color, selectedId]);

  // Render the appropriate geometry
  const renderGeometry = () => {
    switch (shape) {
      case "box": {
        const [w, h, d] = args;
        return (
          <mesh castShadow receiveShadow {...interactionProps}>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial {...materialProps} />
            <Edges
              visible={outlineProps.visible}
              color={outlineProps.color}
              threshold={outlineProps.threshold}
              lineWidth={outlineProps.lineWidth}
            />
          </mesh>
        );
      }
      case "cylinder": {
        const [rt, rb, h, s] = args;
        return (
          <mesh castShadow receiveShadow {...interactionProps}>
            <cylinderGeometry args={[rt, rb, h, s]} />
            <meshStandardMaterial {...materialProps} />
            <Edges
              visible={outlineProps.visible}
              color={outlineProps.color}
              threshold={outlineProps.threshold}
              lineWidth={outlineProps.lineWidth}
            />
          </mesh>
        );
      }
      case "ring": {
        const [innerRad, outerRad, segs] = args;
        // For a flat ring, render a thin 3D tube/cylinder or a horizontal flat ring
        return (
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, 0, 0]}
            receiveShadow 
            {...interactionProps}
          >
            <ringGeometry args={[innerRad, outerRad, segs]} />
            <meshStandardMaterial {...materialProps} side={2} />
            <Edges
              visible={outlineProps.visible}
              color={outlineProps.color}
              threshold={outlineProps.threshold}
              lineWidth={outlineProps.lineWidth}
            />
          </mesh>
        );
      }
      default:
        return null;
    }
  };

  return <group position={position}>{renderGeometry()}</group>;
});
