
import React, { useState, useEffect } from 'react';
import { Graph, AlgorithmType, AlgorithmStep, NodeStatus, EdgeStatus } from './VisualizationTypes';
import { runFloydWarshall } from '../algorithms/floydWarshall';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import GraphAlgorithmLayout from './components/GraphAlgorithmLayout';

interface FloydWarshallVisualizationProps {
  speed?: number;
  onOperationSelect?: (operation: string) => void;
}

const FloydWarshallVisualization: React.FC<FloydWarshallVisualizationProps> = ({
  speed = 50,
  onOperationSelect
}) => {
  // Sample graph for Floyd-Warshall algorithm
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
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(speed);

  useEffect(() => {
    if (onOperationSelect) {
      onOperationSelect("Floyd-Warshall Algorithm");
    }
    
    // Run algorithm on component mount
    const algorithmSteps = runFloydWarshall(graph);
    setSteps(algorithmSteps);
    setCurrentStepIndex(0);
  }, [graph, onOperationSelect]);

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
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const handleUseDefaultGraph = () => {
    setGraph(initialGraph);
  };
  
  const handleCustomGraph = () => {
    // For future implementation - allow users to create custom graphs
    // This is a placeholder
  };

  // Add handleReset function that was missing
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    const algorithmSteps = runFloydWarshall(graph);
    setSteps(algorithmSteps);
  };

  // Get current step
  const currentStep = steps[currentStepIndex] || {
    description: "Initializing algorithm...",
    nodeStatuses: {},
    edgeStatuses: {},
  };
  
  // Get distance matrix from current step or create a placeholder
  const distanceMatrix = currentStep.distanceMatrix || 
    Array(graph.nodes.length).fill(null).map(() => Array(graph.nodes.length).fill(null));
  
  const nodeIds = graph.nodes.map(node => node.id);
  
  const floydWarshallCode = {
    javascript: `function floydWarshall(graph) {
  const vertices = graph.vertices;
  const n = vertices.length;
  
  // Initialize the distance matrix
  const dist = Array(n).fill().map(() => Array(n).fill(Infinity));
  
  // Initialize with direct edge weights
  for (const edge of graph.edges) {
    const u = vertices.indexOf(edge.source);
    const v = vertices.indexOf(edge.target);
    dist[u][v] = edge.weight;
    
    // For undirected graph
    dist[v][u] = edge.weight;
  }
  
  // Set diagonal to 0 (distance from a vertex to itself)
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
  }
  
  // Apply the algorithm - try all vertices as intermediate points
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
        }
      }
    }
  }
  
  // Convert the distance matrix back to a format with vertex IDs
  const result = {};
  for (let i = 0; i < n; i++) {
    result[vertices[i]] = {};
    for (let j = 0; j < n; j++) {
      result[vertices[i]][vertices[j]] = dist[i][j];
    }
  }
  
  return result;
}`,
    python: `def floyd_warshall(graph):
    vertices = graph['vertices']
    n = len(vertices)
    
    # Initialize the distance matrix
    dist = [[float('infinity') for _ in range(n)] for _ in range(n)]
    
    # Initialize with direct edge weights
    for edge in graph['edges']:
        u = vertices.index(edge['source'])
        v = vertices.index(edge['target'])
        dist[u][v] = edge['weight']
        
        # For undirected graph
        dist[v][u] = edge['weight']
    
    # Set diagonal to 0 (distance from a vertex to itself)
    for i in range(n):
        dist[i][i] = 0
    
    # Apply the algorithm - try all vertices as intermediate points
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] != float('infinity') and dist[k][j] != float('infinity'):
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    
    # Convert the distance matrix back to a format with vertex IDs
    result = {}
    for i in range(n):
        result[vertices[i]] = {}
        for j in range(n):
            result[vertices[i]][vertices[j]] = dist[i][j]
    
    return result`,
    cpp: `void floydWarshall(vector<vector<int>>& dist, int V) {
    // Initialize the distance matrix
    // dist[i][j] contains shortest distance from i to j
    
    // For undirected graph, the distance matrix is symmetric
    
    // Apply the algorithm - try all vertices as intermediate points
    for (int k = 0; k < V; k++) {
        // Pick all vertices as source one by one
        for (int i = 0; i < V; i++) {
            // Pick all vertices as destination
            for (int j = 0; j < V; j++) {
                // If vertex k is on the shortest path from
                // i to j, then update dist[i][j]
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX &&
                    dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    
    // Check for negative weight cycles
    for (int i = 0; i < V; i++) {
        if (dist[i][i] < 0) {
            // Negative weight cycle detected
            cout << "Negative weight cycle detected!" << endl;
            break;
        }
    }
}`
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Algorithm Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Graph</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="default" 
              className="w-full"
              onClick={handleUseDefaultGraph}
            >
              Default Graph
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleCustomGraph}
            >
              Custom Graph
            </Button>
          </div>
        </Card>

        <Card className="p-4 shadow-sm md:col-span-2">
          <h3 className="text-lg font-medium mb-4">Animation Controls</h3>
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
            <span>Step {currentStepIndex + 1} of {steps.length}</span>
            <span>{animationSpeed === 100 ? "Fast" : animationSpeed <= 20 ? "Slow" : "Medium"}</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToStep(0)}
                disabled={currentStepIndex === 0 || isPlaying}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="4" height="14" rx="1" />
                  <path d="m9 5 9 7-9 7z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToStep(currentStepIndex - 1)}
                disabled={currentStepIndex === 0 || isPlaying}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
              <Button
                variant={isPlaying ? "secondary" : "default"}
                className="flex-1"
                onClick={togglePlayback}
              >
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToStep(currentStepIndex + 1)}
                disabled={currentStepIndex === steps.length - 1 || isPlaying}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToStep(steps.length - 1)}
                disabled={currentStepIndex === steps.length - 1 || isPlaying}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 5 9 7-9 7z" />
                  <rect x="3" y="5" width="4" height="14" rx="1" />
                </svg>
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Animation Speed</label>
              <Slider
                value={[animationSpeed]}
                min={1}
                max={100}
                step={1}
                onValueChange={(values) => setAnimationSpeed(values[0])}
              />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Main visualization layout */}
      <GraphAlgorithmLayout 
        graph={graph}
        steps={steps}
        currentStepIndex={currentStepIndex}
        isPlaying={isPlaying}
        speed={animationSpeed}
        algorithmType={AlgorithmType.FLOYD_WARSHALL}
        codeSnippets={floydWarshallCode}
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
            <h4 className="text-lg font-semibold">Floyd-Warshall Algorithm</h4>
            <p className="text-muted-foreground">
              Finds shortest paths between all pairs of vertices in a weighted graph with positive or negative edge weights (but no negative cycles).
            </p>
            
            <h5 className="font-semibold mt-4 mb-2">How it works:</h5>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>Initialize the distance matrix using the graph's edge weights</li>
              <li>For each vertex k as an intermediate vertex:</li>
              <li>For each pair of vertices (i,j):</li>
              <li>If the path through vertex k is shorter than the direct path from i to j, update the distance</li>
              <li>After considering all vertices as intermediates, the matrix contains the shortest path distances between all pairs</li>
            </ol>
            
            <h5 className="font-semibold mt-4 mb-2">Time Complexity:</h5>
            <p className="text-muted-foreground">O(V³) where V is the number of vertices</p>
            
            <h5 className="font-semibold mt-4 mb-2">Algorithm Category:</h5>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400">
              Dynamic Programming
            </span>
          </div>
          
          <div>
            <h5 className="font-semibold mb-3">Algorithm Visualization</h5>
            <div className="border p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <img
                src="/lovable-uploads/80d9e101-48bb-40b4-818e-aa7ad0319de3.png"
                alt="Floyd-Warshall Algorithm Visualization"
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FloydWarshallVisualization;
