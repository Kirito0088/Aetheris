import { useCallback } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useSpatialStore } from "../store/useSpatialStore";
import { useDigitalTwinStore } from "../store/useDigitalTwinStore";
import { useExperienceDirector } from "../../experience/director/ExperienceDirector";

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

  const setTwinHovered = useDigitalTwinStore((state) => state.setHovered);
  const setTwinSelected = useDigitalTwinStore((state) => state.setSelected);

  // Central Experience Director actions
  const setHoveredEntity = useExperienceDirector((state) => state.setHoveredEntity);
  const setSelectedEntity = useExperienceDirector((state) => state.setSelectedEntity);

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHoveredId(id);
      setTwinHovered(id);
      setHoveredEntity(id, position);
      
      // Interactive pointer context
      document.body.style.cursor = "pointer";
    },
    [id, position, setHoveredId, setTwinHovered, setHoveredEntity]
  );

  const handlePointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHoveredId(null);
      setTwinHovered(null);
      setHoveredEntity(null, null);
      
      // Default pointer context
      document.body.style.cursor = "default";
    },
    [setHoveredId, setTwinHovered, setHoveredEntity]
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      
      if (selectedId === id) {
        // Deselect
        setSelectedId(null);
        setTwinSelected(null);
        setSelectedEntity(null, null);
        document.body.style.cursor = "pointer";
      } else {
        // Select
        setSelectedId(id);
        setTwinSelected(id);
        setSelectedEntity(id, position);
        
        // Selection cursor context
        document.body.style.cursor = "cell";
        
        // Calculate camera focus target vector
        const targetVec = new THREE.Vector3(...position);
        
        // Offset the camera dynamically
        const cameraOffset = new THREE.Vector3(30, 40, 50);
        const cameraPos = targetVec.clone().add(cameraOffset);
        
        focusOnTarget(cameraPos, targetVec);
      }
    },
    [id, position, selectedId, setSelectedId, setTwinSelected, setSelectedEntity, focusOnTarget]
  );

  return {
    onPointerOver: handlePointerOver,
    onPointerOut: handlePointerOut,
    onClick: handleClick,
  };
}
