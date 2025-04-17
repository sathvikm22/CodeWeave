
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Settings, List, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TreeNode {
  value: number;
  left: number | null;
  right: number | null;
}

interface BinaryTreeVisualizationProps {
  speed: number;
  onOperationSelect?: (operation: string) => void;
}

const BinaryTreeVisualization: React.FC<BinaryTreeVisualizationProps> = ({ speed, onOperationSelect }) => {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [root, setRoot] = useState<number | null>(null);
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);
  const [animationType, setAnimationType] = useState<'insert' | 'delete' | 'search' | 'traverse' | 'none'>(
    'none'
  );
  const [valueInput, setValueInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [searchPath, setSearchPath] = useState<number[]>([]);
  const [traversalPath, setTraversalPath] = useState<number[]>([]);
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>(
    'inorder'
  );
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [traversalStep, setTraversalStep] = useState<number>(-1);
  const [maxSize, setMaxSize] = useState<number>(5); // Default size is 5
  const [sizeInput, setSizeInput] = useState<string>('5'); // Default size input is 5
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState<boolean>(false);
  const [isTraversing, setIsTraversing] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Animation speed factor
  const speedFactor = Math.max(1, 11 - Math.floor(speed / 10));
  
  // Reset animation state after animation duration
  useEffect(() => {
    if (animatedIndex !== null && !isTraversing) {
      const timeout = setTimeout(() => {
        setAnimatedIndex(null);
        setAnimationType('none');
        setSearchPath([]);
      }, 600 * speedFactor);
      return () => clearTimeout(timeout);
    }
  }, [animatedIndex, speedFactor, isTraversing]);

  // Initialize with a simple example tree
  useEffect(() => {
    initializeExampleTree();
  }, []);

  // Initialize a simple example tree
  const initializeExampleTree = () => {
    // Create a balanced BST
    setNodes([
      { value: 50, left: 1, right: 2 },
      { value: 30, left: 3, right: 4 },
      { value: 70, left: 5, right: null },
      { value: 20, left: null, right: null },
      { value: 40, left: null, right: null },
      { value: 60, left: null, right: null }
    ]);
    setRoot(0);
    setMessage('Example binary search tree initialized');
    
    // Report operation
    if (onOperationSelect) {
      onOperationSelect('initialize');
    }
  };

  // Helper to find the correct position to insert a value
  const findInsertPosition = (value: number): { parent: number, direction: 'left' | 'right' } | null => {
    if (nodes.length === 0 || root === null) return null;
    
    let current = root;
    let parent = null;
    let direction: 'left' | 'right' = 'left';
    
    while (current !== null) {
      parent = current;
      if (value < nodes[current].value) {
        direction = 'left';
        current = nodes[current].left;
      } else {
        direction = 'right';
        current = nodes[current].right;
      }
    }
    
    return parent !== null ? { parent, direction } : null;
  };

  // Insert a value into the BST
  const handleInsert = () => {
    const valueStr = valueInput.trim();
    if (!valueStr) {
      toast({
        title: "Error",
        description: "Please enter a value",
        variant: "destructive"
      });
      return;
    }
    
    const value = parseInt(valueStr);
    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }
    
    if (nodes.length >= maxSize) {
      toast({
        title: "Tree Full",
        description: `Cannot insert more than ${maxSize} nodes`,
        variant: "destructive"
      });
      setMessage(`Tree Full: Cannot insert more than ${maxSize} nodes`);
      return;
    }
    
    // If the tree is empty
    if (nodes.length === 0 || root === null) {
      const newNode: TreeNode = { value, left: null, right: null };
      setNodes([newNode]);
      setRoot(0);
      setAnimatedIndex(0);
      setAnimationType('insert');
      setMessage(`Inserted ${value} as the root`);
      setValueInput('');
      
      // Report operation
      if (onOperationSelect) {
        onOperationSelect('insert');
      }
      return;
    }
    
    // Check if value already exists in the tree
    let current = root;
    let found = false;
    
    const checkDuplicate = (nodeIndex: number) => {
      if (nodeIndex === null) return;
      
      if (nodes[nodeIndex].value === value) {
        found = true;
        return;
      }
      
      if (value < nodes[nodeIndex].value && nodes[nodeIndex].left !== null) {
        checkDuplicate(nodes[nodeIndex].left);
      } else if (value > nodes[nodeIndex].value && nodes[nodeIndex].right !== null) {
        checkDuplicate(nodes[nodeIndex].right);
      }
    };
    
    checkDuplicate(current);
    
    if (found) {
      toast({
        title: "Duplicate Value",
        description: `${value} already exists in the tree`,
        variant: "destructive"
      });
      setMessage(`Duplicate Value: ${value} already exists in the tree`);
      return;
    }
    
    // Find where to insert the new node
    const insertPos = findInsertPosition(value);
    if (!insertPos) return;
    
    const { parent, direction } = insertPos;
    const newNodeIndex = nodes.length;
    const newNode: TreeNode = { value, left: null, right: null };
    
    setNodes([...nodes, newNode]);
    
    setNodes(prev => {
      const updated = [...prev];
      updated[parent] = { 
        ...updated[parent], 
        [direction]: newNodeIndex 
      };
      return updated;
    });
    
    setAnimatedIndex(newNodeIndex);
    setAnimationType('insert');
    setMessage(`Inserted ${value} as ${direction} child of ${nodes[parent].value}`);
    setValueInput('');
    
    // Report operation
    if (onOperationSelect) {
      onOperationSelect('insert');
    }
  };

  // Delete a node from the BST (leaf nodes only for simplicity)
  const handleDelete = () => {
    const valueStr = valueInput.trim();
    if (!valueStr) {
      toast({
        title: "Error",
        description: "Please enter a value to delete",
        variant: "destructive"
      });
      return;
    }
    
    const value = parseInt(valueStr);
    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }
    
    if (nodes.length === 0 || root === null) {
      toast({
        title: "Empty Tree",
        description: "The tree is empty",
        variant: "destructive"
      });
      setMessage("Empty Tree: There are no nodes to delete");
      return;
    }
    
    // Find the node to delete and its parent
    let current = root;
    let parent: number | null = null;
    let direction: 'left' | 'right' | null = null;
    let found = false;
    
    const findNode = (nodeIndex: number, parentIndex: number | null, dir: 'left' | 'right' | null) => {
      if (nodeIndex === null) return;
      
      if (nodes[nodeIndex].value === value) {
        current = nodeIndex;
        parent = parentIndex;
        direction = dir;
        found = true;
        return;
      }
      
      if (value < nodes[nodeIndex].value && nodes[nodeIndex].left !== null) {
        findNode(nodes[nodeIndex].left, nodeIndex, 'left');
      } else if (value > nodes[nodeIndex].value && nodes[nodeIndex].right !== null) {
        findNode(nodes[nodeIndex].right, nodeIndex, 'right');
      }
    };
    
    findNode(current, null, null);
    
    if (!found) {
      toast({
        title: "Not Found",
        description: `${value} not found in the tree`,
        variant: "destructive"
      });
      setMessage(`Not Found: ${value} is not in the tree`);
      return;
    }
    
    // Check if it's a leaf node (no children)
    const isLeaf = nodes[current].left === null && nodes[current].right === null;
    
    if (!isLeaf) {
      toast({
        title: "Non-Leaf Node",
        description: `${value} is not a leaf node. This simplified implementation only removes leaf nodes.`,
        variant: "destructive"
      });
      setMessage(`Non-Leaf Node: This visualization only supports deleting leaf nodes.`);
      return;
    }
    
    setAnimatedIndex(current);
    setAnimationType('delete');
    
    setTimeout(() => {
      // If it's the root and only node
      if (parent === null) {
        setNodes([]);
        setRoot(null);
      } else if (direction && parent !== null) {
        // Remove link from parent
        setNodes(prev => {
          const updated = [...prev];
          updated[parent] = { 
            ...updated[parent], 
            [direction]: null 
          };
          return updated;
        });
      }
      
      setMessage(`Deleted leaf node ${value}`);
      
      // Report operation
      if (onOperationSelect) {
        onOperationSelect('delete');
      }
    }, 500 * speedFactor);
    
    setValueInput('');
  };

  // Search for a value in the BST
  const handleSearch = () => {
    const valueStr = valueInput.trim();
    if (!valueStr) {
      toast({
        title: "Error",
        description: "Please enter a value to search",
        variant: "destructive"
      });
      return;
    }
    
    const value = parseInt(valueStr);
    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }
    
    if (nodes.length === 0 || root === null) {
      toast({
        title: "Empty Tree",
        description: "The tree is empty",
        variant: "destructive"
      });
      setMessage("Empty Tree: There are no nodes to search");
      return;
    }
    
    let current = root;
    const path: number[] = [];
    let found = false;
    
    const animateSearch = (nodeIndex: number, depth: number) => {
      setTimeout(() => {
        path.push(nodeIndex);
        setSearchPath([...path]);
        
        if (nodes[nodeIndex].value === value) {
          found = true;
          setAnimatedIndex(nodeIndex);
          setAnimationType('search');
          setMessage(`Found ${value} at depth ${depth}`);
          
          // Report operation
          if (onOperationSelect) {
            onOperationSelect('search');
          }
        } else if (value < nodes[nodeIndex].value && nodes[nodeIndex].left !== null) {
          animateSearch(nodes[nodeIndex].left, depth + 1);
        } else if (value > nodes[nodeIndex].value && nodes[nodeIndex].right !== null) {
          animateSearch(nodes[nodeIndex].right, depth + 1);
        } else {
          setTimeout(() => {
            setMessage(`${value} not found in the tree`);
            toast({
              title: "Not Found",
              description: `${value} not found in the tree`,
              variant: "destructive"
            });
          }, 300 * speedFactor);
        }
      }, 500 * speedFactor * depth);
    };
    
    animateSearch(current, 0);
    setValueInput('');
  };

  // Perform tree traversal (inorder, preorder, postorder)
  const handleTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    if (nodes.length === 0 || root === null) {
      toast({
        title: "Empty Tree",
        description: "The tree is empty, nothing to traverse",
        variant: "destructive"
      });
      setMessage("Empty Tree: There are no nodes to traverse");
      return;
    }
    
    setTraversalType(type);
    setIsTraversing(true);
    setTraversalStep(-1);
    
    const result: number[] = [];
    const traversalPath: number[] = [];
    
    // Perform the traversal and collect the result
    const traverseTree = (nodeIndex: number | null) => {
      if (nodeIndex === null) return;
      
      // Preorder: Root -> Left -> Right
      if (type === 'preorder') {
        result.push(nodes[nodeIndex].value);
        traversalPath.push(nodeIndex);
      }
      
      // Left subtree
      if (nodes[nodeIndex].left !== null) {
        traverseTree(nodes[nodeIndex].left);
      }
      
      // Inorder: Left -> Root -> Right
      if (type === 'inorder') {
        result.push(nodes[nodeIndex].value);
        traversalPath.push(nodeIndex);
      }
      
      // Right subtree
      if (nodes[nodeIndex].right !== null) {
        traverseTree(nodes[nodeIndex].right);
      }
      
      // Postorder: Left -> Right -> Root
      if (type === 'postorder') {
        result.push(nodes[nodeIndex].value);
        traversalPath.push(nodeIndex);
      }
    };
    
    traverseTree(root);
    
    setTraversalResult(result);
    setTraversalPath(traversalPath);
    
    // Animate the traversal step by step
    let currentStep = 0;
    
    const animateTraversal = () => {
      if (currentStep < traversalPath.length) {
        setTraversalStep(currentStep);
        setAnimatedIndex(traversalPath[currentStep]);
        setAnimationType('traverse');
        currentStep++;
        setTimeout(animateTraversal, 800 * speedFactor);
      } else {
        setIsTraversing(false);
        setAnimatedIndex(null);
        setTraversalStep(-1);
        
        // Report operation
        if (onOperationSelect) {
          onOperationSelect(`traversal-${type}`);
        }
      }
    };
    
    const traversalNames = {
      'inorder': 'In-order (Left -> Root -> Right)',
      'preorder': 'Pre-order (Root -> Left -> Right)',
      'postorder': 'Post-order (Left -> Right -> Root)'
    };
    
    setMessage(`Performing ${traversalNames[type]} traversal: [${result.join(', ')}]`);
    animateTraversal();
  };

  // Reset the tree to initial state
  const handleReset = () => {
    initializeExampleTree();
    setAnimatedIndex(null);
    setAnimationType('none');
    setSearchPath([]);
    setTraversalPath([]);
    setTraversalResult([]);
    setTraversalStep(-1);
    setValueInput('');
    setIsTraversing(false);
  };

  // Set the maximum tree size
  const handleSetMaxSize = () => {
    const newMaxSize = parseInt(sizeInput);
    if (isNaN(newMaxSize) || newMaxSize < 1 || newMaxSize > 15) {
      toast({
        title: "Invalid Size",
        description: "Maximum tree size must be between 1 and 15",
        variant: "destructive"
      });
      return;
    }
    
    if (nodes.length > newMaxSize) {
      toast({
        title: "Tree Truncated",
        description: `The tree contains ${nodes.length} nodes. Set a larger size or reset the tree.`,
        variant: "destructive"
      });
      return;
    }
    
    setMaxSize(newMaxSize);
    setIsSizeDialogOpen(false);
    setMessage(`Maximum tree size set to ${newMaxSize} nodes`);
    
    // Report operation
    if (onOperationSelect) {
      onOperationSelect('resize');
    }
  };

  const getAnimationClass = (index: number) => {
    if (animatedIndex === index) {
      switch (animationType) {
        case 'insert':
          return 'animate-pop-in bg-green-200 dark:bg-green-700 border-green-500';
        case 'delete':
          return 'animate-pulse bg-red-200 dark:bg-red-700 border-red-500';
        case 'search':
          return 'animate-pulse bg-yellow-200 dark:bg-yellow-700 border-yellow-500';
        case 'traverse':
          return 'animate-pulse bg-blue-200 dark:bg-blue-700 border-blue-500';
        default:
          return '';
      }
    } else if (searchPath.includes(index)) {
      return 'bg-blue-100 dark:bg-blue-800 border-blue-400';
    }
    return '';
  };

  // Render the tree with an improved visualization
  const renderTree = () => {
    if (nodes.length === 0 || root === null) {
      return (
        <div className="text-center text-muted-foreground p-8">
          Empty Tree (Max Size: {maxSize})
        </div>
      );
    }
    
    // Calculate tree height and width
    const maxDepth = 4; // Support up to 4 levels for better visualization
    const nodeSize = 60;
    const levelHeight = 90;
    const horizontalSpacing = 40;
    
    // Calculate the maximum width needed for the tree
    const getMaxWidth = (depth: number) => Math.pow(2, depth) * (nodeSize + horizontalSpacing);
    const treeWidth = getMaxWidth(maxDepth);
    
    // Calculate positions for nodes by level and position
    const nodePositions: {[key: string]: {x: number, y: number, nodeIndex: number}} = {};
    
    const calculatePositions = (nodeIndex: number | null, level: number, hPos: number) => {
      if (nodeIndex === null || level > maxDepth) return;
      
      const width = getMaxWidth(level);
      const x = width / 2 + hPos * (width / Math.pow(2, level));
      const y = level * levelHeight;
      
      nodePositions[`${level}-${hPos}`] = { x, y, nodeIndex };
      
      if (nodes[nodeIndex].left !== null) {
        calculatePositions(nodes[nodeIndex].left, level + 1, hPos * 2);
      }
      
      if (nodes[nodeIndex].right !== null) {
        calculatePositions(nodes[nodeIndex].right, level + 1, hPos * 2 + 1);
      }
    };
    
    calculatePositions(root, 0, 0);
    
    // Render nodes and edges
    const renderedElements = [];
    
    // First render edges, so they appear behind nodes
    Object.keys(nodePositions).forEach(key => {
      const [level, pos] = key.split('-').map(Number);
      const { nodeIndex, x, y } = nodePositions[key];
      const node = nodes[nodeIndex];
      
      const leftChildKey = `${level + 1}-${pos * 2}`;
      const rightChildKey = `${level + 1}-${pos * 2 + 1}`;
      
      // Add edges to children
      if (node.left !== null && nodePositions[leftChildKey]) {
        const childPos = nodePositions[leftChildKey];
        renderedElements.push(
          <line
            key={`edge-${nodeIndex}-${node.left}`}
            x1={x + nodeSize / 2}
            y1={y + nodeSize / 2}
            x2={childPos.x + nodeSize / 2}
            y2={childPos.y + nodeSize / 2}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          />
        );
        
        // Add arrow for traversal animation
        if (isTraversing && traversalStep > 0 && 
            traversalPath[traversalStep - 1] === nodeIndex && 
            traversalPath[traversalStep] === node.left) {
          
          // Calculate arrow position
          const angle = Math.atan2(childPos.y - y, childPos.x - x);
          const arrowX = x + nodeSize / 2 + Math.cos(angle) * (nodeSize / 2 + 20);
          const arrowY = y + nodeSize / 2 + Math.sin(angle) * (nodeSize / 2 + 20);
          
          renderedElements.push(
            <polygon
              key={`arrow-${nodeIndex}-${node.left}`}
              points="0,-5 10,0 0,5"
              transform={`translate(${arrowX},${arrowY}) rotate(${angle * 180 / Math.PI})`}
              fill="currentColor"
              className="text-primary"
            />
          );
        }
      }
      
      if (node.right !== null && nodePositions[rightChildKey]) {
        const childPos = nodePositions[rightChildKey];
        renderedElements.push(
          <line
            key={`edge-${nodeIndex}-${node.right}`}
            x1={x + nodeSize / 2}
            y1={y + nodeSize / 2}
            x2={childPos.x + nodeSize / 2}
            y2={childPos.y + nodeSize / 2}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          />
        );
        
        // Add arrow for traversal animation
        if (isTraversing && traversalStep > 0 && 
            traversalPath[traversalStep - 1] === nodeIndex && 
            traversalPath[traversalStep] === node.right) {
          
          // Calculate arrow position
          const angle = Math.atan2(childPos.y - y, childPos.x - x);
          const arrowX = x + nodeSize / 2 + Math.cos(angle) * (nodeSize / 2 + 20);
          const arrowY = y + nodeSize / 2 + Math.sin(angle) * (nodeSize / 2 + 20);
          
          renderedElements.push(
            <polygon
              key={`arrow-${nodeIndex}-${node.right}`}
              points="0,-5 10,0 0,5"
              transform={`translate(${arrowX},${arrowY}) rotate(${angle * 180 / Math.PI})`}
              fill="currentColor"
              className="text-primary"
            />
          );
        }
      }
    });
    
    // Then render nodes
    Object.keys(nodePositions).forEach(key => {
      const { nodeIndex, x, y } = nodePositions[key];
      const node = nodes[nodeIndex];
      
      renderedElements.push(
        <g 
          key={`node-${nodeIndex}`}
          className={`transition-all duration-300 ${getAnimationClass(nodeIndex)}`}
        >
          <circle
            cx={x + nodeSize / 2}
            cy={y + nodeSize / 2}
            r={nodeSize / 2 - 5}
            className="fill-background stroke-primary"
            strokeWidth="2"
          />
          <text
            x={x + nodeSize / 2}
            y={y + nodeSize / 2 + 5}
            textAnchor="middle"
            className="text-foreground font-medium text-sm fill-current"
          >
            {node.value}
          </text>
          {traversalStep !== -1 && traversalPath[traversalStep] === nodeIndex && (
            <circle
              cx={x + nodeSize / 2}
              cy={y + nodeSize / 2}
              r={nodeSize / 2 + 8}
              className="fill-none stroke-blue-500 dark:stroke-blue-400"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
        </g>
      );
    });
    
    // Calculate SVG size to fit the tree content
    const svgWidth = Math.max(300, treeWidth);
    const svgHeight = Math.max(300, maxDepth * levelHeight + nodeSize);
    
    // Return the SVG with all elements
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="overflow-auto w-full">
          <svg width={svgWidth} height={svgHeight} className="mx-auto">
            {renderedElements}
          </svg>
        </div>
        
        {/* Traversal result display */}
        {traversalResult.length > 0 && (
          <div className="mt-4 p-4 border rounded-md w-full max-w-md">
            <div className="text-sm font-medium mb-2">
              {traversalType === 'inorder' && 'In-order Traversal (Left → Root → Right)'}
              {traversalType === 'preorder' && 'Pre-order Traversal (Root → Left → Right)'}
              {traversalType === 'postorder' && 'Post-order Traversal (Left → Right → Root)'}
            </div>
            <div className="flex flex-wrap gap-2">
              {traversalResult.map((value, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 flex items-center justify-center border rounded-md text-sm
                    ${traversalStep === idx ? 'bg-blue-200 dark:bg-blue-800 border-blue-500' : 'bg-muted'}`}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Message display */}
      {message && (
        <div className="text-sm px-4 py-2 rounded-md bg-muted">
          {message}
        </div>
      )}
      
      {/* Size setting button */}
      <div className="flex justify-between w-full max-w-2xl">
        <div className="text-sm text-muted-foreground">
          Tree Size: {nodes.length} / {maxSize} nodes
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSizeDialogOpen(true)}
          className="flex items-center"
        >
          <Settings size={16} className="mr-2" />
          Set Max Size
        </Button>
      </div>
      
      {/* Tree visualization */}
      <div className="p-4 border border-border rounded-md w-full max-w-4xl overflow-auto min-h-[400px]">
        {renderTree()}
      </div>
      
      {/* Traversal controls */}
      <div className="w-full max-w-2xl flex justify-center">
        <Tabs defaultValue="inorder" className="w-full max-w-md">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="inorder" onClick={() => setTraversalType('inorder')}>In-order</TabsTrigger>
            <TabsTrigger value="preorder" onClick={() => setTraversalType('preorder')}>Pre-order</TabsTrigger>
            <TabsTrigger value="postorder" onClick={() => setTraversalType('postorder')}>Post-order</TabsTrigger>
          </TabsList>
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => handleTraversal(traversalType)}
            disabled={isTraversing || nodes.length === 0}
          >
            <List size={16} className="mr-2" /> Animate {traversalType} Traversal
          </Button>
        </Tabs>
      </div>
      
      {/* Operation controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {/* Insert operation */}
        <div className="space-y-2 p-4 rounded-md border border-border">
          <h3 className="font-medium text-sm mb-2">Binary Search Tree (BST) Operations</h3>
          <p className="text-xs text-muted-foreground mb-4">
            In a BST, values less than a node go to the left, values greater go to the right
          </p>
          <div className="flex flex-col gap-2">
            <Input 
              type="number" 
              placeholder="Value" 
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={handleInsert}
                className="w-full"
                disabled={nodes.length >= maxSize || isTraversing}
              >
                <Plus size={16} className="mr-2" /> Insert
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDelete}
                className="w-full"
                disabled={nodes.length === 0 || isTraversing}
              >
                <Trash2 size={16} className="mr-2" /> Delete Leaf
              </Button>
            </div>
          </div>
        </div>
        
        {/* Search and reset operations */}
        <div className="space-y-2 p-4 rounded-md border border-border">
          <h3 className="font-medium text-sm mb-2">Search & Utilities</h3>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input 
                type="number" 
                placeholder="Value" 
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                className="w-full"
              />
              <Button 
                variant="outline" 
                onClick={handleSearch}
                className="whitespace-nowrap"
                disabled={nodes.length === 0 || isTraversing}
              >
                <Search size={16} className="mr-2" /> Search
              </Button>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="w-full"
                disabled={isTraversing}
              >
                Reset Tree
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setNodes([]);
                  setRoot(null);
                  setMessage('Binary tree cleared');
                }}
                className="w-full"
                disabled={nodes.length === 0 || isTraversing}
              >
                Clear Tree
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Size Dialog */}
      <Dialog open={isSizeDialogOpen} onOpenChange={setIsSizeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Maximum Tree Size</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              placeholder="Enter max nodes (1-15)"
              min="1"
              max="15"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsSizeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSetMaxSize}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BinaryTreeVisualization;
