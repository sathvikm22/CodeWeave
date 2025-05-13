
import { Graph, Node, Edge, NodeStatus, EdgeStatus, AlgorithmStep } from "../visualizations/VisualizationTypes";
import { getEdgeKey, findEdge } from "../utils/graphUtils";

export const runPrim = (graph: Graph, startNodeId: string): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  
  // Deep clone the graph to avoid modifying the original
  const nodes = JSON.parse(JSON.stringify(graph.nodes)) as Node[];
  const edges = JSON.parse(JSON.stringify(graph.edges)) as Edge[];
  
  // Initialize MST sets
  const mstNodes = new Set<string>();
  const mstEdges = new Set<string>();
  let mstCost = 0;
  
  // Initialize node statuses for the first step
  const nodeStatuses: Record<string, NodeStatus> = {};
  const edgeStatuses: Record<string, EdgeStatus> = {};
  
  nodes.forEach(node => {
    nodeStatuses[node.id] = node.id === startNodeId ? NodeStatus.CURRENT : NodeStatus.UNVISITED;
  });
  
  edges.forEach(edge => {
    const edgeKey = getEdgeKey(edge.source, edge.target);
    edgeStatuses[edgeKey] = EdgeStatus.UNVISITED;
  });
  
  // Add initial step
  steps.push({
    description: `Starting Prim's algorithm from node ${startNodeId}.`,
    nodeStatuses: { ...nodeStatuses },
    edgeStatuses: { ...edgeStatuses },
    currentNodeId: startNodeId,
    mstCost: 0
  });
  
  // Add start node to MST
  mstNodes.add(startNodeId);
  nodeStatuses[startNodeId] = NodeStatus.FINALIZED;
  
  // Prim's algorithm
  while (mstNodes.size < nodes.length) {
    let minEdge: Edge | undefined;
    let minWeight = Infinity;
    let sourceNode: string = "";
    let targetNode: string = "";
    
    // Find minimum weight edge from MST to non-MST node
    mstNodes.forEach(nodeId => {
      // Get all edges connected to this node
      const connectedEdges = edges.filter(
        edge => edge.source === nodeId || edge.target === nodeId
      );
      
      for (const edge of connectedEdges) {
        const neighbor = edge.source === nodeId ? edge.target : edge.source;
        
        // Skip if neighbor is already in MST
        if (mstNodes.has(neighbor)) continue;
        
        // Mark neighbor as being processed
        nodeStatuses[neighbor] = NodeStatus.PROCESSING;
        
        const edgeKey = getEdgeKey(edge.source, edge.target);
        edgeStatuses[edgeKey] = EdgeStatus.PROCESSING;
        
        // Add step for examining this edge
        steps.push({
          description: `Examining edge ${edge.source}-${edge.target} with weight ${edge.weight}.`,
          nodeStatuses: { ...nodeStatuses },
          edgeStatuses: { ...edgeStatuses },
          currentNodeId: nodeId,
          currentEdge: { source: edge.source, target: edge.target },
          mstCost
        });
        
        // Check if this edge has smaller weight
        if (edge.weight < minWeight) {
          minWeight = edge.weight;
          minEdge = edge;
          sourceNode = nodeId;
          targetNode = neighbor;
          
          // Add step for finding a potential minimum edge
          steps.push({
            description: `Edge ${edge.source}-${edge.target} with weight ${edge.weight} is the current minimum.`,
            nodeStatuses: { ...nodeStatuses },
            edgeStatuses: { ...edgeStatuses },
            currentNodeId: nodeId,
            currentEdge: { source: edge.source, target: edge.target },
            mstCost
          });
        }
        
        // Reset neighbor to unvisited if not selected
        nodeStatuses[neighbor] = NodeStatus.UNVISITED;
        edgeStatuses[edgeKey] = EdgeStatus.UNVISITED;
      }
    });
    
    // If no edge is found, graph is disconnected
    if (!minEdge) {
      steps.push({
        description: "Graph is disconnected. Cannot complete MST.",
        nodeStatuses: { ...nodeStatuses },
        edgeStatuses: { ...edgeStatuses },
        mstCost
      });
      break;
    }
    
    // Add the minimum edge to MST
    const minEdgeKey = getEdgeKey(minEdge.source, minEdge.target);
    mstEdges.add(minEdgeKey);
    edgeStatuses[minEdgeKey] = EdgeStatus.FINALIZED;
    
    // Add the new node to MST
    const newNode = minEdge.source === sourceNode ? minEdge.target : minEdge.source;
    mstNodes.add(newNode);
    nodeStatuses[newNode] = NodeStatus.FINALIZED;
    
    // Update MST cost
    mstCost += minEdge.weight;
    
    // Add step for adding edge to MST
    steps.push({
      description: `Added edge ${minEdge.source}-${minEdge.target} with weight ${minEdge.weight} to MST. Total cost: ${mstCost}.`,
      nodeStatuses: { ...nodeStatuses },
      edgeStatuses: { ...edgeStatuses },
      currentNodeId: newNode,
      mstCost
    });
    
    // Mark all edges not selected as rejected between MST nodes and the new node
    edges.forEach(edge => {
      const isConnectingNewNode = 
        (edge.source === newNode && mstNodes.has(edge.target)) ||
        (edge.target === newNode && mstNodes.has(edge.source));
      
      if (isConnectingNewNode) {
        const edgeKey = getEdgeKey(edge.source, edge.target);
        
        if (!mstEdges.has(edgeKey)) {
          edgeStatuses[edgeKey] = EdgeStatus.REJECTED;
        }
      }
    });
  }
  
  // Final step
  steps.push({
    description: `Prim's algorithm complete. MST has been found with total cost: ${mstCost}.`,
    nodeStatuses: Object.keys(nodeStatuses).reduce((acc, nodeId) => {
      acc[nodeId] = NodeStatus.FINALIZED;
      return acc;
    }, {} as Record<string, NodeStatus>),
    edgeStatuses: { ...edgeStatuses },
    mstCost
  });
  
  return steps;
};
