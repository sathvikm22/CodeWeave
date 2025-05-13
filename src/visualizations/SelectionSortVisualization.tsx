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
  minIndex: number;
  comparing: number[];
  sorted: number[];
}

interface SelectionSortVisualizationProps {
  speed: number;
  onOperationSelect?: (operation: string) => void;
}

const SelectionSortVisualization: React.FC<SelectionSortVisualizationProps> = ({
  speed,
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
    minIndex: 0,
    comparing: [],
    sorted: []
  });
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  
  const { toast } = useToast();
  const sortingRef = useRef<NodeJS.Timeout | null>(null);
  const pauseRef = useRef<boolean>(false);
  const arrayInputRef = useRef<HTMLInputElement>(null);

  // Calculate animation speed from the speed prop
  const animationSpeed = Math.max(100, 900 - speed * 9);

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
    
    if (onOperationSelect) {
      onOperationSelect('generate');
    }
  };

  const resetStepState = () => {
    setCurrentStep({
      i: 0,
      j: 0,
      minIndex: 0,
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
      
      if (onOperationSelect) {
        onOperationSelect('custom');
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

  const resetSort = () => {
    setIsSorting(false);
    setIsPaused(false);
    setArray([...originalArray]);
    resetStepState();
    
    if (sortingRef.current) {
      clearTimeout(sortingRef.current);
      sortingRef.current = null;
    }
    
    if (onOperationSelect) {
      onOperationSelect('reset');
    }
  };

  const selectionSort = async () => {
    setIsSorting(true);
    setIsPaused(false);
    pauseRef.current = false;
    
    const newArray = [...array];
    const n = newArray.length;
    
    // Start from where we left off or from the beginning
    let i = currentStep.i;
    
    for (; i < n - 1; i++) {
      let minIndex = i;
      
      // Start j from where we left off or from i+1
      let j = (i === currentStep.i) ? Math.max(currentStep.j, i + 1) : i + 1;
      
      for (; j < n; j++) {
        // Check if sorting was paused
        if (pauseRef.current) {
          setCurrentStep({ i, j, minIndex, comparing: [j, minIndex], sorted: [...currentStep.sorted] });
          return;
        }
        
        // Update current step to show comparison
        setCurrentStep({
          i,
          j,
          minIndex,
          comparing: [j, minIndex],
          sorted: Array.from({ length: i }, (_, idx) => idx)
        });
        
        // Wait for the delay
        await sleep(animationSpeed);
        
        // Find the minimum element
        if (newArray[j] < newArray[minIndex]) {
          minIndex = j;
          setCurrentStep(prev => ({
            ...prev,
            minIndex
          }));
        }
      }
      
      // Swap the found minimum element with the element at position i
      if (minIndex !== i) {
        // Highlight the swap
        setCurrentStep(prev => ({
          ...prev,
          comparing: [i, minIndex]
        }));
        
        await sleep(animationSpeed);
        
        [newArray[i], newArray[minIndex]] = [newArray[minIndex], newArray[i]];
        setArray([...newArray]);
      }
      
      // Mark the current element as sorted
      setCurrentStep(prev => ({
        ...prev,
        comparing: [],
        sorted: [...prev.sorted, i]
      }));
    }
    
    // Mark all elements as sorted when complete
    setCurrentStep(prev => ({
      ...prev,
      comparing: [],
      sorted: Array.from({ length: n }, (_, idx) => idx)
    }));
    
    setIsCompleted(true);
    setIsSorting(false);
    
    if (onOperationSelect) {
      onOperationSelect('completed');
    }
  };

  const toggleSort = () => {
    if (isSorting) {
      if (isPaused) {
        setIsPaused(false);
        selectionSort();
        if (onOperationSelect) {
          onOperationSelect('resume');
        }
      } else {
        setIsPaused(true);
        if (onOperationSelect) {
          onOperationSelect('pause');
        }
      }
    } else {
      selectionSort();
      if (onOperationSelect) {
        onOperationSelect('start');
      }
    }
  };

  const getBarStyle = (index: number): string => {
    if (!isSorting && !isCompleted) {
      return 'bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500'; // White bars before sorting
    }
    
    if (currentStep.comparing.includes(index)) {
      return 'bg-yellow-500 dark:bg-yellow-600';
    }
    if (index === currentStep.minIndex && index !== currentStep.i) {
      return 'bg-purple-500 dark:bg-purple-600';
    }
    if (currentStep.sorted.includes(index)) {
      return 'bg-green-500 dark:bg-green-600';
    }
    return 'bg-primary dark:bg-primary/80';
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Selection Sort</h3>
          <p className="text-sm text-muted-foreground">
            Find the minimum element and place it at the beginning
          </p>
        </div>
        
        <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Info size={16} className="mr-2" /> About Selection Sort
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About Selection Sort</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <p>
                <strong>Selection Sort</strong> is a simple sorting algorithm that divides the input list into 
                two parts: a sorted sublist and an unsorted sublist. The algorithm repeatedly finds the 
                smallest element from the unsorted sublist and moves it to the end of the sorted sublist.
              </p>
              <p>
                <strong>Time Complexity:</strong>
              </p>
              <ul className="list-disc pl-5 mt-1">
                <li>Worst Case: O(n²)</li>
                <li>Average Case: O(n²)</li>
                <li>Best Case: O(n²) - Unlike some other algorithms, selection sort doesn't benefit from pre-sorted data</li>
              </ul>
              <p>
                <strong>Space Complexity:</strong> O(1) - Only requires a constant amount of additional memory space
              </p>
              <p>
                <strong>Key Characteristics:</strong>
              </p>
              <ul className="list-disc pl-5 mt-1">
                <li>Simple implementation</li>
                <li>Performs well on small lists</li>
                <li>Makes fewer swaps compared to Bubble Sort (at most n swaps)</li>
                <li>Not stable - relative order of equal elements may change</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Array visualization */}
      <div className="border rounded-md relative h-64 overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-center gap-1 p-4">
          {array.map((value, index) => (
            <div
              key={index}
              className={`w-full transition-all duration-300 flex flex-col items-center ${getBarStyle(index)}`}
              style={{ 
                height: `${Math.max(10, (value / Math.max(...array, 1)) * 100)}%`,
              }}
            >
              {arraySize <= 15 && <span className="text-xs mt-1 text-foreground">{value}</span>}
            </div>
          ))}
          
          {array.length === 0 && (
            <div className="flex h-full items-center justify-center w-full">
              <p className="text-muted-foreground">Generate an array to start</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
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
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={generateRandomArray} 
              disabled={isSorting}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <RefreshCw size={16} className="mr-2" /> New Array
            </Button>
            <Button 
              onClick={resetSort} 
              disabled={!isSorting && array.toString() === originalArray.toString()}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Reset
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              ref={arrayInputRef}
              placeholder="Enter comma-separated numbers (e.g., 5,3,8,1,9)"
              disabled={isSorting}
              size={1}
            />
            <Button 
              onClick={handleCustomArrayInput} 
              disabled={isSorting}
              variant="outline"
              size="icon"
            >
              →
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={toggleSort} 
            disabled={isCompleted || array.length === 0}
            className="w-full"
          >
            {isSorting ? (
              isPaused ? "Resume Sorting" : "Pause Sorting"
            ) : (
              "Start Sorting"
            )}
          </Button>
          
          {/* Status indicators */}
          <div className="flex items-center justify-between text-xs mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Min Value</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Sorted</span>
            </div>
          </div>
          
          {/* Status message */}
          {isCompleted && (
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-center text-sm rounded-md border border-green-500">
              Sorting completed!
            </div>
          )}
        </div>
      </div>
      
      {/* Code examples */}
      <div className="mt-8 border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
        <div className="font-semibold mb-2">Selection Sort Code:</div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">JavaScript</h3>
            <pre className="text-xs overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
{`function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    // Find the minimum element in the unsorted part
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap the found minimum element with the element at index i
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  
  return arr;
}`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-2">Python</h3>
            <pre className="text-xs overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
{`def selection_sort(arr):
    n = len(arr)
    
    for i in range(n-1):
        # Find the minimum element in the unsorted part
        min_index = i
        for j in range(i+1, n):
            if arr[j] < arr[min_index]:
                min_index = j
                
        # Swap the found minimum element with the element at index i
        if min_index != i:
            arr[i], arr[min_index] = arr[min_index], arr[i]
            
    return arr`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-2">C++</h3>
            <pre className="text-xs overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
{`void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        // Find the minimum element in the unsorted part
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        
        // Swap the found minimum element with the element at index i
        if (min_idx != i) {
            swap(arr[i], arr[min_idx]);
        }
    }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionSortVisualization;
