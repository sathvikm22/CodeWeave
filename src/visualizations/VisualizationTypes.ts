
export type DataStructureType = 
  | 'array' 
  | 'stack' 
  | 'queue' 
  | 'circular-queue' 
  | 'linked-list' 
  | 'doubly-linked-list' 
  | 'binary-tree' 
  | 'bst' 
  | 'avl-tree' 
  | 'heap'
  | 'bubble-sort'
  | 'selection-sort'
  | 'insertion-sort'
  | 'merge-sort'
  | 'quick-sort'
  | 'binary-search'
  | 'linear-search'
  | 'dijkstra'
  | 'fractional-knapsack'
  | 'prims-mst'
  | 'floyd-warshall'
  | 'bellman-ford';

export enum NodeStatus {
  UNVISITED = 'unvisited',
  CURRENT = 'current',
  PROCESSING = 'processing',
  FINALIZED = 'finalized',
  REJECTED = 'rejected'
}

export enum EdgeStatus {
  UNVISITED = 'unvisited',
  PROCESSING = 'processing',
  FINALIZED = 'finalized',
  REJECTED = 'rejected'
}

export enum AlgorithmType {
  DIJKSTRA = 'dijkstra',
  PRIM = 'prim',
  FRACTIONAL_KNAPSACK = 'fractional-knapsack',
  BELLMAN_FORD = 'bellman-ford',
  FLOYD_WARSHALL = 'floyd-warshall'
}

export interface Node {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

export interface Edge {
  source: string;
  target: string;
  weight: number;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export interface KnapsackItem {
  id: string;
  value: number;
  weight: number;
  fraction?: number;
  ratio?: number;
}

export interface AlgorithmStep {
  description: string;
  nodeStatuses: Record<string, NodeStatus>;
  edgeStatuses: Record<string, EdgeStatus>;
  currentNodeId?: string;
  currentEdge?: { source: string; target: string };
  distanceMap?: Record<string, number>;
  distanceMatrix?: (number | null)[][];
  mstCost?: number;
  totalValue?: number;
  negativeCycleDetected?: boolean;
  selectedItems?: KnapsackItem[];
}

export interface AdjacencyMatrix {
  labels: string[];
  matrix: (number | null)[][];
}
