import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";
import type { BaseEntity } from "../../../components/shared/BaseCard";
import { BaseStats } from "../../../components/shared/BaseStats";
import type { Project } from "../types";

interface ProjectStatsProps {
  projects: Project[];
}

export function ProjectStats({ projects }: ProjectStatsProps) {
  // Konwertuj Project[] na BaseEntity[]
  const baseEntities: BaseEntity[] = projects.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description || `Project ${project.id}`,
    status: project.status,
    priority: project.priority || "medium",
    assignedTo: undefined,
    projectId: project.id,
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: project.updatedAt || new Date().toISOString(),
  }));

  // Mapowanie statusu na kategorie
  const getStatusFromEntity = (entity: BaseEntity) => {
    const project = projects.find((p) => p.id === entity.id);
    if (!project) return "unknown";

    // Mapowanie statusów Project na kategorie
    switch (project.status) {
      case "draft":
        return "new";
      case "active":
        return "active";
      case "on_hold":
        return "on_hold";
      case "completed":
        return "completed";
      case "cancelled":
        return "cancelled";
      default:
        return "new";
    }
  };

  // Mapowanie priorytetu
  const getPriorityFromEntity = (entity: BaseEntity) => {
    const project = projects.find((p) => p.id === entity.id);
    return project?.priority || "medium";
  };

  // Custom stats dla Project
  const customStats = [
    {
      title: "Active",
      value: projects.filter((p) => p.status === "active").length,
      color: "#1890ff",
      icon: <ClockCircleOutlined />,
    },
    {
      title: "Completed",
      value: projects.filter((p) => p.status === "completed").length,
      color: "#52c41a",
      icon: <CheckCircleOutlined />,
    },
    {
      title: "On Hold",
      value: projects.filter((p) => p.status === "on_hold").length,
      color: "#faad14",
      icon: <PauseCircleOutlined />,
    },
    {
      title: "Cancelled",
      value: projects.filter((p) => p.status === "cancelled").length,
      color: "#ff4d4f",
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <BaseStats
      entities={baseEntities}
      title="Project Overview"
      getStatusFromEntity={getStatusFromEntity}
      getPriorityFromEntity={getPriorityFromEntity}
      customStats={customStats}
    />
  );
}
