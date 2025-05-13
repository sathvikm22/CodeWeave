
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Rewind, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import AlgorithmCodeTabs from './AlgorithmCodeTabs';

interface ArrayAlgorithmLayoutProps {
  title: string;
  isPlaying: boolean;
  speedValue: number;
  currentStep: number;
  totalSteps: number;
  stepDescription: string;
  speedLabel?: string;
  arraySize: number;
  children: React.ReactNode;
  visualizationContent: React.ReactNode;
  code: {
    javascript: string;
    python: string;
    cpp: string;
  };
  onArraySizeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onPlay: () => void;
  onSpeedChange: (value: number[]) => void;
  onGenerateRandom?: () => void;
  onSort?: () => void;
  additionalControls?: React.ReactNode;
}

const ArrayAlgorithmLayout: React.FC<ArrayAlgorithmLayoutProps> = ({
  title,
  isPlaying,
  speedValue,
  currentStep,
  totalSteps,
  stepDescription,
  speedLabel = "Medium",
  arraySize,
  children,
  visualizationContent,
  code,
  onArraySizeChange,
  onReset,
  onStepBack,
  onStepForward,
  onPlay,
  onSpeedChange,
  onGenerateRandom,
  onSort,
  additionalControls
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex space-x-2 items-center">
          <Input 
            type="number" 
            value={arraySize} 
            onChange={onArraySizeChange} 
            className="w-20" 
            min={5} 
            max={50}
            disabled={isPlaying}
          />
          <span className="text-sm text-muted-foreground">Array Size</span>
        </div>
        
        {onGenerateRandom && (
          <Button variant="outline" onClick={onGenerateRandom} disabled={isPlaying}>
            Random Array
          </Button>
        )}
        
        {onSort && (
          <Button onClick={onSort} disabled={isPlaying}>
            Sort
          </Button>
        )}
        
        {additionalControls}
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          {visualizationContent}
        </CardContent>
      </Card>
      
      {/* Controls section */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Animation Controls</h4>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm">
                Step {currentStep + 1} of {totalSteps}
              </div>
              <div className="text-sm">{speedLabel}</div>
            </div>
            <div className="flex gap-2 mb-4">
              <Button size="icon" variant="outline" onClick={onReset}>
                <Rewind size={18} />
              </Button>
              <Button size="icon" variant="outline" onClick={onStepBack} disabled={currentStep <= 0}>
                <SkipBack size={18} />
              </Button>
              <Button className="flex-1" onClick={onPlay}>
                {isPlaying ? <Pause size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button size="icon" variant="outline" onClick={onStepForward} disabled={currentStep >= totalSteps - 1}>
                <SkipForward size={18} />
              </Button>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Animation Speed: {speedValue}%</span>
              </div>
              <Slider 
                value={[speedValue]} 
                min={10} 
                max={100} 
                step={5} 
                onValueChange={onSpeedChange} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Algorithm status section */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">Algorithm Steps</h4>
          <div className="p-3 rounded bg-muted/30 border">
            {stepDescription}
          </div>
          
          {children}
        </CardContent>
      </Card>
      
      {/* Code snippets */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Implementation:</h4>
          <AlgorithmCodeTabs code={code} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ArrayAlgorithmLayout;
