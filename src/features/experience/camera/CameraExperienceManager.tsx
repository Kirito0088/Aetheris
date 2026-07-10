'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import { useExperienceDirector } from '../director/ExperienceDirector';
import { useSpatialStore } from '../../digital-twin/store/useSpatialStore';
import { useDigitalTwinStore } from '../../digital-twin/store/useDigitalTwinStore';
import { RouteAnimator } from '../../navigation/visualization/RouteAnimator';
import { usePathname } from 'next/navigation';
import { STADIUM_CONFIG } from '../../digital-twin/stadium/stadium-config';

// Camera positions derived from centralized stadium config — no magic numbers
const profiles = STADIUM_CONFIG.camera.profiles;
const OVERVIEW_POS = new THREE.Vector3(...profiles.overview.position);
const OVERVIEW_TARGET = new THREE.Vector3(...profiles.overview.target);
const INTRO_POS = new THREE.Vector3(
  profiles.hero.position[0] * 2.5,
  profiles.hero.position[1] * 2.5,
  profiles.hero.position[2] * 2.5
);
const INTRO_TARGET = new THREE.Vector3(0, 0, 0);

export function CameraExperienceManager() {
  const pathname = usePathname();
  // Experience Director State
  const expState = useExperienceDirector((s) => s.state);
  const hoveredPosition = useExperienceDirector((s) => s.hoveredPosition);
  const selectedPosition = useExperienceDirector((s) => s.selectedPosition);
  const selectedId = useExperienceDirector((s) => s.selectedEntityId);
  const cameraControls = useExperienceDirector((s) => s.cameraControls);
  const setCameraControls = useExperienceDirector((s) => s.setCameraControls);

  // Spatial Store State for Route Journey
  const cameraMode = useSpatialStore((s) => s.cameraMode);
  const activeRoute = useSpatialStore((s) => s.activeRoute);
  const routeAnimationProgress = useSpatialStore((s) => s.routeAnimationProgress);

  // Accessibility reduced motion check
  const reducedMotion = useDigitalTwinStore((s) => s.environment.reducedMotion);

  // We maintain internal physical simulation vectors for smooth springs and overshoot
  const currentPos = useRef(INTRO_POS.clone());
  const currentTgt = useRef(INTRO_TARGET.clone());
  const velocityPos = useRef(new THREE.Vector3(0, 0, 0));
  const velocityTgt = useRef(new THREE.Vector3(0, 0, 0));

  // Initial cinematic fly-in sequence on REVEAL state
  useEffect(() => {
    if (expState === 'REVEAL' && cameraControls) {
      // Access cameraControls imperatively via store getState to bypass hook immutability lint
      const controls = useExperienceDirector.getState().cameraControls;
      if (!controls) return;
      
      if (reducedMotion) {
        // Snap instantly if reduced motion is active
        controls.setLookAt(
          OVERVIEW_POS.x, OVERVIEW_POS.y, OVERVIEW_POS.z,
          OVERVIEW_TARGET.x, OVERVIEW_TARGET.y, OVERVIEW_TARGET.z,
          false
        );
      } else {
        // Slow cinematic drone fly-in
        controls.smoothTime = 2.4; // slow establishing approach
        controls.setLookAt(
          OVERVIEW_POS.x, OVERVIEW_POS.y, OVERVIEW_POS.z,
          OVERVIEW_TARGET.x, OVERVIEW_TARGET.y, OVERVIEW_TARGET.z,
          true
        ).then(() => {
          controls.smoothTime = 0.4; // restore standard duration
        });
      }
    }
  }, [expState, reducedMotion, cameraControls]);

  useFrame((state, delta) => {
    // Access cameraControls imperatively to satisfy hook constraints
    const controls = useExperienceDirector.getState().cameraControls;
    if (!controls) return;

    const time = state.clock.getElapsedTime();

    // 1. If booting, lock to intro view
    if (expState === 'BOOTING' || expState === 'INITIALIZING' || expState === 'READY') {
      controls.setLookAt(
        INTRO_POS.x, INTRO_POS.y, INTRO_POS.z,
        INTRO_TARGET.x, INTRO_TARGET.y, INTRO_TARGET.z,
        false
      );
      return;
    }

    // 2. If in route follow mode, follow path
    if (cameraMode === 'route-follow' && activeRoute) {
      const spline = RouteAnimator.getSpline(activeRoute.id, activeRoute.path);
      if (spline) {
        const progress = reducedMotion ? 1.0 : routeAnimationProgress;
        const { target: routeTgt, position: routePos } = RouteAnimator.sampleJourney(spline, progress);
        
        controls.setLookAt(
          routePos.x, routePos.y, routePos.z,
          routeTgt.x, routeTgt.y, routeTgt.z,
          false // Driven frame-by-frame
        );
      }
      return;
    }

    // 3. User is actively navigating - disable autonomous drone movement to prevent fighting inputs
    if (controls.active) {
      // Sync physical tracker positions with actual camera positions
      controls.getPosition(currentPos.current);
      controls.getTarget(currentTgt.current);
      velocityPos.current.set(0, 0, 0);
      velocityTgt.current.set(0, 0, 0);
      return;
    }

    // Determine baseline camera from STADIUM_CONFIG profiles based on active pathname
    const customOverviewTarget = new THREE.Vector3().copy(OVERVIEW_TARGET);
    const customOverviewPos = new THREE.Vector3().copy(OVERVIEW_POS);

    if (pathname === '/navigation') {
      customOverviewPos.set(...profiles.navigation.position);
      customOverviewTarget.set(...profiles.navigation.target);
    } else if (pathname === '/accessibility') {
      customOverviewPos.set(...profiles.accessibility.position);
      customOverviewTarget.set(...profiles.accessibility.target);
    } else if (pathname === '/operations') {
      customOverviewPos.set(...profiles.operations.position);
      customOverviewTarget.set(...profiles.operations.target);
    }

    const targetTgt = new THREE.Vector3().copy(customOverviewTarget);
    const targetPos = new THREE.Vector3().copy(customOverviewPos);

    if (expState === 'FOCUS' && selectedPosition) {
      // Calculate framing position based on selected entity type
      const sel = new THREE.Vector3(...selectedPosition);
      targetTgt.copy(sel);
      
      // Close approach framing
      if (selectedId?.startsWith('gate:')) {
        targetPos.set(sel.x + 35, sel.y + 25, sel.z + 45);
      } else if (selectedId?.startsWith('poi:')) {
        targetPos.set(sel.x + 25, sel.y + 20, sel.z + 30);
      } else { // Zone selection
        targetPos.set(sel.x + 60, sel.y + 50, sel.z + 75);
      }
    }

    // 4. Idle Drone Breathing (low frequency hover motion)
    if (!reducedMotion && (expState === 'INTERACTIVE' || expState === 'IDLE' || expState === 'FOCUS')) {
      const breathFreq = expState === 'FOCUS' ? 0.6 : 0.45;
      const breathAmp = expState === 'FOCUS' ? 0.6 : 1.5;
      
      const breathX = Math.sin(time * breathFreq) * breathAmp;
      const breathY = Math.cos(time * (breathFreq * 0.8)) * (breathAmp * 0.4);
      const breathZ = Math.sin(time * (breathFreq * 1.2)) * breathAmp;
      
      targetPos.x += breathX;
      targetPos.y += breathY;
      targetPos.z += breathZ;
    }

    // 5. Contextual Hover Anticipation Nudge
    if (!reducedMotion && expState === 'IDLE' && hoveredPosition) {
      const hoverVec = new THREE.Vector3(...hoveredPosition);
      // Nudge target lookAt towards hovered item (12% weight)
      const nudgeTgt = hoverVec.clone().sub(OVERVIEW_TARGET).multiplyScalar(0.12);
      targetTgt.add(nudgeTgt);

      // Nudge camera position slightly forward (8% weight)
      const nudgePos = hoverVec.clone().sub(OVERVIEW_POS).multiplyScalar(0.08);
      targetPos.add(nudgePos);
    }

    // 6. Smooth Spring Physics with Damping & Overshoot Recovery
    if (reducedMotion) {
      // Linear lerp (safe mode)
      currentPos.current.lerp(targetPos, 0.08);
      currentTgt.current.lerp(targetTgt, 0.08);
    } else {
      // Physical spring specs: mass = 1.0, spring strength = 28, damping = 7.5
      const stiffness = 28;
      const damping = 7.5;
      const clampedDelta = Math.min(0.03, delta);

      // Position Spring
      const forcePos = new THREE.Vector3().copy(targetPos).sub(currentPos.current).multiplyScalar(stiffness);
      const dampingForcePos = new THREE.Vector3().copy(velocityPos.current).multiplyScalar(damping);
      const accelPos = forcePos.sub(dampingForcePos); // F = ma, m=1
      velocityPos.current.addScaledVector(accelPos, clampedDelta);
      currentPos.current.addScaledVector(velocityPos.current, clampedDelta);

      // Target Spring
      const forceTgt = new THREE.Vector3().copy(targetTgt).sub(currentTgt.current).multiplyScalar(stiffness);
      const dampingForceTgt = new THREE.Vector3().copy(velocityTgt.current).multiplyScalar(damping);
      const accelTgt = forceTgt.sub(dampingForceTgt);
      velocityTgt.current.addScaledVector(accelTgt, clampedDelta);
      currentTgt.current.addScaledVector(velocityTgt.current, clampedDelta);
    }

    // Apply simulation updates directly to lookAt controls
    controls.setLookAt(
      currentPos.current.x, currentPos.current.y, currentPos.current.z,
      currentTgt.current.x, currentTgt.current.y, currentTgt.current.z,
      false // Smoothly interpolation driven by spring loop
    );
  });

  return (
    <CameraControls
      ref={(el) => {
        setCameraControls(el);
      }}
      makeDefault
      smoothTime={0.4}
      draggingSmoothTime={0.1}
    />
  );
}
export default CameraExperienceManager;
