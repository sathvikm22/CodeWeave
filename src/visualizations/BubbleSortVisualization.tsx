import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface StepState {
  i: number;
  j: number;
  comparing: number[];
  sorted: number[];
}

interface BubbleSortVisualizationProps {
  speed: number;
  onOperationSelect?: (operation: string) => void;
}

const BubbleSortVisualization: React.FC<BubbleSortVisualizationProps> = ({ 
  speed = 50,
  onOperationSelect
}) => {
  const [array, setArray] = useState<number[]>([]);
  const [originalArray, setOriginalArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(10);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<StepState>({
    i: 0,
    j: 0,
    comparing: [],
    sorted: []
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
      i: 0,
      j: 0,
      comparing: [],
      sorted: []
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

  const bubbleSort = async () => {
    setIsSorting(true);
    setIsPaused(false);
    pauseRef.current = false;
    
    // Report operation
    if (onOperationSelect) {
      onOperationSelect('bubble-sort');
    }
    
    const newArray = [...array];
    const n = newArray.length;
    
    // Start from where we left off or from the beginning
    let i = currentStep.i;
    
    for (; i < n; i++) {
      // Start j from where we left off or from the beginning of this i iteration
      let j = (i === currentStep.i) ? currentStep.j : 0;
      
      for (; j < n - i - 1; j++) {
        // Check if sorting was paused
        if (pauseRef.current) {
          setCurrentStep({ i, j, comparing: [j, j + 1], sorted: [...currentStep.sorted] });
          return;
        }
        
        // Update current step
        setCurrentStep({
          i,
          j,
          comparing: [j, j + 1],
          sorted: Array.from({ length: i }, (_, idx) => n - idx - 1)
        });
        
        // Wait for the delay
        await sleep(getDelay());
        
        // Compare adjacent elements and swap if needed
        if (newArray[j] > newArray[j + 1]) {
          [newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]];
          setArray([...newArray]);
        }
      }
      
      // Mark the current largest element as sorted
      setCurrentStep(prev => ({
        ...prev,
        sorted: [...prev.sorted, n - i - 1]
      }));
    }
    
    // Mark all elements as sorted when complete
    setCurrentStep(prev => ({
      ...prev,
      comparing: [],
      sorted: Array.from({ length: n }, (_, i) => i)
    }));
    
    setIsCompleted(true);
    setIsSorting(false);
  };

  const toggleSort = () => {
    if (isSorting) {
      if (isPaused) {
        setIsPaused(false);
        bubbleSort();
      } else {
        setIsPaused(true);
        
        // Report operation
        if (onOperationSelect) {
          onOperationSelect('pause');
        }
      }
    } else {
      bubbleSort();
    }
  };

  const getBarStyle = (index: number): string => {
    if (!isSorting && !isCompleted) {
      return 'bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500'; // White bars before sorting
    }
    
    if (currentStep.comparing.includes(index)) {
      return 'bg-yellow-500 dark:bg-yellow-600';
    }
    if (currentStep.sorted.includes(index)) {
      return 'bg-green-500 dark:bg-green-600';
    }
    // Make current range white and excluded elements dark gray
    return index < n - currentStep.i - 1 ? 'bg-white dark:bg-gray-300 border border-gray-400' : 'bg-gray-400 dark:bg-gray-700';
  };

  // Calculate n for use in getBarStyle
  const n = array.length;

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Bubble Sort Visualization</h2>
          <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Info size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About Bubble Sort</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <p>
                  <strong>Bubble Sort</strong> is a simple sorting algorithm that repeatedly steps through the list, 
                  compares adjacent elements, and swaps them if they are in the wrong order.
                </p>
                <p>
                  <strong>Time Complexity:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Worst Case: O(n²) - When array is reverse sorted</li>
                    <li>Average Case: O(n²)</li>
                    <li>Best Case: O(n) - When array is already sorted</li>
                  </ul>
                </p>
                <p>
                  <strong>Space Complexity:</strong> O(1) - Only requires a constant amount of additional memory space
                </p>
                <p>
                  <strong>Key Characteristics:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Simple to implement but inefficient for large datasets</li>
                    <li>Stable sorting algorithm (preserves the relative order of equal elements)</li>
                    <li>In-place algorithm (doesn't require extra space)</li>
                  </ul>
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Array visualization - increased height and width */}
        <div className="h-80 flex items-end justify-center gap-1 border rounded-md p-6">
          {array.map((value, index) => (
            <div
              key={index}
              className={`w-full max-w-12 transition-all duration-300 flex flex-col items-center ${getBarStyle(index)}`}
              style={{ 
                height: `${Math.max(10, (value / Math.max(...array)) * 100)}%`,
              }}
            >
              {arraySize <= 15 && <span className="text-xs mt-1">{value}</span>}
            </div>
          ))}
        </div>

        {/* Controls - expanded layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="font-medium text-lg">Array Settings</h3>
            
            <div className="flex items-center gap-4">
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
            
            <div className="flex gap-4 mt-6">
              <Button 
                onClick={generateRandomArray} 
                disabled={isSorting}
                variant="outline"
                className="flex-1 py-5"
              >
                <RefreshCw size={18} className="mr-2" /> New Array
              </Button>
              <Button 
                onClick={resetSort} 
                disabled={!isSorting && array.toString() === originalArray.toString()}
                variant="outline"
                className="flex-1 py-5"
              >
                Reset
              </Button>
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
              <Input
                ref={arrayInputRef}
                placeholder="Enter comma-separated numbers (e.g., 5,3,8,1,9)"
                disabled={isSorting}
                className="py-5"
              />
              <Button 
                onClick={handleCustomArrayInput} 
                disabled={isSorting}
                variant="outline"
                className="py-5"
              >
                Use Custom Array
              </Button>
            </div>
          </div>
          
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="font-medium text-lg">Sorting Controls</h3>
            
            <div className="flex justify-between gap-4 mt-6">
              <Button 
                onClick={toggleSort} 
                disabled={isCompleted}
                className="flex-1 py-5 text-lg"
                size="lg"
              >
                {isSorting ? (
                  isPaused ? (
                    <><Play size={18} className="mr-2" /> Resume</>
                  ) : (
                    <><Pause size={18} className="mr-2" /> Pause</>
                  )
                ) : (
                  <><Play size={18} className="mr-2" /> Start Sorting</>
                )}
              </Button>
            </div>
            
            {/* Status indicators */}
            <div className="flex items-center justify-between text-sm mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span>Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Sorted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white dark:bg-gray-300 border border-gray-400"></div>
                <span>Current Range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-400 dark:bg-gray-700"></div>
                <span>Excluded</span>
              </div>
            </div>

            {/* Status message */}
            {isCompleted && (
              <div className="p-3 bg-green-100 dark:bg-green-900 text-center rounded-md mt-4">
                Sorting completed!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Code examples
<div className="mt-8 border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
  <div className="font-semibold mb-2">Bubble Sort Code:</div>
  
  <div className="space-y-4">
    <div>
      <h3 className="text-sm font-semibold mb-2">JavaScript</h3>
      <pre className="text-xs overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
{`function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap arr[j] and arr[j+1]
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // If no swapping occurred in this pass, the array is sorted
    if (!swapped) break;
  }
  
  return arr;
}`}
      </pre>
    </div>
    
    <div>
      <h3 className="text-sm font-semibold mb-2">Python</h3>
      <pre className="text-xs overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
{`def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n-1):
        swapped = False
        
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
                
        # If no swapping occurred in this pass, the array is sorted
        if not swapped:
            break
            
    return arr`}
      </pre>
    </div>
    
    <div>
      <h3 className="text-sm font-semibold mb-2">C++</h3>
      <pre className="text-xs overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
{`void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap arr[j] and arr[j+1]
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        
        // If no swapping occurred in this pass, the array is sorted
        if (!swapped)
            break;
    }
}`}
      </pre>
    </div>
  </div>
</div>

export default BubbleSortVisualization;
