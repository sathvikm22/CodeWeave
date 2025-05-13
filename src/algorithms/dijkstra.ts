
import { Graph, Node, Edge, NodeStatus, EdgeStatus, AlgorithmStep } from "../visualizations/VisualizationTypes";
import { getEdgeKey } from "../utils/graphUtils";

export const runDijkstra = (graph: Graph, startNodeId: string): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  
  // Deep clone the graph to avoid modifying the original
  const nodes = JSON.parse(JSON.stringify(graph.nodes)) as Node[];
  const edges = JSON.parse(JSON.stringify(graph.edges)) as Edge[];
  
  // Initialize distances
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();
  
  // Initialize node statuses for the first step
  const nodeStatuses: Record<string, NodeStatus> = {};
  const edgeStatuses: Record<string, EdgeStatus> = {};
  
  nodes.forEach(node => {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
    nodeStatuses[node.id] = node.id === startNodeId ? NodeStatus.CURRENT : NodeStatus.UNVISITED;
  });
  
  edges.forEach(edge => {
    const edgeKey = getEdgeKey(edge.source, edge.target);
    edgeStatuses[edgeKey] = EdgeStatus.UNVISITED;
  });
  
  // Add initial step
  steps.push({
    description: `Starting Dijkstra's algorithm from node ${startNodeId}. Initial distance: ${startNodeId} = 0, all others = ∞.`,
    nodeStatuses: { ...nodeStatuses },
    edgeStatuses: { ...edgeStatuses },
    currentNodeId: startNodeId,
    distanceMap: { ...distances }
  });
  
  // Dijkstra's algorithm
  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentNodeId: string | null = null;
    let minDistance = Infinity;
    
    unvisited.forEach(nodeId => {
      if (distances[nodeId] < minDistance) {
        currentNodeId = nodeId;
        minDistance = distances[nodeId];
      }
    });
    
    // If we can't find a node or the minimum distance is infinity, we're done
    if (currentNodeId === null || minDistance === Infinity) {
      break;
    }
    
    // Remove current node from unvisited
    unvisited.delete(currentNodeId);
    
    // Update node status
    nodeStatuses[currentNodeId] = NodeStatus.FINALIZED;
    
    // Get neighbors of current node
    const neighbors: string[] = edges
      .filter(edge => edge.source === currentNodeId || edge.target === currentNodeId)
      .map(edge => edge.source === currentNodeId ? edge.target : edge.source);
    
    // Update step for selecting the current node
    steps.push({
      description: `Selected node ${currentNodeId} with minimum distance ${minDistance}.`,
      nodeStatuses: { ...nodeStatuses },
      edgeStatuses: { ...edgeStatuses },
      currentNodeId,
      distanceMap: { ...distances }
    });
    
    // Visit each neighbor
    for (const neighborId of neighbors) {
      if (!unvisited.has(neighborId)) continue;
      
      // Mark this neighbor as processing
      nodeStatuses[neighborId] = NodeStatus.PROCESSING;
      
      // Find the edge between current and neighbor
      const edge = edges.find(
        e => (e.source === currentNodeId && e.target === neighborId) || 
             (e.source === neighborId && e.target === currentNodeId)
      );
      
      if (!edge) continue;
      
      const edgeKey = getEdgeKey(edge.source, edge.target);
      
      // Mark the edge as processing
      edgeStatuses[edgeKey] = EdgeStatus.PROCESSING;
      
      // Add step for examining the neighbor
      steps.push({
        description: `Examining neighbor ${neighborId} from ${currentNodeId}.`,
        nodeStatuses: { ...nodeStatuses },
        edgeStatuses: { ...edgeStatuses },
        currentNodeId,
        currentEdge: { source: currentNodeId, target: neighborId },
        distanceMap: { ...distances }
      });
      
      // Calculate new possible distance
      const newDistance = distances[currentNodeId] + edge.weight;
      
      // If the new distance is better, update
      if (newDistance < distances[neighborId]) {
        distances[neighborId] = newDistance;
        previous[neighborId] = currentNodeId;
        
        // Add step for updating distance
        steps.push({
          description: `Updated distance to ${neighborId}: ${distances[neighborId]} via ${currentNodeId}.`,
          nodeStatuses: { ...nodeStatuses },
          edgeStatuses: { ...edgeStatuses },
          currentNodeId,
          currentEdge: { source: currentNodeId, target: neighborId },
          distanceMap: { ...distances }
        });
        
        // Mark the edge as potentially part of final path
        edgeStatuses[edgeKey] = EdgeStatus.PROCESSING;
      } else {
        // If the path isn't better, mark edge as rejected
        edgeStatuses[edgeKey] = EdgeStatus.REJECTED;
        
        // Add step for rejecting the path
        steps.push({
          description: `Path to ${neighborId} via ${currentNodeId} is not better (${newDistance} ≥ ${distances[neighborId]}).`,
          nodeStatuses: { ...nodeStatuses },
          edgeStatuses: { ...edgeStatuses },
          currentNodeId,
          currentEdge: { source: currentNodeId, target: neighborId },
          distanceMap: { ...distances }
        });
      }
      
      // Reset neighbor to unvisited (it's still in the unvisited set)
      nodeStatuses[neighborId] = NodeStatus.UNVISITED;
    }
  }
  
  // Trace the shortest paths from start to each node and mark edges as finalized
  nodes.forEach(node => {
    if (node.id === startNodeId) return;
    
    let current = node.id;
    let prev = previous[current];
    
    while (prev !== null) {
      const edgeKey = getEdgeKey(current, prev);
      edgeStatuses[edgeKey] = EdgeStatus.FINALIZED;
      current = prev;
      prev = previous[current];
    }
  });
  
  // Final step
  steps.push({
    description: "Dijkstra's algorithm complete. The shortest paths from the start node to all other nodes have been found.",
    nodeStatuses: Object.keys(nodeStatuses).reduce((acc, nodeId) => {
      acc[nodeId] = NodeStatus.FINALIZED;
      return acc;
    }, {} as Record<string, NodeStatus>),
    edgeStatuses: { ...edgeStatuses },
    distanceMap: { ...distances }
  });
  
  return steps;
};
