export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO date string
  end: string; // ISO date string
  allDay?: boolean;
  type:
    | "project"
    | "meeting"
    | "deadline"
    | "production"
    | "maintenance"
    | "other";
  projectId?: string;
  assignedTo?: string;
  location?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  status?: "scheduled" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface CalendarFilters {
  type?: string[];
  projectId?: string;
  assignedTo?: string[];
  priority?: string[];
  status?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CalendarStats {
  totalEvents: number;
  upcomingEvents: number;
  overdueEvents: number;
  completedEvents: number;
  eventsByType: Record<string, number>;
  eventsByPriority: Record<string, number>;
}
