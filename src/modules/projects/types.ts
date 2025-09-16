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
  completedAt?: string; // ISO date
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "draft" | "active" | "completed" | "on_hold" | "cancelled";
  client?: string;
  modules: ProjectModule[];
  tiles?: ProjectTile[];
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  budget?: number;
  progress?: number; // 0-100
}

export interface ProjectTileMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface ProjectTile {
  id: string;
  name: string;
  status:
    | "designing"
    | "pending_approval"
    | "approved"
    | "cnc_queue"
    | "cnc_production"
    | "ready_assembly";
  projectId: string;
  createdAt: string;
  updatedAt: string;
  materials?: ProjectTileMaterial[];
  quantity?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface ProjectFilters {
  status?: string[];
  client?: string[];
  priority?: string[];
  search?: string;
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  onHold: number;
  cancelled: number;
}
