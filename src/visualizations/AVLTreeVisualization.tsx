
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  AlertCircle, PlusCircle, MinusCircle, Search, Trash, 
  ArrowDown, ArrowRightLeft, ArrowLeft, ArrowRight, ArrowUp,
  ChevronFirst, ChevronLast, RotateCw
} from 'lucide-react';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  height: number;
  x: number;
  y: number;
  state: 'default' | 'highlight' | 'selected' | 'found' | 'new' | 'balancing';
}

interface AVLTreeVisualizationProps {
  speed: number;
  onOperationSelect: (operation: string) => void;
}

const AVLTreeVisualization: React.FC<AVLTreeVisualizationProps> = ({
  speed,
  onOperationSelect
}) => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [insertValue, setInsertValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [removeValue, setRemoveValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [operation, setOperation] = useState<string>('');
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder' | 'levelorder'>('inorder');
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [traversalStep, setTraversalStep] = useState<number>(-1);
  const [isTraversing, setIsTraversing] = useState<boolean>(false);
  const [showBalanceFactors, setShowBalanceFactors] = useState<boolean>(true);

  // Calculate animation speed from the speed prop
  const animationSpeed = Math.max(100, 900 - speed * 9);
  
  // Initialize the tree with some values
  useEffect(() => {
    const initialValues = [50, 30, 70, 20, 40, 60, 80, 15, 45, 75];
    let newRoot = null;
    
    for (const value of initialValues) {
      newRoot = insertNode(newRoot, value);
    }
    
    calculatePositions(newRoot);
    setRoot(newRoot);
  }, []);

  // Helper functions for AVL tree operations
  const getHeight = (node: TreeNode | null): number => {
    return node ? node.height : 0;
  };

  const getBalanceFactor = (node: TreeNode | null): number => {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
  };

  const updateHeight = (node: TreeNode): void => {
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  };

  // Rotations for balancing
  const rightRotate = (y: TreeNode): TreeNode => {
    const x = y.left as TreeNode;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    updateHeight(y);
    updateHeight(x);

    return x;
  };

  const leftRotate = (x: TreeNode): TreeNode => {
    const y = x.right as TreeNode;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    updateHeight(x);
    updateHeight(y);

    return y;
  };

  // Insert a node into the AVL tree
  const insertNode = (node: TreeNode | null, value: number): TreeNode => {
    // Normal BST insertion
    if (node === null) {
      return { 
        value, 
        left: null, 
        right: null, 
        height: 1, 
        x: 0, 
        y: 0, 
        state: 'default' as const
      };
    }

    if (value < node.value) {
      node.left = insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = insertNode(node.right, value);
    } else {
      return node; // Duplicate values not allowed
    }

    // Update height of current node
    updateHeight(node);

    // Get the balance factor to check if this node became unbalanced
    const balance = getBalanceFactor(node);

    // Left Left Case
    if (balance > 1 && node.left && value < node.left.value) {
      return rightRotate(node);
    }

    // Right Right Case
    if (balance < -1 && node.right && value > node.right.value) {
      return leftRotate(node);
    }

    // Left Right Case
    if (balance > 1 && node.left && value > node.left.value) {
      node.left = leftRotate(node.left);
      return rightRotate(node);
    }

    // Right Left Case
    if (balance < -1 && node.right && value < node.right.value) {
      node.right = rightRotate(node.right);
      return leftRotate(node);
    }

    return node;
  };

  // Calculate positions for rendering the tree
  const calculatePositions = (node: TreeNode | null, depth: number = 0, position: number = 0): void => {
    if (!node) return;

    const width = 800;
    const height = 60;
    const xOffset = width / Math.pow(2, depth + 1);
    
    node.x = width / 2 + position * xOffset;
    node.y = depth * height + 40;
    
    calculatePositions(node.left, depth + 1, position * 2 - 1);
    calculatePositions(node.right, depth + 1, position * 2 + 1);
  };

  // Insert a value into the AVL tree
  const handleInsert = async () => {
    if (!insertValue) {
      setError('Please enter a value to insert');
      return;
    }
    
    const value = parseInt(insertValue);
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    
    setOperation('insert');
    onOperationSelect('insert');
    setError('');
    
    // Check if the value already exists
    if (search(root, value)) {
      setError(`Value ${value} already exists in the tree`);
      return;
    }
    
    // Insert the new value and get the new root
    const newRoot = insertNode(cloneTree(root), value);
    
    // Find and highlight the newly inserted node
    let inserted = search(newRoot, value);
    if (inserted) {
      inserted.state = 'new';
    }
    
    calculatePositions(newRoot);
    setRoot(newRoot);
    
    // Reset node states after a delay
    await new Promise(resolve => setTimeout(resolve, animationSpeed * 2));
    resetNodeStates(newRoot);
    calculatePositions(newRoot);
    setRoot({ ...newRoot });
    setInsertValue('');
  };

  // Search for a value in the tree
  const handleSearch = async () => {
    if (!searchValue) {
      setError('Please enter a value to search');
      return;
    }
    
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    
    setOperation('search');
    onOperationSelect('search');
    setError('');
    
    let found = false;
    let path: TreeNode[] = [];
    
    const searchWithAnimation = async (node: TreeNode | null, value: number): Promise<boolean> => {
      if (!node) return false;
      
      // Highlight the current node
      node.state = 'highlight';
      path.push(node);
      
      // Update the tree with highlighted path
      let pathRoot = createPathTree(root, path);
      calculatePositions(pathRoot);
      setRoot(pathRoot);
      
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
      
      if (value === node.value) {
        node.state = 'found';
        
        // Update the tree with the found node
        let foundRoot = createPathTree(root, path);
        calculatePositions(foundRoot);
        setRoot(foundRoot);
        return true;
      }
      
      if (value < node.value) {
        return await searchWithAnimation(node.left, value);
      } else {
        return await searchWithAnimation(node.right, value);
      }
    };
    
    found = await searchWithAnimation(cloneTree(root), value);
    
    if (!found) {
      setError(`Value ${value} not found in the tree`);
    }
    
    // Reset node states after a delay
    await new Promise(resolve => setTimeout(resolve, animationSpeed * 2));
    resetNodeStates(root);
    calculatePositions(root);
    setRoot({ ...root! });
    setSearchValue('');
  };

  // Find the node with minimum value in a tree
  const findMin = (node: TreeNode): TreeNode => {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  };

  // Delete a node from the AVL tree
  const deleteNode = (root: TreeNode | null, value: number): TreeNode | null => {
    if (root === null) return null;

    if (value < root.value) {
      root.left = deleteNode(root.left, value);
    } else if (value > root.value) {
      root.right = deleteNode(root.right, value);
    } else {
      // Node found, delete it

      // Case 1: Leaf node or node with only one child
      if (root.left === null) {
        return root.right;
      } else if (root.right === null) {
        return root.left;
      }

      // Case 2: Node with two children
      // Get the inorder successor (smallest in right subtree)
      const successor = findMin(root.right);
      root.value = successor.value;

      // Delete the inorder successor
      root.right = deleteNode(root.right, successor.value);
    }

    if (root === null) return null;

    // Update height
    updateHeight(root);

    // Check balance factor
    const balance = getBalanceFactor(root);

    // Left Left Case
    if (balance > 1 && getBalanceFactor(root.left) >= 0) {
      return rightRotate(root);
    }

    // Left Right Case
    if (balance > 1 && getBalanceFactor(root.left) < 0) {
      root.left = leftRotate(root.left!);
      return rightRotate(root);
    }

    // Right Right Case
    if (balance < -1 && getBalanceFactor(root.right) <= 0) {
      return leftRotate(root);
    }

    // Right Left Case
    if (balance < -1 && getBalanceFactor(root.right) > 0) {
      root.right = rightRotate(root.right!);
      return leftRotate(root);
    }

    return root;
  };

  // Remove a value from the tree
  const handleRemove = async () => {
    if (!removeValue) {
      setError('Please enter a value to remove');
      return;
    }
    
    const value = parseInt(removeValue);
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    
    setOperation('remove');
    onOperationSelect('remove');
    setError('');
    
    // Check if the value exists
    const nodeToDelete = search(root, value);
    if (!nodeToDelete) {
      setError(`Value ${value} does not exist in the tree`);
      return;
    }
    
    // Highlight the node to be deleted
    nodeToDelete.state = 'selected';
    calculatePositions(root);
    setRoot({ ...root! });
    
    await new Promise(resolve => setTimeout(resolve, animationSpeed));
    
    // Delete the node
    const newRoot = deleteNode(cloneTree(root), value);
    calculatePositions(newRoot);
    setRoot(newRoot);
    
    // Reset node states after a delay
    await new Promise(resolve => setTimeout(resolve, animationSpeed * 2));
    resetNodeStates(newRoot);
    calculatePositions(newRoot);
    setRoot({ ...newRoot! });
    setRemoveValue('');
  };

  // Search helper function
  const search = (node: TreeNode | null, value: number): TreeNode | null => {
    if (!node) return null;
    if (node.value === value) return node;
    
    if (value < node.value) {
      return search(node.left, value);
    } else {
      return search(node.right, value);
    }
  };

  // Create a copy of the tree with highlighted path
  const createPathTree = (node: TreeNode | null, path: TreeNode[]): TreeNode | null => {
    if (!node) return null;
    
    const pathNode = path.find(p => p.value === node.value);
    const nodeState: 'default' | 'highlight' | 'selected' | 'found' | 'new' | 'balancing' = 
      pathNode ? pathNode.state : 'default';
    
    const newNode: TreeNode = {
      value: node.value,
      left: null,
      right: null,
      height: node.height,
      x: node.x,
      y: node.y,
      state: nodeState
    };
    
    newNode.left = createPathTree(node.left, path);
    newNode.right = createPathTree(node.right, path);
    
    return newNode;
  };

  // Reset all node states to default
  const resetNodeStates = (node: TreeNode | null): void => {
    if (!node) return;
    
    node.state = 'default';
    resetNodeStates(node.left);
    resetNodeStates(node.right);
  };

  // Clone a tree
  const cloneTree = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null;
    
    return {
      value: node.value,
      left: cloneTree(node.left),
      right: cloneTree(node.right),
      height: node.height,
      x: node.x,
      y: node.y,
      state: node.state
    };
  };

  // Clear the tree
  const handleClear = () => {
    setRoot(null);
    setOperation('clear');
    onOperationSelect('clear');
    setError('');
    setTraversalResult([]);
    setTraversalStep(-1);
    setIsTraversing(false);
  };

  // Perform tree traversal
  const handleTraversal = async () => {
    if (!root) {
      setError('The tree is empty');
      return;
    }
    
    setOperation(`traversal-${traversalType}`);
    onOperationSelect(`traversal-${traversalType}`);
    setError('');
    
    // Reset previous traversal state
    resetNodeStates(root);
    calculatePositions(root);
    setRoot({ ...root });
    
    setIsTraversing(true);
    setTraversalStep(-1);
    
    const result: number[] = [];
    const traversalNodes: TreeNode[] = [];
    
    // Collect nodes in traversal order
    if (traversalType === 'inorder') {
      // Left -> Root -> Right
      const inorder = (node: TreeNode | null) => {
        if (!node) return;
        inorder(node.left);
        result.push(node.value);
        traversalNodes.push(node);
        inorder(node.right);
      };
      inorder(root);
    } else if (traversalType === 'preorder') {
      // Root -> Left -> Right
      const preorder = (node: TreeNode | null) => {
        if (!node) return;
        result.push(node.value);
        traversalNodes.push(node);
        preorder(node.left);
        preorder(node.right);
      };
      preorder(root);
    } else if (traversalType === 'postorder') {
      // Left -> Right -> Root
      const postorder = (node: TreeNode | null) => {
        if (!node) return;
        postorder(node.left);
        postorder(node.right);
        result.push(node.value);
        traversalNodes.push(node);
      };
      postorder(root);
    } else if (traversalType === 'levelorder') {
      // Level by level
      const queue: TreeNode[] = [root];
      while (queue.length > 0) {
        const node = queue.shift()!;
        result.push(node.value);
        traversalNodes.push(node);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
    }
    
    setTraversalResult(result);
    
    // Animate the traversal step by step
    for (let i = 0; i < traversalNodes.length; i++) {
      setTraversalStep(i);
      
      // Clone the tree and highlight the current node
      const newRoot = cloneTree(root);
      const currentNode = findNodeByValue(newRoot, traversalNodes[i].value);
      if (currentNode) {
        currentNode.state = 'highlight';
      }
      
      calculatePositions(newRoot);
      setRoot(newRoot);
      
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }
    
    setIsTraversing(false);
    
    // Reset node states after a delay
    await new Promise(resolve => setTimeout(resolve, animationSpeed));
    resetNodeStates(root);
    calculatePositions(root);
    setRoot({ ...root });
  };

  // Helper to find a node by value
  const findNodeByValue = (node: TreeNode | null, value: number): TreeNode | null => {
    if (!node) return null;
    if (node.value === value) return node;
    
    const leftResult = findNodeByValue(node.left, value);
    if (leftResult) return leftResult;
    
    return findNodeByValue(node.right, value);
  };

  // Toggle balance factors display
  const toggleBalanceFactors = () => {
    setShowBalanceFactors(!showBalanceFactors);
  };

  // Render curved connections between nodes
  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    
    const createConnection = (node: TreeNode | null, child: TreeNode | null) => {
      if (!node || !child) return;
      
      const startX = node.x + 24;
      const startY = node.y + 24;
      const endX = child.x + 24;
      const endY = child.y;
      
      // Calculate control points for the curve
      const midY = (startY + endY) / 2;
      
      connections.push(
        <path
          key={`connection-${node.value}-${child.value}`}
          d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-muted-foreground"
        />
      );
    };
    
    const traverseConnections = (node: TreeNode | null) => {
      if (!node) return;
      
      if (node.left) {
        createConnection(node, node.left);
        traverseConnections(node.left);
      }
      
      if (node.right) {
        createConnection(node, node.right);
        traverseConnections(node.right);
      }
    };
    
    traverseConnections(root);
    return <svg className="absolute top-0 left-0 w-full h-full">{connections}</svg>;
  };

  // Render a tree node
  const renderNode = (node: TreeNode) => {
    let color = 'bg-background border-primary';
    let textColor = 'text-foreground';
    
    switch (node.state) {
      case 'highlight':
        color = 'bg-primary/20 border-primary';
        break;
      case 'selected':
        color = 'bg-destructive/20 border-destructive';
        break;
      case 'found':
        color = 'bg-green-100 border-green-500 dark:bg-green-900';
        textColor = 'text-green-800 dark:text-green-200';
        break;
      case 'new':
        color = 'bg-secondary/20 border-secondary';
        break;
      case 'balancing':
        color = 'bg-primary/40 border-primary';
        break;
    }
    
    const balance = getBalanceFactor(node);
    
    return (
      <div 
        key={`node-${node.value}`}
        className="absolute"
        style={{ 
          left: `${node.x}px`, 
          top: `${node.y}px`,
          transition: 'all 0.3s ease' 
        }}
      >
        <div className={`tree-node ${color} ${textColor} flex flex-col items-center justify-center`}>
          <span>{node.value}</span>
          {showBalanceFactors && (
            <span className="absolute -bottom-6 text-xs bg-background px-1 rounded border">
              bf:{balance}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">AVL Tree</h3>
          <p className="text-sm text-muted-foreground">
            A self-balancing binary search tree with balance factor in [-1, 0, 1]
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleBalanceFactors}
            className="whitespace-nowrap"
          >
            {showBalanceFactors ? 'Hide Balance Factors' : 'Show Balance Factors'}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="operations" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="traversal">Traversal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="flex items-center">
              <Input
                type="number"
                placeholder="Enter value"
                value={insertValue}
                onChange={(e) => setInsertValue(e.target.value)}
                className="w-28"
              />
              <Button 
                variant="outline" 
                className="ml-2"
                onClick={handleInsert}
              >
                <PlusCircle className="mr-1 h-4 w-4" /> Insert
              </Button>
            </div>
            
            <div className="flex items-center">
              <Input
                type="number"
                placeholder="Enter value"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-28"
              />
              <Button 
                variant="outline" 
                className="ml-2"
                onClick={handleSearch}
              >
                <Search className="mr-1 h-4 w-4" /> Search
              </Button>
            </div>
            
            <div className="flex items-center">
              <Input
                type="number"
                placeholder="Enter value"
                value={removeValue}
                onChange={(e) => setRemoveValue(e.target.value)}
                className="w-28"
              />
              <Button 
                variant="outline" 
                className="ml-2"
                onClick={handleRemove}
              >
                <MinusCircle className="mr-1 h-4 w-4" /> Remove
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              onClick={handleClear}
            >
              <Trash className="mr-1 h-4 w-4" /> Clear
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="traversal" className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Button 
                variant={traversalType === 'inorder' ? 'default' : 'outline'} 
                onClick={() => setTraversalType('inorder')}
              >
                <ArrowRightLeft className="mr-1 h-4 w-4" /> In-order
              </Button>
              
              <Button 
                variant={traversalType === 'preorder' ? 'default' : 'outline'} 
                onClick={() => setTraversalType('preorder')}
              >
                <ArrowDown className="mr-1 h-4 w-4" /> Pre-order
              </Button>
              
              <Button 
                variant={traversalType === 'postorder' ? 'default' : 'outline'} 
                onClick={() => setTraversalType('postorder')}
              >
                <ArrowUp className="mr-1 h-4 w-4" /> Post-order
              </Button>
              
              <Button 
                variant={traversalType === 'levelorder' ? 'default' : 'outline'} 
                onClick={() => setTraversalType('levelorder')}
              >
                <ArrowRight className="mr-1 h-4 w-4" /> Level-order
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleTraversal}
              disabled={isTraversing || !root}
            >
              Animate Traversal
            </Button>
            
            {traversalResult.length > 0 && (
              <div className="p-4 border rounded-md bg-muted/30">
                <h4 className="font-medium mb-2">Traversal Result:</h4>
                <div className="flex flex-wrap gap-2">
                  {traversalResult.map((value, index) => (
                    <div 
                      key={index} 
                      className={`w-8 h-8 flex items-center justify-center rounded-md border
                        ${index === traversalStep ? 'bg-accent text-accent-foreground' : 'bg-background'}`}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="border rounded-md p-4 relative h-96 overflow-auto">
        <div className="relative w-full h-full" style={{ minWidth: '800px', minHeight: '400px' }}>
          {renderConnections()}
          {root && traverseTree(root).map(node => renderNode(node))}
          
          {!root && (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">The tree is empty. Insert values to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to traverse the tree and get all nodes
function traverseTree(root: TreeNode): TreeNode[] {
  const result: TreeNode[] = [];
  
  function traverse(node: TreeNode | null) {
    if (!node) return;
    result.push(node);
    traverse(node.left);
    traverse(node.right);
  }
  
  traverse(root);
  return result;
}

export default AVLTreeVisualization;
