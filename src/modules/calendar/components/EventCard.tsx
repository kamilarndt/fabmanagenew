import { ClockCircleOutlined } from "@ant-design/icons";
import { Badge, Typography } from "antd";
import type { BaseEntity } from "../../../components/shared/BaseCard";
import { BaseCard } from "../../../components/shared/BaseCard";
import type { CalendarEvent } from "../types";

const { Text } = Typography;

interface EventCardProps {
  event: CalendarEvent;
  onView?: (event: CalendarEvent) => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
}

export function EventCard({ event, onView, onEdit, onDelete }: EventCardProps) {
  // Helper function for future use
  // const getTypeColor = (type: string) => {
  //   switch (type) {
  //     case "project":
  //       return "blue";
  //     case "meeting":
  //       return "green";
  //     case "deadline":
  //       return "red";
  //     case "production":
  //       return "orange";
  //     case "maintenance":
  //       return "purple";
  //     default:
  //       return "default";
  //   }
  // };

  const getPriorityColor = (priority?: string) => {
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "scheduled":
        return "blue";
      case "in_progress":
        return "orange";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const isOverdue =
    new Date(event.end) < new Date() && event.status !== "completed";

  // Convert CalendarEvent to BaseEntity format
  const baseEntity: BaseEntity = {
    id: event.id,
    name: event.title,
    description: event.description,
    status: event.status || "scheduled",
    priority: event.priority,
    assignedTo: event.assignedTo,
    projectId: event.projectId,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };

  const customFields = (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <ClockCircleOutlined style={{ marginRight: 8 }} />
        <Text strong>
          {new Date(event.start).toLocaleDateString()} -{" "}
          {new Date(event.end).toLocaleDateString()}
        </Text>
      </div>
      {event.allDay && <Text type="secondary">All day event</Text>}
      {isOverdue && (
        <div style={{ marginTop: 8 }}>
          <Badge status="error" text="Overdue" />
        </div>
      )}
    </div>
  );

  // Create adapters to convert BaseEntity back to CalendarEvent
  const handleView = (_entity: BaseEntity) => {
    onView?.(event);
  };

  const handleEdit = (_entity: BaseEntity) => {
    onEdit?.(event);
  };

  const handleDelete = (_entity: BaseEntity) => {
    onDelete?.(event);
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
    />
  );
}
