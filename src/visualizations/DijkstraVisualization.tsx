
import React, { useState, useEffect } from 'react';
import { runDijkstra } from '../algorithms/dijkstra';
import { Graph, AlgorithmType, AlgorithmStep, NodeStatus, EdgeStatus } from './VisualizationTypes';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import GraphAlgorithmLayout from './components/GraphAlgorithmLayout';

interface DijkstraVisualizationProps {
  speed?: number;
  onOperationSelect?: (operation: string) => void;
}

const DijkstraVisualization: React.FC<DijkstraVisualizationProps> = ({
  speed = 50,
  onOperationSelect
}) => {
  // Sample graph for Dijkstra's algorithm
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
      onOperationSelect("Dijkstra's Algorithm");
    }
    
    // Run Dijkstra's algorithm on component mount
    const algorithmSteps = runDijkstra(graph, startNodeId);
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
    const algorithmSteps = runDijkstra(graph, nodeId);
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
  
  const handleUseDefaultGraph = () => {
    setGraph(initialGraph);
    setStartNodeId("A");
  };
  
  const handleCustomGraph = () => {
    // For future implementation - allow users to create custom graphs
    // This is a placeholder
  };

  // Add handleReset function that was missing
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    const algorithmSteps = runDijkstra(graph, startNodeId);
    setSteps(algorithmSteps);
  };

  // Get current step
  const currentStep = steps[currentStepIndex] || {
    description: "Initializing algorithm...",
    nodeStatuses: {},
    edgeStatuses: {},
  };

  const dijkstraCode = {
    javascript: `function dijkstra(graph, startNode) {
  const nodes = graph.nodes.map(n => n.id);
  const edges = graph.edges;
  
  // Initialize distances with infinity, except startNode with 0
  const distances = {};
  const visited = {};
  const previous = {};
  
  for (let node of nodes) {
    distances[node] = Infinity;
    visited[node] = false;
    previous[node] = null;
  }
  distances[startNode] = 0;
  
  // Process all nodes
  for (let i = 0; i < nodes.length; i++) {
    // Find unvisited node with minimum distance
    let minDistance = Infinity;
    let minNode = null;
    
    for (let node of nodes) {
      if (!visited[node] && distances[node] < minDistance) {
        minDistance = distances[node];
        minNode = node;
      }
    }
    
    // If the minimum distance is Infinity, no more reachable nodes
    if (minDistance === Infinity) break;
    
    // Mark node as visited
    visited[minNode] = true;
    
    // Update distances to neighbors
    for (let edge of edges) {
      let neighbor = null;
      
      if (edge.source === minNode) {
        neighbor = edge.target;
      } else if (edge.target === minNode) {
        neighbor = edge.source;
      } else {
        continue; // Edge doesn't connect to minNode
      }
      
      // Skip visited nodes
      if (visited[neighbor]) continue;
      
      // Calculate new distance
      const newDist = distances[minNode] + edge.weight;
      
      // Update if new distance is smaller
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = minNode;
      }
    }
  }
  
  // Return shortest paths from startNode to all other nodes
  return { distances, previous };
}`,
    python: `def dijkstra(graph, start_node):
    nodes = [node.id for node in graph.nodes]
    edges = graph.edges
    
    # Initialize distances with infinity, except start_node with 0
    distances = {node: float('inf') for node in nodes}
    visited = {node: False for node in nodes}
    previous = {node: None for node in nodes}
    
    distances[start_node] = 0
    
    # Process all nodes
    for _ in range(len(nodes)):
        # Find unvisited node with minimum distance
        min_distance = float('inf')
        min_node = None
        
        for node in nodes:
            if not visited[node] and distances[node] < min_distance:
                min_distance = distances[node]
                min_node = node
        
        # If the minimum distance is infinity, no more reachable nodes
        if min_distance == float('inf'):
            break
        
        # Mark node as visited
        visited[min_node] = True
        
        # Update distances to neighbors
        for edge in edges:
            neighbor = None
            
            if edge.source == min_node:
                neighbor = edge.target
            elif edge.target == min_node:
                neighbor = edge.source
            else:
                continue  # Edge doesn't connect to min_node
            
            # Skip visited nodes
            if visited[neighbor]:
                continue
            
            # Calculate new distance
            new_dist = distances[min_node] + edge.weight
            
            # Update if new distance is smaller
            if new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
                previous[neighbor] = min_node
    
    # Return shortest paths from start_node to all other nodes
    return {"distances": distances, "previous": previous}`,
    cpp: `struct DijkstraResult {
    vector<int> distances;
    vector<int> previous;
};

DijkstraResult dijkstra(const Graph& graph, int startNode) {
    int n = graph.nodes.size();
    
    // Initialize distances with infinity, except startNode with 0
    DijkstraResult result;
    result.distances.assign(n, INT_MAX);
    result.previous.assign(n, -1);
    vector<bool> visited(n, false);
    
    result.distances[startNode] = 0;
    
    // Process all nodes
    for (int i = 0; i < n; ++i) {
        // Find unvisited node with minimum distance
        int minDist = INT_MAX;
        int minNode = -1;
        
        for (int v = 0; v < n; ++v) {
            if (!visited[v] && result.distances[v] < minDist) {
                minDist = result.distances[v];
                minNode = v;
            }
        }
        
        // If the minimum distance is infinity, no more reachable nodes
        if (minDist == INT_MAX) break;
        
        // Mark node as visited
        visited[minNode] = true;
        
        // Update distances to neighbors
        for (const auto& edge : graph.adjacencyList[minNode]) {
            int neighbor = edge.first;
            int weight = edge.second;
            
            // Skip visited nodes
            if (visited[neighbor]) continue;
            
            // Calculate new distance
            int newDist = result.distances[minNode] + weight;
            
            // Update if new distance is smaller
            if (newDist < result.distances[neighbor]) {
                result.distances[neighbor] = newDist;
                result.previous[neighbor] = minNode;
            }
        }
    }
    
    return result;
}`
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Algorithm Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium mb-1 block">Algorithm</label>
          <Select disabled value="dijkstra">
            <SelectTrigger>
              <SelectValue>Dijkstra's Algorithm</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
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
      </div>
      
      {/* Main visualization layout */}
      <GraphAlgorithmLayout 
        graph={graph}
        steps={steps}
        currentStepIndex={currentStepIndex}
        isPlaying={isPlaying}
        speed={animationSpeed}
        algorithmType={AlgorithmType.DIJKSTRA}
        codeSnippets={dijkstraCode}
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
            <h4 className="text-lg font-semibold">Dijkstra's Algorithm</h4>
            <p className="text-muted-foreground">
              Finds the shortest path from a start node to all other nodes in a weighted graph with non-negative edges.
            </p>
            
            <h5 className="font-semibold mt-4 mb-2">How it works:</h5>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>Start at the source node and mark its distance as 0 (all others as infinity)</li>
              <li>Visit the unvisited node with the smallest known distance</li>
              <li>For each neighbor of the current node, calculate the total distance from the start node</li>
              <li>If the calculated distance is less than the known distance, update it</li>
              <li>Mark the current node as visited</li>
              <li>Repeat steps 2-5 until all nodes are visited</li>
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
                src="/lovable-uploads/db8742a8-c6a5-4691-872c-64e916ad4bdf.png"
                alt="Dijkstra's Algorithm Visualization"
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DijkstraVisualization;
