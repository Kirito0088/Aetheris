'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { useExperienceDirector } from '../director/ExperienceDirector';
import { useDigitalTwinStore } from '../../digital-twin/store/useDigitalTwinStore';
import { STADIUM_CONFIG } from '../../digital-twin/stadium/stadium-config';

const PARTICLE_COUNT = 200;

// Pure static generation at module load time (outside component render cycle)
const PARTICLE_DATA = (() => {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const speeds = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = Math.random() * 60 + 1; // Above pitch
    positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
    speeds[i] = Math.random() * 0.15 + 0.05; // Slow vertical velocity
  }
  return { positions, speeds };
})();

// Active lighting preset from STADIUM_CONFIG
const activeLighting = STADIUM_CONFIG.lighting.presets[STADIUM_CONFIG.lighting.defaultPreset];

export function EnvironmentalSystems() {
  const expState = useExperienceDirector((s) => s.state);
  const ambientIntensityMultiplier = useExperienceDirector((s) => s.ambientIntensityMultiplier);
  const setStepStatus = useExperienceDirector((s) => s.setStepStatus);
  const reducedMotion = useDigitalTwinStore((s) => s.environment.reducedMotion);

  useEffect(() => {
    setStepStatus('environment', 'success');
  }, [setStepStatus]);

  // References for animating elements
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Dynamic environment loop for synchronizing lighting, atmospheric haze, clouds
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Ramping logic for environment multipliers during REVEAL stage
    if (expState === 'REVEAL') {
      const curAmbient = useExperienceDirector.getState().ambientIntensityMultiplier;
      if (curAmbient < 1) {
        const nextVal = Math.min(1, curAmbient + delta * 0.85);
        useExperienceDirector.setState({
          ambientIntensityMultiplier: nextVal,
          gridOpacityMultiplier: nextVal
        });
      }
    }

    // Calculate ambient light evolution (slow breathing of the environment)
    if (ambientLightRef.current) {
      const baseline = expState === 'BOOTING' || expState === 'INITIALIZING' || expState === 'REVEAL'
        ? activeLighting.ambientIntensity * ambientIntensityMultiplier 
        : activeLighting.ambientIntensity;
      
      const breathing = reducedMotion ? 0 : Math.sin(time * 0.2) * 0.03;
      ambientLightRef.current.intensity = Math.max(0, baseline + breathing);
      
      // Subtle color temperature evolution (slight warm/cool blend)
      const colorBlend = Math.sin(time * 0.1) * 0.05 + 0.5;
      ambientLightRef.current.color.lerpColors(
        new THREE.Color('#88bbee'), // Cool
        new THREE.Color('#ffeedd'), // Warm
        colorBlend
      );
    }

    // Slowly move directional light to simulate celestial arc (tiny light evolution)
    if (sunLightRef.current && !reducedMotion) {
      const sunAngle = time * 0.01;
      const radius = 180;
      sunLightRef.current.position.set(
        Math.cos(sunAngle) * radius,
        150,
        Math.sin(sunAngle) * radius
      );
      
      const baseIntensity = expState === 'BOOTING' || expState === 'INITIALIZING' || expState === 'REVEAL'
        ? activeLighting.sunIntensity * ambientIntensityMultiplier
        : activeLighting.sunIntensity;
      sunLightRef.current.intensity = baseIntensity;
    }

    // Slowly translate clouds
    if (cloudsRef.current && !reducedMotion) {
      cloudsRef.current.children.forEach((cloud, index) => {
        cloud.position.x += 0.03 * (index % 2 === 0 ? 1 : -1);
        cloud.position.z += 0.015 * (index % 3 === 0 ? 1 : -0.5);

        // Wrap around boundary
        if (Math.abs(cloud.position.x) > 300) cloud.position.x = -cloud.position.x;
        if (Math.abs(cloud.position.z) > 250) cloud.position.z = -cloud.position.z;
      });
    }

    // Atmospheric Haze (slow breathing fog depth)
    if (state.scene.fog && state.scene.fog instanceof THREE.Fog && !reducedMotion) {
      const breathingFogNear = activeLighting.fogNear + Math.sin(time * 0.15) * 10;
      const breathingFogFar = activeLighting.fogFar + Math.sin(time * 0.15) * 50;
      
      const revealFactor = expState === 'BOOTING' || expState === 'INITIALIZING' || expState === 'REVEAL'
        ? ambientIntensityMultiplier
        : 1.0;
        
      state.scene.fog.near = breathingFogNear * revealFactor;
      state.scene.fog.far = breathingFogFar * revealFactor;
    }

    // Floating light environmental particles update
    if (particlesRef.current && !reducedMotion) {
      const geometry = particlesRef.current.geometry;
      const positionAttr = geometry.attributes.position;
      if (positionAttr) {
        const positions = positionAttr.array as Float32Array;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const idxX = i * 3;
          const idxY = i * 3 + 1;
          const idxZ = i * 3 + 2;

          // Translate vertically upwards
          positions[idxY] = (positions[idxY] || 0) + (PARTICLE_DATA.speeds[i] || 0.1) * 0.3;

          // Apply a gentle side-to-side drift (sinus oscillation)
          positions[idxX] = (positions[idxX] || 0) + Math.sin(time * 0.8 + i) * 0.02;

          // Wrap around ceiling boundary (stadium height bounds)
          if ((positions[idxY] || 0) > 70) {
            positions[idxY] = 1;
            positions[idxX] = (Math.random() - 0.5) * 200;
            positions[idxZ] = (Math.random() - 0.5) * 160;
          }
        }
        positionAttr.needsUpdate = true;
      }
    }
  });

  return (
    <group name="environmental-timeline">
      {/* Scene Fog — depth atmosphere */}
      <fog attach="fog" args={['#d0cfc8', activeLighting.fogNear, activeLighting.fogFar]} />

      {/* 1. Synced Ambient Light */}
      <ambientLight ref={ambientLightRef} intensity={activeLighting.ambientIntensity} />

      {/* 1b. Hemisphere light for natural ground/sky bounce */}
      <hemisphereLight
        args={['#b1e1ff', '#b97a20', 0.25]}
        position={[0, 50, 0]}
      />

      {/* 2. Synced Sun Directional Light — tightened frustum for shadow quality */}
      <directionalLight
        ref={sunLightRef}
        position={activeLighting.sunPosition}
        intensity={activeLighting.sunIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-160}
        shadow-camera-right={160}
        shadow-camera-top={160}
        shadow-camera-bottom={-160}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />

      {/* 3. Rim Light (Structural Depth illumination) */}
      <directionalLight
        ref={rimLightRef}
        position={[0, 30, -100]}
        intensity={activeLighting.rimIntensity * ambientIntensityMultiplier}
        color={activeLighting.rimColor}
      />

      {/* 4. Fill Light from opposite side for depth */}
      <directionalLight
        position={[-120, 60, -80]}
        intensity={0.3}
        color="#c8d8f0"
      />

      {/* 5. Atmospheric Sky Backdrop */}
      <Sky
        distance={45000}
        sunPosition={activeLighting.sunPosition}
        inclination={0.49}
        azimuth={0.25}
        turbidity={activeLighting.skyTurbidity}
        rayleigh={activeLighting.skyRayleigh}
        mieCoefficient={0.002}
        mieDirectionalG={0.8}
      />

      {/* 6. Moving Clouds high above stadium */}
      <group ref={cloudsRef} name="high-clouds">
        <mesh position={[-80, 140, -60]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[140, 80]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.035} side={2} />
        </mesh>
        <mesh position={[90, 140, 50]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[160, 100]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.025} side={2} />
        </mesh>
        <mesh position={[-100, 140, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[120, 70]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.03} side={2} />
        </mesh>
      </group>

      {/* 7. Subtly Floating Dust Particles */}
      {!reducedMotion && (
        <points ref={particlesRef} name="environmental-particles">
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[PARTICLE_DATA.positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.45}
            color="#88ccff"
            transparent
            opacity={0.25}
            sizeAttenuation={true}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
}
export default EnvironmentalSystems;

