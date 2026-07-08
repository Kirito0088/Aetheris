import React from "react";
import { ZoneOverlay } from "./ZoneOverlay";
import { GateOverlay } from "./GateOverlay";
import { POIOverlay } from "./POIOverlay";
import { DebugOverlay } from "./DebugOverlay";
import { RouteOverlay } from "../../navigation/visualization/RouteOverlay";

export const OverlayManager = React.memo(function OverlayManager() {
  return (
    <group name="overlay-manager">
      <ZoneOverlay />
      <GateOverlay />
      <POIOverlay />
      <RouteOverlay />
      <DebugOverlay />
    </group>
  );
});
export default OverlayManager;
