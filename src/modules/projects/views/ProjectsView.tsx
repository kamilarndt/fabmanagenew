import { ProjectList } from "../components/ProjectList";
import { ProjectStats } from "../components/ProjectStats";
import { useProjectsQuery } from "../hooks/useProjectsQuery";

interface ProjectsViewProps {
  onViewProject?: (project: any) => void;
  onEditProject?: (project: any) => void;
  onAddProject?: () => void;
}

export function ProjectsView({
  onViewProject,
  onEditProject,
  onAddProject,
}: ProjectsViewProps) {
  const { data: projects = [], isLoading, error } = useProjectsQuery();

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p>Error loading projects: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <ProjectStats projects={projects} />
      <div style={{ marginTop: 24 }}>
        <ProjectList
          projects={projects}
          loading={isLoading}
          onViewProject={onViewProject}
          onEditProject={onEditProject}
          onAddProject={onAddProject}
        />
      </div>
    </div>
  );
}
