import { Button, Card, Col, List, Progress, Row, Statistic, Tag } from "antd";
import { useMemo } from "react";
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

      <Row gutter={[24, 24]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card bordered>
            <Statistic
              title="Aktywne Projekty"
              value={activeProjects}
              valueStyle={{ color: "var(--primary-main)" }}
              prefix={<i className="ri-briefcase-line" />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered>
            <Statistic
              title="Zadania po Terminie"
              value={overdueTasks}
              valueStyle={{ color: "var(--accent-warning)" }}
              prefix={<i className="ri-time-line" />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered>
            <Statistic
              title="Nowe Zapytania"
              value={newInquiries}
              valueStyle={{ color: "var(--primary-main)" }}
              prefix={<i className="ri-question-line" />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title="Moje Zadania"
            extra={
              <Button size="small" type="primary">
                Dodaj
              </Button>
            }
            bordered
          >
            <List
              dataSource={tasks}
              renderItem={(t) => (
                <List.Item
                  key={t.id}
                  style={{ border: "none", paddingLeft: 0, paddingRight: 0 }}
                >
                  <div style={{ width: 16, height: 16, marginRight: 12 }}>
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTask(t.id)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        opacity: t.completed ? 0.6 : 1,
                        textDecoration: t.completed ? "line-through" : "none",
                        color: "var(--text-primary)",
                      }}
                    >
                      {t.title}
                    </div>
                    <div
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {t.project}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <Tag
                        color={
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
                        <span
                          style={{
                            marginLeft: 8,
                            color: "var(--accent-error)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Opóźnione
                        </span>
                      )}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Oś Czasu Projektów" bordered>
            <List
              dataSource={projectTimeline}
              renderItem={(p) => (
                <List.Item>
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}
                      >
                        {p.name}
                      </div>
                      <span
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {p.progress}%
                      </span>
                    </div>
                    <Progress
                      percent={p.progress}
                      showInfo={false}
                      strokeColor={"var(--primary-main)"}
                      style={{ marginBottom: 8 }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "var(--text-muted)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <span>{p.startMonth}</span>
                      <span>{p.endMonth}</span>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="Ostatnia Aktywność" bordered>
            <List
              dataSource={recentActivity}
              renderItem={(a) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={null}
                    title={
                      <span style={{ color: "var(--text-primary)" }}>
                        {a.action} <strong>{a.item}</strong>
                      </span>
                    }
                    description={
                      <span
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {a.time}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
