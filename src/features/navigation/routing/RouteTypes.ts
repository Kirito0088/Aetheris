import type { RouteType } from "../graph/Graph";

export interface RouteResult {
  id: string;
  type: RouteType;
  distanceMeters: number;
  estimatedWalkTime: number; // in seconds
  accessible: boolean;
  nodes: string[]; // sequence of node IDs
  path: [number, number, number][]; // 3D coordinates sequence
  instructions: string[]; // step-by-step user directions
}
