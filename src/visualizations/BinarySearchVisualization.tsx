import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Search, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface StepState {
  left: number;
  right: number;
  mid: number;
  found: boolean;
  completed: boolean;
  activeRange: number[];
  searchValue: number;
}

interface BinarySearchVisualizationProps {
  speed: number;
  onOperationSelect?: (operation: string) => void;
}

const BinarySearchVisualization: React.FC<BinarySearchVisualizationProps> = ({ 
  speed = 50,
  onOperationSelect
}) => {
  const initialSize = 10;
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(initialSize);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<number>(0);
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<StepState>({
    left: 0,
    right: 0,
    mid: 0,
    found: false,
    completed: false,
    activeRange: [],
    searchValue: 0
  });
  
  const { toast } = useToast();
  const searchingRef = useRef<NodeJS.Timeout | null>(null);
  const pauseRef = useRef<boolean>(false);
  const arrayInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    generateSortedArray();
    return () => {
      if (searchingRef.current) {
        clearTimeout(searchingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    pauseRef.current = isPaused;
  }, [isPaused]);

  const generateSortedArray = () => {
    // Generate random array first
    const unsortedArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    
    // Then sort it for binary search
    const newArray = [...unsortedArray].sort((a, b) => a - b);
    setArray(newArray);
    
    // Set a random element from the array as the search value
    if (newArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * newArray.length);
      setSearchValue(newArray[randomIndex]);
      if (searchInputRef.current) {
        searchInputRef.current.value = newArray[randomIndex].toString();
      }
    }
    
    resetStepState();
    
    // Report operation
    if (onOperationSelect) {
      onOperationSelect('generate');
    }
  };

  const resetStepState = () => {
    setCurrentStep({
      left: 0,
      right: arraySize - 1,
      mid: Math.floor((arraySize - 1) / 2),
      found: false,
      completed: false,
      activeRange: Array.from({ length: arraySize }, (_, i) => i),
      searchValue
    });
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
        })
        .sort((a, b) => a - b); // Sort for binary search
      
      if (newArray.length < 2 || newArray.length > 20) {
        toast({
          title: "Invalid Array Size",
          description: "Array size must be between 2 and 20",
          variant: "destructive"
        });
        return;
      }
      
      setArray(newArray);
      setArraySize(newArray.length);
      
      // Set a random element from the array as the search value
      if (newArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * newArray.length);
        setSearchValue(newArray[randomIndex]);
        if (searchInputRef.current) {
          searchInputRef.current.value = newArray[randomIndex].toString();
        }
      }
      
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

  const handleSearchValueChange = () => {
    if (!searchInputRef.current?.value) {
      toast({
        title: "Error",
        description: "Please enter a search value",
        variant: "destructive"
      });
      return;
    }
    
    const value = parseInt(searchInputRef.current.value.trim());
    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Search value must be a number",
        variant: "destructive"
      });
      return;
    }
    
    setSearchValue(value);
    resetStepState();
    
    // Report operation
    if (onOperationSelect) {
      onOperationSelect('set-search-value');
    }
  };

  const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => {
      searchingRef.current = setTimeout(() => {
        resolve();
      }, ms);
    });
  };

  const getDelay = (): number => {
    // Convert speed (0-100) to delay (1000-50ms)
    return Math.max(50, 1000 - (speed * 9.5));
  };

  const resetSearch = () => {
    setIsSearching(false);
    setIsPaused(false);
    
    if (searchingRef.current) {
      clearTimeout(searchingRef.current);
      searchingRef.current = null;
    }
    
    resetStepState();
    
    // Report operation
    if (onOperationSelect) {
      onOperationSelect('reset');
    }
  };

  const binarySearch = async () => {
    setIsSearching(true);
    setIsPaused(false);
    pauseRef.current = false;
    
    // Report operation
    if (onOperationSelect) {
      onOperationSelect('binary-search');
    }
    
    let left = currentStep.left;
    let right = currentStep.right;
    const target = searchValue;
    
    // Update the initial state
    setCurrentStep(prev => ({
      ...prev,
      left,
      right,
      mid: Math.floor((left + right) / 2),
      activeRange: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      searchValue: target
    }));
    
    // Wait for initial state visualization
    await sleep(getDelay());
    
    while (left <= right) {
      if (pauseRef.current) {
        return;
      }
      
      const mid = Math.floor((left + right) / 2);
      
      // Update step for visualization
      setCurrentStep(prev => ({
        ...prev,
        left,
        right,
        mid,
        activeRange: Array.from({ length: right - left + 1 }, (_, i) => left + i)
      }));
      
      await sleep(getDelay());
      
      if (array[mid] === target) {
        // Found the element
        setCurrentStep(prev => ({
          ...prev,
          found: true,
          completed: true,
          mid
        }));
        
        setIsSearching(false);
        return;
      } else if (array[mid] < target) {
        // Continue searching in the right half
        left = mid + 1;
      } else {
        // Continue searching in the left half
        right = mid - 1;
      }
      
      await sleep(getDelay());
    }
    
    // If we get here, element was not found
    setCurrentStep(prev => ({
      ...prev,
      found: false,
      completed: true,
      activeRange: []
    }));
    
    setIsSearching(false);
  };

  const toggleSearch = () => {
    if (isSearching) {
      if (isPaused) {
        setIsPaused(false);
        binarySearch();
      } else {
        setIsPaused(true);
        
        // Report operation
        if (onOperationSelect) {
          onOperationSelect('pause');
        }
      }
    } else {
      // Reset the state before starting a new search
      resetStepState();
      binarySearch();
    }
  };

  const getBoxStyle = (index: number): string => {
    if (currentStep.completed && currentStep.found && index === currentStep.mid) {
      return 'bg-green-500 dark:bg-green-600 border-green-700';
    }
    if (index === currentStep.mid) {
      return 'bg-purple-500 dark:bg-purple-600 border-purple-700';
    }
    if (currentStep.activeRange.includes(index)) {
      return 'bg-white dark:bg-gray-100 border-gray-300 text-gray-800';
    }
    return 'bg-gray-400 dark:bg-gray-700 border-gray-500 dark:border-gray-600 text-white';
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Binary Search Visualization</h2>
          <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Info size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About Binary Search</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <p>
                  <strong>Binary Search</strong> is an efficient algorithm for finding a target value within a sorted array. 
                  It works by repeatedly dividing the search interval in half.
                </p>
                <p>
                  <strong>Time Complexity:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Worst Case: O(log n) - When the element is not present or appears at the end of the last search space</li>
                    <li>Average Case: O(log n)</li>
                    <li>Best Case: O(1) - When the element is present at the middle of the array</li>
                  </ul>
                </p>
                <p>
                  <strong>Space Complexity:</strong> O(1) - Only requires a constant amount of additional memory space
                </p>
                <p>
                  <strong>Key Characteristics:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Requires the array to be sorted</li>
                    <li>Much faster than linear search for large datasets</li>
                    <li>Divides the search space in half with each comparison</li>
                  </ul>
                </p>
                <p>
                  <strong>How it Works:</strong>
                  <ol className="list-decimal pl-5 mt-1">
                    <li>Compare the target value to the middle element</li>
                    <li>If they're equal, we've found the target</li>
                    <li>If the target is less than the middle, search the left half</li>
                    <li>If the target is greater than the middle, search the right half</li>
                    <li>Repeat until found or the search space is empty</li>
                  </ol>
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Array visualization - made wider */}
        <div className="flex flex-wrap gap-2 border rounded-md p-6 min-h-40 justify-center items-center">
          {array.map((value, index) => (
            <div
              key={index}
              className={`flex items-center justify-center w-14 h-14 border-2 font-bold transition-all duration-300 ${getBoxStyle(index)}`}
            >
              {value}
            </div>
          ))}
        </div>

        {/* Search info */}
        <div className="p-5 border rounded-md">
          {currentStep.completed ? (
            currentStep.found ? (
              <div className="text-center text-green-600 dark:text-green-400 font-bold">
                Found {searchValue} at index {currentStep.mid}!
              </div>
            ) : (
              <div className="text-center text-red-600 dark:text-red-400 font-bold">
                {searchValue} was not found in the array.
              </div>
            )
          ) : isSearching ? (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <span className="font-bold">Left</span>
                  <div className="mt-1 p-1 border rounded bg-gray-100 dark:bg-gray-800">
                    {currentStep.left}
                  </div>
                </div>
                <div className="text-center">
                  <span className="font-bold">Mid</span>
                  <div className="mt-1 p-1 border rounded bg-gray-100 dark:bg-gray-800">
                    {currentStep.mid}
                  </div>
                </div>
                <div className="text-center">
                  <span className="font-bold">Right</span>
                  <div className="mt-1 p-1 border rounded bg-gray-100 dark:bg-gray-800">
                    {currentStep.right}
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                {array[currentStep.mid] === searchValue ? (
                  <span className="text-green-600 dark:text-green-400">
                    Found! middle value ({array[currentStep.mid]}) is equal to search value ({searchValue})
                  </span>
                ) : array[currentStep.mid] < searchValue ? (
                  <span>
                    Middle value ({array[currentStep.mid]}) is less than search value ({searchValue}) - searching right half
                  </span>
                ) : (
                  <span>
                    Middle value ({array[currentStep.mid]}) is greater than search value ({searchValue}) - searching left half
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Click "Start Search" to begin searching for {searchValue}
            </div>
          )}
        </div>

        {/* Controls - expanded layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 p-5 border rounded-md">
            <h3 className="font-medium text-lg">Array Settings</h3>
            
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap">Size:</span>
              <Slider
                value={[arraySize]}
                min={5}
                max={20}
                step={1}
                onValueChange={(value) => {
                  if (!isSearching) {
                    setArraySize(value[0]);
                  }
                }}
                disabled={isSearching}
                className="flex-grow"
              />
              <span className="text-sm w-6">{arraySize}</span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={generateSortedArray} 
                disabled={isSearching}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw size={16} className="mr-2" /> New Array
              </Button>
              <Button 
                onClick={resetSearch} 
                disabled={!isSearching && !currentStep.completed}
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
                disabled={isSearching}
              />
              <Button 
                onClick={handleCustomArrayInput} 
                disabled={isSearching}
                variant="outline"
              >
                Use Custom Array (will be sorted)
              </Button>
            </div>
          </div>
          
          <div className="space-y-4 p-5 border rounded-md">
            <h3 className="font-medium text-lg">Search Controls</h3>
            
            <div className="flex items-center gap-2">
              <Input
                ref={searchInputRef}
                type="number"
                placeholder="Search value"
                value={searchValue}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    setSearchValue(value);
                  }
                }}
                disabled={isSearching}
                className="flex-grow"
              />
              <Button 
                onClick={handleSearchValueChange} 
                disabled={isSearching}
                variant="outline"
              >
                Set
              </Button>
            </div>
            
            <Button 
              onClick={toggleSearch} 
              disabled={currentStep.completed}
              className="w-full"
            >
              {isSearching ? (
                isPaused ? (
                  <><Play size={16} className="mr-2" /> Resume</>
                ) : (
                  <><Pause size={16} className="mr-2" /> Pause</>
                )
              ) : (
                <><Search size={16} className="mr-2" /> Start Search</>
              )}
            </Button>
            
            {/* Legend - updated colors */}
            <div className="flex flex-wrap gap-4 text-sm mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
                <span>Current Range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span>Middle Element</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Found Element</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-400 dark:bg-gray-700"></div>
                <span>Excluded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinarySearchVisualization;

{/* Code explanation */}
<div className="mt-8 border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
  <div className="font-semibold mb-2">Binary Search Code:</div>
  
  <div className="space-y-4">
    <div>
      <h3 className="text-sm font-semibold mb-2">JavaScript</h3>
      <pre className="text-xs overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
{`function binarySearch(sortedArr, target) {
  let left = 0;
  let right = sortedArr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (sortedArr[mid] === target) {
      return mid; // Element found
    }
    
    if (sortedArr[mid] < target) {
      left = mid + 1; // Look in right half
    } else {
      right = mid - 1; // Look in left half
    }
  }
  
  return -1; // Element not found
}`}
      </pre>
    </div>
    
    <div>
      <h3 className="text-sm font-semibold mb-2">Python</h3>
      <pre className="text-xs overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
{`def binary_search(sorted_arr, target):
    left = 0
    right = len(sorted_arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if sorted_arr[mid] == target:
            return mid  # Element found
        
        if sorted_arr[mid] < target:
            left = mid + 1  # Look in right half
        else:
            right = mid - 1  # Look in left half
            
    return -1  # Element not found`}
      </pre>
    </div>
    
    <div>
      <h3 className="text-sm font-semibold mb-2">C++</h3>
      <pre className="text-xs overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
{`int binarySearch(int arr[], int size, int target) {
    int left = 0;
    int right = size - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;  // Element found
        }
        
        if (arr[mid] < target) {
            left = mid + 1;  // Look in right half
        } else {
            right = mid - 1;  // Look in left half
        }
    }
    
    return -1;  // Element not found
}`}
      </pre>
    </div>
  </div>
</div>
