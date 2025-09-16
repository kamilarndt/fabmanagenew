import { useQuery } from "@tanstack/react-query";
import { templateService } from "../services/templateService";
import type { TemplateFilters } from "../types";

export function useTemplateQuery(filters?: TemplateFilters) {
  return useQuery({
    queryKey: ["template-entities", filters],
    queryFn: () => templateService.getEntities(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTemplateEntityQuery(id: string) {
  return useQuery({
    queryKey: ["template-entity", id],
    queryFn: () => templateService.getEntity(id),
    enabled: !!id,
  });
}

export function useTemplateStatsQuery() {
  return useQuery({
    queryKey: ["template-stats"],
    queryFn: () => templateService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

