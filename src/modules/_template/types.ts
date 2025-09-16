// Base types from shared components
export interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseFilters {
  search?: string;
  status?: string[];
  priority?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface BaseStats {
  total: number;
  active: number;
  completed: number;
  overdue: number;
}

// Template-specific types
export interface TemplateEntity extends BaseEntity {
  assignedTo?: string;
  projectId?: string;
  type?: string;
  category?: string;
  tags?: string[];
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  progress?: number;
  notes?: string;
}

export interface TemplateFilters extends BaseFilters {
  assignedTo?: string[];
  type?: string[];
  category?: string[];
  tags?: string[];
  progress?: {
    min: number;
    max: number;
  };
}

export interface TemplateStats extends BaseStats {
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  byAssignedTo: Record<string, number>;
  averageProgress: number;
  totalEstimatedHours: number;
  totalActualHours: number;
}
