import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface ComplexityInfoProps {
  dataStructure: string;
  operation: string;
}

interface ComplexityData {
  [key: string]: {
    [key: string]: {
      time: {
        best: string;
        average: string;
        worst: string;
      };
      space: string;
      explanation: string;
    };
  };
}

const complexityData: ComplexityData = {
  "array": {
    access: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'Arrays provide constant-time access to elements using index.'
    },
    insert: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Insertion at the end is O(1), but insertion elsewhere requires shifting elements.'
    },
    delete: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Deletion requires shifting elements to fill the gap, unless it\'s the last element.'
    },
    search: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'In an unsorted array, we need to check each element in the worst case.'
    }
  },
  "stack": {
    push: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'Adding an element to the top of a stack is always constant time.'
    },
    pop: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'Removing the top element from a stack is always constant time.'
    },
    peek: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'Viewing the top element without removing it is always constant time.'
    }
  },
  "queue": {
    enqueue: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'Adding an element to the end of a queue is constant time.'
    },
    dequeue: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'Removing an element from the front of a queue is constant time.'
    },
    peek: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'Viewing the front element without removing it is constant time.'
    }
  },
  "circular-queue": {
    enqueue: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'Adding an element to a circular queue is constant time.'
    },
    dequeue: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'Removing an element from a circular queue is constant time.'
    },
    peek: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'Viewing the front element without removing it is constant time.'
    }
  },
  "linked-list": {
    access: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Accessing elements requires traversing from the head to the target position.'
    },
    insert: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Insertion at the beginning is O(1), but elsewhere requires traversal to the position.'
    },
    delete: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Deletion from the beginning is O(1), but elsewhere requires traversal to the position.'
    },
    search: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Searching requires traversing the list from the beginning.'
    }
  },
  "doubly-linked-list": {
    access: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Accessing elements requires traversing from the head or tail to the target position.'
    },
    insert: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Insertion at the beginning/end is O(1), but elsewhere requires traversal to the position.'
    },
    delete: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Deletion from the beginning/end is O(1), but elsewhere requires traversal to the position.'
    },
    search: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Searching requires traversing the list from the beginning or end.'
    }
  },
  "binary-tree": {
    access: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Accessing a node requires traversing from the root to the target node.'
    },
    insert: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Insertion requires traversing from the root to find the correct position.'
    },
    delete: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Deletion requires finding the node and possibly rebalancing the tree.'
    },
    search: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Searching requires traversing from the root to find the target node.'
    }
  },
  "binary-search-tree": {
    access: {
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Accessing a node requires traversing from the root following BST property. Average case is logarithmic, but worst case is linear for skewed trees.'
    },
    insert: {
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Insertion follows a search path to find the correct position. Average case is logarithmic, but worst case is linear for skewed trees.'
    },
    delete: {
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Deletion requires finding the node and possibly replacing with successor. Average case is logarithmic, but worst case is linear for skewed trees.'
    },
    search: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'BST allows binary search, which is logarithmic on balanced trees but can degrade to linear time for skewed trees.'
    },
    findMin: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Finding the minimum requires traversing left pointers until reaching the leftmost node. O(h) where h is the height.'
    },
    findMax: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Finding the maximum requires traversing right pointers until reaching the rightmost node. O(h) where h is the height.'
    },
    traversal: {
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(h)',
      explanation: 'Any traversal (inorder, preorder, postorder) must visit each node exactly once. Space complexity is O(h) for the recursion stack.'
    }
  },
  "avl-tree": {
    access: {
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(1)',
      explanation: 'Accessing a node requires traversing from the root, guaranteed to be logarithmic due to self-balancing property.'
    },
    insert: {
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(1)',
      explanation: 'Insertion requires finding the position and potentially performing rotations to maintain balance, always logarithmic.'
    },
    delete: {
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(1)',
      explanation: 'Deletion requires finding the node, replacing if necessary, and potentially performing rotations to maintain balance, always logarithmic.'
    },
    search: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(1)',
      explanation: 'AVL trees maintain balance, ensuring search is always logarithmic in the worst case.'
    },
    rotation: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'Each rotation operation (LL, RR, LR, RL) takes constant time, involving only pointer updates.'
    },
    getHeight: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'Height information is stored in each node, allowing constant time access.'
    },
    getBalanceFactor: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'Balance factor can be calculated in constant time using the height of left and right subtrees.'
    }
  },
  "heap": {
    insert: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(1)',
      explanation: 'Insertion requires adding at the end and potentially bubbling up to maintain the heap property, logarithmic in worst case.'
    },
    extractMin: {
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(1)',
      explanation: 'For min-heap, extracting the minimum (root) requires replacing with the last element and then bubbling down.'
    },
    extractMax: {
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(1)',
      explanation: 'For max-heap, extracting the maximum (root) requires replacing with the last element and then bubbling down.'
    },
    findMin: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'In a min-heap, the minimum is always at the root, allowing constant time access.'
    },
    findMax: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'In a max-heap, the maximum is always at the root, allowing constant time access.'
    },
    heapify: {
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Building a heap from an unsorted array takes linear time using the bottom-up approach.'
    },
    heapSort: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      space: 'O(1)',
      explanation: 'Heap sort involves building a heap (O(n)) and then extracting each element (n times O(log n)).'
    }
  },
  "sorting": {
    bubble: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
      explanation: 'Best case occurs when array is already sorted (with optimization). Involves comparing adjacent elements and swapping if needed.'
    },
    insertion: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
      explanation: 'Best case occurs when array is already sorted. Works by building a sorted portion one element at a time.'
    },
    selection: {
      time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
      explanation: 'Selection sort always examines all elements to find each minimum, making it quadratic even in best case.'
    },
    merge: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      space: 'O(n)',
      explanation: 'Merge sort divides the array in half recursively and then merges the sorted halves, using additional space.'
    },
    quick: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
      space: 'O(log n)',
      explanation: 'Quick sort partitions the array around a pivot. Worst case occurs with bad pivot selections, but average case is efficient.'
    }
  }
};

const ComplexityInfo: React.FC<ComplexityInfoProps> = ({ dataStructure, operation }) => {
  // Map from tab values to data structure keys
  const dataStructureMap: { [key: string]: string } = {
    'array': 'array',
    'stack': 'stack',
    'queue': 'queue',
    'circular-queue': 'circular-queue',
    'linked-list': 'linked-list',
    'doubly-linked-list': 'doubly-linked-list',
    'binary-tree': 'binary-tree',
    'binary-search-tree': 'binary-search-tree',
    'avl-tree': 'avl-tree',
    'heap': 'heap',
    'bubble': 'sorting',
    'insertion': 'sorting',
    'selection': 'sorting',
    'merge': 'sorting',
    'quick': 'sorting'
  };
  
  // Special handling for sorting algorithms
  let dsKey = dataStructureMap[dataStructure] || dataStructure;
  let op = operation;
  
  // If this is a sorting algorithm
  if (dsKey === 'sorting') {
    op = dataStructure; // Use the algorithm name as the operation
  }
  
  const dsData = complexityData[dsKey] || {};
  
  // If operation is specified, show only that operation
  const operationsToShow = op && dsData[op] ? [op] : Object.keys(dsData);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Time & Space Complexity</h2>
      {operationsToShow.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Operation</TableHead>
              <TableHead>Time (Best)</TableHead>
              <TableHead>Time (Avg)</TableHead>
              <TableHead>Time (Worst)</TableHead>
              <TableHead>Space</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operationsToShow.map((op) => (
              <TableRow key={op} className={operation === op ? 'bg-accent/50' : ''}>
                <TableCell className="font-medium">{op}</TableCell>
                <TableCell>{dsData[op]?.time.best || 'N/A'}</TableCell>
                <TableCell>{dsData[op]?.time.average || 'N/A'}</TableCell>
                <TableCell>{dsData[op]?.time.worst || 'N/A'}</TableCell>
                <TableCell>{dsData[op]?.space || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-muted-foreground text-center py-4">
          Select an operation to view complexity details
        </div>
      )}
      
      {op && dsData[op] && (
        <div className="mt-4 text-sm text-muted-foreground">
          <p><strong>Explanation:</strong> {dsData[op].explanation}</p>
        </div>
      )}
    </div>
  );
};

export default ComplexityInfo;
