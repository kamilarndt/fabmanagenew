import { CalendarOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Space, Tag, Typography } from "antd";
import { FadeIn } from "../../../components/ui/FadeIn";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Project } from "../types";

const { Text, Title } = Typography;

interface ProjectCardProps {
  project: Project;
  onView?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onStatusChange?: (project: Project, status: string) => void;
}

export function ProjectCard({ project, onView, onEdit }: ProjectCardProps) {
  const handleView = () => onView?.(project);
  const handleEdit = () => onEdit?.(project);

  return (
    <FadeIn>
      <Card
        hoverable
        actions={[
          <Button
            key="view"
            type="text"
            icon={<EyeOutlined />}
            onClick={handleView}
          >
            View
          </Button>,
          <Button
            key="edit"
            type="text"
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            Edit
          </Button>,
        ]}
        style={{ height: "100%" }}
      >
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <Title level={4} style={{ margin: 0, flex: 1 }}>
              {project.name}
            </Title>
            <StatusBadge status={project.status} />
          </div>

          {project.description && (
            <Text type="secondary" style={{ fontSize: "14px" }}>
              {project.description}
            </Text>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Tag icon={<CalendarOutlined />} color="blue">
              {new Date(project.createdAt).toLocaleDateString()}
            </Tag>
            {project.client && <Tag color="green">{project.client}</Tag>}
          </Space>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Modules:</Text>
          <div style={{ marginTop: 4 }}>
            <Space wrap>
              {project.modules?.map((module) => (
                <Tag
                  key={module.name}
                  color={module.isEnabled ? "blue" : "default"}
                >
                  {module.name}
                </Tag>
              ))}
            </Space>
          </div>
        </div>

        {project.tiles && project.tiles.length > 0 && (
          <div>
            <Text strong>Tiles: </Text>
            <Badge count={project.tiles.length} color="blue" />
          </div>
        )}
      </Card>
    </FadeIn>
  );
}
