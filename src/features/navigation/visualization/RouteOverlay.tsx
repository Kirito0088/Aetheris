"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { animate } from "framer-motion";
import { useSpatialStore } from "../../digital-twin/store/useSpatialStore";
import { useDigitalTwinStore } from "../../digital-twin/store/useDigitalTwinStore";
import { RouteAnimator } from "./RouteAnimator";
import { MOTION_TIMINGS } from "@/features/experience";

export const RouteOverlay = React.memo(function RouteOverlay() {
  const activeRoute = useSpatialStore((state) => state.activeRoute);
  const isVisible = useSpatialStore((state) => state.activeLayers["routes"]);
  const reducedMotion = useDigitalTwinStore((state) => state.environment.reducedMotion);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineRef = useRef<any>(null);
  const [drawProgress, setDrawProgress] = useState(0);

  // Animate the progressive draw when active route changes
  useEffect(() => {
    if (!activeRoute) {
      setDrawProgress(0);
      return;
    }

    if (reducedMotion) {
      setDrawProgress(1);
      return;
    }

    setDrawProgress(0);
    const controls = animate(0, 1, {
      duration: MOTION_TIMINGS.hero / 1000, // Hero token (900ms)
      ease: [0.0, 0.0, 0.2, 1.0], // Decelerate curve
      onUpdate: (latest) => setDrawProgress(latest),
    });

    return () => controls.stop();
  }, [activeRoute, reducedMotion]);

  // Animates the line's dashOffset to create a moving flow direction (towards destination)
  useFrame((state) => {
    if (lineRef.current?.material) {
      lineRef.current.material.dashOffset = -state.clock.getElapsedTime() * 2.5;
    }
  });

  // Calculate the color of the path based on route type
  const routeColor = useMemo(() => {
    if (!activeRoute) return "#ffffff";
    switch (activeRoute.type) {
      case "accessible":
        return "#10b981"; // Operational green for wheelchair-accessible paths
      case "vip":
        return "#f59e0b"; // Gold for VIP pathways
      case "emergency":
        return "#ef4444"; // Crimson for emergency egress routes
      case "standard":
      default:
        return "#3b82f6"; // Premium blue for standard public routes
    }
  }, [activeRoute]);

  // Generate smooth visual points using the centripetal Catmull-Rom spline
  const curvePoints = useMemo(() => {
    if (!activeRoute || !isVisible) return null;

    const spline = RouteAnimator.getSpline(activeRoute.id, activeRoute.path);
    if (!spline) return null;

    // Retrieve 120 points along the spline to draw a perfectly smooth curve
    const points = spline.getPoints(120);
    return points.map((p) => [p.x, p.y + 0.3, p.z] as [number, number, number]); // Raise slightly off the ground to prevent z-fighting
  }, [activeRoute, isVisible]);

  // Sliced points based on progressive draw progress
  const slicedPoints = useMemo(() => {
    if (!curvePoints) return null;
    if (drawProgress >= 1) return curvePoints;
    
    // We need at least 2 points to render a Line
    const limit = Math.max(2, Math.floor(drawProgress * curvePoints.length));
    return curvePoints.slice(0, limit);
  }, [curvePoints, drawProgress]);

  if (!activeRoute || !isVisible || !slicedPoints || slicedPoints.length < 2) return null;

  return (
    <group name="route-visualization-overlay">
      {/* Thick glowing background path line */}
      <Line
        points={slicedPoints}
        color={routeColor}
        lineWidth={6}
        opacity={0.35 * drawProgress}
        transparent
        depthTest={false}
      />

      {/* Foreground directional flowing dashed line */}
      <Line
        ref={lineRef}
        points={slicedPoints}
        color="#ffffff"
        lineWidth={3.5}
        dashed
        dashScale={0.8}
        dashSize={1.5}
        gapSize={1.2}
        opacity={0.9 * drawProgress}
        transparent
        depthTest={false}
      />

      {/* Target destination ping/glow */}
      {drawProgress > 0.9 && curvePoints && curvePoints.length > 0 && (
        <mesh position={curvePoints[curvePoints.length - 1]!} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0, 4, 32]} />
          <meshBasicMaterial
            color={routeColor}
            transparent
            opacity={0.25}
            side={2}
          />
        </mesh>
      )}
    </group>
  );
});
export default RouteOverlay;
