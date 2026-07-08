import React from "react";
import { ZoneOverlay } from "./ZoneOverlay";
import { GateOverlay } from "./GateOverlay";
import { POIOverlay } from "./POIOverlay";
import { DebugOverlay } from "./DebugOverlay";

export const OverlayManager = React.memo(function OverlayManager() {
  return (
    <group name="overlay-manager">
      <ZoneOverlay />
      <GateOverlay />
      <POIOverlay />
      <DebugOverlay />
    </group>
  );
});
