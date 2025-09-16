import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Card, Space, Tag, Typography } from "antd";

const { Text, Title } = Typography;

interface TileCardProps {
  tile: any;
  onView?: (tile: any) => void;
  onEdit?: (tile: any) => void;
  onDelete?: (tile: any) => void;
  onAssign?: (tile: any) => void;
}

export default function TileCard({
  tile,
  onView,
  onEdit,
  onDelete,
}: TileCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "blue";
      case "in_progress":
        return "green";
      case "waiting_for_approval":
        return "orange";
      case "approved":
        return "cyan";
      case "in_production":
        return "red";
      case "completed":
        return "green";
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
    <Card
      title={<Title level={4}>{tile.name}</Title>}
      extra={
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onView?.(tile)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(tile)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => onDelete?.(tile)}
          />
        </Space>
      }
    >
      <div style={{ marginBottom: 8 }}>
        <Tag color={getStatusColor(tile.status)}>{tile.status}</Tag>
        <Tag color={getPriorityColor(tile.priority)}>{tile.priority}</Tag>
      </div>
      {tile.description && <Text type="secondary">{tile.description}</Text>}
    </Card>
  );
}
