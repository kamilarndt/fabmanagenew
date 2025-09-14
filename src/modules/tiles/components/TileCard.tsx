import { EditOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Space, Tag, Typography } from "antd";
import { FadeIn } from "../../../components/ui/FadeIn";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Tile } from "../types";

const { Text, Title } = Typography;

interface TileCardProps {
  tile: Tile;
  onView?: (tile: Tile) => void;
  onEdit?: (tile: Tile) => void;
  onStatusChange?: (tile: Tile, status: string) => void;
}

export function TileCard({
  tile,
  onView,
  onEdit,
  onStatusChange,
}: TileCardProps) {
  const handleView = () => onView?.(tile);
  const handleEdit = () => onEdit?.(tile);

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

  const isOverdue = tile.deadline
    ? new Date(tile.deadline) < new Date() && tile.status !== "ready_assembly"
    : false;

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
              {tile.name}
            </Title>
            <StatusBadge status={tile.status} />
          </div>

          {tile.notes && (
            <Text type="secondary" style={{ fontSize: "14px" }}>
              {tile.notes}
            </Text>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Tag color="blue">Project: {tile.projectId}</Tag>
            {tile.material && <Tag color="green">{tile.material}</Tag>}
            {tile.priority && (
              <Tag color={getPriorityColor(tile.priority)}>
                {tile.priority.toUpperCase()}
              </Tag>
            )}
            {tile.assignedTo && (
              <Tag icon={<UserOutlined />} color="purple">
                {tile.assignedTo}
              </Tag>
            )}
          </Space>
        </div>

        {tile.dimensions && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>Dimensions: </Text>
            <Text type="secondary">
              {tile.dimensions.width} × {tile.dimensions.height} ×{" "}
              {tile.dimensions.depth} mm
            </Text>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text strong>Quantity: {tile.quantity || 1}</Text>
            {tile.deadline && (
              <Text
                type={isOverdue ? "danger" : "secondary"}
                style={{ fontWeight: isOverdue ? "bold" : "normal" }}
              >
                Due: {new Date(tile.deadline).toLocaleDateString()}
              </Text>
            )}
          </div>
          {isOverdue && (
            <div style={{ marginTop: 8, color: "#ff4d4f" }}>
              <Badge status="error" text="Overdue" />
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="secondary">
            Created: {new Date(tile.createdAt).toLocaleDateString()}
          </Text>
          <Button
            size="small"
            onClick={() => onStatusChange?.(tile, "approved")}
          >
            Approve
          </Button>
        </div>
      </Card>
    </FadeIn>
  );
}
