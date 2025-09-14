import { useQuery } from "@tanstack/react-query";
import { tilesService } from "../services/tilesService";
import type { TileFilters } from "../types";

export function useTilesQuery(filters?: TileFilters) {
  return useQuery({
    queryKey: ["tiles", filters],
    queryFn: () => tilesService.getTiles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTileQuery(id: string) {
  return useQuery({
    queryKey: ["tile", id],
    queryFn: () => tilesService.getTile(id),
    enabled: !!id,
  });
}

export function useTileStatsQuery() {
  return useQuery({
    queryKey: ["tile-stats"],
    queryFn: () => tilesService.getTileStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
