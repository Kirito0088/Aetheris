import React, { useMemo } from "react";
import { EntityRegistry } from "../registry/EntityRegistry";
import type { GateEntityConfig } from "../entities/types";
import { GateEntity } from "../entities/GateEntity";
import { useSpatialStore } from "../store/useSpatialStore";

export const GateOverlay = React.memo(function GateOverlay() {
  const isVisible = useSpatialStore((state) => state.activeLayers["gates"]);

  const gates = useMemo(() => {
    if (!isVisible) return [];
    return EntityRegistry.getInstance().getByType("gate") as GateEntityConfig[];
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <group name="gates-overlay">
      {gates.map((gate) => (
        <GateEntity key={gate.id} config={gate} />
      ))}
    </group>
  );
});
