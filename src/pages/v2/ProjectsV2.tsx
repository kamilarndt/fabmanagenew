import { ProjectPage } from "@/new-ui";
import { useProjectsStore } from "@/stores/projectsStore";
import * as React from "react";
import { useParams } from "react-router-dom";

export default function ProjectsV2(): React.ReactElement {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects } = useProjectsStore();

  const project = React.useMemo(() => {
    if (!projectId) return null;
    return projects.find((p) => p.id === projectId) || null;
  }, [projects, projectId]);

  const handleEdit = () => {
    console.log("Edit project clicked");
    // Navigate to edit page or open edit modal
  };

  const handleDelete = () => {
    if (
      project &&
      window.confirm("Are you sure you want to delete this project?")
    ) {
      console.log("Delete project:", project.id);
      // TODO: Implement delete functionality when available in store
      // Navigate back to projects list
      window.location.href = "/v2/projects";
    }
  };

  const handleTaskClick = (taskId: string) => {
    console.log("Task clicked:", taskId);
    // Navigate to task details or open task modal
  };

  const handleTeamMemberClick = (memberId: string) => {
    console.log("Team member clicked:", memberId);
    // Navigate to team member profile or open contact modal
  };

  if (!project) {
    return (
      <div className="tw-flex tw-items-center tw-justify-center tw-h-64">
        <p className="tw-text-muted-foreground">Project not found</p>
      </div>
    );
  }

  // Transform project data to match new UI interface
  const transformedProject = {
    id: project.id,
    name: project.name,
    description: project.description || "No description available",
    status: project.status as
      | "planning"
      | "in-progress"
      | "completed"
      | "on-hold",
    progress: project.progress || 0,
    client: project.client || "Unknown Client",
    startDate: project.data_rozpoczęcia || "Not set",
    endDate: project.deadline || "Not set",
    budget: project.budget || 0,
    spent: 0, // No spent field in current Project type
    team: [
      {
        id: "1",
        name: "John Doe",
        role: "Project Manager",
        avatar: undefined,
      },
      {
        id: "2",
        name: "Jane Smith",
        role: "Designer",
        avatar: undefined,
      },
    ],
    tasks: [
      {
        id: "1",
        title: "Initial Design",
        status: "completed" as const,
        assignee: "Jane Smith",
        dueDate: "2024-01-15",
      },
      {
        id: "2",
        title: "Material Selection",
        status: "in-progress" as const,
        assignee: "John Doe",
        dueDate: "2024-01-20",
      },
      {
        id: "3",
        title: "Production Planning",
        status: "pending" as const,
        assignee: "John Doe",
        dueDate: "2024-01-25",
      },
    ],
  };

  return (
    <ProjectPage
      project={transformedProject}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onTaskClick={handleTaskClick}
      onTeamMemberClick={handleTeamMemberClick}
    />
  );
}
