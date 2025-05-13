
import React, { useEffect, useRef, useState } from "react";
import { Graph, Node, Edge, NodeStatus, EdgeStatus } from "../VisualizationTypes";
import { useTheme } from "@/hooks/use-theme";

interface GraphVisualizationProps {
  graph: Graph;
  nodeStatuses: Record<string, NodeStatus>;
  edgeStatuses: Record<string, EdgeStatus>;
  currentNodeId?: string;
  currentEdge?: { source: string; target: string };
  className?: string;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  graph,
  nodeStatuses,
  edgeStatuses,
  currentNodeId,
  currentEdge,
  className = ""
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 400 });
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number, y: number }>>({});
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    // Calculate initial node positions in a circle
    const width = dimensions.width;
    const height = dimensions.height;
    const radius = Math.min(width, height) * 0.40; // Increased from 0.35 for larger graph
    const center = { x: width / 2, y: height / 2 };
    
    const positions: Record<string, { x: number, y: number }> = {};
    
    graph.nodes.forEach((node, index) => {
      const angle = (index * 2 * Math.PI) / graph.nodes.length;
      positions[node.id] = {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle)
      };
    });
    
    setNodePositions(positions);
  }, [graph.nodes, dimensions.width, dimensions.height]);

  useEffect(() => {
    // Update dimensions based on container size
    if (svgRef.current) {
      const updateSize = () => {
        const container = svgRef.current?.parentElement;
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: container.clientHeight
          });
        }
      };
      
      updateSize();
      window.addEventListener("resize", updateSize);
      
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  // Get node color based on its status
  const getNodeColor = (nodeId: string) => {
    const status = nodeStatuses[nodeId] || NodeStatus.UNVISITED;
    
    if (nodeId === currentNodeId) {
      return isDarkMode ? "#a78bfa" : "#8b5cf6"; // Primary color in dark/light mode
    }
    
    switch (status) {
      case NodeStatus.CURRENT:
        return isDarkMode ? "#a78bfa" : "#8b5cf6"; // Primary color in dark/light mode
      case NodeStatus.PROCESSING:
        return isDarkMode ? "#fbbf24" : "#fcd34d"; // Amber colors
      case NodeStatus.FINALIZED:
        return isDarkMode ? "#34d399" : "#22c55e"; // Green colors
      case NodeStatus.REJECTED:
        return isDarkMode ? "#f87171" : "#ef4444"; // Red colors
      case NodeStatus.UNVISITED:
      default:
        return isDarkMode ? "#4b5563" : "#e5e7eb"; // Gray colors
    }
  };

  // Get node text color based on its status
  const getNodeTextColor = (nodeId: string) => {
    const status = nodeStatuses[nodeId] || NodeStatus.UNVISITED;
    
    if (nodeId === currentNodeId || 
        status === NodeStatus.CURRENT ||
        status === NodeStatus.FINALIZED ||
        status === NodeStatus.PROCESSING ||
        status === NodeStatus.REJECTED) {
      return "white";
    }
    
    return isDarkMode ? "white" : "#1E293B"; // Dark text for better contrast
  };

  // Get edge color based on its status
  const getEdgeColor = (source: string, target: string) => {
    const edgeKey = [source, target].sort().join("-");
    const status = edgeStatuses[edgeKey] || EdgeStatus.UNVISITED;
    
    // Check if this is the current edge
    if (
      currentEdge && 
      ((currentEdge.source === source && currentEdge.target === target) || 
       (currentEdge.source === target && currentEdge.target === source))
    ) {
      return isDarkMode ? "#a78bfa" : "#8b5cf6"; // Primary color
    }
    
    switch (status) {
      case EdgeStatus.PROCESSING:
        return isDarkMode ? "#fbbf24" : "#fcd34d"; // Amber colors
      case EdgeStatus.FINALIZED:
        return isDarkMode ? "#34d399" : "#22c55e"; // Green colors
      case EdgeStatus.REJECTED:
        return isDarkMode ? "#f87171" : "#ef4444"; // Red colors
      case EdgeStatus.UNVISITED:
      default:
        return isDarkMode ? "#6b7280" : "#94a3b8"; // Gray colors
    }
  };

  // Get edge stroke width based on its status
  const getEdgeStrokeWidth = (source: string, target: string) => {
    const edgeKey = [source, target].sort().join("-");
    const status = edgeStatuses[edgeKey] || EdgeStatus.UNVISITED;
    
    // Check if this is the current edge
    if (
      currentEdge && 
      ((currentEdge.source === source && currentEdge.target === target) || 
       (currentEdge.source === target && currentEdge.target === source))
    ) {
      return 3;
    }
    
    switch (status) {
      case EdgeStatus.PROCESSING:
      case EdgeStatus.FINALIZED:
        return 2.5;
      case EdgeStatus.REJECTED:
      case EdgeStatus.UNVISITED:
      default:
        return 1.5;
    }
  };

  // Function to calculate edge midpoint for weight label
  const calculateEdgeMidpoint = (sourceId: string, targetId: string) => {
    const source = nodePositions[sourceId];
    const target = nodePositions[targetId];
    
    if (!source || !target) return { x: 0, y: 0 };
    
    return {
      x: (source.x + target.x) / 2,
      y: (source.y + target.y) / 2
    };
  };

  if (Object.keys(nodePositions).length === 0) {
    return <div className="flex items-center justify-center h-full">Loading graph...</div>;
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <svg 
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      >
        {/* Draw edges */}
        {graph.edges.map(edge => {
          const sourcePos = nodePositions[edge.source];
          const targetPos = nodePositions[edge.target];
          
          if (!sourcePos || !targetPos) return null;
          
          const edgeColor = getEdgeColor(edge.source, edge.target);
          const strokeWidth = getEdgeStrokeWidth(edge.source, edge.target);
          const midpoint = calculateEdgeMidpoint(edge.source, edge.target);
          
          return (
            <g key={`${edge.source}-${edge.target}`}>
              <line
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke={edgeColor}
                strokeWidth={strokeWidth}
              />
              
              {/* Weight label with background for better visibility */}
              <circle
                cx={midpoint.x}
                cy={midpoint.y}
                r={14}
                fill={isDarkMode ? "#1f2937" : "white"} // Dark mode: dark gray, Light mode: white
                stroke={edgeColor}
                strokeWidth="1"
              />
              <text
                x={midpoint.x}
                y={midpoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13px"
                fontWeight="bold"
                fill={isDarkMode ? "#e5e7eb" : "#1f2937"} // Dark mode: light gray, Light mode: dark gray
              >
                {edge.weight}
              </text>
            </g>
          );
        })}
        
        {/* Draw nodes */}
        {graph.nodes.map(node => {
          const position = nodePositions[node.id];
          if (!position) return null;
          
          const nodeColor = getNodeColor(node.id);
          const textColor = getNodeTextColor(node.id);
          const isCurrentNode = node.id === currentNodeId;
          const strokeColor = isCurrentNode 
            ? (isDarkMode ? "#a78bfa" : "#8b5cf6") 
            : (isDarkMode ? "#6b7280" : "#94A3B8");
          
          return (
            <g key={node.id}>
              {/* Node circle */}
              <circle
                cx={position.x}
                cy={position.y}
                r={isCurrentNode ? 26 : 24}
                fill={nodeColor}
                stroke={strokeColor}
                strokeWidth={isCurrentNode ? 2 : 1}
              />
              
              {/* Node label */}
              <text
                x={position.x}
                y={position.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="16px"
                fontWeight="bold"
                fill={textColor}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GraphVisualization;
