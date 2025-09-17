export interface Tile {
  id: string;
  name: string;
  description?: string;
  status: TileStatus;
  project_id: string;
  assignee_id?: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  estimated_hours?: number;
  actual_hours?: number;
  progress: number; // 0-100
}

export type TileStatus = 
  | 'backlog'
  | 'todo'
  | 'in_progress'
  | 'review'
  | 'testing'
  | 'done'
  | 'blocked'
  | 'cancelled';

export interface KanbanColumn {
  id: TileStatus;
  title: string;
  tiles: Tile[];
  color: string;
  maxItems?: number;
}

export interface TileFilter {
  status?: TileStatus[];
  assignee_id?: string;
  project_id?: string;
  priority?: string[];
  tags?: string[];
}