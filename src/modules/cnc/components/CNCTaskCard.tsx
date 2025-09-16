import {
  CheckCircleOutlined,
  // ExclamationCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";
import type { BaseEntity } from "../../../components/shared/BaseCard";
import { BaseCard } from "../../../components/shared/BaseCard";
import {
  AppButton,
  AppProgress,
  AppSpace,
  AppTag,
} from "../../../components/ui";
import type { CNCTask } from "../types";

const { Text } = Typography;

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

  // Helper function for future use
  // const getStatusIcon = (status: string) => {
  //   switch (status) {
  //     case "queued":
  //       return <PlayCircleOutlined />;
  //     case "in_progress":
  //       return <PlayCircleOutlined />;
  //     case "completed":
  //       return <CheckCircleOutlined />;
  //     case "paused":
  //       return <PauseCircleOutlined />;
  //     case "failed":
  //       return <ExclamationCircleOutlined />;
  //     default:
  //       return null;
  //   }
  // };

  const progress = task.actualDuration
    ? Math.round((task.actualDuration / task.estimatedDuration) * 100)
    : 0;

  // Convert CNCTask to BaseEntity format
  const baseEntity: BaseEntity = {
    id: task.id,
    name: task.tileName,
    description: `Project: ${task.projectId}`,
    status: task.status,
    priority: task.priority,
    assignedTo: task.assignedTo,
    projectId: task.projectId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };

  const customFields = (
    <div style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <AppSpace wrap>
          <AppTag color="blue">{task.material}</AppTag>
          {task.tooling && <AppTag color="cyan">{task.tooling}</AppTag>}
        </AppSpace>
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
        <AppProgress
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

      {task.startedAt && (
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Started: {new Date(task.startedAt).toLocaleDateString()}
          </Text>
        </div>
      )}
    </div>
  );

  const actions = [
    <AppButton key="view" type="text" onClick={() => onView?.(task)}>
      View
    </AppButton>,
    ...(task.status === "queued" || task.status === "paused"
      ? [
          <AppButton
            key="start"
            type="text"
            icon={<PlayCircleOutlined />}
            onClick={handleStart}
          >
            Start
          </AppButton>,
        ]
      : []),
    ...(task.status === "in_progress"
      ? [
          <AppButton
            key="pause"
            type="text"
            icon={<PauseCircleOutlined />}
            onClick={handlePause}
          >
            Pause
          </AppButton>,
          <AppButton
            key="complete"
            type="text"
            icon={<CheckCircleOutlined />}
            onClick={handleComplete}
          >
            Complete
          </AppButton>,
        ]
      : []),
  ];

  // Create adapters to convert BaseEntity back to CNCTask
  const handleView = (_entity: BaseEntity) => {
    onView?.(task);
  };

  return (
    <BaseCard
      entity={baseEntity}
      onView={handleView}
      onEdit={() => {}} // CNC tasks don't have edit action
      onDelete={() => {}} // CNC tasks don't have delete action
      statusColorMap={getStatusColor}
      priorityColorMap={getPriorityColor}
      customFields={customFields}
      actions={actions}
    />
  );
}
