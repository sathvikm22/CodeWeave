
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, PlayCircle, PauseCircle, RotateCcw, Code, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import SortingVisualization from '@/components/visualizations/SortingVisualization';
import SortingCodeDisplay from '@/components/visualizations/SortingCodeDisplay';
import ComplexityInfo from '@/components/ComplexityInfo';

const Sorting: React.FC = () => {
  const { algorithm } = useParams<{ algorithm?: string }>();
  const [speed, setSpeed] = useState<number>(50);
  const [size, setSize] = useState<number>(15);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>(algorithm || 'bubble');
  const [dataStructure, setDataStructure] = useState<'array' | 'linkedlist'>('array');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp'>('javascript');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'visualization' | 'code' | 'complexity'>('visualization');
  const { toast } = useToast();
  
  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };
  
  const handleSizeChange = (value: number[]) => {
    setSize(value[0]);
  };
  
  useEffect(() => {
    if (algorithm && ['bubble', 'merge', 'quick', 'insertion', 'selection'].includes(algorithm)) {
      setSelectedAlgorithm(algorithm);
    }
  }, [algorithm]);
  
  const handleReset = () => {
    if (isRunning) {
      toast({
        title: "Action not allowed",
        description: "Please stop the current animation before resetting",
        variant: "destructive"
      });
      return;
    }
    
    // Trigger reset in the visualization component
    const event = new CustomEvent('reset-visualization');
    window.dispatchEvent(event);
  };
  
  const handlePlay = () => {
    if (isRunning) {
      // Stop animation
      setIsRunning(false);
      const event = new CustomEvent('stop-visualization');
      window.dispatchEvent(event);
    } else {
      // Start animation
      setIsRunning(true);
      const event = new CustomEvent('start-visualization');
      window.dispatchEvent(event);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft size={16} className="mr-1" /> Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Sorting Algorithm Visualizations
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium min-w-20">Animation Speed:</div>
              <div className="w-full">
                <Slider 
                  defaultValue={[speed]} 
                  max={100} 
                  step={1} 
                  onValueChange={handleSpeedChange} 
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium min-w-20">Array Size:</div>
              <div className="w-full">
                <Slider 
                  defaultValue={[size]} 
                  max={50} 
                  min={5}
                  step={1} 
                  onValueChange={handleSizeChange}
                  disabled={isRunning} 
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Data Structure</label>
                <Select 
                  value={dataStructure} 
                  onValueChange={(value: 'array' | 'linkedlist') => setDataStructure(value)}
                  disabled={isRunning}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data structure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="array">Array</SelectItem>
                    <SelectItem value="linkedlist">Linked List</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Code Language</label>
                <Select 
                  value={language} 
                  onValueChange={(value: 'javascript' | 'python' | 'cpp') => setLanguage(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <Button 
              variant={isRunning ? "secondary" : "default"}
              size="lg" 
              className={`w-full md:w-auto ${isRunning ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
              onClick={handlePlay}
            >
              {isRunning ? (
                <><PauseCircle className="mr-2" /> Stop</>
              ) : (
                <><PlayCircle className="mr-2" /> Play</>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full md:w-auto hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={handleReset}
              disabled={isRunning}
            >
              <RotateCcw className="mr-2" /> Reset
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-background via-muted/20 to-background h-0.5 mb-8"></div>
        
        <Tabs 
          defaultValue={selectedAlgorithm} 
          value={selectedAlgorithm}
          onValueChange={setSelectedAlgorithm}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="bubble" disabled={isRunning} className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
              Bubble Sort
            </TabsTrigger>
            <TabsTrigger value="insertion" disabled={isRunning} className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
              Insertion Sort
            </TabsTrigger>
            <TabsTrigger value="selection" disabled={isRunning} className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
              Selection Sort
            </TabsTrigger>
            <TabsTrigger value="merge" disabled={isRunning} className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
              Merge Sort
            </TabsTrigger>
            <TabsTrigger value="quick" disabled={isRunning} className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
              Quick Sort
            </TabsTrigger>
          </TabsList>
          
          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as any)}>
              <TabsList className="mb-4 bg-muted/30">
                <TabsTrigger value="visualization" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                  Visualization
                </TabsTrigger>
                <TabsTrigger value="code" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                  <Code className="w-4 h-4 mr-1" /> Code
                </TabsTrigger>
                <TabsTrigger value="complexity" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                  <Info className="w-4 h-4 mr-1" /> Complexity
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="visualization" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="p-6 border rounded-lg bg-card shadow-sm">
                  <SortingVisualization 
                    algorithm={selectedAlgorithm}
                    dataStructure={dataStructure}
                    speed={speed}
                    size={size}
                    isRunning={isRunning}
                    setIsRunning={setIsRunning}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="p-6 border rounded-lg bg-card shadow-sm">
                  <div className="flex items-center mb-4">
                    <Code className="mr-2 text-primary" />
                    <h3 className="text-lg font-medium">Algorithm Implementation</h3>
                  </div>
                  <SortingCodeDisplay
                    algorithm={selectedAlgorithm}
                    language={language}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="complexity" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="p-6 border rounded-lg bg-card shadow-sm">
                  <ComplexityInfo 
                    dataStructure="sorting" 
                    operation={selectedAlgorithm}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Sorting;
