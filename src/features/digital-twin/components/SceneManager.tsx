"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { EnvironmentLighting } from "./EnvironmentLighting";
import { CameraController } from "./CameraController";
import * as THREE from "three";

export function SceneManager({ children }: { children?: React.ReactNode }) {
  return (
    <div className="w-full h-full relative bg-neutral-950">
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]} // Support high-DPI displays but cap at 2 for performance
      >
        <CameraController />
        <EnvironmentLighting />
        
        {/* Foundation Grid for visual context before stadium is loaded */}
        <gridHelper args={[200, 100, 0x333333, 0x111111]} position={[0, -0.1, 0]} />
        
        {/* Placeholder Box to represent the focus target */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color="#4A90E2" roughness={0.7} metalness={0.2} />
        </mesh>

        {children}
      </Canvas>
    </div>
  );
}
