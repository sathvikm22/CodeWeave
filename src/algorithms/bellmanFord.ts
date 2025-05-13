
import { Graph, AlgorithmStep, NodeStatus, EdgeStatus } from "../visualizations/VisualizationTypes";

export const runBellmanFord = (graph: Graph, startNodeId: string): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const nodeStatuses: Record<string, NodeStatus> = {};
  const edgeStatuses: Record<string, EdgeStatus> = {};
  
  // Initialize all nodes as unvisited
  graph.nodes.forEach(node => {
    nodeStatuses[node.id] = NodeStatus.UNVISITED;
  });
  
  // Initialize all edges as unvisited
  graph.edges.forEach(edge => {
    const edgeId = `${edge.source}-${edge.target}`;
    edgeStatuses[edgeId] = EdgeStatus.UNVISITED;
  });
  
  // Initialize distances map
  const distances: Record<string, number> = {};
  const predecessors: Record<string, string | null> = {};
  
  graph.nodes.forEach(node => {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    predecessors[node.id] = null;
  });
  
  // Mark start node as processing
  nodeStatuses[startNodeId] = NodeStatus.CURRENT;
  
  steps.push({
    description: `Initialize distances. Distance to start node ${startNodeId} is 0, all others are infinity.`,
    nodeStatuses: { ...nodeStatuses },
    edgeStatuses: { ...edgeStatuses },
    distanceMap: { ...distances },
  });
  
  // Relax edges |V| - 1 times
  const numNodes = graph.nodes.length;
  
  for (let i = 1; i < numNodes; i++) {
    let relaxedAnyEdge = false;
    
    steps.push({
      description: `Iteration ${i}: Relax all edges.`,
      nodeStatuses: { ...nodeStatuses },
      edgeStatuses: { ...edgeStatuses },
      distanceMap: { ...distances },
    });
    
    for (const edge of graph.edges) {
      const sourceDistance = distances[edge.source];
      const edgeId = `${edge.source}-${edge.target}`;
      
      if (sourceDistance === Infinity) {
        continue;
      }
      
      edgeStatuses[edgeId] = EdgeStatus.PROCESSING;
      nodeStatuses[edge.target] = NodeStatus.PROCESSING;
      
      steps.push({
        description: `Considering edge from ${edge.source} to ${edge.target} with weight ${edge.weight}.`,
        nodeStatuses: { ...nodeStatuses },
        edgeStatuses: { ...edgeStatuses },
        currentEdge: { source: edge.source, target: edge.target },
        distanceMap: { ...distances },
      });
      
      // Try to relax the edge
      if (sourceDistance + edge.weight < distances[edge.target]) {
        distances[edge.target] = sourceDistance + edge.weight;
        predecessors[edge.target] = edge.source;
        edgeStatuses[edgeId] = EdgeStatus.FINALIZED;
        relaxedAnyEdge = true;
        
        steps.push({
          description: `Relaxed edge from ${edge.source} to ${edge.target}. New distance to ${edge.target} is ${distances[edge.target]}.`,
          nodeStatuses: { ...nodeStatuses },
          edgeStatuses: { ...edgeStatuses },
          currentEdge: { source: edge.source, target: edge.target },
          distanceMap: { ...distances },
        });
      } else {
        edgeStatuses[edgeId] = EdgeStatus.REJECTED;
        
        steps.push({
          description: `No improvement for edge from ${edge.source} to ${edge.target}.`,
          nodeStatuses: { ...nodeStatuses },
          edgeStatuses: { ...edgeStatuses },
          currentEdge: { source: edge.source, target: edge.target },
          distanceMap: { ...distances },
        });
      }
      
      nodeStatuses[edge.target] = NodeStatus.UNVISITED;
    }
    
    if (!relaxedAnyEdge) {
      steps.push({
        description: `No edges were relaxed in iteration ${i}. Algorithm can terminate early.`,
        nodeStatuses: { ...nodeStatuses },
        edgeStatuses: { ...edgeStatuses },
        distanceMap: { ...distances },
      });
      break;
    }
  }
  
  // Check for negative cycles
  let hasNegativeCycle = false;
  
  for (const edge of graph.edges) {
    if (distances[edge.source] !== Infinity && 
        distances[edge.source] + edge.weight < distances[edge.target]) {
      hasNegativeCycle = true;
      break;
    }
  }
  
  if (hasNegativeCycle) {
    steps.push({
      description: "A negative cycle was detected in the graph.",
      nodeStatuses: { ...nodeStatuses },
      edgeStatuses: { ...edgeStatuses },
      distanceMap: { ...distances },
      negativeCycleDetected: true,
    });
  } else {
    // Mark all reachable nodes as finalized
    Object.keys(distances).forEach(nodeId => {
      if (distances[nodeId] !== Infinity) {
        nodeStatuses[nodeId] = NodeStatus.FINALIZED;
      }
    });
    
    steps.push({
      description: "Bellman-Ford algorithm completed. All shortest paths from the source have been found.",
      nodeStatuses: { ...nodeStatuses },
      edgeStatuses: { ...edgeStatuses },
      distanceMap: { ...distances },
      negativeCycleDetected: false,
    });
  }
  
  return steps;
};
