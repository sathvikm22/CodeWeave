
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, StepForward, StepBack, Code, Terminal, Bookmark, Download, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from '@/components/ui/aspect-ratio';

const CodeCraft = () => {
  const { toast } = useToast();
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>("// Write your code here\nfunction helloWorld() {\n  console.log('Hello, world!');\n  return 'Hello, world!';\n}\n\nhelloWorld();");
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [executionSpeed, setExecutionSpeed] = useState<number>(1);
  
  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
  ];

  const runCode = () => {
    setIsRunning(true);
    setOutput("Running code...\n");
    setCurrentStep(0);
    
    // Simulate code execution
    setTimeout(() => {
      try {
        // For demo purposes, we're only executing JavaScript code
        if (language === "javascript") {
          // This is just for demonstration - in a real app, you would use a secure execution environment
          const result = new Function(`
            let consoleOutput = '';
            const originalConsole = console.log;
            console.log = (...args) => {
              consoleOutput += args.join(' ') + '\\n';
              originalConsole.apply(console, args);
            };
            try {
              ${code}
              return consoleOutput;
            } catch (error) {
              return 'Error: ' + error.message;
            } finally {
              console.log = originalConsole;
            }
          `)();
          
          setOutput(result || 'Code executed successfully with no output');
          setTotalSteps(code.split('\n').length);
          
          toast({
            title: "Code executed",
            description: "Your code has been executed successfully.",
          });
        } else {
          setOutput(`Execution for ${language} is not supported in this demo version.`);
          toast({
            title: "Language not supported",
            description: `${language} execution is not available in this demo.`,
            variant: "destructive"
          });
        }
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
        toast({
          title: "Execution error",
          description: `An error occurred during execution: ${error instanceof Error ? error.message : String(error)}`,
          variant: "destructive"
        });
      } finally {
        setIsRunning(false);
      }
    }, 1000);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleExecution = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">CodeCraft</h1>
          <p className="text-muted-foreground">
            Interactive code execution and visualization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-1" /> Save
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="border-border shadow-md">
          <CardHeader className="space-y-1 bg-muted/50 rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle>Code Editor</CardTitle>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <CardDescription>
              Write or paste code to execute and visualize
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[400px] overflow-hidden">
              <textarea
                className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-card border-t dark:border-gray-800"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
              />
            </div>
            
            <div className="p-4 flex justify-between items-center border-t dark:border-gray-800">
              <Button onClick={runCode} disabled={isRunning} className="gap-2">
                <Play className="h-4 w-4" /> Run Code
              </Button>
              <div className="flex items-center space-x-2">
                <Button size="icon" variant="outline" onClick={prevStep} disabled={currentStep === 0 || isRunning}>
                  <StepBack className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={toggleExecution}>
                  {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="outline" onClick={nextStep} disabled={currentStep >= totalSteps || isRunning}>
                  <StepForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-md">
          <CardHeader className="space-y-1 bg-muted/50 rounded-t-lg">
            <CardTitle>Code Visualization</CardTitle>
            <CardDescription>
              Step-by-step execution visualization
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] p-4 bg-card border-t dark:border-gray-800">
              <div className="flex flex-col justify-center items-center h-full">
                <div className="text-center text-muted-foreground">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <AspectRatio ratio={1 / 1} className="bg-muted/20 rounded-full flex items-center justify-center">
                      <Code className="h-12 w-12 opacity-20" />
                    </AspectRatio>
                  </div>
                  
                  <p className="font-medium">Run your code to see the visualization</p>
                  
                  {currentStep > 0 && (
                    <>
                      <div className="mt-4 w-full max-w-xs mx-auto bg-muted/30 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm mt-2 font-mono">
                        Step {currentStep} of {totalSteps}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 border-t dark:border-gray-800">
              <p className="text-sm text-muted-foreground">
                {currentStep > 0 
                  ? `Visualizing step ${currentStep}: Variable state changes will appear here`
                  : 'Execution visualization will show variable states and flow'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-border shadow-md">
        <CardHeader className="space-y-1 bg-muted/50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            <CardTitle>Terminal Output</CardTitle>
          </div>
          <CardDescription>
            See the results of your code execution
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[200px] overflow-auto p-4 bg-black text-white font-mono text-sm border-t dark:border-gray-800">
            <pre>{output || '$ Terminal ready. Run your code to see output.'}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeCraft;
