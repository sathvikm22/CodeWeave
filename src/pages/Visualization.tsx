
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import ArrayVisualization from '@/components/visualizations/ArrayVisualization';
import StackVisualization from '@/components/visualizations/StackVisualization';
import QueueVisualization from '@/components/visualizations/QueueVisualization';
import LinkedListVisualization from '@/components/visualizations/LinkedListVisualization';
import DoublyLinkedListVisualization from '@/components/visualizations/DoublyLinkedListVisualization';
import CircularQueueVisualization from '@/components/visualizations/CircularQueueVisualization';
import BinaryTreeVisualization from '@/components/visualizations/BinaryTreeVisualization';
import BinarySearchTreeVisualization from '@/components/visualizations/BinarySearchTreeVisualization';
import AVLTreeVisualization from '@/components/visualizations/AVLTreeVisualization';
import HeapVisualization from '@/components/visualizations/HeapVisualization';
import ComplexityInfo from '@/components/ComplexityInfo';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const Visualization = () => {
  const { structureId } = useParams<{ structureId?: string }>();
  const navigate = useNavigate();
  const [speed, setSpeed] = useState<number>(50);
  const [selectedDataStructure, setSelectedDataStructure] = useState<string>(structureId || 'array');
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('linear');
  
  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };
  
  const handleDataStructureChange = (value: string) => {
    setSelectedDataStructure(value);
    setSelectedOperation(''); // Reset the selected operation when data structure changes
    navigate(`/visualization/${value}`);
  };
  
  const handleOperationSelect = (operation: string) => {
    setSelectedOperation(operation);
  };
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    
    // Select the first data structure in the category
    switch(value) {
      case 'linear':
        setSelectedDataStructure('array');
        navigate('/visualization/array');
        break;
      case 'trees':
        setSelectedDataStructure('binary-tree');
        navigate('/visualization/binary-tree');
        break;
      case 'advanced':
        // Future implementation for advanced structures
        break;
      case 'sorting':
        navigate('/sorting');
        break;
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-2">
                <ChevronLeft className="mr-1 h-4 w-4" /> Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Data Structure Visualizations</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Interactive visualizations to help you understand various data structures
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-sm font-medium min-w-20">Animation Speed:</div>
            <div className="w-48">
              <Slider 
                defaultValue={[speed]} 
                max={100} 
                step={1} 
                onValueChange={handleSpeedChange} 
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {speed < 30 ? 'Slow' : speed < 70 ? 'Medium' : 'Fast'}
            </div>
          </div>
        </div>
        
        <Tabs 
          defaultValue={selectedCategory} 
          value={selectedCategory}
          className="w-full mb-8"
          onValueChange={handleCategoryChange}
        >
          <TabsList className="grid grid-cols-4 w-full mb-8">
            <TabsTrigger value="linear">Linear Structures</TabsTrigger>
            <TabsTrigger value="trees">Tree Structures</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Structures</TabsTrigger>
            <TabsTrigger value="sorting">Sorting Algorithms</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {selectedCategory === 'linear' && (
          <Tabs 
            defaultValue={selectedDataStructure} 
            value={selectedDataStructure}
            className="w-full"
            onValueChange={handleDataStructureChange}
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
              <TabsTrigger value="array">Array</TabsTrigger>
              <TabsTrigger value="stack">Stack</TabsTrigger>
              <TabsTrigger value="queue">Queue</TabsTrigger>
              <TabsTrigger value="circular-queue">Circular Queue</TabsTrigger>
              <TabsTrigger value="linked-list">Linked List</TabsTrigger>
              <TabsTrigger value="doubly-linked-list">Doubly Linked List</TabsTrigger>
            </TabsList>
            
            <TabsContent value="array" className="p-4 border rounded-lg">
              <ArrayVisualization 
                speed={speed} 
                onOperationSelect={handleOperationSelect}
              />
            </TabsContent>
            
            <TabsContent value="stack" className="p-4 border rounded-lg">
              <StackVisualization 
                speed={speed} 
                onOperationSelect={handleOperationSelect}
              />
            </TabsContent>
            
            <TabsContent value="queue" className="p-4 border rounded-lg">
              <QueueVisualization 
                speed={speed} 
                onOperationSelect={handleOperationSelect}
              />
            </TabsContent>
            
            <TabsContent value="circular-queue" className="p-4 border rounded-lg">
              <CircularQueueVisualization 
                speed={speed} 
                onOperationSelect={handleOperationSelect}
              />
            </TabsContent>
            
            <TabsContent value="linked-list" className="p-4 border rounded-lg">
              <LinkedListVisualization 
                speed={speed} 
                onOperationSelect={handleOperationSelect}
              />
            </TabsContent>
            
            <TabsContent value="doubly-linked-list" className="p-4 border rounded-lg">
              <DoublyLinkedListVisualization 
                speed={speed} 
                onOperationSelect={handleOperationSelect}
              />
            </TabsContent>
          </Tabs>
        )}
        
        {selectedCategory === 'trees' && (
          <Tabs 
            defaultValue={selectedDataStructure} 
            value={selectedDataStructure}
            className="w-full"
            onValueChange={handleDataStructureChange}
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
              <TabsTrigger value="binary-tree">Binary Tree</TabsTrigger>
              <TabsTrigger value="binary-search-tree">Binary Search Tree</TabsTrigger>
              <TabsTrigger value="avl-tree">AVL Tree</TabsTrigger>
              <TabsTrigger value="heap">Heap</TabsTrigger>
            </TabsList>
            
            <TabsContent value="binary-tree" className="p-4 border rounded-lg">
              <BinaryTreeVisualization 
                speed={speed} 
                onOperationSelect={handleOperationSelect}
              />
            </TabsContent>
            
            <TabsContent value="binary-search-tree" className="p-4 border rounded-lg">
              <BinarySearchTreeVisualization 
                speed={speed}
                onOperationSelect={handleOperationSelect} 
              />
            </TabsContent>
            
            <TabsContent value="avl-tree" className="p-4 border rounded-lg">
              <AVLTreeVisualization 
                speed={speed}
                onOperationSelect={handleOperationSelect} 
              />
            </TabsContent>
            
            <TabsContent value="heap" className="p-4 border rounded-lg">
              <HeapVisualization 
                speed={speed}
                onOperationSelect={handleOperationSelect} 
              />
            </TabsContent>
          </Tabs>
        )}
        
        {selectedCategory === 'advanced' && (
          <div className="p-8 border rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-muted-foreground">
              Advanced data structures like Graphs, Hash Tables, and Tries will be available in a future update.
            </p>
          </div>
        )}
        
        <div className="mt-12">
          <ComplexityInfo 
            dataStructure={selectedDataStructure} 
            operation={selectedOperation}
          />
        </div>
      </div>
    </div>
  );
};

export default Visualization;
