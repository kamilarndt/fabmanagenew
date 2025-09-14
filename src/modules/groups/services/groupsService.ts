import { httpClient } from "../../../lib/httpClient";
import type { Group, GroupFilters, GroupStats } from "../types";

export const groupsService = {
  async getGroups(filters?: GroupFilters): Promise<Group[]> {
    const params = new URLSearchParams();

    if (filters?.type?.length) {
      params.append("type", filters.type.join(","));
    }
    if (filters?.isActive !== undefined) {
      params.append("isActive", filters.isActive.toString());
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.memberId) {
      params.append("memberId", filters.memberId);
    }

    const response = await httpClient.get(`/api/groups?${params.toString()}`);
    return (response as any).data;
  },

  async getGroup(id: string): Promise<Group> {
    const response = await httpClient.get(`/api/groups/${id}`);
    return (response as any).data;
  },

  async createGroup(
    group: Omit<Group, "id" | "createdAt" | "updatedAt">
  ): Promise<Group> {
    const response = await httpClient.post("/api/groups", group);
    return (response as any).data;
  },

  async updateGroup(id: string, group: Partial<Group>): Promise<Group> {
    const response = await httpClient.put(`/api/groups/${id}`, group);
    return (response as any).data;
  },

  async deleteGroup(id: string): Promise<void> {
    await httpClient.delete(`/api/groups/${id}`);
  },

  async getStats(): Promise<GroupStats> {
    const response = await httpClient.get("/api/groups/stats");
    return (response as any).data;
  },

  async addMember(groupId: string, member: any): Promise<Group> {
    const response = await httpClient.post(
      `/api/groups/${groupId}/members`,
      member
    );
    return (response as any).data;
  },

  async removeMember(groupId: string, memberId: string): Promise<Group> {
    const response = await httpClient.delete(
      `/api/groups/${groupId}/members/${memberId}`
    );
    return (response as any).data;
  },

  async updateMemberRole(
    groupId: string,
    memberId: string,
    role: string
  ): Promise<Group> {
    const response = await httpClient.patch(
      `/api/groups/${groupId}/members/${memberId}`,
      { role }
    );
    return (response as any).data;
  },
};
