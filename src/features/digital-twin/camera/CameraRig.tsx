import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { CameraControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useDigitalTwinStore } from "../store/useDigitalTwinStore";
import { useSpatialStore } from "../store/useSpatialStore";
import { RouteAnimator } from "../../navigation/visualization/RouteAnimator";

export interface CameraRigHandle {
  transitionTo: (
    position: readonly [number, number, number],
    target: readonly [number, number, number],
    duration?: number
  ) => Promise<void>;
}

export const CameraRig = forwardRef<CameraRigHandle>((props, ref) => {
  const controlsRef = useRef<CameraControls>(null);
  const reducedMotion = useDigitalTwinStore((state) => state.environment.reducedMotion);

  const cameraMode = useSpatialStore((state) => state.cameraMode);
  const activeRoute = useSpatialStore((state) => state.activeRoute);
  const routeAnimationProgress = useSpatialStore((state) => state.routeAnimationProgress);

  // Expose transition command for overview and focus target zoom operations
  useImperativeHandle(ref, () => ({
    transitionTo: async (position, target, duration = 1.5) => {
      const controls = controlsRef.current;
      if (!controls) return;

      const transitionEnabled = !reducedMotion && duration > 0;

      if (transitionEnabled) {
        controls.smoothTime = duration;
      } else {
        controls.smoothTime = 0; // Instant cut for reduced motion
      }

      await controls.setLookAt(
        position[0], position[1], position[2],
        target[0], target[1], target[2],
        transitionEnabled
      );

      if (transitionEnabled) {
        controls.smoothTime = 0.4;
      }
    },
  }));

  // Playback listener: updates camera transformation matrices on each frame during a journey
  useFrame(() => {
    if (cameraMode === "route-follow" && activeRoute && controlsRef.current) {
      const spline = RouteAnimator.getSpline(activeRoute.id, activeRoute.path);
      if (spline) {
        // If prefers-reduced-motion is active, snap instantly to the destination target coords
        const progress = reducedMotion ? 1.0 : routeAnimationProgress;
        const { target, position } = RouteAnimator.sampleJourney(spline, progress);

        controlsRef.current.setLookAt(
          position.x, position.y, position.z,
          target.x, target.y, target.z,
          false // instant transformation (smoothness is driven by timeline ticks)
        );
      }
    }
  });

  // OS preferences reduced motion listener
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const store = useDigitalTwinStore.getState();
    store.setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      useDigitalTwinStore.getState().setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      // Enable basic rotation & zoom for inspection, but keep it smooth
      smoothTime={0.4}
      draggingSmoothTime={0.1}
    />
  );
});

CameraRig.displayName = "CameraRig";
export default CameraRig;
