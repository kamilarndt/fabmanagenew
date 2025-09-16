import { httpClient } from "../../../lib/httpClient";
import type { TemplateEntity, TemplateFilters, TemplateStats } from "../types";

export const templateService = {
  async getEntities(filters?: TemplateFilters): Promise<TemplateEntity[]> {
    const params = new URLSearchParams();

    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.status?.length) {
      params.append("status", filters.status.join(","));
    }
    if (filters?.priority?.length) {
      params.append("priority", filters.priority.join(","));
    }
    if (filters?.assignedTo?.length) {
      params.append("assignedTo", filters.assignedTo.join(","));
    }
    if (filters?.type?.length) {
      params.append("type", filters.type.join(","));
    }
    if (filters?.category?.length) {
      params.append("category", filters.category.join(","));
    }
    if (filters?.dateRange) {
      params.append("startDate", filters.dateRange.start);
      params.append("endDate", filters.dateRange.end);
    }

    const response = await httpClient.get(
      `/api/template/entities?${params.toString()}`
    );
    return (response as any).data;
  },

  async getEntity(id: string): Promise<TemplateEntity> {
    const response = await httpClient.get(`/api/template/entities/${id}`);
    return (response as any).data;
  },

  async createEntity(
    entity: Omit<TemplateEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<TemplateEntity> {
    const response = await httpClient.post("/api/template/entities", entity);
    return (response as any).data;
  },

  async updateEntity(
    id: string,
    entity: Partial<TemplateEntity>
  ): Promise<TemplateEntity> {
    const response = await httpClient.put(
      `/api/template/entities/${id}`,
      entity
    );
    return (response as any).data;
  },

  async deleteEntity(id: string): Promise<void> {
    await httpClient.delete(`/api/template/entities/${id}`);
  },

  async getStats(): Promise<TemplateStats> {
    const response = await httpClient.get("/api/template/stats");
    return (response as any).data;
  },
};

