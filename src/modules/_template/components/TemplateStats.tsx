import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { FadeIn } from "../../../components/ui/FadeIn";
import type { TemplateEntity, TemplateStats } from "../types";

const { Title } = Typography;

interface TemplateStatsProps {
  entities: TemplateEntity[];
}

export function TemplateStats({ entities }: TemplateStatsProps) {
  const stats: TemplateStats = {
    total: entities.length,
    active: entities.filter((e) => e.status === "active").length,
    completed: entities.filter((e) => e.status === "completed").length,
    overdue: entities.filter(
      (e) => e.status === "active" && e.priority === "urgent"
    ).length,
    byType: entities.reduce((acc, entity) => {
      const type = (entity as any).type || "default";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byPriority: entities.reduce((acc, entity) => {
      acc[entity.priority] = (acc[entity.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byCategory: entities.reduce((acc, entity) => {
      const category = entity.category || "default";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byAssignedTo: entities.reduce((acc, entity) => {
      const assignedTo = entity.assignedTo || "unassigned";
      acc[assignedTo] = (acc[assignedTo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    averageProgress:
      entities.reduce((sum, entity) => sum + (entity.progress || 0), 0) /
        entities.length || 0,
    totalEstimatedHours: entities.reduce(
      (sum, entity) => sum + (entity.estimatedHours || 0),
      0
    ),
    totalActualHours: entities.reduce(
      (sum, entity) => sum + (entity.actualHours || 0),
      0
    ),
  };

  return (
    <FadeIn>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          Template Overview
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Entities"
                value={stats.total}
                prefix={<SettingOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active"
                value={stats.active}
                valueStyle={{ color: "#1890ff" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Completed"
                value={stats.completed}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Urgent"
                value={stats.overdue || 0}
                valueStyle={{ color: "#ff4d4f" }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </FadeIn>
  );
}
