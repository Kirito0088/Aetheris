"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useSpatialStore } from "../../digital-twin/store/useSpatialStore";
import { RouteAnimator } from "./RouteAnimator";
import * as THREE from "three";

export const RouteOverlay = React.memo(function RouteOverlay() {
  const activeRoute = useSpatialStore((state) => state.activeRoute);
  const isVisible = useSpatialStore((state) => state.activeLayers["routes"]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineRef = useRef<any>(null);

  // Animates the line's dashOffset to create a beautiful moving flow direction
  useFrame((state) => {
    if (lineRef.current?.material) {
      lineRef.current.material.dashOffset = -state.clock.getElapsedTime() * 2.0;
    }
  });

  // Calculate the color of the path based on route type
  const routeColor = useMemo(() => {
    if (!activeRoute) return "#ffffff";
    switch (activeRoute.type) {
      case "accessible":
        return "#38a169"; // Operational green for wheelchair-accessible paths
      case "vip":
        return "#d69e2e"; // Gold for VIP pathways
      case "emergency":
        return "#e53e3e"; // Crimson for emergency egress routes
      case "standard":
      default:
        return "#3182ce"; // Premium blue for standard public routes
    }
  }, [activeRoute]);

  // Generate smooth visual points using the centripetal Catmull-Rom spline
  const curvePoints = useMemo(() => {
    if (!activeRoute || !isVisible) return null;

    const spline = RouteAnimator.getSpline(activeRoute.id, activeRoute.path);
    if (!spline) return null;

    // Retrieve 120 points along the spline to draw a perfectly smooth curve
    const points = spline.getPoints(120);
    return points.map((p) => new THREE.Vector3(p.x, p.y + 0.3, p.z)); // Raise slightly off the ground to prevent z-fighting
  }, [activeRoute, isVisible]);

  if (!activeRoute || !isVisible || !curvePoints) return null;

  return (
    <group name="route-visualization-overlay">
      {/* Thick glowing background path line */}
      <Line
        points={curvePoints}
        color={routeColor}
        lineWidth={6}
        opacity={0.35}
        transparent
      />

      {/* Foreground directional flowing dashed line */}
      <Line
        ref={lineRef}
        points={curvePoints}
        color="#ffffff"
        lineWidth={3.5}
        dashed
        dashScale={0.8}
        dashSize={1.5}
        gapSize={1.2}
        opacity={0.9}
        transparent
      />

      {/* Target destination ping/glow */}
      <mesh position={curvePoints[curvePoints.length - 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 4, 32]} />
        <meshBasicMaterial
          color={routeColor}
          transparent
          opacity={0.25}
          side={2}
        />
      </mesh>
    </group>
  );
});
export default RouteOverlay;
