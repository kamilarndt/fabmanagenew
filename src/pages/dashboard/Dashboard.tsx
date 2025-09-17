import * as React from "react";
import { useMemo } from "react";
import { Button } from "@/new-ui/atoms/Button/Button";
import { Card } from "@/new-ui/molecules/Card/Card";
import { PageHeader } from "../../components/shared/PageHeader";
import { Toolbar } from "../../components/Ui/Toolbar";
import { usePerformanceMonitor } from "../../lib/performance-monitor";
import { useProjectsStore } from "../../stores/projectsStore";
import { useTasksStore } from "../../stores/tasksStore";

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
      <Card className="tw-h-full">
        <div className="tw-flex tw-justify-between tw-items-center tw-p-6 tw-pb-4">
          <h3 className="tw-text-lg tw-font-semibold">{title}</h3>
        </div>
        <div className="tw-px-6 tw-pb-6">
          <div className="tw-text-center">
            <div className="tw-text-3xl tw-font-bold" style={{ color }}>
              {value}
            </div>
            <div className="tw-text-sm tw-text-muted-foreground">
              {title.includes("Projekt") ? "" : "zadań"}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderProjectTimeline = () => {
    measureComponentRender("ProjectTimeline", () => {});
    return (
      <Card className="tw-h-full">
        <div className="tw-p-6 tw-pb-4">
          <h3 className="tw-text-lg tw-font-semibold">Timeline Projektów</h3>
        </div>
        <div className="tw-px-6 tw-pb-6">
          <div className="tw-space-y-4">
            {projectTimeline.map((project, index) => (
              <div key={index} className="tw-border-b tw-pb-3 last:tw-border-b-0">
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
                  <h4 className="tw-font-medium tw-text-sm">{project.name}</h4>
                  <span className="tw-inline-flex tw-items-center tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium tw-bg-blue-100 tw-text-blue-800">
                    {project.startMonth} - {project.endMonth}
                  </span>
                </div>
                <div className="tw-w-full tw-bg-gray-200 tw-rounded-full tw-h-2">
                  <div
                    className="tw-bg-blue-600 tw-h-2 tw-rounded-full tw-transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="tw-text-xs tw-text-muted-foreground tw-mt-1">
                  {project.progress}% ukończone
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  const renderRecentActivities = () => {
    measureComponentRender("RecentActivities", () => {});
    return (
      <Card className="tw-h-full">
        <div className="tw-p-6 tw-pb-4">
          <h3 className="tw-text-lg tw-font-semibold">Ostatnie Aktywności</h3>
        </div>
        <div className="tw-px-6 tw-pb-6">
          <div className="tw-space-y-3">
            {recentActivities.map((item, index) => (
              <div key={index} className="tw-flex tw-items-start tw-space-x-3">
                <div className="tw-flex-1">
                  <h4 className="tw-font-medium tw-text-sm">{item.title}</h4>
                  <p className="tw-text-sm tw-text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="tw-text-xs tw-text-muted-foreground tw-mt-1">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  const renderTaskList = () => {
    measureComponentRender("TaskList", () => {});
    return (
      <Card className="tw-h-full">
        <div className="tw-p-6 tw-pb-4">
          <h3 className="tw-text-lg tw-font-semibold">Zadania do Wykonania</h3>
        </div>
        <div className="tw-px-6 tw-pb-6">
          <div className="tw-space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="tw-flex tw-items-center tw-justify-between tw-p-3 tw-border tw-rounded-lg">
                <div className="tw-flex-1">
                  <h4 className={`tw-font-medium tw-text-sm ${task.completed ? "tw-line-through tw-text-gray-500" : ""}`}>
                    {task.title}
                  </h4>
                  <p className="tw-text-sm tw-text-muted-foreground">
                    {task.title}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed ? "Cofnij" : "Ukończ"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="tw-p-6">
      <PageHeader
        title="Dashboard"
        subtitle="Przegląd projektów i zadań"
      />

      <Toolbar />

      {/* KPI Cards */}
      <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-4 tw-mb-6">
        <div>
          {renderKPICard("Aktywne Projekty", activeProjects, "#1890ff")}
        </div>
        <div>
          {renderKPICard("Zaległe Zadania", overdueTasks, "#ff4d4f")}
        </div>
        <div>
          {renderKPICard("Nowe Zapytania", newInquiries, "#52c41a")}
        </div>
      </div>

      {/* Main Content */}
      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4">
        <div>
          {renderProjectTimeline()}
        </div>
        <div>
          {renderRecentActivities()}
        </div>
      </div>

      {/* Task List */}
      <div className="tw-mt-6">
        {renderTaskList()}
      </div>
    </div>
  );
}
