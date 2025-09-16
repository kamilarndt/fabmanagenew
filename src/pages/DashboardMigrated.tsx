import { Col, List, Progress, Row, Statistic, Tag } from "antd";
import * as React from "react";
import { useMemo } from "react";
import { Button, Card } from "../bridge-ui";
import { FeedbackButton } from "../components/UserFeedback";
import { PageHeader } from "../components/shared/PageHeader";
import { Toolbar } from "../components/ui/Toolbar";
import { usePerformanceMonitor } from "../lib/performance-monitor";
import { useProjectsStore } from "../stores/projectsStore";
import { useTasksStore } from "../stores/tasksStore";

export default function DashboardMigrated() {
  const { projects } = useProjectsStore();
  const tasks = useTasksStore((s) => s.tasks);
  const toggleTask = useTasksStore((s) => s.toggleTask);
  const { measureComponentRender, measurePageLoad } = usePerformanceMonitor();

  // Measure page load
  React.useEffect(() => {
    measurePageLoad("DashboardMigrated");
  }, [measurePageLoad]);

  // KPI calculations
  const activeProjects = projects.filter(
    (p) => p.status === "W realizacji"
  ).length;
  const overdueTasks = useMemo(
    () => tasks.filter((t) => t.overdue && !t.completed).length,
    [tasks]
  );
  const newInquiries = 2; // Mock data

  // Project timeline data
  const projectTimeline = [
    {
      name: "Smart Kids Planet",
      startMonth: "Grudzień",
      endMonth: "Styczeń",
      progress: 75,
      color: "bg-primary",
    },
    {
      name: "Stoisko GR8 TECH - Londyn 2025",
      startMonth: "Styczeń",
      endMonth: "Luty",
      progress: 45,
      color: "bg-success",
    },
    {
      name: "Studio TV - Les 12 Coups de Midi",
      startMonth: "Styczeń",
      endMonth: "Marzec",
      progress: 30,
      color: "bg-warning",
    },
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      title: "Nowy projekt: Smart Kids Planet",
      description: "Projekt został utworzony i przypisany do zespołu",
      time: "2 godziny temu",
      type: "project",
    },
    {
      id: 2,
      title: "Zadanie ukończone: Projektowanie logo",
      description: "Logo dla projektu GR8 TECH zostało zaakceptowane",
      time: "4 godziny temu",
      type: "task",
    },
    {
      id: 3,
      title: "Nowe zapytanie od klienta",
      description: "Otrzymano zapytanie o wycenę projektu muzealnego",
      time: "6 godzin temu",
      type: "inquiry",
    },
  ];

  const renderKPICard = (title: string, value: number, color: string) => {
    measureComponentRender(`KPICard-${title}`, () => {});
    return (
      <Card
        title={title}
        className="tw-h-full"
        extra={<FeedbackButton page="Dashboard-KPI" />}
      >
        <Statistic
          value={value}
          valueStyle={{ color }}
          suffix={title.includes("Projekt") ? "" : "zadań"}
        />
      </Card>
    );
  };

  const renderProjectTimeline = () => {
    measureComponentRender("ProjectTimeline", () => {});
    return (
      <Card title="Timeline Projektów" className="tw-h-full">
        <div className="tw-space-y-4">
          {projectTimeline.map((project, index) => (
            <div key={index} className="tw-border-b tw-pb-3 last:tw-border-b-0">
              <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
                <h4 className="tw-font-medium tw-text-sm">{project.name}</h4>
                <Tag color="blue">
                  {project.startMonth} - {project.endMonth}
                </Tag>
              </div>
              <Progress
                percent={project.progress}
                strokeColor="#1890ff"
                size="small"
              />
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderRecentActivities = () => {
    measureComponentRender("RecentActivities", () => {});
    return (
      <Card title="Ostatnie Aktywności" className="tw-h-full">
        <List
          dataSource={recentActivities}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={
                  <div>
                    <p className="tw-text-sm tw-text-gray-600">
                      {item.description}
                    </p>
                    <p className="tw-text-xs tw-text-gray-400">{item.time}</p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };

  const renderTaskList = () => {
    measureComponentRender("TaskList", () => {});
    return (
      <Card title="Zadania do Wykonania" className="tw-h-full">
        <List
          dataSource={tasks.slice(0, 5)}
          renderItem={(task) => (
            <List.Item
              actions={[
                <Button
                  key="toggle"
                  size="small"
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed ? "Cofnij" : "Ukończ"}
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span
                    className={
                      task.completed ? "tw-line-through tw-text-gray-500" : ""
                    }
                  >
                    {task.title}
                  </span>
                }
                description={task.title}
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };

  return (
    <div className="tw-p-6">
      <PageHeader
        title="Dashboard"
        subtitle="Przegląd projektów i zadań"
        extra={<FeedbackButton page="Dashboard" />}
      />

      <Toolbar />

      {/* KPI Cards */}
      <Row gutter={[16, 16]} className="tw-mb-6">
        <Col xs={24} sm={8}>
          {renderKPICard("Aktywne Projekty", activeProjects, "#1890ff")}
        </Col>
        <Col xs={24} sm={8}>
          {renderKPICard("Zaległe Zadania", overdueTasks, "#ff4d4f")}
        </Col>
        <Col xs={24} sm={8}>
          {renderKPICard("Nowe Zapytania", newInquiries, "#52c41a")}
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          {renderProjectTimeline()}
        </Col>
        <Col xs={24} lg={12}>
          {renderRecentActivities()}
        </Col>
      </Row>

      {/* Task List */}
      <Row gutter={[16, 16]} className="tw-mt-6">
        <Col xs={24}>{renderTaskList()}</Col>
      </Row>
    </div>
  );
}
