"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useSpatialStore } from "../store/useSpatialStore";
import { EntityRegistry } from "../registry/EntityRegistry";
import { Maximize2, X, MapPin } from "lucide-react";

export const SelectionLegend = React.memo(function SelectionLegend() {
  const selectedId = useSpatialStore((state) => state.selectedId);
  const setSelectedId = useSpatialStore((state) => state.setSelectedId);
  const focusOnTarget = useSpatialStore((state) => state.focusOnTarget);

  const selectedEntity = useMemo(() => {
    if (!selectedId) return undefined;
    return EntityRegistry.getInstance().getById(selectedId);
  }, [selectedId]);

  const handleZoom = () => {
    if (selectedEntity) {
      const targetVec = new THREE.Vector3(...selectedEntity.position);
      const cameraOffset = new THREE.Vector3(30, 40, 50);
      const cameraPos = targetVec.clone().add(cameraOffset);
      focusOnTarget(cameraPos, targetVec);
    }
  };

  if (!selectedEntity) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-950/20">
        <MapPin className="w-5 h-5 text-neutral-600 mb-2" />
        <p className="text-[11px] text-neutral-500 font-medium">
          No Spatial Entity Selected
        </p>
        <p className="text-[9px] text-neutral-600 mt-1 max-w-[200px]">
          Hover or click on stadium zones, gates, or points of interest to inspect operational details.
        </p>
      </div>
    );
  }

  // Type badge styling
  const typeBadgeColors = {
    zone: "bg-blue-950/40 text-blue-400 border-blue-900/50",
    gate: "bg-teal-950/40 text-teal-400 border-teal-900/50",
    poi: "bg-purple-950/40 text-purple-400 border-purple-900/50",
  }[selectedEntity.type];

  return (
    <article
      className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 shadow-lg"
      aria-label={`Spatial Entity Details: ${selectedEntity.name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border ${typeBadgeColors}`}>
            {selectedEntity.type}
          </span>
          <h3 className="text-sm font-semibold text-white leading-tight">
            {selectedEntity.name}
          </h3>
          <code className="text-[9px] text-neutral-500 block font-mono">
            {selectedEntity.id}
          </code>
        </div>
        <button
          onClick={() => setSelectedId(null)}
          className="text-neutral-500 hover:text-white p-1 rounded-md hover:bg-neutral-900 transition-colors focus:ring-1 focus:ring-blue-500/50 focus:outline-none"
          aria-label="Close details"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Description */}
      <p className="text-[11px] text-neutral-400 leading-normal mb-4 font-normal">
        {selectedEntity.metadata.description || "No operational description provided."}
      </p>

      {/* Metadata Attributes */}
      <div className="space-y-2 border-t border-neutral-900 pt-3 mb-4">
        {Object.entries(selectedEntity.metadata)
          .filter(([key]) => key !== "description")
          .map(([key, value]) => (
            <div key={key} className="flex justify-between items-center text-[10px]">
              <span className="text-neutral-500 font-normal capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </span>
              <span className="text-neutral-300 font-mono text-right">
                {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
              </span>
            </div>
          ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-1">
        <button
          onClick={handleZoom}
          className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-800 rounded-lg text-[10px] font-medium transition-all focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
          aria-label="Focus camera on entity"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Focus Camera</span>
        </button>
      </div>
    </article>
  );
});
