import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { FadeIn } from "../ui/FadeIn";
import type { BaseEntity } from "./BaseCard";

const { Title } = Typography;

interface BaseStatsProps {
  entities: BaseEntity[];
  title?: string;
  getStatusFromEntity?: (entity: BaseEntity) => string;
  getPriorityFromEntity?: (entity: BaseEntity) => string;
  getTypeFromEntity?: (entity: BaseEntity) => string;
  customStats?: Array<{
    title: string;
    value: number;
    color?: string;
    icon?: React.ReactNode;
  }>;
}

export function BaseStats({
  entities,
  title = "Overview",
  getStatusFromEntity = (entity) => entity.status,
  getPriorityFromEntity = (entity) => entity.priority || "medium",
  // getTypeFromEntity = (entity) => (entity as any).type || "default",
  customStats = [],
}: BaseStatsProps) {
  const total = entities.length;
  const active = entities.filter(
    (e) =>
      getStatusFromEntity(e) === "active" ||
      getStatusFromEntity(e) === "in_progress"
  ).length;
  const completed = entities.filter(
    (e) => getStatusFromEntity(e) === "completed"
  ).length;
  const urgent = entities.filter(
    (e) => getPriorityFromEntity(e) === "urgent"
  ).length;

  // Note: byType and byPriority are calculated but not currently displayed
  // They can be used for future enhancements or custom stats

  return (
    <FadeIn>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          {title}
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total"
                value={total}
                prefix={<SettingOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active"
                value={active}
                valueStyle={{ color: "#1890ff" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Completed"
                value={completed}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Urgent"
                value={urgent}
                valueStyle={{ color: "#ff4d4f" }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          {customStats.map((stat, index) => (
            <Col key={index} xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ color: stat.color }}
                  prefix={stat.icon}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </FadeIn>
  );
}
