/**
 * Performance Optimization System
 *
 * This system monitors and optimizes performance based on real usage data
 */

export interface PerformanceMetrics {
  pageLoadTime: number;
  componentRenderTime: number;
  userInteractionTime: number;
  memoryUsage: number;
  bundleSize: number;
  networkRequests: number;
  errorRate: number;
}

export interface OptimizationRecommendation {
  id: string;
  type:
    | "code-splitting"
    | "lazy-loading"
    | "memoization"
    | "virtualization"
    | "caching"
    | "bundle-optimization";
  priority: "low" | "medium" | "high" | "critical";
  description: string;
  impact: string;
  effort: "low" | "medium" | "high";
  estimatedImprovement: number; // percentage
}

export interface PerformanceThresholds {
  pageLoadTime: number; // ms
  componentRenderTime: number; // ms
  userInteractionTime: number; // ms
  memoryUsage: number; // MB
  errorRate: number; // percentage
}

export class PerformanceOptimizer {
  private metrics: PerformanceMetrics[] = [];
  private thresholds: PerformanceThresholds = {
    pageLoadTime: 2000,
    componentRenderTime: 100,
    userInteractionTime: 200,
    memoryUsage: 100,
    errorRate: 1,
  };

  /**
   * Record performance metrics
   */
  recordMetrics(metrics: Partial<PerformanceMetrics>): void {
    const fullMetrics: PerformanceMetrics = {
      pageLoadTime: 0,
      componentRenderTime: 0,
      userInteractionTime: 0,
      memoryUsage: 0,
      bundleSize: 0,
      networkRequests: 0,
      errorRate: 0,
      ...metrics,
    };

    this.metrics.push(fullMetrics);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Check for performance issues
    this.checkPerformanceIssues(fullMetrics);
  }

  /**
   * Check for performance issues and generate recommendations
   */
  private checkPerformanceIssues(metrics: PerformanceMetrics): void {
    const issues: string[] = [];
    const recommendations: OptimizationRecommendation[] = [];

    // Check page load time
    if (metrics.pageLoadTime > this.thresholds.pageLoadTime) {
      issues.push(
        `Page load time (${metrics.pageLoadTime}ms) exceeds threshold (${this.thresholds.pageLoadTime}ms)`
      );
      recommendations.push({
        id: "page-load-optimization",
        type: "code-splitting",
        priority: "high",
        description: "Implement code splitting to reduce initial bundle size",
        impact: "Reduce initial page load time by 30-50%",
        effort: "medium",
        estimatedImprovement: 40,
      });
    }

    // Check component render time
    if (metrics.componentRenderTime > this.thresholds.componentRenderTime) {
      issues.push(
        `Component render time (${metrics.componentRenderTime}ms) exceeds threshold (${this.thresholds.componentRenderTime}ms)`
      );
      recommendations.push({
        id: "component-optimization",
        type: "memoization",
        priority: "medium",
        description:
          "Add React.memo and useMemo to prevent unnecessary re-renders",
        impact: "Reduce component render time by 20-40%",
        effort: "low",
        estimatedImprovement: 30,
      });
    }

    // Check user interaction time
    if (metrics.userInteractionTime > this.thresholds.userInteractionTime) {
      issues.push(
        `User interaction time (${metrics.userInteractionTime}ms) exceeds threshold (${this.thresholds.userInteractionTime}ms)`
      );
      recommendations.push({
        id: "interaction-optimization",
        type: "lazy-loading",
        priority: "medium",
        description: "Implement lazy loading for heavy components",
        impact: "Improve user interaction responsiveness by 25-35%",
        effort: "medium",
        estimatedImprovement: 30,
      });
    }

    // Check memory usage
    if (metrics.memoryUsage > this.thresholds.memoryUsage) {
      issues.push(
        `Memory usage (${metrics.memoryUsage}MB) exceeds threshold (${this.thresholds.memoryUsage}MB)`
      );
      recommendations.push({
        id: "memory-optimization",
        type: "virtualization",
        priority: "high",
        description: "Implement virtualization for large lists and tables",
        impact: "Reduce memory usage by 50-70%",
        effort: "high",
        estimatedImprovement: 60,
      });
    }

    // Check error rate
    if (metrics.errorRate > this.thresholds.errorRate) {
      issues.push(
        `Error rate (${metrics.errorRate}%) exceeds threshold (${this.thresholds.errorRate}%)`
      );
      recommendations.push({
        id: "error-optimization",
        type: "caching",
        priority: "critical",
        description: "Implement better error handling and caching strategies",
        impact: "Reduce error rate by 80-90%",
        effort: "medium",
        estimatedImprovement: 85,
      });
    }

    if (issues.length > 0) {
      console.warn("Performance issues detected:", issues);
      this.generateOptimizationPlan(recommendations);
    }
  }

  /**
   * Generate optimization plan based on recommendations
   */
  private generateOptimizationPlan(
    recommendations: OptimizationRecommendation[]
  ): void {
    // Sort by priority and impact
    const sortedRecommendations = recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.estimatedImprovement - a.estimatedImprovement;
    });

    console.log("Optimization recommendations:", sortedRecommendations);

    // Store recommendations for the migration dashboard
    localStorage.setItem(
      "performance-recommendations",
      JSON.stringify(sortedRecommendations)
    );
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): {
    metrics: PerformanceMetrics[];
    averageMetrics: PerformanceMetrics;
    recommendations: OptimizationRecommendation[];
    issues: string[];
  } {
    const recommendations = JSON.parse(
      localStorage.getItem("performance-recommendations") || "[]"
    );

    // Calculate average metrics
    const averageMetrics: PerformanceMetrics = {
      pageLoadTime: 0,
      componentRenderTime: 0,
      userInteractionTime: 0,
      memoryUsage: 0,
      bundleSize: 0,
      networkRequests: 0,
      errorRate: 0,
    };

    if (this.metrics.length > 0) {
      Object.keys(averageMetrics).forEach((key) => {
        const sum = this.metrics.reduce(
          (acc, metric) => acc + (metric as any)[key],
          0
        );
        (averageMetrics as any)[key] = sum / this.metrics.length;
      });
    }

    // Identify current issues
    const issues: string[] = [];
    if (averageMetrics.pageLoadTime > this.thresholds.pageLoadTime) {
      issues.push("Page load time exceeds threshold");
    }
    if (
      averageMetrics.componentRenderTime > this.thresholds.componentRenderTime
    ) {
      issues.push("Component render time exceeds threshold");
    }
    if (
      averageMetrics.userInteractionTime > this.thresholds.userInteractionTime
    ) {
      issues.push("User interaction time exceeds threshold");
    }
    if (averageMetrics.memoryUsage > this.thresholds.memoryUsage) {
      issues.push("Memory usage exceeds threshold");
    }
    if (averageMetrics.errorRate > this.thresholds.errorRate) {
      issues.push("Error rate exceeds threshold");
    }

    return {
      metrics: this.metrics,
      averageMetrics,
      recommendations,
      issues,
    };
  }

  /**
   * Set performance thresholds
   */
  setThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  /**
   * Get current thresholds
   */
  getThresholds(): PerformanceThresholds {
    return this.thresholds;
  }

  /**
   * Clear metrics history
   */
  clearMetrics(): void {
    this.metrics = [];
    localStorage.removeItem("performance-recommendations");
  }
}

// Global instance
export const performanceOptimizer = new PerformanceOptimizer();
