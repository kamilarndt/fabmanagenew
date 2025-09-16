/**
 * Migration Manager
 *
 * This system manages the migration from old UI to new UI with Early Adopters support
 */

export interface MigrationPhase {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed" | "rolled-back";
  startDate?: string;
  endDate?: string;
  userPercentage: number;
  features: string[];
  rollbackTriggers: RollbackTrigger[];
  successCriteria: SuccessCriteria[];
}

export interface RollbackTrigger {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  currentValue: number;
  action: "auto-rollback" | "alert" | "manual-review";
  severity: "low" | "medium" | "high" | "critical";
  enabled: boolean;
  triggered: boolean;
  triggeredAt?: string;
}

export interface SuccessCriteria {
  id: string;
  name: string;
  metric: string;
  target: number;
  current: number;
  unit: string;
  status: "pending" | "met" | "not-met";
  lastUpdated: string;
}

export interface MigrationMetrics {
  userSatisfaction: number;
  performanceScore: number;
  errorRate: number;
  adoptionRate: number;
  supportTickets: number;
  feedbackScore: number;
  lastUpdated: string;
}

export interface EarlyAdopter {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
  experience: "new" | "experienced" | "expert";
  joinedDate: string;
  feedbackCount: number;
  lastActive: string;
  status: "active" | "inactive" | "opted-out";
}

export class MigrationManager {
  private phases: MigrationPhase[] = [];
  private currentPhase: MigrationPhase | null = null;
  private metrics: MigrationMetrics[] = [];
  private earlyAdopters: EarlyAdopter[] = [];
  private isMonitoring = false;

  constructor() {
    this.loadMigrationData();
    this.initializeDefaultPhases();
  }

  /**
   * Initialize default migration phases
   */
  private initializeDefaultPhases(): void {
    if (this.phases.length === 0) {
      this.phases = [
        {
          id: "early-adopters",
          name: "Early Adopters Phase",
          description: "Deploy new UI to Early Adopters (10% of users)",
          status: "pending",
          userPercentage: 10,
          features: [
            "newUI",
            "newUIDashboard",
            "newUIProjects",
            "newUIMaterials",
            "newUITiles",
            "newUISettings",
            "newUINavigation",
            "newUIForms",
            "newUITables",
          ],
          rollbackTriggers: [
            {
              id: "error-rate",
              name: "High Error Rate",
              condition: "error_rate_high",
              threshold: 5,
              currentValue: 0,
              action: "auto-rollback",
              severity: "critical",
              enabled: true,
              triggered: false,
            },
            {
              id: "user-satisfaction",
              name: "Low User Satisfaction",
              condition: "user_satisfaction_low",
              threshold: 3,
              currentValue: 0,
              action: "alert",
              severity: "high",
              enabled: true,
              triggered: false,
            },
            {
              id: "performance",
              name: "Performance Degradation",
              condition: "performance_degradation",
              threshold: 50,
              currentValue: 0,
              action: "alert",
              severity: "medium",
              enabled: true,
              triggered: false,
            },
          ],
          successCriteria: [
            {
              id: "satisfaction",
              name: "User Satisfaction",
              metric: "user_satisfaction",
              target: 4.0,
              current: 0,
              unit: "/5",
              status: "pending",
              lastUpdated: new Date().toISOString(),
            },
            {
              id: "performance",
              name: "Performance Score",
              metric: "performance_score",
              target: 80,
              current: 0,
              unit: "/100",
              status: "pending",
              lastUpdated: new Date().toISOString(),
            },
            {
              id: "adoption",
              name: "Adoption Rate",
              metric: "adoption_rate",
              target: 85,
              current: 0,
              unit: "%",
              status: "pending",
              lastUpdated: new Date().toISOString(),
            },
          ],
        },
        {
          id: "power-users",
          name: "Power Users Phase",
          description: "Deploy new UI to Power Users (20% of users)",
          status: "pending",
          userPercentage: 20,
          features: ["newUI", "newUIDashboard", "newUIProjects"],
          rollbackTriggers: [
            {
              id: "error-rate",
              name: "High Error Rate",
              condition: "error_rate_high",
              threshold: 3,
              currentValue: 0,
              action: "auto-rollback",
              severity: "critical",
              enabled: true,
              triggered: false,
            },
          ],
          successCriteria: [
            {
              id: "satisfaction",
              name: "User Satisfaction",
              metric: "user_satisfaction",
              target: 4.2,
              current: 0,
              unit: "/5",
              status: "pending",
              lastUpdated: new Date().toISOString(),
            },
          ],
        },
        {
          id: "regular-users",
          name: "Regular Users Phase",
          description: "Deploy new UI to Regular Users (40% of users)",
          status: "pending",
          userPercentage: 40,
          features: ["newUI", "newUIDashboard"],
          rollbackTriggers: [
            {
              id: "error-rate",
              name: "High Error Rate",
              condition: "error_rate_high",
              threshold: 2,
              currentValue: 0,
              action: "auto-rollback",
              severity: "critical",
              enabled: true,
              triggered: false,
            },
          ],
          successCriteria: [
            {
              id: "satisfaction",
              name: "User Satisfaction",
              metric: "user_satisfaction",
              target: 4.0,
              current: 0,
              unit: "/5",
              status: "pending",
              lastUpdated: new Date().toISOString(),
            },
          ],
        },
        {
          id: "full-migration",
          name: "Full Migration Phase",
          description: "Complete migration to all users (100%)",
          status: "pending",
          userPercentage: 100,
          features: [
            "newUI",
            "newUIDashboard",
            "newUIProjects",
            "newUIMaterials",
            "newUITiles",
            "newUISettings",
            "newUINavigation",
            "newUIForms",
            "newUITables",
          ],
          rollbackTriggers: [
            {
              id: "error-rate",
              name: "High Error Rate",
              condition: "error_rate_high",
              threshold: 1,
              currentValue: 0,
              action: "auto-rollback",
              severity: "critical",
              enabled: true,
              triggered: false,
            },
          ],
          successCriteria: [
            {
              id: "satisfaction",
              name: "User Satisfaction",
              metric: "user_satisfaction",
              target: 4.0,
              current: 0,
              unit: "/5",
              status: "pending",
              lastUpdated: new Date().toISOString(),
            },
          ],
        },
      ];
      this.saveMigrationData();
    }
  }

  /**
   * Start Early Adopters migration
   */
  startEarlyAdoptersMigration(): boolean {
    const earlyAdoptersPhase = this.phases.find(
      (p) => p.id === "early-adopters"
    );
    if (!earlyAdoptersPhase || earlyAdoptersPhase.status !== "pending") {
      return false;
    }

    earlyAdoptersPhase.status = "in-progress";
    earlyAdoptersPhase.startDate = new Date().toISOString();
    this.currentPhase = earlyAdoptersPhase;

    // Enable features for Early Adopters
    this.enableFeaturesForEarlyAdopters();

    // Start monitoring
    this.startMonitoring();

    this.saveMigrationData();
    return true;
  }

  /**
   * Enable features for Early Adopters
   */
  private enableFeaturesForEarlyAdopters(): void {
    // This would integrate with the feature flag system
    // For now, we'll simulate the feature enablement
    console.log(
      "Enabling features for Early Adopters:",
      this.currentPhase?.features
    );

    // In a real implementation, this would:
    // 1. Update feature flags in the configuration system
    // 2. Notify the user segmentation service
    // 3. Update the A/B testing system
  }

  /**
   * Complete current migration phase
   */
  completeCurrentPhase(): boolean {
    if (!this.currentPhase || this.currentPhase.status !== "in-progress") {
      return false;
    }

    // Check if success criteria are met
    const allCriteriaMet = this.currentPhase.successCriteria.every(
      (criteria) => criteria.status === "met"
    );

    if (!allCriteriaMet) {
      console.warn("Cannot complete phase: success criteria not met");
      return false;
    }

    this.currentPhase.status = "completed";
    this.currentPhase.endDate = new Date().toISOString();

    // Record metrics
    this.recordPhaseMetrics(this.currentPhase);

    // Move to next phase if available
    this.moveToNextPhase();

    this.saveMigrationData();
    return true;
  }

  /**
   * Rollback current migration phase
   */
  rollbackCurrentPhase(reason: string): boolean {
    if (!this.currentPhase || this.currentPhase.status !== "in-progress") {
      return false;
    }

    this.currentPhase.status = "rolled-back";
    this.currentPhase.endDate = new Date().toISOString();

    // Disable features
    this.disableFeaturesForCurrentPhase();

    // Stop monitoring
    this.stopMonitoring();

    console.log(`Migration phase rolled back: ${reason}`);
    this.saveMigrationData();
    return true;
  }

  /**
   * Disable features for current phase
   */
  private disableFeaturesForCurrentPhase(): void {
    if (!this.currentPhase) return;

    console.log("Disabling features for rollback:", this.currentPhase.features);

    // In a real implementation, this would:
    // 1. Revert feature flags to previous state
    // 2. Notify user segmentation service
    // 3. Update A/B testing system
  }

  /**
   * Move to next migration phase
   */
  private moveToNextPhase(): void {
    const currentIndex = this.phases.findIndex(
      (p) => p.id === this.currentPhase?.id
    );
    const nextPhase = this.phases[currentIndex + 1];

    if (nextPhase) {
      this.currentPhase = nextPhase;
      console.log(`Moving to next phase: ${nextPhase.name}`);
    } else {
      this.currentPhase = null;
      console.log("Migration completed - no more phases");
    }
  }

  /**
   * Start monitoring for rollback triggers
   */
  private startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log("Starting migration monitoring...");

    // Set up monitoring interval
    const monitoringInterval = setInterval(() => {
      if (!this.isMonitoring) {
        clearInterval(monitoringInterval);
        return;
      }

      this.checkRollbackTriggers();
      this.updateMetrics();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Stop monitoring
   */
  private stopMonitoring(): void {
    this.isMonitoring = false;
    console.log("Stopped migration monitoring");
  }

  /**
   * Check rollback triggers
   */
  checkRollbackTriggers(): void {
    if (!this.currentPhase) return;

    for (const trigger of this.currentPhase.rollbackTriggers) {
      if (!trigger.enabled || trigger.triggered) continue;

      const shouldTrigger = this.evaluateTrigger(trigger);
      if (shouldTrigger) {
        this.handleRollbackTrigger(trigger);
      }
    }
  }

  /**
   * Evaluate rollback trigger condition
   */
  private evaluateTrigger(trigger: RollbackTrigger): boolean {
    // Simulate trigger evaluation
    // In a real implementation, this would check actual metrics
    switch (trigger.condition) {
      case "error_rate_high":
        trigger.currentValue = Math.random() * 10; // Simulate error rate
        return trigger.currentValue > trigger.threshold;
      case "user_satisfaction_low":
        trigger.currentValue = Math.random() * 5; // Simulate satisfaction score
        return trigger.currentValue < trigger.threshold;
      case "performance_degradation":
        trigger.currentValue = Math.random() * 100; // Simulate performance score
        return trigger.currentValue < trigger.threshold;
      default:
        return false;
    }
  }

  /**
   * Handle rollback trigger
   */
  private handleRollbackTrigger(trigger: RollbackTrigger): void {
    trigger.triggered = true;
    trigger.triggeredAt = new Date().toISOString();

    console.warn(`Rollback trigger activated: ${trigger.name}`);

    if (trigger.action === "auto-rollback") {
      this.rollbackCurrentPhase(`Automatic rollback due to: ${trigger.name}`);
    } else if (trigger.action === "alert") {
      // Send alert to team
      console.error(
        `ALERT: ${trigger.name} - ${trigger.condition} threshold exceeded`
      );
    }
  }

  /**
   * Update migration metrics
   */
  updateMetrics(): void {
    if (!this.currentPhase) return;

    // Simulate metrics update
    const metrics: MigrationMetrics = {
      userSatisfaction: Math.random() * 5,
      performanceScore: Math.random() * 100,
      errorRate: Math.random() * 10,
      adoptionRate: Math.random() * 100,
      supportTickets: Math.floor(Math.random() * 20),
      feedbackScore: Math.random() * 5,
      lastUpdated: new Date().toISOString(),
    };

    this.metrics.push(metrics);

    // Update success criteria
    this.updateSuccessCriteria(metrics);

    this.saveMigrationData();
  }

  /**
   * Update success criteria based on current metrics
   */
  private updateSuccessCriteria(metrics: MigrationMetrics): void {
    if (!this.currentPhase) return;

    for (const criteria of this.currentPhase.successCriteria) {
      switch (criteria.metric) {
        case "user_satisfaction":
          criteria.current = metrics.userSatisfaction;
          break;
        case "performance_score":
          criteria.current = metrics.performanceScore;
          break;
        case "adoption_rate":
          criteria.current = metrics.adoptionRate;
          break;
      }

      criteria.status = criteria.current >= criteria.target ? "met" : "not-met";
      criteria.lastUpdated = new Date().toISOString();
    }
  }

  /**
   * Record phase metrics
   */
  private recordPhaseMetrics(phase: MigrationPhase): void {
    const latestMetrics = this.metrics[this.metrics.length - 1];
    if (latestMetrics) {
      console.log(`Phase ${phase.name} completed with metrics:`, latestMetrics);
    }
  }

  /**
   * Get migration status
   */
  getMigrationStatus(): {
    currentPhase: MigrationPhase | null;
    phases: MigrationPhase[];
    metrics: MigrationMetrics | null;
    earlyAdopters: EarlyAdopter[];
    progress: number;
  } {
    const completedPhases = this.phases.filter(
      (p) => p.status === "completed"
    ).length;
    const progress = (completedPhases / this.phases.length) * 100;

    return {
      currentPhase: this.currentPhase,
      phases: this.phases,
      metrics:
        this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null,
      earlyAdopters: this.earlyAdopters,
      progress,
    };
  }

  /**
   * Add Early Adopter
   */
  addEarlyAdopter(
    adopter: Omit<
      EarlyAdopter,
      "id" | "joinedDate" | "feedbackCount" | "lastActive" | "status"
    >
  ): string {
    const id = this.generateId();
    const newAdopter: EarlyAdopter = {
      ...adopter,
      id,
      joinedDate: new Date().toISOString(),
      feedbackCount: 0,
      lastActive: new Date().toISOString(),
      status: "active",
    };

    this.earlyAdopters.push(newAdopter);
    this.saveMigrationData();
    return id;
  }

  /**
   * Update Early Adopter status
   */
  updateEarlyAdopterStatus(
    id: string,
    status: EarlyAdopter["status"]
  ): boolean {
    const adopter = this.earlyAdopters.find((a) => a.id === id);
    if (!adopter) return false;

    adopter.status = status;
    this.saveMigrationData();
    return true;
  }

  /**
   * Get Early Adopters
   */
  getEarlyAdopters(): EarlyAdopter[] {
    return [...this.earlyAdopters];
  }

  /**
   * Load migration data from localStorage
   */
  private loadMigrationData(): void {
    try {
      const stored = localStorage.getItem("migration-data");
      if (stored) {
        const data = JSON.parse(stored);
        this.phases = data.phases || [];
        this.metrics = data.metrics || [];
        this.earlyAdopters = data.earlyAdopters || [];

        // Find current phase
        this.currentPhase =
          this.phases.find((p) => p.status === "in-progress") || null;
      }
    } catch (error) {
      console.warn("Failed to load migration data:", error);
    }
  }

  /**
   * Save migration data to localStorage
   */
  private saveMigrationData(): void {
    try {
      localStorage.setItem(
        "migration-data",
        JSON.stringify({
          phases: this.phases,
          metrics: this.metrics,
          earlyAdopters: this.earlyAdopters,
        })
      );
    } catch (error) {
      console.warn("Failed to save migration data:", error);
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
export const migrationManager = new MigrationManager();
