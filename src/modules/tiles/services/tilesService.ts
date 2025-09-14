import { httpClient } from "../../../lib/httpClient";
import type { Tile, TileFilters, TileStats } from "../types";

export const tilesService = {
  async getTiles(filters?: TileFilters): Promise<Tile[]> {
    const params = new URLSearchParams();

    if (filters?.status?.length) {
      params.append("status", filters.status.join(","));
    }
    if (filters?.projectId) {
      params.append("projectId", filters.projectId);
    }
    if (filters?.material?.length) {
      params.append("material", filters.material.join(","));
    }
    if (filters?.priority?.length) {
      params.append("priority", filters.priority.join(","));
    }
    if (filters?.assignedTo?.length) {
      params.append("assignedTo", filters.assignedTo.join(","));
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }

    const response = await httpClient.get(`/api/tiles?${params.toString()}`);
    return (response as any).data;
  },

  async getTile(id: string): Promise<Tile> {
    const response = await httpClient.get(`/api/tiles/${id}`);
    return (response as any).data;
  },

  async createTile(
    tile: Omit<Tile, "id" | "createdAt" | "updatedAt">
  ): Promise<Tile> {
    const response = await httpClient.post("/api/tiles", tile);
    return (response as any).data;
  },

  async updateTile(id: string, tile: Partial<Tile>): Promise<Tile> {
    const response = await httpClient.put(`/api/tiles/${id}`, tile);
    return (response as any).data;
  },

  async deleteTile(id: string): Promise<void> {
    await httpClient.delete(`/api/tiles/${id}`);
  },

  async getTileStats(): Promise<TileStats> {
    const response = await httpClient.get("/api/tiles/stats");
    return (response as any).data;
  },

  async updateTileStatus(id: string, status: string): Promise<Tile> {
    const response = await httpClient.patch(`/api/tiles/${id}/status`, {
      status,
    });
    return (response as any).data;
  },

  async assignTile(
    id: string,
    assignedTo: string,
    notes?: string
  ): Promise<Tile> {
    const response = await httpClient.patch(`/api/tiles/${id}/assign`, {
      assignedTo,
      notes,
    });
    return (response as any).data;
  },
};
