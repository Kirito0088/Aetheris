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
    if (selectedId !== "poi:medical-01") {
      list.push({
        label: "First Aid Station",
        endId: "poi:medical-01",
        type: "standard" as const,
        icon: Activity,
      });
    }
    if (selectedId !== "poi:exit-01") {
      list.push({
        label: "Emergency Exit",
        endId: "poi:exit-01",
        type: "emergency" as const,
        icon: ShieldAlert,
      });
    }
    if (selectedId !== "zone:vip" && selectedEntity?.type === "gate") {
      list.push({
        label: "VIP Lounge",
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
      <div
        className="flex flex-col items-center justify-center p-6 text-center rounded-xl"
        style={{
          background: 'var(--surface-sunken)',
          border: '1px dashed var(--border-default)',
        }}
      >
        <MapPin className="w-5 h-5 mb-2" style={{ color: 'var(--text-disabled)' }} />
        <p className="text-[11px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>
          No Entity Selected
        </p>
        <p className="text-[10px] mt-1 max-w-[200px] leading-relaxed" style={{ color: 'var(--text-disabled)' }}>
          Click on stadium zones, columns, or entrances to inspect details.
        </p>
      </div>
    );
  }

  const typeStyle = {
    zone: { bg: 'hsla(214, 86%, 55%, 0.08)', color: 'var(--brand-blue)' },
    gate: { bg: 'hsla(160, 84%, 39%, 0.08)', color: 'var(--brand-emerald)' },
    poi: { bg: 'hsla(270, 60%, 55%, 0.08)', color: 'hsl(270, 60%, 55%)' },
  }[selectedEntity.type] || { bg: 'var(--surface-sunken)', color: 'var(--text-secondary)' };

  return (
    <article
      className="p-4 rounded-xl space-y-3"
      style={{
        background: 'var(--surface-elevated)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--elevation-1)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
      }}
      aria-label={`Spatial Entity Details: ${selectedEntity.name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-bold capitalize"
            style={{ background: typeStyle.bg, color: typeStyle.color }}
          >
            {selectedEntity.type}
          </span>
          <h3 className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {selectedEntity.name}
          </h3>
          <code
            className="text-[9px] block"
            style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}
          >
            {selectedEntity.id}
          </code>
        </div>
        <button
          onClick={() => setSelectedId(null)}
          className="p-1 rounded-lg transition-colors cursor-pointer"
          style={{ color: 'var(--text-disabled)' }}
          aria-label="Close details"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Description */}
      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
        {selectedEntity.metadata.description || "No description available."}
      </p>

      {/* Metadata */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        <h4 className="text-[9px] font-semibold mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
          Details
        </h4>
        <div className="space-y-1.5">
          {Object.entries(selectedEntity.metadata)
            .filter(([key]) => key !== "description")
            .map(([key, value]) => (
              <div key={key} className="flex justify-between items-center text-[11px]">
                <span className="capitalize" style={{ color: 'var(--text-tertiary)' }}>
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Spatial Relationships */}
      <div className="space-y-2.5" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        <h4 className="text-[9px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>
          Connections
        </h4>

        {/* Connected Zones */}
        <div className="text-[11px]">
          <span className="block mb-1" style={{ color: 'var(--text-tertiary)' }}>Adjacent Zones</span>
          {connectedZones.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {connectedZones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setSelectedId(z.id)}
                  className={clsx(
                    "px-2 py-0.5 rounded-full text-[9px] font-medium transition-all cursor-pointer"
                  )}
                  style={{
                    background: 'var(--surface-sunken)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {z.name}
                </button>
              ))}
            </div>
          ) : (
            <span className="italic text-[10px]" style={{ color: 'var(--text-disabled)' }}>No connections</span>
          )}
        </div>

        {/* Nearby POIs */}
        <div className="text-[11px]">
          <span className="block mb-1" style={{ color: 'var(--text-tertiary)' }}>Nearby Services</span>
          {nearbyPOIs.length > 0 ? (
            <div className="space-y-1">
              {nearbyPOIs.map((poi) => (
                <div
                  key={poi.id}
                  className="flex justify-between items-center p-1.5 rounded-lg"
                  style={{ background: 'var(--surface-sunken)' }}
                >
                  <button
                    onClick={() => setSelectedId(poi.id)}
                    className="font-medium text-left truncate max-w-[170px] cursor-pointer"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {poi.name}
                  </button>
                  <span style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)', fontSize: '9px' }}>
                    {poi.distance}m
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="italic text-[10px]" style={{ color: 'var(--text-disabled)' }}>None nearby</span>
          )}
        </div>

        {/* Route Shortcuts */}
        {shortcuts.length > 0 && (
          <div className="text-[11px] space-y-1">
            <span className="block mb-1" style={{ color: 'var(--text-tertiary)' }}>Quick Routes</span>
            <div className="grid grid-cols-2 gap-1.5">
              {shortcuts.map((sh, idx) => {
                const Icon = sh.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleShortcutRoute(sh.endId, sh.type)}
                    className="flex items-center gap-1 p-1.5 rounded-lg text-[9px] font-medium transition-all text-left cursor-pointer"
                    style={{
                      background: 'hsla(214, 86%, 55%, 0.06)',
                      border: '1px solid hsla(214, 86%, 55%, 0.12)',
                      color: 'var(--brand-blue)',
                    }}
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

      {/* Focus Camera */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '4px' }}>
        <button
          onClick={handleZoom}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer"
          style={{
            background: 'var(--surface-sunken)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
          }}
        >
          <Maximize2 className="w-3 h-3" />
          <span>Focus Camera</span>
        </button>
      </div>
    </article>
  );
});
export default SelectionLegend;
