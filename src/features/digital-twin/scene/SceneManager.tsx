import { Origin, Ground, SpatialGrid, Bounds, Axes } from '../world';
import { StadiumFoundation } from '../stadium';
import { OverlayManager } from '../overlays';
import { useSpatialStore } from '../store/useSpatialStore';
import { usePathname } from 'next/navigation';
import { CameraExperienceManager, LandingCameraController, EnvironmentalSystems, useExperienceDirector } from '@/features/experience';
import { useEffect } from 'react';

export function SceneManager() {
  const activeLayers = useSpatialStore((state) => state.activeLayers);
  const pathname = usePathname();
  const isLanding = pathname === '/';
  
  const setStepStatus = useExperienceDirector((s) => s.setStepStatus);

  useEffect(() => {
    if (isLanding) {
      // Landing page bypasses LoadingExperience, so immediately establish interactive lights
      useExperienceDirector.setState({
        state: 'INTERACTIVE',
        ambientIntensityMultiplier: 1,
        gridOpacityMultiplier: 1,
        initStatus: {
          experience: 'success',
          renderer: 'success',
          spatial: 'success',
          navigation: 'success',
          environment: 'success',
          camera: 'success'
        }
      });
    } else {
      // When the 3D SceneManager mounts inside Canvas, Three.js and WebGL are operational
      setStepStatus('renderer', 'success');
      setStepStatus('spatial', 'success');
    }
  }, [isLanding, setStepStatus]);

  return (
    <>
      {isLanding ? <LandingCameraController /> : <CameraExperienceManager />}
      <EnvironmentalSystems />
      
      <Bounds>
        <Origin>
          {activeLayers.stadium && <StadiumFoundation />}
          {!isLanding && <OverlayManager />}
          {activeLayers.grid && <SpatialGrid />}
          {activeLayers.debug && <Axes />}
        </Origin>
        <Ground />
      </Bounds>
    </>
  );
}

