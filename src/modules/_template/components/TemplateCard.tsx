import { Typography } from "antd";
import { AppButton, AppCard, AppSpace, AppTag } from "../../../components/ui";
import { FadeIn } from "../../../components/ui/FadeIn";
import type { TemplateEntity } from "../types";

const { Text, Title } = Typography;

interface TemplateCardProps {
  entity: TemplateEntity;
  onView?: (entity: TemplateEntity) => void;
  onEdit?: (entity: TemplateEntity) => void;
  onDelete?: (entity: TemplateEntity) => void;
}

export function TemplateCard({
  entity,
  onView,
  onEdit,
  onDelete,
}: TemplateCardProps) {
  const handleView = () => onView?.(entity);
  const handleEdit = () => onEdit?.(entity);
  const handleDelete = () => onDelete?.(entity);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "default";
      case "active":
        return "blue";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

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

  return (
    <FadeIn>
      <AppCard
        hoverable
        actions={[
          <AppButton key="view" type="text" onClick={handleView}>
            View
          </AppButton>,
          <AppButton key="edit" type="text" onClick={handleEdit}>
            Edit
          </AppButton>,
          <AppButton key="delete" type="text" danger onClick={handleDelete}>
            Delete
          </AppButton>,
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
              {entity.name}
            </Title>
            <AppTag color={getStatusColor(entity.status)}>
              {entity.status.toUpperCase()}
            </AppTag>
          </div>

          {entity.description && (
            <Text type="secondary" style={{ fontSize: "14px" }}>
              {entity.description}
            </Text>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <AppSpace wrap>
            <AppTag color={getPriorityColor(entity.priority)}>
              {entity.priority.toUpperCase()}
            </AppTag>
            {entity.assignedTo && (
              <AppTag color="purple">{entity.assignedTo}</AppTag>
            )}
            {entity.projectId && (
              <AppTag color="cyan">Project: {entity.projectId}</AppTag>
            )}
          </AppSpace>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="secondary">
            Created: {new Date(entity.createdAt).toLocaleDateString()}
          </Text>
          <Text type="secondary">
            Updated: {new Date(entity.updatedAt).toLocaleDateString()}
          </Text>
        </div>
      </AppCard>
    </FadeIn>
  );
}

