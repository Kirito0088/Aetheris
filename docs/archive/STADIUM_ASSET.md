# Stadium Asset — KOREA Jeju World Cup Stadium 4K

> Phase 6 Priority 1.1: GLB-First Digital Twin Integration

## Overview

The Aetheris Digital Twin uses a production 3D model of the **KOREA Jeju World Cup Stadium** as its authoritative spatial reference and visual representation layer.

Rather than treating the stadium as a visual skin over an abstract coordinate system, the GLB geometry itself defines the coordinate system of the physical world. All entities (gates, stands, concessions, restrooms) are anchored onto verified positions of the GLB geometry.

---

## Asset Details

| Property | Value |
|---|---|
| **File** | `public/models/stadium.glb` |
| **Original Name** | KOREA Jeju World Cup Stadium 4K gkb |
| **Generator** | Sketchfab-16.28.0 |
| **Format** | glTF Binary (GLB) v2 |
| **File Size** | 80.80 MB (84,722,048 bytes) |
| **Triangles** | 500,796 |
| **Vertices** | 750,615 |
| **Meshes** | 35 |
| **Materials** | 27 (15 solid-color PBR + 6 textured + 6 structural) |
| **Textures** | 6 JPEG images (~54 MB total, likely 4K resolution) |
| **Animations** | 0 |
| **Extensions** | None |

## Bounding Box (Verified)

| Axis | Min | Max | Dimension |
|---|---|---|---|
| X | -274.5467 | 273.6370 | 548.1837 |
| Y | -250.6846 | 250.5276 | 501.2122 |
| Z | -2.4599 | 79.0348 | 81.4946 |

**Center**: [-0.4548, -0.0785, 38.2874]

**Root Transform**: The root node contains a matrix `[1,0,0,0, 0,0,-1,0, 0,1,0,0, 0,0,0,1]` which swaps Y↔Z axes (Sketchfab convention). The glTF loader applies this automatically, resulting in:
- X axis: East-West
- Z axis: North-South
- Y axis: Elevation

---

## GLB-First Coordinate Mapping

The GLB is integrated through a **Scene Adapter** that maps raw GLB coordinates to the routing and entity coordinate system. All coordinates are scaled by `0.40` and shifted to align the ground plane at `Y = 1.0`:

```
Raw GLB Bounding Box
  X: [-274.5, +273.6]
  Z: [-250.7, +250.5] (swapped from Y)
  Y: [-2.5, +79.0]   (swapped from Z)
  ↓
Spatial Adapter Transform (Scale = 0.40, Translate = [0, 1, 0])
  ↓
World / Routing Coordinate Space
  X: [-110.0, +110.0]
  Z: [-100.0, +100.0]
  Y: [0.0, +32.6]
```

### Transform Configuration
All transforms are defined in `stadium-config.ts` and managed by the `StadiumSpatialAdapter` composition wrapper.

---

## Spatial Mapping & Entity Anchors

Since the GLB is an exterior photogrammetry model, it does not contain semantic sub-meshes for interior operational features (restrooms, food courts, medical, elevators). To bridge this gap, Aetheris utilizes a **Spatial Mapping Layer**:

1. **Geometry-Derived Anchors**: Overall outer perimeter limits, pitch center, seating bowl bounds, and roof canopy heights are measured directly from the GLB meshes.
2. **Operational POI Placement**: Operational entities are anchored onto the stadium surface relative to the geometry:
   - **Gates (A/B/C/D)**: Placed at the stadium perimeter boundary (X=±92 for East/West, Z=±88 for North/South) at ground level.
   - **Stands (North/South/East/West/VIP)**: Centered inside the seating bowl bounding box clusters.
   - **Concourse Services (Restrooms, Medical, Food)**: Anchored along a circular concourse belt just inside the outer walls at Y=2.0 elevation.
   - **Vertical Transport (Lifts)**: Located at structural coordinate hubs on the East and West sides (X=±66).

---

## Routing Graph Alignment

The pedestrian routing graph is moved directly onto the walkable regions of the stadium geometry:

- **The Concourse Ring**: Waypoints are arranged in an ellipse (`cRx = 85`, `cRz = 78`) at `Y = 2.0` height to represent the walkway between the seating bowl and the outer perimeter.
- **Entry Routes**: Walkways connect exterior gates to the concourse ring.
- **Stand Routes**: Connect concourse waypoints to the seating areas and VIP level.
- **POIs**: All services are directly linked via short branch edges to the closest concourse segment.

All route animations, search requests, and pathfinding naturally follow this geometry, ensuring agents and fans walk along realistic paths.

---

## Interaction Volumes

Floating cubes are replaced by interaction volumes that match the stadium architecture:
- **Pitch**: A flat box (`70 × 1 × 44`) centered on the field.
- **Stands**: Curved-bounding boxes (`70 × 14 × 22` and `22 × 14 × 70`) mapped to the north, south, east, and west seating sections.
- **Roof Canopy**: A flat ring (`innerRadius = 76, outerRadius = 95`) at `Y = 26` elevation.
- **Gates**: Bounding portals enclosing the four cardinal entries at the perimeter.

Hovering and selecting these volumes triggers contextual overlays, sidebars, and camera focus animations.

---

## Performance Characteristics

| Metric | Value | Status |
|---|---|---|
| File Size | 80.80 MB | Approved for Phase 6 (optimization later) |
| Triangle Count | 500,796 | Moderate for WebGL |
| Texture Size | ~54 MB (6 × 4K JPEG) | Embedded in GLB |
| Loading | `useGLTF.preload()` at module level | Eager preloading |
| Ambient Light | Synced with presets | Adaptive breathing |

---

## Attribution

The model is the **KOREA Jeju World Cup Stadium 4K** by the Sketchfab Community, licensed under Creative Commons Attribution 4.0 (CC BY 4.0). None of the mesh structures or textures were modified for integration.
