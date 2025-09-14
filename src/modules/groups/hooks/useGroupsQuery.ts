import { useQuery } from "@tanstack/react-query";
import { groupsService } from "../services/groupsService";
import type { GroupFilters } from "../types";

export function useGroupsQuery(filters?: GroupFilters) {
  return useQuery({
    queryKey: ["groups", filters],
    queryFn: () => groupsService.getGroups(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGroupQuery(id: string) {
  return useQuery({
    queryKey: ["group", id],
    queryFn: () => groupsService.getGroup(id),
    enabled: !!id,
  });
}

export function useGroupStatsQuery() {
  return useQuery({
    queryKey: ["group-stats"],
    queryFn: () => groupsService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
