import { Typography } from "antd";
import React from "react";
import { AppButton, AppCard, AppSpace, AppTag } from "../ui";
import { FadeIn } from "../ui/FadeIn";

const { Text, Title } = Typography;

export interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority?: string;
  assignedTo?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

interface BaseCardProps {
  entity: BaseEntity;
  onView?: (entity: BaseEntity) => void;
  onEdit?: (entity: BaseEntity) => void;
  onDelete?: (entity: BaseEntity) => void;
  statusColorMap?: (status: string) => string;
  priorityColorMap?: (priority: string) => string;
  customFields?: React.ReactNode;
  actions?: React.ReactNode[];
}

export function BaseCard({
  entity,
  onView,
  onEdit,
  onDelete,
  statusColorMap,
  priorityColorMap,
  customFields,
  actions,
}: BaseCardProps) {
  const handleView = () => onView?.(entity);
  const handleEdit = () => onEdit?.(entity);
  const handleDelete = () => onDelete?.(entity);

  const getStatusColor = (status: string) => {
    if (statusColorMap) return statusColorMap(status);

    switch (status) {
      case "draft":
      case "queued":
        return "default";
      case "active":
      case "in_progress":
        return "blue";
      case "completed":
      case "ready_assembly":
        return "green";
      case "cancelled":
      case "failed":
        return "red";
      case "pending_approval":
        return "orange";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    if (priorityColorMap) return priorityColorMap(priority);

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

  const defaultActions = [
    <AppButton key="view" type="text" onClick={handleView}>
      View
    </AppButton>,
    <AppButton key="edit" type="text" onClick={handleEdit}>
      Edit
    </AppButton>,
    <AppButton key="delete" type="text" danger onClick={handleDelete}>
      Delete
    </AppButton>,
  ];

  return (
    <FadeIn>
      <AppCard
        hoverable
        actions={actions || defaultActions}
        style={{ height: "100%", cursor: "pointer" }}
        onClick={handleView}
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
              {entity.status.replace("_", " ").toUpperCase()}
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
            {entity.priority && (
              <AppTag color={getPriorityColor(entity.priority)}>
                {entity.priority.toUpperCase()}
              </AppTag>
            )}
            {entity.assignedTo && (
              <AppTag color="purple">{entity.assignedTo}</AppTag>
            )}
            {entity.projectId && (
              <AppTag color="cyan">Project: {entity.projectId}</AppTag>
            )}
          </AppSpace>
        </div>

        {customFields}

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
