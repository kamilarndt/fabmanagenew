export type GanttTaskType = 'projektowanie' | 'wycinanie' | 'produkcja'

export type GanttTaskStatus = 'planned' | 'in_progress' | 'completed' | 'blocked'

export type GanttTaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface GanttTask {
    id: string
    project_id: string
    tile_id?: string
    name: string
    task_type: GanttTaskType
    start_date: string // YYYY-MM-DD
    end_date: string // YYYY-MM-DD
    progress: number // 0-100
    dependencies?: string // comma-separated task IDs
    status: GanttTaskStatus
    assigned_to?: string
    estimated_hours?: number
    actual_hours?: number
    priority: GanttTaskPriority
    notes?: string
    created_at: string
    updated_at: string
}

export interface GanttTaskCreate {
    project_id: string
    tile_id?: string
    name: string
    task_type: GanttTaskType
    start_date: string
    end_date: string
    progress?: number
    dependencies?: string
    status?: GanttTaskStatus
    assigned_to?: string
    estimated_hours?: number
    priority?: GanttTaskPriority
    notes?: string
}

export interface GanttTaskUpdate extends Partial<GanttTaskCreate> {
    id: string
}

// Frappe Gantt format
export interface FrappeGanttTask {
    id: string
    name: string
    start: string // YYYY-MM-DD
    end: string // YYYY-MM-DD
    progress: number // 0-100
    dependencies?: string // comma-separated task IDs
    custom_class?: string
}