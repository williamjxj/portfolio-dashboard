/**
 * Performance monitoring utilities for tech stack page and navigation
 */

interface PerformanceMetrics {
  pageLoadTime: number;
  navigationTime: number;
  dataFetchTime: number;
  renderTime: number;
  totalTime: number;
}

interface PerformanceEntry {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private entries: Map<string, PerformanceEntry> = new Map();
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    navigationTime: 0,
    dataFetchTime: 0,
    renderTime: 0,
    totalTime: 0
  };

  /**
   * Start timing a performance entry
   */
  startTiming(name: string): void {
    this.entries.set(name, {
      name,
      startTime: performance.now()
    });
  }

  /**
   * End timing a performance entry
   */
  endTiming(name: string): number {
    const entry = this.entries.get(name);
    if (!entry) {
      console.warn(`Performance entry "${name}" not found`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - entry.startTime;

    entry.endTime = endTime;
    entry.duration = duration;

    // Update metrics based on entry name
    this.updateMetrics(name, duration);

    return duration;
  }

  /**
   * Update metrics based on entry name
   */
  private updateMetrics(name: string, duration: number): void {
    switch (name) {
      case 'page-load':
        this.metrics.pageLoadTime = duration;
        break;
      case 'navigation':
        this.metrics.navigationTime = duration;
        break;
      case 'data-fetch':
        this.metrics.dataFetchTime = duration;
        break;
      case 'render':
        this.metrics.renderTime = duration;
        break;
    }

    this.metrics.totalTime = this.metrics.pageLoadTime + 
                           this.metrics.navigationTime + 
                           this.metrics.dataFetchTime + 
                           this.metrics.renderTime;
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get all performance entries
   */
  getEntries(): PerformanceEntry[] {
    return Array.from(this.entries.values());
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    metrics: PerformanceMetrics;
    entries: PerformanceEntry[];
    recommendations: string[];
  } {
    const recommendations: string[] = [];

    // Performance recommendations
    if (this.metrics.pageLoadTime > 2000) {
      recommendations.push('Page load time is over 2 seconds. Consider optimizing assets and code splitting.');
    }

    if (this.metrics.dataFetchTime > 1000) {
      recommendations.push('Data fetch time is over 1 second. Consider implementing caching or optimizing API calls.');
    }

    if (this.metrics.renderTime > 500) {
      recommendations.push('Render time is over 500ms. Consider optimizing component rendering or using React.memo.');
    }

    if (this.metrics.totalTime > 3000) {
      recommendations.push('Total time is over 3 seconds. Consider overall performance optimization.');
    }

    return {
      metrics: this.metrics,
      entries: this.getEntries(),
      recommendations
    };
  }

  /**
   * Clear all performance data
   */
  clear(): void {
    this.entries.clear();
    this.metrics = {
      pageLoadTime: 0,
      navigationTime: 0,
      dataFetchTime: 0,
      renderTime: 0,
      totalTime: 0
    };
  }

  /**
   * Log performance summary to console
   */
  logSummary(): void {
    const summary = this.getSummary();
    
    console.group('🚀 Performance Summary');
    console.table(summary.metrics);
    
    if (summary.entries.length > 0) {
      console.group('📊 Performance Entries');
      summary.entries.forEach(entry => {
        console.log(`${entry.name}: ${entry.duration?.toFixed(2)}ms`);
      });
      console.groupEnd();
    }

    if (summary.recommendations.length > 0) {
      console.group('💡 Recommendations');
      summary.recommendations.forEach(rec => console.log(`• ${rec}`));
      console.groupEnd();
    }

    console.groupEnd();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitoring() {
  const startTiming = (name: string) => performanceMonitor.startTiming(name);
  const endTiming = (name: string) => performanceMonitor.endTiming(name);
  const getMetrics = () => performanceMonitor.getMetrics();
  const getSummary = () => performanceMonitor.getSummary();
  const logSummary = () => performanceMonitor.logSummary();

  return {
    startTiming,
    endTiming,
    getMetrics,
    getSummary,
    logSummary
  };
}

/**
 * Performance decorator for functions
 */
export function withPerformanceMonitoring<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: any[]) => {
    performanceMonitor.startTiming(name);
    const result = fn(...args);
    
    if (result instanceof Promise) {
      return result.finally(() => {
        performanceMonitor.endTiming(name);
      });
    } else {
      performanceMonitor.endTiming(name);
      return result;
    }
  }) as T;
}

/**
 * Performance monitoring for React components
 */
export function withComponentPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  return React.memo((props: P) => {
    React.useEffect(() => {
      performanceMonitor.startTiming(`${componentName}-render`);
      
      return () => {
        performanceMonitor.endTiming(`${componentName}-render`);
      };
    });

    return React.createElement(Component, props);
  });
}




