export interface CNCTask {
  id: string;
  tileId: string;
  tileName: string;
  projectId: string;
  status: "queued" | "in_progress" | "completed" | "paused" | "failed";
  priority: "low" | "medium" | "high" | "urgent";
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
  assignedTo?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  material: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  tooling?: string;
  notes?: string;
  errors?: string[];
}

export interface CNCMachine {
  id: string;
  name: string;
  type: "3_axis" | "4_axis" | "5_axis";
  status: "idle" | "running" | "maintenance" | "error";
  currentTaskId?: string;
  capabilities: string[];
  maxDimensions: {
    width: number;
    height: number;
    depth: number;
  };
  lastMaintenance?: string;
  nextMaintenance?: string;
}

export interface CNCFilters {
  status?: string[];
  priority?: string[];
  assignedTo?: string[];
  machineId?: string;
  projectId?: string;
  search?: string;
}

export interface CNCStats {
  totalTasks: number;
  queued: number;
  inProgress: number;
  completed: number;
  paused: number;
  failed: number;
  averageCompletionTime: number;
  efficiency: number; // percentage
}
