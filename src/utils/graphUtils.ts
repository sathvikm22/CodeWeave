
import { Edge } from '../visualizations/VisualizationTypes';

export const getEdgeKey = (source: string, target: string): string => {
  // Ensure consistent edge keys regardless of source/target order
  return [source, target].sort().join('-');
};

export const findEdge = (edges: Edge[], source: string, target: string): Edge | undefined => {
  return edges.find(
    edge => (edge.source === source && edge.target === target) || 
            (edge.source === target && edge.target === source)
  );
};
