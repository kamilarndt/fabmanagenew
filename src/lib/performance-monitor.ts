/**
 * Performance monitoring system for New UI migration
 */

export interface PerformanceMetrics {
  componentRenderTime: number;
  pageLoadTime: number;
  userInteractionTime: number;
  bundleSize: number;
  memoryUsage: number;
}

export interface UserFeedback {
  userId: string;
  page: string;
  rating: number; // 1-5
  comments?: string;
  timestamp: Date;
  userAgent: string;
  performance: PerformanceMetrics;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private feedback: UserFeedback[] = [];

  /**
   * Measure component render time
   */
  measureComponentRender(componentName: string, renderFn: () => void): void {
    const start = performance.now();
    renderFn();
    const end = performance.now();

    const renderTime = end - start;
    this.metrics.push({
      componentRenderTime: renderTime,
      pageLoadTime: 0,
      userInteractionTime: 0,
      bundleSize: 0,
      memoryUsage: 0,
    });

    // Log slow renders
    if (renderTime > 16) {
      // 60fps threshold
      console.warn(
        `Slow render detected: ${componentName} took ${renderTime}ms`
      );
    }
  }

  /**
   * Measure page load time
   */
  measurePageLoad(pageName: string): void {
    const start = performance.now();

    window.addEventListener("load", () => {
      const end = performance.now();
      const loadTime = end - start;

      this.metrics.push({
        componentRenderTime: 0,
        pageLoadTime: loadTime,
        userInteractionTime: 0,
        bundleSize: 0,
        memoryUsage: 0,
      });

      // Log slow page loads
      if (loadTime > 3000) {
        // 3 second threshold
        console.warn(`Slow page load detected: ${pageName} took ${loadTime}ms`);
      }
    });
  }

  /**
   * Measure user interaction time
   */
  measureUserInteraction(
    interactionName: string,
    interactionFn: () => void
  ): void {
    const start = performance.now();
    interactionFn();
    const end = performance.now();

    const interactionTime = end - start;
    this.metrics.push({
      componentRenderTime: 0,
      pageLoadTime: 0,
      userInteractionTime: interactionTime,
      bundleSize: 0,
      memoryUsage: 0,
    });

    // Log slow interactions
    if (interactionTime > 100) {
      // 100ms threshold
      console.warn(
        `Slow interaction detected: ${interactionName} took ${interactionTime}ms`
      );
    }
  }

  /**
   * Collect user feedback
   */
  collectFeedback(
    feedback: Omit<UserFeedback, "timestamp" | "userAgent" | "performance">
  ): void {
    const fullFeedback: UserFeedback = {
      ...feedback,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      performance: this.getAverageMetrics(),
    };

    this.feedback.push(fullFeedback);

    // Send to analytics (in real implementation)
    this.sendToAnalytics(fullFeedback);
  }

  /**
   * Get average performance metrics
   */
  getAverageMetrics(): PerformanceMetrics {
    if (this.metrics.length === 0) {
      return {
        componentRenderTime: 0,
        pageLoadTime: 0,
        userInteractionTime: 0,
        bundleSize: 0,
        memoryUsage: 0,
      };
    }

    const totals = this.metrics.reduce(
      (acc, metric) => ({
        componentRenderTime:
          acc.componentRenderTime + metric.componentRenderTime,
        pageLoadTime: acc.pageLoadTime + metric.pageLoadTime,
        userInteractionTime:
          acc.userInteractionTime + metric.userInteractionTime,
        bundleSize: acc.bundleSize + metric.bundleSize,
        memoryUsage: acc.memoryUsage + metric.memoryUsage,
      }),
      {
        componentRenderTime: 0,
        pageLoadTime: 0,
        userInteractionTime: 0,
        bundleSize: 0,
        memoryUsage: 0,
      }
    );

    const count = this.metrics.length;
    return {
      componentRenderTime: totals.componentRenderTime / count,
      pageLoadTime: totals.pageLoadTime / count,
      userInteractionTime: totals.userInteractionTime / count,
      bundleSize: totals.bundleSize / count,
      memoryUsage: totals.memoryUsage / count,
    };
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): {
    metrics: PerformanceMetrics;
    feedback: UserFeedback[];
    recommendations: string[];
  } {
    const metrics = this.getAverageMetrics();
    const recommendations = this.generateRecommendations(metrics);

    return {
      metrics,
      feedback: this.feedback,
      recommendations,
    };
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.componentRenderTime > 16) {
      recommendations.push(
        "Consider optimizing component rendering with React.memo or useMemo"
      );
    }

    if (metrics.pageLoadTime > 3000) {
      recommendations.push(
        "Page load time is slow, consider code splitting or lazy loading"
      );
    }

    if (metrics.userInteractionTime > 100) {
      recommendations.push(
        "User interactions are slow, consider debouncing or throttling"
      );
    }

    if (metrics.memoryUsage > 100) {
      recommendations.push(
        "High memory usage detected, check for memory leaks"
      );
    }

    return recommendations;
  }

  /**
   * Send feedback to analytics
   */
  private sendToAnalytics(feedback: UserFeedback): void {
    // In a real implementation, this would send to your analytics service
    console.log("Sending feedback to analytics:", feedback);

    // Example: Send to Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "user_feedback", {
        page: feedback.page,
        rating: feedback.rating,
        performance_score: this.calculatePerformanceScore(feedback.performance),
      });
    }
  }

  /**
   * Calculate performance score (0-100)
   */
  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    let score = 100;

    // Deduct points for slow performance
    if (metrics.componentRenderTime > 16) score -= 20;
    if (metrics.pageLoadTime > 3000) score -= 30;
    if (metrics.userInteractionTime > 100) score -= 25;
    if (metrics.memoryUsage > 100) score -= 25;

    return Math.max(0, score);
  }

  /**
   * Clear metrics (useful for testing)
   */
  clearMetrics(): void {
    this.metrics = [];
    this.feedback = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor() {
  return {
    measureComponentRender:
      performanceMonitor.measureComponentRender.bind(performanceMonitor),
    measurePageLoad:
      performanceMonitor.measurePageLoad.bind(performanceMonitor),
    measureUserInteraction:
      performanceMonitor.measureUserInteraction.bind(performanceMonitor),
    collectFeedback:
      performanceMonitor.collectFeedback.bind(performanceMonitor),
    getPerformanceReport:
      performanceMonitor.getPerformanceReport.bind(performanceMonitor),
  };
}
