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
import type { Tile, TileStats } from "../types";

const { Title } = Typography;

interface TileStatsProps {
  tiles: Tile[];
}

export function TileStats({ tiles }: TileStatsProps) {
  const stats: TileStats = {
    total: tiles.length,
    designing: tiles.filter((t) => t.status === "designing").length,
    pendingApproval: tiles.filter((t) => t.status === "pending_approval")
      .length,
    approved: tiles.filter((t) => t.status === "approved").length,
    cncQueue: tiles.filter((t) => t.status === "cnc_queue").length,
    cncProduction: tiles.filter((t) => t.status === "cnc_production").length,
    readyAssembly: tiles.filter((t) => t.status === "ready_assembly").length,
    overdue: tiles.filter((t) => {
      if (!t.deadline) return false;
      return new Date(t.deadline) < new Date() && t.status !== "ready_assembly";
    }).length,
  };

  return (
    <FadeIn>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          Tile Production Overview
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Tiles"
                value={stats.total}
                prefix={<SettingOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Designing"
                value={stats.designing}
                valueStyle={{ color: "#1890ff" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Pending Approval"
                value={stats.pendingApproval}
                valueStyle={{ color: "#faad14" }}
                prefix={<PauseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Approved"
                value={stats.approved}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="CNC Queue"
                value={stats.cncQueue}
                valueStyle={{ color: "#722ed1" }}
                prefix={<SettingOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="CNC Production"
                value={stats.cncProduction}
                valueStyle={{ color: "#ff4d4f" }}
                prefix={<PlayCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Ready Assembly"
                value={stats.readyAssembly}
                valueStyle={{ color: "#13c2c2" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Overdue"
                value={stats.overdue}
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
