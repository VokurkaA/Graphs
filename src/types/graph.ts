export interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  visited?: boolean;
  distance?: number;
  previous?: string | null;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
  highlighted?: boolean;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export type Algorithm = 'dijkstra' | 'bellman-ford' | 'floyd-warshall';

export interface AlgorithmStep {
  type: 'node-visit' | 'edge-relax' | 'distance-update' | 'path-found';
  nodeId?: string;
  edgeId?: string;
  distance?: number;
  previous?: string | null;
  message: string;
}

export interface AlgorithmResult {
  steps: AlgorithmStep[];
  distances: Record<string, number>;
  previousNodes: Record<string, string | null>;
  paths: Record<string, string[]>;
}
