/**
 * Performance Monitor for TimelineX
 * Tracks rendering performance, memory usage, and provides optimization recommendations
 */

export interface PerformanceMetrics {
  renderTime: number;
  frameRate: number;
  memoryUsage: number;
  itemCount: number;
  visibleItemCount: number;
  scrollPerformance: number;
  zoomPerformance: number;
  panPerformance: number;
  lastUpdate: number;
}

export interface PerformanceThresholds {
  maxRenderTime: number; // ms
  minFrameRate: number; // fps
  maxMemoryUsage: number; // MB
  maxVisibleItems: number;
  maxScrollLatency: number; // ms
  maxZoomLatency: number; // ms
  maxPanLatency: number; // ms
}

export interface PerformanceRecommendations {
  shouldUseVirtualScrolling: boolean;
  shouldUseWebGL: boolean;
  shouldReduceItemComplexity: boolean;
  shouldEnableLazyLoading: boolean;
  shouldOptimizeAnimations: boolean;
  recommendedOverscan: number;
  recommendedBatchSize: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private thresholds: PerformanceThresholds;
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  private frameTimes: number[] = [];
  private renderTimes: number[] = [];
  private scrollTimes: number[] = [];
  private zoomTimes: number[] = [];
  private panTimes: number[] = [];
  private observers: Set<(metrics: PerformanceMetrics) => void> = new Set();

  constructor(thresholds: Partial<PerformanceThresholds> = {}) {
    this.thresholds = {
      maxRenderTime: 16.67, // 60fps
      minFrameRate: 30,
      maxMemoryUsage: 100, // MB
      maxVisibleItems: 1000,
      maxScrollLatency: 16.67,
      maxZoomLatency: 16.67,
      maxPanLatency: 16.67,
      ...thresholds,
    };

    this.metrics = {
      renderTime: 0,
      frameRate: 0,
      memoryUsage: 0,
      itemCount: 0,
      visibleItemCount: 0,
      scrollPerformance: 0,
      zoomPerformance: 0,
      panPerformance: 0,
      lastUpdate: Date.now(),
    };

    this.startMonitoring();
  }

  private startMonitoring(): void {
    // Monitor frame rate
    const measureFrameRate = () => {
      const now = performance.now();
      if (this.lastFrameTime > 0) {
        const deltaTime = now - this.lastFrameTime;
        this.frameTimes.push(deltaTime);
        
        // Keep only last 60 frames
        if (this.frameTimes.length > 60) {
          this.frameTimes.shift();
        }
        
        // Calculate average frame rate
        const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
        this.metrics.frameRate = 1000 / avgFrameTime;
      }
      this.lastFrameTime = now;
      requestAnimationFrame(measureFrameRate);
    };
    
    requestAnimationFrame(measureFrameRate);

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      }, 1000);
    }
  }

  public startRender(): void {
    this.renderStartTime = performance.now();
  }

  public endRender(itemCount: number, visibleItemCount: number): void {
    if (this.renderStartTime === 0) return;

    const renderTime = performance.now() - this.renderStartTime;
    this.renderTimes.push(renderTime);
    
    // Keep only last 60 renders
    if (this.renderTimes.length > 60) {
      this.renderTimes.shift();
    }

    this.metrics.renderTime = renderTime;
    this.metrics.itemCount = itemCount;
    this.metrics.visibleItemCount = visibleItemCount;
    this.metrics.lastUpdate = Date.now();

    this.notifyObservers();
    this.renderStartTime = 0;
  }

  private renderStartTime: number = 0;

  public startScroll(): void {
    this.scrollStartTime = performance.now();
  }

  public endScroll(): void {
    if (this.scrollStartTime === 0) return;

    const scrollTime = performance.now() - this.scrollStartTime;
    this.scrollTimes.push(scrollTime);
    
    if (this.scrollTimes.length > 60) {
      this.scrollTimes.shift();
    }

    this.metrics.scrollPerformance = scrollTime;
    this.scrollStartTime = 0;
  }

  private scrollStartTime: number = 0;

  public startZoom(): void {
    this.zoomStartTime = performance.now();
  }

  public endZoom(): void {
    if (this.zoomStartTime === 0) return;

    const zoomTime = performance.now() - this.zoomStartTime;
    this.zoomTimes.push(zoomTime);
    
    if (this.zoomTimes.length > 60) {
      this.zoomTimes.shift();
    }

    this.metrics.zoomPerformance = zoomTime;
    this.zoomStartTime = 0;
  }

  private zoomStartTime: number = 0;

  public startPan(): void {
    this.panStartTime = performance.now();
  }

  public endPan(): void {
    if (this.panStartTime === 0) return;

    const panTime = performance.now() - this.panStartTime;
    this.panTimes.push(panTime);
    
    if (this.panTimes.length > 60) {
      this.panTimes.shift();
    }

    this.metrics.panPerformance = panTime;
    this.panStartTime = 0;
  }

  private panStartTime: number = 0;

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getRecommendations(): PerformanceRecommendations {
    const avgRenderTime = this.renderTimes.length > 0 
      ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length 
      : 0;
    
    const avgScrollTime = this.scrollTimes.length > 0 
      ? this.scrollTimes.reduce((a, b) => a + b, 0) / this.scrollTimes.length 
      : 0;
    
    const avgZoomTime = this.zoomTimes.length > 0 
      ? this.zoomTimes.reduce((a, b) => a + b, 0) / this.zoomTimes.length 
      : 0;
    
    const avgPanTime = this.panTimes.length > 0 
      ? this.panTimes.reduce((a, b) => a + b, 0) / this.panTimes.length 
      : 0;

    return {
      shouldUseVirtualScrolling: 
        this.metrics.itemCount > this.thresholds.maxVisibleItems ||
        avgRenderTime > this.thresholds.maxRenderTime,
      
      shouldUseWebGL: 
        this.metrics.frameRate < this.thresholds.minFrameRate ||
        this.metrics.itemCount > 5000,
      
      shouldReduceItemComplexity: 
        avgRenderTime > this.thresholds.maxRenderTime * 2,
      
      shouldEnableLazyLoading: 
        this.metrics.itemCount > 10000,
      
      shouldOptimizeAnimations: 
        this.metrics.frameRate < this.thresholds.minFrameRate,
      
      recommendedOverscan: this.metrics.itemCount > 10000 ? 5 : 10,
      
      recommendedBatchSize: this.metrics.itemCount > 50000 ? 100 : 500,
    };
  }

  public isPerformanceGood(): boolean {
    const recommendations = this.getRecommendations();
    return !recommendations.shouldUseVirtualScrolling && 
           !recommendations.shouldUseWebGL &&
           !recommendations.shouldReduceItemComplexity;
  }

  public subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  private notifyObservers(): void {
    this.observers.forEach(callback => callback(this.metrics));
  }

  public reset(): void {
    this.frameTimes = [];
    this.renderTimes = [];
    this.scrollTimes = [];
    this.zoomTimes = [];
    this.panTimes = [];
    this.metrics = {
      renderTime: 0,
      frameRate: 0,
      memoryUsage: 0,
      itemCount: 0,
      visibleItemCount: 0,
      scrollPerformance: 0,
      zoomPerformance: 0,
      panPerformance: 0,
      lastUpdate: Date.now(),
    };
  }

  public getPerformanceReport(): string {
    const metrics = this.getMetrics();
    const recommendations = this.getRecommendations();
    
    return `
TimelineX Performance Report
============================
Render Time: ${metrics.renderTime.toFixed(2)}ms (target: <${this.thresholds.maxRenderTime}ms)
Frame Rate: ${metrics.frameRate.toFixed(1)}fps (target: >${this.thresholds.minFrameRate}fps)
Memory Usage: ${metrics.memoryUsage.toFixed(1)}MB (target: <${this.thresholds.maxMemoryUsage}MB)
Total Items: ${metrics.itemCount}
Visible Items: ${metrics.visibleItemCount}

Recommendations:
- Virtual Scrolling: ${recommendations.shouldUseVirtualScrolling ? 'YES' : 'NO'}
- WebGL Rendering: ${recommendations.shouldUseWebGL ? 'YES' : 'NO'}
- Reduce Complexity: ${recommendations.shouldReduceItemComplexity ? 'YES' : 'NO'}
- Lazy Loading: ${recommendations.shouldEnableLazyLoading ? 'YES' : 'NO'}
- Optimize Animations: ${recommendations.shouldOptimizeAnimations ? 'YES' : 'NO'}

Performance Status: ${this.isPerformanceGood() ? 'GOOD' : 'NEEDS OPTIMIZATION'}
    `.trim();
  }
}

// Global performance monitor instance
let globalPerformanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!globalPerformanceMonitor) {
    globalPerformanceMonitor = new PerformanceMonitor();
  }
  return globalPerformanceMonitor;
}

export function createPerformanceMonitor(thresholds?: Partial<PerformanceThresholds>): PerformanceMonitor {
  return new PerformanceMonitor(thresholds);
}

