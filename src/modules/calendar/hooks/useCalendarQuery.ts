import { useQuery } from "@tanstack/react-query";
import { calendarService } from "../services/calendarService";
import type { CalendarFilters } from "../types";

export function useCalendarQuery(filters?: CalendarFilters) {
  return useQuery({
    queryKey: ["calendar-events", filters],
    queryFn: () => calendarService.getEvents(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCalendarEventQuery(id: string) {
  return useQuery({
    queryKey: ["calendar-event", id],
    queryFn: () => calendarService.getEvent(id),
    enabled: !!id,
  });
}

export function useCalendarStatsQuery() {
  return useQuery({
    queryKey: ["calendar-stats"],
    queryFn: () => calendarService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
