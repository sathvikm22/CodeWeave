
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface QueueVisualizationProps {
  speed: number;
  onOperationSelect?: (operation: string) => void;
}

const QueueVisualization: React.FC<QueueVisualizationProps> = ({ speed, onOperationSelect }) => {
  const [queue, setQueue] = useState<(number | string)[]>([]);
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);
  const [animationType, setAnimationType] = useState<'enqueue' | 'dequeue' | 'peek' | 'none'>('none');
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
      }, 1000 * speedFactor); // Increased duration for better visibility
      return () => clearTimeout(timeout);
    }
  }, [animatedIndex, speedFactor]);

  // Initialize queue with empty values
  useEffect(() => {
    setQueue([]);
    setMessage(`Queue initialized with maximum size ${maxSize}`);
  }, [maxSize]);

  // Handle enqueue operation (FIFO - add to the end)
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
    
    if (queue.length >= maxSize) {
      toast({
        title: "Queue Overflow",
        description: "Queue is full, cannot enqueue more items",
        variant: "destructive"
      });
      setMessage("Queue Overflow: Cannot enqueue when the queue is full");
      return;
    }
    
    const newQueue = [...queue, value];
    setQueue(newQueue);
    setAnimatedIndex(newQueue.length - 1);
    setAnimationType('enqueue');
    setMessage(`Enqueued ${value} at the end of the queue`);
    setValueInput('');
    
    // Report the operation to parent component if callback exists
    if (onOperationSelect) {
      onOperationSelect('enqueue');
    }
  };
  
  // Handle dequeue operation (FIFO - remove from the front)
  const handleDequeue = () => {
    if (queue.length === 0) {
      toast({
        title: "Queue Underflow",
        description: "Cannot dequeue from an empty queue",
        variant: "destructive"
      });
      setMessage("Queue Underflow: Cannot dequeue when the queue is empty");
      return;
    }
    
    const dequeuedValue = queue[0];
    
    setAnimatedIndex(0);
    setAnimationType('dequeue');
    
    // Delay the actual dequeue to show the animation first
    setTimeout(() => {
      setQueue(queue.slice(1));
      setMessage(`Dequeued ${dequeuedValue} from the front of the queue`);
      
      // Report the operation to parent component if callback exists
      if (onOperationSelect) {
        onOperationSelect('dequeue');
      }
    }, 800 * speedFactor);
  };
  
  // Handle peek operation (view front element)
  const handlePeek = () => {
    if (queue.length === 0) {
      toast({
        title: "Empty Queue",
        description: "Queue is empty, nothing to peek",
        variant: "destructive"
      });
      setMessage("Queue is empty: There are no elements to peek");
      return;
    }
    
    const frontValue = queue[0];
    
    setAnimatedIndex(0);
    setAnimationType('peek');
    setMessage(`Front element is ${frontValue}`);
    
    // Report the operation to parent component if callback exists
    if (onOperationSelect) {
      onOperationSelect('peek');
    }
  };
  
  // Reset the queue to initial state
  const handleReset = () => {
    setQueue([]);
    setAnimatedIndex(null);
    setAnimationType('none');
    setMessage('Queue reset to empty');
    setValueInput('');
    
    // Report the operation to parent component if callback exists
    if (onOperationSelect) {
      onOperationSelect('reset');
    }
  };

  // Set the maximum queue size
  const handleSetMaxSize = () => {
    const size = parseInt(sizeInput);
    if (isNaN(size) || size < 1 || size > 15) {
      toast({
        title: "Invalid Size",
        description: "Queue size must be between 1 and 15",
        variant: "destructive"
      });
      return;
    }
    
    // If new size is smaller than current queue, truncate the queue
    if (size < queue.length) {
      setQueue(queue.slice(0, size));
      toast({
        title: "Queue Truncated",
        description: `Queue has been truncated to ${size} elements`,
      });
    }
    
    setMaxSize(size);
    setIsSizeDialogOpen(false);
    setMessage(`Maximum queue size set to ${size}`);
    
    // Report the operation to parent component if callback exists
    if (onOperationSelect) {
      onOperationSelect('resize');
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

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Message display */}
      {message && (
        <div className="text-sm px-4 py-2 rounded-md bg-muted">
          {message}
        </div>
      )}
      
      {/* Queue size info and set size button */}
      <div className="flex justify-between w-full max-w-2xl">
        <div className="text-sm text-muted-foreground">
          Queue Size: {queue.length} / {maxSize}
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
      <div className="relative flex justify-center items-center w-full max-w-2xl">
        <div className="border-t-2 border-b-2 border-primary rounded-md w-full flex">
          <div className="absolute -top-8 text-sm text-muted-foreground">
            Front (Dequeue)
          </div>
          <div className="absolute -bottom-8 right-0 text-sm text-muted-foreground">
            Rear (Enqueue)
          </div>
          
          <div className="flex w-full">
            {queue.map((value, index) => (
              <div
                key={index}
                className={`queue-item w-full h-12 md:h-14 flex items-center justify-center text-lg font-medium border-l-2 border-r-2 transition-all ${getAnimationClass(index)}`}
                style={{
                  transitionDuration: `${speedFactor * 300}ms`,
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  {value}
                  <div className="absolute top-1 right-2 text-xs text-muted-foreground">
                    {index}
                  </div>
                </div>
              </div>
            ))}
            
            {queue.length === 0 && (
              <div className="h-12 md:h-14 w-full flex items-center justify-center text-muted-foreground text-sm border-l-2 border-r-2">
                Empty Queue
              </div>
            )}
            
            {/* Empty slots visualization */}
            {queue.length > 0 && queue.length < maxSize && (
              Array(maxSize - queue.length).fill(null).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="queue-item w-full h-12 md:h-14 flex items-center justify-center border-l-2 border-r-2 border-dashed border-border bg-muted/30"
                >
                  <div className="absolute top-1 right-2 text-xs text-muted-foreground">
                    {queue.length + index}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Operation controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        {/* Enqueue operation */}
        <div className="space-y-2 p-4 rounded-md border border-border">
          <h3 className="font-medium text-sm mb-2">Enqueue Value (FIFO)</h3>
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
              disabled={queue.length >= maxSize}
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
              disabled={queue.length === 0}
            >
              <Trash2 size={16} className="mr-2" /> Dequeue
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePeek}
              className="w-full"
              disabled={queue.length === 0}
            >
              <Eye size={16} className="mr-2" /> Peek Front
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="w-full"
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
            <DialogTitle>Set Maximum Queue Size</DialogTitle>
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

export default QueueVisualization;
