import { useState } from 'react'
import { useProjectsStore } from '../stores/projectsStore'
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Dashboard</h4>
          <p className="text-muted mb-0">Przegląd głównych wskaźników i aktywności</p>
        </div>
        <div className="text-muted small">
          <i className="ri-time-line me-1"></i>
          Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                  <i className="ri-folder-open-line text-primary h5 mb-0"></i>
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="h4 mb-0">{activeProjects}</div>
                <div className="text-muted small">Aktywne Projekty</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                  <i className="ri-alarm-warning-line text-warning h5 mb-0"></i>
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="h4 mb-0 text-warning">{overdueTasks}</div>
                <div className="text-muted small">Zadania po Terminie</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                  <i className="ri-mail-line text-success h5 mb-0"></i>
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="h4 mb-0">{newInquiries}</div>
                <div className="text-muted small">Nowe Zapytania</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* My Tasks */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Moje Zadania</h5>
              <button className="btn btn-sm btn-outline-primary">
                <i className="ri-add-line me-1"></i>Dodaj
              </button>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {tasks.map(task => (
                  <div key={task.id} className="list-group-item px-0 border-0">
                    <div className="d-flex align-items-start">
                      <div className="form-check me-3 mt-1">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className={`mb-1 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                          {task.task}
                        </div>
                        <div className="small text-muted mb-1">{task.project}</div>
                        <div className="d-flex align-items-center gap-2">
                          <span className={`badge ${task.overdue && !task.completed ? 'bg-danger' : task.completed ? 'bg-success' : 'bg-secondary'}`}>
                            {task.deadline}
                          </span>
                          {task.overdue && !task.completed && (
                            <span className="text-danger small">
                              <i className="ri-time-line me-1"></i>Opóźnione
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Project Timeline */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Oś Czasu Projektów</h5>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {projectTimeline.map((project, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="fw-medium">{project.name}</div>
                      <span className="small text-muted">{project.progress}%</span>
                    </div>
                    <div className="progress mb-2" style={{ height: 8 }}>
                      <div 
                        className={`progress-bar ${project.color.replace('bg-', 'bg-')}`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between text-muted small">
                      <span>{project.startMonth}</span>
                      <span>{project.endMonth}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Ostatnia Aktywność</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="list-group-item px-0 border-0">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-3">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                          activity.type === 'success' ? 'bg-success bg-opacity-10' :
                          activity.type === 'warning' ? 'bg-warning bg-opacity-10' :
                          'bg-info bg-opacity-10'
                        }`} style={{ width: 32, height: 32 }}>
                          <i className={`${
                            activity.type === 'success' ? 'ri-check-line text-success' :
                            activity.type === 'warning' ? 'ri-alert-line text-warning' :
                            'ri-information-line text-info'
                          } small`}></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="mb-1">
                              <span className="me-1">{activity.action}</span>
                              <strong>{activity.item}</strong>
                            </div>
                            <div className="text-muted small">{activity.time}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
