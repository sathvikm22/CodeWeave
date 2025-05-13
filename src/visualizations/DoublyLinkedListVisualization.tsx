
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Node {
  value: number | string;
  next: number | null;
  prev: number | null;
}

interface DoublyLinkedListVisualizationProps {
  speed: number;
  onOperationSelect?: (operation: string) => void;
}

const DoublyLinkedListVisualization: React.FC<DoublyLinkedListVisualizationProps> = ({ speed, onOperationSelect }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [head, setHead] = useState<number | null>(null);
  const [tail, setTail] = useState<number | null>(null);
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);
  const [animationType, setAnimationType] = useState<'insert' | 'delete' | 'search' | 'none'>('none');
  const [valueInput, setValueInput] = useState<string>('');
  const [positionInput, setPositionInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [size, setSize] = useState<number>(0);
  const [maxSize, setMaxSize] = useState<number>(10);
  const [sizeInput, setSizeInput] = useState<string>('10');
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Animation speed factor
  const speedFactor = Math.max(1, 11 - Math.floor(speed / 10));
  
  // Reset animation state after animation duration
  useEffect(() => {
    if (animatedIndex !== null) {
      const timeout = setTimeout(() => {
        setAnimatedIndex(null);
        setAnimationType('none');
      }, 600 * speedFactor);
      return () => clearTimeout(timeout);
    }
  }, [animatedIndex, speedFactor]);

  // Initialize linked list
  const initializeList = (newSize: number) => {
    if (newSize < 0 || newSize > 20) {
      toast({
        title: "Invalid Size",
        description: "List size must be between 0 and 20",
        variant: "destructive"
      });
      return;
    }
    
    setMaxSize(newSize);
    
    // Start with an empty list regardless of the max size
    setNodes([]);
    setHead(null);
    setTail(null);
    setSize(0);
    setMessage(`Initialized a new empty doubly linked list with max size ${newSize}`);
  };

  // Helper to get the node at a specific position (0-indexed)
  const getNodeAtPosition = (position: number): number | null => {
    if (position < 0 || head === null) return null;
    
    let current = head;
    let currentPosition = 0;
    
    while (current !== null && currentPosition < position) {
      if (nodes[current].next === null) return null;
      current = nodes[current].next;
      currentPosition++;
    }
    
    return current;
  };

  // Insert a node at the beginning (head)
  const handleInsertAtHead = () => {
    const value = valueInput.trim();
    
    if (!value) {
      toast({
        title: "Error",
        description: "Please enter a value",
        variant: "destructive"
      });
      return;
    }
    
    if (size >= maxSize) {
      toast({
        title: "List Full",
        description: `Cannot insert more than ${maxSize} nodes`,
        variant: "destructive"
      });
      return;
    }
    
    const newNodeIndex = nodes.length;
    const newNode: Node = { 
      value, 
      next: head,
      prev: null
    };
    
    setNodes([...nodes, newNode]);
    
    if (head !== null) {
      // Update the prev pointer of the current head
      setNodes(prev => {
        const updated = [...prev];
        updated[head] = { ...updated[head], prev: newNodeIndex };
        return updated;
      });
    } else {
      // If this is the first node, it's also the tail
      setTail(newNodeIndex);
    }
    
    setHead(newNodeIndex);
    setSize(size + 1);
    setAnimatedIndex(newNodeIndex);
    setAnimationType('insert');
    setMessage(`Inserted ${value} at the head`);
    setValueInput('');

    if (onOperationSelect) {
      onOperationSelect('insertAtHead');
    }
  };

  // Insert a node at the end (tail)
  const handleInsertAtTail = () => {
    const value = valueInput.trim();
    
    if (!value) {
      toast({
        title: "Error",
        description: "Please enter a value",
        variant: "destructive"
      });
      return;
    }
    
    if (size >= maxSize) {
      toast({
        title: "List Full",
        description: `Cannot insert more than ${maxSize} nodes`,
        variant: "destructive"
      });
      return;
    }
    
    const newNodeIndex = nodes.length;
    const newNode: Node = { 
      value, 
      next: null,
      prev: tail
    };
    
    setNodes([...nodes, newNode]);
    
    if (tail !== null) {
      // Update the next pointer of the current tail
      setNodes(prev => {
        const updated = [...prev];
        updated[tail] = { ...updated[tail], next: newNodeIndex };
        return updated;
      });
    } else {
      // If this is the first node, it's also the head
      setHead(newNodeIndex);
    }
    
    setTail(newNodeIndex);
    setSize(size + 1);
    setAnimatedIndex(newNodeIndex);
    setAnimationType('insert');
    setMessage(`Inserted ${value} at the tail`);
    setValueInput('');

    if (onOperationSelect) {
      onOperationSelect('insertAtTail');
    }
  };
  
  // Insert a node at a specific position
  const handleInsertAtPosition = () => {
    const value = valueInput.trim();
    const position = parseInt(positionInput);
    
    if (!value) {
      toast({
        title: "Error",
        description: "Please enter a value",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(position) || position < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid position (>= 0)",
        variant: "destructive"
      });
      return;
    }
    
    if (size >= maxSize) {
      toast({
        title: "List Full",
        description: `Cannot insert more than ${maxSize} nodes`,
        variant: "destructive"
      });
      return;
    }
    
    if (position === 0) {
      // Insert at head
      handleInsertAtHead();
      return;
    }
    
    if (position >= size) {
      // Insert at tail
      handleInsertAtTail();
      return;
    }
    
    const prevNode = getNodeAtPosition(position - 1);
    
    if (prevNode === null) {
      toast({
        title: "Error",
        description: "Position out of bounds",
        variant: "destructive"
      });
      return;
    }
    
    const nextNodeIndex = nodes[prevNode].next;
    
    const newNodeIndex = nodes.length;
    const newNode: Node = { 
      value, 
      next: nextNodeIndex,
      prev: prevNode
    };
    
    setNodes([...nodes, newNode]);
    
    // Update the next pointer of the prev node
    setNodes(prev => {
      const updated = [...prev];
      updated[prevNode] = { ...updated[prevNode], next: newNodeIndex };
      return updated;
    });
    
    // Update the prev pointer of the next node
    if (nextNodeIndex !== null) {
      setNodes(prev => {
        const updated = [...prev];
        updated[nextNodeIndex] = { ...updated[nextNodeIndex], prev: newNodeIndex };
        return updated;
      });
    }
    
    setSize(size + 1);
    setAnimatedIndex(newNodeIndex);
    setAnimationType('insert');
    setMessage(`Inserted ${value} at position ${position}`);
    setValueInput('');
    setPositionInput('');

    if (onOperationSelect) {
      onOperationSelect('insertAtPosition');
    }
  };

  // Delete the head node
  const handleDeleteHead = () => {
    if (size === 0 || head === null) {
      toast({
        title: "Error",
        description: "List is empty",
        variant: "destructive"
      });
      return;
    }
    
    const headValue = nodes[head].value;
    const nextHead = nodes[head].next;
    
    setAnimatedIndex(head);
    setAnimationType('delete');
    
    setTimeout(() => {
      if (nextHead !== null) {
        // Update the prev pointer of the new head
        setNodes(prev => {
          const updated = [...prev];
          updated[nextHead] = { ...updated[nextHead], prev: null };
          return updated;
        });
      } else {
        // If this was the only node, update tail to null
        setTail(null);
      }
      
      setHead(nextHead);
      setSize(size - 1);
      setMessage(`Deleted ${headValue} from the head`);

      if (onOperationSelect) {
        onOperationSelect('deleteHead');
      }
    }, 500 * speedFactor);
  };
  
  // Delete the tail node
  const handleDeleteTail = () => {
    if (size === 0 || tail === null) {
      toast({
        title: "Error",
        description: "List is empty",
        variant: "destructive"
      });
      return;
    }
    
    const tailValue = nodes[tail].value;
    const prevTail = nodes[tail].prev;
    
    setAnimatedIndex(tail);
    setAnimationType('delete');
    
    setTimeout(() => {
      if (prevTail !== null) {
        // Update the next pointer of the new tail
        setNodes(prev => {
          const updated = [...prev];
          updated[prevTail] = { ...updated[prevTail], next: null };
          return updated;
        });
      } else {
        // If this was the only node, update head to null
        setHead(null);
      }
      
      setTail(prevTail);
      setSize(size - 1);
      setMessage(`Deleted ${tailValue} from the tail`);

      if (onOperationSelect) {
        onOperationSelect('deleteTail');
      }
    }, 500 * speedFactor);
  };
  
  // Delete a node at a specific position
  const handleDeleteAtPosition = () => {
    const position = parseInt(positionInput);
    
    if (isNaN(position) || position < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid position (>= 0)",
        variant: "destructive"
      });
      return;
    }
    
    if (size === 0) {
      toast({
        title: "Error",
        description: "List is empty",
        variant: "destructive"
      });
      return;
    }
    
    if (position === 0) {
      // Delete head
      handleDeleteHead();
      return;
    }
    
    if (position === size - 1) {
      // Delete tail
      handleDeleteTail();
      return;
    }
    
    if (position >= size) {
      toast({
        title: "Error",
        description: "Position out of bounds",
        variant: "destructive"
      });
      return;
    }
    
    const targetNode = getNodeAtPosition(position);
    
    if (targetNode === null) {
      toast({
        title: "Error",
        description: "Position out of bounds",
        variant: "destructive"
      });
      return;
    }
    
    const prevNodeIndex = nodes[targetNode].prev;
    const nextNodeIndex = nodes[targetNode].next;
    const targetValue = nodes[targetNode].value;
    
    setAnimatedIndex(targetNode);
    setAnimationType('delete');
    
    setTimeout(() => {
      // Connect the prev and next nodes
      if (prevNodeIndex !== null && nextNodeIndex !== null) {
        setNodes(prev => {
          const updated = [...prev];
          updated[prevNodeIndex] = { ...updated[prevNodeIndex], next: nextNodeIndex };
          updated[nextNodeIndex] = { ...updated[nextNodeIndex], prev: prevNodeIndex };
          return updated;
        });
      }
      
      setSize(size - 1);
      setMessage(`Deleted ${targetValue} from position ${position}`);

      if (onOperationSelect) {
        onOperationSelect('deleteAtPosition');
      }
    }, 500 * speedFactor);
    
    setPositionInput('');
  };

  // Search for a value in the list
  const handleSearch = () => {
    const value = valueInput.trim();
    
    if (!value) {
      toast({
        title: "Error",
        description: "Please enter a value to search",
        variant: "destructive"
      });
      return;
    }
    
    if (size === 0) {
      toast({
        title: "Error",
        description: "List is empty",
        variant: "destructive"
      });
      return;
    }
    
    let current = head;
    let position = 0;
    let found = false;
    
    const animateSearch = (index: number, pos: number) => {
      setTimeout(() => {
        setAnimatedIndex(index);
        setAnimationType('search');
        
        if (nodes[index].value.toString() === value) {
          found = true;
          setMessage(`Found ${value} at position ${pos}`);
        }
        
        const next = nodes[index].next;
        if (next !== null && !found) {
          position++;
          animateSearch(next, pos + 1);
        } else if (!found) {
          setTimeout(() => {
            setMessage(`${value} not found in the list`);
            toast({
              title: "Not Found",
              description: `${value} not found in the list`,
            });
          }, 300 * speedFactor);
        }
      }, 500 * speedFactor);
    };
    
    if (current !== null) {
      animateSearch(current, position);
    } else {
      setMessage("List is empty");
    }
    
    setValueInput('');

    if (onOperationSelect) {
      onOperationSelect('search');
    }
  };

  // Reset the list to empty with initial size
  const handleReset = () => {
    setNodes([]);
    setHead(null);
    setTail(null);
    setSize(0);
    setAnimatedIndex(null);
    setAnimationType('none');
    setMessage('Doubly linked list reset to empty');
    setValueInput('');
    setPositionInput('');

    if (onOperationSelect) {
      onOperationSelect('reset');
    }
  };

  const getAnimationClass = (index: number) => {
    if (animatedIndex === index) {
      switch (animationType) {
        case 'insert':
          return 'animate-pop-in bg-green-200 dark:bg-green-800 border-green-500';
        case 'delete':
          return 'bg-red-200 dark:bg-red-800 border-red-500 opacity-50';
        case 'search':
          return 'bg-yellow-200 dark:bg-yellow-800 border-yellow-500';
        default:
          return '';
      }
    }
    return '';
  };

  const renderLinkedList = () => {
    if (size === 0) {
      return (
        <div className="text-center text-muted-foreground p-8">
          Empty List (Max Size: {maxSize})
        </div>
      );
    }
    
    const listItems = [];
    let current = head;
    let i = 0;
    
    while (current !== null && i < maxSize) {
      const node = nodes[current];
      
      listItems.push(
        <div key={i} className="flex flex-col items-center mx-1">
          <div className="text-xs text-muted-foreground mb-1">
            {i === 0 ? 'Head' : i === size - 1 ? 'Tail' : `Node ${i}`}
          </div>
          <div className="flex items-center">
            {node.prev !== null && (
              <div className="flex items-center mx-1">
                <ChevronLeft className="text-muted-foreground" size={16} />
              </div>
            )}
            
            <div 
              className={`ds-node w-14 h-14 rounded-full border-2 flex items-center justify-center ${getAnimationClass(current)}`}
              style={{ transitionDuration: `${speedFactor * 300}ms` }}
            >
              {node.value}
            </div>
            
            {node.next !== null && (
              <div className="flex items-center mx-1">
                <ChevronRight className="text-muted-foreground" size={16} />
              </div>
            )}
          </div>
        </div>
      );
      
      current = node.next;
      i++;
    }
    
    return (
      <div className="flex flex-wrap justify-center items-center">
        {listItems}
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
          List Size: {size} / {maxSize}
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
      
      {/* Linked list visualization */}
      <div className="p-6 border border-border rounded-md w-full overflow-x-auto min-h-[150px]">
        {renderLinkedList()}
      </div>
      
      {/* Operation controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {/* Insert operations */}
        <div className="space-y-2 p-4 rounded-md border border-border">
          <h3 className="font-medium text-sm mb-2">Insert Value</h3>
          <div className="flex flex-col gap-2">
            <Input 
              type="text" 
              placeholder="Value" 
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={handleInsertAtHead}
                className="w-full"
                disabled={size >= maxSize}
              >
                Insert at Head
              </Button>
              <Button 
                variant="outline" 
                onClick={handleInsertAtTail}
                className="w-full"
                disabled={size >= maxSize}
              >
                Insert at Tail
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Input 
                type="number" 
                placeholder="Position" 
                min="0"
                value={positionInput}
                onChange={(e) => setPositionInput(e.target.value)}
                className="w-full"
              />
              <Button 
                variant="outline" 
                onClick={handleInsertAtPosition}
                className="whitespace-nowrap"
                disabled={size >= maxSize}
              >
                <Plus size={16} className="mr-2" /> Insert
              </Button>
            </div>
          </div>
        </div>
        
        {/* Delete and search operations */}
        <div className="space-y-2 p-4 rounded-md border border-border">
          <h3 className="font-medium text-sm mb-2">List Operations</h3>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={handleDeleteHead}
                className="w-full"
                disabled={size === 0}
              >
                <Trash2 size={16} className="mr-2" /> Delete Head
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDeleteTail}
                className="w-full"
                disabled={size === 0}
              >
                <Trash2 size={16} className="mr-2" /> Delete Tail
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input 
                type="number" 
                placeholder="Position" 
                min="0"
                value={positionInput}
                onChange={(e) => setPositionInput(e.target.value)}
                className="w-full"
              />
              <Button 
                variant="outline" 
                onClick={handleDeleteAtPosition}
                className="whitespace-nowrap"
                disabled={size === 0}
              >
                <Trash2 size={16} className="mr-2" /> Delete
              </Button>
            </div>
            
            <div className="flex gap-2 mt-2">
              <Input 
                type="text" 
                placeholder="Value" 
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                className="w-full"
              />
              <Button 
                variant="outline" 
                onClick={handleSearch}
                className="whitespace-nowrap"
                disabled={size === 0}
              >
                <Search size={16} className="mr-2" /> Search
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="w-full mt-2"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
      
      {/* Size Dialog */}
      <Dialog open={isSizeDialogOpen} onOpenChange={setIsSizeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Maximum List Size</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              placeholder="Enter max size (1-20)"
              min="1"
              max="20"
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
              onClick={() => {
                const newSize = parseInt(sizeInput);
                if (!isNaN(newSize)) {
                  initializeList(newSize);
                  setIsSizeDialogOpen(false);
                } else {
                  toast({
                    title: "Error",
                    description: "Please enter a valid number",
                    variant: "destructive"
                  });
                }
              }}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoublyLinkedListVisualization;
