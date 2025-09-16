/**
 * Feedback Integration System
 *
 * This system collects, processes, and integrates user feedback into the migration process
 */

export interface FeedbackItem {
  id: string;
  userId: string;
  page: string;
  component?: string;
  type: "bug" | "feature-request" | "improvement" | "praise" | "complaint";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  rating?: number; // 1-5 scale
  tags: string[];
  status: "new" | "in-progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
  userAgent: string;
  browser: string;
  device: string;
  screenResolution: string;
  viewport: string;
}

export interface FeedbackAnalytics {
  totalFeedback: number;
  averageRating: number;
  feedbackByType: Record<string, number>;
  feedbackByPriority: Record<string, number>;
  feedbackByStatus: Record<string, number>;
  topIssues: Array<{ issue: string; count: number }>;
  userSatisfaction: number;
  responseTime: number; // average hours to resolution
}

export interface FeedbackAction {
  id: string;
  feedbackId: string;
  type: "acknowledge" | "investigate" | "fix" | "close" | "escalate";
  description: string;
  performedBy: string;
  performedAt: string;
  metadata?: Record<string, any>;
}

export class FeedbackIntegrationService {
  private feedback: FeedbackItem[] = [];
  private actions: FeedbackAction[] = [];

  constructor() {
    this.loadFeedback();
  }

  /**
   * Submit new feedback
   */
  submitFeedback(
    feedback: Omit<FeedbackItem, "id" | "createdAt" | "updatedAt" | "status">
  ): string {
    const id = this.generateId();
    const now = new Date().toISOString();

    const newFeedback: FeedbackItem = {
      ...feedback,
      id,
      createdAt: now,
      updatedAt: now,
      status: "new",
    };

    this.feedback.push(newFeedback);
    this.saveFeedback();

    // Auto-assign priority based on type and rating
    this.autoAssignPriority(newFeedback);

    // Send to analytics
    this.sendToAnalytics(newFeedback);

    return id;
  }

  /**
   * Get feedback by ID
   */
  getFeedback(id: string): FeedbackItem | null {
    return this.feedback.find((f) => f.id === id) || null;
  }

  /**
   * Get all feedback with optional filters
   */
  getFeedbackList(filters?: {
    type?: string;
    priority?: string;
    status?: string;
    page?: string;
    component?: string;
    userId?: string;
  }): FeedbackItem[] {
    let filtered = [...this.feedback];

    if (filters) {
      if (filters.type) {
        filtered = filtered.filter((f) => f.type === filters.type);
      }
      if (filters.priority) {
        filtered = filtered.filter((f) => f.priority === filters.priority);
      }
      if (filters.status) {
        filtered = filtered.filter((f) => f.status === filters.status);
      }
      if (filters.page) {
        filtered = filtered.filter((f) => f.page === filters.page);
      }
      if (filters.component) {
        filtered = filtered.filter((f) => f.component === filters.component);
      }
      if (filters.userId) {
        filtered = filtered.filter((f) => f.userId === filters.userId);
      }
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Update feedback status
   */
  updateFeedbackStatus(
    id: string,
    status: FeedbackItem["status"],
    resolution?: string
  ): boolean {
    const feedback = this.feedback.find((f) => f.id === id);
    if (!feedback) return false;

    feedback.status = status;
    feedback.updatedAt = new Date().toISOString();
    if (resolution) {
      feedback.resolution = resolution;
    }

    this.saveFeedback();

    // Record action
    this.recordAction({
      feedbackId: id,
      type:
        status === "resolved"
          ? "fix"
          : status === "closed"
          ? "close"
          : "investigate",
      description: `Status changed to ${status}`,
      performedBy: "system",
      performedAt: new Date().toISOString(),
    });

    return true;
  }

  /**
   * Assign feedback to team member
   */
  assignFeedback(id: string, assignedTo: string): boolean {
    const feedback = this.feedback.find((f) => f.id === id);
    if (!feedback) return false;

    feedback.assignedTo = assignedTo;
    feedback.updatedAt = new Date().toISOString();

    this.saveFeedback();

    // Record action
    this.recordAction({
      feedbackId: id,
      type: "escalate",
      description: `Assigned to ${assignedTo}`,
      performedBy: "system",
      performedAt: new Date().toISOString(),
    });

    return true;
  }

  /**
   * Record action on feedback
   */
  recordAction(action: Omit<FeedbackAction, "id">): void {
    const newAction: FeedbackAction = {
      ...action,
      id: this.generateId(),
    };

    this.actions.push(newAction);
    this.saveFeedback();
  }

  /**
   * Get feedback analytics
   */
  getFeedbackAnalytics(): FeedbackAnalytics {
    const totalFeedback = this.feedback.length;
    const averageRating =
      this.feedback
        .filter((f) => f.rating)
        .reduce((sum, f) => sum + (f.rating || 0), 0) /
        this.feedback.filter((f) => f.rating).length || 0;

    const feedbackByType = this.feedback.reduce((acc, f) => {
      acc[f.type] = (acc[f.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const feedbackByPriority = this.feedback.reduce((acc, f) => {
      acc[f.priority] = (acc[f.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const feedbackByStatus = this.feedback.reduce((acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate top issues
    const issueCounts: Record<string, number> = {};
    this.feedback.forEach((f) => {
      const key = `${f.page}${f.component ? ` - ${f.component}` : ""}`;
      issueCounts[key] = (issueCounts[key] || 0) + 1;
    });

    const topIssues = Object.entries(issueCounts)
      .map(([issue, count]) => ({ issue, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate user satisfaction (based on ratings and complaint ratio)
    const ratings = this.feedback.filter((f) => f.rating).map((f) => f.rating!);
    const complaints = this.feedback.filter(
      (f) => f.type === "complaint"
    ).length;
    const userSatisfaction =
      ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 20 -
          (complaints / totalFeedback) * 20
        : 0;

    // Calculate average response time
    const resolvedFeedback = this.feedback.filter(
      (f) => f.status === "resolved"
    );
    const responseTime =
      resolvedFeedback.length > 0
        ? resolvedFeedback.reduce((sum, f) => {
            const created = new Date(f.createdAt).getTime();
            const updated = new Date(f.updatedAt).getTime();
            return sum + (updated - created) / (1000 * 60 * 60); // hours
          }, 0) / resolvedFeedback.length
        : 0;

    return {
      totalFeedback,
      averageRating,
      feedbackByType,
      feedbackByPriority,
      feedbackByStatus,
      topIssues,
      userSatisfaction: Math.max(0, Math.min(100, userSatisfaction)),
      responseTime,
    };
  }

  /**
   * Get feedback actions for a specific feedback item
   */
  getFeedbackActions(feedbackId: string): FeedbackAction[] {
    return this.actions
      .filter((a) => a.feedbackId === feedbackId)
      .sort(
        (a, b) =>
          new Date(a.performedAt).getTime() - new Date(b.performedAt).getTime()
      );
  }

  /**
   * Auto-assign priority based on feedback characteristics
   */
  private autoAssignPriority(feedback: FeedbackItem): void {
    let priority: FeedbackItem["priority"] = "medium";

    // High priority for critical issues
    if (feedback.type === "bug" && feedback.rating && feedback.rating <= 2) {
      priority = "critical";
    }
    // High priority for complaints
    else if (feedback.type === "complaint") {
      priority = "high";
    }
    // Low priority for praise
    else if (feedback.type === "praise") {
      priority = "low";
    }
    // Medium priority for feature requests
    else if (feedback.type === "feature-request") {
      priority = "medium";
    }

    feedback.priority = priority;
  }

  /**
   * Send feedback to analytics
   */
  private sendToAnalytics(feedback: FeedbackItem): void {
    // In a real implementation, this would send to your analytics service
    console.log("Sending feedback to analytics:", feedback);

    // Example: Send to Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "feedback_submitted", {
        feedback_type: feedback.type,
        feedback_priority: feedback.priority,
        feedback_page: feedback.page,
        feedback_component: feedback.component,
        feedback_rating: feedback.rating,
      });
    }
  }

  /**
   * Load feedback from localStorage
   */
  private loadFeedback(): void {
    try {
      const stored = localStorage.getItem("feedback-data");
      if (stored) {
        const data = JSON.parse(stored);
        this.feedback = data.feedback || [];
        this.actions = data.actions || [];
      }
    } catch (error) {
      console.warn("Failed to load feedback data:", error);
    }
  }

  /**
   * Save feedback to localStorage
   */
  private saveFeedback(): void {
    try {
      localStorage.setItem(
        "feedback-data",
        JSON.stringify({
          feedback: this.feedback,
          actions: this.actions,
        })
      );
    } catch (error) {
      console.warn("Failed to save feedback data:", error);
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
export const feedbackIntegration = new FeedbackIntegrationService();
