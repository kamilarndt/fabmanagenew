import { httpClient } from "../../../lib/httpClient";
import type { Material, MaterialFilters, MaterialStats } from "../types";

export const materialsService = {
  async getMaterials(filters?: MaterialFilters): Promise<Material[]> {
    const params = new URLSearchParams();

    if (filters?.category?.length) {
      params.append("category", filters.category.join(","));
    }
    if (filters?.supplier?.length) {
      params.append("supplier", filters.supplier.join(","));
    }
    if (filters?.stockLevel) {
      params.append("stockLevel", filters.stockLevel);
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.isActive !== undefined) {
      params.append("isActive", filters.isActive.toString());
    }

    const response = await httpClient.get(
      `/api/materials?${params.toString()}`
    );
    return (response as any).data;
  },

  async getMaterial(id: string): Promise<Material> {
    const response = await httpClient.get(`/api/materials/${id}`);
    return (response as any).data;
  },

  async createMaterial(
    material: Omit<Material, "id" | "createdAt" | "updatedAt">
  ): Promise<Material> {
    const response = await httpClient.post("/api/materials", material);
    return (response as any).data;
  },

  async updateMaterial(
    id: string,
    material: Partial<Material>
  ): Promise<Material> {
    const response = await httpClient.put(`/api/materials/${id}`, material);
    return (response as any).data;
  },

  async deleteMaterial(id: string): Promise<void> {
    await httpClient.delete(`/api/materials/${id}`);
  },

  async getMaterialStats(): Promise<MaterialStats> {
    const response = await httpClient.get("/api/materials/stats");
    return (response as any).data;
  },

  async updateStock(id: string, stock: number): Promise<Material> {
    const response = await httpClient.patch(`/api/materials/${id}/stock`, {
      stock,
    });
    return (response as any).data;
  },
};
