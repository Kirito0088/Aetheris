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
    let opacity = 0.15;
    let emissiveIntensity = 0.0;
    let mainColor = color;

    if (isSelected) {
      opacity = 0.45;
      emissiveIntensity = 0.35;
      mainColor = "#3182ce"; // Premium selection blue
    } else if (isHovered) {
      opacity = 0.3;
      emissiveIntensity = 0.15;
    }

    return {
      color: mainColor,
      transparent: true,
      opacity,
      roughness: 0.5,
      metalness: 0.1,
      emissive: isSelected ? "#3182ce" : mainColor,
      emissiveIntensity,
      depthWrite: false, // Prevents Z-fighting and opacity overlap issues
    };
  }, [isSelected, isHovered, color]);

  // Outline (Edges) properties
  const outlineProps = useMemo(() => {
    if (isSelected) {
      return {
        visible: true,
        color: "#63b3ed",
        threshold: 15,
        lineWidth: 1.5,
      };
    }
    if (isHovered) {
      return {
        visible: true,
        color: "#ffffff",
        threshold: 15,
        lineWidth: 1.0,
      };
    }
    return {
      visible: true,
      color: color,
      threshold: 15,
      lineWidth: 0.5,
    };
  }, [isSelected, isHovered, color]);

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
