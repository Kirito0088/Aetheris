export type RouteType = "standard" | "accessible" | "emergency" | "vip";

export interface GraphNode {
  id: string;
  name: string;
  type: "zone" | "gate" | "poi" | "waypoint";
  position: [number, number, number];
}

export interface GraphEdge {
  from: string;
  to: string;
  supportedTypes: RouteType[];
  distance: number;
  name: string;
  isVertical?: boolean;
}

export class Graph {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, GraphEdge[]> = new Map();

  public addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
    if (!this.edges.has(node.id)) {
      this.edges.set(node.id, []);
    }
  }

  public addEdge(edge: GraphEdge): void {
    if (!this.nodes.has(edge.from) || !this.nodes.has(edge.to)) {
      throw new Error(`Cannot add edge: one or both nodes (${edge.from}, ${edge.to}) do not exist in the graph.`);
    }

    const currentEdges = this.edges.get(edge.from) || [];
    currentEdges.push(edge);
    this.edges.set(edge.from, currentEdges);

    // Assuming undirected graph for pedestrian stadium pathways, register back edge
    const backEdge: GraphEdge = {
      from: edge.to,
      to: edge.from,
      supportedTypes: edge.supportedTypes,
      distance: edge.distance,
      name: edge.name,
      isVertical: edge.isVertical,
    };
    const currentBackEdges = this.edges.get(edge.to) || [];
    currentBackEdges.push(backEdge);
    this.edges.set(edge.to, currentBackEdges);
  }

  public getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  public getNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getEdges(nodeId: string): GraphEdge[] {
    return this.edges.get(nodeId) || [];
  }

  public getAllEdges(): GraphEdge[] {
    const all: GraphEdge[] = [];
    this.edges.forEach((edgeList) => {
      all.push(...edgeList);
    });
    return all;
  }

  public clear(): void {
    this.nodes.clear();
    this.edges.clear();
  }
}
