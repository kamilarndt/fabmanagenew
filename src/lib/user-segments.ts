/**
 * User Segmentation System for A/B Testing and Gradual Migration
 *
 * This system allows us to:
 * - Segment users into different groups for testing
 * - Control feature rollouts based on user characteristics
 * - Implement gradual migration strategies
 */

export interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: UserCriteria;
  percentage: number; // 0-100, percentage of users in this segment
  features: FeatureConfig;
}

export interface UserCriteria {
  // User properties
  role?: string[]; // admin, user, guest, etc.
  department?: string[]; // engineering, design, marketing, etc.
  experience?: "new" | "experienced" | "expert";
  subscription?: ("free" | "premium" | "enterprise")[];

  // Behavioral criteria
  usageFrequency?: "low" | "medium" | "high";
  lastActive?: number; // days since last active

  // Technical criteria
  browser?: string[];
  device?: "desktop" | "mobile" | "tablet";
  region?: string[];

  // Custom criteria
  custom?: Record<string, any>;
}

export interface FeatureConfig {
  newUI: boolean;
  newUIDashboard: boolean;
  newUIProjects: boolean;
  newUIMaterials: boolean;
  newUITiles: boolean;
  newUISettings: boolean;

  // Advanced features
  newUINavigation: boolean;
  newUIForms: boolean;
  newUITables: boolean;

  // Experimental features
  experimentalFeatures: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  department?: string;
  experience: "new" | "experienced" | "expert";
  subscription: "free" | "premium" | "enterprise";
  usageFrequency: "low" | "medium" | "high";
  lastActive: number;
  browser: string;
  device: "desktop" | "mobile" | "tablet";
  region: string;
  custom: Record<string, any>;
}

// Predefined user segments
export const USER_SEGMENTS: UserSegment[] = [
  {
    id: "early-adopters",
    name: "Early Adopters",
    description:
      "Users who are comfortable with new features and provide valuable feedback",
    criteria: {
      experience: "expert",
      usageFrequency: "high",
      subscription: ["premium", "enterprise"],
    },
    percentage: 10,
    features: {
      newUI: true,
      newUIDashboard: true,
      newUIProjects: true,
      newUIMaterials: true,
      newUITiles: true,
      newUISettings: true,
      newUINavigation: true,
      newUIForms: true,
      newUITables: true,
      experimentalFeatures: ["advanced-analytics", "ai-suggestions"],
    },
  },
  {
    id: "power-users",
    name: "Power Users",
    description: "Heavy users who need stable, performant features",
    criteria: {
      experience: "experienced",
      usageFrequency: "high",
      subscription: ["premium", "enterprise"],
    },
    percentage: 20,
    features: {
      newUI: true,
      newUIDashboard: true,
      newUIProjects: true,
      newUIMaterials: false,
      newUITiles: false,
      newUISettings: false,
      newUINavigation: false,
      newUIForms: false,
      newUITables: false,
      experimentalFeatures: [],
    },
  },
  {
    id: "regular-users",
    name: "Regular Users",
    description: "Standard users with moderate usage patterns",
    criteria: {
      experience: "experienced",
      usageFrequency: "medium",
    },
    percentage: 40,
    features: {
      newUI: true,
      newUIDashboard: true,
      newUIProjects: false,
      newUIMaterials: false,
      newUITiles: false,
      newUISettings: false,
      newUINavigation: false,
      newUIForms: false,
      newUITables: false,
      experimentalFeatures: [],
    },
  },
  {
    id: "new-users",
    name: "New Users",
    description: "New users who should see the latest UI from the start",
    criteria: {
      experience: "new",
      lastActive: 30, // Active in last 30 days
    },
    percentage: 20,
    features: {
      newUI: true,
      newUIDashboard: true,
      newUIProjects: true,
      newUIMaterials: true,
      newUITiles: true,
      newUISettings: true,
      newUINavigation: true,
      newUIForms: true,
      newUITables: true,
      experimentalFeatures: [],
    },
  },
  {
    id: "control-group",
    name: "Control Group",
    description: "Users who continue using the old UI for comparison",
    criteria: {
      experience: "experienced",
      usageFrequency: "low",
    },
    percentage: 10,
    features: {
      newUI: false,
      newUIDashboard: false,
      newUIProjects: false,
      newUIMaterials: false,
      newUITiles: false,
      newUISettings: false,
      newUINavigation: false,
      newUIForms: false,
      newUITables: false,
      experimentalFeatures: [],
    },
  },
];

/**
 * User Segmentation Service
 */
export class UserSegmentationService {
  private userProfile: UserProfile | null = null;
  private assignedSegment: UserSegment | null = null;

  constructor() {
    this.loadUserProfile();
  }

  /**
   * Load user profile from localStorage or API
   */
  private loadUserProfile(): void {
    try {
      const stored = localStorage.getItem("user-profile");
      if (stored) {
        this.userProfile = JSON.parse(stored);
        this.assignSegment();
      }
    } catch (error) {
      console.warn("Failed to load user profile:", error);
    }
  }

  /**
   * Set user profile (typically called after login)
   */
  setUserProfile(profile: UserProfile): void {
    this.userProfile = profile;
    localStorage.setItem("user-profile", JSON.stringify(profile));
    this.assignSegment();
  }

  /**
   * Assign user to appropriate segment based on criteria
   */
  private assignSegment(): void {
    if (!this.userProfile) return;

    // Find matching segments
    const matchingSegments = USER_SEGMENTS.filter((segment) =>
      this.matchesCriteria(this.userProfile!, segment.criteria)
    );

    if (matchingSegments.length === 0) {
      // Default to regular users if no match
      this.assignedSegment =
        USER_SEGMENTS.find((s) => s.id === "regular-users") || null;
      return;
    }

    // If multiple segments match, use the one with highest percentage
    this.assignedSegment = matchingSegments.reduce((prev, current) =>
      current.percentage > prev.percentage ? current : prev
    );
  }

  /**
   * Check if user matches segment criteria
   */
  private matchesCriteria(
    profile: UserProfile,
    criteria: UserCriteria
  ): boolean {
    // Check role
    if (criteria.role && !criteria.role.includes(profile.role)) {
      return false;
    }

    // Check department
    if (
      criteria.department &&
      profile.department &&
      !criteria.department.includes(profile.department)
    ) {
      return false;
    }

    // Check experience
    if (criteria.experience && criteria.experience !== profile.experience) {
      return false;
    }

    // Check subscription
    if (
      criteria.subscription &&
      !criteria.subscription.includes(profile.subscription)
    ) {
      return false;
    }

    // Check usage frequency
    if (
      criteria.usageFrequency &&
      criteria.usageFrequency !== profile.usageFrequency
    ) {
      return false;
    }

    // Check last active
    if (criteria.lastActive && profile.lastActive > criteria.lastActive) {
      return false;
    }

    // Check browser
    if (criteria.browser && !criteria.browser.includes(profile.browser)) {
      return false;
    }

    // Check device
    if (criteria.device && criteria.device !== profile.device) {
      return false;
    }

    // Check region
    if (criteria.region && !criteria.region.includes(profile.region)) {
      return false;
    }

    // Check custom criteria
    if (criteria.custom) {
      for (const [key, value] of Object.entries(criteria.custom)) {
        if (profile.custom[key] !== value) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Get current user segment
   */
  getCurrentSegment(): UserSegment | null {
    return this.assignedSegment;
  }

  /**
   * Check if feature is enabled for current user
   */
  isFeatureEnabled(feature: keyof FeatureConfig): boolean {
    if (!this.assignedSegment) return false;
    return this.assignedSegment.features[feature] as boolean;
  }

  /**
   * Get all enabled features for current user
   */
  getEnabledFeatures(): FeatureConfig {
    if (!this.assignedSegment) {
      return {
        newUI: false,
        newUIDashboard: false,
        newUIProjects: false,
        newUIMaterials: false,
        newUITiles: false,
        newUISettings: false,
        newUINavigation: false,
        newUIForms: false,
        newUITables: false,
        experimentalFeatures: [],
      };
    }
    return this.assignedSegment.features;
  }

  /**
   * Get user profile
   */
  getUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  /**
   * Update user profile
   */
  updateUserProfile(updates: Partial<UserProfile>): void {
    if (!this.userProfile) return;

    this.userProfile = { ...this.userProfile, ...updates };
    localStorage.setItem("user-profile", JSON.stringify(this.userProfile));
    this.assignSegment();
  }
}

// Global instance
export const userSegmentation = new UserSegmentationService();
