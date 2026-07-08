import React, { useMemo } from "react";
import { EntityRegistry } from "../registry/EntityRegistry";
import type { POIEntityConfig } from "../entities/types";
import { POIEntity } from "../entities/POIEntity";
import { useSpatialStore } from "../store/useSpatialStore";

export const POIOverlay = React.memo(function POIOverlay() {
  const isVisible = useSpatialStore((state) => state.activeLayers["pois"]);

  const pois = useMemo(() => {
    if (!isVisible) return [];
    return EntityRegistry.getInstance().getByType("poi") as POIEntityConfig[];
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <group name="pois-overlay">
      {pois.map((poi) => (
        <POIEntity key={poi.id} config={poi} />
      ))}
    </group>
  );
});
