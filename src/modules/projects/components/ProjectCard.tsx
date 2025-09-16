import {
  CalendarOutlined,
  FileTextOutlined,
  LinkOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import type { BaseEntity } from "../../../components/shared/BaseCard";
import { BaseCard } from "../../../components/shared/BaseCard";
import {
  AppButton,
  AppProgress,
  AppSpace,
  AppTag,
} from "../../../components/ui";
import type { ProjectWithStats } from "../types/projects.types";

const { Text } = Typography;

interface ProjectCardProps {
  project: ProjectWithStats;
  onEdit?: (project: ProjectWithStats) => void;
  onDelete?: (project: ProjectWithStats) => void;
  onView?: (project: ProjectWithStats) => void;
}

export default function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL");
  };

  const getProjectTypeColor = (typ: string) => {
    const colors: Record<string, string> = {
      Targi: "blue",
      "Scenografia TV": "purple",
      Muzeum: "green",
      Wystawa: "orange",
      Event: "red",
      Inne: "default",
    };
    return colors[typ] || "default";
  };

  // Konwertuj Project na BaseEntity
  const baseEntity: BaseEntity = {
    id: project.id,
    name: project.name,
    description:
      project.description || `Nr: ${project.numer} - ${project.lokalizacja}`,
    status: project.status,
    priority: project.priority || "medium",
    assignedTo: project.manager,
    projectId: project.id,
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: project.updatedAt || new Date().toISOString(),
  };

  // Mapowanie kolorów statusu
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
      case "Nowy":
        return "blue";
      case "active":
      case "W realizacji":
        return "green";
      case "on_hold":
      case "Wstrzymany":
        return "orange";
      case "completed":
      case "Zakończony":
        return "cyan";
      case "cancelled":
      case "Anulowany":
        return "red";
      default:
        return "default";
    }
  };

  // Mapowanie kolorów priorytetu
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "blue";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  // Custom fields dla BaseCard
  const customFields = (
    <div>
      {/* Thumbnail */}
      <div className="project-thumbnail" style={{ marginBottom: 12 }}>
        {project.miniatura ? (
          <img
            alt={project.name}
            src={project.miniatura}
            style={{
              width: "100%",
              height: 160,
              objectFit: "cover",
              borderRadius: 6,
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 160,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "2rem",
              borderRadius: 6,
            }}
          >
            🖼️
          </div>
        )}
      </div>

      {/* Project type and location */}
      <div style={{ marginBottom: 12 }}>
        <AppTag color={getProjectTypeColor(project.typ || "default")}>
          {project.typ || "Unknown"}
        </AppTag>
        <Text type="secondary" style={{ fontSize: "0.85rem", marginLeft: 8 }}>
          📍 {project.lokalizacja}
        </Text>
      </div>

      {/* Client and deadline */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <UserOutlined style={{ marginRight: 6, color: "#666" }} />
          <Text strong>Klient: {project.client}</Text>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <CalendarOutlined style={{ marginRight: 6, color: "#666" }} />
          <Text>
            Deadline:{" "}
            {project.deadline ? formatDate(project.deadline) : "Not set"}
          </Text>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text strong>Postęp</Text>
          <Text>{project.postep || project.progress || 0}%</Text>
        </div>
        <AppProgress
          percent={project.postep || project.progress || 0}
          size="small"
          strokeColor={["#108ee9", "#87d068"]}
        />
      </div>

      {/* Project modules */}
      <div style={{ marginBottom: 16 }}>
        <Text
          strong
          style={{ fontSize: "0.9rem", marginBottom: 8, display: "block" }}
        >
          MODUŁY PROJEKTU:
        </Text>
        {project.modules && project.modules.length > 0 ? (
          <div>
            {project.modules.slice(0, 3).map((module: any) => (
              <div
                key={module}
                style={{
                  fontSize: "0.85rem",
                  marginBottom: 2,
                }}
              >
                <Text>- {module.replace("_", " ")}</Text>
              </div>
            ))}
            {project.modules.length > 3 && (
              <Text type="secondary" style={{ fontSize: "0.8rem" }}>
                + {project.modules.length - 3} więcej...
              </Text>
            )}
          </div>
        ) : (
          <Text type="secondary" style={{ fontSize: "0.85rem" }}>
            Brak zdefiniowanych modułów
          </Text>
        )}

        {/* Total elements count */}
        <div
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Text type="secondary" style={{ fontSize: "0.8rem" }}>
            Łącznie elementów: <Text strong>{project.tilesCount}</Text>
          </Text>
        </div>
      </div>

      {/* Manager info */}
      {project.manager && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <AppSpace>
            <Avatar size="small" icon={<UserOutlined />} />
            <Text type="secondary" style={{ fontSize: "0.85rem" }}>
              Manager: {project.manager}
            </Text>
          </AppSpace>
        </div>
      )}
    </div>
  );

  // Akcje dla BaseCard
  const actions = [
    <AppButton
      key="edit"
      type="text"
      icon={<FileTextOutlined />}
      onClick={() => onEdit?.(project)}
    >
      Edytuj
    </AppButton>,
    <AppButton
      key="3d"
      type="text"
      icon={<LinkOutlined />}
      onClick={() => navigate(`/projekt/${project.id}?tab=model_3d`)}
    >
      3D Model
    </AppButton>,
  ];

  // Adaptery do konwersji BaseEntity z powrotem na Project
  const handleView = (_entity: BaseEntity) => {
    navigate(`/projekt/${project.id}`);
  };

  const handleEdit = (_entity: BaseEntity) => {
    onEdit?.(project);
  };

  const handleDelete = (_entity: BaseEntity) => {
    // Brak funkcji delete w props
  };

  return (
    <BaseCard
      entity={baseEntity}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      statusColorMap={getStatusColor}
      priorityColorMap={getPriorityColor}
      customFields={customFields}
      actions={actions}
    />
  );
}
