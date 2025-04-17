
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SortingCodeDisplayProps {
  algorithm: string;
  language: 'javascript' | 'python' | 'cpp';
}

const SortingCodeDisplay: React.FC<SortingCodeDisplayProps> = ({
  algorithm,
  language
}) => {
  // Get the code implementation based on algorithm and language
  const getCode = () => {
    const code = algorithms[algorithm]?.[language] || "// Code not available";
    return code;
  };
  
  // Format the code with syntax highlighting
  const formatCode = (code: string) => {
    // Simple formatting for display
    return code.split('\n').map((line, index) => (
      <div key={index} className="flex">
        <span className="inline-block w-8 text-right text-muted-foreground mr-4">{index + 1}</span>
        <span>{line}</span>
      </div>
    ));
  };
  
  return (
    <div className="bg-muted rounded-md p-4 overflow-auto max-h-[450px]">
      <pre className="text-sm font-mono">
        {formatCode(getCode())}
      </pre>
    </div>
  );
};

// Algorithm implementations
const algorithms: Record<string, Record<string, string>> = {
  bubble: {
    javascript: `function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap them if they are in wrong order
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // If no swapping occurred in this pass, array is sorted
    if (!swapped) break;
  }
  
  return arr;
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n):
        swapped = False
        
        for j in range(0, n - i - 1):
            # Compare adjacent elements
            if arr[j] > arr[j + 1]:
                # Swap them if they are in wrong order
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # If no swapping occurred in this pass, array is sorted
        if not swapped:
            break
    
    return arr`,
    cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        bool swapped = false;
        
        for (int j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap them if they are in wrong order
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        
        // If no swapping occurred in this pass, array is sorted
        if (!swapped) break;
    }
}`
  },
  
  insertion: {
    javascript: `function insertionSort(arr) {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    // Element to be inserted into sorted part
    const key = arr[i];
    let j = i - 1;
    
    /* Move elements greater than key one position ahead */
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Insert the key at its correct position
    arr[j + 1] = key;
  }
  
  return arr;
}`,
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        # Element to be inserted into sorted part
        key = arr[i]
        j = i - 1
        
        # Move elements greater than key one position ahead
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        
        # Insert the key at its correct position
        arr[j + 1] = key
    
    return arr`,
    cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        // Element to be inserted into sorted part
        int key = arr[i];
        int j = i - 1;
        
        /* Move elements greater than key one position ahead */
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        // Insert the key at its correct position
        arr[j + 1] = key;
    }
}`
  },
  
  selection: {
    javascript: `function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    // Find minimum element in the unsorted part
    let minIndex = i;
    
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap the minimum element with the first element
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  
  return arr;
}`,
    python: `def selection_sort(arr):
    n = len(arr)
    
    for i in range(n - 1):
        # Find minimum element in the unsorted part
        min_idx = i
        
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        
        # Swap the minimum element with the first element
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    
    return arr`,
    cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        // Find minimum element in the unsorted part
        int minIndex = i;
        
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // Swap the minimum element with the first element
        if (minIndex != i) {
            swap(arr[i], arr[minIndex]);
        }
    }
}`
  },
  
  merge: {
    javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  // Split array in half
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  // Recursively sort both halves
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements from both arrays and merge them in sorted order
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
  return result.concat(
    left.slice(leftIndex),
    right.slice(rightIndex)
  );
}`,
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    # Split array in half
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]
    
    # Recursively sort both halves
    return merge(merge_sort(left), merge_sort(right))

def merge(left, right):
    result = []
    left_idx, right_idx = 0, 0
    
    # Compare elements from both arrays and merge them in sorted order
    while left_idx < len(left) and right_idx < len(right):
        if left[left_idx] < right[right_idx]:
            result.append(left[left_idx])
            left_idx += 1
        else:
            result.append(right[right_idx])
            right_idx += 1
    
    # Add remaining elements
    result.extend(left[left_idx:])
    result.extend(right[right_idx:])
    return result`,
    cpp: `void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    // Create temporary arrays
    int L[n1], R[n2];
    
    // Copy data to temporary arrays
    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];
    
    // Merge the temporary arrays back
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
    
    // Copy remaining elements
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

void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        // Find the middle point
        int mid = left + (right - left) / 2;
        
        // Sort first and second halves
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        
        // Merge the sorted halves
        merge(arr, left, mid, right);
    }
}`
  },
  
  quick: {
    javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Partition the array and get the pivot index
    const pivotIndex = partition(arr, low, high);
    
    // Recursively sort the subarrays
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  
  return arr;
}

function partition(arr, low, high) {
  // Choose the rightmost element as pivot
  const pivot = arr[high];
  
  // Index of smaller element
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    // If current element is smaller than or equal to pivot
    if (arr[j] <= pivot) {
      i++;
      // Swap arr[i] and arr[j]
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Swap arr[i+1] and arr[high] (the pivot)
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  // Return the pivot index
  return i + 1;
}`,
    python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        # Partition the array and get the pivot index
        pivot_index = partition(arr, low, high)
        
        # Recursively sort the subarrays
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)
    
    return arr

def partition(arr, low, high):
    # Choose the rightmost element as pivot
    pivot = arr[high]
    
    # Index of smaller element
    i = low - 1
    
    for j in range(low, high):
        # If current element is smaller than or equal to pivot
        if arr[j] <= pivot:
            i += 1
            # Swap arr[i] and arr[j]
            arr[i], arr[j] = arr[j], arr[i]
    
    # Swap arr[i+1] and arr[high] (the pivot)
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    
    # Return the pivot index
    return i + 1`,
    cpp: `int partition(int arr[], int low, int high) {
    // Choose the rightmost element as pivot
    int pivot = arr[high];
    
    // Index of smaller element
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        // If current element is smaller than or equal to pivot
        if (arr[j] <= pivot) {
            i++;
            // Swap arr[i] and arr[j]
            swap(arr[i], arr[j]);
        }
    }
    
    // Swap arr[i+1] and arr[high] (the pivot)
    swap(arr[i + 1], arr[high]);
    
    // Return the pivot index
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        // Partition the array and get the pivot index
        int pivotIndex = partition(arr, low, high);
        
        // Recursively sort the subarrays
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}`
  }
};

export default SortingCodeDisplay;
