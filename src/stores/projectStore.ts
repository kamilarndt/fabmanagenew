// Zustand store for project management
import { useEffect } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { supabase } from "../lib/supabase";

export interface Project {
  id: string;
  name: string;
  client_id: string | null;
  status: string;
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  modules: Record<string, boolean>;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  client?: {
    id: string;
    name: string;
    company_name: string | null;
  };
}

export interface ProjectMessage {
  id: string;
  project_id: string;
  author_id: string;
  body_html: string;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    email: string;
    raw_user_meta_data: any;
  };
}

export interface ProjectActivity {
  id: string;
  project_id: string;
  type: string;
  payload_json: any;
  actor_id: string | null;
  created_at: string;
  actor?: {
    id: string;
    email: string;
    raw_user_meta_data: any;
  };
}

interface ProjectState {
  // State
  projects: Project[];
  currentProject: Project | null;
  messages: ProjectMessage[];
  activity: ProjectActivity[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (
    project: Omit<Project, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Messages
  fetchMessages: (projectId: string) => Promise<void>;
  addMessage: (projectId: string, body: string) => Promise<void>;
  updateMessage: (id: string, body: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;

  // Activity
  fetchActivity: (projectId: string) => Promise<void>;

  // Utils
  setCurrentProject: (project: Project | null) => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set) => ({
      // Initial state
      projects: [],
      currentProject: null,
      messages: [],
      activity: [],
      isLoading: false,
      error: null,

      // Fetch all projects
      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("projects")
            .select(
              `
              *,
              clients (
                id,
                name,
                company_name
              )
            `
            )
            .order("created_at", { ascending: false });

          if (error) throw error;
          set({ projects: data || [], isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Fetch single project
      fetchProject: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("projects")
            .select(
              `
              *,
              clients (
                id,
                name,
                email,
                phone,
                company_name,
                address
              )
            `
            )
            .eq("id", id)
            .single();

          if (error) throw error;
          set({ currentProject: data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Create new project
      createProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
          const { data: user } = await supabase.auth.getUser();

          const { data, error } = await supabase
            .from("projects")
            .insert({
              ...projectData,
              created_by: user.user?.id,
              modules: projectData.modules || {},
            })
            .select(
              `
              *,
              clients (
                id,
                name,
                company_name
              )
            `
            )
            .single();

          if (error) throw error;

          // Add to projects list
          set((state) => ({
            projects: [data, ...state.projects],
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Update project
      updateProject: async (id: string, updates) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("projects")
            .update(updates)
            .eq("id", id)
            .select(
              `
              *,
              clients (
                id,
                name,
                company_name
              )
            `
            )
            .single();

          if (error) throw error;

          // Update in projects list
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === id ? { ...p, ...data } : p
            ),
            currentProject:
              state.currentProject?.id === id ? data : state.currentProject,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Delete project
      deleteProject: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", id);

          if (error) throw error;

          // Remove from projects list
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            currentProject:
              state.currentProject?.id === id ? null : state.currentProject,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Fetch project messages
      fetchMessages: async (projectId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("project_messages")
            .select(
              `
              *,
              author:auth.users (
                id,
                email,
                raw_user_meta_data
              )
            `
            )
            .eq("project_id", projectId)
            .order("created_at", { ascending: false });

          if (error) throw error;
          set({ messages: data || [], isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Add message
      addMessage: async (projectId: string, body: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data: user } = await supabase.auth.getUser();

          const { data, error } = await supabase
            .from("project_messages")
            .insert({
              project_id: projectId,
              author_id: user.user?.id!,
              body_html: body,
            })
            .select(
              `
              *,
              author:auth.users (
                id,
                email,
                raw_user_meta_data
              )
            `
            )
            .single();

          if (error) throw error;

          // Add to messages list
          set((state) => ({
            messages: [data, ...state.messages],
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Update message
      updateMessage: async (id: string, body: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("project_messages")
            .update({ body_html: body })
            .eq("id", id)
            .select(
              `
              *,
              author:auth.users (
                id,
                email,
                raw_user_meta_data
              )
            `
            )
            .single();

          if (error) throw error;

          // Update in messages list
          set((state) => ({
            messages: state.messages.map((m) => (m.id === id ? data : m)),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Delete message
      deleteMessage: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from("project_messages")
            .delete()
            .eq("id", id);

          if (error) throw error;

          // Remove from messages list
          set((state) => ({
            messages: state.messages.filter((m) => m.id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Fetch project activity
      fetchActivity: async (projectId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("project_activity")
            .select(
              `
              *,
              actor:auth.users (
                id,
                email,
                raw_user_meta_data
              )
            `
            )
            .eq("project_id", projectId)
            .order("created_at", { ascending: false });

          if (error) throw error;
          set({ activity: data || [], isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Set current project
      setCurrentProject: (project) => {
        set({ currentProject: project });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "project-store",
    }
  )
);

// Real-time integration for project store
export const useProjectRealtime = (projectId: string | null) => {
  const { fetchProject, fetchMessages, fetchActivity } = useProjectStore();

  useEffect(() => {
    if (!projectId) return;

    const handleProjectUpdate = (payload: any) => {
      console.log("Real-time project update:", payload);
      if (payload.eventType === "UPDATE") {
        fetchProject(projectId);
      }
    };

    const handleMessageUpdate = (payload: any) => {
      console.log("Real-time message update:", payload);
      if (payload.eventType === "INSERT") {
        fetchMessages(projectId);
      }
    };

    const handleActivityUpdate = (payload: any) => {
      console.log("Real-time activity update:", payload);
      if (payload.eventType === "INSERT") {
        fetchActivity(projectId);
      }
    };

    // Listen to real-time events
    window.addEventListener("project-updated", handleProjectUpdate);
    window.addEventListener("project-message-updated", handleMessageUpdate);
    window.addEventListener("project-activity-updated", handleActivityUpdate);

    return () => {
      window.removeEventListener("project-updated", handleProjectUpdate);
      window.removeEventListener(
        "project-message-updated",
        handleMessageUpdate
      );
      window.removeEventListener(
        "project-activity-updated",
        handleActivityUpdate
      );
    };
  }, [projectId, fetchProject, fetchMessages, fetchActivity]);
};
