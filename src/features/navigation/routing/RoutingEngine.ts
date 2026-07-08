import type { Graph, GraphEdge, RouteType } from "../graph/Graph";
import type { RouteResult } from "./RouteTypes";

export class RoutingEngine {
  private graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  /**
   * Find the shortest route between two nodes based on the requested route type profile.
   */
  public findRoute(startId: string, endId: string, type: RouteType): RouteResult | null {
    const startNode = this.graph.getNode(startId);
    const endNode = this.graph.getNode(endId);

    if (!startNode || !endNode) {
      return null;
    }

    // Dijkstra's algorithm
    const distances: Map<string, number> = new Map();
    const previous: Map<string, { nodeId: string; edge: GraphEdge } | null> = new Map();
    const unvisited: Set<string> = new Set();

    this.graph.getNodes().forEach((node) => {
      distances.set(node.id, Infinity);
      previous.set(node.id, null);
      unvisited.add(node.id);
    });

    distances.set(startId, 0);

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let minNodeId: string | null = null;
      let minDist = Infinity;

      unvisited.forEach((nodeId) => {
        const dist = distances.get(nodeId) ?? Infinity;
        if (dist < minDist) {
          minDist = dist;
          minNodeId = nodeId;
        }
      });

      if (minNodeId === null || minDist === Infinity) {
        break; // remaining nodes are unreachable
      }

      if (minNodeId === endId) {
        break; // destination reached
      }

      unvisited.delete(minNodeId);

      const neighbors = this.graph.getEdges(minNodeId);
      for (const edge of neighbors) {
        if (!unvisited.has(edge.to)) continue;

        const isTraversable = this.isEdgeAllowed(edge, type);
        if (!isTraversable) continue;

        const newDist = minDist + edge.distance;
        const currentBest = distances.get(edge.to) ?? Infinity;

        if (newDist < currentBest) {
          distances.set(edge.to, newDist);
          previous.set(edge.to, { nodeId: minNodeId, edge });
        }
      }
    }

    // Path reconstruction
    const nodeSequence: string[] = [];
    const edgeSequence: GraphEdge[] = [];
    let currentId = endId;

    if (distances.get(endId) === Infinity) {
      return null; // No path found
    }

    nodeSequence.push(endId);
    while (currentId !== startId) {
      const prevInfo = previous.get(currentId);
      if (!prevInfo) return null; // Broken path
      edgeSequence.unshift(prevInfo.edge);
      nodeSequence.unshift(prevInfo.nodeId);
      currentId = prevInfo.nodeId;
    }

    // Calculate metadata
    const distanceMeters = distances.get(endId)!;
    const speed = type === "accessible" ? 1.0 : 1.4;
    const estimatedWalkTime = Math.round(distanceMeters / speed);

    // Dynamic 3D path coordinates interpolation
    const path3D = this.generateSmoothPath(nodeSequence);

    // Generate instructions from graph traversal
    const instructions = this.generateInstructions(nodeSequence, edgeSequence);

    return {
      id: `route:${startId}-${endId}:${type}`,
      type,
      distanceMeters: Math.round(distanceMeters),
      estimatedWalkTime,
      accessible: type === "accessible" || edgeSequence.every(e => e.supportedTypes.includes("accessible")),
      nodes: nodeSequence,
      path: path3D,
      instructions,
    };
  }

  /**
   * Determine if an edge is allowed under the given routing profile.
   */
  private isEdgeAllowed(edge: GraphEdge, type: RouteType): boolean {
    const supported = edge.supportedTypes;
    if (type === "accessible") {
      return supported.includes("accessible");
    }
    if (type === "vip") {
      return supported.includes("vip") || supported.includes("accessible") || supported.includes("standard");
    }
    if (type === "emergency") {
      return supported.includes("emergency") || supported.includes("accessible") || supported.includes("standard");
    }
    return supported.includes("standard") || supported.includes("accessible");
  }

  /**
   * Generates smooth 3D coordinates along the route.
   */
  private generateSmoothPath(nodes: string[]): [number, number, number][] {
    const path: [number, number, number][] = [];

    for (let i = 0; i < nodes.length; i++) {
      const currentNodeId = nodes[i];
      if (!currentNodeId) continue;

      const currentNode = this.graph.getNode(currentNodeId);
      if (!currentNode) continue;

      const currentPos = currentNode.position;

      if (i === 0) {
        path.push([...currentPos] as [number, number, number]);
        continue;
      }

      const prevNodeId = nodes[i - 1];
      if (!prevNodeId) continue;

      const prevNode = this.graph.getNode(prevNodeId);
      if (!prevNode) continue;

      const prevPos = prevNode.position;

      const isCurrentConcourse = currentNode.id.startsWith("concourse:");
      const isPrevConcourse = prevNode.id.startsWith("concourse:");

      if (isCurrentConcourse && isPrevConcourse) {
        const interpolated = this.interpolateConcourseArc(prevPos, currentPos);
        path.push(...interpolated.slice(1));
      } else {
        const segments = 5;
        for (let j = 1; j <= segments; j++) {
          const t = j / segments;
          const x = prevPos[0] + (currentPos[0] - prevPos[0]) * t;
          const y = prevPos[1] + (currentPos[1] - prevPos[1]) * t;
          const z = prevPos[2] + (currentPos[2] - prevPos[2]) * t;
          path.push([x, y, z]);
        }
      }
    }

    return path;
  }

  /**
   * Helper to interpolate points along a circle arc representing the concourse.
   */
  private interpolateConcourseArc(
    start: [number, number, number],
    end: [number, number, number],
    center: [number, number, number] = [0, 1.2, 0]
  ): [number, number, number][] {
    const rStart = Math.hypot(start[0] - center[0], start[2] - center[2]);
    const rEnd = Math.hypot(end[0] - center[0], end[2] - center[2]);
    const radius = (rStart + rEnd) / 2;

    const thetaStart = Math.atan2(start[2] - center[2], start[0] - center[0]);
    let thetaEnd = Math.atan2(end[2] - center[2], end[0] - center[0]);

    let diff = thetaEnd - thetaStart;
    while (diff < -Math.PI) {
      thetaEnd += 2 * Math.PI;
      diff = thetaEnd - thetaStart;
    }
    while (diff > Math.PI) {
      thetaEnd -= 2 * Math.PI;
      diff = thetaEnd - thetaStart;
    }

    const segments = 10;
    const points: [number, number, number][] = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const theta = thetaStart + diff * t;
      const x = center[0] + radius * Math.cos(theta);
      const z = center[2] + radius * Math.sin(theta);
      const y = start[1] + (end[1] - start[1]) * t;
      points.push([x, y, z]);
    }
    return points;
  }

  /**
   * Generate clean, human-readable instructions from graph traversal.
   */
  private generateInstructions(nodes: string[], edges: GraphEdge[]): string[] {
    const instructions: string[] = [];
    const startNodeId = nodes[0];
    if (!startNodeId) return [];

    const startNode = this.graph.getNode(startNodeId);
    if (!startNode) return [];

    instructions.push(`Depart from ${startNode.name}`);

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      if (!edge) continue;

      const targetNodeId = nodes[i + 1];
      if (!targetNodeId) continue;

      const targetNode = this.graph.getNode(targetNodeId);
      if (!targetNode) continue;

      let action = "Proceed along";
      if (edge.isVertical) {
        action = edge.name.toLowerCase().includes("elevator") 
          ? "Take the elevator up via" 
          : "Go via the access stairs of";
      } else if (edge.supportedTypes.includes("vip") && !edge.supportedTypes.includes("standard")) {
        action = "Pass through secure VIP path";
      } else if (targetNode.type === "gate") {
        action = "Head towards exit point at";
      }

      instructions.push(`${action} ${edge.name} to reach ${targetNode.name}`);
    }

    instructions.push("You have arrived at your destination");
    return instructions;
  }
}
