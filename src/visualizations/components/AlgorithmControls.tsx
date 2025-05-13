
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Rewind, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface AlgorithmControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onReset: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onPlayPause: () => void;
  onSpeedChange: (values: number[]) => void;
}

const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onReset,
  onStepBack,
  onStepForward,
  onPlayPause,
  onSpeedChange
}) => {
  const getSpeedLabel = () => {
    if (speed < 30) return 'Slow';
    if (speed < 70) return 'Medium';
    return 'Fast';
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium mb-2">Animation Controls</h4>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm">
          Step {currentStep + 1} of {totalSteps}
        </div>
        <div className="text-sm">{getSpeedLabel()}</div>
      </div>
      <div className="flex gap-2 mb-4">
        <Button size="icon" variant="outline" onClick={onReset}>
          <Rewind size={18} />
        </Button>
        <Button size="icon" variant="outline" onClick={onStepBack} disabled={currentStep <= 0}>
          <SkipBack size={18} />
        </Button>
        <Button className="flex-1" onClick={onPlayPause}>
          {isPlaying ? <Pause size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button size="icon" variant="outline" onClick={onStepForward} disabled={currentStep >= totalSteps - 1}>
          <SkipForward size={18} />
        </Button>
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm">Animation Speed: {speed}%</span>
        </div>
        <Slider 
          value={[speed]} 
          min={10} 
          max={100} 
          step={5} 
          onValueChange={onSpeedChange} 
        />
      </div>
    </div>
  );
};

export default AlgorithmControls;
