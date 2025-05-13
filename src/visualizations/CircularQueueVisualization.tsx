
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface CircularQueueVisualizationProps {
  speed: number;
  onOperationSelect?: (operation: string) => void;
}

const CircularQueueVisualization: React.FC<CircularQueueVisualizationProps> = ({ speed, onOperationSelect }) => {
  const [queue, setQueue] = useState<(number | string | null)[]>([]);
  const [front, setFront] = useState<number>(-1);
  const [rear, setRear] = useState<number>(-1);
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);
  const [animationType, setAnimationType] = useState<'enqueue' | 'dequeue' | 'peek' | 'none'>('none');
  const [valueInput, setValueInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [size, setSize] = useState<number>(5); // Default size is 5
  const [sizeInput, setSizeInput] = useState<string>('5'); // Default size input is 5
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Animation speed factor
  const speedFactor = Math.max(1, 11 - Math.floor(speed / 10));
  
  // Initialize the queue on mount and when size changes
  useEffect(() => {
    initializeQueue(size);
  }, [size]);
  
  // Reset animation state after animation duration
  useEffect(() => {
    if (animatedIndex !== null) {
      const timeout = setTimeout(() => {
        setAnimatedIndex(null);
        setAnimationType('none');
      }, 800 * speedFactor);
      return () => clearTimeout(timeout);
    }
  }, [animatedIndex, speedFactor]);

  // Initialize queue with a specific size
  const initializeQueue = (newSize: number) => {
    if (newSize < 1 || newSize > 10) {
      toast({
        title: "Invalid Size",
        description: "Queue size must be between 1 and 10",
        variant: "destructive"
      });
      return;
    }
    
    setQueue(Array(newSize).fill(null));
    setFront(-1);
    setRear(-1);
    setMessage(`Created a new circular queue with size ${newSize}`);
  };

  // Check if the queue is empty
  const isEmpty = () => {
    return front === -1;
  };
  
  // Check if the queue is full
  const isFull = () => {
    return (front === 0 && rear === size - 1) || (front === rear + 1);
  };
  
  // Get the current queue size (number of elements)
  const getQueueSize = () => {
    if (isEmpty()) return 0;
    if (front <= rear) return rear - front + 1;
    return size - (front - rear - 1);
  };

  // Handle enqueue operation
  const handleEnqueue = () => {
    const value = valueInput.trim();
    
    if (!value) {
      toast({
        title: "Error",
        description: "Please enter a value to enqueue",
        variant: "destructive"
      });
      return;
    }
    
    if (isFull()) {
      toast({
        title: "Queue Overflow",
        description: "Cannot enqueue, queue is full",
        variant: "destructive"
      });
      setMessage("Queue Overflow: Cannot enqueue more elements when the queue is full");
      return;
    }
    
    // If queue is empty, set front to 0
    if (isEmpty()) {
      setFront(0);
    }
    
    // Move rear circularly and add element
    const newRear = (rear + 1) % size;
    setRear(newRear);
    
    const newQueue = [...queue];
    newQueue[newRear] = value;
    setQueue(newQueue);
    
    setAnimatedIndex(newRear);
    setAnimationType('enqueue');
    setMessage(`Enqueued ${value} at position ${newRear}`);
    setValueInput('');
    
    // Report the operation
    if (onOperationSelect) {
      onOperationSelect('enqueue');
    }
  };
  
  // Handle dequeue operation
  const handleDequeue = () => {
    if (isEmpty()) {
      toast({
        title: "Queue Underflow",
        description: "Cannot dequeue from an empty queue",
        variant: "destructive"
      });
      setMessage("Queue Underflow: Cannot dequeue when the queue is empty");
      return;
    }
    
    const dequeuedValue = queue[front];
    
    setAnimatedIndex(front);
    setAnimationType('dequeue');
    
    // Delay the actual dequeue to show the animation first
    setTimeout(() => {
      const newQueue = [...queue];
      newQueue[front] = null;
      
      // If this is the last element, reset front and rear
      if (front === rear) {
        setFront(-1);
        setRear(-1);
      } else {
        // Move front circularly
        setFront((front + 1) % size);
      }
      
      setQueue(newQueue);
      setMessage(`Dequeued ${dequeuedValue} from position ${front}`);
      
      // Report the operation
      if (onOperationSelect) {
        onOperationSelect('dequeue');
      }
    }, 700 * speedFactor);
  };
  
  // Handle peek operation (view front element)
  const handlePeek = () => {
    if (isEmpty()) {
      toast({
        title: "Empty Queue",
        description: "Queue is empty, nothing to peek",
        variant: "destructive"
      });
      setMessage("Queue is empty: There are no elements to peek");
      return;
    }
    
    const frontValue = queue[front];
    
    setAnimatedIndex(front);
    setAnimationType('peek');
    setMessage(`Front element is ${frontValue} at position ${front}`);
    
    // Report the operation
    if (onOperationSelect) {
      onOperationSelect('peek');
    }
  };
  
  // Reset the queue to initial state (empty)
  const handleReset = () => {
    initializeQueue(size);
    setAnimatedIndex(null);
    setAnimationType('none');
    setValueInput('');
    
    // Report the operation
    if (onOperationSelect) {
      onOperationSelect('reset');
    }
  };

  const getAnimationClass = (index: number) => {
    if (animatedIndex === index) {
      switch (animationType) {
        case 'enqueue':
          return 'animate-pop-in bg-green-200 dark:bg-green-800 border-green-500';
        case 'dequeue':
          return 'animate-pulse bg-red-200 dark:bg-red-800 border-red-500';
        case 'peek':
          return 'animate-pulse bg-yellow-200 dark:bg-yellow-800 border-yellow-500';
        default:
          return '';
      }
    }
    return '';
  };

  const isFrontIndex = (index: number) => {
    return !isEmpty() && index === front;
  };
  
  const isRearIndex = (index: number) => {
    return !isEmpty() && index === rear;
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
          Queue Size: {getQueueSize()} / {size}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSizeDialogOpen(true)}
          className="flex items-center"
        >
          <Settings size={16} className="mr-2" />
          Set Size
        </Button>
      </div>
      
      {/* Queue visualization */}
      <div className="p-6 border border-border rounded-md w-full max-w-2xl">
        <div className="flex flex-col items-center">
          <div className="relative flex justify-center items-center w-full mb-8">
            <div className="w-full flex justify-center">
              {queue.map((value, index) => (
                <div key={index} className="flex flex-col items-center mx-1">
                  <div
                    className={`w-14 h-14 flex items-center justify-center border-2 transition-all rounded-md ${getAnimationClass(index)}`}
                    style={{
                      transitionDuration: `${speedFactor * 300}ms`,
                      backgroundColor: value === null ? 'var(--muted)' : undefined
                    }}
                  >
                    {value !== null ? value : ''}
                    {isFrontIndex(index) && isRearIndex(index) && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-primary font-medium">
                        F/R
                      </div>
                    )}
                    {isFrontIndex(index) && !isRearIndex(index) && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-primary font-medium">
                        Front
                      </div>
                    )}
                    {isRearIndex(index) && !isFrontIndex(index) && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-primary font-medium">
                        Rear
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {index}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Circular visualization */}
          <div className="relative w-48 h-48 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted"></div>
            {queue.map((value, index) => {
              const angle = (index / size) * Math.PI * 2;
              const radius = 70;
              const x = Math.cos(angle) * radius + 96;
              const y = Math.sin(angle) * radius + 96;
              
              return (
                <div
                  key={`circle-${index}`}
                  className={`absolute w-10 h-10 flex items-center justify-center -ml-5 -mt-5 border-2 rounded-full ${getAnimationClass(index)}`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    backgroundColor: value === null ? 'var(--muted)' : 'var(--background)',
                    borderColor: isFrontIndex(index) ? 'var(--primary)' : isRearIndex(index) ? 'var(--secondary)' : 'var(--border)',
                    borderWidth: (isFrontIndex(index) || isRearIndex(index)) ? '3px' : '2px',
                    zIndex: value !== null ? 10 : 5,
                    transitionDuration: `${speedFactor * 300}ms`
                  }}
                >
                  {value !== null ? value : ''}
                  <div className="absolute -top-5 text-xs text-muted-foreground">
                    {index}
                  </div>
                </div>
              );
            })}
            {!isEmpty() && (
              <>
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -mt-6 text-xs font-medium text-primary">
                  {front === 0 ? 'Front' : ''}
                </div>
                <div className="absolute right-0 top-1/2 translate-x-6 -translate-y-1/2 text-xs font-medium text-primary">
                  {front === Math.floor(size / 4) ? 'Front' : ''}
                </div>
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 -mb-6 text-xs font-medium text-primary">
                  {front === Math.floor(size / 2) ? 'Front' : ''}
                </div>
                <div className="absolute left-0 top-1/2 -translate-x-6 -translate-y-1/2 text-xs font-medium text-primary">
                  {front === Math.floor(3 * size / 4) ? 'Front' : ''}
                </div>
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -mt-6 text-xs font-medium text-secondary">
                  {rear === 0 ? 'Rear' : ''}
                </div>
                <div className="absolute right-0 top-1/2 translate-x-6 -translate-y-1/2 text-xs font-medium text-secondary">
                  {rear === Math.floor(size / 4) ? 'Rear' : ''}
                </div>
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 -mb-6 text-xs font-medium text-secondary">
                  {rear === Math.floor(size / 2) ? 'Rear' : ''}
                </div>
                <div className="absolute left-0 top-1/2 -translate-x-6 -translate-y-1/2 text-xs font-medium text-secondary">
                  {rear === Math.floor(3 * size / 4) ? 'Rear' : ''}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Operation controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        {/* Enqueue operation */}
        <div className="space-y-2 p-4 rounded-md border border-border">
          <h3 className="font-medium text-sm mb-2">Enqueue Value</h3>
          <div className="flex flex-col gap-2">
            <Input 
              type="text" 
              placeholder="Value" 
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              className="w-full"
            />
            <Button 
              variant="outline" 
              onClick={handleEnqueue}
              className="w-full"
              disabled={isFull()}
            >
              <Plus size={16} className="mr-2" /> Enqueue
            </Button>
          </div>
        </div>
        
        {/* Dequeue and Peek operations */}
        <div className="space-y-2 p-4 rounded-md border border-border">
          <h3 className="font-medium text-sm mb-2">Queue Operations</h3>
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              onClick={handleDequeue}
              className="w-full"
              disabled={isEmpty()}
            >
              <Trash2 size={16} className="mr-2" /> Dequeue
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePeek}
              className="w-full"
              disabled={isEmpty()}
            >
              <Eye size={16} className="mr-2" /> Peek Front
            </Button>
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
            <DialogTitle>Set Queue Size</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              placeholder="Enter size (1-10)"
              min="1"
              max="10"
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
                  setSize(newSize);
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

export default CircularQueueVisualization;
