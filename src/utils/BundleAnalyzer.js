/**
 * Professional Bundle Analyzer and Performance Monitor
 * Provides runtime bundle analysis and performance insights
 */

import React, { useState, useEffect, useCallback } from 'react';

class BundleAnalyzer {
  constructor() {
    this.chunks = new Map();
    this.loadedChunks = new Set();
    this.loadTimes = new Map();
    this.dependencies = new Map();
    this.startTime = performance.now();
    this.isEnabled = process.env.NODE_ENV === 'development';
  }

  // Track chunk loading
  trackChunkLoad(chunkName, loadTime, size = 0) {
    if (!this.isEnabled) return;

    this.loadedChunks.add(chunkName);
    this.loadTimes.set(chunkName, loadTime);
    
    if (size > 0) {
      this.chunks.set(chunkName, { size, loadTime });
    }

    console.log(`📦 Chunk loaded: ${chunkName} (${loadTime.toFixed(2)}ms)`);
    
    if (this.loadedChunks.size % 5 === 0) {
      this.generateReport();
    }
  }

  // Track dynamic imports
  trackDynamicImport(importPath, promise) {
    if (!this.isEnabled) return promise;

    const startTime = performance.now();
    const chunkName = this.extractChunkName(importPath);

    return promise
      .then(module => {
        const loadTime = performance.now() - startTime;
        this.trackChunkLoad(chunkName, loadTime);
        return module;
      })
      .catch(error => {
        console.error(`❌ Failed to load chunk ${chunkName}:`, error);
        throw error;
      });
  }

  // Extract chunk name from import path
  extractChunkName(importPath) {
    const match = importPath.match(/([^\/]+)(?:\.jsx?)?$/);
    return match ? match[1] : 'unknown';
  }

  // Analyze bundle composition
  analyzeBundles() {
    if (!this.isEnabled) return null;

    const totalSize = Array.from(this.chunks.values())
      .reduce((sum, chunk) => sum + chunk.size, 0);

    const largestChunks = Array.from(this.chunks.entries())
      .sort(([,a], [,b]) => b.size - a.size)
      .slice(0, 10);

    const slowestChunks = Array.from(this.chunks.entries())
      .sort(([,a], [,b]) => b.loadTime - a.loadTime)
      .slice(0, 10);

    return {
      totalChunks: this.chunks.size,
      totalSize,
      averageChunkSize: totalSize / this.chunks.size,
      largestChunks,
      slowestChunks,
      loadedChunks: this.loadedChunks.size,
    };
  }

  // Generate performance report
  generateReport() {
    if (!this.isEnabled) return;

    const analysis = this.analyzeBundles();
    if (!analysis) return;

    console.group('📊 Bundle Analysis Report');
    console.log('Total chunks loaded:', analysis.loadedChunks);
    console.log('Total bundle size:', this.formatBytes(analysis.totalSize));
    console.log('Average chunk size:', this.formatBytes(analysis.averageChunkSize));
    
    if (analysis.largestChunks.length > 0) {
      console.log('Largest chunks:');
      analysis.largestChunks.forEach(([name, chunk]) => {
        console.log(`  ${name}: ${this.formatBytes(chunk.size)}`);
      });
    }

    if (analysis.slowestChunks.length > 0) {
      console.log('Slowest loading chunks:');
      analysis.slowestChunks.forEach(([name, chunk]) => {
        console.log(`  ${name}: ${chunk.loadTime.toFixed(2)}ms`);
      });
    }

    // Performance warnings
    const slowChunks = analysis.slowestChunks.filter(([,chunk]) => chunk.loadTime > 1000);
    if (slowChunks.length > 0) {
      console.warn('⚠️ Slow loading chunks detected:', slowChunks.map(([name]) => name));
    }

    const largeChunks = analysis.largestChunks.filter(([,chunk]) => chunk.size > 500000); // 500KB
    if (largeChunks.length > 0) {
      console.warn('⚠️ Large chunks detected:', largeChunks.map(([name]) => name));
    }

    console.groupEnd();
  }

  // Format bytes for display
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get performance metrics
  getMetrics() {
    return {
      chunks: Array.from(this.chunks.entries()),
      loadTimes: Array.from(this.loadTimes.entries()),
      totalChunks: this.chunks.size,
      loadedChunks: this.loadedChunks.size,
      appStartTime: this.startTime,
      currentTime: performance.now(),
    };
  }
}

// Global instance
const bundleAnalyzer = new BundleAnalyzer();

// Enhanced lazy loading with bundle tracking
export const createTrackedLazyComponent = (importFn, chunkName) => {
  return React.lazy(() => {
    const startTime = performance.now();
    
    return bundleAnalyzer.trackDynamicImport(
      chunkName || importFn.toString(),
      importFn()
    ).then(module => {
      const loadTime = performance.now() - startTime;
      bundleAnalyzer.trackChunkLoad(chunkName || 'unknown', loadTime);
      return module;
    });
  });
};

// Hook for bundle performance monitoring
export const useBundleAnalyzer = () => {
  const [metrics, setMetrics] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updateMetrics = useCallback(() => {
    setMetrics(bundleAnalyzer.getMetrics());
  }, []);

  const generateReport = useCallback(() => {
    setIsAnalyzing(true);
    bundleAnalyzer.generateReport();
    updateMetrics();
    setIsAnalyzing(false);
  }, [updateMetrics]);

  const analyzeCurrentBundles = useCallback(() => {
    return bundleAnalyzer.analyzeBundles();
  }, []);

  useEffect(() => {
    // Update metrics periodically
    const interval = setInterval(updateMetrics, 5000);
    
    // Initial update
    updateMetrics();

    return () => clearInterval(interval);
  }, [updateMetrics]);

  return {
    metrics,
    isAnalyzing,
    generateReport,
    analyzeCurrentBundles,
    updateMetrics,
  };
};

// Performance budget checker
export const usePerformanceBudget = (budgetConfig = {}) => {
  const {
    maxChunkSize = 500000, // 500KB
    maxLoadTime = 3000,    // 3 seconds
    maxTotalSize = 2000000, // 2MB
  } = budgetConfig;

  const [violations, setViolations] = useState([]);

  const checkBudget = useCallback(() => {
    const analysis = bundleAnalyzer.analyzeBundles();
    if (!analysis) return [];

    const newViolations = [];

    // Check individual chunk sizes
    analysis.largestChunks.forEach(([name, chunk]) => {
      if (chunk.size > maxChunkSize) {
        newViolations.push({
          type: 'chunk-size',
          chunk: name,
          actual: chunk.size,
          limit: maxChunkSize,
          severity: chunk.size > maxChunkSize * 2 ? 'high' : 'medium',
        });
      }
    });

    // Check load times
    analysis.slowestChunks.forEach(([name, chunk]) => {
      if (chunk.loadTime > maxLoadTime) {
        newViolations.push({
          type: 'load-time',
          chunk: name,
          actual: chunk.loadTime,
          limit: maxLoadTime,
          severity: chunk.loadTime > maxLoadTime * 2 ? 'high' : 'medium',
        });
      }
    });

    // Check total size
    if (analysis.totalSize > maxTotalSize) {
      newViolations.push({
        type: 'total-size',
        actual: analysis.totalSize,
        limit: maxTotalSize,
        severity: analysis.totalSize > maxTotalSize * 1.5 ? 'high' : 'medium',
      });
    }

    setViolations(newViolations);
    return newViolations;
  }, [maxChunkSize, maxLoadTime, maxTotalSize]);

  useEffect(() => {
    // Check budget periodically
    const interval = setInterval(checkBudget, 10000);
    
    // Initial check
    setTimeout(checkBudget, 5000);

    return () => clearInterval(interval);
  }, [checkBudget]);

  return {
    violations,
    checkBudget,
    hasViolations: violations.length > 0,
    highSeverityViolations: violations.filter(v => v.severity === 'high'),
  };
};

// Resource loading optimizer
export const useResourceOptimizer = () => {
  const [resourceHints, setResourceHints] = useState([]);

  useEffect(() => {
    // Add resource hints for better loading performance
    const hints = [
      // Preconnect to external domains
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://res.cloudinary.com' },
      
      // DNS prefetch for external resources
      { rel: 'dns-prefetch', href: 'https://api.example.com' },
    ];

    hints.forEach(hint => {
      const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
      if (!existing) {
        const link = document.createElement('link');
        Object.assign(link, hint);
        document.head.appendChild(link);
      }
    });

    setResourceHints(hints);
  }, []);

  return { resourceHints };
};

export { bundleAnalyzer };
export default BundleAnalyzer;
