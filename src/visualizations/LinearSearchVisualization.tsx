
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { smoothlySizeArray, speedToDelay } from '@/utils/animationUtils';

type ArrayElement = {
  value: number;
  state: 'default' | 'current' | 'match' | 'checked';
};

interface LinearSearchVisualizationProps {
  initialSpeed: number;
  onOperationSelect: (operation: string) => void;
}

const LinearSearchVisualization: React.FC<LinearSearchVisualizationProps> = ({ 
  initialSpeed,
  onOperationSelect
}) => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [arraySize, setArraySize] = useState<number>(15);
  const [speed, setSpeed] = useState<number>(initialSpeed);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [codeLanguage, setCodeLanguage] = useState<string>('javascript');
  
  const searchingRef = useRef<boolean>(false);
  const animationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    generateRandomArrayData();
  }, [arraySize]);

  useEffect(() => {
    onOperationSelect('Generate Random Array');
  }, [onOperationSelect]);

  useEffect(() => {
    return () => {
      animationTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const generateRandomArrayData = () => {
    const newArray: ArrayElement[] = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 100) + 1,
        state: 'default'
      });
    }
    setArray(newArray);
    setResult("");
    setCurrentStep(-1);
    onOperationSelect('Generate Random Array');
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize) && newSize >= 5 && newSize <= 50) {
      smoothlySizeArray(arraySize, newSize, setArraySize);
    }
  };

  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
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
      setResult("");
      setCurrentStep(-1);
      onOperationSelect('Create Custom Array');
    }
  };

  const clearTimeouts = () => {
    animationTimeoutsRef.current.forEach(clearTimeout);
    animationTimeoutsRef.current = [];
  };

  const resetArrayStates = () => {
    setArray(prev => prev.map(item => ({ ...item, state: 'default' })));
  };

  const handleStop = () => {
    clearTimeouts();
    resetArrayStates();
    setIsSearching(false);
    searchingRef.current = false;
    setResult("");
    setCurrentStep(-1);
  };

  const delay = (ms: number) => {
    return new Promise<void>(resolve => {
      if (searchingRef.current) {
        const timeout = setTimeout(() => {
          resolve();
        }, ms);
        animationTimeoutsRef.current.push(timeout);
      } else {
        resolve();
      }
    });
  };

  const linearSearch = async () => {
    if (isSearching || !searchValue.trim()) return;
    
    const target = parseInt(searchValue.trim(), 10);
    if (isNaN(target)) {
      setResult("Please enter a valid number");
      return;
    }
    
    // Reset array states
    resetArrayStates();
    setCurrentStep(-1);
    setResult("");
    
    setIsSearching(true);
    searchingRef.current = true;
    
    const delayTime = speedToDelay(speed);
    onOperationSelect('Linear Search');
    
    try {
      let foundIndex = -1;
      
      for (let i = 0; i < array.length; i++) {
        if (!searchingRef.current) break;
        
        // Update current index
        setCurrentStep(i);
        
        // Highlight current element
        setArray(prevArray => {
          const newArray = [...prevArray];
          newArray[i] = { ...newArray[i], state: 'current' };
          return newArray;
        });
        
        await delay(delayTime);
        
        // Check if current element is the target
        if (array[i].value === target) {
          setArray(prevArray => {
            const newArray = [...prevArray];
            newArray[i] = { ...newArray[i], state: 'match' };
            return newArray;
          });
          
          foundIndex = i;
          setResult(`Found ${target} at index ${i}`);
          break;
        } else {
          // Mark as checked
          setArray(prevArray => {
            const newArray = [...prevArray];
            newArray[i] = { ...newArray[i], state: 'checked' };
            return newArray;
          });
        }
      }
      
      if (foundIndex === -1 && searchingRef.current) {
        setResult(`${target} not found in the array`);
      }
    } finally {
      setIsSearching(false);
      searchingRef.current = false;
    }
  };

  const getMaxValue = () => {
    return array.reduce((max, item) => Math.max(max, item.value), 0);
  };

  const maxValue = getMaxValue();

  // Code implementations
  const javascriptCode = `// Linear Search implementation in JavaScript
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    // Check if current element is the target
    if (arr[i] === target) {
      return i; // Return the index where target is found
    }
  }
  
  return -1; // Target not found
}

// Example usage
const array = [14, 7, 23, 5, 9, 32, 18];
const target = 9;
const result = linearSearch(array, target);

if (result !== -1) {
  console.log(\`Found \${target} at index \${result}\`);
} else {
  console.log(\`\${target} not found in the array\`);
}`;

  const pythonCode = `# Linear Search implementation in Python
def linear_search(arr, target):
    for i in range(len(arr)):
        # Check if current element is the target
        if arr[i] == target:
            return i  # Return the index where target is found
    
    return -1  # Target not found

# Example usage
array = [14, 7, 23, 5, 9, 32, 18]
target = 9
result = linear_search(array, target)

if result != -1:
    print(f"Found {target} at index {result}")
else:
    print(f"{target} not found in the array")`;

  const cppCode = `// Linear Search implementation in C++
#include <iostream>
#include <vector>

int linearSearch(const std::vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        // Check if current element is the target
        if (arr[i] == target) {
            return i; // Return the index where target is found
        }
    }
    
    return -1; // Target not found
}

int main() {
    std::vector<int> array = {14, 7, 23, 5, 9, 32, 18};
    int target = 9;
    int result = linearSearch(array, target);
    
    if (result != -1) {
        std::cout << "Found " << target << " at index " << result << std::endl;
    } else {
        std::cout << target << " not found in the array" << std::endl;
    }
    
    return 0;
}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="default" 
            onClick={generateRandomArrayData} 
            disabled={isSearching}
          >
            Random Array
          </Button>
          <Button 
            variant="default" 
            onClick={linearSearch} 
            disabled={isSearching || !searchValue.trim()}
          >
            Search
          </Button>
          {isSearching && (
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
              max={50}
              disabled={isSearching}
            />
            <span className="text-sm text-muted-foreground">Array Size</span>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <Input 
            placeholder="Search value" 
            value={searchValue} 
            onChange={handleSearchValueChange} 
            type="number"
            disabled={isSearching}
            className="w-32"
          />
          <div className="h-6 border-l mx-1"></div>
          <Input 
            placeholder="Enter numbers (comma separated)" 
            value={inputValue} 
            onChange={handleInputChange} 
            disabled={isSearching}
            className="flex-grow"
          />
          <Button 
            variant="outline" 
            onClick={handleInputSubmit} 
            disabled={isSearching || !inputValue.trim()}
          >
            Create
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3">
            {/* Array visualization */}
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(10, arraySize)}, 1fr)` }}>
              {array.map((item, index) => {
                let bgColor = 'bg-blue-100 text-blue-800 border-blue-200';
                
                switch(item.state) {
                  case 'current':
                    bgColor = 'bg-yellow-100 text-yellow-800 border-yellow-300';
                    break;
                  case 'match':
                    bgColor = 'bg-green-100 text-green-800 border-green-300';
                    break;
                  case 'checked':
                    bgColor = 'bg-gray-100 text-gray-600 border-gray-300';
                    break;
                  default:
                    bgColor = 'bg-blue-100 text-blue-800 border-blue-200';
                }
                
                return (
                  <div
                    key={index}
                    className={`p-3 rounded border-2 flex flex-col justify-center items-center ${bgColor} relative`}
                  >
                    <div className="font-semibold text-lg">{item.value}</div>
                    <div className="text-xs mt-1">[{index}]</div>
                    {currentStep === index && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold">
                        ↑
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Search result */}
            {result && (
              <div className={`mt-4 p-3 rounded ${result.includes('not found') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {result}
              </div>
            )}
          </div>
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
          disabled={isSearching}
          className="w-full"
        />
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

export default LinearSearchVisualization;
