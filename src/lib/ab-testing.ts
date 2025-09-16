/**
 * A/B Testing system for New UI migration
 */

export interface ABTestConfig {
  testName: string;
  variants: {
    control: string;
    treatment: string;
  };
  trafficSplit: number; // 0-1, percentage of users who see treatment
  startDate: Date;
  endDate: Date;
  metrics: string[];
}

export interface ABTestResult {
  testName: string;
  variant: string;
  userId: string;
  timestamp: Date;
  metrics: Record<string, number>;
}

class ABTesting {
  private tests: Map<string, ABTestConfig> = new Map();
  private results: ABTestResult[] = [];

  /**
   * Register a new A/B test
   */
  registerTest(config: ABTestConfig): void {
    this.tests.set(config.testName, config);
  }

  /**
   * Get variant for a user
   */
  getVariant(testName: string, userId: string): string {
    const test = this.tests.get(testName);
    if (!test) {
      console.warn(`A/B test "${testName}" not found`);
      return "control";
    }

    // Check if test is active
    const now = new Date();
    if (now < test.startDate || now > test.endDate) {
      return "control";
    }

    // Simple hash-based assignment
    const hash = this.hashString(userId + testName);
    const bucket = hash % 100;

    return bucket < test.trafficSplit * 100 ? "treatment" : "control";
  }

  /**
   * Record a test result
   */
  recordResult(result: Omit<ABTestResult, "timestamp">): void {
    this.results.push({
      ...result,
      timestamp: new Date(),
    });

    // Send to analytics
    this.sendToAnalytics(result);
  }

  /**
   * Get test results
   */
  getTestResults(testName: string): {
    control: ABTestResult[];
    treatment: ABTestResult[];
    summary: {
      control: { count: number; avgMetrics: Record<string, number> };
      treatment: { count: number; avgMetrics: Record<string, number> };
      significance: Record<string, number>;
    };
  } {
    const testResults = this.results.filter((r) => r.testName === testName);
    const control = testResults.filter((r) => r.variant === "control");
    const treatment = testResults.filter((r) => r.variant === "treatment");

    return {
      control,
      treatment,
      summary: {
        control: {
          count: control.length,
          avgMetrics: this.calculateAverageMetrics(control),
        },
        treatment: {
          count: treatment.length,
          avgMetrics: this.calculateAverageMetrics(treatment),
        },
        significance: this.calculateSignificance(control, treatment),
      },
    };
  }

  /**
   * Simple hash function
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Calculate average metrics
   */
  private calculateAverageMetrics(
    results: ABTestResult[]
  ): Record<string, number> {
    if (results.length === 0) return {};

    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};

    results.forEach((result) => {
      Object.entries(result.metrics).forEach(([key, value]) => {
        totals[key] = (totals[key] || 0) + value;
        counts[key] = (counts[key] || 0) + 1;
      });
    });

    const averages: Record<string, number> = {};
    Object.keys(totals).forEach((key) => {
      averages[key] = totals[key] / counts[key];
    });

    return averages;
  }

  /**
   * Calculate statistical significance (simplified)
   */
  private calculateSignificance(
    control: ABTestResult[],
    treatment: ABTestResult[]
  ): Record<string, number> {
    const significance: Record<string, number> = {};

    // Get all metric keys
    const allKeys = new Set<string>();
    [...control, ...treatment].forEach((result) => {
      Object.keys(result.metrics).forEach((key) => allKeys.add(key));
    });

    allKeys.forEach((key) => {
      const controlValues = control.map((r) => r.metrics[key] || 0);
      const treatmentValues = treatment.map((r) => r.metrics[key] || 0);

      // Simple t-test approximation
      const controlMean =
        controlValues.reduce((a, b) => a + b, 0) / controlValues.length;
      const treatmentMean =
        treatmentValues.reduce((a, b) => a + b, 0) / treatmentValues.length;

      const controlVar =
        controlValues.reduce((a, b) => a + Math.pow(b - controlMean, 2), 0) /
        controlValues.length;
      const treatmentVar =
        treatmentValues.reduce(
          (a, b) => a + Math.pow(b - treatmentMean, 2),
          0
        ) / treatmentValues.length;

      const pooledVar = (controlVar + treatmentVar) / 2;
      const standardError = Math.sqrt(
        pooledVar * (1 / controlValues.length + 1 / treatmentValues.length)
      );

      const tStatistic = (treatmentMean - controlMean) / standardError;
      significance[key] = Math.abs(tStatistic);
    });

    return significance;
  }

  /**
   * Send results to analytics
   */
  private sendToAnalytics(result: Omit<ABTestResult, "timestamp">): void {
    // In a real implementation, this would send to your analytics service
    console.log("Sending A/B test result to analytics:", result);

    // Example: Send to Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "ab_test_result", {
        test_name: result.testName,
        variant: result.variant,
        user_id: result.userId,
        metrics: result.metrics,
      });
    }
  }

  /**
   * Clear test results (useful for testing)
   */
  clearResults(): void {
    this.results = [];
  }
}

// Export singleton instance
export const abTesting = new ABTesting();

// React hook for A/B testing
export function useABTesting() {
  return {
    getVariant: abTesting.getVariant.bind(abTesting),
    recordResult: abTesting.recordResult.bind(abTesting),
    getTestResults: abTesting.getTestResults.bind(abTesting),
  };
}

// Initialize default tests
abTesting.registerTest({
  testName: "dashboard-ui",
  variants: {
    control: "antd",
    treatment: "new-ui",
  },
  trafficSplit: 0.1, // 10% of users see new UI
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  metrics: ["page_load_time", "user_satisfaction", "task_completion_rate"],
});
