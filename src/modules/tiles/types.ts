export interface Tile {
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
  material?: string;
  quantity?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  priority?: "low" | "medium" | "high" | "urgent";
  deadline?: string;
  assignedTo?: string;
  notes?: string;
}

export interface TileFilters {
  status?: string[];
  projectId?: string;
  material?: string[];
  priority?: string[];
  assignedTo?: string[];
  search?: string;
}

export interface TileStats {
  total: number;
  designing: number;
  pendingApproval: number;
  approved: number;
  cncQueue: number;
  cncProduction: number;
  readyAssembly: number;
  overdue: number;
}

export interface TileAssignment {
  tileId: string;
  assignedTo: string;
  assignedAt: string;
  notes?: string;
}
