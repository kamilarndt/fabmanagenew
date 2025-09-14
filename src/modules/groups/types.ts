export interface Group {
  id: string;
  name: string;
  description?: string;
  type: "project" | "department" | "team" | "client" | "supplier" | "other";
  members: GroupMember[];
  projects: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  settings?: {
    notifications: boolean;
    autoAssign: boolean;
    permissions: string[];
  };
}

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
  joinedAt: string;
  avatar?: string;
}

export interface GroupFilters {
  type?: string[];
  isActive?: boolean;
  search?: string;
  memberId?: string;
}

export interface GroupStats {
  totalGroups: number;
  activeGroups: number;
  totalMembers: number;
  groupsByType: Record<string, number>;
  averageMembersPerGroup: number;
}
