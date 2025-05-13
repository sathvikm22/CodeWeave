
/**
 * Utility functions for algorithm animations
 */

/**
 * Creates a smooth array size change with a transition
 * @param currentSize Current array size
 * @param targetSize Target array size 
 * @param callback Function to call with new size on each step
 * @param duration Total duration of the transition in ms
 */
export const smoothlySizeArray = (
  currentSize: number, 
  targetSize: number, 
  callback: (size: number) => void,
  duration: number = 300
) => {
  const startTime = performance.now();
  const delta = targetSize - currentSize;
  
  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Use easeInOutQuad easing function for smoother transition
    const easeProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    const newSize = Math.round(currentSize + delta * easeProgress);
    callback(newSize);
    
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  
  requestAnimationFrame(step);
};

/**
 * Generate a random integer between min and max (inclusive)
 */
export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate an array of random integers
 */
export const generateRandomArray = (size: number, min: number, max: number) => {
  return Array.from({ length: size }, () => randomInt(min, max));
};

/**
 * Sleep function for animations
 */
export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Convert animation speed percentage to delay in milliseconds
 * Higher speed means lower delay
 */
export const speedToDelay = (speed: number) => {
  // Map speed 10-100% to 1000-50ms delay (inverted)
  return 1000 - ((speed - 10) / 90) * 950;
};

/**
 * Animate a property change with easing
 * @param startValue Starting value
 * @param endValue Ending value
 * @param duration Animation duration in ms
 * @param callback Function to call with current value on each frame
 * @param easingFunction Optional easing function
 */
export const animateValue = (
  startValue: number,
  endValue: number,
  duration: number,
  callback: (value: number) => void,
  easingFunction: (progress: number) => number = (p) => p
) => {
  const startTime = performance.now();
  const delta = endValue - startValue;
  
  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Apply easing function
    const easedProgress = easingFunction(progress);
    
    const currentValue = startValue + delta * easedProgress;
    callback(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  
  requestAnimationFrame(step);
};

/**
 * Common easing functions
 */
export const easingFunctions = {
  // Linear - no easing
  linear: (t: number) => t,
  
  // Quadratic
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  // Cubic
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  
  // Elastic
  easeOutElastic: (t: number) => {
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
  },
  
  // Bounce
  easeOutBounce: (t: number) => {
    if (t < (1 / 2.75)) {
      return 7.5625 * t * t;
    } else if (t < (2 / 2.75)) {
      return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
    } else if (t < (2.5 / 2.75)) {
      return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
    } else {
      return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
    }
  }
};
