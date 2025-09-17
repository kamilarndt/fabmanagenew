// TimelineX Performance Optimizer
// Handles performance optimization for large datasets

import { TimelineItem, TimelineGroup } from '../types';

export interface PerformanceConfig {
  maxItems: number;
  maxGroups: number;
  enableVirtualScrolling: boolean;
  enableItemClustering: boolean;
  enableLazyLoading: boolean;
  enableDebouncing: boolean;
  debounceDelay: number;
  enableMemoization: boolean;
  enableWebWorkers: boolean;
  enableCanvasRendering: boolean;
  enableGPUAcceleration: boolean;
}

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  itemCount: number;
  groupCount: number;
  visibleItemCount: number;
  fps: number;
  lastUpdate: number;
}

export class PerformanceOptimizer {
  private config: PerformanceConfig;
  private metrics: PerformanceMetrics;
  private renderQueue: (() => void)[] = [];
  private isRendering = false;
  private lastRenderTime = 0;
  private frameCount = 0;
  private lastFpsUpdate = 0;
  private worker: Worker | null = null;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private memoCache: Map<string, any> = new Map();

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      maxItems: 10000,
      maxGroups: 1000,
      enableVirtualScrolling: true,
      enableItemClustering: true,
      enableLazyLoading: true,
      enableDebouncing: true,
      debounceDelay: 16, // ~60fps
      enableMemoization: true,
      enableWebWorkers: false, // Disabled by default due to complexity
      enableCanvasRendering: true,
      enableGPUAcceleration: true,
      ...config,
    };

    this.metrics = {
      renderTime: 0,
      memoryUsage: 0,
      itemCount: 0,
      groupCount: 0,
      visibleItemCount: 0,
      fps: 60,
      lastUpdate: Date.now(),
    };

    this.initializeWorker();
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (config.enableWebWorkers !== undefined) {
      if (config.enableWebWorkers) {
        this.initializeWorker();
      } else {
        this.destroyWorker();
      }
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Check if performance is within acceptable limits
   */
  isPerformanceAcceptable(): boolean {
    return (
      this.metrics.fps >= 30 &&
      this.metrics.renderTime < 16 && // 60fps target
      this.metrics.memoryUsage < 100 * 1024 * 1024 // 100MB limit
    );
  }

  /**
   * Optimize items for rendering
   */
  optimizeItems(items: TimelineItem[], groups: TimelineGroup[] = []): {
    optimizedItems: TimelineItem[];
    optimizedGroups: TimelineGroup[];
    shouldUseVirtualScrolling: boolean;
    shouldUseClustering: boolean;
  } {
    const startTime = performance.now();
    
    let optimizedItems = items;
    let optimizedGroups = groups;
    let shouldUseVirtualScrolling = false;
    let shouldUseClustering = false;

    // Check if we need virtual scrolling
    if (this.config.enableVirtualScrolling && items.length > this.config.maxItems) {
      shouldUseVirtualScrolling = true;
    }

    // Check if we need clustering
    if (this.config.enableItemClustering && items.length > this.config.maxItems / 2) {
      shouldUseClustering = true;
      optimizedItems = this.clusterItems(items);
    }

    // Update metrics
    this.metrics.itemCount = optimizedItems.length;
    this.metrics.groupCount = optimizedGroups.length;
    this.metrics.renderTime = performance.now() - startTime;
    this.metrics.lastUpdate = Date.now();

    return {
      optimizedItems,
      optimizedGroups,
      shouldUseVirtualScrolling,
      shouldUseClustering,
    };
  }

  /**
   * Cluster overlapping items
   */
  private clusterItems(items: TimelineItem[]): TimelineItem[] {
    const clusters: TimelineItem[][] = [];
    const processed = new Set<string>();

    for (const item of items) {
      if (processed.has(item.id)) continue;

      const cluster = [item];
      processed.add(item.id);

      // Find overlapping items
      for (const otherItem of items) {
        if (processed.has(otherItem.id)) continue;
        if (this.itemsOverlap(item, otherItem)) {
          cluster.push(otherItem);
          processed.add(otherItem.id);
        }
      }

      clusters.push(cluster);
    }

    // Convert clusters to single items
    return clusters.map(cluster => {
      if (cluster.length === 1) {
        return cluster[0];
      }

      // Create a cluster item
      const startTimes = cluster.map(item => item.start.getTime());
      const endTimes = cluster.map(item => (item.end || item.start).getTime());
      
      return {
        id: `cluster-${cluster[0].id}`,
        title: `Cluster (${cluster.length} items)`,
        start: new Date(Math.min(...startTimes)),
        end: new Date(Math.max(...endTimes)),
        isCluster: true,
        clusterItems: cluster,
        metadata: {
          clusterSize: cluster.length,
          originalItems: cluster.map(item => item.id),
        },
      } as TimelineItem;
    });
  }

  /**
   * Check if two items overlap
   */
  private itemsOverlap(item1: TimelineItem, item2: TimelineItem): boolean {
    const start1 = item1.start.getTime();
    const end1 = (item1.end || item1.start).getTime();
    const start2 = item2.start.getTime();
    const end2 = (item2.end || item2.start).getTime();

    return start1 < end2 && start2 < end1;
  }

  /**
   * Debounce a function call
   */
  debounce<T extends (...args: any[]) => void>(
    key: string,
    fn: T,
    delay: number = this.config.debounceDelay
  ): T {
    if (!this.config.enableDebouncing) {
      return fn;
    }

    return ((...args: Parameters<T>) => {
      const existingTimer = this.debounceTimers.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        fn(...args);
        this.debounceTimers.delete(key);
      }, delay);

      this.debounceTimers.set(key, timer);
    }) as T;
  }

  /**
   * Memoize a function result
   */
  memoize<T extends (...args: any[]) => any>(
    key: string,
    fn: T,
    args: Parameters<T>
  ): ReturnType<T> {
    if (!this.config.enableMemoization) {
      return fn(...args);
    }

    const cacheKey = `${key}-${JSON.stringify(args)}`;
    
    if (this.memoCache.has(cacheKey)) {
      return this.memoCache.get(cacheKey);
    }

    const result = fn(...args);
    this.memoCache.set(cacheKey, result);
    
    // Limit cache size
    if (this.memoCache.size > 1000) {
      const firstKey = this.memoCache.keys().next().value;
      if (firstKey) {
        this.memoCache.delete(firstKey);
      }
    }

    return result;
  }

  /**
   * Queue a render operation
   */
  queueRender(renderFn: () => void): void {
    this.renderQueue.push(renderFn);
    
    if (!this.isRendering) {
      this.processRenderQueue();
    }
  }

  /**
   * Process the render queue
   */
  private processRenderQueue(): void {
    if (this.renderQueue.length === 0) {
      this.isRendering = false;
      return;
    }

    this.isRendering = true;
    const startTime = performance.now();

    // Process render operations
    while (this.renderQueue.length > 0) {
      const renderFn = this.renderQueue.shift();
      if (renderFn) {
        renderFn();
      }
    }

    // Update metrics
    this.metrics.renderTime = performance.now() - startTime;
    this.updateFps();

    // Schedule next frame
    requestAnimationFrame(() => {
      this.processRenderQueue();
    });
  }

  /**
   * Update FPS counter
   */
  private updateFps(): void {
    this.frameCount++;
    const now = performance.now();
    
    if (now - this.lastFpsUpdate >= 1000) {
      this.metrics.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }
  }

  /**
   * Initialize web worker for heavy computations
   */
  private initializeWorker(): void {
    if (!this.config.enableWebWorkers) return;

    try {
      // Create a simple worker for data processing
      const workerCode = `
        self.onmessage = function(e) {
          const { type, data } = e.data;
          
          switch (type) {
            case 'clusterItems':
              const result = clusterItems(data.items);
              self.postMessage({ type: 'clustered', data: result });
              break;
            case 'sortItems':
              const sorted = data.items.sort((a, b) => a.start - b.start);
              self.postMessage({ type: 'sorted', data: sorted });
              break;
          }
        };
        
        function clusterItems(items) {
          // Simple clustering implementation
          return items;
        }
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
    } catch (error) {
      console.warn('Failed to initialize web worker:', error);
      this.config.enableWebWorkers = false;
    }
  }

  /**
   * Destroy web worker
   */
  private destroyWorker(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  /**
   * Process data in web worker
   */
  processInWorker<T>(type: string, data: any): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Web worker not available'));
        return;
      }

      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === type) {
          this.worker!.removeEventListener('message', handleMessage);
          resolve(event.data.data);
        }
      };

      this.worker.addEventListener('message', handleMessage);
      this.worker.postMessage({ type, data });
    });
  }

  /**
   * Clear all caches and timers
   */
  clearCaches(): void {
    this.memoCache.clear();
    
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
  }

  /**
   * Get memory usage (if available)
   */
  getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * Update memory usage in metrics
   */
  updateMemoryUsage(): void {
    this.metrics.memoryUsage = this.getMemoryUsage();
  }

  /**
   * Check if we should use canvas rendering
   */
  shouldUseCanvasRendering(itemCount: number): boolean {
    return this.config.enableCanvasRendering && itemCount > 1000;
  }

  /**
   * Check if we should use GPU acceleration
   */
  shouldUseGPUAcceleration(): boolean {
    return this.config.enableGPUAcceleration && 'gpu' in navigator;
  }

  /**
   * Get performance recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.metrics.fps < 30) {
      recommendations.push('Consider enabling virtual scrolling for better performance');
    }

    if (this.metrics.renderTime > 16) {
      recommendations.push('Consider reducing the number of visible items');
    }

    if (this.metrics.memoryUsage > 50 * 1024 * 1024) {
      recommendations.push('Consider enabling item clustering to reduce memory usage');
    }

    if (this.metrics.itemCount > this.config.maxItems) {
      recommendations.push('Consider implementing lazy loading for large datasets');
    }

    return recommendations;
  }

  /**
   * Destroy the performance optimizer
   */
  destroy(): void {
    this.clearCaches();
    this.destroyWorker();
    this.renderQueue = [];
    this.isRendering = false;
  }
}
