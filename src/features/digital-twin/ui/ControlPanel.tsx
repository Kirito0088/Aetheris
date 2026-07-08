"use client";

import React from "react";
import { useSpatialStore } from "../store/useSpatialStore";
import { LayerManager } from "./LayerManager";
import { SelectionLegend } from "./SelectionLegend";
import { Compass, RotateCcw, Keyboard, Eye } from "lucide-react";
import { clsx } from "clsx";

export const ControlPanel = React.memo(function ControlPanel() {
  const cameraMode = useSpatialStore((state) => state.cameraMode);
  const resetToOverview = useSpatialStore((state) => state.resetToOverview);
  const selectedId = useSpatialStore((state) => state.selectedId);

  return (
    <div
      className={clsx(
        "w-72 max-h-[85vh] overflow-y-auto select-none",
        "bg-neutral-950/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-4 space-y-5",
        "pointer-events-auto shadow-2xl transition-all duration-300",
        "scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
      )}
      role="region"
      aria-label="Spatial Intelligence Control Deck"
    >
      {/* HUD Header */}
      <header className="flex items-center justify-between border-b border-neutral-900 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h2 className="text-xs font-bold text-white tracking-widest uppercase font-mono">
            SPATIAL COMMAND
          </h2>
        </div>
        <span className="text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded uppercase">
          Phase 04
        </span>
      </header>

      {/* Camera Controller & View Mode */}
      <section className="space-y-3" aria-label="Camera Controls">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Compass className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Camera Viewport
            </span>
          </div>
          <span className="text-[9px] font-mono text-neutral-500 uppercase">
            {cameraMode} mode
          </span>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-900 rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-white leading-none">
              {cameraMode === "overview"
                ? "Tactical Overview"
                : cameraMode === "focus"
                ? "Target Focus Lock"
                : "Operational View"}
            </span>
            <span className="text-[9px] text-neutral-500 font-mono mt-1">
              {cameraMode === "focus" && selectedId
                ? `Lock: ${selectedId.split(":")[1] || selectedId}`
                : "Overview Coordinates"}
            </span>
          </div>

          {cameraMode !== "overview" && (
            <button
              onClick={resetToOverview}
              className="flex items-center justify-center space-x-1 px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-blue-500/20 rounded-md text-[9px] font-semibold transition-all focus:ring-1 focus:ring-blue-500/50 focus:outline-none"
              aria-label="Reset camera to overview"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </section>

      {/* Layer Toggle Manager */}
      <div className="border-t border-neutral-900 pt-4">
        <div className="flex items-center space-x-1.5 mb-3">
          <Eye className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Layer Overlays
          </span>
        </div>
        <LayerManager />
      </div>

      {/* Entity Selection Details */}
      <div className="border-t border-neutral-900 pt-4">
        <SelectionLegend />
      </div>

      {/* Accessibility / Help footer */}
      <footer className="flex items-center justify-between border-t border-neutral-900 pt-3 text-[9px] text-neutral-500">
        <div className="flex items-center space-x-1 font-mono">
          <Keyboard className="w-2.5 h-2.5" />
          <span>Tab / Esc navigable</span>
        </div>
        <span className="font-mono">FIFA WC 2026</span>
      </footer>
    </div>
  );
});
export default ControlPanel;
