// Re-export types from main types file for consistency
export type { Priority, Tile, TileStatus } from "../../../types/tiles.types";

// Import TileStatus for local use
import type { TileStatus } from "../../../types/tiles.types";

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

export interface TileFilters {
  search?: string;
  status?: TileStatus[];
  priority?: string[];
  projectId?: string[];
  assignedTo?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}
