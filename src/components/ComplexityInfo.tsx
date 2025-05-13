
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
  "bst": {
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
    clear: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(1)',
      explanation: 'Clearing the heap simply resets the array to empty.'
    }
  },
  
  // Sorting algorithms
  "bubble-sort": {
    sort: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
      explanation: 'Best case occurs when array is already sorted (with optimization). Involves comparing adjacent elements and swapping if needed.'
    }
  },
  "selection-sort": {
    sort: {
      time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
      explanation: 'Selection sort always examines all elements to find each minimum, making it quadratic even in best case.'
    }
  },
  "insertion-sort": {
    sort: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
      explanation: 'Best case occurs when array is already sorted. Works by building a sorted portion one element at a time.'
    }
  },
  "merge-sort": {
    sort: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      space: 'O(n)',
      explanation: 'Merge sort divides the array in half recursively and then merges the sorted halves, using additional space.'
    }
  },
  "quick-sort": {
    sort: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
      space: 'O(log n)',
      explanation: 'Quick sort partitions the array around a pivot. Worst case occurs with bad pivot selections, but average case is efficient.'
    }
  },
  
  // Search algorithms
  "linear-search": {
    search: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
      explanation: 'Linear search checks each element sequentially. Best case when element is at beginning, worst case when element is at end or not present.'
    }
  },
  "binary-search": {
    search: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(1)',
      explanation: 'Binary search divides the search interval in half repeatedly. Works only on sorted arrays but is much more efficient than linear search.'
    }
  },
  
  // Graph algorithms
  "dijkstra": {
    shortestPath: {
      time: { best: 'O(E + V log V)', average: 'O(E + V log V)', worst: 'O(E + V log V)' },
      space: 'O(V)',
      explanation: 'Dijkstra\'s algorithm finds the shortest path from a source node to all other nodes, using a priority queue for efficiency.'
    }
  },
  "bellman-ford": {
    shortestPath: {
      time: { best: 'O(V × E)', average: 'O(V × E)', worst: 'O(V × E)' },
      space: 'O(V)',
      explanation: 'Bellman-Ford algorithm finds shortest paths from a single source vertex, even with negative edge weights, and can detect negative cycles.'
    }
  },
  "floyd-warshall": {
    allPairsShortestPath: {
      time: { best: 'O(V³)', average: 'O(V³)', worst: 'O(V³)' },
      space: 'O(V²)',
      explanation: 'Floyd-Warshall algorithm finds shortest paths between all pairs of vertices in a weighted graph, handling positive and negative edge weights.'
    }
  },
  "prims-mst": {
    minimumSpanningTree: {
      time: { best: 'O(E log V)', average: 'O(E log V)', worst: 'O(E log V)' },
      space: 'O(V)',
      explanation: 'Prim\'s algorithm finds a minimum spanning tree for a weighted undirected graph, connecting all vertices with minimal total edge weight.'
    }
  },
  "fractional-knapsack": {
    optimize: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      space: 'O(n)',
      explanation: 'Fractional Knapsack algorithm sorts items by value-to-weight ratio and greedily selects items to maximize value without exceeding capacity.'
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
    'bst': 'bst',
    'avl-tree': 'avl-tree',
    'heap': 'heap',
    'bubble-sort': 'bubble-sort',
    'selection-sort': 'selection-sort',
    'insertion-sort': 'insertion-sort',
    'merge-sort': 'merge-sort',
    'quick-sort': 'quick-sort',
    'binary-search': 'binary-search',
    'linear-search': 'linear-search',
    'dijkstra': 'dijkstra',
    'bellman-ford': 'bellman-ford',
    'floyd-warshall': 'floyd-warshall',
    'prims-mst': 'prims-mst',
    'fractional-knapsack': 'fractional-knapsack'
  };
  
  // Get the correct data structure key
  let dsKey = dataStructureMap[dataStructure] || dataStructure;
  let op = operation;
  
  // Default operations for specific algorithm types
  if (dsKey === 'dijkstra') {
    op = 'shortestPath';
  } else if (dsKey === 'bellman-ford') {
    op = 'shortestPath';
  } else if (dsKey === 'floyd-warshall') {
    op = 'allPairsShortestPath';
  } else if (dsKey === 'prims-mst') {
    op = 'minimumSpanningTree';
  } else if (dsKey === 'fractional-knapsack') {
    op = 'optimize';
  } else if (dsKey.includes('sort')) {
    op = 'sort';
  } else if (dsKey.includes('search')) {
    op = 'search';
  }
  
  const dsData = complexityData[dsKey] || {};
  
  // If operation is specified, show only that operation
  const operationsToShow = op && dsData[op] ? [op] : Object.keys(dsData);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Time & Space Complexity</h2>
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
