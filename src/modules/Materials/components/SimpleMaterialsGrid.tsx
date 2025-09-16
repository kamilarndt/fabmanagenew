import { Col, Empty, Row, Spin } from "antd";
import React from "react";
import type { MaterialItem } from "../../../hooks/useMaterialsQuery";
import { MaterialCardV3 } from "./MaterialCardV3";

interface SimpleMaterialsGridProps {
  materials: MaterialItem[];
  loading?: boolean;
  onMaterialSelect?: (material: MaterialItem) => void;
  onQuickOrder?: (material: MaterialItem) => void;
  onAddToProject?: (material: MaterialItem) => void;
  selectedIds?: string[];
}

export const SimpleMaterialsGrid: React.FC<SimpleMaterialsGridProps> = ({
  materials,
  loading = false,
  onMaterialSelect,
  onQuickOrder,
  onAddToProject,
  selectedIds = [],
}) => {
  // Loading state
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Empty state
  if (materials.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Empty
          description="Brak materiałów spełniających kryteria"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {materials.map((material) => {
        const isSelected = selectedIds.includes(material.id);

        return (
          <Col key={material.id} xs={24} sm={12} md={8} lg={6} xl={4}>
            <MaterialCardV3
              material={material}
              selected={isSelected}
              onSelect={onMaterialSelect}
              onQuickOrder={onQuickOrder}
              onAddToProject={onAddToProject}
            />
          </Col>
        );
      })}
    </Row>
  );
};
