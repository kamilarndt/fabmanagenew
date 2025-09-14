import { httpClient } from "../../../lib/httpClient";
import type { CalendarEvent, CalendarFilters, CalendarStats } from "../types";

export const calendarService = {
  async getEvents(filters?: CalendarFilters): Promise<CalendarEvent[]> {
    const params = new URLSearchParams();

    if (filters?.type?.length) {
      params.append("type", filters.type.join(","));
    }
    if (filters?.projectId) {
      params.append("projectId", filters.projectId);
    }
    if (filters?.assignedTo?.length) {
      params.append("assignedTo", filters.assignedTo.join(","));
    }
    if (filters?.priority?.length) {
      params.append("priority", filters.priority.join(","));
    }
    if (filters?.status?.length) {
      params.append("status", filters.status.join(","));
    }
    if (filters?.dateRange) {
      params.append("startDate", filters.dateRange.start);
      params.append("endDate", filters.dateRange.end);
    }

    const response = await httpClient.get(
      `/api/calendar/events?${params.toString()}`
    );
    return (response as any).data;
  },

  async getEvent(id: string): Promise<CalendarEvent> {
    const response = await httpClient.get(`/api/calendar/events/${id}`);
    return (response as any).data;
  },

  async createEvent(
    event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">
  ): Promise<CalendarEvent> {
    const response = await httpClient.post("/api/calendar/events", event);
    return (response as any).data;
  },

  async updateEvent(
    id: string,
    event: Partial<CalendarEvent>
  ): Promise<CalendarEvent> {
    const response = await httpClient.put(`/api/calendar/events/${id}`, event);
    return (response as any).data;
  },

  async deleteEvent(id: string): Promise<void> {
    await httpClient.delete(`/api/calendar/events/${id}`);
  },

  async getStats(): Promise<CalendarStats> {
    const response = await httpClient.get("/api/calendar/stats");
    return (response as any).data;
  },
};
