import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { FadeIn } from "../../../components/ui/FadeIn";
import type { CNCStats, CNCTask } from "../types";

const { Title } = Typography;

interface CNCStatsProps {
  tasks: CNCTask[];
}

export function CNCStats({ tasks }: CNCStatsProps) {
  const stats: CNCStats = {
    totalTasks: tasks.length,
    queued: tasks.filter((t) => t.status === "queued").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    paused: tasks.filter((t) => t.status === "paused").length,
    failed: tasks.filter((t) => t.status === "failed").length,
    averageCompletionTime:
      tasks
        .filter((t) => t.actualDuration)
        .reduce((sum, t) => sum + (t.actualDuration || 0), 0) /
      Math.max(tasks.filter((t) => t.actualDuration).length, 1),
    efficiency:
      tasks.length > 0
        ? Math.round(
            (tasks.filter((t) => t.status === "completed").length /
              tasks.length) *
              100
          )
        : 0,
  };

  return (
    <FadeIn>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          CNC Production Overview
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Tasks"
                value={stats.totalTasks}
                prefix={<SettingOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Queued"
                value={stats.queued}
                valueStyle={{ color: "#1890ff" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="In Progress"
                value={stats.inProgress}
                valueStyle={{ color: "#faad14" }}
                prefix={<PlayCircleOutlined />}
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
                title="Paused"
                value={stats.paused}
                valueStyle={{ color: "#faad14" }}
                prefix={<PauseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Failed"
                value={stats.failed}
                valueStyle={{ color: "#ff4d4f" }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Avg. Time (min)"
                value={Math.round(stats.averageCompletionTime)}
                valueStyle={{ color: "#13c2c2" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Efficiency"
                value={stats.efficiency}
                suffix="%"
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </FadeIn>
  );
}
