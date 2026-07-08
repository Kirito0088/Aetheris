"use client";

import React, { useRef, useEffect } from "react";
import { CameraControls } from "@react-three/drei";
import { useSpatialStore } from "../store/useSpatialStore";

export function CameraController() {
  const cameraControlsRef = useRef<CameraControls>(null);
  
  const cameraMode = useSpatialStore((state) => state.cameraMode);
  const cameraPosition = useSpatialStore((state) => state.cameraPosition);
  const cameraTarget = useSpatialStore((state) => state.cameraTarget);

  useEffect(() => {
    if (cameraControlsRef.current) {
      // Smooth interpolation is handled natively by CameraControls when enableTransition is true.
      cameraControlsRef.current.setLookAt(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z,
        cameraTarget.x,
        cameraTarget.y,
        cameraTarget.z,
        true // enable transition
      );
    }
  }, [cameraPosition, cameraTarget, cameraMode]);

  return (
    <CameraControls 
      ref={cameraControlsRef} 
      makeDefault 
      minDistance={10}
      maxDistance={300}
      // Restrict polar angle so the camera can't go below the ground plane (0 to Math.PI / 2)
      maxPolarAngle={Math.PI / 2 - 0.05} 
      smoothTime={0.4} // Smooth, deliberate cinematic motion
    />
  );
}
