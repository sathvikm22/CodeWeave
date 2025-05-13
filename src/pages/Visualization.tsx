
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import ArrayVisualization from '@/visualizations/ArrayVisualization';
import AVLTreeVisualization from '@/visualizations/AVLTreeVisualization';
import BinarySearchTreeVisualization from '@/visualizations/BinarySearchTreeVisualization';
import BinaryTreeVisualization from '@/visualizations/BinaryTreeVisualization';
import CircularQueueVisualization from '@/visualizations/CircularQueueVisualization';
import StackVisualization from '@/visualizations/StackVisualization';
import QueueVisualization from '@/visualizations/QueueVisualization';
import LinkedListVisualization from '@/visualizations/LinkedListVisualization';
import DoublyLinkedListVisualization from '@/visualizations/DoublyLinkedListVisualization';
import HeapVisualization from '@/visualizations/HeapVisualization';
import BubbleSortVisualization from '@/visualizations/BubbleSortVisualization';
import SelectionSortVisualization from '@/visualizations/SelectionSortVisualization';
import InsertionSortVisualization from '@/visualizations/InsertionSortVisualization';
import QuickSortVisualization from '@/visualizations/QuickSortVisualization';
import MergeSortVisualization from '@/visualizations/MergeSortVisualization';
import BinarySearchVisualization from '@/visualizations/BinarySearchVisualization';
import LinearSearchVisualization from '@/visualizations/LinearSearchVisualization';
import DijkstraVisualization from '@/visualizations/DijkstraVisualization';
import BellmanFordVisualization from '@/visualizations/BellmanFordVisualization';
import FloydWarshallVisualization from '@/visualizations/FloydWarshallVisualization';
import FractionalKnapsackVisualization from '@/visualizations/FractionalKnapsackVisualization';
import PrimsMSTVisualization from '@/visualizations/PrimsMSTVisualization';
import ComplexityInfo from '@/components/ComplexityInfo';

const getDataStructureInfo = (type: string) => {
  const structures: Record<string, { title: string; description: string }> = {
    'array': {
      title: 'Array Visualization',
      description: 'A collection of elements stored at contiguous memory locations.'
    },
    'stack': {
      title: 'Stack Visualization',
      description: 'A linear data structure that follows the Last In First Out (LIFO) principle.'
    },
    'queue': {
      title: 'Queue Visualization',
      description: 'A linear data structure that follows the First In First Out (FIFO) principle.'
    },
    'circular-queue': {
      title: 'Circular Queue Visualization',
      description: 'A circular implementation of a queue data structure.'
    },
    'linked-list': {
      title: 'Linked List Visualization',
      description: 'A linear data structure where elements are stored in nodes with references to the next node.'
    },
    'doubly-linked-list': {
      title: 'Doubly Linked List Visualization',
      description: 'A linked list where each node contains references to both the next and previous nodes.'
    },
    'binary-tree': {
      title: 'Binary Tree Visualization',
      description: 'A tree data structure in which each node has at most two children.'
    },
    'bst': {
      title: 'Binary Search Tree Visualization',
      description: 'A binary tree where nodes are ordered: left child < parent < right child.'
    },
    'avl-tree': {
      title: 'AVL Tree Visualization',
      description: 'A self-balancing binary search tree where heights of child subtrees differ by at most one.'
    },
    'heap': {
      title: 'Heap Visualization',
      description: 'A specialized tree-based data structure that satisfies the heap property.'
    },
    'bubble-sort': {
      title: 'Bubble Sort Visualization',
      description: 'A simple sorting algorithm that repeatedly swaps adjacent elements if they are in the wrong order.'
    },
    'selection-sort': {
      title: 'Selection Sort Visualization',
      description: 'A sorting algorithm that repeatedly finds the minimum element and puts it at the beginning.'
    },
    'insertion-sort': {
      title: 'Insertion Sort Visualization',
      description: 'A sorting algorithm that builds the final sorted array one item at a time.'
    },
    'merge-sort': {
      title: 'Merge Sort Visualization',
      description: 'A divide-and-conquer sorting algorithm that divides the array into smaller subarrays, sorts them, and merges them back.'
    },
    'quick-sort': {
      title: 'Quick Sort Visualization',
      description: 'A divide-and-conquer sorting algorithm that partitions arrays around a pivot element.'
    },
    'binary-search': {
      title: 'Binary Search Visualization',
      description: 'An efficient algorithm for finding a target value within a sorted array.'
    },
    'linear-search': {
      title: 'Linear Search Visualization',
      description: 'A simple search algorithm that checks each element of the array sequentially.'
    },
    'dijkstra': {
      title: 'Dijkstra\'s Algorithm Visualization',
      description: 'A greedy algorithm that finds shortest paths between nodes in a graph with non-negative edge weights.'
    },
    'bellman-ford': {
      title: 'Bellman-Ford Algorithm Visualization',
      description: 'A dynamic programming algorithm that finds shortest paths from a source vertex, supporting negative edge weights.'
    },
    'floyd-warshall': {
      title: 'Floyd-Warshall Visualization',
      description: 'A dynamic programming algorithm for finding shortest paths between all pairs of vertices in a weighted graph.'
    },
    'fractional-knapsack': {
      title: 'Fractional Knapsack Visualization',
      description: 'A greedy algorithm for solving the knapsack problem, allowing fractions of items.'
    },
    'prims-mst': {
      title: 'Prim\'s Minimum Spanning Tree Visualization',
      description: 'A greedy algorithm that finds a minimum spanning tree for a weighted undirected graph.'
    }
  };

  return structures[type] || { 
    title: 'Algorithm Visualization', 
    description: 'Interactive visualization of data structures and operations.'
  };
};

const Visualization: React.FC = () => {
  const { type = 'array' } = useParams<{ type: string }>();
  const info = getDataStructureInfo(type);
  const [animationSpeed, setAnimationSpeed] = useState([50]);
  const [lastOperation, setLastOperation] = useState<string>('');
  
  const handleOperationSelect = (operation: string) => {
    setLastOperation(operation);
  };
  
  // Check if the visualization type is an algorithm (rather than data structure)
  const isAlgorithm = [
    'bubble-sort', 'selection-sort', 'insertion-sort', 'quick-sort', 'merge-sort', 
    'binary-search', 'linear-search', 'dijkstra', 'bellman-ford', 'floyd-warshall', 
    'fractional-knapsack', 'prims-mst'
  ].includes(type);
  
  // Function to determine if complexity info should be shown
  const shouldShowComplexity = (type: string) => {
    return true; // Show for all types now
  };
  
  // Render the appropriate visualization component based on type
  const renderVisualization = () => {
    switch (type) {
      case 'array':
        return <ArrayVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'avl-tree':
        return <AVLTreeVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'bst':
        return <BinarySearchTreeVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'binary-tree':
        return <BinaryTreeVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'circular-queue':
        return <CircularQueueVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'stack':
        return <StackVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'queue':
        return <QueueVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'linked-list':
        return <LinkedListVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'doubly-linked-list':
        return <DoublyLinkedListVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'heap':
        return <HeapVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'bubble-sort':
        return <BubbleSortVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'selection-sort':
        return <SelectionSortVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'insertion-sort':
        return <InsertionSortVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'quick-sort':
        return <QuickSortVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'merge-sort':
        return <MergeSortVisualization 
                 initialSpeed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'binary-search':
        return <BinarySearchVisualization 
                 speed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'linear-search':
        return <LinearSearchVisualization 
                 initialSpeed={animationSpeed[0]} 
                 onOperationSelect={handleOperationSelect} 
               />;
      case 'dijkstra':
        return <DijkstraVisualization
                 speed={animationSpeed[0]}
                 onOperationSelect={handleOperationSelect}
               />;
      case 'bellman-ford':
        return <BellmanFordVisualization
                 speed={animationSpeed[0]}
                 onOperationSelect={handleOperationSelect}
               />;
      case 'floyd-warshall':
        return <FloydWarshallVisualization
                 speed={animationSpeed[0]}
                 onOperationSelect={handleOperationSelect}
               />;
      case 'fractional-knapsack':
        return <FractionalKnapsackVisualization
                 speed={animationSpeed[0]}
                 onOperationSelect={handleOperationSelect}
               />;
      case 'prims-mst':
        return <PrimsMSTVisualization
                 speed={animationSpeed[0]}
                 onOperationSelect={handleOperationSelect}
               />;
      default:
        return (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">
              Visualization for {type} will be available soon!
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{info.title}</h1>
        <p className="text-muted-foreground mt-1">{info.description}</p>
      </div>
      
      {/* Visualization Area */}
      <Card className="border-2">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-xl">Visualization</CardTitle>
          {lastOperation && (
            <CardDescription>
              Last operation: <span className="font-medium">{lastOperation}</span>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-6">
          {renderVisualization()}
        </CardContent>
      </Card>
      
      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Configure visualization settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="speed">Animation Speed</Label>
              <span className="text-sm">{animationSpeed[0]}%</span>
            </div>
            <Slider 
              id="speed"
              value={animationSpeed}
              min={10}
              max={100}
              step={1}
              onValueChange={setAnimationSpeed}
            />
          </div>
        </CardContent>
      </Card>

      {/* Complexity Information - Only show for supported data structures or algorithms */}
      {shouldShowComplexity(type) && (
        <Card>
          <CardHeader>
            <CardTitle>Complexity Analysis</CardTitle>
            <CardDescription>Time and space complexity for operations</CardDescription>
          </CardHeader>
          <CardContent>
            <ComplexityInfo dataStructure={type} operation={lastOperation} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Visualization;
