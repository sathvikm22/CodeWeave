
import React from "react";
import { AdjacencyMatrix as AdjacencyMatrixType, NodeStatus, EdgeStatus } from "../../visualizations/VisualizationTypes";

interface AdjacencyMatrixProps {
  adjacencyMatrix: AdjacencyMatrixType;
  nodeStatuses: Record<string, NodeStatus>;
  edgeStatuses: Record<string, EdgeStatus>;
  currentNodeId?: string;
  currentEdge?: { source: string; target: string };
}

const AdjacencyMatrix: React.FC<AdjacencyMatrixProps> = ({
  adjacencyMatrix,
  nodeStatuses,
  edgeStatuses,
  currentNodeId,
  currentEdge
}) => {
  const { labels, matrix } = adjacencyMatrix;

  // Get cell background color based on node/edge status
  const getCellBackground = (rowIdx: number, colIdx: number) => {
    if (rowIdx === colIdx) {
      // Diagonal cells - represent nodes
      const nodeId = labels[rowIdx];
      const status = nodeStatuses[nodeId];
      
      if (nodeId === currentNodeId) {
        return "bg-primary text-primary-foreground";
      }
      
      switch (status) {
        case NodeStatus.CURRENT:
          return "bg-primary text-primary-foreground";
        case NodeStatus.PROCESSING:
          return "bg-amber-300 dark:bg-amber-500 text-black dark:text-white";
        case NodeStatus.FINALIZED:
          return "bg-green-500 text-white";
        default:
          return "bg-gray-100 dark:bg-gray-700 dark:text-gray-200";
      }
    } else if (matrix[rowIdx][colIdx] !== null) {
      // Non-diagonal cells with values - represent edges
      const source = labels[rowIdx];
      const target = labels[colIdx];
      const edgeKey = [source, target].sort().join("-");
      const status = edgeStatuses[edgeKey];
      
      // Check if this is the current edge
      if (
        currentEdge && 
        ((currentEdge.source === source && currentEdge.target === target) || 
         (currentEdge.source === target && currentEdge.target === source))
      ) {
        return "bg-primary text-primary-foreground";
      }
      
      switch (status) {
        case EdgeStatus.PROCESSING:
          return "bg-amber-200 dark:bg-amber-600 text-black dark:text-white";
        case EdgeStatus.FINALIZED:
          return "bg-green-400 text-white";
        case EdgeStatus.REJECTED:
          return "bg-red-400 text-white";
        default:
          return "bg-gray-50 dark:bg-gray-600 dark:text-gray-200";
      }
    }
    
    // Empty cells (no edge)
    return "bg-gray-50 dark:bg-gray-600 dark:text-gray-200";
  };

  if (labels.length === 0) {
    return <div className="p-4 dark:text-gray-200">No matrix data available</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-200"></th>
            {labels.map((label) => (
              <th 
                key={label} 
                className={`p-2 border border-gray-300 dark:border-gray-600 font-medium text-sm ${
                  label === currentNodeId 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((rowLabel, rowIdx) => (
            <tr key={rowLabel}>
              <th 
                className={`p-2 border border-gray-300 dark:border-gray-600 font-medium text-sm ${
                  rowLabel === currentNodeId 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                {rowLabel}
              </th>
              {matrix[rowIdx].map((cell, colIdx) => (
                <td
                  key={colIdx}
                  className={`p-2 border border-gray-300 dark:border-gray-600 text-center text-sm transition-colors duration-300 ${getCellBackground(
                    rowIdx,
                    colIdx
                  )}`}
                >
                  {cell === null ? "-" : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdjacencyMatrix;
