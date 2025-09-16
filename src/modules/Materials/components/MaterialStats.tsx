import {
  ExclamationCircleOutlined,
  InboxOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { FadeIn } from "../../../components/ui/FadeIn";
import type { Material, MaterialStats } from "../types";

const { Title } = Typography;

interface MaterialStatsProps {
  materials: Material[];
}

export function MaterialStats({ materials }: MaterialStatsProps) {
  const stats: MaterialStats = {
    totalMaterials: materials.length,
    lowStock: materials.filter((m) => m.stock <= m.minStock && m.stock > 0)
      .length,
    outOfStock: materials.filter((m) => m.stock === 0).length,
    totalValue: materials.reduce((sum, m) => sum + m.stock * m.price, 0),
    categories: new Set(materials.map((m) => m.category)).size,
  };

  return (
    <FadeIn>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          Inventory Overview
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Materials"
                value={stats.totalMaterials}
                prefix={<InboxOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Low Stock"
                value={stats.lowStock}
                valueStyle={{ color: "#faad14" }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Out of Stock"
                value={stats.outOfStock}
                valueStyle={{ color: "#ff4d4f" }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Value"
                value={stats.totalValue}
                precision={2}
                prefix="$"
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </FadeIn>
  );
}
