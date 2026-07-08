import React, { useMemo } from "react";
import { useSpatialStore } from "../store/useSpatialStore";
import { EntityRegistry } from "../registry/EntityRegistry";
import { Box } from "@react-three/drei";

export const DebugOverlay = React.memo(function DebugOverlay() {
  const isVisible = useSpatialStore((state) => state.activeLayers["debug"]);
  const selectedId = useSpatialStore((state) => state.selectedId);

  const selectedEntity = useMemo(() => {
    if (!selectedId) return undefined;
    return EntityRegistry.getInstance().getById(selectedId);
  }, [selectedId]);

  if (!isVisible) return null;

  return (
    <group name="debug-overlay">
      {/* Dynamic developer coordinates/axes helper */}
      <axesHelper args={[150]} />
      
      {/* Selected Entity bounding helper to show operational boundaries */}
      {selectedEntity && (
        <group position={selectedEntity.position}>
          {/* Wireframe box outlining the selected object */}
          <Box args={selectedEntity.type === "zone" ? selectedEntity.dimensions : [8, 8, 8]}>
            <meshBasicMaterial
              color="#e53e3e"
              wireframe
              transparent
              opacity={0.8}
            />
          </Box>
          {/* Small debug height pointer */}
          <mesh position={[0, -selectedEntity.position[1] / 2, 0]}>
            <cylinderGeometry args={[0.05, 0.05, selectedEntity.position[1], 4]} />
            <meshBasicMaterial color="#e53e3e" transparent opacity={0.5} />
          </mesh>
        </group>
      )}
    </group>
  );
});
