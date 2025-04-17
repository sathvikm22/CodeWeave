import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, PlusCircle, MinusCircle, Search, RotateCcw, Trash } from 'lucide-react';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  height: number;
  x: number;
  y: number;
  state: 'default' | 'highlight' | 'selected' | 'found' | 'new' | 'rotated';
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
  const [history, setHistory] = useState<TreeNode[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Calculate animation speed from the speed prop
  const animationSpeed = Math.max(100, 900 - speed * 9);
  
  // Initialize the tree with some values
  useEffect(() => {
    const initialValues = [30, 20, 40, 10, 25, 35, 50];
    let newRoot = null;
    
    for (const value of initialValues) {
      newRoot = insertNodeAVL(newRoot, value);
    }
    
    calculatePositions(newRoot);
    setRoot(newRoot);
    
    if (newRoot) {
      setHistory([[{ ...newRoot }]]);
      setHistoryIndex(0);
    }
  }, []);

  // Helper to get height of a node
  const height = (node: TreeNode | null): number => {
    if (node === null) return 0;
    return node.height;
  };

  // Helper to get the balance factor of a node
  const getBalanceFactor = (node: TreeNode | null): number => {
    if (node === null) return 0;
    return height(node.left) - height(node.right);
  };

  // Helper to get the maximum of two numbers
  const max = (a: number, b: number): number => {
    return a > b ? a : b;
  };

  // Right rotation
  const rightRotate = (y: TreeNode): TreeNode => {
    const x = y.left!;
    const T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    y.height = max(height(y.left), height(y.right)) + 1;
    x.height = max(height(x.left), height(x.right)) + 1;

    // Mark rotated nodes
    x.state = 'rotated';
    y.state = 'rotated';

    return x;
  };

  // Left rotation
  const leftRotate = (x: TreeNode): TreeNode => {
    const y = x.right!;
    const T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update heights
    x.height = max(height(x.left), height(x.right)) + 1;
    y.height = max(height(y.left), height(y.right)) + 1;

    // Mark rotated nodes
    y.state = 'rotated';
    x.state = 'rotated';

    return y;
  };

  // Insert a node into AVL tree
  const insertNodeAVL = (node: TreeNode | null, value: number): TreeNode => {
    // Perform standard BST insertion
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
      node.left = insertNodeAVL(node.left, value);
    } else if (value > node.value) {
      node.right = insertNodeAVL(node.right, value);
    } else {
      // Duplicate value, do nothing
      return node;
    }

    // Update height of current node
    node.height = max(height(node.left), height(node.right)) + 1;

    // Get the balance factor to check if this node became unbalanced
    const balance = getBalanceFactor(node);

    // Left-Left Case
    if (balance > 1 && node.left && value < node.left.value) {
      return rightRotate(node);
    }

    // Right-Right Case
    if (balance < -1 && node.right && value > node.right.value) {
      return leftRotate(node);
    }

    // Left-Right Case
    if (balance > 1 && node.left && value > node.left.value) {
      node.left = leftRotate(node.left);
      return rightRotate(node);
    }

    // Right-Left Case
    if (balance < -1 && node.right && value < node.right.value) {
      node.right = rightRotate(node.right);
      return leftRotate(node);
    }

    return node;
  };

  // Remove a node from AVL tree
  const removeNodeAVL = (node: TreeNode | null, value: number): TreeNode | null => {
    if (node === null) return null;

    if (value < node.value) {
      node.left = removeNodeAVL(node.left, value);
    } else if (value > node.value) {
      node.right = removeNodeAVL(node.right, value);
    } else {
      // Node to be deleted found

      // Case 1: Node with only one child or no child
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      // Case 2: Node with two children
      // Get the inorder successor (smallest in the right subtree)
      let successor = node.right;
      while (successor.left !== null) {
        successor = successor.left;
      }

      // Copy the successor's value to this node
      node.value = successor.value;

      // Delete the successor
      node.right = removeNodeAVL(node.right, successor.value);
    }

    // If the tree had only one node, return
    if (node === null) return null;

    // Update height
    node.height = max(height(node.left), height(node.right)) + 1;

    // Get the balance factor
    const balance = getBalanceFactor(node);

    // Left-Left Case
    if (balance > 1 && getBalanceFactor(node.left) >= 0) {
      return rightRotate(node);
    }

    // Left-Right Case
    if (balance > 1 && getBalanceFactor(node.left) < 0) {
      node.left = leftRotate(node.left!);
      return rightRotate(node);
    }

    // Right-Right Case
    if (balance < -1 && getBalanceFactor(node.right) <= 0) {
      return leftRotate(node);
    }

    // Right-Left Case
    if (balance < -1 && getBalanceFactor(node.right) > 0) {
      node.right = rightRotate(node.right!);
      return leftRotate(node);
    }

    return node;
  };

  // Calculate positions for rendering the tree
  const calculatePositions = (node: TreeNode | null, depth: number = 0, position: number = 0): void => {
    if (!node) return;

    const width = 800;
    const height = 70;
    const xOffset = width / Math.pow(2, depth + 1);
    
    node.x = width / 2 + position * xOffset;
    node.y = depth * height + 40;
    
    calculatePositions(node.left, depth + 1, position * 2 - 1);
    calculatePositions(node.right, depth + 1, position * 2 + 1);
  };

  // Insert a new value into the tree with animation
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
    
    // Insert the new node with balancing
    let newRoot = insertNodeAVL(cloneTree(root), value);
    calculatePositions(newRoot);
    
    // Find and highlight the newly inserted node
    let inserted = search(newRoot, value);
    if (inserted) {
      inserted.state = 'new';
    }
    
    setRoot(newRoot);
    
    // Add to history
    const updatedHistory = [...history.slice(0, historyIndex + 1), traverseTree(newRoot)];
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    
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
    
    // Remove the node with balancing
    let newRoot = removeNodeAVL(cloneTree(root), value);
    calculatePositions(newRoot);
    setRoot(newRoot);
    
    // Add to history
    if (newRoot) {
      const updatedHistory = [...history.slice(0, historyIndex + 1), traverseTree(newRoot)];
      setHistory(updatedHistory);
      setHistoryIndex(updatedHistory.length - 1);
    }
    
    // Reset node states after a delay
    await new Promise(resolve => setTimeout(resolve, animationSpeed * 2));
    resetNodeStates(newRoot);
    calculatePositions(newRoot);
    setRoot({ ...newRoot! });
    setRemoveValue('');
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
    const nodeState: 'default' | 'highlight' | 'selected' | 'found' | 'new' | 'rotated' = 
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
    setHistory([]);
    setHistoryIndex(-1);
  };

  // Undo last operation
  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      const reconstructedTree = reconstructTree(previousState);
      calculatePositions(reconstructedTree);
      setRoot(reconstructedTree);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Helper to reconstruct tree from traversal
  const reconstructTree = (nodes: TreeNode[]): TreeNode | null => {
    if (nodes.length === 0) return null;
    
    let root: TreeNode | null = null;
    
    for (const node of nodes) {
      root = insertNodeAVL(root, node.value);
    }
    
    return root;
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
      case 'rotated':
        color = 'bg-orange-100 border-orange-500';
        textColor = 'text-orange-800';
        break;
    }
    
    // Calculate the balance factor for display
    const balanceFactor = getBalanceFactor({ ...node, x: 0, y: 0 });
    
    return (
      <div 
        key={`node-${node.value}`}
        className={`tree-node absolute flex flex-col items-center justify-center ${color} ${textColor} h-14 w-14`}
        style={{ 
          left: `${node.x}px`, 
          top: `${node.y}px`,
          transition: 'all 0.3s ease' 
        }}
      >
        <div>{node.value}</div>
        <div className="text-[8px] text-muted-foreground">{balanceFactor}</div>
      </div>
    );
  };

  // Render connections between nodes
  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    
    const createConnection = (node: TreeNode | null, child: TreeNode | null) => {
      if (!node || !child) return;
      
      const startX = node.x + 28;
      const startY = node.y + 28;
      const endX = child.x + 28;
      const endY = child.y + 28;
      
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
          <h3 className="text-lg font-semibold">AVL Tree</h3>
          <p className="text-sm text-muted-foreground">
            A self-balancing binary search tree with balance factor -1, 0, or 1
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-2">
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
          
          <Button 
            variant="outline" 
            className="ml-2"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
          >
            <RotateCcw className="mr-1 h-4 w-4" /> Undo
          </Button>
          
          <Button 
            variant="outline" 
            className="ml-2"
            onClick={handleClear}
          >
            <Trash className="mr-1 h-4 w-4" /> Clear
          </Button>
        </div>
      </div>
      
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
      
      <div className="flex flex-col space-y-1">
        <h4 className="text-sm font-medium">Legend:</h4>
        <div className="flex space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-accent border border-primary mr-1"></div>
            <span>Comparing</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 border border-green-500 mr-1"></div>
            <span>Found</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-100 border border-orange-500 mr-1"></div>
            <span>Rotated</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-destructive/20 border border-destructive mr-1"></div>
            <span>To Remove</span>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground p-2 border rounded-md">
        <span className="font-bold">Note:</span> The numbers inside each node show the value and the balance factor (difference in height between left and right subtrees).
      </div>
    </div>
  );
};

// Helper function to traverse the tree and get all nodes
function traverseTree(root: TreeNode | null): TreeNode[] {
  const result: TreeNode[] = [];
  
  function traverse(node: TreeNode | null) {
    if (!node) return;
    result.push(node);
    traverse(node.left);
    traverse(node.right);
  }
  
  if (root) traverse(root);
  return result;
}

export default AVLTreeVisualization;
