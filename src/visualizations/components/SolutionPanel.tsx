
import React from 'react';
import { 
  AlgorithmStep, 
  AlgorithmType,
  KnapsackItem
} from "../VisualizationTypes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SolutionPanelProps {
  currentStep: AlgorithmStep;
  algorithmType: AlgorithmType;
}

const SolutionPanel: React.FC<SolutionPanelProps> = ({ 
  currentStep,
  algorithmType
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Current Step</h3>
      <div className="p-3 bg-muted rounded-lg">
        <p className="text-sm">{currentStep.description}</p>
      </div>
      
      {algorithmType === AlgorithmType.FRACTIONAL_KNAPSACK && currentStep.selectedItems && (
        <div className="space-y-2 mt-4">
          <h4 className="font-medium">Selected Items</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Fraction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStep.selectedItems.map((item: KnapsackItem) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>{item.weight}</TableCell>
                  <TableCell>
                    {item.fraction !== undefined ? `${(item.fraction * 100).toFixed(1)}%` : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {currentStep.totalValue !== undefined && (
            <div className="font-medium mt-2">
              Total Value: {currentStep.totalValue.toFixed(2)}
            </div>
          )}
        </div>
      )}
      
      {algorithmType === AlgorithmType.DIJKSTRA && currentStep.distanceMap && (
        <div className="space-y-2 mt-4">
          <h4 className="font-medium">Distances from Source</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Node</TableHead>
                <TableHead>Distance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(currentStep.distanceMap).map(([nodeId, distance]) => (
                <TableRow key={nodeId}>
                  <TableCell className="font-medium">{nodeId}</TableCell>
                  <TableCell>
                    {distance === Infinity ? '∞' : distance}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {algorithmType === AlgorithmType.PRIM && currentStep.mstCost !== undefined && (
        <div className="font-medium mt-4">
          Current MST Cost: {currentStep.mstCost}
        </div>
      )}
      
      {algorithmType === AlgorithmType.BELLMAN_FORD && (
        <div className="space-y-2 mt-4">
          <h4 className="font-medium">Distances from Source</h4>
          {currentStep.negativeCycleDetected && (
            <div className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 p-2 rounded-md text-sm mb-2">
              Negative cycle detected in the graph!
            </div>
          )}
          {currentStep.distanceMap && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Node</TableHead>
                  <TableHead>Distance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(currentStep.distanceMap).map(([nodeId, distance]) => (
                  <TableRow key={nodeId}>
                    <TableCell className="font-medium">{nodeId}</TableCell>
                    <TableCell>
                      {distance === Infinity ? '∞' : distance}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
      
      {algorithmType === AlgorithmType.FLOYD_WARSHALL && currentStep.distanceMatrix && (
        <div className="space-y-2 mt-4">
          <h4 className="font-medium">All-Pairs Shortest Paths</h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  {currentStep.distanceMatrix[0].map((_, colIdx) => (
                    <TableHead key={colIdx}>
                      {String.fromCharCode(65 + colIdx)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentStep.distanceMatrix.map((row, rowIdx) => (
                  <TableRow key={rowIdx}>
                    <TableCell className="font-medium">
                      {String.fromCharCode(65 + rowIdx)}
                    </TableCell>
                    {row.map((distance, colIdx) => (
                      <TableCell 
                        key={colIdx}
                        className="text-center"
                      >
                        {distance === Infinity || distance === null ? '∞' : distance}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionPanel;
