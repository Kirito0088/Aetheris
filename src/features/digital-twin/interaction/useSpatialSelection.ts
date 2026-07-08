import { useCallback } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useSpatialStore } from "../store/useSpatialStore";

export interface UseSpatialSelectionOptions {
  id: string;
  position: [number, number, number];
  boundingBox?: [number, number, number];
}

export function useSpatialSelection(options: UseSpatialSelectionOptions) {
  const { id, position } = options;
  const setHoveredId = useSpatialStore((state) => state.setHoveredId);
  const setSelectedId = useSpatialStore((state) => state.setSelectedId);
  const selectedId = useSpatialStore((state) => state.selectedId);
  const focusOnTarget = useSpatialStore((state) => state.focusOnTarget);

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHoveredId(id);
      document.body.style.cursor = "pointer";
    },
    [id, setHoveredId]
  );

  const handlePointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHoveredId(null);
      document.body.style.cursor = "default";
    },
    [setHoveredId]
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      
      if (selectedId === id) {
        // Deselect
        setSelectedId(null);
      } else {
        // Select
        setSelectedId(id);
        
        // Calculate a camera focus position offset
        // Typically, we want to look at the target from a reasonable distance
        const targetVec = new THREE.Vector3(...position);
        
        // Height of the camera focus depends on the entity height
        const cameraOffset = new THREE.Vector3(30, 40, 50); // standard offset
        const cameraPos = targetVec.clone().add(cameraOffset);
        
        focusOnTarget(cameraPos, targetVec);
      }
    },
    [id, position, selectedId, setSelectedId, focusOnTarget]
  );

  return {
    onPointerOver: handlePointerOver,
    onPointerOut: handlePointerOut,
    onClick: handleClick,
  };
}
