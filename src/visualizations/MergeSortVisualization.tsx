
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { smoothlySizeArray, speedToDelay, generateRandomArray } from '@/utils/animationUtils';

// Define basic types
type ArrayElement = {
  value: number;
  state: 'default' | 'comparing' | 'sorted' | 'current' | 'auxiliary';
};

interface MergeSortVisualizationProps {
  initialSpeed: number;
  onOperationSelect: (operation: string) => void;
}

const MergeSortVisualization: React.FC<MergeSortVisualizationProps> = ({ 
  initialSpeed, 
  onOperationSelect 
}) => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [arraySize, setArraySize] = useState<number>(20);
  const [speed, setSpeed] = useState<number>(initialSpeed);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [currentOperation, setCurrentOperation] = useState<string>("");
  const [auxArray, setAuxArray] = useState<ArrayElement[]>([]);
  const [codeLanguage, setCodeLanguage] = useState<string>('javascript');
  
  const sortingRef = useRef<boolean>(false);
  const pausedRef = useRef<boolean>(false);
  const animationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Generate random array when component mounts or arraySize changes
  useEffect(() => {
    generateRandomArrayData();
  }, [arraySize]);

  useEffect(() => {
    onOperationSelect('Generate Random Array');
  }, [onOperationSelect]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      animationTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const generateRandomArrayData = () => {
    const randomArray = generateRandomArray(arraySize, 5, 100);
    setArray(randomArray.map(value => ({ value, state: 'default' })));
    setCurrentOperation('Generated random array');
    onOperationSelect('Generate Random Array');
    setAuxArray([]);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize) && newSize >= 5 && newSize <= 100) {
      smoothlySizeArray(arraySize, newSize, setArraySize);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    const values = inputValue
      .split(',')
      .map(val => parseInt(val.trim(), 10))
      .filter(val => !isNaN(val));
    
    if (values.length > 0) {
      setArraySize(values.length);
      setArray(values.map(value => ({ value, state: 'default' })));
      setCurrentOperation('Custom array created');
      onOperationSelect('Create Custom Array');
      setAuxArray([]);
    }
  };

  const clearTimeouts = () => {
    animationTimeoutsRef.current.forEach(clearTimeout);
    animationTimeoutsRef.current = [];
  };

  const resetArrayStates = () => {
    setArray(prev => prev.map(item => ({ ...item, state: 'default' })));
    setAuxArray([]);
  };

  const handleStop = () => {
    clearTimeouts();
    resetArrayStates();
    setIsSorting(false);
    sortingRef.current = false;
    pausedRef.current = false;
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    pausedRef.current = !pausedRef.current;
  };

  const delay = (ms: number) => {
    return new Promise<void>(resolve => {
      if (sortingRef.current) {
        const timeout = setTimeout(() => {
          resolve();
        }, ms);
        animationTimeoutsRef.current.push(timeout);
      } else {
        resolve();
      }
    });
  };

  const waitWhilePaused = async () => {
    return new Promise<void>(resolve => {
      const checkPaused = () => {
        if (!pausedRef.current || !sortingRef.current) {
          resolve();
        } else {
          setTimeout(checkPaused, 100);
        }
      };
      checkPaused();
    });
  };

  const updateArrayElement = (index: number, value: number, state: ArrayElement['state']) => {
    setArray(prevArray => {
      const newArray = [...prevArray];
      newArray[index] = { value, state };
      return newArray;
    });
  };

  const mergeSort = async () => {
    if (isSorting) return;
    
    setIsSorting(true);
    sortingRef.current = true;
    pausedRef.current = false;
    setIsPaused(false);
    setAuxArray([]);
    
    const delayTime = speedToDelay(speed);
    setCurrentOperation('Starting Merge Sort');
    onOperationSelect('Merge Sort');
    
    try {
      await mergeSortHelper(0, array.length - 1, delayTime);
      
      // Final pass to mark all elements as sorted
      if (sortingRef.current) {
        for (let i = 0; i < array.length; i++) {
          updateArrayElement(i, array[i].value, 'sorted');
          await delay(delayTime / 4);
        }
        setCurrentOperation('Array sorted successfully!');
      }
    } catch (error) {
      console.error('Sorting stopped:', error);
    } finally {
      setIsSorting(false);
      sortingRef.current = false;
    }
  };

  const mergeSortHelper = async (left: number, right: number, delayTime: number) => {
    if (!sortingRef.current) return;
    await waitWhilePaused();
    
    if (left >= right) return;
    
    const mid = Math.floor((left + right) / 2);
    
    setCurrentOperation(`Dividing array from index ${left} to ${right}`);
    
    // Recursively sort left and right halves
    await mergeSortHelper(left, mid, delayTime);
    await mergeSortHelper(mid + 1, right, delayTime);
    
    // Merge the sorted halves
    await merge(left, mid, right, delayTime);
  };

  const merge = async (left: number, mid: number, right: number, delayTime: number) => {
    if (!sortingRef.current) return;
    await waitWhilePaused();
    
    setCurrentOperation(`Merging subarrays [${left}...${mid}] and [${mid+1}...${right}]`);
    
    // Create auxiliary arrays
    const leftSize = mid - left + 1;
    const rightSize = right - mid;
    
    const leftArray: ArrayElement[] = [];
    const rightArray: ArrayElement[] = [];
    
    // Copy data to temp arrays
    for (let i = 0; i < leftSize; i++) {
      leftArray.push({ 
        value: array[left + i].value, 
        state: 'auxiliary' 
      });
    }
    
    for (let j = 0; j < rightSize; j++) {
      rightArray.push({ 
        value: array[mid + 1 + j].value, 
        state: 'auxiliary' 
      });
    }
    
    // Update auxiliary array visualization
    setAuxArray([...leftArray, ...rightArray]);
    
    // Merge the temp arrays back
    let i = 0, j = 0, k = left;
    
    while (i < leftSize && j < rightSize) {
      await waitWhilePaused();
      if (!sortingRef.current) return;
      
      // Highlight elements being compared
      const leftIdx = left + i;
      const rightIdx = mid + 1 + j;
      
      updateArrayElement(leftIdx, array[leftIdx].value, 'comparing');
      updateArrayElement(rightIdx, array[rightIdx].value, 'comparing');
      
      await delay(delayTime);
      
      if (leftArray[i].value <= rightArray[j].value) {
        updateArrayElement(k, leftArray[i].value, 'current');
        await delay(delayTime);
        i++;
      } else {
        updateArrayElement(k, rightArray[j].value, 'current');
        await delay(delayTime);
        j++;
      }
      
      k++;
    }
    
    // Copy remaining elements
    while (i < leftSize) {
      if (!sortingRef.current) return;
      await waitWhilePaused();
      
      updateArrayElement(k, leftArray[i].value, 'current');
      await delay(delayTime);
      i++;
      k++;
    }
    
    while (j < rightSize) {
      if (!sortingRef.current) return;
      await waitWhilePaused();
      
      updateArrayElement(k, rightArray[j].value, 'current');
      await delay(delayTime);
      j++;
      k++;
    }
    
    // Mark the current section as sorted
    for (let i = left; i <= right; i++) {
      updateArrayElement(i, array[i].value, 'sorted');
      await delay(delayTime / 4);
    }
    
    // Clear auxiliary array after this merge is complete
    setAuxArray([]);
  };

  const getMaxValue = () => {
    return array.reduce((max, item) => Math.max(max, item.value), 0);
  };

  const maxValue = getMaxValue();

  const javascriptCode = `// Merge Sort implementation in JavaScript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  return merge(
    mergeSort(left),
    mergeSort(right)
  );
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements and merge
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  // Add remaining elements
  return result
    .concat(left.slice(leftIndex))
    .concat(right.slice(rightIndex));
}

// Example usage
const array = [38, 27, 43, 3, 9, 82, 10];
console.log(mergeSort(array)); // [3, 9, 10, 27, 38, 43, 82]`;

  const pythonCode = `# Merge Sort implementation in Python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]
    
    # Recursive calls
    left = merge_sort(left)
    right = merge_sort(right)
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    # Compare elements from both halves
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Add remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Example usage
array = [38, 27, 43, 3, 9, 82, 10]
sorted_array = merge_sort(array)
print(sorted_array)  # [3, 9, 10, 27, 38, 43, 82]`;

  const cppCode = `// Merge Sort implementation in C++
#include <iostream>
#include <vector>

void merge(std::vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    // Create temporary arrays
    std::vector<int> L(n1), R(n2);
    
    // Copy data to temp arrays
    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];
    
    // Merge the temp arrays back
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    // Copy the remaining elements
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(std::vector<int>& arr, int left, int right) {
    if (left >= right) return;
    
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

int main() {
    std::vector<int> arr = {38, 27, 43, 3, 9, 82, 10};
    
    mergeSort(arr, 0, arr.size() - 1);
    
    std::cout << "Sorted array: ";
    for (int num : arr)
        std::cout << num << " ";
    
    return 0;
}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="default" 
            onClick={generateRandomArrayData} 
            disabled={isSorting}
          >
            Random Array
          </Button>
          <Button 
            variant="default" 
            onClick={mergeSort} 
            disabled={isSorting && !isPaused}
          >
            Sort
          </Button>
          {isSorting && (
            <Button 
              variant={isPaused ? "outline" : "secondary"} 
              onClick={handlePause}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          )}
          {isSorting && (
            <Button 
              variant="destructive" 
              onClick={handleStop}
            >
              Stop
            </Button>
          )}
          <div className="flex space-x-2 items-center flex-grow">
            <Input 
              type="number" 
              value={arraySize} 
              onChange={handleSizeChange} 
              className="w-20" 
              min={5} 
              max={100}
              disabled={isSorting}
            />
            <span className="text-sm text-muted-foreground">Array Size</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Input 
            placeholder="Enter numbers (comma separated)" 
            value={inputValue} 
            onChange={handleInputChange} 
            disabled={isSorting}
            className="flex-grow"
          />
          <Button 
            variant="outline" 
            onClick={handleInputSubmit} 
            disabled={isSorting || !inputValue.trim()}
          >
            Create
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-end h-64 gap-1 relative">
            {array.map((item, index) => {
              const height = `${(item.value / maxValue) * 100}%`;
              let bgColor = 'bg-blue-400';
              
              switch(item.state) {
                case 'comparing':
                  bgColor = 'bg-amber-400';
                  break;
                case 'sorted':
                  bgColor = 'bg-green-500';
                  break;
                case 'current':
                  bgColor = 'bg-purple-500';
                  break;
                default:
                  bgColor = 'bg-blue-400';
              }
              
              return (
                <div
                  key={index}
                  className={`flex-1 transition-all rounded-t-md ${bgColor} relative group`}
                  style={{ height }}
                >
                  {arraySize <= 30 && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-white font-semibold">
                      {item.value}
                    </span>
                  )}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs pointer-events-none transition-opacity">
                    {item.value}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Auxiliary array visualization */}
          {auxArray.length > 0 && (
            <div className="flex items-end h-16 gap-1 mt-4 border-t pt-4">
              <div className="text-sm font-medium mr-2">Auxiliary:</div>
              {auxArray.map((item, index) => {
                const height = `${(item.value / maxValue) * 100}%`;
                return (
                  <div
                    key={index}
                    className="flex-1 bg-gray-300 rounded-t-md relative group"
                    style={{ height: `${(item.value / maxValue) * 80}%` }}
                  >
                    {arraySize <= 30 && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs">
                        {item.value}
                      </span>
                    )}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs pointer-events-none transition-opacity">
                      {item.value}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Animation Speed: {speed}%</div>
        <Slider
          value={[speed]}
          min={10}
          max={100}
          step={5}
          onValueChange={values => setSpeed(values[0])}
          disabled={isSorting && !isPaused}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-semibold">Current Operation:</div>
        <div className="p-2 bg-muted rounded-md text-sm">
          {currentOperation || 'No operation in progress'}
        </div>
      </div>
      
      {/* Code implementation section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Implementation:</span>
          <div className="flex border rounded-md overflow-hidden">
            <button 
              className={`px-3 py-1 text-xs ${codeLanguage === 'javascript' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
              onClick={() => setCodeLanguage('javascript')}
            >
              JavaScript
            </button>
            <button 
              className={`px-3 py-1 text-xs ${codeLanguage === 'python' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
              onClick={() => setCodeLanguage('python')}
            >
              Python
            </button>
            <button 
              className={`px-3 py-1 text-xs ${codeLanguage === 'cpp' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
              onClick={() => setCodeLanguage('cpp')}
            >
              C++
            </button>
          </div>
        </div>
        
        <div className="bg-zinc-900 rounded-md p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap">
            {codeLanguage === 'javascript' && javascriptCode}
            {codeLanguage === 'python' && pythonCode}
            {codeLanguage === 'cpp' && cppCode}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MergeSortVisualization;
