import React, { useMemo } from "react";
import { EntityRegistry } from "../registry/EntityRegistry";
import type { ZoneEntityConfig } from "../entities/types";
import { ZoneEntity } from "../entities/ZoneEntity";
import { useSpatialStore } from "../store/useSpatialStore";

export const ZoneOverlay = React.memo(function ZoneOverlay() {
  const isVisible = useSpatialStore((state) => state.activeLayers["zones"]);

  const zones = useMemo(() => {
    if (!isVisible) return [];
    return EntityRegistry.getInstance().getByType("zone") as ZoneEntityConfig[];
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <group name="zones-overlay">
      {zones.map((zone) => (
        <ZoneEntity key={zone.id} config={zone} />
      ))}
    </group>
  );
});
