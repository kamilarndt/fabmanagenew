/**
 * Monitoring System for Migration
 *
 * This system provides comprehensive monitoring and iteration capabilities
 */

export interface MonitoringAlert {
  id: string;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  source: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface PerformanceAlert {
  id: string;
  metric: string;
  currentValue: number;
  threshold: number;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  resolved: boolean;
  trend: "increasing" | "decreasing" | "stable";
}

export interface UserFeedbackAlert {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  category: "bug" | "feature-request" | "performance" | "ui-ux" | "other";
  resolved: boolean;
}

export interface SystemHealth {
  overall: "healthy" | "warning" | "critical";
  components: {
    frontend: "healthy" | "warning" | "critical";
    backend: "healthy" | "warning" | "critical";
    database: "healthy" | "warning" | "critical";
    cache: "healthy" | "warning" | "critical";
  };
  metrics: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
  lastUpdated: string;
}

export interface IterationPlan {
  id: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "planned" | "in-progress" | "completed" | "cancelled";
  estimatedEffort: number; // hours
  actualEffort?: number;
  assignedTo: string;
  startDate?: string;
  endDate?: string;
  changes: string[];
  impact: "low" | "medium" | "high";
  risk: "low" | "medium" | "high";
}

export class MonitoringSystem {
  private alerts: MonitoringAlert[] = [];
  private performanceAlerts: PerformanceAlert[] = [];
  private feedbackAlerts: UserFeedbackAlert[] = [];
  private systemHealth: SystemHealth | null = null;
  private iterationPlans: IterationPlan[] = [];
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadMonitoringData();
    this.initializeSystemHealth();
  }

  /**
   * Initialize system health monitoring
   */
  private initializeSystemHealth(): void {
    this.systemHealth = {
      overall: "healthy",
      components: {
        frontend: "healthy",
        backend: "healthy",
        database: "healthy",
        cache: "healthy",
      },
      metrics: {
        uptime: 99.9,
        responseTime: 200,
        errorRate: 0.1,
        throughput: 1000,
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Start monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log("Starting monitoring system...");

    // Set up monitoring interval
    this.monitoringInterval = setInterval(() => {
      this.checkSystemHealth();
      this.checkPerformanceMetrics();
      this.checkUserFeedback();
      this.updateSystemHealth();
    }, 10000); // Check every 10 seconds
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log("Stopped monitoring system");
  }

  /**
   * Check system health
   */
  private checkSystemHealth(): void {
    if (!this.systemHealth) return;

    // Simulate health checks
    const healthChecks = {
      frontend: this.checkFrontendHealth(),
      backend: this.checkBackendHealth(),
      database: this.checkDatabaseHealth(),
      cache: this.checkCacheHealth(),
    };

    // Update component health
    this.systemHealth.components = healthChecks;

    // Determine overall health
    const componentStatuses = Object.values(healthChecks);
    if (componentStatuses.includes("critical")) {
      this.systemHealth.overall = "critical";
    } else if (componentStatuses.includes("warning")) {
      this.systemHealth.overall = "warning";
    } else {
      this.systemHealth.overall = "healthy";
    }

    this.systemHealth.lastUpdated = new Date().toISOString();
  }

  /**
   * Check frontend health
   */
  private checkFrontendHealth(): "healthy" | "warning" | "critical" {
    // Simulate frontend health check
    const errorRate = Math.random() * 5;

    if (errorRate > 3) return "critical";
    if (errorRate > 1) return "warning";
    return "healthy";
  }

  /**
   * Check backend health
   */
  private checkBackendHealth(): "healthy" | "warning" | "critical" {
    // Simulate backend health check
    const responseTime = Math.random() * 1000;

    if (responseTime > 800) return "critical";
    if (responseTime > 500) return "warning";
    return "healthy";
  }

  /**
   * Check database health
   */
  private checkDatabaseHealth(): "healthy" | "warning" | "critical" {
    // Simulate database health check
    const connectionPool = Math.random() * 100;

    if (connectionPool < 20) return "critical";
    if (connectionPool < 50) return "warning";
    return "healthy";
  }

  /**
   * Check cache health
   */
  private checkCacheHealth(): "healthy" | "warning" | "critical" {
    // Simulate cache health check
    const hitRate = Math.random() * 100;

    if (hitRate < 70) return "critical";
    if (hitRate < 85) return "warning";
    return "healthy";
  }

  /**
   * Check performance metrics
   */
  private checkPerformanceMetrics(): void {
    const metrics = [
      {
        name: "page_load_time",
        threshold: 3000,
        current: Math.random() * 5000,
      },
      {
        name: "component_render_time",
        threshold: 16,
        current: Math.random() * 50,
      },
      {
        name: "api_response_time",
        threshold: 500,
        current: Math.random() * 1000,
      },
      { name: "memory_usage", threshold: 100, current: Math.random() * 200 },
      { name: "error_rate", threshold: 5, current: Math.random() * 10 },
    ];

    for (const metric of metrics) {
      if (metric.current > metric.threshold) {
        this.createPerformanceAlert(
          metric.name,
          metric.current,
          metric.threshold
        );
      }
    }
  }

  /**
   * Create performance alert
   */
  private createPerformanceAlert(
    metric: string,
    currentValue: number,
    threshold: number
  ): void {
    // Check if alert already exists
    const existingAlert = this.performanceAlerts.find(
      (alert) => alert.metric === metric && !alert.resolved
    );

    if (existingAlert) return;

    const severity = this.determineSeverity(currentValue, threshold);
    const trend = this.determineTrend(metric, currentValue);

    const alert: PerformanceAlert = {
      id: this.generateId(),
      metric,
      currentValue,
      threshold,
      severity,
      timestamp: new Date().toISOString(),
      resolved: false,
      trend,
    };

    this.performanceAlerts.push(alert);
    this.createMonitoringAlert(
      "warning",
      `Performance Alert: ${metric}`,
      `${metric} is ${currentValue.toFixed(2)} (threshold: ${threshold})`,
      "performance",
      severity
    );
  }

  /**
   * Check user feedback
   */
  private checkUserFeedback(): void {
    // Simulate user feedback monitoring
    const feedbackScore = Math.random() * 5;

    if (feedbackScore < 2) {
      this.createFeedbackAlert(
        "user-123",
        feedbackScore,
        "Very poor experience"
      );
    } else if (feedbackScore < 3) {
      this.createFeedbackAlert("user-456", feedbackScore, "Needs improvement");
    }
  }

  /**
   * Create feedback alert
   */
  private createFeedbackAlert(
    userId: string,
    rating: number,
    comment: string
  ): void {
    const severity = rating < 2 ? "critical" : "high";
    const category = this.categorizeFeedback(comment);

    const alert: UserFeedbackAlert = {
      id: this.generateId(),
      userId,
      rating,
      comment,
      timestamp: new Date().toISOString(),
      severity,
      category,
      resolved: false,
    };

    this.feedbackAlerts.push(alert);
    this.createMonitoringAlert(
      "warning",
      "User Feedback Alert",
      `User ${userId} rated ${rating}/5: ${comment}`,
      "user-feedback",
      severity
    );
  }

  /**
   * Categorize feedback
   */
  private categorizeFeedback(comment: string): UserFeedbackAlert["category"] {
    const lowerComment = comment.toLowerCase();

    if (lowerComment.includes("bug") || lowerComment.includes("error")) {
      return "bug";
    } else if (
      lowerComment.includes("feature") ||
      lowerComment.includes("request")
    ) {
      return "feature-request";
    } else if (
      lowerComment.includes("slow") ||
      lowerComment.includes("performance")
    ) {
      return "performance";
    } else if (lowerComment.includes("ui") || lowerComment.includes("design")) {
      return "ui-ux";
    } else {
      return "other";
    }
  }

  /**
   * Create monitoring alert
   */
  createMonitoringAlert(
    type: MonitoringAlert["type"],
    title: string,
    message: string,
    source: string,
    severity: MonitoringAlert["severity"]
  ): void {
    const alert: MonitoringAlert = {
      id: this.generateId(),
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      severity,
      source,
      resolved: false,
    };

    this.alerts.push(alert);
    this.saveMonitoringData();

    // Log critical alerts
    if (severity === "critical") {
      console.error(`CRITICAL ALERT: ${title} - ${message}`);
    }
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string, resolvedBy: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (!alert) return false;

    alert.resolved = true;
    alert.resolvedAt = new Date().toISOString();
    alert.resolvedBy = resolvedBy;

    this.saveMonitoringData();
    return true;
  }

  /**
   * Create iteration plan
   */
  createIterationPlan(plan: Omit<IterationPlan, "id" | "status">): string {
    const id = this.generateId();
    const newPlan: IterationPlan = {
      ...plan,
      id,
      status: "planned",
    };

    this.iterationPlans.push(newPlan);
    this.saveMonitoringData();
    return id;
  }

  /**
   * Start iteration plan
   */
  startIterationPlan(planId: string): boolean {
    const plan = this.iterationPlans.find((p) => p.id === planId);
    if (!plan || plan.status !== "planned") return false;

    plan.status = "in-progress";
    plan.startDate = new Date().toISOString();
    this.saveMonitoringData();
    return true;
  }

  /**
   * Complete iteration plan
   */
  completeIterationPlan(planId: string, actualEffort: number): boolean {
    const plan = this.iterationPlans.find((p) => p.id === planId);
    if (!plan || plan.status !== "in-progress") return false;

    plan.status = "completed";
    plan.endDate = new Date().toISOString();
    plan.actualEffort = actualEffort;
    this.saveMonitoringData();
    return true;
  }

  /**
   * Update system health metrics
   */
  private updateSystemHealth(): void {
    if (!this.systemHealth) return;

    // Simulate metrics update
    this.systemHealth.metrics = {
      uptime: 99.9 + Math.random() * 0.1,
      responseTime: 200 + Math.random() * 100,
      errorRate: Math.random() * 2,
      throughput: 1000 + Math.random() * 500,
    };

    this.systemHealth.lastUpdated = new Date().toISOString();
  }

  /**
   * Determine severity based on threshold
   */
  private determineSeverity(
    currentValue: number,
    threshold: number
  ): PerformanceAlert["severity"] {
    const ratio = currentValue / threshold;

    if (ratio > 2) return "critical";
    if (ratio > 1.5) return "high";
    if (ratio > 1.2) return "medium";
    return "low";
  }

  /**
   * Determine trend for metric
   */
  private determineTrend(
    _metric: string,
    _currentValue: number
  ): PerformanceAlert["trend"] {
    // Simulate trend determination
    const trend = Math.random();

    if (trend > 0.6) return "increasing";
    if (trend < 0.4) return "decreasing";
    return "stable";
  }

  /**
   * Get monitoring dashboard data
   */
  getMonitoringDashboard(): {
    systemHealth: SystemHealth | null;
    alerts: MonitoringAlert[];
    performanceAlerts: PerformanceAlert[];
    feedbackAlerts: UserFeedbackAlert[];
    iterationPlans: IterationPlan[];
    summary: {
      totalAlerts: number;
      criticalAlerts: number;
      unresolvedAlerts: number;
      activeIterations: number;
    };
  } {
    const totalAlerts = this.alerts.length;
    const criticalAlerts = this.alerts.filter(
      (a) => a.severity === "critical"
    ).length;
    const unresolvedAlerts = this.alerts.filter((a) => !a.resolved).length;
    const activeIterations = this.iterationPlans.filter(
      (p) => p.status === "in-progress"
    ).length;

    return {
      systemHealth: this.systemHealth,
      alerts: this.alerts,
      performanceAlerts: this.performanceAlerts,
      feedbackAlerts: this.feedbackAlerts,
      iterationPlans: this.iterationPlans,
      summary: {
        totalAlerts,
        criticalAlerts,
        unresolvedAlerts,
        activeIterations,
      },
    };
  }

  /**
   * Get alerts by severity
   */
  getAlertsBySeverity(
    severity: MonitoringAlert["severity"]
  ): MonitoringAlert[] {
    return this.alerts.filter((alert) => alert.severity === severity);
  }

  /**
   * Get unresolved alerts
   */
  getUnresolvedAlerts(): MonitoringAlert[] {
    return this.alerts.filter((alert) => !alert.resolved);
  }

  /**
   * Get iteration plans by status
   */
  getIterationPlansByStatus(status: IterationPlan["status"]): IterationPlan[] {
    return this.iterationPlans.filter((plan) => plan.status === status);
  }

  /**
   * Load monitoring data from localStorage
   */
  private loadMonitoringData(): void {
    try {
      const stored = localStorage.getItem("monitoring-data");
      if (stored) {
        const data = JSON.parse(stored);
        this.alerts = data.alerts || [];
        this.performanceAlerts = data.performanceAlerts || [];
        this.feedbackAlerts = data.feedbackAlerts || [];
        this.iterationPlans = data.iterationPlans || [];
      }
    } catch (error) {
      console.warn("Failed to load monitoring data:", error);
    }
  }

  /**
   * Save monitoring data to localStorage
   */
  private saveMonitoringData(): void {
    try {
      localStorage.setItem(
        "monitoring-data",
        JSON.stringify({
          alerts: this.alerts,
          performanceAlerts: this.performanceAlerts,
          feedbackAlerts: this.feedbackAlerts,
          iterationPlans: this.iterationPlans,
        })
      );
    } catch (error) {
      console.warn("Failed to save monitoring data:", error);
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Global instance
export const monitoringSystem = new MonitoringSystem();
