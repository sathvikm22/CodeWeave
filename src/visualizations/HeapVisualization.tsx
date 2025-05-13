
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertCircle, 
  PlusCircle, 
  ChevronDown, 
  ChevronUp, 
  Trash, 
  ArrowDownUp,
  Layers 
} from 'lucide-react';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import ComplexityInfo from '@/components/ComplexityInfo';

interface HeapNode {
  value: number;
  state: 'default' | 'highlight' | 'selected' | 'new' | 'sift-up' | 'sift-down';
}

interface HeapVisualizationProps {
  speed: number;
  onOperationSelect: (operation: string) => void;
}

const HeapVisualization: React.FC<HeapVisualizationProps> = ({
  speed,
  onOperationSelect
}) => {
  const [heap, setHeap] = useState<HeapNode[]>([]);
  const [insertValue, setInsertValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [operation, setOperation] = useState<string>('');
  const [heapType, setHeapType] = useState<'min' | 'max'>('min');
  const [animating, setAnimating] = useState<boolean>(false);

  // Calculate animation speed from the speed prop
  const animationSpeed = Math.max(100, 900 - speed * 9);
  
  // Initialize the heap with some values
  useEffect(() => {
    createInitialHeap();
  }, [heapType]);

  const createInitialHeap = () => {
    const initialValues = [10, 30, 50, 20, 35, 15, 40];
    const initialHeap: HeapNode[] = [];
    
    for (const value of initialValues) {
      initialHeap.push({
        value,
        state: 'default'
      });
    }
    
    // Heapify the initial array
    heapify(initialHeap);
    setHeap(initialHeap);
  };

  // Helper function to get parent index
  const getParentIndex = (index: number): number => {
    return Math.floor((index - 1) / 2);
  };

  // Helper function to get left child index
  const getLeftChildIndex = (index: number): number => {
    return 2 * index + 1;
  };

  // Helper function to get right child index
  const getRightChildIndex = (index: number): number => {
    return 2 * index + 2;
  };

  // Helper function to check if element should be swapped (for min heap)
  const shouldSwapMin = (parentValue: number, childValue: number): boolean => {
    return parentValue > childValue;
  };

  // Helper function to check if element should be swapped (for max heap)
  const shouldSwapMax = (parentValue: number, childValue: number): boolean => {
    return parentValue < childValue;
  };

  // Helper function to swap elements in the heap
  const swap = (array: HeapNode[], i: number, j: number): void => {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  };

  // Heapify function to maintain heap property
  const heapify = (array: HeapNode[]): void => {
    // Build heap (rearrange array)
    const n = array.length;
    
    // Start from the last non-leaf node and heapify all nodes
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      siftDown(array, i, n);
    }
  };

  // Sift up operation for insertion
  const siftUp = async (array: HeapNode[], index: number, animate: boolean = false): Promise<HeapNode[]> => {
    if (animate) setAnimating(true);
    
    const heapCopy = [...array];
    let currentIndex = index;
    
    while (currentIndex > 0) {
      const parentIndex = getParentIndex(currentIndex);
      
      const shouldSwap = heapType === 'min' 
        ? shouldSwapMin(heapCopy[parentIndex].value, heapCopy[currentIndex].value)
        : shouldSwapMax(heapCopy[parentIndex].value, heapCopy[currentIndex].value);
      
      if (shouldSwap) {
        if (animate) {
          // Highlight nodes being compared
          heapCopy[parentIndex].state = 'highlight';
          heapCopy[currentIndex].state = 'sift-up';
          setHeap([...heapCopy]);
          
          await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }
        
        // Swap elements
        swap(heapCopy, currentIndex, parentIndex);
        
        if (animate) {
          setHeap([...heapCopy]);
          await new Promise(resolve => setTimeout(resolve, animationSpeed));
          
          // Reset state
          heapCopy[parentIndex].state = 'default';
          heapCopy[currentIndex].state = 'default';
        }
        
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
    
    if (animate) {
      heapCopy[currentIndex].state = 'default';
      setHeap([...heapCopy]);
      setAnimating(false);
    }
    
    return heapCopy;
  };

  // Sift down operation for removal and heapify
  const siftDown = async (array: HeapNode[], index: number, heapSize: number, animate: boolean = false): Promise<HeapNode[]> => {
    if (animate) setAnimating(true);
    
    const heapCopy = [...array];
    let currentIndex = index;
    let smallest = currentIndex; // For min heap; becomes "largest" for max heap
    
    while (true) {
      const leftChildIndex = getLeftChildIndex(currentIndex);
      const rightChildIndex = getRightChildIndex(currentIndex);
      
      // Find the smallest/largest among the current node and its children
      if (heapType === 'min') {
        if (leftChildIndex < heapSize && heapCopy[leftChildIndex].value < heapCopy[smallest].value) {
          smallest = leftChildIndex;
        }
        
        if (rightChildIndex < heapSize && heapCopy[rightChildIndex].value < heapCopy[smallest].value) {
          smallest = rightChildIndex;
        }
      } else {
        // For max heap
        if (leftChildIndex < heapSize && heapCopy[leftChildIndex].value > heapCopy[smallest].value) {
          smallest = leftChildIndex;
        }
        
        if (rightChildIndex < heapSize && heapCopy[rightChildIndex].value > heapCopy[smallest].value) {
          smallest = rightChildIndex;
        }
      }
      
      if (smallest !== currentIndex) {
        if (animate) {
          // Highlight nodes being compared
          heapCopy[currentIndex].state = 'sift-down';
          heapCopy[smallest].state = 'highlight';
          setHeap([...heapCopy]);
          
          await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }
        
        // Swap elements
        swap(heapCopy, currentIndex, smallest);
        
        if (animate) {
          setHeap([...heapCopy]);
          await new Promise(resolve => setTimeout(resolve, animationSpeed));
          
          // Reset state
          heapCopy[currentIndex].state = 'default';
          heapCopy[smallest].state = 'default';
        }
        
        currentIndex = smallest;
      } else {
        break;
      }
    }
    
    if (animate) {
      heapCopy[currentIndex].state = 'default';
      setHeap([...heapCopy]);
      setAnimating(false);
    }
    
    return heapCopy;
  };

  // Insert operation
  const handleInsert = async () => {
    if (animating) return;
    
    if (!insertValue) {
      setError('Please enter a value to insert');
      return;
    }
    
    const value = parseInt(insertValue);
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    
    setOperation('insert');
    onOperationSelect('insert');
    setError('');
    
    const newHeap = [...heap];
    
    // Add the new element at the end of the heap
    newHeap.push({
      value,
      state: 'new'
    });
    
    setHeap(newHeap);
    
    // Visualize the sift-up operation
    await new Promise(resolve => setTimeout(resolve, animationSpeed));
    
    // Restore heap property by sifting up the newly added element
    const updatedHeap = await siftUp(newHeap, newHeap.length - 1, true);
    
    setHeap(updatedHeap.map(node => ({ ...node, state: 'default' })));
    setInsertValue('');
  };

  // Extract min/max operation
  const handleExtract = async () => {
    if (animating) return;
    
    if (heap.length === 0) {
      setError('Heap is empty');
      return;
    }
    
    setOperation('extractMin');
    onOperationSelect(heapType === 'min' ? 'extractMin' : 'extractMax');
    setError('');
    
    const newHeap = [...heap];
    
    // Highlight the root (min/max element)
    newHeap[0].state = 'selected';
    setHeap(newHeap);
    
    await new Promise(resolve => setTimeout(resolve, animationSpeed));
    
    // Replace the root with the last element
    newHeap[0] = { ...newHeap[newHeap.length - 1], state: 'highlight' };
    newHeap.pop();
    
    setHeap(newHeap);
    
    await new Promise(resolve => setTimeout(resolve, animationSpeed));
    
    // Restore heap property by sifting down the new root
    if (newHeap.length > 0) {
      const updatedHeap = await siftDown(newHeap, 0, newHeap.length, true);
      setHeap(updatedHeap.map(node => ({ ...node, state: 'default' })));
    }
  };

  // Change heap type
  const handleHeapTypeChange = (value: string) => {
    if (value === 'min' || value === 'max') {
      setHeapType(value);
    }
  };

  // Clear the heap
  const handleClear = () => {
    setHeap([]);
    setOperation('clear');
    onOperationSelect('clear');
    setError('');
  };

  // Get coordinates for a heap node in the tree visualization
  const getNodeCoordinates = (index: number) => {
    const depth = Math.floor(Math.log2(index + 1));
    const position = index - Math.pow(2, depth) + 1;
    const totalNodesInDepth = Math.pow(2, depth);
    const horizontalSpacing = 760 / (totalNodesInDepth + 1);
    
    const x = horizontalSpacing * (position + 1);
    const y = 60 + depth * 80;
    
    return { x, y };
  };

  // Render a heap node
  const renderNode = (node: HeapNode, index: number) => {
    let color = 'bg-background border-primary';
    let textColor = 'text-foreground';
    
    switch (node.state) {
      case 'highlight':
        color = 'bg-accent border-primary';
        break;
      case 'selected':
        color = 'bg-destructive/20 border-destructive';
        break;
      case 'new':
        color = 'bg-secondary/20 border-secondary';
        break;
      case 'sift-up':
        color = 'bg-green-100 border-green-500';
        textColor = 'text-green-800';
        break;
      case 'sift-down':
        color = 'bg-orange-100 border-orange-500';
        textColor = 'text-orange-800';
        break;
    }
    
    const { x, y } = getNodeCoordinates(index);
    
    return (
      <div 
        key={`node-${index}`}
        className={`absolute flex items-center justify-center ${color} ${textColor} h-12 w-12 rounded-full border transition-all duration-300`}
        style={{ 
          left: `${x}px`, 
          top: `${y}px`
        }}
      >
        {node.value}
      </div>
    );
  };

  // Render connections between nodes with SVG paths
  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    
    for (let i = 0; i < heap.length; i++) {
      const leftChildIndex = getLeftChildIndex(i);
      const rightChildIndex = getRightChildIndex(i);
      
      if (leftChildIndex < heap.length) {
        const parentCoords = getNodeCoordinates(i);
        const childCoords = getNodeCoordinates(leftChildIndex);
        
        const startX = parentCoords.x + 24;
        const startY = parentCoords.y + 24;
        const endX = childCoords.x + 24;
        const endY = childCoords.y;
        
        // Create a curved path instead of a straight line
        const controlX1 = startX;
        const controlY1 = startY + (endY - startY) / 3;
        const controlX2 = endX;
        const controlY2 = endY - (endY - startY) / 3;
        
        connections.push(
          <svg 
            key={`connection-${i}-${leftChildIndex}`} 
            className="absolute" 
            style={{ 
              left: 0, 
              top: 0, 
              width: '800px', 
              height: '500px',
              pointerEvents: 'none'
            }}
          >
            <path
              d={`M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`}
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth="2"
              fill="none"
            />
          </svg>
        );
      }
      
      if (rightChildIndex < heap.length) {
        const parentCoords = getNodeCoordinates(i);
        const childCoords = getNodeCoordinates(rightChildIndex);
        
        const startX = parentCoords.x + 24;
        const startY = parentCoords.y + 24;
        const endX = childCoords.x + 24;
        const endY = childCoords.y;
        
        // Create a curved path instead of a straight line
        const controlX1 = startX;
        const controlY1 = startY + (endY - startY) / 3;
        const controlX2 = endX;
        const controlY2 = endY - (endY - startY) / 3;
        
        connections.push(
          <svg 
            key={`connection-${i}-${rightChildIndex}`} 
            className="absolute" 
            style={{ 
              left: 0, 
              top: 0, 
              width: '800px', 
              height: '500px',
              pointerEvents: 'none'
            }}
          >
            <path
              d={`M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`}
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth="2"
              fill="none"
            />
          </svg>
        );
      }
    }
    
    return connections;
  };

  // Render the heap as an array
  const renderHeapArray = () => {
    return (
      <div className="flex flex-wrap gap-2 mt-4 border p-4 rounded-md">
        {heap.map((node, index) => {
          let bgColor = 'bg-background';
          let textColor = 'text-foreground';
          
          switch (node.state) {
            case 'highlight':
              bgColor = 'bg-accent';
              break;
            case 'selected':
              bgColor = 'bg-destructive/20';
              break;
            case 'new':
              bgColor = 'bg-secondary/20';
              break;
            case 'sift-up':
              bgColor = 'bg-green-100';
              textColor = 'text-green-800';
              break;
            case 'sift-down':
              bgColor = 'bg-orange-100';
              textColor = 'text-orange-800';
              break;
          }
          
          return (
            <div 
              key={`array-${index}`} 
              className={`ds-array-cell ${bgColor} ${textColor} h-10 min-w-[40px] px-2 relative transition-all duration-300`}
            >
              <div className="ds-array-index absolute -top-5 left-0 w-full text-center">
                {index}
              </div>
              {node.value}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Heap</h3>
          <p className="text-sm text-muted-foreground">
            A complete binary tree where each node follows the heap property
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-2">
          <ToggleGroup 
            type="single" 
            value={heapType}
            onValueChange={(value) => handleHeapTypeChange(value)}
            className="justify-start"
          >
            <ToggleGroupItem value="min" aria-label="Min Heap">
              <ChevronDown className="mr-1 h-4 w-4" />
              <span>Min Heap</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="max" aria-label="Max Heap">
              <ChevronUp className="mr-1 h-4 w-4" />
              <span>Max Heap</span>
            </ToggleGroupItem>
          </ToggleGroup>
          
          <div className="flex items-center">
            <Input
              type="number"
              placeholder="Enter value"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              className="w-28"
              disabled={animating}
            />
            <Button 
              variant="outline" 
              className="ml-2"
              onClick={handleInsert}
              disabled={animating}
            >
              <PlusCircle className="mr-1 h-4 w-4" /> Insert
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleExtract}
            disabled={heap.length === 0 || animating}
          >
            <ArrowDownUp className="mr-1 h-4 w-4" /> 
            Extract {heapType === 'min' ? 'Min' : 'Max'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleClear}
            disabled={heap.length === 0 || animating}
          >
            <Trash className="mr-1 h-4 w-4" /> Clear
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="border rounded-md p-4 relative h-[400px] overflow-auto">
        <div className="relative w-full h-full" style={{ minWidth: '800px', minHeight: '400px' }}>
          {renderConnections()}
          {heap.map((node, index) => renderNode(node, index))}
          
          {heap.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">The heap is empty. Insert values to begin.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h4 className="font-medium">Heap as Array</h4>
        </div>
        
        {renderHeapArray()}
      </div>
      
      <div className="flex flex-col space-y-1">
        <h4 className="text-sm font-medium">Legend:</h4>
        <div className="flex space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-accent border border-primary mr-1"></div>
            <span>Comparing</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 border border-green-500 mr-1"></div>
            <span>Sift Up</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-100 border border-orange-500 mr-1"></div>
            <span>Sift Down</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-destructive/20 border border-destructive mr-1"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>
      
      {/* Complexity Information */}
      <div className="w-full border rounded-md p-4 mt-4">
        <ComplexityInfo dataStructure="heap" operation={operation} />
      </div>
    </div>
  );
};

export default HeapVisualization;
