import { api } from "../lib/httpClient";
import type { Project } from "../stores/projectsStore";
import {
  PROJECT_MODULES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  type ProjectModule,
  type ProjectStatus,
  type ProjectType,
} from "../types/enums";

function mapBackendStatusToUi(status?: string): ProjectStatus {
  switch ((status || "").toLowerCase()) {
    case "new":
      return PROJECT_STATUSES.NEW;
    case "active":
      return PROJECT_STATUSES.ACTIVE;
    case "on_hold":
      return PROJECT_STATUSES.ON_HOLD;
    case "done":
      return PROJECT_STATUSES.DONE;
    case "archived":
      return PROJECT_STATUSES.DONE;
    default:
      return PROJECT_STATUSES.NEW;
  }
}

function generateNumer(created_at?: string): string {
  const d = created_at ? new Date(created_at) : new Date();
  const y = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `P-${y}/${mm}/${dd}`;
}

export async function listProjects(): Promise<Project[]> {
  const [projects, clients] = await Promise.all([
    api.get<any[]>("/api/projects"),
    api.get<any[]>("/api/clients").catch(() => []), // Fallback if clients endpoint fails
  ]);

  const clientMap = new Map<string, string>();
  for (const c of clients) clientMap.set(c.id, c.name);

  const mapped: Project[] = (projects as any[]).map((p) => ({
    id: p.id,
    numer: generateNumer(p.created_at),
    name: p.name || "Projekt",
    typ: (Object.values(PROJECT_TYPES) as string[]).includes(p.project_type)
      ? (p.project_type as ProjectType)
      : PROJECT_TYPES.EVENT,
    lokalizacja: p.location || "Nieznana",
    clientId: p.client_id || "",
    client: clientMap.get(p.client_id) || "Unknown",
    status: mapBackendStatusToUi(p.status),
    data_utworzenia: (p.created_at || "").slice(0, 10),
    deadline: p.deadline || "",
    postep: 0,
    budget: undefined,
    manager: undefined,
    manager_id: undefined,
    description: p.description || "",
    miniatura: undefined,
    repozytorium_plikow: undefined,
    link_model_3d: undefined,
    progress: 0,
    groups: [],
    modules: p.modules ? (JSON.parse(p.modules) as ProjectModule[]) : [],
  }));

  return mapped;
}

export async function createProject(
  p: Omit<Project, "id">
): Promise<Project | null> {
  const payload: Record<string, unknown> = {
    client_id: p.clientId,
    name: p.name,
    status: PROJECT_STATUSES.NEW,
    deadline: p.deadline || null,
  };
  if (Array.isArray(p.modules)) {
    payload.modules = JSON.stringify(p.modules);
    payload.hasClientMaterials = p.modules.includes(PROJECT_MODULES.PRODUCTION);
  }

  const d = await api.call<any>("/api/projects", {
    method: "POST",
    data: payload,
    table: "projects",
    useSupabase: false,
  });

  const mapped: Project = {
    id: d.id,
    numer: generateNumer(d.created_at),
    name: d.name,
    typ: PROJECT_TYPES.EVENT,
    lokalizacja: "Nieznana",
    clientId: d.client_id,
    client: "",
    status: mapBackendStatusToUi(d.status),
    data_utworzenia: (d.created_at || "").slice(0, 10),
    deadline: d.deadline || "",
    postep: 0,
    progress: 0,
    groups: [],
    modules:
      typeof d.modules === "string" && d.modules
        ? (() => {
            try {
              return JSON.parse(d.modules);
            } catch {
              return p.modules || [];
            }
          })()
        : p.modules || [],
  };

  return mapped;
}

export async function updateProject(
  id: string,
  patch: Partial<Project>
): Promise<void> {
  const payload = {
    client_id: patch.clientId,
    name: patch.name,
    status: PROJECT_STATUSES.ACTIVE,
    deadline: patch.deadline,
    link_model_3d: patch.link_model_3d,
  };

  await api.call(`/api/projects/${id}`, {
    method: "PUT",
    data: { ...payload, id },
    table: "projects",
    useSupabase: false,
  });
}

export async function deleteProject(id: string): Promise<void> {
  await api.call(`/api/projects/${id}`, {
    method: "DELETE",
    table: "projects",
    useSupabase: false,
  });
}

export async function updateProjectModelLink(
  id: string,
  streamUrl: string
): Promise<void> {
  await api.call(`/api/projects/${id}`, {
    method: "PUT",
    data: { id, link_model_3d: streamUrl },
    table: "projects",
    useSupabase: false,
  });
}
