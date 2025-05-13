import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface StepState {
  pivot: number | null;
  comparing: number[];
  swapping: number[];
  partitioning: number[];
  sorted: number[];
  pivotIndices: number[];
}

interface QuickSortVisualizationProps {
  speed: number;
  onOperationSelect?: (operation: string) => void;
}

const QuickSortVisualization: React.FC<QuickSortVisualizationProps> = ({
  speed = 50,
  onOperationSelect
}) => {
  const initialSize = 10;
  const [array, setArray] = useState<number[]>([]);
  const [originalArray, setOriginalArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(initialSize);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<StepState>({
    pivot: null,
    comparing: [],
    swapping: [],
    partitioning: [],
    sorted: [],
    pivotIndices: []
  });
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  
  const { toast } = useToast();
  const sortingRef = useRef<NodeJS.Timeout | null>(null);
  const pauseRef = useRef<boolean>(false);
  const arrayInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    generateRandomArray();
    return () => {
      if (sortingRef.current) {
        clearTimeout(sortingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    pauseRef.current = isPaused;
  }, [isPaused]);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setOriginalArray([...newArray]);
    resetStepState();
    
    // Report operation
    if (onOperationSelect) {
      onOperationSelect('generate');
    }
  };

  const resetStepState = () => {
    setCurrentStep({
      pivot: null,
      comparing: [],
      swapping: [],
      partitioning: [],
      sorted: [],
      pivotIndices: []
    });
    setIsCompleted(false);
  };

  const handleCustomArrayInput = () => {
    try {
      if (!arrayInputRef.current?.value) {
        toast({
          title: "Error",
          description: "Please enter values for the array",
          variant: "destructive"
        });
        return;
      }
      
      const newArray = arrayInputRef.current.value
        .split(',')
        .map(val => {
          const num = parseInt(val.trim());
          if (isNaN(num)) {
            throw new Error("Invalid input");
          }
          return num;
        });
      
      if (newArray.length < 2 || newArray.length > 20) {
        toast({
          title: "Invalid Array Size",
          description: "Array size must be between 2 and 20",
          variant: "destructive"
        });
        return;
      }
      
      setArray(newArray);
      setOriginalArray([...newArray]);
      setArraySize(newArray.length);
      resetStepState();
      
      // Report operation
      if (onOperationSelect) {
        onOperationSelect('custom-array');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid input. Please enter comma-separated numbers",
        variant: "destructive"
      });
    }
  };

  const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => {
      sortingRef.current = setTimeout(() => {
        resolve();
      }, ms);
    });
  };

  const getDelay = (): number => {
    // Convert speed (0-100) to delay (1000-50ms)
    return Math.max(50, 1000 - (speed * 9.5));
  };

  const resetSort = () => {
    setIsSorting(false);
    setIsPaused(false);
    setArray([...originalArray]);
    resetStepState();
    
    if (sortingRef.current) {
      clearTimeout(sortingRef.current);
      sortingRef.current = null;
    }
    
    // Report operation
    if (onOperationSelect) {
      onOperationSelect('reset');
    }
  };

  const partition = async (arr: number[], low: number, high: number): Promise<number> => {
    // Check if sorting was paused
    if (pauseRef.current) {
      return -1; // Signal to stop sorting
    }
    
    const pivot = arr[high];
    setCurrentStep(prev => ({
      ...prev,
      pivot,
      partitioning: Array.from({ length: high - low + 1 }, (_, i) => i + low)
    }));
    
    await sleep(getDelay());
    
    let i = low - 1;
    
    for (let j = low; j <= high - 1; j++) {
      // Check if sorting was paused
      if (pauseRef.current) {
        return -1; // Signal to stop sorting
      }
      
      // Update comparing elements
      setCurrentStep(prev => ({
        ...prev,
        comparing: [j, high]
      }));
      
      await sleep(getDelay());
      
      if (arr[j] < pivot) {
        i++;
        
        // Update swapping elements
        setCurrentStep(prev => ({
          ...prev,
          swapping: [i, j]
        }));
        
        await sleep(getDelay());
        
        // Swap arr[i] and arr[j]
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        
        await sleep(getDelay());
      }
    }
    
    // Update swapping elements for pivot
    setCurrentStep(prev => ({
      ...prev,
      swapping: [i + 1, high]
    }));
    
    await sleep(getDelay());
    
    // Swap arr[i+1] and arr[high]
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    
    setCurrentStep(prev => ({
      ...prev,
      comparing: [],
      swapping: [],
      pivotIndices: [...prev.pivotIndices, i + 1]
    }));
    
    await sleep(getDelay());
    
    return i + 1; // Return partition index
  };

  const quickSortRecursive = async (arr: number[], low: number, high: number, sortedIndices: number[] = []) => {
    if (pauseRef.current) {
      return;
    }
    
    if (low < high) {
      const partitionIndex = await partition(arr, low, high);
      
      // If sorting was paused during partition
      if (partitionIndex === -1) {
        return;
      }
      
      // Mark the pivot as sorted
      sortedIndices.push(partitionIndex);
      setCurrentStep(prev => ({
        ...prev,
        sorted: [...sortedIndices]
      }));
      
      // Recursively sort elements before and after partition
      await quickSortRecursive(arr, low, partitionIndex - 1, sortedIndices);
      await quickSortRecursive(arr, partitionIndex + 1, high, sortedIndices);
    } else if (low >= 0 && high >= 0 && low <= high) {
      // Single element is considered sorted
      sortedIndices.push(low);
      setCurrentStep(prev => ({
        ...prev,
        sorted: [...sortedIndices]
      }));
    }
  };

  const quickSort = async () => {
    setIsSorting(true);
    setIsPaused(false);
    pauseRef.current = false;
    
    // Report operation
    if (onOperationSelect) {
      onOperationSelect('quick-sort');
    }
    
    const newArray = [...array];
    const n = newArray.length;
    
    await quickSortRecursive(newArray, 0, n - 1);
    
    // If sorting wasn't paused, mark it as completed
    if (!pauseRef.current) {
      setCurrentStep(prev => ({
        ...prev,
        pivot: null,
        comparing: [],
        swapping: [],
        partitioning: [],
        sorted: Array.from({ length: n }, (_, i) => i)
      }));
      
      setIsCompleted(true);
    }
    
    setIsSorting(false);
  };

  const toggleSort = () => {
    if (isSorting) {
      if (isPaused) {
        setIsPaused(false);
        quickSort();
      } else {
        setIsPaused(true);
        
        // Report operation
        if (onOperationSelect) {
          onOperationSelect('pause');
        }
      }
    } else {
      quickSort();
    }
  };

  const getBarStyle = (index: number): string => {
    if (currentStep.swapping.includes(index)) {
      return 'bg-red-500 dark:bg-red-600';
    }
    if (currentStep.pivot !== null && array[index] === currentStep.pivot && currentStep.partitioning.includes(index)) {
      return 'bg-purple-500 dark:bg-purple-600';
    }
    if (currentStep.comparing.includes(index)) {
      return 'bg-yellow-500 dark:bg-yellow-600';
    }
    if (currentStep.sorted.includes(index)) {
      return 'bg-green-500 dark:bg-green-600';
    }
    if (currentStep.partitioning.includes(index)) {
      return 'bg-indigo-500 dark:bg-indigo-600';
    }
    return 'bg-blue-500 dark:bg-blue-600';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Quick Sort Visualization</h2>
          <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Info size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About Quick Sort</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <p>
                  <strong>Quick Sort</strong> is a divide-and-conquer sorting algorithm. It works by selecting a 'pivot' 
                  element from the array and partitioning the other elements into two sub-arrays according to whether 
                  they are less than or greater than the pivot.
                </p>
                <p>
                  <strong>Time Complexity:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Worst Case: O(n²) - When the pivot is always the smallest or largest element</li>
                    <li>Average Case: O(n log n)</li>
                    <li>Best Case: O(n log n) - With good pivot selection</li>
                  </ul>
                </p>
                <p>
                  <strong>Space Complexity:</strong> O(log n) - Due to the recursive call stack
                </p>
                <p>
                  <strong>Key Characteristics:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Efficient for large datasets</li>
                    <li>In-place sorting (doesn't require extra storage)</li>
                    <li>Not stable (equal elements may change their relative order)</li>
                    <li>Performance depends on pivot selection</li>
                  </ul>
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Array visualization */}
        <div className="h-64 flex items-end justify-center gap-1 border rounded-md p-4">
          {array.map((value, index) => (
            <div
              key={index}
              className={`w-full max-w-8 transition-all duration-300 flex flex-col items-center ${getBarStyle(index)}`}
              style={{ 
                height: `${Math.max(10, (value / Math.max(...array)) * 100)}%`,
              }}
            >
              {arraySize <= 15 && <span className="text-xs mt-1">{value}</span>}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="font-medium">Array Settings</h3>
            
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap">Size:</span>
              <Slider
                value={[arraySize]}
                min={2}
                max={20}
                step={1}
                onValueChange={(value) => {
                  if (!isSorting) {
                    setArraySize(value[0]);
                  }
                }}
                disabled={isSorting}
                className="flex-grow"
              />
              <span className="text-sm w-6">{arraySize}</span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={generateRandomArray} 
                disabled={isSorting}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw size={16} className="mr-2" /> New Array
              </Button>
              <Button 
                onClick={resetSort} 
                disabled={!isSorting && array.toString() === originalArray.toString()}
                variant="outline"
                className="flex-1"
              >
                Reset
              </Button>
            </div>
            
            <div className="flex flex-col gap-2">
              <Input
                ref={arrayInputRef}
                placeholder="Enter comma-separated numbers (e.g., 5,3,8,1,9)"
                disabled={isSorting}
              />
              <Button 
                onClick={handleCustomArrayInput} 
                disabled={isSorting}
                variant="outline"
              >
                Use Custom Array
              </Button>
            </div>
          </div>
          
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="font-medium">Sorting Controls</h3>
            
            <div className="flex justify-between gap-2">
              <Button 
                onClick={toggleSort} 
                disabled={isCompleted}
                className="flex-1"
              >
                {isSorting ? (
                  isPaused ? (
                    <><Play size={16} className="mr-2" /> Resume</>
                  ) : (
                    <><Pause size={16} className="mr-2" /> Pause</>
                  )
                ) : (
                  <><Play size={16} className="mr-2" /> Start Sorting</>
                )}
              </Button>
            </div>
            
            {/* Status indicators */}
            <div className="flex flex-wrap items-center justify-between text-sm gap-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Swapping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>Pivot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span>Partitioning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Sorted</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status message */}
        {isCompleted && (
          <div className="p-2 bg-green-100 dark:bg-green-900 text-center rounded-md">
            Sorting completed!
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickSortVisualization;

{/* Code examples */}
<div className="mt-8 border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
  <div className="font-semibold mb-2">Quick Sort Code:</div>
  
  <div className="space-y-4">
    <div>
      <h3 className="text-sm font-semibold mb-2">JavaScript</h3>
      <pre className="text-xs overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
{`function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Find the partitioning index
    const partitionIndex = partition(arr, low, high);
    
    // Recursively sort elements before and after partition
    quickSort(arr, low, partitionIndex - 1);
    quickSort(arr, partitionIndex + 1, high);
  }
  
  return arr;
}

function partition(arr, low, high) {
  // Using the last element as pivot
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Place the pivot element in its correct position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  return i + 1; // Return the partition index
}`}
      </pre>
    </div>
    
    <div>
      <h3 className="text-sm font-semibold mb-2">Python</h3>
      <pre className="text-xs overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
{`def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
        
    if low < high:
        # Find the partitioning index
        partition_index = partition(arr, low, high)
        
        # Recursively sort elements before and after partition
        quick_sort(arr, low, partition_index - 1)
        quick_sort(arr, partition_index + 1, high)
        
    return arr

def partition(arr, low, high):
    # Using the last element as pivot
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
            
    # Place the pivot element in its correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    
    return i + 1  # Return the partition index`}
      </pre>
    </div>
    
    <div>
      <h3 className="text-sm font-semibold mb-2">C++</h3>
      <pre className="text-xs overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
{`int partition(int arr[], int low, int high) {
    // Using the last element as pivot
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    
    // Place the pivot element in its correct position
    swap(arr[i + 1], arr[high]);
    
    return i + 1;  // Return the partition index
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        // Find the partitioning index
        int partitionIndex = partition(arr, low, high);
        
        // Recursively sort elements before and after partition
        quickSort(arr, low, partitionIndex - 1);
        quickSort(arr, partitionIndex + 1, high);
    }
}`}
      </pre>
    </div>
  </div>
</div>
