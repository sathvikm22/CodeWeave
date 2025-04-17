
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCw, Settings, ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface LinkedListNode {
  value: number | string;
  next: number | null;
}

interface LinkedListVisualizationProps {
  speed: number;
  onOperationSelect?: (operation: string) => void;
}

const LinkedListVisualization: React.FC<LinkedListVisualizationProps> = ({ speed, onOperationSelect }) => {
  const [nodes, setNodes] = useState<LinkedListNode[]>([]);
  const [head, setHead] = useState<number | null>(null);
  const [tail, setTail] = useState<number | null>(null); // Added tail pointer
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);
  const [animationType, setAnimationType] = useState<'insert' | 'delete' | 'none'>('none');
  const [valueInput, setValueInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [maxSize, setMaxSize] = useState<number>(5); // Changed default to 5
  const [sizeInput, setSizeInput] = useState<string>('5'); // Changed default to 5
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

  // Handle insert at head
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
    
    if (nodes.length >= maxSize) {
      toast({
        title: "List Full",
        description: `Cannot insert more than ${maxSize} nodes`,
        variant: "destructive"
      });
      setMessage(`List Full: Maximum size of ${maxSize} reached`);
      return;
    }
    
    const newNodeIdx = nodes.length;
    const newNode: LinkedListNode = {
      value,
      next: head
    };
    
    setNodes([...nodes, newNode]);
    setHead(newNodeIdx);
    
    // If this is the first node, it's also the tail
    if (tail === null) {
      setTail(newNodeIdx);
    }
    
    setAnimatedIndex(newNodeIdx);
    setAnimationType('insert');
    setMessage(`Inserted ${value} at the head of the list`);
    setValueInput('');
    
    // Report the operation
    if (onOperationSelect) {
      onOperationSelect('insertAtHead');
    }
  };
  
  // Handle insert at tail
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
    
    if (nodes.length >= maxSize) {
      toast({
        title: "List Full",
        description: `Cannot insert more than ${maxSize} nodes`,
        variant: "destructive"
      });
      setMessage(`List Full: Maximum size of ${maxSize} reached`);
      return;
    }
    
    const newNodeIdx = nodes.length;
    const newNode: LinkedListNode = {
      value,
      next: null
    };
    
    // Update the current tail's next pointer if the list is not empty
    if (tail !== null) {
      setNodes(prev => {
        const updated = [...prev];
        updated[tail] = {
          ...updated[tail],
          next: newNodeIdx
        };
        return updated;
      });
    }
    
    setNodes(prev => [...prev, newNode]);
    setTail(newNodeIdx);
    
    // If this is the first node, it's also the head
    if (head === null) {
      setHead(newNodeIdx);
    }
    
    setAnimatedIndex(newNodeIdx);
    setAnimationType('insert');
    setMessage(`Inserted ${value} at the tail of the list`);
    setValueInput('');
    
    // Report the operation
    if (onOperationSelect) {
      onOperationSelect('insertAtTail');
    }
  };
  
  // Handle remove from head
  const handleRemoveFromHead = () => {
    if (head === null) {
      toast({
        title: "Empty List",
        description: "The list is empty",
        variant: "destructive"
      });
      setMessage("Empty List: Cannot remove from an empty list");
      return;
    }
    
    const removedValue = nodes[head].value;
    const nextNode = nodes[head].next;
    
    setAnimatedIndex(head);
    setAnimationType('delete');
    
    setTimeout(() => {
      // If this is the only node
      if (head === tail) {
        setTail(null);
      }
      
      setHead(nextNode);
      setMessage(`Removed ${removedValue} from the head of the list`);
      
      // Report the operation
      if (onOperationSelect) {
        onOperationSelect('removeFromHead');
      }
    }, 500 * speedFactor);
  };
  
  // Handle remove from tail
  const handleRemoveFromTail = () => {
    if (tail === null) {
      toast({
        title: "Empty List",
        description: "The list is empty",
        variant: "destructive"
      });
      setMessage("Empty List: Cannot remove from an empty list");
      return;
    }
    
    const removedValue = nodes[tail].value;
    
    setAnimatedIndex(tail);
    setAnimationType('delete');
    
    setTimeout(() => {
      // If this is the only node
      if (head === tail) {
        setHead(null);
        setTail(null);
        setMessage(`Removed ${removedValue} from the list`);
        return;
      }
      
      // Find the second-to-last node
      let penultimate = head;
      while (penultimate !== null && nodes[penultimate].next !== tail) {
        penultimate = nodes[penultimate].next;
      }
      
      if (penultimate !== null) {
        // Update the second-to-last node to point to null
        setNodes(prev => {
          const updated = [...prev];
          updated[penultimate] = {
            ...updated[penultimate],
            next: null
          };
          return updated;
        });
        
        // Update tail
        setTail(penultimate);
      }
      
      setMessage(`Removed ${removedValue} from the tail of the list`);
      
      // Report the operation
      if (onOperationSelect) {
        onOperationSelect('removeFromTail');
      }
    }, 500 * speedFactor);
  };
  
  // Reset the list
  const handleReset = () => {
    setNodes([]);
    setHead(null);
    setTail(null);
    setAnimatedIndex(null);
    setAnimationType('none');
    setMessage('Linked list reset to empty');
    setValueInput('');
    
    // Report the operation
    if (onOperationSelect) {
      onOperationSelect('reset');
    }
  };
  
  // Set the maximum list size
  const handleSetMaxSize = () => {
    const size = parseInt(sizeInput);
    if (isNaN(size) || size < 1 || size > 15) {
      toast({
        title: "Invalid Size",
        description: "List size must be between 1 and 15",
        variant: "destructive"
      });
      return;
    }
    
    if (nodes.length > size) {
      toast({
        title: "Warning",
        description: `Current list has ${nodes.length} nodes, which exceeds the new max. Consider resetting.`,
      });
    }
    
    setMaxSize(size);
    setIsSizeDialogOpen(false);
    setMessage(`Maximum list size set to ${size}`);
    
    // Report the operation
    if (onOperationSelect) {
      onOperationSelect('resize');
    }
  };

  const getAnimationClass = (index: number) => {
    if (animatedIndex === index) {
      switch (animationType) {
        case 'insert':
          return 'animate-pop-in bg-green-200 dark:bg-green-800 border-green-500';
        case 'delete':
          return 'bg-red-200 dark:bg-red-800 border-red-500 opacity-50';
        default:
          return '';
      }
    }
    return '';
  };

  // Renders the linked list
  const renderLinkedList = () => {
    if (head === null) {
      return (
        <div className="flex items-center justify-center h-24 text-muted-foreground">
          Empty Linked List
        </div>
      );
    }
    
    // Build an array of nodes in the order they appear in the list
    const orderedNodes: number[] = [];
    let current = head;
    
    while (current !== null) {
      orderedNodes.push(current);
      current = nodes[current].next;
    }
    
    return (
      <div className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center space-x-4 p-4">
          {orderedNodes.map((nodeIdx, index) => (
            <div key={nodeIdx} className="flex flex-col items-center">
              <div className="flex items-center">
                {/* Head pointer */}
                {nodeIdx === head && (
                  <div className="absolute -top-10 flex flex-col items-center">
                    <ArrowLeftCircle className="text-primary" size={20} />
                    <span className="text-xs text-primary font-medium">Head</span>
                  </div>
                )}
                
                {/* Tail pointer */}
                {nodeIdx === tail && (
                  <div className="absolute -top-10 flex flex-col items-center">
                    <ArrowRightCircle className="text-secondary" size={20} />
                    <span className="text-xs text-secondary font-medium">Tail</span>
                  </div>
                )}
                
                {/* Node */}
                <div 
                  className={`relative w-16 h-16 flex items-center justify-center rounded-full border-2 ${getAnimationClass(nodeIdx)}`}
                  style={{
                    transitionDuration: `${speedFactor * 300}ms`,
                  }}
                >
                  <div className="text-lg font-medium">{nodes[nodeIdx].value}</div>
                </div>
                
                {/* Arrow to next node */}
                {index < orderedNodes.length - 1 && (
                  <div className="w-6 h-4 flex items-center justify-center mx-1">
                    <svg width="24" height="8" viewBox="0 0 24 8">
                      <path 
                        d="M0,4 H18 M14,1 L18,4 L14,7" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        fill="none" 
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
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
          List Size: {nodes.length} / {maxSize}
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
      <div className="relative p-6 border border-border rounded-md w-full max-w-2xl min-h-[150px]">
        {renderLinkedList()}
      </div>
      
      {/* Operation controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        {/* Insert operations */}
        <div className="space-y-2 p-4 rounded-md border border-border">
          <h3 className="font-medium text-sm mb-2">Insert Operations</h3>
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
                disabled={nodes.length >= maxSize}
              >
                <Plus size={16} className="mr-2" /> At Head
              </Button>
              <Button 
                variant="outline" 
                onClick={handleInsertAtTail}
                className="w-full"
                disabled={nodes.length >= maxSize}
              >
                <Plus size={16} className="mr-2" /> At Tail
              </Button>
            </div>
          </div>
        </div>
        
        {/* Delete and reset operations */}
        <div className="space-y-2 p-4 rounded-md border border-border">
          <h3 className="font-medium text-sm mb-2">Remove Operations</h3>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={handleRemoveFromHead}
                className="w-full"
                disabled={head === null}
              >
                <Trash2 size={16} className="mr-2" /> From Head
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRemoveFromTail}
                className="w-full"
                disabled={tail === null}
              >
                <Trash2 size={16} className="mr-2" /> From Tail
              </Button>
            </div>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="w-full"
            >
              <RefreshCw size={16} className="mr-2" /> Reset
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
              placeholder="Enter max size (1-15)"
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

export default LinkedListVisualization;
