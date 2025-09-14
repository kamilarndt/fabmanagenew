import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { FadeIn } from "../../../components/ui/FadeIn";
import type { Project, ProjectStats } from "../types";

const { Title } = Typography;

interface ProjectStatsProps {
  projects: Project[];
}

export function ProjectStats({ projects }: ProjectStatsProps) {
  const stats: ProjectStats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: projects.filter((p) => p.status === "completed").length,
    onHold: projects.filter((p) => p.status === "on_hold").length,
    cancelled: projects.filter((p) => p.status === "cancelled").length,
  };

  return (
    <FadeIn>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          Project Overview
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Projects"
                value={stats.total}
                prefix={<CheckCircleOutlined />}
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
                title="On Hold"
                value={stats.onHold}
                valueStyle={{ color: "#faad14" }}
                prefix={<PauseCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </FadeIn>
  );
}
