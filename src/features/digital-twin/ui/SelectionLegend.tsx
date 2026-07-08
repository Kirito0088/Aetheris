"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useSpatialStore } from "../store/useSpatialStore";
import { EntityRegistry } from "../registry/EntityRegistry";
import { GraphBuilder } from "../../navigation/graph/GraphBuilder";
import { Maximize2, X, MapPin, Activity, ShieldAlert, Crown } from "lucide-react";
import { clsx } from "clsx";

export const SelectionLegend = React.memo(function SelectionLegend() {
  const selectedId = useSpatialStore((state) => state.selectedId);
  const setSelectedId = useSpatialStore((state) => state.setSelectedId);
  const focusOnTarget = useSpatialStore((state) => state.focusOnTarget);

  // Routing actions to trigger shortcuts
  const setRoutingStartId = useSpatialStore((state) => state.setRoutingStartId);
  const setRoutingEndId = useSpatialStore((state) => state.setRoutingEndId);
  const setRoutingType = useSpatialStore((state) => state.setRoutingType);

  // Load the static stadium graph once to compute topological relationships
  const graph = useMemo(() => GraphBuilder.build(), []);

  const selectedEntity = useMemo(() => {
    if (!selectedId) return undefined;
    return EntityRegistry.getInstance().getById(selectedId);
  }, [selectedId]);

  // Compute topological connected zones dynamically using the graph
  const connectedZones = useMemo(() => {
    if (!selectedId) return [];
    const edges = graph.getEdges(selectedId);
    const zonesList: { id: string; name: string }[] = [];

    edges.forEach((edge) => {
      const node = graph.getNode(edge.to);
      if (node && node.type === "zone") {
        if (!zonesList.some((z) => z.id === node.id)) {
          zonesList.push({ id: node.id, name: node.name });
        }
      } else if (node && node.type === "waypoint") {
        // Retrieve indirect connections from waypoint segments
        const subEdges = graph.getEdges(node.id);
        subEdges.forEach((subEdge) => {
          const subNode = graph.getNode(subEdge.to);
          if (subNode && subNode.type === "zone") {
            if (!zonesList.some((z) => z.id === subNode.id)) {
              zonesList.push({ id: subNode.id, name: subNode.name });
            }
          }
        });
      }
    });

    return zonesList;
  }, [selectedId, graph]);

  // Get nearby POIs dynamically within 55 meters in 3D space
  const nearbyPOIs = useMemo(() => {
    if (!selectedEntity) return [];

    const allNearby = EntityRegistry.getInstance().getNearby(selectedEntity.position, 55);
    return allNearby
      .filter((e) => e.id !== selectedEntity.id && e.type === "poi")
      .map((e) => {
        const dx = e.position[0] - selectedEntity.position[0];
        const dy = e.position[1] - selectedEntity.position[1];
        const dz = e.position[2] - selectedEntity.position[2];
        const dist = Math.round(Math.sqrt(dx * dx + dy * dy + dz * dz));
        return {
          id: e.id,
          name: e.name,
          distance: dist,
          category: (e.metadata.category as string) || "general",
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4); // limit to top 4 closest
  }, [selectedEntity]);

  // Dynamic route shortcuts based on selection context
  const shortcuts = useMemo(() => {
    if (!selectedId) return [];
    
    const list = [];
    // If selected is not the first aid station, offer route to First Aid
    if (selectedId !== "poi:medical-01") {
      list.push({
        label: "First Aid Station 1",
        endId: "poi:medical-01",
        type: "standard" as const,
        icon: Activity,
      });
    }
    // If selected is not the emergency exit, offer egress shortcut
    if (selectedId !== "poi:exit-01") {
      list.push({
        label: "Emergency Egress Route",
        endId: "poi:exit-01",
        type: "emergency" as const,
        icon: ShieldAlert,
      });
    }
    // For VIP access routes
    if (selectedId !== "zone:vip" && selectedEntity?.type === "gate") {
      list.push({
        label: "VIP Executive Club",
        endId: "zone:vip",
        type: "vip" as const,
        icon: Crown,
      });
    }
    return list.slice(0, 2);
  }, [selectedId, selectedEntity]);

  const handleZoom = () => {
    if (selectedEntity) {
      const targetVec = new THREE.Vector3(...selectedEntity.position);
      const cameraOffset = new THREE.Vector3(30, 40, 50);
      const cameraPos = targetVec.clone().add(cameraOffset);
      focusOnTarget(cameraPos, targetVec);
    }
  };

  const handleShortcutRoute = (endId: string, type: "standard" | "accessible" | "emergency" | "vip") => {
    if (!selectedId) return;
    setRoutingStartId(selectedId);
    setRoutingEndId(endId);
    setRoutingType(type);
  };

  if (!selectedEntity) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-950/20">
        <MapPin className="w-5 h-5 text-neutral-600 mb-2" />
        <p className="text-[11px] text-neutral-500 font-medium font-mono">
          NO SPATIAL ENTITY SELECTED
        </p>
        <p className="text-[9px] text-neutral-600 mt-1 max-w-[200px]">
          Hover or click on stadium zones, gates, or points of interest to inspect operational details.
        </p>
      </div>
    );
  }

  const typeColors = {
    zone: "bg-blue-950/40 text-blue-400 border-blue-900/50",
    gate: "bg-teal-950/40 text-teal-400 border-teal-900/50",
    poi: "bg-purple-950/40 text-purple-400 border-purple-900/50",
  }[selectedEntity.type];

  return (
    <article
      className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950/60 shadow-lg text-white space-y-3"
      aria-label={`Spatial Entity Details: ${selectedEntity.name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className={clsx("inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase border", typeColors)}>
            {selectedEntity.type}
          </span>
          <h3 className="text-xs font-semibold text-white leading-tight">
            {selectedEntity.name}
          </h3>
          <code className="text-[9px] text-neutral-500 block font-mono">
            {selectedEntity.id}
          </code>
        </div>
        <button
          onClick={() => setSelectedId(null)}
          className="text-neutral-500 hover:text-white p-1 rounded-md hover:bg-neutral-900 transition-colors focus:outline-none"
          aria-label="Close details"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Description */}
      <p className="text-[10px] text-neutral-400 leading-relaxed font-normal">
        {selectedEntity.metadata.description || "No operational description provided."}
      </p>

      {/* Reusable Metadata Table (No Hardcoding) */}
      <div className="border-t border-neutral-900 pt-2.5">
        <h4 className="text-[9px] font-bold text-neutral-500 uppercase font-mono tracking-wider mb-1.5">
          Operational Metadata
        </h4>
        <div className="space-y-1.5">
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
      </div>

      {/* Spatial Relationships Section */}
      <div className="border-t border-neutral-900 pt-2.5 space-y-2">
        <h4 className="text-[9px] font-bold text-neutral-500 uppercase font-mono tracking-wider">
          Spatial Relationships
        </h4>

        {/* Connected Zones */}
        <div className="text-[10px]">
          <span className="text-neutral-500 block font-mono text-[8px] uppercase">Connected Zones:</span>
          {connectedZones.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-1">
              {connectedZones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setSelectedId(z.id)}
                  className="bg-neutral-900 hover:bg-neutral-850 hover:text-white border border-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded text-[8px] font-mono transition-all"
                >
                  {z.name}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-neutral-600 block mt-0.5 italic">No local stand connections</span>
          )}
        </div>

        {/* Nearby POIs */}
        <div className="text-[10px]">
          <span className="text-neutral-500 block font-mono text-[8px] uppercase">Nearby Services (50m):</span>
          {nearbyPOIs.length > 0 ? (
            <div className="space-y-1 mt-1">
              {nearbyPOIs.map((poi) => (
                <div key={poi.id} className="flex justify-between items-center bg-neutral-900/40 p-1 border border-neutral-900 rounded">
                  <button
                    onClick={() => setSelectedId(poi.id)}
                    className="text-neutral-300 hover:text-white font-medium text-left truncate max-w-[170px]"
                  >
                    {poi.name}
                  </button>
                  <span className="text-neutral-500 font-mono text-[9px]">{poi.distance}m</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-neutral-600 block mt-0.5 italic">No nearby services</span>
          )}
        </div>

        {/* Dynamic Navigation Shortcuts */}
        {shortcuts.length > 0 && (
          <div className="text-[10px] space-y-1">
            <span className="text-neutral-500 block font-mono text-[8px] uppercase">Quick Dispatch Routes:</span>
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              {shortcuts.map((sh, idx) => {
                const Icon = sh.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleShortcutRoute(sh.endId, sh.type)}
                    className="flex items-center space-x-1 p-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded text-[8px] font-medium transition-all text-left"
                  >
                    <Icon className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{sh.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Focus Camera Actions */}
      <div className="flex pt-1 border-t border-neutral-900">
        <button
          onClick={handleZoom}
          className="w-full flex items-center justify-center space-x-1.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-800 rounded-lg text-[10px] font-semibold transition-all focus:outline-none focus:ring-1 focus:ring-blue-500/50"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Focus Camera Viewport</span>
        </button>
      </div>
    </article>
  );
});
export default SelectionLegend;
