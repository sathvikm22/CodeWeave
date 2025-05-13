
import React, { useState, useEffect } from 'react';
import { runBellmanFord } from '../algorithms/bellmanFord';
import { Graph, AlgorithmType, AlgorithmStep } from './VisualizationTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import GraphAlgorithmLayout from './components/GraphAlgorithmLayout';

interface BellmanFordVisualizationProps {
  speed?: number;
  onOperationSelect?: (operation: string) => void;
}

const BellmanFordVisualization: React.FC<BellmanFordVisualizationProps> = ({
  speed = 50,
  onOperationSelect
}) => {
  // Sample graph for Bellman-Ford algorithm
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

  // Initialize adjacency matrix
  const [adjacencyMatrix, setAdjacencyMatrix] = useState(() => {
    const labels = graph.nodes.map(node => node.id);
    const size = labels.length;
    const matrix = Array(size).fill(null).map(() => Array(size).fill(null));
    
    // Fill matrix with edge weights
    graph.edges.forEach(edge => {
      const sourceIndex = labels.indexOf(edge.source);
      const targetIndex = labels.indexOf(edge.target);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        matrix[sourceIndex][targetIndex] = edge.weight;
        matrix[targetIndex][sourceIndex] = edge.weight; // Undirected graph
      }
    });
    
    return { labels, matrix };
  });

  useEffect(() => {
    if (onOperationSelect) {
      onOperationSelect("Bellman-Ford Algorithm");
    }
    
    // Run algorithm on component mount
    const algorithmSteps = runBellmanFord(graph, startNodeId);
    setSteps(algorithmSteps);
    setCurrentStepIndex(0);
  }, [graph, startNodeId, onOperationSelect]);

  // Animation effect for auto-play
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isPlaying && currentStepIndex < steps.length - 1) {
      // Calculate delay based on speed (1-100)
      // Speed of 1 = 2000ms, Speed of 100 = 100ms
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
    const algorithmSteps = runBellmanFord(graph, nodeId);
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

  // Add the missing handleReset function
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    const algorithmSteps = runBellmanFord(graph, startNodeId);
    setSteps(algorithmSteps);
  };
  
  // Get current step
  const currentStep = steps[currentStepIndex] || {
    description: "Initializing algorithm...",
    nodeStatuses: {},
    edgeStatuses: {},
  };
  
  const handleUseDefaultGraph = () => {
    setGraph(initialGraph);
    setStartNodeId("A");
  };
  
  const handleCustomGraph = () => {
    // For future implementation - allow users to create custom graphs
    // This is a placeholder
  };

  const bellmanFordCode = {
    javascript: `function bellmanFord(graph, source) {
  const vertices = graph.vertices;
  const edges = graph.edges;
  const distances = {};
  const predecessors = {};
  
  // Step 1: Initialize distances and predecessors
  for (const vertex of vertices) {
    distances[vertex] = Infinity;
    predecessors[vertex] = null;
  }
  
  distances[source] = 0;
  
  // Step 2: Relax edges |V| - 1 times
  for (let i = 0; i < vertices.length - 1; i++) {
    let relaxed = false;
    
    for (const edge of edges) {
      const u = edge.source;
      const v = edge.target;
      const weight = edge.weight;
      
      if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight;
        predecessors[v] = u;
        relaxed = true;
      }
      
      // For undirected graphs, check the reverse direction too
      if (distances[v] !== Infinity && distances[v] + weight < distances[u]) {
        distances[u] = distances[v] + weight;
        predecessors[u] = v;
        relaxed = true;
      }
    }
    
    // If no relaxation occurred in this iteration, we can stop early
    if (!relaxed) break;
  }
  
  // Step 3: Check for negative-weight cycles
  for (const edge of edges) {
    const u = edge.source;
    const v = edge.target;
    const weight = edge.weight;
    
    if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
      return { hasNegativeCycle: true };
    }
    
    if (distances[v] !== Infinity && distances[v] + weight < distances[u]) {
      return { hasNegativeCycle: true };
    }
  }
  
  return {
    hasNegativeCycle: false,
    distances,
    predecessors
  };
}`,
    python: `def bellman_ford(graph, source):
    vertices = graph['vertices']
    edges = graph['edges']
    
    # Step 1: Initialize distances and predecessors
    distances = {vertex: float('infinity') for vertex in vertices}
    predecessors = {vertex: None for vertex in vertices}
    
    distances[source] = 0
    
    # Step 2: Relax edges |V| - 1 times
    for _ in range(len(vertices) - 1):
        relaxed = False
        
        for edge in edges:
            u = edge['source']
            v = edge['target']
            weight = edge['weight']
            
            # Relax edge u -> v
            if distances[u] != float('infinity') and distances[u] + weight < distances[v]:
                distances[v] = distances[u] + weight
                predecessors[v] = u
                relaxed = True
            
            # For undirected graphs, check the reverse direction too
            if distances[v] != float('infinity') and distances[v] + weight < distances[u]:
                distances[u] = distances[v] + weight
                predecessors[u] = v
                relaxed = True
        
        # If no relaxation occurred in this iteration, we can stop early
        if not relaxed:
            break
    
    # Step 3: Check for negative-weight cycles
    for edge in edges:
        u = edge['source']
        v = edge['target']
        weight = edge['weight']
        
        if distances[u] != float('infinity') and distances[u] + weight < distances[v]:
            return {'has_negative_cycle': True}
        
        if distances[v] != float('infinity') and distances[v] + weight < distances[u]:
            return {'has_negative_cycle': True}
    
    return {
        'has_negative_cycle': False,
        'distances': distances,
        'predecessors': predecessors
    }`,
    cpp: `struct BellmanFordResult {
    bool hasNegativeCycle;
    vector<int> distances;
    vector<int> predecessors;
};

BellmanFordResult bellmanFord(const vector<Edge>& edges, int vertices, int source) {
    BellmanFordResult result;
    result.hasNegativeCycle = false;
    result.distances.assign(vertices, INT_MAX);
    result.predecessors.assign(vertices, -1);
    
    result.distances[source] = 0;
    
    // Relax edges |V| - 1 times
    for (int i = 0; i < vertices - 1; i++) {
        bool relaxed = false;
        
        for (const auto& edge : edges) {
            int u = edge.source;
            int v = edge.target;
            int weight = edge.weight;
            
            if (result.distances[u] != INT_MAX && 
                result.distances[u] + weight < result.distances[v]) {
                result.distances[v] = result.distances[u] + weight;
                result.predecessors[v] = u;
                relaxed = true;
            }
            
            // For undirected graphs, check the reverse direction too
            if (result.distances[v] != INT_MAX && 
                result.distances[v] + weight < result.distances[u]) {
                result.distances[u] = result.distances[v] + weight;
                result.predecessors[u] = v;
                relaxed = true;
            }
        }
        
        // If no relaxation occurred in this iteration, we can stop early
        if (!relaxed) break;
    }
    
    // Check for negative-weight cycles
    for (const auto& edge : edges) {
        int u = edge.source;
        int v = edge.target;
        int weight = edge.weight;
        
        if (result.distances[u] != INT_MAX && 
            result.distances[u] + weight < result.distances[v]) {
            result.hasNegativeCycle = true;
            break;
        }
        
        if (result.distances[v] != INT_MAX && 
            result.distances[v] + weight < result.distances[u]) {
            result.hasNegativeCycle = true;
            break;
        }
    }
    
    return result;
}`
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Algorithm Controls */}
      {/* ... keep existing code (algorithm controls) */}
      
      {/* Main visualization layout */}
      <GraphAlgorithmLayout 
        graph={graph}
        steps={steps}
        currentStepIndex={currentStepIndex}
        isPlaying={isPlaying}
        speed={animationSpeed}
        algorithmType={AlgorithmType.BELLMAN_FORD}
        codeSnippets={bellmanFordCode}
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
            <h4 className="text-lg font-semibold">Bellman-Ford Algorithm</h4>
            <p className="text-muted-foreground">
              Finds the shortest paths from a single source vertex to all other vertices in a weighted directed graph, including those with negative edge weights.
            </p>
            
            <h5 className="font-semibold mt-4 mb-2">How it works:</h5>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>Initialize distances from source to all vertices as infinity and source to itself as 0</li>
              <li>Relax all edges |V|-1 times (where |V| is the number of vertices)</li>
              <li>For each edge (u,v) with weight w, if the distance to u plus w is less than the current distance to v, update the distance to v</li>
              <li>Check for negative-weight cycles by attempting one more relaxation - if any distance changes, there's a negative cycle</li>
            </ol>
            
            <h5 className="font-semibold mt-4 mb-2">Time Complexity:</h5>
            <p className="text-muted-foreground">O(V × E) where V is the number of vertices and E is the number of edges</p>
            
            <h5 className="font-semibold mt-4 mb-2">Algorithm Category:</h5>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400">
              Dynamic Programming
            </span>
          </div>
          
          <div>
            <h5 className="font-semibold mb-3">Algorithm Visualization</h5>
            <div className="border p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <img
                src="/lovable-uploads/db8742a8-c6a5-4691-872c-64e916ad4bdf.png"
                alt="Bellman-Ford Algorithm Visualization"
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BellmanFordVisualization;
