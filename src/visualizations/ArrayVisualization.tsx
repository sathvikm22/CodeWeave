import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface ArrayVisualizationProps {
  speed: number;
  onOperationSelect?: (operation: string) => void;
}

const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({ speed, onOperationSelect }) => {
  const [array, setArray] = useState<(number | string | null)[]>([]);
  const [initialSize, setInitialSize] = useState<number>(10); // Changed default to 10
  const [size, setSize] = useState<number>(10); // Changed default to 10
  const [filled, setFilled] = useState<number>(0);
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);
  const [animationType, setAnimationType] = useState<'insert' | 'delete' | 'search' | 'none'>('none');
  const [newValue, setNewValue] = useState<string>('');
  const [indexInput, setIndexInput] = useState<string>('');
  const [valueInput, setValueInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [sizeInput, setSizeInput] = useState<string>('10'); // Changed default to 10
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Animation speed factor (100% speed = 1, 50% speed = 2, etc.)
  const speedFactor = Math.max(1, 11 - Math.floor(speed / 10));

  // Initialize array on component mount
  useEffect(() => {
    initializeArray(size);
  }, []);
  
  // Reset animation state after animation duration
  useEffect(() => {
    if (animatedIndex !== null) {
      const timeout = setTimeout(() => {
        setAnimatedIndex(null);
        setAnimationType('none');
        setSearchResults([]);
      }, 600 * speedFactor);
      return () => clearTimeout(timeout);
    }
  }, [animatedIndex, speedFactor]);

  // Initialize array with a specific size
  const initializeArray = (newSize: number) => {
    if (newSize < 1 || newSize > 15) {
      toast({
        title: "Invalid Size",
        description: "Array size must be between 1 and 15",
        variant: "destructive"
      });
      return;
    }
    
    setArray(Array(newSize).fill(null));
    setSize(newSize);
    setInitialSize(newSize);
    setFilled(0);
    setMessage(`Created a new array with size ${newSize}`);
    
    // Report the operation to parent component if callback exists
    if (onOperationSelect) {
      onOperationSelect('initialize');
    }
  };

  // Handle insert operation
  const handleInsert = () => {
    const value = valueInput.trim();
    const index = parseInt(indexInput);
    
    if (!value) {
      toast({
        title: "Error",
        description: "Please enter a value",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(index) || index < 0 || index >= size) {
      toast({
        title: "Array Out of Bounds",
        description: `Index must be between 0 and ${size - 1}`,
        variant: "destructive"
      });
      setMessage(`Array Out of Bounds: Index must be between 0 and ${size - 1}`);
      return;
    }
    
    if (array[index] !== null) {
      toast({
        title: "Warning",
        description: `Overwriting value at index ${index}`,
      });
    } else {
      setFilled(filled + 1);
    }
    
    const newArray = [...array];
    newArray[index] = value;
    
    setArray(newArray);
    setAnimatedIndex(index);
    setAnimationType('insert');
    setMessage(`Inserted ${value} at index ${index}`);
    setValueInput('');
    setIndexInput('');
    
    // Report the operation to parent component if callback exists
    if (onOperationSelect) {
      onOperationSelect('insert');
    }
  };
  
  // Handle delete operation
  const handleDelete = () => {
    const index = parseInt(indexInput);
    
    if (isNaN(index) || index < 0 || index >= size) {
      toast({
        title: "Array Out of Bounds",
        description: `Index must be between 0 and ${size - 1}`,
        variant: "destructive"
      });
      setMessage(`Array Out of Bounds: Index must be between 0 and ${size - 1}`);
      return;
    }
    
    const deletedValue = array[index];
    
    if (deletedValue === null) {
      toast({
        title: "Warning",
        description: `No value at index ${index} to delete`,
      });
      setMessage(`Index doesn't exist: No value at index ${index} to delete`);
      return;
    }
    
    setAnimatedIndex(index);
    setAnimationType('delete');
    
    // Delay the actual deletion to show the animation first
    setTimeout(() => {
      const newArray = [...array];
      newArray[index] = null;
      setArray(newArray);
      setFilled(filled - 1);
      setMessage(`Deleted ${deletedValue} from index ${index}`);
    }, 500 * speedFactor);
    
    setIndexInput('');
    
    // Report the operation to parent component if callback exists
    if (onOperationSelect) {
      onOperationSelect('delete');
    }
  };
  
  // Handle search operation
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
    
    const foundIndices: number[] = [];
    
    array.forEach((item, index) => {
      if (item !== null && item.toString() === value) {
        foundIndices.push(index);
      }
    });
    
    if (foundIndices.length > 0) {
      setSearchResults(foundIndices);
      setMessage(`Found ${value} at index(es): ${foundIndices.join(', ')}`);
    } else {
      setMessage(`${value} not found in the array`);
      toast({
        title: "Not Found",
        description: `${value} not found in the array`,
      });
    }
    
    setValueInput('');
    
    // Report the operation to parent component if callback exists
    if (onOperationSelect) {
      onOperationSelect('search');
    }
  };
  
  // Reset the array to empty
  const handleReset = () => {
    setArray(Array(initialSize).fill(null));
    setFilled(0);
    setAnimatedIndex(null);
    setAnimationType('none');
    setMessage('Array reset to empty');
    setValueInput('');
    setIndexInput('');
    setSearchResults([]);
    
    // Report the operation to parent component if callback exists
    if (onOperationSelect) {
      onOperationSelect('reset');
    }
  };
  
  // Create a new array with a given size
  const handleSetSize = () => {
    const newSize = parseInt(sizeInput);
    if (!isNaN(newSize)) {
      initializeArray(newSize);
      setIsSizeDialogOpen(false);
      
      // Report the operation to parent component if callback exists
      if (onOperationSelect) {
        onOperationSelect('resize');
      }
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid number for array size",
        variant: "destructive"
      });
    }
  };
  
  // Fill array with random values
  const handleRandomize = () => {
    const newArray = Array(size).fill(null).map(() => 
      Math.floor(Math.random() * 100)
    );
    setArray(newArray);
    setFilled(size);
    setMessage('Filled array with random values');
    
    // Report the operation to parent component if callback exists
    if (onOperationSelect) {
      onOperationSelect('randomize');
    }
  };

  const getAnimationClass = (index: number) => {
    if (animatedIndex === index && animationType === 'insert') {
      return 'animate-pop-in bg-green-200 dark:bg-green-800 border-green-500';
    } else if (animatedIndex === index && animationType === 'delete') {
      return 'bg-red-200 dark:bg-red-800 border-red-500 opacity-50';
    } else if (searchResults.includes(index)) {
      return 'bg-yellow-200 dark:bg-yellow-800 border-yellow-500';
    }
    return '';
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center space-y-8">
        {/* Message display */}
        {message && (
          <div className="text-sm px-4 py-2 rounded-md bg-muted">
            {message}
          </div>
        )}
        
        {/* Array info and size setting */}
        <div className="flex justify-between w-full max-w-2xl">
          <div className="text-sm text-muted-foreground">
            Array Size: {size} (Filled: {filled})
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
        
        {/* Array visualization */}
        <div className="flex flex-wrap justify-center gap-1 md:gap-2">
          {array.map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`ds-array-cell w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-lg font-medium border-2 rounded-md transition-all ${getAnimationClass(index)}`}
                style={{
                  transitionDuration: `${speedFactor * 300}ms`,
                  backgroundColor: value === null ? 'var(--muted)' : undefined
                }}
              >
                {value !== null ? value : ''}
              </div>
              <div className="ds-array-index text-xs text-muted-foreground mt-1">
                {index}
              </div>
            </div>
          ))}
        </div>
        
        {/* Operation controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {/* Insert operation */}
          <div className="space-y-2 p-4 rounded-md border border-border">
            <h3 className="font-medium text-sm mb-2">Insert Value</h3>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input 
                  type="text" 
                  placeholder="Value" 
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  className="w-full"
                />
                <Input 
                  type="number" 
                  placeholder="Index" 
                  min="0" 
                  max={(size - 1).toString()}
                  value={indexInput}
                  onChange={(e) => setIndexInput(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={handleInsert}
                className="w-full"
              >
                <Plus size={16} className="mr-2" /> Insert
              </Button>
            </div>
          </div>
          
          {/* Delete operation */}
          <div className="space-y-2 p-4 rounded-md border border-border">
            <h3 className="font-medium text-sm mb-2">Delete at Index</h3>
            <div className="flex flex-col gap-2">
              <Input 
                type="number" 
                placeholder="Index" 
                min="0" 
                max={(size - 1).toString()}
                value={indexInput}
                onChange={(e) => setIndexInput(e.target.value)}
                className="w-full"
              />
              <Button 
                variant="outline" 
                onClick={handleDelete}
                className="w-full"
              >
                <Trash2 size={16} className="mr-2" /> Delete
              </Button>
            </div>
          </div>
          
          {/* Search operation */}
          <div className="space-y-2 p-4 rounded-md border border-border">
            <h3 className="font-medium text-sm mb-2">Search Value</h3>
            <div className="flex flex-col gap-2">
              <Input 
                type="text" 
                placeholder="Value" 
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                className="w-full"
              />
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleSearch}
                  className="w-full"
                >
                  <Search size={16} className="mr-2" /> Search
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
          
          {/* Random fill operation */}
          <div className="space-y-2 p-4 rounded-md border border-border">
            <h3 className="font-medium text-sm mb-2">Array Operations</h3>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                onClick={handleRandomize}
                className="w-full"
              >
                <RefreshCw size={16} className="mr-2" /> Fill with Random Values
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Size Dialog */}
      <Dialog open={isSizeDialogOpen} onOpenChange={setIsSizeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Array Size</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              placeholder="Enter size (1-15)"
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
              onClick={handleSetSize}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArrayVisualization;
