import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Tag,
  message,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
// Frappe Gantt is loaded via CDN in index.html
import { api } from "../../../lib/httpClient";
import type {
  FrappeGanttTask,
  GanttTask,
  GanttTaskPriority,
  GanttTaskStatus,
  GanttTaskType,
} from "../../../types/gantt.types";
import type { Tile } from "../../../types/tiles.types";

interface ProjectGanttChartProps {
  projectId: string;
  tiles: Tile[];
}

const TASK_TYPES: { value: GanttTaskType; label: string; color: string }[] = [
  { value: "projektowanie", label: "Projektowanie", color: "#1890ff" },
  { value: "wycinanie", label: "Wycinanie", color: "#52c41a" },
  { value: "produkcja", label: "Produkcja", color: "#fa8c16" },
];

const TASK_STATUSES: {
  value: GanttTaskStatus;
  label: string;
  color: string;
}[] = [
  { value: "planned", label: "Zaplanowane", color: "default" },
  { value: "in_progress", label: "W trakcie", color: "processing" },
  { value: "completed", label: "Zakończone", color: "success" },
  { value: "blocked", label: "Zablokowane", color: "error" },
];

const TASK_PRIORITIES: {
  value: GanttTaskPriority;
  label: string;
  color: string;
}[] = [
  { value: "low", label: "Niski", color: "default" },
  { value: "medium", label: "Średni", color: "processing" },
  { value: "high", label: "Wysoki", color: "warning" },
  { value: "urgent", label: "Pilny", color: "error" },
];

export default function ProjectGanttChart({
  projectId,
  tiles,
}: ProjectGanttChartProps) {
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<any>(null);
  const [tasks, setTasks] = useState<GanttTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"Day" | "Week" | "Month" | "Year">(
    "Week"
  );
  const [editingTask, setEditingTask] = useState<GanttTask | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Load tasks from API
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.call<GanttTask[]>(
        `/api/gantt-tasks?project_id=${projectId}`,
        {
          method: "GET",
          useSupabase: false,
        }
      );
      setTasks(response || []);
    } catch (error) {
      console.error("Failed to load gantt tasks:", error);
      const errorMessage = "Nie udało się załadować zadań harmonogramu";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Initialize Gantt chart
  const initializeGantt = useCallback(() => {
    if (!ganttRef.current) return;

    // Clear previous instance
    ganttRef.current.innerHTML = "";

    // Check if Frappe Gantt is loaded
    const GanttClass = (window as any).Gantt;
    if (!GanttClass) {
      console.error("Frappe Gantt not loaded from CDN");
      message.error(
        "Biblioteka harmonogramu nie została załadowana. Odśwież stronę."
      );
      return;
    }

    // Convert tasks to Frappe Gantt format
    const frappeTasks: FrappeGanttTask[] = tasks.map((task) => ({
      id: task.id,
      name: task.name,
      start: task.start_date,
      end: task.end_date,
      progress: task.progress,
      dependencies: task.dependencies,
      custom_class: `task-${task.task_type} task-${task.status} task-${task.priority}`,
    }));

    try {
      ganttInstance.current = new GanttClass(ganttRef.current, frappeTasks, {
        view_mode: viewMode,
        bar_height: 30,
        padding: 18,
        readonly: false,
        date_format: "YYYY-MM-DD",
        language: "pl",
        popup_on: "click",
        today_button: true,
        view_mode_select: true,
      });

      // Add custom CSS for task types (only once)
      if (!document.getElementById("gantt-custom-styles")) {
        const style = document.createElement("style");
        style.id = "gantt-custom-styles";
        style.innerHTML = `
                    .task-projektowanie { fill: #1890ff !important; }
                    .task-wycinanie { fill: #52c41a !important; }
                    .task-produkcja { fill: #fa8c16 !important; }
                    .task-completed { opacity: 0.7; }
                    .task-blocked { fill: #ff4d4f !important; }
                `;
        document.head.appendChild(style);
      }

      // Handle task updates
      ganttInstance.current.on("task-update", (task: any) => {
        updateTask(task.id, {
          start_date: task.start,
          end_date: task.end,
          progress: task.progress,
        });
      });

      setError(null);
    } catch (error) {
      console.error("Failed to initialize Gantt chart:", error);
      const errorMessage = "Nie udało się zainicjalizować harmonogramu";
      setError(errorMessage);
      message.error(errorMessage);
    }
  }, [tasks, viewMode]);

  // Create tasks for tiles
  const createTasksForTiles = async () => {
    setLoading(true);
    try {
      const tasksToCreate: any[] = [];

      for (const tile of tiles) {
        // Create 3 tasks for each tile
        const baseDate = new Date();
        const taskTypes: GanttTaskType[] = [
          "projektowanie",
          "wycinanie",
          "produkcja",
        ];

        taskTypes.forEach((taskType, index) => {
          const startDate = new Date(baseDate);
          startDate.setDate(startDate.getDate() + index * 2); // 2 days between tasks

          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1); // 1 day duration

          tasksToCreate.push({
            project_id: projectId,
            tile_id: tile.id,
            name: `${tile.name} - ${
              TASK_TYPES.find((t) => t.value === taskType)?.label
            }`,
            task_type: taskType,
            start_date: startDate.toISOString().slice(0, 10),
            end_date: endDate.toISOString().slice(0, 10),
            progress: 0,
            status: "planned",
            priority: "medium",
          });
        });
      }

      // Create all tasks
      for (const taskData of tasksToCreate) {
        await api.call<GanttTask>("/api/gantt-tasks", {
          method: "POST",
          data: taskData,
          useSupabase: false,
        });
      }

      message.success(`Utworzono ${tasksToCreate.length} zadań harmonogramu`);
      await loadTasks();
    } catch (error) {
      console.error("Failed to create tasks:", error);
      message.error("Nie udało się utworzyć zadań harmonogramu");
    } finally {
      setLoading(false);
    }
  };

  // Update task
  const updateTask = useCallback(
    async (taskId: string, updates: Partial<GanttTask>) => {
      try {
        await api.call<GanttTask>(`/api/gantt-tasks/${taskId}`, {
          method: "PUT",
          data: updates,
          useSupabase: false,
        });
        await loadTasks();
      } catch (error) {
        console.error("Failed to update task:", error);
        message.error("Nie udało się zaktualizować zadania");
      }
    },
    [loadTasks]
  );

  // Delete task (unused for now, but available for future use)
  // const deleteTask = async (taskId: string) => {
  //     try {
  //         await api.call(`/api/gantt-tasks/${taskId}`, {
  //             method: 'DELETE',
  //             useSupabase: false
  //         })
  //         await loadTasks()
  //         message.success('Zadanie zostało usunięte')
  //     } catch (error) {
  //         console.error('Failed to delete task:', error)
  //         message.error('Nie udało się usunąć zadania')
  //     }
  // }

  // Handle form submission
  const handleFormSubmit = async (values: any) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, values);
      } else {
        await api.call<GanttTask>("/api/gantt-tasks", {
          method: "POST",
          data: { ...values, project_id: projectId },
          useSupabase: false,
        });
        await loadTasks();
      }
      setIsModalVisible(false);
      setEditingTask(null);
      form.resetFields();
      message.success(
        editingTask
          ? "Zadanie zostało zaktualizowane"
          : "Zadanie zostało utworzone"
      );
    } catch (error) {
      console.error("Failed to save task:", error);
      message.error("Nie udało się zapisać zadania");
    }
  };

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Initialize Gantt when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      // Add small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initializeGantt();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [tasks, viewMode, initializeGantt]);

  return (
    <Card
      title="Harmonogram Projektu"
      extra={
        <Space>
          <Select
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: "Day", label: "Dzień" },
              { value: "Week", label: "Tydzień" },
              { value: "Month", label: "Miesiąc" },
              { value: "Year", label: "Rok" },
            ]}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingTask(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Dodaj Zadanie
          </Button>
          <Button onClick={createTasksForTiles} loading={loading}>
            Utwórz Zadania z Elementów
          </Button>
        </Space>
      }
    >
      {loading && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div>Ładowanie harmonogramu...</div>
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#ff4d4f" }}>
          <div>{error}</div>
          <Button onClick={loadTasks} style={{ marginTop: "1rem" }}>
            Spróbuj ponownie
          </Button>
        </div>
      )}

      {!loading && !error && (
        <div ref={ganttRef} style={{ width: "100%", minHeight: "400px" }} />
      )}

      {/* Task Edit Modal */}
      <Modal
        title={editingTask ? "Edytuj Zadanie" : "Nowe Zadanie"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTask(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={editingTask || undefined}
        >
          <Form.Item
            name="name"
            label="Nazwa zadania"
            rules={[{ required: true, message: "Nazwa jest wymagana" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="task_type"
            label="Typ zadania"
            rules={[{ required: true, message: "Typ zadania jest wymagany" }]}
          >
            <Select>
              {TASK_TYPES.map((type) => (
                <Select.Option key={type.value} value={type.value}>
                  <Tag color={type.color}>{type.label}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Status jest wymagany" }]}
          >
            <Select>
              {TASK_STATUSES.map((status) => (
                <Select.Option key={status.value} value={status.value}>
                  <Tag color={status.color}>{status.label}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priorytet"
            rules={[{ required: true, message: "Priorytet jest wymagany" }]}
          >
            <Select>
              {TASK_PRIORITIES.map((priority) => (
                <Select.Option key={priority.value} value={priority.value}>
                  <Tag color={priority.color}>{priority.label}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="start_date"
            label="Data rozpoczęcia"
            rules={[
              { required: true, message: "Data rozpoczęcia jest wymagana" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="Data zakończenia"
            rules={[
              { required: true, message: "Data zakończenia jest wymagana" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="progress" label="Postęp (%)">
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="estimated_hours" label="Szacowane godziny">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="assigned_to" label="Przypisane do">
            <Input />
          </Form.Item>

          <Form.Item name="notes" label="Notatki">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
