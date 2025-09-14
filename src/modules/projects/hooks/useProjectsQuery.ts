import { useQuery } from "@tanstack/react-query";
import { projectsService } from "../services/projectsService";
import type { ProjectFilters } from "../types";

export function useProjectsQuery(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: () => projectsService.getProjects(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProjectQuery(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => projectsService.getProject(id),
    enabled: !!id,
  });
}

export function useProjectStatsQuery() {
  return useQuery({
    queryKey: ["project-stats"],
    queryFn: () => projectsService.getProjectStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
