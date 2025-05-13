
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface StackVisualizationProps {
  speed: number;
  onOperationSelect?: (operation: string) => void;
}

const StackVisualization: React.FC<StackVisualizationProps> = ({ speed, onOperationSelect }) => {
  const [stack, setStack] = useState<(number | string)[]>([]);
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);
  const [animationType, setAnimationType] = useState<'push' | 'pop' | 'peek' | 'none'>('none');
  const [valueInput, setValueInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [maxSize, setMaxSize] = useState<number>(5); // Default size is 5
  const [sizeInput, setSizeInput] = useState<string>('5'); // Default size input is 5
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Animation speed factor (100% speed = 1, 50% speed = 2, etc.)
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

  // Initialize stack with empty values
  useEffect(() => {
    setStack([]);
    setMessage(`Stack initialized with maximum size ${maxSize}`);
  }, [maxSize]);

  // Handle push operation (LIFO - add to the top)
  const handlePush = () => {
    const value = valueInput.trim();
    
    if (!value) {
      toast({
        title: "Error",
        description: "Please enter a value to push",
        variant: "destructive"
      });
      return;
    }
    
    if (stack.length >= maxSize) {
      toast({
        title: "Stack Overflow",
        description: "Cannot push more items, stack is full",
        variant: "destructive"
      });
      setMessage("Stack Overflow: Cannot push when the stack is full");
      return;
    }
    
    const newStack = [...stack, value];
    setStack(newStack);
    setAnimatedIndex(newStack.length - 1);
    setAnimationType('push');
    setMessage(`Pushed ${value} onto the stack`);
    setValueInput('');
    
    // Report the operation to parent component if callback exists
    if (onOperationSelect) {
      onOperationSelect('push');
    }
  };
  
  // Handle pop operation (LIFO - remove from the top)
  const handlePop = () => {
    if (stack.length === 0) {
      toast({
        title: "Stack Underflow",
        description: "Cannot pop from an empty stack",
        variant: "destructive"
      });
      setMessage("Stack Underflow: Cannot pop when the stack is empty");
      return;
    }
    
    const topIndex = stack.length - 1;
    const poppedValue = stack[topIndex];
    
    setAnimatedIndex(topIndex);
    setAnimationType('pop');
    
    // Delay the actual pop to show the animation first
    setTimeout(() => {
      setStack(stack.slice(0, -1));
      setMessage(`Popped ${poppedValue} from the stack`);
      
      // Report the operation to parent component if callback exists
      if (onOperationSelect) {
        onOperationSelect('pop');
      }
    }, 800 * speedFactor);
  };
  
  // Handle peek operation (view top element)
  const handlePeek = () => {
    if (stack.length === 0) {
      toast({
        title: "Empty Stack",
        description: "Stack is empty, nothing to peek",
        variant: "destructive"
      });
      setMessage("Stack is empty: There are no elements to peek");
      return;
    }
    
    const topIndex = stack.length - 1;
    const topValue = stack[topIndex];
    
    setAnimatedIndex(topIndex);
    setAnimationType('peek');
    setMessage(`Top element is ${topValue}`);
    
    // Report the operation to parent component if callback exists
    if (onOperationSelect) {
      onOperationSelect('peek');
    }
  };
  
  // Reset the stack to initial state
  const handleReset = () => {
    setStack([]);
    setAnimatedIndex(null);
    setAnimationType('none');
    setMessage('Stack reset to empty');
    setValueInput('');
    
    // Report the operation to parent component if callback exists
    if (onOperationSelect) {
      onOperationSelect('reset');
    }
  };

  // Set the maximum stack size
  const handleSetMaxSize = () => {
    const size = parseInt(sizeInput);
    if (isNaN(size) || size < 1 || size > 15) {
      toast({
        title: "Invalid Size",
        description: "Stack size must be between 1 and 15",
        variant: "destructive"
      });
      return;
    }
    
    // If new size is smaller than current stack, truncate the stack
    if (size < stack.length) {
      setStack(stack.slice(0, size));
      toast({
        title: "Stack Truncated",
        description: `Stack has been truncated to ${size} elements`,
      });
    }
    
    setMaxSize(size);
    setIsSizeDialogOpen(false);
    setMessage(`Maximum stack size set to ${size}`);
    
    // Report the operation to parent component if callback exists
    if (onOperationSelect) {
      onOperationSelect('resize');
    }
  };

  const getAnimationClass = (index: number) => {
    if (animatedIndex === index) {
      switch (animationType) {
        case 'push':
          return 'animate-pop-in bg-green-200 dark:bg-green-800 border-green-500';
        case 'pop':
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
      
      {/* Stack size info and set size button */}
      <div className="flex justify-between w-full max-w-md">
        <div className="text-sm text-muted-foreground">
          Stack Size: {stack.length} / {maxSize}
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
      
      {/* Stack visualization */}
      <div className="relative border-l-2 border-r-2 border-b-2 border-primary rounded-b-md w-32 md:w-40">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm text-muted-foreground">
          Top
        </div>
        
        <div className="flex flex-col-reverse">
          {stack.map((value, index) => (
            <div
              key={index}
              className={`w-full h-12 md:h-14 flex items-center justify-center text-lg font-medium border-t-2 transition-all ${getAnimationClass(index)}`}
              style={{
                transitionDuration: `${speedFactor * 300}ms`,
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {value}
                <div className="absolute right-2 text-xs text-muted-foreground">
                  {index}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {stack.length === 0 && (
          <div className="h-32 flex items-center justify-center text-muted-foreground text-sm border-t-2">
            Empty Stack
          </div>
        )}
      </div>
      
      {/* Operation controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        {/* Push operation */}
        <div className="space-y-2 p-4 rounded-md border border-border">
          <h3 className="font-medium text-sm mb-2">Push Value (LIFO)</h3>
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
              onClick={handlePush}
              className="w-full"
              disabled={stack.length >= maxSize}
            >
              <Plus size={16} className="mr-2" /> Push
            </Button>
          </div>
        </div>
        
        {/* Pop and Peek operations */}
        <div className="space-y-2 p-4 rounded-md border border-border">
          <h3 className="font-medium text-sm mb-2">Stack Operations</h3>
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              onClick={handlePop}
              className="w-full"
              disabled={stack.length === 0}
            >
              <Trash2 size={16} className="mr-2" /> Pop
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePeek}
              className="w-full"
              disabled={stack.length === 0}
            >
              <Eye size={16} className="mr-2" /> Peek
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
            <DialogTitle>Set Maximum Stack Size</DialogTitle>
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

export default StackVisualization;
