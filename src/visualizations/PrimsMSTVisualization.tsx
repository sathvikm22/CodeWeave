
import React, { useState, useEffect } from 'react';
import { runPrim } from '../algorithms/primsMST';
import { Graph, AlgorithmStep, AlgorithmType } from "../visualizations/VisualizationTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import GraphAlgorithmLayout from './components/GraphAlgorithmLayout';
import { Button } from '@/components/ui/button';

interface PrimsMSTVisualizationProps {
  speed?: number;
  onOperationSelect?: (operation: string) => void;
}

const PrimsMSTVisualization: React.FC<PrimsMSTVisualizationProps> = ({ 
  speed = 50,
  onOperationSelect 
}) => {
  // Sample graph for Prim's algorithm
  const initialGraph: Graph = {
    nodes: [
      { id: "A", label: "A" },
      { id: "B", label: "B" },
      { id: "C", label: "C" },
      { id: "D", label: "D" },
      { id: "E", label: "E" },
      { id: "F", label: "F" }
    ],
    edges: [
      { source: "A", target: "B", weight: 4 },
      { source: "A", target: "C", weight: 2 },
      { source: "B", target: "C", weight: 1 },
      { source: "B", target: "D", weight: 5 },
      { source: "C", target: "D", weight: 8 },
      { source: "C", target: "E", weight: 10 },
      { source: "D", target: "E", weight: 2 },
      { source: "D", target: "F", weight: 6 },
      { source: "E", target: "F", weight: 3 }
    ]
  };

  const [graph, setGraph] = useState<Graph>(initialGraph);
  const [startNodeId, setStartNodeId] = useState<string>("A");
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(speed);
  const [isUsingDefaultGraph, setIsUsingDefaultGraph] = useState<boolean>(true);

  useEffect(() => {
    if (onOperationSelect) {
      onOperationSelect("Prim's MST Algorithm");
    }
    
    // Run algorithm on component mount
    const algorithmSteps = runPrim(graph, startNodeId);
    setSteps(algorithmSteps);
    setCurrentStepIndex(0);
  }, [graph, startNodeId, onOperationSelect]);

  // Animation effect for auto-play
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isPlaying && currentStepIndex < steps.length - 1) {
      // Calculate delay based on speed (1-100)
      const delay = Math.max(100, 2000 - (animationSpeed * 19));
      
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, delay);
    } else if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStepIndex, steps.length, animationSpeed]);

  const handleStartNode = (nodeId: string) => {
    if (isPlaying) return;
    setStartNodeId(nodeId);
    
    // Re-run the algorithm
    const algorithmSteps = runPrim(graph, nodeId);
    setSteps(algorithmSteps);
    setCurrentStepIndex(0);
  };
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleUseDefaultGraph = () => {
    setGraph(initialGraph);
    setIsUsingDefaultGraph(true);
  };

  const handleShowCustomGraph = () => {
    // This would be connected to a graph input form
    setIsUsingDefaultGraph(false);
    // Implementation for custom graph input would go here
  };

  const primsMSTCode = {
    javascript: `function primMST(graph) {
  const vertices = graph.vertices;
  const edges = graph.edges;
  
  // Set to track vertices that are already part of MST
  const mstSet = new Set();
  // Map to track minimum edge weights for each vertex
  const key = new Map();
  // Map to track MST edges (predecessors)
  const parent = new Map();
  
  // Initialize key values and parent
  for (const vertex of vertices) {
    key.set(vertex, Infinity);
    parent.set(vertex, null);
  }
  
  // Start with the first vertex
  key.set(vertices[0], 0);
  
  // MST will have |V| vertices
  for (let i = 0; i < vertices.length; i++) {
    // Find vertex with minimum key value
    let minKey = Infinity;
    let u = null;
    
    for (const vertex of vertices) {
      if (!mstSet.has(vertex) && key.get(vertex) < minKey) {
        minKey = key.get(vertex);
        u = vertex;
      }
    }
    
    // Add the picked vertex to MST Set
    mstSet.add(u);
    
    // Update key values and parent of adjacent vertices
    for (const edge of edges) {
      if ((edge.source === u || edge.target === u)) {
        const v = edge.source === u ? edge.target : edge.source;
        
        // Update key if this edge has smaller weight and v is not in MST
        if (!mstSet.has(v) && edge.weight < key.get(v)) {
          parent.set(v, u);
          key.set(v, edge.weight);
        }
      }
    }
  }
  
  // Construct MST edges
  const mstEdges = [];
  for (const [vertex, parentVertex] of parent.entries()) {
    if (parentVertex !== null) {
      // Find the edge weight
      const edgeWeight = edges.find(e => 
        (e.source === vertex && e.target === parentVertex) || 
        (e.source === parentVertex && e.target === vertex)
      ).weight;
      
      mstEdges.push({
        source: parentVertex,
        target: vertex,
        weight: edgeWeight
      });
    }
  }
  
  return mstEdges;
}`,
    python: `def prim_mst(graph):
    vertices = graph['vertices']
    edges = graph['edges']
    
    # Set to track vertices that are already part of MST
    mst_set = set()
    # Dict to track minimum edge weights for each vertex
    key = {vertex: float('infinity') for vertex in vertices}
    # Dict to track MST edges (predecessors)
    parent = {vertex: None for vertex in vertices}
    
    # Start with the first vertex
    key[vertices[0]] = 0
    
    # MST will have |V| vertices
    for _ in range(len(vertices)):
        # Find vertex with minimum key value
        min_key = float('infinity')
        u = None
        
        for vertex in vertices:
            if vertex not in mst_set and key[vertex] < min_key:
                min_key = key[vertex]
                u = vertex
        
        # Add the picked vertex to MST Set
        mst_set.add(u)
        
        # Update key values and parent of adjacent vertices
        for edge in edges:
            if edge['source'] == u or edge['target'] == u:
                v = edge['target'] if edge['source'] == u else edge['source']
                
                # Update key if this edge has smaller weight and v is not in MST
                if v not in mst_set and edge['weight'] < key[v]:
                    parent[v] = u
                    key[v] = edge['weight']
    
    # Construct MST edges
    mst_edges = []
    for vertex, parent_vertex in parent.items():
        if parent_vertex is not None:
            # Find the edge weight
            for edge in edges:
                if ((edge['source'] == vertex and edge['target'] == parent_vertex) or
                    (edge['source'] == parent_vertex and edge['target'] == vertex)):
                    edge_weight = edge['weight']
                    break
            
            mst_edges.append({
                'source': parent_vertex,
                'target': vertex,
                'weight': edge_weight
            })
    
    return mst_edges`,
    cpp: `vector<pair<int, pair<int, int>>> primMST(const vector<vector<pair<int, int>>>& graph, int vertices) {
    // Min Heap to find minimum weight edge
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    
    // Start with vertex 0
    int src = 0;
    pq.push({0, src});
    
    // Key values used to pick minimum weight edge
    vector<int> key(vertices, INT_MAX);
    key[src] = 0;
    
    // To keep track of vertices included in MST
    vector<bool> inMST(vertices, false);
    
    // To store parent array which defines MST
    vector<int> parent(vertices, -1);
    
    // MST edges
    vector<pair<int, pair<int, int>>> mstEdges;
    
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        
        // Skip if already in MST
        if (inMST[u]) continue;
        
        // Include vertex in MST
        inMST[u] = true;
        
        // Add the edge to MST if this is not the first vertex
        if (parent[u] != -1) {
            mstEdges.push_back({key[u], {parent[u], u}});
        }
        
        // Update keys of adjacent vertices
        for (auto& neighbor : graph[u]) {
            int v = neighbor.first;
            int weight = neighbor.second;
            
            if (!inMST[v] && key[v] > weight) {
                key[v] = weight;
                pq.push({key[v], v});
                parent[v] = u;
            }
        }
    }
    
    return mstEdges;
}`
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Algorithm Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium mb-1 block">Algorithm</label>
          <Select disabled value="prims-mst">
            <SelectTrigger>
              <SelectValue>Prim's MST</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prims-mst">Prim's MST</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Start Node</label>
          <Select value={startNodeId} onValueChange={handleStartNode}>
            <SelectTrigger>
              <SelectValue>{startNodeId}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {graph.nodes.map(node => (
                <SelectItem key={node.id} value={node.id}>
                  {node.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Graph</label>
          <div className="flex gap-2">
            <Button 
              variant={isUsingDefaultGraph ? "default" : "outline"} 
              className="flex-1"
              onClick={handleUseDefaultGraph}
            >
              Default Graph
            </Button>
            <Button 
              variant={!isUsingDefaultGraph ? "default" : "outline"}
              className="flex-1"
              onClick={handleShowCustomGraph}
            >
              Custom Graph
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main visualization layout */}
      <GraphAlgorithmLayout 
        graph={graph}
        steps={steps}
        currentStepIndex={currentStepIndex}
        isPlaying={isPlaying}
        speed={animationSpeed}
        algorithmType={AlgorithmType.PRIM}
        codeSnippets={primsMSTCode}
        onReset={handleReset}
        onStepBack={() => goToStep(currentStepIndex - 1)}
        onStepForward={() => goToStep(currentStepIndex + 1)}
        onPlayPause={togglePlayback}
        onSpeedChange={(values) => setAnimationSpeed(values[0])}
      />
      
      {/* Algorithm Information */}
      <Card className="mt-6 p-6">
        <h3 className="text-xl font-bold mb-4">Algorithm Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Prim's Algorithm</h4>
            <p className="text-muted-foreground">
              Finds a minimum spanning tree for a weighted undirected graph, connecting all nodes with the minimum possible total edge weight.
            </p>
            
            <h5 className="font-semibold mt-4 mb-2">How it works:</h5>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>Start with any vertex and add it to the MST</li>
              <li>Find the edge with the minimum weight that connects a vertex in the MST to a vertex outside the MST</li>
              <li>Add this edge and the outside vertex to the MST</li>
              <li>Repeat steps 2-3 until all vertices are in the MST</li>
            </ol>
            
            <h5 className="font-semibold mt-4 mb-2">Time Complexity:</h5>
            <p className="text-muted-foreground">O((V + E) log V) where V is the number of vertices and E is the number of edges (using a priority queue implementation)</p>
            
            <h5 className="font-semibold mt-4 mb-2">Algorithm Category:</h5>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
              Greedy Algorithm
            </span>
          </div>
          
          <div>
            <h5 className="font-semibold mb-3">Algorithm Visualization</h5>
            <div className="border p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <img
                src="/lovable-uploads/0b84e9f5-6760-481c-b54a-dda77ae10c85.png"
                alt="Prim's Algorithm Visualization"
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PrimsMSTVisualization;
