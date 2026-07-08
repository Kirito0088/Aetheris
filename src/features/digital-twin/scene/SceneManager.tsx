import { Origin, Ground, SpatialGrid, Bounds, Axes } from '../world';
import { Lighting, Atmosphere } from '../environment';
import { CameraController } from '../camera';
import { StadiumFoundation } from '../stadium';
import { OverlayManager } from '../overlays';
import { useSpatialStore } from '../store/useSpatialStore';

export function SceneManager() {
  const activeLayers = useSpatialStore((state) => state.activeLayers);

  return (
    <>
      <CameraController />
      <Lighting />
      <Atmosphere />
      
      <Bounds>
        <Origin>
          {activeLayers.stadium && <StadiumFoundation />}
          <OverlayManager />
          {activeLayers.grid && <SpatialGrid />}
          {activeLayers.debug && <Axes />}
        </Origin>
        <Ground />
      </Bounds>
    </>
  );
}

