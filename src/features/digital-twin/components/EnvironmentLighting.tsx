"use client";

import React from "react";
import { Environment } from "@react-three/drei";

export function EnvironmentLighting() {
  return (
    <>
      {/* Ambient base lighting (Calm, safe, clear) */}
      <ambientLight intensity={0.4} />

      {/* Key Light - Primary illumination (Sun/Main architectural light) */}
      <directionalLight
        position={[50, 100, 50]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={300}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.0001}
      />

      {/* Fill Light - Softens shadows from the opposite side */}
      <directionalLight 
        position={[-50, 50, -50]} 
        intensity={0.4} 
        color="#a5c4ec" // subtle cool tint 
      />

      {/* Rim Light - Highlights edges for depth separation */}
      <directionalLight 
        position={[0, 30, -80]} 
        intensity={0.6} 
        color="#ffffff" 
      />

      {/* 
        HDRI Environment for accurate reflections on glass/metallic materials.
        Using a preset that matches architectural/clear conditions. 
      */}
      <Environment preset="city" />
    </>
  );
}
