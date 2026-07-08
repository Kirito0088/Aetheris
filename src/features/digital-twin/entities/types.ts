export type EntityType = "zone" | "gate" | "poi";

export interface BaseEntity {
  id: string;
  name: string;
  type: EntityType;
  position: [number, number, number];
  metadata: Record<string, string | number | boolean>;
}

export interface ZoneMetadata {
  description: string;
  capacity: number;
  securityStatus: "clear" | "warning" | "restricted";
  accessibilityFeatures: string;
}

export interface ZoneEntityConfig extends BaseEntity {
  type: "zone";
  dimensions: [number, number, number]; // [width, height, depth] or radius/height depending on shape
  shape: "box" | "cylinder" | "ring";
  args: number[]; // parameters for geometries
  color: string;
  metadata: ZoneMetadata & Record<string, string | number | boolean>;
}

export interface GateMetadata {
  status: "open" | "closed" | "restricted";
  accessibilityRamp: boolean;
  type: "standard" | "vip" | "media" | "emergency";
  waitRampId?: string;
}

export interface GateEntityConfig extends BaseEntity {
  type: "gate";
  color: string;
  metadata: GateMetadata & Record<string, string | number | boolean>;
}

export type POICategory =
  | "restroom"
  | "food-court"
  | "medical"
  | "information"
  | "elevator"
  | "exit"
  | "parking";

export interface POIMetadata {
  category: POICategory;
  status: "operational" | "maintenance" | "emergency-only";
  access: "public" | "vip" | "staff";
  description: string;
}

export interface POIEntityConfig extends BaseEntity {
  type: "poi";
  metadata: POIMetadata & Record<string, string | number | boolean>;
}

export type SpatialEntityConfig = ZoneEntityConfig | GateEntityConfig | POIEntityConfig;
