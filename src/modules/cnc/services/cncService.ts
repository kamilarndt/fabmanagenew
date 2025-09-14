import { httpClient } from "../../../lib/httpClient";
import type { CNCFilters, CNCStats, CNCTask } from "../types";

export const cncService = {
  async getTasks(filters?: CNCFilters): Promise<CNCTask[]> {
    const params = new URLSearchParams();

    if (filters?.status?.length) {
      params.append("status", filters.status.join(","));
    }
    if (filters?.priority?.length) {
      params.append("priority", filters.priority.join(","));
    }
    if (filters?.assignedTo?.length) {
      params.append("assignedTo", filters.assignedTo.join(","));
    }
    if (filters?.machineId) {
      params.append("machineId", filters.machineId);
    }
    if (filters?.projectId) {
      params.append("projectId", filters.projectId);
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }

    const response = await httpClient.get(
      `/api/cnc/tasks?${params.toString()}`
    );
    return (response as any).data;
  },

  async getTask(id: string): Promise<CNCTask> {
    const response = await httpClient.get(`/api/cnc/tasks/${id}`);
    return (response as any).data;
  },

  async createTask(
    task: Omit<CNCTask, "id" | "createdAt" | "updatedAt">
  ): Promise<CNCTask> {
    const response = await httpClient.post("/api/cnc/tasks", task);
    return (response as any).data;
  },

  async updateTask(id: string, task: Partial<CNCTask>): Promise<CNCTask> {
    const response = await httpClient.put(`/api/cnc/tasks/${id}`, task);
    return (response as any).data;
  },

  async deleteTask(id: string): Promise<void> {
    await httpClient.delete(`/api/cnc/tasks/${id}`);
  },

  async getStats(): Promise<CNCStats> {
    const response = await httpClient.get("/api/cnc/stats");
    return (response as any).data;
  },

  async startTask(id: string): Promise<CNCTask> {
    const response = await httpClient.patch(`/api/cnc/tasks/${id}/start`);
    return (response as any).data;
  },

  async pauseTask(id: string): Promise<CNCTask> {
    const response = await httpClient.patch(`/api/cnc/tasks/${id}/pause`);
    return (response as any).data;
  },

  async completeTask(id: string): Promise<CNCTask> {
    const response = await httpClient.patch(`/api/cnc/tasks/${id}/complete`);
    return (response as any).data;
  },

  async updateTaskStatus(id: string, status: string): Promise<CNCTask> {
    const response = await httpClient.patch(`/api/cnc/tasks/${id}/status`, {
      status,
    });
    return (response as any).data;
  },
};
