import { api } from "../lib/httpClient";
import {
  validateProjectData,
  type ProjectCreateData,
  type ProjectFormData,
} from "../schemas/project.schema";

export interface Project {
  id: string;
  name: string;
  client: string;
  clientId?: string;
  deadline: string;
  status: "Nowy" | "Wyceniany" | "W realizacji" | "Zakończony" | "Wstrzymany";
  typ?: string;
  lokalizacja?: string;
  description?: string;
  budget?: number;
  manager?: string;
  modules?: string[];
  link_model_3d?: string;
  numer?: string;
  data_utworzenia?: string;
  postep?: number;
  groups?: any[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Enhanced project service with validation
 */
export const projectsService = {
  /**
   * Get all projects
   */
  async list(): Promise<Project[]> {
    return api.get<Project[]>("/api/projects");
  },

  /**
   * Get a single project by ID
   */
  async get(id: string): Promise<Project> {
    return api.get<Project>(`/api/projects/${id}`);
  },

  /**
   * Create a new project with validation
   */
  async create(data: ProjectFormData): Promise<Project> {
    const validatedData = validateProjectData(data);

    // Add default values for required fields
    const createData: ProjectCreateData = {
      ...validatedData,
      numer:
        validatedData.numer ||
        `P-${new Date().getFullYear()}/${String(
          new Date().getMonth() + 1
        ).padStart(2, "0")}/NEW`,
      data_utworzenia: new Date().toISOString().slice(0, 10),
      postep: 0,
      groups: [],
      modules: validatedData.modules || ["wycena", "koncepcja"],
    };

    return api.post<Project>("/api/projects", createData);
  },

  /**
   * Update an existing project
   */
  async update(id: string, data: Partial<ProjectFormData>): Promise<Project> {
    const validatedData = validateProjectData({ ...data });
    return api.put<Project>(`/api/projects/${id}`, validatedData);
  },

  /**
   * Delete a project
   */
  async delete(id: string): Promise<void> {
    return api.delete(`/api/projects/${id}`);
  },

  /**
   * Get projects by client ID
   */
  async getByClient(clientId: string): Promise<Project[]> {
    return api.get<Project[]>(`/api/projects?clientId=${clientId}`);
  },

  /**
   * Get projects by status
   */
  async getByStatus(status: string): Promise<Project[]> {
    return api.get<Project[]>(`/api/projects?status=${status}`);
  },
};

// Legacy functions for backward compatibility
export async function listProjects(): Promise<Project[]> {
  return projectsService.list();
}

export async function createProject(data: ProjectFormData): Promise<Project> {
  return projectsService.create(data);
}

export async function getProject(id: string): Promise<Project> {
  return projectsService.get(id);
}

export async function updateProject(
  id: string,
  data: Partial<ProjectFormData>
): Promise<Project> {
  return projectsService.update(id, data);
}

export async function deleteProject(id: string): Promise<void> {
  return projectsService.delete(id);
}

export async function updateProjectModelLink(
  id: string,
  linkModel3d: string
): Promise<Project> {
  return projectsService.update(id, { link_model_3d: linkModel3d });
}
