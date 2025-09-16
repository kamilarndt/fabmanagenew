import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Button, Card, Progress, Space, Tag, Typography } from "antd";
import { FadeIn } from "../../../components/ui/FadeIn";
import type { CNCTask } from "../types";

const { Text, Title } = Typography;

interface CNCTaskCardProps {
  task: CNCTask;
  onStart?: (task: CNCTask) => void;
  onPause?: (task: CNCTask) => void;
  onComplete?: (task: CNCTask) => void;
  onView?: (task: CNCTask) => void;
}

export function CNCTaskCard({
  task,
  onStart,
  onPause,
  onComplete,
  onView,
}: CNCTaskCardProps) {
  const handleStart = () => onStart?.(task);
  const handlePause = () => onPause?.(task);
  const handleComplete = () => onComplete?.(task);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "queued":
        return "blue";
      case "in_progress":
        return "orange";
      case "completed":
        return "green";
      case "paused":
        return "yellow";
      case "failed":
        return "red";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "queued":
        return <PlayCircleOutlined />;
      case "in_progress":
        return <PlayCircleOutlined />;
      case "completed":
        return <CheckCircleOutlined />;
      case "paused":
        return <PauseCircleOutlined />;
      case "failed":
        return <ExclamationCircleOutlined />;
      default:
        return null;
    }
  };

  const progress = task.actualDuration
    ? Math.round((task.actualDuration / task.estimatedDuration) * 100)
    : 0;

  return (
    <FadeIn>
      <Card
        hoverable
        actions={[
          <Button key="view" type="text" onClick={() => onView?.(task)}>
            View
          </Button>,
          ...(task.status === "queued" || task.status === "paused"
            ? [
                <Button
                  key="start"
                  type="text"
                  icon={<PlayCircleOutlined />}
                  onClick={handleStart}
                >
                  Start
                </Button>,
              ]
            : []),
          ...(task.status === "in_progress"
            ? [
                <Button
                  key="pause"
                  type="text"
                  icon={<PauseCircleOutlined />}
                  onClick={handlePause}
                >
                  Pause
                </Button>,
                <Button
                  key="complete"
                  type="text"
                  icon={<CheckCircleOutlined />}
                  onClick={handleComplete}
                >
                  Complete
                </Button>,
              ]
            : []),
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
              {task.tileName}
            </Title>
            <Tag
              color={getStatusColor(task.status)}
              icon={getStatusIcon(task.status)}
            >
              {task.status.replace("_", " ").toUpperCase()}
            </Tag>
          </div>

          <Text type="secondary" style={{ fontSize: "14px" }}>
            Project: {task.projectId}
          </Text>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Tag color={getPriorityColor(task.priority)}>
              {task.priority.toUpperCase()}
            </Tag>
            <Tag color="blue">{task.material}</Tag>
            {task.assignedTo && <Tag color="purple">{task.assignedTo}</Tag>}
            {task.tooling && <Tag color="cyan">{task.tooling}</Tag>}
          </Space>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Dimensions: </Text>
          <Text type="secondary">
            {task.dimensions.width} × {task.dimensions.height} ×{" "}
            {task.dimensions.depth} mm
          </Text>
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
            <Text strong>Progress</Text>
            <Text type="secondary">
              {task.actualDuration || 0} / {task.estimatedDuration} min
            </Text>
          </div>
          <Progress
            percent={Math.min(progress, 100)}
            status={task.status === "failed" ? "exception" : "active"}
            showInfo={false}
          />
        </div>

        {task.errors && task.errors.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Text type="danger" strong>
              Errors: {task.errors.length}
            </Text>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="secondary">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </Text>
          {task.startedAt && (
            <Text type="secondary">
              Started: {new Date(task.startedAt).toLocaleDateString()}
            </Text>
          )}
        </div>
      </Card>
    </FadeIn>
  );
}
