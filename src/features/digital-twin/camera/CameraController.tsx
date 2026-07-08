import { useEffect, useRef } from 'react';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';
import { CameraRig, type CameraRigHandle } from './CameraRig';
import { CAMERA_PATHS } from '../config/camera-paths';

export function CameraController() {
  const currentPathName = useDigitalTwinStore((state) => state.camera.currentPath);
  const setTransitioning = useDigitalTwinStore((state) => state.setTransitioning);
  const rigRef = useRef<CameraRigHandle>(null);

  useEffect(() => {
    const path = CAMERA_PATHS[currentPathName];
    if (path && rigRef.current) {
      setTransitioning(true);
      rigRef.current
        .transitionTo(path.position, path.target, path.transitionDuration)
        .then(() => {
          setTransitioning(false);
        });
    }
  }, [currentPathName, setTransitioning]);

  return <CameraRig ref={rigRef} />;
}
