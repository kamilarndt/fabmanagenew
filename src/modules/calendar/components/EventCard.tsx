import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Space, Tag, Typography } from "antd";
import { FadeIn } from "../../../components/ui/FadeIn";
import type { CalendarEvent } from "../types";

const { Text, Title } = Typography;

interface EventCardProps {
  event: CalendarEvent;
  onView?: (event: CalendarEvent) => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
}

export function EventCard({ event, onView, onEdit, onDelete }: EventCardProps) {
  const handleView = () => onView?.(event);
  const handleEdit = () => onEdit?.(event);
  const handleDelete = () => onDelete?.(event);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "project":
        return "blue";
      case "meeting":
        return "green";
      case "deadline":
        return "red";
      case "production":
        return "orange";
      case "maintenance":
        return "purple";
      default:
        return "default";
    }
  };

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

  return (
    <FadeIn>
      <Card
        hoverable
        actions={[
          <Button key="view" type="text" onClick={handleView}>
            View
          </Button>,
          <Button key="edit" type="text" onClick={handleEdit}>
            Edit
          </Button>,
          <Button key="delete" type="text" danger onClick={handleDelete}>
            Delete
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
              {event.title}
            </Title>
            <Tag color={getTypeColor(event.type)}>
              {event.type.toUpperCase()}
            </Tag>
          </div>

          {event.description && (
            <Text type="secondary" style={{ fontSize: "14px" }}>
              {event.description}
            </Text>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Tag color={getPriorityColor(event.priority)}>
              {event.priority?.toUpperCase() || "NORMAL"}
            </Tag>
            {event.status && (
              <Tag color={getStatusColor(event.status)}>
                {event.status.replace("_", " ").toUpperCase()}
              </Tag>
            )}
            {event.assignedTo && (
              <Tag icon={<UserOutlined />} color="purple">
                {event.assignedTo}
              </Tag>
            )}
            {event.location && <Tag color="cyan">{event.location}</Tag>}
          </Space>
        </div>

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
        </div>

        {isOverdue && (
          <div style={{ marginBottom: 16 }}>
            <Badge status="error" text="Overdue" />
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="secondary">
            Created: {new Date(event.createdAt).toLocaleDateString()}
          </Text>
          {event.projectId && (
            <Text type="secondary">Project: {event.projectId}</Text>
          )}
        </div>
      </Card>
    </FadeIn>
  );
}
