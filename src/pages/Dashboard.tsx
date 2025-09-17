import { useMemo } from "react";
import { Button } from "../new-ui/atoms/Button/Button";
import { Card } from "../new-ui/molecules/Card/Card";
import { Progress } from "../new-ui/atoms/Progress/Progress";
import { Tag } from "../new-ui/atoms/Tag/Tag";
import { List } from "../new-ui/molecules/List/List";
import { Statistic } from "../new-ui/atoms/Statistic/Statistic";
import { Grid } from "../new-ui/molecules/Grid/Grid";
import { PageHeader } from "../components/shared/PageHeader";
import { Toolbar } from "../components/ui/Toolbar";
import { useProjectsStore } from "../stores/projectsStore";
// import { useTilesStore } from '../stores/tilesStore' // Unused for now
import { useTasksStore } from "../stores/tasksStore";

// kept for possible future strict typing of dashboard-only tasks
// type DashboardTask = TaskItem

export default function Dashboard() {
  const { projects } = useProjectsStore();
  // const { tiles } = useTilesStore() // Unused for now
  const tasks = useTasksStore((s) => s.tasks);
  const toggleTask = useTasksStore((s) => s.toggleTask);

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
    {
      name: "Kawiarnia Nowa Oferta",
      startMonth: "Luty",
      endMonth: "Marzec",
      progress: 10,
      color: "bg-info",
    },
  ];

  // Recent activity
  const recentActivity = [
    {
      id: 1,
      action: "Nowy projekt utworzony",
      item: "Kawiarnia Nowa Oferta",
      time: "2 godziny temu",
      type: "success",
    },
    {
      id: 2,
      action: "Status zmieniony",
      item: "Panel recepcji - T-001",
      time: "4 godziny temu",
      type: "info",
    },
    {
      id: 3,
      action: "Zadanie ukończone",
      item: "Przygotowanie oferty cenowej",
      time: "6 godzin temu",
      type: "success",
    },
    {
      id: 4,
      action: "Materiał zamówiony",
      item: "MDF 18mm Surowy",
      time: "1 dzień temu",
      type: "warning",
    },
    {
      id: 5,
      action: "Klient dodany",
      item: "Studio Alpha",
      time: "2 dni temu",
      type: "info",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Przegląd głównych wskaźników i aktywności"
      />

      <Toolbar
        right={
          <div className="text-muted small">
            <i className="ri-time-line me-1"></i>
            Ostatnia aktualizacja: {new Date().toLocaleString("pl-PL")}
          </div>
        }
      />

      <Grid.Row gutter={[24, 24]} className="mb-4">
        <Grid.Col xs={24} md={8}>
          <Card className="border">
            <Statistic
              title="Aktywne Projekty"
              value={activeProjects}
              valueStyle={{ color: "var(--primary-main)" }}
              prefix={<i className="ri-briefcase-line" />}
            />
          </Card>
        </Grid.Col>
        <Grid.Col xs={24} md={8}>
          <Card className="border">
            <Statistic
              title="Zadania po Terminie"
              value={overdueTasks}
              valueStyle={{ color: "var(--accent-warning)" }}
              prefix={<i className="ri-time-line" />}
            />
          </Card>
        </Grid.Col>
        <Grid.Col xs={24} md={8}>
          <Card className="border">
            <Statistic
              title="Nowe Zapytania"
              value={newInquiries}
              valueStyle={{ color: "var(--primary-main)" }}
              prefix={<i className="ri-question-line" />}
            />
          </Card>
        </Grid.Col>
      </Grid.Row>

      <Grid.Row gutter={[24, 24]}>
        <Grid.Col xs={24} lg={12}>
          <Card
            title="Moje Zadania"
            extra={
              <Button size="sm" variant="primary">
                Dodaj
              </Button>
            }
            className="border"
          >
            <List
              dataSource={tasks}
              renderItem={(t) => (
                <List.Item
                  key={t.id}
                  className="border-none px-0"
                >
                  <div className="w-4 h-4 mr-3">
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTask(t.id)}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`${
                        t.completed ? "opacity-60 line-through" : ""
                      } text-primary`}
                    >
                      {t.title}
                    </div>
                    <div className="text-muted text-sm">
                      {t.project}
                    </div>
                    <div className="mt-1">
                      <Tag
                        variant={
                          t.overdue && !t.completed
                            ? "error"
                            : t.completed
                            ? "success"
                            : "default"
                        }
                      >
                        {t.deadline}
                      </Tag>
                      {t.overdue && !t.completed && (
                        <span className="ml-2 text-error text-sm">
                          Opóźnione
                        </span>
                      )}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Grid.Col>
        <Grid.Col xs={24} lg={12}>
          <Card title="Oś Czasu Projektów" className="border">
            <List
              dataSource={projectTimeline}
              renderItem={(p) => (
                <List.Item>
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium text-primary">
                        {p.name}
                      </div>
                      <span className="text-muted text-sm">
                        {p.progress}%
                      </span>
                    </div>
                    <Progress
                      percent={p.progress}
                      showInfo={false}
                      strokeColor="var(--primary-main)"
                      className="mb-2"
                    />
                    <div className="flex justify-between text-muted text-sm">
                      <span>{p.startMonth}</span>
                      <span>{p.endMonth}</span>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Grid.Col>
        <Grid.Col xs={24}>
          <Card title="Ostatnia Aktywność" className="border">
            <List
              dataSource={recentActivity}
              renderItem={(a) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={null}
                    title={
                      <span className="text-primary">
                        {a.action} <strong>{a.item}</strong>
                      </span>
                    }
                    description={
                      <span className="text-muted text-sm">
                        {a.time}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Grid.Col>
      </Grid.Row>
    </div>
  );
}
