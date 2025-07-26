import { useEffect, useRef, useCallback } from 'react';
import { logger } from '../utils/logger';

/**
 * Professional Performance Monitoring Hook
 * Tracks component render times and provides performance insights
 */
export const usePerformanceMonitor = (componentName, enabled = process.env.NODE_ENV === 'development') => {
  const renderStartTime = useRef(null);
  const renderCount = useRef(0);

  const startTimer = useCallback((label) => {
    if (!enabled) return;
    logger.performance.start(`${componentName}-${label}`);
  }, [componentName, enabled]);

  const endTimer = useCallback((label) => {
    if (!enabled) return;
    logger.performance.end(`${componentName}-${label}`);
  }, [componentName, enabled]);

  // Track component renders
  useEffect(() => {
    if (!enabled) return;
    
    renderCount.current += 1;
    const renderTime = Date.now();
    
    if (renderStartTime.current) {
      const timeSinceLastRender = renderTime - renderStartTime.current;
      if (timeSinceLastRender < 16) { // Less than 60fps
        logger.debug(`⚡ ${componentName} rendered in ${timeSinceLastRender}ms (render #${renderCount.current})`);
      } else {
        logger.warn(`🐌 ${componentName} slow render: ${timeSinceLastRender}ms (render #${renderCount.current})`);
      }
    }
    
    renderStartTime.current = renderTime;
  });

  return { startTimer, endTimer };
};

/**
 * Hook to monitor expensive operations
 */
export const useOperationTimer = (operationName, enabled = process.env.NODE_ENV === 'development') => {
  const timers = useRef(new Map());

  const startOperation = useCallback((id = 'default') => {
    if (!enabled) return;
    timers.current.set(id, performance.now());
  }, [enabled]);

  const endOperation = useCallback((id = 'default') => {
    if (!enabled) return;
    
    const startTime = timers.current.get(id);
    if (startTime) {
      const duration = performance.now() - startTime;
      logger.debug(`⏱️ ${operationName}[${id}] completed in ${duration.toFixed(2)}ms`);
      timers.current.delete(id);
      return duration;
    }
  }, [operationName, enabled]);

  return { startOperation, endOperation };
};

/**
 * Hook to detect memory leaks
 */
export const useMemoryMonitor = (componentName, enabled = process.env.NODE_ENV === 'development') => {
  const initialMemory = useRef(null);

  useEffect(() => {
    if (!enabled || !performance.memory) return;

    // Record initial memory usage
    if (!initialMemory.current) {
      initialMemory.current = performance.memory.usedJSHeapSize;
    }

    // Cleanup function to check for memory leaks
    return () => {
      if (performance.memory) {
        const currentMemory = performance.memory.usedJSHeapSize;
        const memoryDiff = currentMemory - initialMemory.current;
        
        if (memoryDiff > 10 * 1024 * 1024) { // 10MB threshold
          logger.warn(`🧠 Potential memory leak in ${componentName}: +${(memoryDiff / 1024 / 1024).toFixed(2)}MB`);
        }
      }
    };
  }, [componentName, enabled]);
};

const performanceHooks = {
  usePerformanceMonitor,
  useOperationTimer,
  useMemoryMonitor
};

export default performanceHooks;
