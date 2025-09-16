// import { PlusOutlined } from "@ant-design/icons";
// import { Button, Col, Empty, Row, Space } from "antd";
// import { PageHeader } from "../../../components/shared/PageHeader";
import type { BaseEntity } from "../../../components/shared/BaseCard";
import { BaseGrid } from "../../../components/shared/BaseGrid";
import type { Project, ProjectWithStats } from "../types/projects.types";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  loading?: boolean;
  onViewProject?: (project: ProjectWithStats) => void;
  onEditProject?: (project: ProjectWithStats) => void;
  onAddProject?: () => void;
  onStatusChange?: (project: Project, status: string) => void;
}

export function ProjectList({
  projects,
  loading = false,
  onViewProject,
  onEditProject,
  onAddProject,
}: ProjectListProps) {
  // Konwertuj Project[] na BaseEntity[]
  const baseEntities: BaseEntity[] = projects.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description || `Project ${project.id}`,
    status: project.status === "on_hold" ? "cancelled" : project.status,
    priority: project.priority || "medium",
    assignedTo: project.manager,
    projectId: project.id,
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: project.updatedAt || new Date().toISOString(),
  }));

  // Mapowanie statusu na kolumny
  const getStatusFromEntity = (entity: BaseEntity) => {
    const project = projects.find((p) => p.id === entity.id);
    if (!project) return "unknown";

    // Mapowanie statusów Project na kolumny
    switch (project.status) {
      case "new":
      case "Nowy":
        return "new";
      case "active":
      case "W realizacji":
        return "active";
      case "on_hold":
      case "Wstrzymany":
        return "on_hold";
      case "completed":
      case "Zakończony":
        return "completed";
      case "cancelled":
      case "Anulowany":
        return "cancelled";
      default:
        return "new";
    }
  };

  // Mapowanie kolorów statusu
  const statusColorMap = (status: string) => {
    switch (status) {
      case "new":
        return "blue";
      case "active":
        return "green";
      case "on_hold":
        return "orange";
      case "completed":
        return "cyan";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  // Custom fields dla BaseGrid - renderuj ProjectCard
  const customFields = (entity: BaseEntity) => {
    const project = projects.find((p) => p.id === entity.id);
    if (!project) return null;

    const projectWithStats: ProjectWithStats = {
      ...project,
      stats: {
        totalTiles: 0,
        completedTiles: 0,
        progress: 0,
        budgetUsed: 0,
        budgetRemaining: project.budget || 0,
      },
      priority: project.priority || "medium",
      createdAt: project.createdAt || new Date().toISOString(),
      updatedAt: project.updatedAt || new Date().toISOString(),
      status: project.status === "on_hold" ? "cancelled" : project.status,
      modules: project.modules || [],
    };

    return (
      <ProjectCard
        project={projectWithStats}
        onView={onViewProject}
        onEdit={onEditProject}
      />
    );
  };

  // Adaptery do konwersji BaseEntity z powrotem na Project
  const handleViewEntity = (entity: BaseEntity) => {
    const project = projects.find((p) => p.id === entity.id);
    if (project) {
      const projectWithStats: ProjectWithStats = {
        ...project,
        stats: {
          totalTiles: 0,
          completedTiles: 0,
          progress: 0,
          budgetUsed: 0,
          budgetRemaining: project.budget || 0,
        },
        priority: project.priority || "medium",
        createdAt: project.createdAt || new Date().toISOString(),
        updatedAt: project.updatedAt || new Date().toISOString(),
        status: project.status === "on_hold" ? "cancelled" : project.status,
        modules: project.modules || [],
      };
      onViewProject?.(projectWithStats);
    }
  };

  const handleEditEntity = (entity: BaseEntity) => {
    const project = projects.find((p) => p.id === entity.id);
    if (project) {
      const projectWithStats: ProjectWithStats = {
        ...project,
        stats: {
          totalTiles: 0,
          completedTiles: 0,
          progress: 0,
          budgetUsed: 0,
          budgetRemaining: project.budget || 0,
        },
        priority: project.priority || "medium",
        createdAt: project.createdAt || new Date().toISOString(),
        updatedAt: project.updatedAt || new Date().toISOString(),
        status: project.status === "on_hold" ? "cancelled" : project.status,
        modules: project.modules || [],
      };
      onEditProject?.(projectWithStats);
    }
  };

  const handleDeleteEntity = (_entity: BaseEntity) => {
    // Brak funkcji delete w props
  };

  // Kolumny statusu dla projektów
  const statusColumns = [
    { key: "new", title: "New", color: "blue" },
    { key: "active", title: "Active", color: "green" },
    { key: "on_hold", title: "On Hold", color: "orange" },
    { key: "completed", title: "Completed", color: "cyan" },
    { key: "cancelled", title: "Cancelled", color: "red" },
  ];

  return (
    <BaseGrid
      entities={baseEntities}
      loading={loading}
      onViewEntity={handleViewEntity}
      onEditEntity={handleEditEntity}
      onDeleteEntity={handleDeleteEntity}
      onAddEntity={onAddProject}
      title="Projects"
      subtitle={`${projects.length} project${
        projects.length !== 1 ? "s" : ""
      } total`}
      statusColumns={statusColumns}
      getStatusFromEntity={getStatusFromEntity}
      statusColorMap={statusColorMap}
      customFields={customFields}
    />
  );
}
