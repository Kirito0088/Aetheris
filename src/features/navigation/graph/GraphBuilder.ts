import { Graph, type GraphNode, type GraphEdge } from "./Graph";
import { EntityRegistry } from "../../digital-twin/registry/EntityRegistry";

export class GraphBuilder {
  public static build(): Graph {
    const graph = new Graph();
    const registry = EntityRegistry.getInstance();

    // 1. Add all static entities from the Entity Registry to the Graph
    registry.getAll().forEach((entity) => {
      let type: "zone" | "gate" | "poi" | "waypoint" = "poi";
      if (entity.type === "zone") type = "zone";
      if (entity.type === "gate") type = "gate";
      if (entity.type === "poi") type = "poi";

      graph.addNode({
        id: entity.id,
        name: entity.name,
        type,
        position: [...entity.position] as [number, number, number],
      });
    });

    // 2. Define and add Concourse Waypoints (to allow circular pedestrian navigation)
    // Concourse Ring is at radius ~110, altitude Y = 1.2
    const concourseWaypoints: GraphNode[] = [
      { id: "concourse:n", name: "North Concourse", type: "waypoint", position: [0, 1.2, -110] },
      { id: "concourse:ne", name: "North-East Concourse", type: "waypoint", position: [77.78, 1.2, -77.78] },
      { id: "concourse:e", name: "East Concourse", type: "waypoint", position: [110, 1.2, 0] },
      { id: "concourse:se", name: "South-East Concourse", type: "waypoint", position: [77.78, 1.2, 77.78] },
      { id: "concourse:s", name: "South Concourse", type: "waypoint", position: [0, 1.2, 110] },
      { id: "concourse:sw", name: "South-West Concourse", type: "waypoint", position: [-77.78, 1.2, 77.78] },
      { id: "concourse:w", name: "West Concourse", type: "waypoint", position: [-110, 1.2, 0] },
      { id: "concourse:nw", name: "North-West Concourse", type: "waypoint", position: [-77.78, 1.2, -77.78] },
    ];

    concourseWaypoints.forEach((wp) => graph.addNode(wp));

    // 3. Connect Concourse Waypoints in a ring
    const ringConnections = [
      { from: "concourse:n", to: "concourse:ne", name: "North-East Concourse Arc" },
      { from: "concourse:ne", to: "concourse:e", name: "East Concourse Entrance Segment" },
      { from: "concourse:e", to: "concourse:se", name: "South-East Concourse Arc" },
      { from: "concourse:se", to: "concourse:s", name: "South Concourse Entrance Segment" },
      { from: "concourse:s", to: "concourse:sw", name: "South-West Concourse Arc" },
      { from: "concourse:sw", to: "concourse:w", name: "West Concourse Entrance Segment" },
      { from: "concourse:w", to: "concourse:nw", name: "North-West Concourse Arc" },
      { from: "concourse:nw", to: "concourse:n", name: "North Concourse Entrance Segment" },
    ];

    ringConnections.forEach((conn) => {
      const fromNode = graph.getNode(conn.from)!;
      const toNode = graph.getNode(conn.to)!;
      const dx = fromNode.position[0] - toNode.position[0];
      const dz = fromNode.position[2] - toNode.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz); // approximate 2D walking distance

      graph.addEdge({
        from: conn.from,
        to: conn.to,
        supportedTypes: ["standard", "accessible", "emergency", "vip"],
        distance: dist,
        name: conn.name,
      });
    });

    // 4. Connect gates to the Concourse network
    const gateConnections: GraphEdge[] = [
      {
        from: "gate:a",
        to: "concourse:n",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 2,
        name: "North Turnstile Walkway",
      },
      {
        from: "gate:b",
        to: "concourse:e",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 2,
        name: "East Turnstile Walkway",
      },
      {
        from: "gate:c",
        to: "concourse:s",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 2,
        name: "South Turnstile Walkway",
      },
      {
        from: "gate:d",
        to: "concourse:w",
        supportedTypes: ["standard", "accessible", "emergency", "vip"],
        distance: 2,
        name: "West VIP Secured Corridor",
      },
    ];
    gateConnections.forEach((edge) => graph.addEdge(edge));

    // 5. Connect stands to the Concourse network
    const standConnections: GraphEdge[] = [
      {
        from: "zone:north-stand",
        to: "concourse:n",
        supportedTypes: ["standard", "emergency"], // Not accessible (requires stairs)
        distance: 15,
        name: "North Stand General Stairs",
      },
      {
        from: "zone:south-stand",
        to: "concourse:s",
        supportedTypes: ["standard", "emergency"],
        distance: 15,
        name: "South Stand General Stairs",
      },
      {
        from: "zone:west-stand",
        to: "concourse:w",
        supportedTypes: ["standard", "emergency"],
        distance: 15,
        name: "West Stand General Stairs",
      },
      // East Stand Premium Club has regular stairs AND East Elevator accessibility
      {
        from: "zone:east-stand",
        to: "concourse:e",
        supportedTypes: ["standard", "emergency"],
        distance: 15,
        name: "East Stand Club Access Stairs",
      },
      {
        from: "poi:elevator-02",
        to: "zone:east-stand",
        supportedTypes: ["standard", "accessible", "emergency", "vip"],
        distance: 10,
        name: "East Elevator Upper Lift Shaft",
        isVertical: true,
      },
      {
        from: "poi:elevator-02",
        to: "concourse:e",
        supportedTypes: ["standard", "accessible", "emergency", "vip"],
        distance: 2,
        name: "East Elevator Lobby Entrance",
      },
      // VIP Zone connects only to West Lift Core (accessible + VIP)
      {
        from: "poi:elevator-01",
        to: "zone:vip",
        supportedTypes: ["accessible", "emergency", "vip"],
        distance: 12,
        name: "West Elevator VIP Lift Shaft",
        isVertical: true,
      },
      {
        from: "poi:elevator-01",
        to: "concourse:w",
        supportedTypes: ["standard", "accessible", "emergency", "vip"],
        distance: 2,
        name: "West Elevator Concourse Lobby",
      },
      // Pitch connects to Concourse for emergency exits only
      {
        from: "zone:pitch",
        to: "concourse:n",
        supportedTypes: ["emergency"],
        distance: 30,
        name: "North Player Tunnel (Emergency)",
      },
      {
        from: "zone:pitch",
        to: "concourse:s",
        supportedTypes: ["emergency"],
        distance: 30,
        name: "South Player Tunnel (Emergency)",
      },
      // Parking connects to Gate A
      {
        from: "zone:parking",
        to: "gate:a",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 40,
        name: "North Lot Pedestrian Walkway",
      },
    ];
    standConnections.forEach((edge) => graph.addEdge(edge));

    // 6. Connect POIs to their closest concourse segments
    const poiConnections: GraphEdge[] = [
      {
        from: "poi:medical-01",
        to: "concourse:n",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 10,
        name: "First Aid 1 Ramp Access",
      },
      {
        from: "poi:medical-02",
        to: "concourse:s",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 10,
        name: "First Aid 2 Access Ramp",
      },
      {
        from: "poi:restroom-01",
        to: "concourse:nw",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 8,
        name: "North Restroom Entrance Corridor",
      },
      {
        from: "poi:restroom-02",
        to: "concourse:ne",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 8,
        name: "East Restroom Entrance Corridor",
      },
      {
        from: "poi:restroom-03",
        to: "concourse:se",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 8,
        name: "South Restroom Entrance Corridor",
      },
      {
        from: "poi:restroom-04",
        to: "concourse:sw",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 8,
        name: "West Accessible Restroom Corridor",
      },
      {
        from: "poi:food-01",
        to: "concourse:se",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 12,
        name: "East Food Hall Frontage",
      },
      {
        from: "poi:food-02",
        to: "concourse:nw",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 12,
        name: "West Concessions Frontage",
      },
      {
        from: "poi:info-01",
        to: "concourse:e",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 5,
        name: "Main Helper Desk Counter",
      },
      {
        from: "poi:exit-01",
        to: "gate:a",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 10,
        name: "North Evacuation Lane",
      },
      {
        from: "poi:exit-02",
        to: "gate:c",
        supportedTypes: ["standard", "accessible", "emergency"],
        distance: 10,
        name: "South Evacuation Lane",
      },
      {
        from: "poi:parking-vip",
        to: "gate:d",
        supportedTypes: ["vip", "emergency"],
        distance: 15,
        name: "VIP Valet Parking Bay",
      },
    ];
    poiConnections.forEach((edge) => graph.addEdge(edge));

    return graph;
  }
}
