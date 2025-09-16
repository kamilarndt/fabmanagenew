export interface Project {
  id: string;
  name: string;
  description?: string;
  status:
    | "draft"
    | "active"
    | "completed"
    | "cancelled"
    | "on_hold"
    | "done"
    | "new"
    | "Nowy"
    | "W realizacji"
    | "Wstrzymany"
    | "Zakończony"
    | "Anulowany";
  priority?: "low" | "medium" | "high" | "urgent";
  clientId?: string;
  clientName?: string;
  startDate?: string;
  endDate?: string;
  deadline?: string;
  budget?: number;
  modules?: ProjectModule[];
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for backward compatibility
  link_model_3d?: string;
  groups?: Array<{ id: string; name: string }>;
  manager?: string;
}

export interface ProjectModule {
  id: string;
  name:
    | "pricing"
    | "concept"
    | "technical_design"
    | "production"
    | "materials"
    | "logistics";
  isEnabled: boolean;
  completedAt?: string;
}

export interface ProjectWithStats extends Project {
  stats: {
    totalTiles: number;
    completedTiles: number;
    progress: number;
    budgetUsed: number;
    budgetRemaining: number;
  };
  // Legacy fields for backward compatibility
  typ?: string;
  miniatura?: string;
  numer?: string;
  lokalizacja?: string;
  tilesCount?: number;
  postep?: number;
  progress?: number;
  client?: string;
}

export interface ProjectFilters {
  search?: string;
  status?: string[];
  priority?: string[];
  clientId?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  modules?: string[];
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  overdue: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byClient: Record<string, number>;
}
