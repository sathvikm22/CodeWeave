
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  AlertCircle, PlusCircle, MinusCircle, Search, Trash, 
  ArrowDown, ArrowRightLeft, ArrowLeft, ArrowRight, ArrowUp,
  ChevronFirst, ChevronLast
} from 'lucide-react';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
  state: 'default' | 'highlight' | 'selected' | 'found' | 'new';
}

interface BinarySearchTreeVisualizationProps {
  speed: number;
  onOperationSelect: (operation: string) => void;
}

const BinarySearchTreeVisualization: React.FC<BinarySearchTreeVisualizationProps> = ({
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
  const [nodeHeight, setNodeHeight] = useState<Map<number, number>>(new Map());
  const [showHeightLabels, setShowHeightLabels] = useState<boolean>(false);

  // Calculate animation speed from the speed prop
  const animationSpeed = Math.max(100, 900 - speed * 9);
  
  // Initialize the tree with some values
  useEffect(() => {
    const initialValues = [50, 30, 70, 20, 40, 60, 80];
    let newRoot = null;
    
    for (const value of initialValues) {
      newRoot = insertNode(newRoot, value, { x: 0, y: 0 });
    }
    
    calculatePositions(newRoot);
    calculateHeights(newRoot);
    setRoot(newRoot);
  }, []);

  // Helper to insert a node into the BST
  const insertNode = (node: TreeNode | null, value: number, position: { x: number, y: number }): TreeNode => {
    if (node === null) {
      return { 
        value, 
        left: null, 
        right: null, 
        x: position.x, 
        y: position.y, 
        state: 'default' as const
      };
    }

    if (value < node.value) {
      node.left = insertNode(node.left, value, { 
        x: position.x - 60 / (position.y + 1), 
        y: position.y + 1 
      });
    } else if (value > node.value) {
      node.right = insertNode(node.right, value, { 
        x: position.x + 60 / (position.y + 1), 
        y: position.y + 1 
      });
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

  // Calculate heights for each node
  const calculateHeights = (node: TreeNode | null): number => {
    if (!node) return -1;
    
    const leftHeight = calculateHeights(node.left);
    const rightHeight = calculateHeights(node.right);
    const height = Math.max(leftHeight, rightHeight) + 1;
    
    setNodeHeight(prev => {
      const newHeights = new Map(prev);
      newHeights.set(node.value, height);
      return newHeights;
    });
    
    return height;
  };

  // Insert a new value into the tree
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
    
    // Visualize insertion process
    let current = root;
    let newRoot = { ...root! };
    let path: TreeNode[] = [];
    
    // Highlight the path for insertion
    while (current) {
      const currentCopy = { ...current, state: 'highlight' as const };
      path.push(currentCopy);
      
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
      
      // Update the tree with path highlighted
      let pathRoot = createPathTree(root, path);
      calculatePositions(pathRoot);
      setRoot(pathRoot);
      
      if (value < current.value) {
        if (!current.left) break;
        current = current.left;
      } else if (value > current.value) {
        if (!current.right) break;
        current = current.right;
      } else {
        // Value already exists (shouldn't happen due to earlier check)
        break;
      }
    }
    
    // Insert the new node
    newRoot = insertNode({ ...root! }, value, { x: 0, y: 0 });
    calculatePositions(newRoot);
    calculateHeights(newRoot);
    
    // Find and highlight the newly inserted node
    let inserted = search(newRoot, value);
    if (inserted) {
      inserted.state = 'new';
    }
    
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
    
    let current = root;
    let path: TreeNode[] = [];
    let found = false;
    
    // Visualize search process
    while (current) {
      const currentCopy = { ...current, state: 'highlight' as const };
      path.push(currentCopy);
      
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
      
      // Update the tree with path highlighted
      let pathRoot = createPathTree(root, path);
      calculatePositions(pathRoot);
      setRoot(pathRoot);
      
      if (value === current.value) {
        found = true;
        current.state = 'found';
        path[path.length - 1].state = 'found';
        
        // Update the tree with the found node
        let foundRoot = createPathTree(root, path);
        calculatePositions(foundRoot);
        setRoot(foundRoot);
        break;
      }
      
      if (value < current.value) {
        if (!current.left) break;
        current = current.left;
      } else {
        if (!current.right) break;
        current = current.right;
      }
    }
    
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
    if (!search(root, value)) {
      setError(`Value ${value} does not exist in the tree`);
      return;
    }
    
    // Visualize removal process
    let current = root;
    let path: TreeNode[] = [];
    
    // Highlight the path for removal
    while (current) {
      const currentCopy = { ...current, state: 'highlight' as const };
      path.push(currentCopy);
      
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
      
      // Update the tree with path highlighted
      let pathRoot = createPathTree(root, path);
      calculatePositions(pathRoot);
      setRoot(pathRoot);
      
      if (value === current.value) {
        current.state = 'selected';
        path[path.length - 1].state = 'selected';
        
        // Update the tree with the selected node
        let selectedRoot = createPathTree(root, path);
        calculatePositions(selectedRoot);
        setRoot(selectedRoot);
        break;
      }
      
      if (value < current.value) {
        if (!current.left) break;
        current = current.left;
      } else {
        if (!current.right) break;
        current = current.right;
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, animationSpeed));
    
    // Remove the node
    let newRoot = removeNode(cloneTree(root), value);
    calculatePositions(newRoot);
    calculateHeights(newRoot);
    setRoot(newRoot);
    
    // Reset node states after a delay
    await new Promise(resolve => setTimeout(resolve, animationSpeed * 2));
    resetNodeStates(newRoot);
    calculatePositions(newRoot);
    setRoot({ ...newRoot! });
    setRemoveValue('');
  };

  // Helper to remove a node
  const removeNode = (node: TreeNode | null, value: number): TreeNode | null => {
    if (node === null) return null;
    
    if (value < node.value) {
      node.left = removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = removeNode(node.right, value);
      return node;
    } else {
      // Case 1: Leaf Node
      if (!node.left && !node.right) {
        return null;
      }
      
      // Case 2: Node with one child
      if (!node.left) {
        return node.right;
      }
      if (!node.right) {
        return node.left;
      }
      
      // Case 3: Node with two children
      // Find the inorder successor (smallest node in the right subtree)
      let successor = node.right;
      while (successor.left !== null) {
        successor = successor.left;
      }
      
      // Replace the node's value with successor's value
      node.value = successor.value;
      
      // Remove the successor
      node.right = removeNode(node.right, successor.value);
      return node;
    }
  };

  // Helper to search for a node
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
    const nodeState: 'default' | 'highlight' | 'selected' | 'found' | 'new' = 
      pathNode ? pathNode.state : 'default';
    
    const newNode: TreeNode = {
      value: node.value,
      left: null,
      right: null,
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
    setNodeHeight(new Map());
    setTraversalResult([]);
    setTraversalStep(-1);
    setIsTraversing(false);
  };

  // Find minimum value in the tree
  const handleFindMin = async () => {
    if (!root) {
      setError('The tree is empty');
      return;
    }
    
    setOperation('findMin');
    onOperationSelect('findMin');
    setError('');
    
    let current = root;
    let path: TreeNode[] = [];
    
    // Find leftmost node
    while (current) {
      const currentCopy = { ...current, state: 'highlight' as const };
      path.push(currentCopy);
      
      // Update the tree with path highlighted
      let pathRoot = createPathTree(root, path);
      calculatePositions(pathRoot);
      setRoot(pathRoot);
      
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
      
      if (!current.left) {
        current.state = 'found';
        path[path.length - 1].state = 'found';
        
        // Update the tree with the found node
        let foundRoot = createPathTree(root, path);
        calculatePositions(foundRoot);
        setRoot(foundRoot);
        break;
      }
      
      current = current.left;
    }
    
    // Reset node states after a delay
    await new Promise(resolve => setTimeout(resolve, animationSpeed * 2));
    resetNodeStates(root);
    calculatePositions(root);
    setRoot({ ...root });
  };

  // Find maximum value in the tree
  const handleFindMax = async () => {
    if (!root) {
      setError('The tree is empty');
      return;
    }
    
    setOperation('findMax');
    onOperationSelect('findMax');
    setError('');
    
    let current = root;
    let path: TreeNode[] = [];
    
    // Find rightmost node
    while (current) {
      const currentCopy = { ...current, state: 'highlight' as const };
      path.push(currentCopy);
      
      // Update the tree with path highlighted
      let pathRoot = createPathTree(root, path);
      calculatePositions(pathRoot);
      setRoot(pathRoot);
      
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
      
      if (!current.right) {
        current.state = 'found';
        path[path.length - 1].state = 'found';
        
        // Update the tree with the found node
        let foundRoot = createPathTree(root, path);
        calculatePositions(foundRoot);
        setRoot(foundRoot);
        break;
      }
      
      current = current.right;
    }
    
    // Reset node states after a delay
    await new Promise(resolve => setTimeout(resolve, animationSpeed * 2));
    resetNodeStates(root);
    calculatePositions(root);
    setRoot({ ...root });
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

  // Toggle height labels display
  const toggleHeightLabels = () => {
    setShowHeightLabels(!showHeightLabels);
    calculateHeights(root);
  };

  // Render a tree node
  const renderNode = (node: TreeNode) => {
    let color = 'bg-background border-primary';
    let textColor = 'text-foreground';
    
    switch (node.state) {
      case 'highlight':
        color = 'bg-accent border-primary';
        break;
      case 'selected':
        color = 'bg-destructive/20 border-destructive';
        break;
      case 'found':
        color = 'bg-green-100 border-green-500';
        textColor = 'text-green-800';
        break;
      case 'new':
        color = 'bg-secondary/20 border-secondary';
        break;
    }
    
    // Get node height if available
    const height = nodeHeight.get(node.value);
    
    return (
      <div 
        key={`node-${node.value}`}
        className={`tree-node absolute ${color} ${textColor} h-12 w-12 flex items-center justify-center border-2 rounded-full`}
        style={{ 
          left: `${node.x}px`, 
          top: `${node.y}px`,
          transition: 'all 0.3s ease' 
        }}
      >
        {node.value}
        {showHeightLabels && height !== undefined && (
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
            h:{height}
          </div>
        )}
      </div>
    );
  };

  // Render connections between nodes
  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    
    const createConnection = (node: TreeNode | null, child: TreeNode | null) => {
      if (!node || !child) return;
      
      const startX = node.x + 24;
      const startY = node.y + 24;
      const endX = child.x + 24;
      const endY = child.y + 24;
      
      const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
      
      connections.push(
        <div
          key={`connection-${node.value}-${child.value}`}
          className="absolute bg-muted-foreground"
          style={{
            width: `${length}px`,
            height: '2px',
            left: `${startX}px`,
            top: `${startY}px`,
            transformOrigin: '0 0',
            transform: `rotate(${angle}deg)`,
            transition: 'all 0.3s ease'
          }}
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
    return connections;
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Binary Search Tree</h3>
          <p className="text-sm text-muted-foreground">
            A tree data structure with ordering: left child &lt; parent &lt; right child
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleHeightLabels}
            className="whitespace-nowrap"
          >
            {showHeightLabels ? 'Hide Heights' : 'Show Heights'}
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
              onClick={handleFindMin}
            >
              <ChevronFirst className="mr-1 h-4 w-4" /> Find Min
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleFindMax}
            >
              <ChevronLast className="mr-1 h-4 w-4" /> Find Max
            </Button>
            
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

export default BinarySearchTreeVisualization;
