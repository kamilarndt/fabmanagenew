import { useQuery } from "@tanstack/react-query";
import { cncService } from "../services/cncService";
import type { CNCFilters } from "../types";

export function useCNCQuery(filters?: CNCFilters) {
  return useQuery({
    queryKey: ["cnc-tasks", filters],
    queryFn: () => cncService.getTasks(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCNCTaskQuery(id: string) {
  return useQuery({
    queryKey: ["cnc-task", id],
    queryFn: () => cncService.getTask(id),
    enabled: !!id,
  });
}

export function useCNCStatsQuery() {
  return useQuery({
    queryKey: ["cnc-stats"],
    queryFn: () => cncService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
