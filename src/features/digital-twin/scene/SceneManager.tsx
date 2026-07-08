import { Origin, Ground, SpatialGrid, Bounds, Axes } from '../world';
import { Lighting, Atmosphere } from '../environment';
import { CameraController } from '../camera';
import { StadiumFoundation } from '../stadium';

export function SceneManager() {
  return (
    <>
      <CameraController />
      <Lighting />
      <Atmosphere />
      
      <Bounds>
        <Origin>
          <StadiumFoundation />
          <SpatialGrid />
          <Axes />
        </Origin>
        <Ground />
      </Bounds>
    </>
  );
}
