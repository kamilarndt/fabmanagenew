import { useState } from 'react'
import { useProjectsStore } from '../stores/projectsStore'
import { PageHeader } from '../components/Ui/PageHeader'
import { Toolbar } from '../components/Ui/Toolbar'
import { Card, Row, Col, Statistic, List, Progress, Tag, Button } from 'antd'
// import { useTilesStore } from '../stores/tilesStore' // Unused for now

interface Task {
  id: number
  task: string
  project: string
  deadline: string
  overdue: boolean
  completed: boolean
}

export default function Dashboard() {
  const { projects } = useProjectsStore()
  // const { tiles } = useTilesStore() // Unused for now

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      task: "Przygotuj pliki DXF dla recepcji",
      project: "Smart Kids Planet",
      deadline: "2025-01-02",
      overdue: true,
      completed: false
    },
    {
      id: 2,
      task: "Weryfikacja rysunków technicznych",
      project: "Stoisko GR8 TECH - Londyn 2025",
      deadline: "2025-01-05",
      overdue: false,
      completed: false
    },
    {
      id: 3,
      task: "Kontrola jakości elementów CNC",
      project: "Studio TV - Les 12 Coups de Midi",
      deadline: "2025-01-03",
      overdue: true,
      completed: false
    },
    {
      id: 4,
      task: "Przygotowanie oferty cenowej",
      project: "Projekt Alpha",
      deadline: "2025-01-08",
      overdue: false,
      completed: true
    }
  ])

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  // KPI calculations
  const activeProjects = projects.filter(p => p.status === 'Active').length
  const overdueTasks = tasks.filter(t => t.overdue && !t.completed).length
  const newInquiries = 2 // Mock data

  // Project timeline data
  const projectTimeline = [
    {
      name: "Smart Kids Planet",
      startMonth: "Grudzień",
      endMonth: "Styczeń",
      progress: 75,
      color: "bg-primary"
    },
    {
      name: "Stoisko GR8 TECH - Londyn 2025",
      startMonth: "Styczeń",
      endMonth: "Luty",
      progress: 45,
      color: "bg-success"
    },
    {
      name: "Studio TV - Les 12 Coups de Midi",
      startMonth: "Styczeń",
      endMonth: "Marzec",
      progress: 30,
      color: "bg-warning"
    },
    {
      name: "Kawiarnia Nowa Oferta",
      startMonth: "Luty",
      endMonth: "Marzec",
      progress: 10,
      color: "bg-info"
    }
  ]

  // Recent activity
  const recentActivity = [
    { id: 1, action: "Nowy projekt utworzony", item: "Kawiarnia Nowa Oferta", time: "2 godziny temu", type: "success" },
    { id: 2, action: "Status zmieniony", item: "Panel recepcji - T-001", time: "4 godziny temu", type: "info" },
    { id: 3, action: "Zadanie ukończone", item: "Przygotowanie oferty cenowej", time: "6 godzin temu", type: "success" },
    { id: 4, action: "Materiał zamówiony", item: "MDF 18mm Surowy", time: "1 dzień temu", type: "warning" },
    { id: 5, action: "Klient dodany", item: "Studio Alpha", time: "2 dni temu", type: "info" }
  ]

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Przegląd głównych wskaźników i aktywności" />

      <Toolbar
        right={
          <div className="text-muted small">
            <i className="ri-time-line me-1"></i>
            Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}
          </div>
        }
      />

      <Row gutter={[24, 24]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card bordered style={{ background: 'var(--bg-card)' }}>
            <Statistic title="Aktywne Projekty" value={activeProjects} valueStyle={{ color: 'var(--primary-main)' }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered style={{ background: 'var(--bg-card)' }}>
            <Statistic title="Zadania po Terminie" value={overdueTasks} valueStyle={{ color: '#FDB528' }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered style={{ background: 'var(--bg-card)' }}>
            <Statistic title="Nowe Zapytania" value={newInquiries} valueStyle={{ color: 'var(--primary-main)' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Moje Zadania" extra={<Button size="small">Dodaj</Button>} bordered style={{ background: 'var(--bg-card)' }}>
            <List
              dataSource={tasks}
              renderItem={t => (
                <List.Item key={t.id} style={{ border: 'none', paddingLeft: 0, paddingRight: 0 }}>
                  <div style={{ width: 16, height: 16, marginRight: 12 }}>
                    <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t.id)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ opacity: t.completed ? 0.6 : 1, textDecoration: t.completed ? 'line-through' : 'none' }}>{t.task}</div>
                    <div className="small text-muted">{t.project}</div>
                    <div style={{ marginTop: 4 }}>
                      <Tag color={t.overdue && !t.completed ? 'error' : t.completed ? 'success' : 'default'}>{t.deadline}</Tag>
                      {t.overdue && !t.completed && <span className="text-danger small" style={{ marginLeft: 8 }}>Opóźnione</span>}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Oś Czasu Projektów" bordered style={{ background: 'var(--bg-card)' }}>
            <List
              dataSource={projectTimeline}
              renderItem={(p) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="fw-medium">{p.name}</div>
                      <span className="small text-muted">{p.progress}%</span>
                    </div>
                    <Progress percent={p.progress} showInfo={false} strokeColor={'var(--primary-main)'} style={{ marginBottom: 8 }} />
                    <div className="d-flex justify-content-between text-muted small">
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
          <Card title="Ostatnia Aktywność" bordered style={{ background: 'var(--bg-card)' }}>
            <List
              dataSource={recentActivity}
              renderItem={(a) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={null}
                    title={<span>{a.action} <strong>{a.item}</strong></span>}
                    description={<span className="text-muted small">{a.time}</span>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
