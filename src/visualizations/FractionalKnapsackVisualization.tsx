
import React, { useState, useEffect, useRef } from 'react';
import { runFractionalKnapsack, fractionalKnapsackCodeSnippets } from '../algorithms/fractionalKnapsack';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Slider } from '@/components/ui/slider';
import { AlertCircle, RotateCcw, SkipBack, Play, Pause, SkipForward } from 'lucide-react';
import { AlgorithmType, AlgorithmStep, NodeStatus, EdgeStatus, KnapsackItem } from './VisualizationTypes';

// Helper function for animation speed conversion
const speedToDelay = (speed: number): number => {
  return Math.max(100, 2000 - (speed * 19));
};

interface FractionalKnapsackVisualizationProps {
  speed?: number;
  onOperationSelect?: (operation: string) => void;
}

const FractionalKnapsackVisualization: React.FC<FractionalKnapsackVisualizationProps> = ({ 
  speed = 50,
  onOperationSelect 
}) => {
  const [items, setItems] = useState<KnapsackItem[]>([]);
  const [capacity, setCapacity] = useState<number>(50);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with default items
  useEffect(() => {
    const defaultItems: KnapsackItem[] = [
      { id: "A", value: 60, weight: 10 },
      { id: "B", value: 100, weight: 20 },
      { id: "C", value: 120, weight: 30 },
      { id: "D", value: 80, weight: 15 },
      { id: "E", value: 40, weight: 5 }
    ];

    setItems(defaultItems);
    resetSimulation(defaultItems);
  }, []);

  const resetSimulation = (itemsToUse: KnapsackItem[] = items) => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    const newSteps = runFractionalKnapsack([...itemsToUse], capacity);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setCurrentStep(newSteps[0]);
    setIsPlaying(false);
    onOperationSelect?.('Reset Simulation');
  };

  useEffect(() => {
    if (currentStepIndex < steps.length) {
      setCurrentStep(steps[currentStepIndex]);
    }
  }, [currentStepIndex, steps]);

  useEffect(() => {
    if (isPlaying) {
      const delay = speedToDelay(speed);
      animationRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, delay);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlayPause = () => {
    if (currentStepIndex >= steps.length - 1 && !isPlaying) {
      resetSimulation();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
    onOperationSelect?.(isPlaying ? 'Pause' : 'Play');
  };

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      onOperationSelect?.('Step Forward');
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      onOperationSelect?.('Step Back');
    }
  };

  const getSpeedLabel = () => {
    if (speed < 30) return "Slow";
    if (speed < 70) return "Medium";
    return "Fast";
  };

  const handleSpeedChange = (newSpeed: number[]) => {
    onOperationSelect?.(`Changed Speed to ${newSpeed[0]}%`);
  };

  if (!currentStep) {
    return <div>Loading...</div>;
  }

  // Get node color based on its status
  const getNodeColor = (nodeId: string) => {
    const status = currentStep.nodeStatuses?.[nodeId] || NodeStatus.UNVISITED;
    
    switch (status) {
      case NodeStatus.CURRENT:
        return "bg-primary text-primary-foreground";
      case NodeStatus.PROCESSING:
        return "bg-yellow-500 text-white dark:bg-yellow-600 dark:text-white";
      case NodeStatus.FINALIZED:
        return "bg-green-500 text-white dark:bg-green-600 dark:text-white";
      case NodeStatus.REJECTED:
        return "bg-red-500 text-white dark:bg-red-600 dark:text-white";
      case NodeStatus.UNVISITED:
      default:
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main visualization area - Takes 3/5 of the space */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Knapsack Visualization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentStep.selectedItems && currentStep.selectedItems.map((item, index) => {
                const nodeStatus = currentStep.nodeStatuses?.[item.id] || NodeStatus.UNVISITED;
                const nodeColorClass = getNodeColor(item.id);
                
                return (
                  <div 
                    key={`${item.id}-${index}`}
                    className={`p-4 rounded-lg border-2 ${nodeColorClass}`}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-bold">Item {item.id}</span>
                      {item.fraction > 0 && (nodeStatus === NodeStatus.FINALIZED) && (
                        <span className="text-xs px-2 py-1 bg-green-700 text-white rounded-full">
                          {(item.fraction * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Value:</span>
                        <span>{item.value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <span>{item.weight}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Ratio:</span>
                        <span>{item.ratio?.toFixed(2) || (item.value / item.weight).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">Knapsack Capacity:</h4>
                  <div className="text-2xl font-bold">{capacity}</div>
                </div>
                {currentStep.totalValue !== undefined && (
                  <div className="text-right">
                    <h4 className="font-medium">Total Value:</h4>
                    <div className="text-2xl font-bold">{currentStep.totalValue.toFixed(2)}</div>
                  </div>
                )}
              </div>
              <div className="mt-4 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                {currentStep.selectedItems && (
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, currentStep.selectedItems.reduce((acc, item) => 
                        acc + (item.weight * (item.fraction || 0)), 0) / capacity * 100)}%` 
                    }}
                  />
                )}
              </div>
              <div className="mt-1 text-xs text-right">
                {currentStep.selectedItems && (
                  <>
                    {currentStep.selectedItems
                      .reduce((acc, item) => acc + (item.weight * (item.fraction || 0)), 0)
                      .toFixed(2)}
                    /{capacity} ({Math.min(100, currentStep.selectedItems.reduce((acc, item) => 
                      acc + (item.weight * (item.fraction || 0)), 0) / capacity * 100).toFixed(2)}%)
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Algorithm data - Takes 2/5 of the space */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Ratio (V/W)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStep.selectedItems && currentStep.selectedItems.map((item) => {
                    const nodeStatus = currentStep.nodeStatuses?.[item.id] || NodeStatus.UNVISITED;
                    const isSelected = nodeStatus === NodeStatus.FINALIZED;
                    
                    return (
                      <TableRow 
                        key={item.id}
                        className={isSelected ? "bg-green-100 dark:bg-green-900/30" : ""}
                      >
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.value}</TableCell>
                        <TableCell>{item.weight}</TableCell>
                        <TableCell>{item.ratio?.toFixed(2) || (item.value / item.weight).toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Steps</CardTitle>
              <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Greedy Algorithm
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-md">
                {currentStep.description}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <h4 className="col-span-2 font-medium">Legend:</h4>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <span className="text-sm">Unvisited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 dark:bg-yellow-600"></div>
                  <span className="text-sm">Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 dark:bg-green-600"></div>
                  <span className="text-sm">Finalized</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500 dark:bg-red-600"></div>
                  <span className="text-sm">Rejected</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Controls</CardTitle>
            <span className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Animation Controls</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => resetSimulation()}
                className="rounded-full"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleStepBack}
                disabled={currentStepIndex <= 0}
                className="rounded-full"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                className="flex-1"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Play
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleStepForward}
                disabled={currentStepIndex >= steps.length - 1}
                className="rounded-full"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Animation Speed</h3>
              <span className="text-sm">{speed}% - {getSpeedLabel()}</span>
            </div>
            <Slider
              value={[speed]}
              min={10}
              max={100}
              step={5}
              onValueChange={handleSpeedChange}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Code snippet section */}
      <Card>
        <CardHeader>
          <CardTitle>Code Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex border-b">
              <button className="px-4 py-2 text-sm font-medium border-b-2 border-primary">JavaScript</button>
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground">Python</button>
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground">C++</button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm bg-muted/30 rounded-md">
              <code>{fractionalKnapsackCodeSnippets.javascript}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FractionalKnapsackVisualization;
