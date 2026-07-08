export interface LayerConfig {
  id: string;
  name: string;
  description: string;
  defaultActive: boolean;
  category: "infrastructure" | "intelligence" | "helpers";
}

export const LAYER_CONFIGS: LayerConfig[] = [
  {
    id: "stadium",
    name: "Stadium",
    description: "Main stadium infrastructure and 3D architectural shell",
    defaultActive: true,
    category: "infrastructure",
  },
  {
    id: "zones",
    name: "Stadium Zones",
    description: "Operational stands, pitch, concourse, and parking areas",
    defaultActive: true,
    category: "intelligence",
  },
  {
    id: "gates",
    name: "Gates & Entrances",
    description: "Entry gates, turnstiles, and accessibility ramps",
    defaultActive: true,
    category: "intelligence",
  },
  {
    id: "pois",
    name: "Points of Interest",
    description: "Operational services (Restrooms, Food, Medical, Elevators, Exits)",
    defaultActive: false,
    category: "intelligence",
  },
  {
    id: "grid",
    name: "Spatial Grid",
    description: "Operational overlay grid lines and coordinate alignment reference",
    defaultActive: false,
    category: "helpers",
  },
  {
    id: "debug",
    name: "Debug Info",
    description: "Developer coordinate axes and bounding helper outlines",
    defaultActive: false,
    category: "helpers",
  },
];
