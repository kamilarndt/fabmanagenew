import { EditOutlined, EyeOutlined, WarningOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Space, Tag, Typography } from "antd";
import { FadeIn } from "../../../components/ui/FadeIn";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Material } from "../types";

const { Text, Title } = Typography;

interface MaterialCardProps {
  material: Material;
  onView?: (material: Material) => void;
  onEdit?: (material: Material) => void;
  onStockUpdate?: (material: Material) => void;
}

export function MaterialCard({
  material,
  onView,
  onEdit,
  onStockUpdate,
}: MaterialCardProps) {
  const handleView = () => onView?.(material);
  const handleEdit = () => onEdit?.(material);
  const handleStockUpdate = () => onStockUpdate?.(material);

  const getStockStatus = () => {
    if (material.stock === 0) return { status: "error", text: "Out of Stock" };
    if (material.stock <= material.minStock)
      return { status: "warning", text: "Low Stock" };
    if (material.stock >= material.maxStock)
      return { status: "success", text: "High Stock" };
    return { status: "default", text: "Normal" };
  };

  const stockStatus = getStockStatus();

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
              {material.name}
            </Title>
            <StatusBadge status={material.isActive ? "active" : "inactive"} />
          </div>

          {material.description && (
            <Text type="secondary" style={{ fontSize: "14px" }}>
              {material.description}
            </Text>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Tag color="blue">{material.category}</Tag>
            {material.supplier && <Tag color="green">{material.supplier}</Tag>}
            {material.location && <Tag color="purple">{material.location}</Tag>}
          </Space>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text strong>Stock Level:</Text>
            <Badge status={stockStatus.status as any} text={stockStatus.text} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>
              Current: {material.stock} {material.unit}
            </Text>
            <Text type="secondary">Min: {material.minStock}</Text>
          </div>
          {material.stock <= material.minStock && (
            <div style={{ marginTop: 8, color: "#ff4d4f" }}>
              <WarningOutlined /> Low stock warning
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
          <Text strong>Price: ${material.price.toFixed(2)}</Text>
          <Button size="small" onClick={handleStockUpdate}>
            Update Stock
          </Button>
        </div>
      </Card>
    </FadeIn>
  );
}
