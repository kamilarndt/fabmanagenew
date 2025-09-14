import { httpClient } from "../../../lib/httpClient";
import type { Project, ProjectFilters, ProjectStats } from "../types";

export const projectsService = {
  async getProjects(filters?: ProjectFilters): Promise<Project[]> {
    const params = new URLSearchParams();

    if (filters?.status?.length) {
      params.append("status", filters.status.join(","));
    }
    if (filters?.client?.length) {
      params.append("client", filters.client.join(","));
    }
    if (filters?.priority?.length) {
      params.append("priority", filters.priority.join(","));
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }

    const response = await httpClient.get(`/api/projects?${params.toString()}`);
    return (response as any).data;
  },

  async getProject(id: string): Promise<Project> {
    const response = await httpClient.get(`/api/projects/${id}`);
    return (response as any).data;
  },

  async createProject(
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<Project> {
    const response = await httpClient.post("/api/projects", project);
    return (response as any).data;
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const response = await httpClient.put(`/api/projects/${id}`, project);
    return (response as any).data;
  },

  async deleteProject(id: string): Promise<void> {
    await httpClient.delete(`/api/projects/${id}`);
  },

  async getProjectStats(): Promise<ProjectStats> {
    const response = await httpClient.get("/api/projects/stats");
    return (response as any).data;
  },

  async updateProjectStatus(id: string, status: string): Promise<Project> {
    const response = await httpClient.patch(`/api/projects/${id}/status`, {
      status,
    });
    return (response as any).data;
  },
};
