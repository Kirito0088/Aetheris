import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { CameraControls } from '@react-three/drei';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';

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

  // Expose the transition method to the orchestrator
  useImperativeHandle(ref, () => ({
    transitionTo: async (position, target, duration = 1.5) => {
      const controls = controlsRef.current;
      if (!controls) return;
      
      const transitionEnabled = !reducedMotion && duration > 0;
      
      // We set smoothTime to the requested duration just for this transition
      if (transitionEnabled) {
        controls.smoothTime = duration;
      } else {
        controls.smoothTime = 0; // Instant cut
      }

      await controls.setLookAt(
        position[0], position[1], position[2],
        target[0], target[1], target[2],
        transitionEnabled
      );
      
      // Reset smoothTime back to default after transition
      if (transitionEnabled) {
        controls.smoothTime = 0.4;
      }
    }
  }));

  // Initial OS-level reduced motion check
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const store = useDigitalTwinStore.getState();
    store.setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      useDigitalTwinStore.getState().setReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      // Disable manual user controls to enforce cinematic/programmatic control
      mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
      touches={{ one: 0, two: 0, three: 0 }}
      smoothTime={0.4}
      draggingSmoothTime={0.1}
    />
  );
});

CameraRig.displayName = 'CameraRig';
