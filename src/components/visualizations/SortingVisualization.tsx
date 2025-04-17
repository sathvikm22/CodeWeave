import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Play, RefreshCw, Trash2, PauseCircle } from 'lucide-react';

interface SortingVisualizationProps {
  algorithm: string;
  dataStructure: 'array' | 'linkedlist';
  speed: number;
  size: number;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
}

interface ArrayElement {
  value: number;
  state: 'default' | 'comparing' | 'sorted' | 'selected' | 'pivot';
}

interface LinkedListNode {
  value: number;
  state: 'default' | 'comparing' | 'sorted' | 'selected' | 'pivot';
  next: number | null;
}

interface TempMemory {
  value: number | null;
  label: string;
  active: boolean;
}

const SortingVisualization: React.FC<SortingVisualizationProps> = ({
  algorithm,
  dataStructure,
  speed,
  size,
  isRunning,
  setIsRunning
}) => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [linkedList, setLinkedList] = useState<LinkedListNode[]>([]);
  const [head, setHead] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [animationHistory, setAnimationHistory] = useState<any[]>([]);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [inputIndex, setInputIndex] = useState<string>('0');
  const [tempMemory, setTempMemory] = useState<TempMemory>({ value: null, label: 'temp', active: false });
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Calculate the animation speed based on user setting - slower for better visualization
  const animationSpeed = Math.max(200, 1000 - speed * 8);
  
  // Effect to handle initialization and cleanup
  useEffect(() => {
    if (!isInitialized) {
      randomizeData();
      setIsInitialized(true);
    }
    
    // Listen for reset events
    const handleReset = () => {
      stopAnimation();
      randomizeData();
    };
    
    // Listen for play/stop events
    const handlePlay = () => {
      runAnimation();
    };
    
    const handleStop = () => {
      stopAnimation();
    };
    
    window.addEventListener('reset-visualization', handleReset);
    window.addEventListener('start-visualization', handlePlay);
    window.addEventListener('stop-visualization', handleStop);
    
    return () => {
      window.removeEventListener('reset-visualization', handleReset);
      window.removeEventListener('start-visualization', handlePlay);
      window.removeEventListener('stop-visualization', handleStop);
      stopAnimation();
    };
  }, []);
  
  // Effect to reset and regenerate data when algorithm or data structure changes
  useEffect(() => {
    stopAnimation();
    setCurrentStep(0);
    setTotalSteps(0);
    setAnimationHistory([]);
    randomizeData();
  }, [algorithm, dataStructure, size]);
  
  const generateNewData = () => {
    // Reset animation state
    setCurrentStep(0);
    setTotalSteps(0);
    setAnimationHistory([]);
    setTempMemory({ value: null, label: 'temp', active: false });
    
    // Create empty array with placeholder values
    const newData = Array.from({ length: size }, () => ({
      value: 0,
      state: 'default' as const
    }));
    
    setArray(newData);
    
    // Generate linked list from the same data
    const newLinkedList: LinkedListNode[] = newData.map((item, index) => ({
      value: item.value,
      state: 'default',
      next: index < newData.length - 1 ? index + 1 : null
    }));
    
    setLinkedList(newLinkedList);
    setHead(newLinkedList.length > 0 ? 0 : null);
  };
  
  const randomizeData = () => {
    // Reset animation state
    setCurrentStep(0);
    setTotalSteps(0);
    setAnimationHistory([]);
    setTempMemory({ value: null, label: 'temp', active: false });
    
    const newData = Array.from({ length: size }, () => ({
      value: Math.floor(Math.random() * 95) + 5, // Values between 5-99
      state: 'default' as const
    }));
    
    setArray(newData);
    
    // Generate linked list from the same data
    const newLinkedList: LinkedListNode[] = newData.map((item, index) => ({
      value: item.value,
      state: 'default',
      next: index < newData.length - 1 ? index + 1 : null
    }));
    
    setLinkedList(newLinkedList);
    setHead(newLinkedList.length > 0 ? 0 : null);
  };
  
  const insertElement = () => {
    const value = parseInt(inputValue);
    const index = parseInt(inputIndex);
    
    if (isNaN(value)) {
      toast({
        title: "Invalid value",
        description: "Please enter a valid number"
      });
      return;
    }
    
    if (isNaN(index) || index < 0 || index >= size) {
      toast({
        title: "Invalid index",
        description: `Index must be between 0 and ${size - 1}`
      });
      return;
    }
    
    // Reset animation state if changed
    setCurrentStep(0);
    setTotalSteps(0);
    setAnimationHistory([]);
    
    if (dataStructure === 'array') {
      const newArray = [...array];
      newArray[index] = { value, state: 'default' };
      setArray(newArray);
    } else {
      const newLinkedList = [...linkedList];
      newLinkedList[index] = { ...newLinkedList[index], value, state: 'default' };
      setLinkedList(newLinkedList);
    }
    
    setInputValue('');
  };
  
  const clearData = () => {
    generateNewData();
  };
  
  const stopAnimation = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    setIsRunning(false);
  };
  
  const runAnimation = () => {
    if (isRunning) {
      stopAnimation();
      return;
    }
    
    if (animationHistory.length === 0) {
      // Generate animation steps if they don't exist
      const { steps, finalArray, finalLinkedList, finalHead } = generateAnimationSteps();
      
      if (steps.length === 0) {
        toast({
          title: "Already sorted",
          description: "The data is already in sorted order"
        });
        return;
      }
      
      setAnimationHistory(steps);
      setTotalSteps(steps.length);
    }
    
    // Reset to beginning if we were at the end
    if (currentStep >= animationHistory.length) {
      // Reset states for a new run
      setCurrentStep(0);
      if (dataStructure === 'array') {
        setArray(prevArray => prevArray.map(el => ({ ...el, state: 'default' })));
      } else {
        setLinkedList(prevList => prevList.map(node => ({ ...node, state: 'default' })));
      }
      setTempMemory({ value: null, label: 'temp', active: false });
    }
    
    setIsRunning(true);
    playNextStep();
  };
  
  const playNextStep = () => {
    if (currentStep >= animationHistory.length) {
      // Animation complete
      setIsRunning(false);
      toast({
        title: "Sorting complete",
        description: `${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} sort completed in ${animationHistory.length} steps`
      });
      return;
    }
    
    const step = animationHistory[currentStep];
    
    if (dataStructure === 'array') {
      setArray(step.array);
      setTempMemory(step.tempMemory || { value: null, label: 'temp', active: false });
    } else {
      setLinkedList(step.linkedList);
      setHead(step.head);
      setTempMemory(step.tempMemory || { value: null, label: 'temp', active: false });
    }
    
    setCurrentStep(prev => prev + 1);
    
    // Schedule next step
    animationTimeoutRef.current = setTimeout(playNextStep, animationSpeed);
  };
  
  const generateAnimationSteps = () => {
    // Changed from const to let to allow reassignment
    let steps: any[] = [];
    let workingArray = [...array];
    let workingLinkedList = [...linkedList];
    let workingHead = head;
    
    switch (algorithm) {
      case 'bubble':
        if (dataStructure === 'array') {
          ({ steps, finalArray: workingArray } = bubbleSort([...workingArray]));
        } else {
          ({ steps, finalLinkedList: workingLinkedList, finalHead: workingHead } = bubbleSortLinkedList([...workingLinkedList], workingHead));
        }
        break;
      case 'insertion':
        if (dataStructure === 'array') {
          ({ steps, finalArray: workingArray } = insertionSort([...workingArray]));
        } else {
          ({ steps, finalLinkedList: workingLinkedList, finalHead: workingHead } = insertionSortLinkedList([...workingLinkedList], workingHead));
        }
        break;
      case 'selection':
        if (dataStructure === 'array') {
          ({ steps, finalArray: workingArray } = selectionSort([...workingArray]));
        } else {
          ({ steps, finalLinkedList: workingLinkedList, finalHead: workingHead } = selectionSortLinkedList([...workingLinkedList], workingHead));
        }
        break;
      case 'merge':
        if (dataStructure === 'array') {
          ({ steps, finalArray: workingArray } = mergeSort([...workingArray]));
        } else {
          toast({
            title: "Limited support",
            description: "Merge sort visualization for linked lists is simplified"
          });
          ({ steps, finalLinkedList: workingLinkedList, finalHead: workingHead } = mergeSortLinkedList([...workingLinkedList], workingHead));
        }
        break;
      case 'quick':
        if (dataStructure === 'array') {
          ({ steps, finalArray: workingArray } = quickSort([...workingArray]));
        } else {
          toast({
            title: "Limited support",
            description: "Quick sort visualization for linked lists is simplified"
          });
          ({ steps, finalLinkedList: workingLinkedList, finalHead: workingHead } = quickSortLinkedList([...workingLinkedList], workingHead));
        }
        break;
    }
    
    return { steps, finalArray: workingArray, finalLinkedList: workingLinkedList, finalHead: workingHead };
  };
  
  // Bubble Sort Implementation for Arrays
  const bubbleSort = (arr: ArrayElement[]) => {
    // Changed from const to let to allow reassignment
    let steps: { array: ArrayElement[], tempMemory: TempMemory }[] = [];
    const n = arr.length;
    let swapped: boolean;
    
    // Clone the array to avoid modifying the original
    let workingArray = [...arr];
    
    for (let i = 0; i < n; i++) {
      swapped = false;
      
      for (let j = 0; j < n - i - 1; j++) {
        // Mark elements being compared
        workingArray = [...workingArray];
        workingArray[j].state = 'comparing';
        workingArray[j + 1].state = 'comparing';
        steps.push({ 
          array: [...workingArray],
          tempMemory: { value: null, label: 'temp', active: false }
        });
        
        if (workingArray[j].value > workingArray[j + 1].value) {
          // Store the value in temp memory before swap
          const tempValue = workingArray[j].value;
          steps.push({ 
            array: [...workingArray],
            tempMemory: { value: tempValue, label: 'temp', active: true }
          });
          
          // Swap the elements
          [workingArray[j], workingArray[j + 1]] = [workingArray[j + 1], workingArray[j]];
          swapped = true;
          
          // Record the swap
          steps.push({ 
            array: [...workingArray],
            tempMemory: { value: tempValue, label: 'temp', active: true }
          });
          
          // Clear temp memory
          steps.push({ 
            array: [...workingArray],
            tempMemory: { value: null, label: 'temp', active: false }
          });
        }
        
        // Reset comparison state
        workingArray = [...workingArray];
        workingArray[j].state = 'default';
        workingArray[j + 1].state = 'default';
        
        // Mark sorted elements
        if (j === n - i - 2) {
          workingArray[j + 1].state = 'sorted';
        }
      }
      
      // If no swapping occurred in this pass, the array is sorted
      if (!swapped) {
        // Mark all remaining elements as sorted
        for (let k = 0; k < n - i; k++) {
          workingArray[k].state = 'sorted';
        }
        steps.push({ 
          array: [...workingArray],
          tempMemory: { value: null, label: 'temp', active: false }
        });
        break;
      }
    }
    
    return { steps, finalArray: workingArray };
  };
  
  // Bubble Sort Implementation for Linked Lists
  const bubbleSortLinkedList = (list: LinkedListNode[], headIndex: number | null) => {
    // Changed from const to let to allow reassignment
    let steps: { linkedList: LinkedListNode[], head: number | null, tempMemory: TempMemory }[] = [];
    
    if (headIndex === null) {
      return { steps, finalLinkedList: list, finalHead: headIndex };
    }
    
    let workingList = [...list];
    let swapped: boolean;
    let i: number;
    let current: number | null;
    let nextNode: number | null;
    
    for (i = 0; i < workingList.length; i++) {
      current = headIndex;
      swapped = false;
      
      while (current !== null && workingList[current].next !== null) {
        nextNode = workingList[current].next;
        
        // Mark elements being compared
        workingList = [...workingList];
        workingList[current].state = 'comparing';
        workingList[nextNode].state = 'comparing';
        steps.push({ 
          linkedList: [...workingList], 
          head: headIndex,
          tempMemory: { value: null, label: 'temp', active: false }
        });
        
        if (workingList[current].value > workingList[nextNode].value) {
          // Store the value in temp memory
          const temp = workingList[current].value;
          steps.push({ 
            linkedList: [...workingList], 
            head: headIndex,
            tempMemory: { value: temp, label: 'temp', active: true }
          });
          
          // Swap values (in linked list, we typically swap values, not nodes)
          workingList[current].value = workingList[nextNode].value;
          workingList[nextNode].value = temp;
          swapped = true;
          
          // Record the swap
          steps.push({ 
            linkedList: [...workingList], 
            head: headIndex,
            tempMemory: { value: null, label: 'temp', active: false }
          });
        }
        
        // Reset comparison state
        workingList = [...workingList];
        workingList[current].state = 'default';
        if (nextNode !== null) {
          workingList[nextNode].state = 'default';
        }
        
        current = nextNode;
      }
      
      // Mark the last element as sorted after each pass
      if (current !== null) {
        workingList[current].state = 'sorted';
      }
      
      // If no swapping occurred in this pass, the list is sorted
      if (!swapped) {
        // Mark all remaining elements as sorted
        current = headIndex;
        while (current !== null) {
          workingList[current].state = 'sorted';
          current = workingList[current].next;
        }
        steps.push({ 
          linkedList: [...workingList], 
          head: headIndex,
          tempMemory: { value: null, label: 'temp', active: false }
        });
        break;
      }
    }
    
    return { steps, finalLinkedList: workingList, finalHead: headIndex };
  };
  
  // Insertion Sort Implementation for Arrays
  const insertionSort = (arr: ArrayElement[]) => {
    // Changed from const to let to allow reassignment
    let steps: { array: ArrayElement[], tempMemory: TempMemory }[] = [];
    const n = arr.length;
    
    // Clone the array to avoid modifying the original
    let workingArray = [...arr];
    
    // Mark the first element as sorted
    workingArray[0].state = 'sorted';
    steps.push({ 
      array: [...workingArray],
      tempMemory: { value: null, label: 'temp', active: false }
    });
    
    for (let i = 1; i < n; i++) {
      // Select the element to be inserted
      workingArray = [...workingArray];
      workingArray[i].state = 'selected';
      steps.push({ 
        array: [...workingArray],
        tempMemory: { value: null, label: 'temp', active: false }
      });
      
      // Store the key value in temp
      const key = { ...workingArray[i] };
      steps.push({ 
        array: [...workingArray],
        tempMemory: { value: key.value, label: 'key', active: true }
      });
      
      let j = i - 1;
      
      /* Move elements that are greater than key one position ahead */
      while (j >= 0 && workingArray[j].value > key.value) {
        // Mark the element being compared
        workingArray = [...workingArray];
        workingArray[j].state = 'comparing';
        steps.push({ 
          array: [...workingArray],
          tempMemory: { value: key.value, label: 'key', active: true }
        });
        
        // Move the element
        workingArray = [...workingArray];
        workingArray[j + 1] = { ...workingArray[j] };
        workingArray[j].state = 'default';
        steps.push({ 
          array: [...workingArray],
          tempMemory: { value: key.value, label: 'key', active: true }
        });
        
        j--;
      }
      
      // Insert the selected element from temp storage
      workingArray = [...workingArray];
      workingArray[j + 1] = { ...key, state: 'sorted' };
      steps.push({ 
        array: [...workingArray],
        tempMemory: { value: null, label: 'key', active: false }
      });
      
      // Mark all elements up to the current position as sorted
      for (let k = 0; k <= i; k++) {
        workingArray[k].state = 'sorted';
      }
      steps.push({ 
        array: [...workingArray],
        tempMemory: { value: null, label: 'key', active: false }
      });
    }
    
    return { steps, finalArray: workingArray };
  };
  
  // Insertion Sort Implementation for Linked Lists
  const insertionSortLinkedList = (list: LinkedListNode[], headIndex: number | null) => {
    // Changed from const to let to allow reassignment
    let steps: { linkedList: LinkedListNode[], head: number | null, tempMemory: TempMemory }[] = [];
    
    if (headIndex === null) {
      return { steps, finalLinkedList: list, finalHead: headIndex };
    }
    
    let workingList = [...list];
    let sortedHead: number | null = headIndex;
    
    // Mark the first node as sorted
    workingList[sortedHead].state = 'sorted';
    steps.push({ 
      linkedList: [...workingList], 
      head: sortedHead,
      tempMemory: { value: null, label: 'key', active: false }
    });
    
    let current = workingList[sortedHead].next;
    
    while (current !== null) {
      // Mark current node as selected
      workingList = [...workingList];
      workingList[current].state = 'selected';
      steps.push({ 
        linkedList: [...workingList], 
        head: sortedHead,
        tempMemory: { value: null, label: 'key', active: false }
      });
      
      // Store the current value in temp memory
      const currentValue = workingList[current].value;
      steps.push({ 
        linkedList: [...workingList], 
        head: sortedHead,
        tempMemory: { value: currentValue, label: 'key', active: true }
      });
      
      // Special case: if current should be the new head
      if (currentValue < workingList[sortedHead].value) {
        // Move current to the beginning
        workingList = [...workingList];
        workingList[current].value = workingList[sortedHead].value;
        workingList[sortedHead].value = currentValue;
        workingList[current].state = 'default';
        workingList[sortedHead].state = 'comparing';
        steps.push({ 
          linkedList: [...workingList], 
          head: sortedHead,
          tempMemory: { value: null, label: 'key', active: false }
        });
        
        workingList = [...workingList];
        workingList[sortedHead].state = 'sorted';
        steps.push({ 
          linkedList: [...workingList], 
          head: sortedHead,
          tempMemory: { value: null, label: 'key', active: false }
        });
      } else {
        // Find position to insert
        let temp = sortedHead;
        
        while (workingList[temp].next !== null && 
               workingList[workingList[temp].next].value < currentValue) {
          temp = workingList[temp].next;
          
          // Mark as comparing
          workingList = [...workingList];
          workingList[temp].state = 'comparing';
          steps.push({ 
            linkedList: [...workingList], 
            head: sortedHead,
            tempMemory: { value: currentValue, label: 'key', active: true }
          });
          
          workingList = [...workingList];
          workingList[temp].state = 'sorted';
          steps.push({ 
            linkedList: [...workingList], 
            head: sortedHead,
            tempMemory: { value: currentValue, label: 'key', active: true }
          });
        }
        
        // Shift values instead of nodes
        let pos = workingList[temp].next;
        
        if (pos !== current) {
          let currentPos = pos;
          
          // Shift values between pos and current
          while (currentPos !== current) {
            workingList = [...workingList];
            if (currentPos !== null) {
              workingList[currentPos].state = 'comparing';
            }
            steps.push({ 
              linkedList: [...workingList], 
              head: sortedHead,
              tempMemory: { value: currentValue, label: 'key', active: true }
            });
            
            currentPos = workingList[currentPos!].next;
          }
          
          workingList = [...workingList];
          
          // Shift values
          while (pos !== current) {
            const nextPos = workingList[pos!].next;
            workingList[pos!].value = workingList[nextPos!].value;
            pos = nextPos;
          }
          
          workingList[current].value = currentValue;
          steps.push({ 
            linkedList: [...workingList], 
            head: sortedHead,
            tempMemory: { value: null, label: 'key', active: false }
          });
        }
      }
      
      // Mark current as sorted and move to next
      workingList = [...workingList];
      workingList[current].state = 'sorted';
      current = workingList[current].next;
      steps.push({ 
        linkedList: [...workingList], 
        head: sortedHead,
        tempMemory: { value: null, label: 'key', active: false }
      });
    }
    
    return { steps, finalLinkedList: workingList, finalHead: sortedHead };
  };
  
  // Selection Sort Implementation for Arrays
  const selectionSort = (arr: ArrayElement[]) => {
    // Changed from const to let to allow reassignment
    let steps: { array: ArrayElement[], tempMemory: TempMemory }[] = [];
    const n = arr.length;
    
    // Clone the array to avoid modifying the original
    let workingArray = [...arr];
    
    for (let i = 0; i < n - 1; i++) {
      // Find the minimum element in the unsorted part
      let minIndex = i;
      workingArray = [...workingArray];
      workingArray[minIndex].state = 'selected';
      steps.push({ 
        array: [...workingArray],
        tempMemory: { value: workingArray[minIndex].value, label: 'min', active: true }
      });
      
      for (let j = i + 1; j < n; j++) {
        // Mark element being compared
        workingArray = [...workingArray];
        workingArray[j].state = 'comparing';
        steps.push({ 
          array: [...workingArray],
          tempMemory: { value: workingArray[minIndex].value, label: 'min', active: true }
        });
        
        if (workingArray[j].value < workingArray[minIndex].value) {
          // Reset previous minimum
          workingArray = [...workingArray];
          workingArray[minIndex].state = 'default';
          
          // Update minimum index
          minIndex = j;
          workingArray[minIndex].state = 'selected';
          steps.push({ 
            array: [...workingArray],
            tempMemory: { value: workingArray[minIndex].value, label: 'min', active: true }
          });
        } else {
          // Reset comparison state if not minimum
          workingArray = [...workingArray];
          workingArray[j].state = 'default';
          steps.push({ 
            array: [...workingArray],
            tempMemory: { value: workingArray[minIndex].value, label: 'min', active: true }
          });
        }
      }
      
      // Swap the minimum element with the first element of the unsorted part
      if (minIndex !== i) {
        workingArray = [...workingArray];
        // Store temp for the swap
        const temp = workingArray[i].value;
        steps.push({ 
          array: [...workingArray],
          tempMemory: { value: temp, label: 'temp', active: true }
        });
        
        [workingArray[i], workingArray[minIndex]] = [workingArray[minIndex], workingArray[i]];
        workingArray[minIndex].state = 'default';
        steps.push({ 
          array: [...workingArray],
          tempMemory: { value: temp, label: 'temp', active: true }
        });
      }
      
      // Mark the element as sorted
      workingArray = [...workingArray];
      workingArray[i].state = 'sorted';
      steps.push({ 
        array: [...workingArray],
        tempMemory: { value: null, label: 'min', active: false }
      });
    }
    
    // Mark the last element as sorted
    workingArray = [...workingArray];
    workingArray[n - 1].state = 'sorted';
    steps.push({ 
      array: [...workingArray],
      tempMemory: { value: null, label: 'min', active: false }
    });
    
    return { steps, finalArray: workingArray };
  };
  
  // Selection Sort Implementation for Linked Lists
  const selectionSortLinkedList = (list: LinkedListNode[], headIndex: number | null) => {
    // Changed from const to let to allow reassignment
    let steps: { linkedList: LinkedListNode[], head: number | null, tempMemory: TempMemory }[] = [];
    
    if (headIndex === null) {
      return { steps, finalLinkedList: list, finalHead: headIndex };
    }
    
    let workingList = [...list];
    let current = headIndex;
    
    while (current !== null) {
      let minIndex = current;
      let temp = workingList[current].next;
      
      // Mark current as selected
      workingList = [...workingList];
      workingList[minIndex].state = 'selected';
      steps.push({ 
        linkedList: [...workingList], 
        head: headIndex,
        tempMemory: { value: workingList[minIndex].value, label: 'min', active: true }
      });
      
      // Find minimum in the unsorted part
      while (temp !== null) {
        // Mark as comparing
        workingList = [...workingList];
        workingList[temp].state = 'comparing';
        steps.push({ 
          linkedList: [...workingList], 
          head: headIndex,
          tempMemory: { value: workingList[minIndex].value, label: 'min', active: true }
        });
        
        if (workingList[temp].value < workingList[minIndex].value) {
          // Reset previous minimum state
          workingList = [...workingList];
          workingList[minIndex].state = 'default';
          
          // Update minimum
          minIndex = temp;
          workingList[minIndex].state = 'selected';
          steps.push({ 
            linkedList: [...workingList], 
            head: headIndex,
            tempMemory: { value: workingList[minIndex].value, label: 'min', active: true }
          });
        } else {
          // Reset comparison
          workingList = [...workingList];
          workingList[temp].state = 'default';
          steps.push({ 
            linkedList: [...workingList], 
            head: headIndex,
            tempMemory: { value: workingList[minIndex].value, label: 'min', active: true }
          });
        }
        
        temp = workingList[temp].next;
      }
      
      // Swap values if needed
      if (minIndex !== current) {
        workingList = [...workingList];
        const tempValue = workingList[current].value;
        steps.push({ 
          linkedList: [...workingList], 
          head: headIndex,
          tempMemory: { value: tempValue, label: 'temp', active: true }
        });
        
        workingList[current].value = workingList[minIndex].value;
        workingList[minIndex].value = tempValue;
        workingList[minIndex].state = 'default';
        steps.push({ 
          linkedList: [...workingList], 
          head: headIndex,
          tempMemory: { value: null, label: 'temp', active: false }
        });
      }
      
      // Mark as sorted and move to next
      workingList = [...workingList];
      workingList[current].state = 'sorted';
      current = workingList[current].next;
      steps.push({ 
        linkedList: [...workingList], 
        head: headIndex,
        tempMemory: { value: null, label: 'min', active: false }
      });
    }
    
    return { steps, finalLinkedList: workingList, finalHead: headIndex };
  };
  
  // Merge Sort helper function
  const merge = (workingArray: ArrayElement[], left: number, mid: number, right: number, steps: any[]) => {
    const temp: ArrayElement[] = Array(right - left).fill({ value: 0, state: 'default' });
    let i = left;
    let j = mid;
    let k = 0;
    
    while (i < mid && j < right) {
      // Compare elements from both halves
      workingArray[i].state = 'comparing';
      workingArray[j].state = 'comparing';
      steps.push({ 
        array: [...workingArray],
        tempMemory: { value: null, label: 'temp', active: false }
      });
      
      if (workingArray[i].value <= workingArray[j].value) {
        temp[k] = { ...workingArray[i], state: 'default' };
        steps.push({ 
          array: [...workingArray],
          tempMemory: { value: workingArray[i].value, label: 'copy', active: true }
        });
        i++;
      } else {
        temp[k] = { ...workingArray[j], state: 'default' };
        steps.push({ 
          array: [...workingArray],
          tempMemory: { value: workingArray[j].value, label: 'copy', active: true }
        });
        j++;
      }
      k++;
    }
    
    // Copy remaining elements
    while (i < mid) {
      workingArray[i].state = 'comparing';
      steps.push({ 
        array: [...workingArray],
        tempMemory: { value: null, label: 'temp', active: false }
      });
      
      temp[k] = { ...workingArray[i], state: 'default' };
      steps.push({ 
        array: [...workingArray],
        tempMemory: { value: workingArray[i].value, label: 'copy', active: true }
      });
      i++;
      k++;
    }
    
    while (j < right) {
      workingArray[j].state = 'comparing';
      steps.push({ 
        array: [...workingArray],
        tempMemory: { value: null, label: 'temp', active: false }
      });
      temp[k] = { ...workingArray[j], state: 'default' };
      steps.push({ 
        array: [...workingArray],
        tempMemory: { value: workingArray[j].value, label: 'copy', active: true }
      });
      j++;
      k++;
    }
    // Copy temp back to workingArray
    for (let idx = left; idx < right; idx++) {
      workingArray[idx] = { ...temp[idx], state: 'default' };
      steps.push({ 
        array: [...workingArray],
        tempMemory: { value: temp[idx].value, label: 'write', active: true }
      });
    }
  };

// Add missing closing brackets for the component and export
};

export default SortingVisualization;
