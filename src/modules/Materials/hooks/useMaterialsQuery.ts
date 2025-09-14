import { useQuery } from "@tanstack/react-query";
import { materialsService } from "../services/materialsService";
import type { MaterialFilters } from "../types";

export function useMaterialsQuery(filters?: MaterialFilters) {
  return useQuery({
    queryKey: ["materials", filters],
    queryFn: () => materialsService.getMaterials(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMaterialQuery(id: string) {
  return useQuery({
    queryKey: ["material", id],
    queryFn: () => materialsService.getMaterial(id),
    enabled: !!id,
  });
}

export function useMaterialStatsQuery() {
  return useQuery({
    queryKey: ["material-stats"],
    queryFn: () => materialsService.getMaterialStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
