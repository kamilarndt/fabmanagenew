import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, Row, Space } from "antd";
import { PageHeader } from "../../../components/shared/PageHeader";
import type { CNCTask } from "../types";
import { CNCTaskCard } from "./CNCTaskCard";

interface CNCQueueProps {
  tasks: CNCTask[];
  loading?: boolean;
  onStartTask?: (task: CNCTask) => void;
  onPauseTask?: (task: CNCTask) => void;
  onCompleteTask?: (task: CNCTask) => void;
  onViewTask?: (task: CNCTask) => void;
  onAddTask?: () => void;
}

export function CNCQueue({
  tasks,
  loading = false,
  onStartTask,
  onPauseTask,
  onCompleteTask,
  onViewTask,
  onAddTask,
}: CNCQueueProps) {
  const getTasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  const statusColumns = [
    { key: "queued", title: "Queued", color: "blue" },
    { key: "in_progress", title: "In Progress", color: "orange" },
    { key: "paused", title: "Paused", color: "yellow" },
    { key: "completed", title: "Completed", color: "green" },
    { key: "failed", title: "Failed", color: "red" },
  ] as const;

  if (tasks.length === 0 && !loading) {
    return (
      <div>
        <PageHeader
          title="CNC Production Queue"
          subtitle="Manage CNC machining tasks and production workflow"
          actions={
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddTask}>
              Add Task
            </Button>
          }
        />
        <Empty
          description="No CNC tasks found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddTask}>
            Add your first CNC task
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="CNC Production Queue"
        subtitle={`${tasks.length} task${
          tasks.length !== 1 ? "s" : ""
        } in queue`}
        actions={
          <Space>
            <Button icon={<PlusOutlined />} onClick={onAddTask}>
              Add Task
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        {statusColumns.map((column) => {
          const columnTasks = getTasksByStatus(column.key);
          return (
            <Col key={column.key} xs={24} md={12} lg={8} xl={6}>
              <Card
                title={
                  <Space>
                    <span>{column.title}</span>
                    <span>({columnTasks.length})</span>
                  </Space>
                }
                style={{ height: "100%", minHeight: 600 }}
                bodyStyle={{ padding: 12 }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    minHeight: 500,
                  }}
                >
                  {columnTasks.map((task) => (
                    <CNCTaskCard
                      key={task.id}
                      task={task}
                      onStart={onStartTask}
                      onPause={onPauseTask}
                      onComplete={onCompleteTask}
                      onView={onViewTask}
                    />
                  ))}
                  {columnTasks.length === 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 200,
                        color: "#999",
                        border: "2px dashed #d9d9d9",
                        borderRadius: 6,
                      }}
                    >
                      No tasks in this status
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
