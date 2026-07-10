import type { SpatialEntityConfig } from "../entities/types";

/**
 * Entity Definitions — Phase 6 Priority 1.1 GLB-Anchored
 *
 * All positions are derived from the verified GLB bounding box analysis.
 * After the SpatialAdapter applies scale=0.40 and the root Y↔Z swap:
 *
 * GLB world coordinates (post-transform):
 *   X: -110 to +110 (east-west)
 *   Z: -100 to +100 (north-south)
 *   Y:   0  to  32  (ground to roof peak)
 *
 * The stadium is an oval/elliptical shape wider on X than Z.
 * The structural frame (mesh 18) reaches the full footprint.
 * The seating bowl is roughly at Y=4–12 (inner ring).
 * The roof canopy peaks at Y≈32.
 *
 * Gates are placed at the cardinal points of the outer stadium perimeter.
 * POIs are placed along the concourse ring just inside the outer wall.
 * Stands occupy the bowl geometry between the pitch and the outer wall.
 *
 * These are OPERATIONAL ENTITIES anchored onto the stadium geometry.
 * They are application metadata — not fake geometry.
 */

export const ZONE_DEFINITIONS: SpatialEntityConfig[] = [
  {
    id: "zone:pitch",
    name: "Stadium Pitch",
    type: "zone",
    position: [0, 0.5, 0],
    shape: "box",
    dimensions: [70, 1, 44],
    args: [70, 1, 44],
    color: "#2f855a",
    metadata: {
      description: "FIFA World Cup 2026 regulation pitch — Jeju World Cup Stadium",
      capacity: 22,
      securityStatus: "clear",
      accessibilityFeatures: "Level access from underground tunnels",
    },
  },
  {
    id: "zone:north-stand",
    name: "North Stand",
    type: "zone",
    position: [0, 8, -58],
    shape: "box",
    dimensions: [70, 14, 22],
    args: [70, 14, 22],
    color: "#2c5282",
    metadata: {
      description: "General admission seating — north end behind the goal",
      capacity: 9000,
      securityStatus: "clear",
      accessibilityFeatures: "Designated wheelchair spaces in lower rows",
    },
  },
  {
    id: "zone:south-stand",
    name: "South Stand",
    type: "zone",
    position: [0, 8, 58],
    shape: "box",
    dimensions: [70, 14, 22],
    args: [70, 14, 22],
    color: "#2c5282",
    metadata: {
      description: "General admission seating — south end family zone",
      capacity: 9000,
      securityStatus: "clear",
      accessibilityFeatures: "Designated wheelchair spaces in lower rows",
    },
  },
  {
    id: "zone:east-stand",
    name: "East Stand",
    type: "zone",
    position: [72, 8, 0],
    shape: "box",
    dimensions: [22, 14, 70],
    args: [22, 14, 70],
    color: "#2c5282",
    metadata: {
      description: "Premium club seating and hospitality suites",
      capacity: 11000,
      securityStatus: "clear",
      accessibilityFeatures: "Elevator access to all tiers",
    },
  },
  {
    id: "zone:west-stand",
    name: "West Stand",
    type: "zone",
    position: [-72, 8, 0],
    shape: "box",
    dimensions: [22, 14, 70],
    args: [22, 14, 70],
    color: "#2c5282",
    metadata: {
      description: "Media center, broadcast suites, and executive seating",
      capacity: 8000,
      securityStatus: "clear",
      accessibilityFeatures: "Full ramp accessibility and tactile flooring",
    },
  },
  {
    id: "zone:vip",
    name: "VIP Executive Club",
    type: "zone",
    position: [-68, 12, 0],
    shape: "box",
    dimensions: [10, 4, 24],
    args: [10, 4, 24],
    color: "#b7791f",
    metadata: {
      description: "Exclusive suite level for FIFA dignitaries and VIP guests",
      capacity: 1200,
      securityStatus: "restricted",
      accessibilityFeatures: "Private direct elevator and level access",
    },
  },
  {
    id: "zone:concourse",
    name: "Main Concourse Ring",
    type: "zone",
    position: [0, 1.5, 0],
    shape: "ring",
    dimensions: [80, 95, 64],
    args: [80, 95, 64],
    color: "#4a5568",
    metadata: {
      description: "Circulation area connecting all stands, concessions, and services",
      capacity: 35000,
      securityStatus: "clear",
      accessibilityFeatures: "Wide, step-free access throughout the entire level",
    },
  },
  {
    id: "zone:parking",
    name: "North Parking Lot",
    type: "zone",
    position: [0, 0.05, -115],
    shape: "box",
    dimensions: [100, 0.1, 20],
    args: [100, 0.1, 20],
    color: "#718096",
    metadata: {
      description: "Public vehicle parking and rideshare drop-off hub",
      capacity: 2500,
      securityStatus: "clear",
      accessibilityFeatures: "120 designated accessible parking spots",
    },
  },
];

export const GATE_DEFINITIONS: SpatialEntityConfig[] = [
  {
    id: "gate:a",
    name: "Gate A (North Entrance)",
    type: "gate",
    position: [0, 2, -88],
    color: "#319795",
    metadata: {
      status: "open",
      accessibilityRamp: true,
      type: "standard",
      description: "Main north entry gate — stadium outer perimeter, north end",
    },
  },
  {
    id: "gate:b",
    name: "Gate B (East Entrance)",
    type: "gate",
    position: [92, 2, 0],
    color: "#319795",
    metadata: {
      status: "open",
      accessibilityRamp: false,
      type: "standard",
      description: "East entry gate — stadium outer perimeter, east side",
    },
  },
  {
    id: "gate:c",
    name: "Gate C (South Entrance)",
    type: "gate",
    position: [0, 2, 88],
    color: "#319795",
    metadata: {
      status: "open",
      accessibilityRamp: true,
      type: "standard",
      description: "Main south entry gate — stadium outer perimeter, south end",
    },
  },
  {
    id: "gate:d",
    name: "Gate D (West Entrance - VIP)",
    type: "gate",
    position: [-92, 2, 0],
    color: "#d69e2e",
    metadata: {
      status: "restricted",
      accessibilityRamp: true,
      type: "vip",
      description: "West entry gate — VIP, media, and stadium operations",
    },
  },
];

export const POI_DEFINITIONS: SpatialEntityConfig[] = [
  // Medical — at concourse level near north and south gates
  {
    id: "poi:medical-01",
    name: "First Aid Station 1",
    type: "poi",
    position: [-18, 2, -82],
    metadata: {
      category: "medical",
      status: "operational",
      access: "public",
      description: "Fully staffed medical station equipped for emergency triage",
    },
  },
  {
    id: "poi:medical-02",
    name: "First Aid Station 2",
    type: "poi",
    position: [18, 2, 82],
    metadata: {
      category: "medical",
      status: "operational",
      access: "public",
      description: "Fully staffed medical station with direct ambulance transfer lane",
    },
  },
  // Restrooms — distributed around the concourse ring
  {
    id: "poi:restroom-01",
    name: "North Concourse Restrooms",
    type: "poi",
    position: [-40, 2, -74],
    metadata: {
      category: "restroom",
      status: "operational",
      access: "public",
      description: "Public restrooms including baby-changing station and accessible cubicle",
    },
  },
  {
    id: "poi:restroom-02",
    name: "East Concourse Restrooms",
    type: "poi",
    position: [78, 2, -36],
    metadata: {
      category: "restroom",
      status: "operational",
      access: "public",
      description: "Gender-neutral, fully accessible restroom facilities",
    },
  },
  {
    id: "poi:restroom-03",
    name: "South Concourse Restrooms",
    type: "poi",
    position: [40, 2, 74],
    metadata: {
      category: "restroom",
      status: "operational",
      access: "public",
      description: "High-capacity public restrooms next to South Stand food court",
    },
  },
  {
    id: "poi:restroom-04",
    name: "West Concourse Restrooms (Accessible)",
    type: "poi",
    position: [-78, 2, 36],
    metadata: {
      category: "restroom",
      status: "operational",
      access: "public",
      description: "Priority accessible restrooms with hoist and changing table",
    },
  },
  // Food Courts — at concourse level between stands
  {
    id: "poi:food-01",
    name: "East Food Hall",
    type: "poi",
    position: [78, 2, 36],
    metadata: {
      category: "food-court",
      status: "operational",
      access: "public",
      description: "Main food court with 12 local vendors and beverage stations",
    },
  },
  {
    id: "poi:food-02",
    name: "West Concessions",
    type: "poi",
    position: [-78, 2, -36],
    metadata: {
      category: "food-court",
      status: "operational",
      access: "public",
      description: "Snack bar and hot meal stands serving West Stand ticket holders",
    },
  },
  // Elevators — at structural cores east and west
  {
    id: "poi:elevator-01",
    name: "West Lift Core A",
    type: "poi",
    position: [-66, 2, 12],
    metadata: {
      category: "elevator",
      status: "operational",
      access: "public",
      description: "High-speed elevator connecting Concourse, VIP suites, and Press box",
    },
  },
  {
    id: "poi:elevator-02",
    name: "East Lift Core B",
    type: "poi",
    position: [66, 2, -12],
    metadata: {
      category: "elevator",
      status: "operational",
      access: "public",
      description: "Elevator providing access from ground level to upper club seating",
    },
  },
  // Information
  {
    id: "poi:info-01",
    name: "Main Information Desk",
    type: "poi",
    position: [72, 2, 0],
    metadata: {
      category: "information",
      status: "operational",
      access: "public",
      description: "Tournament helper desk for translation, lost & found, and ticketing issues",
    },
  },
  // Exits — just outside the gates
  {
    id: "poi:exit-01",
    name: "North Evacuation Exit",
    type: "poi",
    position: [0, 1.5, -96],
    metadata: {
      category: "exit",
      status: "operational",
      access: "public",
      description: "High-capacity emergency exit route opening to external muster point",
    },
  },
  {
    id: "poi:exit-02",
    name: "South Evacuation Exit",
    type: "poi",
    position: [0, 1.5, 96],
    metadata: {
      category: "exit",
      status: "operational",
      access: "public",
      description: "High-capacity emergency exit route leading to public transport plaza",
    },
  },
  // Parking
  {
    id: "poi:parking-vip",
    name: "VIP Parking Area",
    type: "poi",
    position: [-100, 0.5, 8],
    metadata: {
      category: "parking",
      status: "operational",
      access: "vip",
      description: "Secured vehicle area with direct access to VIP West Entrance",
    },
  },
];
