import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Row, Space } from "antd";
import { PageHeader } from "../../../components/shared/PageHeader";
import type { Material } from "../types";
import { MaterialCard } from "./MaterialCard";

interface MaterialListProps {
  materials: Material[];
  loading?: boolean;
  onViewMaterial?: (material: Material) => void;
  onEditMaterial?: (material: Material) => void;
  onAddMaterial?: () => void;
  onStockUpdate?: (material: Material) => void;
}

export function MaterialList({
  materials,
  loading = false,
  onViewMaterial,
  onEditMaterial,
  onAddMaterial,
  onStockUpdate,
}: MaterialListProps) {
  if (materials.length === 0 && !loading) {
    return (
      <div>
        <PageHeader
          title="Materials"
          subtitle="Manage your materials and inventory"
          actions={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddMaterial}
            >
              Add Material
            </Button>
          }
        />
        <Empty
          description="No materials found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddMaterial}
          >
            Add your first material
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Materials"
        subtitle={`${materials.length} material${
          materials.length !== 1 ? "s" : ""
        } in inventory`}
        actions={
          <Space>
            <Button icon={<PlusOutlined />} onClick={onAddMaterial}>
              Add Material
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        {materials.map((material) => (
          <Col key={material.id} xs={24} sm={12} lg={8} xl={6}>
            <MaterialCard
              material={material}
              onView={onViewMaterial}
              onEdit={onEditMaterial}
              onStockUpdate={onStockUpdate}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
