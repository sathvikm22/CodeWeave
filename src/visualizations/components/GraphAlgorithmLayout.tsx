
import React from 'react';
import { Card } from '@/components/ui/card';
import GraphVisualization from './GraphVisualization';
import SolutionPanel from './SolutionPanel';
import AlgorithmControls from './AlgorithmControls';
import AdjacencyMatrix from './AdjacencyMatrix';
import AlgorithmCodeTabs from './AlgorithmCodeTabs';
import { Graph, AlgorithmStep, AlgorithmType } from "../VisualizationTypes";

interface GraphAlgorithmLayoutProps {
  graph: Graph;
  steps: AlgorithmStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  algorithmType: AlgorithmType;
  codeSnippets: {
    javascript: string;
    python: string;
    cpp: string;
  };
  onReset: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onPlayPause: () => void;
  onSpeedChange: (values: number[]) => void;
}

const GraphAlgorithmLayout: React.FC<GraphAlgorithmLayoutProps> = ({
  graph,
  steps,
  currentStepIndex,
  isPlaying,
  speed,
  algorithmType,
  codeSnippets,
  onReset,
  onStepBack,
  onStepForward,
  onPlayPause,
  onSpeedChange
}) => {
  const currentStep = steps[currentStepIndex] || {
    description: "Initializing algorithm...",
    nodeStatuses: {},
    edgeStatuses: {},
  };

  // Generate the adjacency matrix from the graph
  const generateAdjacencyMatrix = () => {
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
  };

  const adjacencyData = generateAdjacencyMatrix();

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Top section - Graph visualization and Adjacency Matrix side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Graph Visualization - takes 2/3 of the width */}
        <Card className="p-4 bg-card shadow-sm lg:col-span-2 h-[500px]">
          <h3 className="text-lg font-medium mb-4">Graph Visualization</h3>
          <div className="h-[430px]">
            <GraphVisualization
              graph={graph}
              nodeStatuses={currentStep.nodeStatuses}
              edgeStatuses={currentStep.edgeStatuses}
              currentNodeId={currentStep.currentNodeId}
              currentEdge={currentStep.currentEdge}
            />
          </div>
        </Card>
        
        <div className="space-y-6">
          {/* Adjacency Matrix - Takes 1/3 of the width */}
          <Card className="p-4 bg-card shadow-sm overflow-auto">
            <h3 className="text-lg font-medium mb-4">Adjacency Matrix</h3>
            <AdjacencyMatrix
              adjacencyMatrix={{
                labels: adjacencyData.labels,
                matrix: adjacencyData.matrix
              }}
              nodeStatuses={currentStep.nodeStatuses}
              edgeStatuses={currentStep.edgeStatuses}
              currentNodeId={currentStep.currentNodeId}
              currentEdge={currentStep.currentEdge}
            />
          </Card>
          
          {/* Solution Panel */}
          <Card className="p-4 bg-card shadow-sm">
            <SolutionPanel
              currentStep={currentStep}
              algorithmType={algorithmType}
            />
          </Card>
        </div>
      </div>

      {/* Bottom section - Algorithm Controls */}
      <div className="mb-6">
        <Card className="p-4 bg-card shadow-sm">
          <AlgorithmControls
            isPlaying={isPlaying}
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            speed={speed}
            onReset={onReset}
            onStepBack={onStepBack}
            onStepForward={onStepForward}
            onPlayPause={onPlayPause}
            onSpeedChange={onSpeedChange}
          />
        </Card>
      </div>
      
      {/* Algorithm code snippets */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Code Implementation</h3>
        <AlgorithmCodeTabs code={codeSnippets} />
      </div>
    </div>
  );
};

export default GraphAlgorithmLayout;
