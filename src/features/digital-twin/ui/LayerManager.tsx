"use client";

import React, { useMemo } from "react";
import { LAYER_CONFIGS } from "../layers/layer-config";
import { useSpatialStore } from "../store/useSpatialStore";
import { LayerToggle } from "./LayerToggle";

export const LayerManager = React.memo(function LayerManager() {
  const activeLayers = useSpatialStore((state) => state.activeLayers);
  const toggleLayer = useSpatialStore((state) => state.toggleLayer);

  // Group layer configs by category
  const categorizedLayers = useMemo(() => {
    return {
      infrastructure: LAYER_CONFIGS.filter((l) => l.category === "infrastructure"),
      intelligence: LAYER_CONFIGS.filter((l) => l.category === "intelligence"),
      helpers: LAYER_CONFIGS.filter((l) => l.category === "helpers"),
    };
  }, []);

  return (
    <section className="space-y-4" aria-label="Layer Controls">
      <div>
        <h3 className="text-[10px] font-semibold mb-2 px-1" style={{ color: 'var(--text-tertiary)' }}>
          Infrastructure
        </h3>
        <div className="space-y-1">
          {categorizedLayers.infrastructure.map((layer) => (
            <LayerToggle
              key={layer.id}
              id={layer.id}
              name={layer.name}
              description={layer.description}
              isActive={!!activeLayers[layer.id]}
              onToggle={() => toggleLayer(layer.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-semibold mb-2 px-1" style={{ color: 'var(--text-tertiary)' }}>
          Spatial Intelligence
        </h3>
        <div className="space-y-1">
          {categorizedLayers.intelligence.map((layer) => (
            <LayerToggle
              key={layer.id}
              id={layer.id}
              name={layer.name}
              description={layer.description}
              isActive={!!activeLayers[layer.id]}
              onToggle={() => toggleLayer(layer.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-semibold mb-2 px-1" style={{ color: 'var(--text-tertiary)' }}>
          Helpers & Tools
        </h3>
        <div className="space-y-1">
          {categorizedLayers.helpers.map((layer) => (
            <LayerToggle
              key={layer.id}
              id={layer.id}
              name={layer.name}
              description={layer.description}
              isActive={!!activeLayers[layer.id]}
              onToggle={() => toggleLayer(layer.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
