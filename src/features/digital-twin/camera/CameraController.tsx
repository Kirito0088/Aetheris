import { useEffect, useRef } from "react";
import { useDigitalTwinStore } from "../store/useDigitalTwinStore";
import { useSpatialStore } from "../store/useSpatialStore";
import { CameraRig, type CameraRigHandle } from "./CameraRig";
import { CAMERA_PATHS } from "../config/camera-paths";

export function CameraController() {
  const currentPathName = useDigitalTwinStore((state) => state.camera.currentPath);
  const setTransitioning = useDigitalTwinStore((state) => state.setTransitioning);

  const cameraPosition = useSpatialStore((state) => state.cameraPosition);
  const cameraTarget = useSpatialStore((state) => state.cameraTarget);
  const cameraMode = useSpatialStore((state) => state.cameraMode);

  const rigRef = useRef<CameraRigHandle>(null);

  // Transition for useDigitalTwinStore cinematic paths
  useEffect(() => {
    const path = CAMERA_PATHS[currentPathName];
    if (path && rigRef.current && cameraMode === "overview") {
      setTransitioning(true);
      rigRef.current
        .transitionTo(path.position, path.target, path.transitionDuration)
        .then(() => {
          setTransitioning(false);
        });
    }
  }, [currentPathName, setTransitioning, cameraMode]);

  // Transition for useSpatialStore spatial selection focus - only in 'focus' mode
  useEffect(() => {
    if (rigRef.current && cameraMode === "focus") {
      const posArray = [cameraPosition.x, cameraPosition.y, cameraPosition.z] as const;
      const targetArray = [cameraTarget.x, cameraTarget.y, cameraTarget.z] as const;
      rigRef.current.transitionTo(posArray, targetArray, 1.2);
    }
  }, [cameraPosition, cameraTarget, cameraMode]);

  return <CameraRig ref={rigRef} />;
}
export default CameraController;
