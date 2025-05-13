
import { Graph, AlgorithmStep, NodeStatus, EdgeStatus } from "../visualizations/VisualizationTypes";

export const runFloydWarshall = (graph: Graph): AlgorithmStep[] => {
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
  
  // Create a list of node IDs
  const nodeIds = graph.nodes.map(node => node.id);
  
  // Initialize distance matrix
  const n = nodeIds.length;
  let dist: (number | null)[][] = Array(n).fill(null).map(() => Array(n).fill(Infinity));
  
  // Set distance from a vertex to itself as 0
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
  }
  
  // Initialize distances based on edges
  graph.edges.forEach(edge => {
    const sourceIndex = nodeIds.indexOf(edge.source);
    const targetIndex = nodeIds.indexOf(edge.target);
    dist[sourceIndex][targetIndex] = edge.weight;
    
    // For undirected graph, set the reverse direction too
    dist[targetIndex][sourceIndex] = edge.weight;
  });
  
  steps.push({
    description: "Initialize distance matrix. Distance from a vertex to itself is 0, and between connected vertices is the edge weight.",
    nodeStatuses: { ...nodeStatuses },
    edgeStatuses: { ...edgeStatuses },
    distanceMatrix: JSON.parse(JSON.stringify(dist)),
  });
  
  // Floyd-Warshall algorithm
  for (let k = 0; k < n; k++) {
    nodeStatuses[nodeIds[k]] = NodeStatus.PROCESSING;
    
    steps.push({
      description: `Considering ${nodeIds[k]} as an intermediate vertex.`,
      nodeStatuses: { ...nodeStatuses },
      edgeStatuses: { ...edgeStatuses },
      distanceMatrix: JSON.parse(JSON.stringify(dist)),
    });
    
    for (let i = 0; i < n; i++) {
      if (i !== k) {
        nodeStatuses[nodeIds[i]] = NodeStatus.CURRENT;
        
        for (let j = 0; j < n; j++) {
          if (j !== k && j !== i) {
            nodeStatuses[nodeIds[j]] = NodeStatus.PROCESSING;
            
            // If vertex k is on the shortest path from i to j,
            // update the value of dist[i][j]
            if (
              dist[i][k] !== null && 
              dist[i][k] !== Infinity && 
              dist[k][j] !== null && 
              dist[k][j] !== Infinity && 
              (dist[i][j] === null || dist[i][j] === Infinity || dist[i][k] + dist[k][j] < dist[i][j])
            ) {
              // Update edge status if there is a direct edge
              const directEdgeId = `${nodeIds[i]}-${nodeIds[j]}`;
              const reverseEdgeId = `${nodeIds[j]}-${nodeIds[i]}`;
              
              if (edgeStatuses[directEdgeId] !== undefined) {
                edgeStatuses[directEdgeId] = EdgeStatus.REJECTED;
              }
              if (edgeStatuses[reverseEdgeId] !== undefined) {
                edgeStatuses[reverseEdgeId] = EdgeStatus.REJECTED;
              }
              
              // Update intermediate edge statuses
              const edge1Id = `${nodeIds[i]}-${nodeIds[k]}`;
              const edge2Id = `${nodeIds[k]}-${nodeIds[j]}`;
              const edge1ReverseId = `${nodeIds[k]}-${nodeIds[i]}`;
              const edge2ReverseId = `${nodeIds[j]}-${nodeIds[k]}`;
              
              if (edgeStatuses[edge1Id] !== undefined) {
                edgeStatuses[edge1Id] = EdgeStatus.FINALIZED;
              }
              if (edgeStatuses[edge2Id] !== undefined) {
                edgeStatuses[edge2Id] = EdgeStatus.FINALIZED;
              }
              if (edgeStatuses[edge1ReverseId] !== undefined) {
                edgeStatuses[edge1ReverseId] = EdgeStatus.FINALIZED;
              }
              if (edgeStatuses[edge2ReverseId] !== undefined) {
                edgeStatuses[edge2ReverseId] = EdgeStatus.FINALIZED;
              }
              
              // Update the distance
              dist[i][j] = dist[i][k] + dist[k][j];
              
              steps.push({
                description: `Found shorter path from ${nodeIds[i]} to ${nodeIds[j]} through ${nodeIds[k]}. New distance: ${dist[i][j]}`,
                nodeStatuses: { ...nodeStatuses },
                edgeStatuses: { ...edgeStatuses },
                currentEdge: { source: nodeIds[i], target: nodeIds[j] },
                distanceMatrix: JSON.parse(JSON.stringify(dist)),
              });
            } else {
              steps.push({
                description: `No improvement for path from ${nodeIds[i]} to ${nodeIds[j]} through ${nodeIds[k]}.`,
                nodeStatuses: { ...nodeStatuses },
                edgeStatuses: { ...edgeStatuses },
                currentEdge: { source: nodeIds[i], target: nodeIds[j] },
                distanceMatrix: JSON.parse(JSON.stringify(dist)),
              });
            }
            
            nodeStatuses[nodeIds[j]] = NodeStatus.UNVISITED;
          }
        }
        
        nodeStatuses[nodeIds[i]] = NodeStatus.UNVISITED;
      }
    }
    
    nodeStatuses[nodeIds[k]] = NodeStatus.FINALIZED;
  }
  
  // Mark all nodes as finalized at the end
  nodeIds.forEach(id => {
    nodeStatuses[id] = NodeStatus.FINALIZED;
  });
  
  steps.push({
    description: "Floyd-Warshall algorithm completed. All shortest paths between all pairs of vertices have been found.",
    nodeStatuses: { ...nodeStatuses },
    edgeStatuses: { ...edgeStatuses },
    distanceMatrix: JSON.parse(JSON.stringify(dist)),
  });
  
  return steps;
};
