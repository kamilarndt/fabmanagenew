import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart3, TrendingUp, Users, Package, CheckCircle2, Clock, Calendar, AlertCircle, FolderOpen, AlarmClock, Mail, Checkbox } from "lucide-react";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Checkbox as CheckboxComponent } from "../ui/checkbox";

interface DashboardProps {
  onProjectClick?: () => void;
}

export function Dashboard({ onProjectClick }: DashboardProps = {}) {
  // Karty KPI zgodnie z instrukcją 4.1
  const kpiCards = [
    {
      title: "Aktywne Projekty",
      value: "8",
      icon: FolderOpen,
      variant: "default" as const
    },
    {
      title: "Zadania po Terminie",
      value: "3",
      icon: AlarmClock,
      variant: "warning" as const
    },
    {
      title: "Nowe Zapytania",
      value: "2",
      icon: Mail,
      variant: "default" as const
    },
  ];

  // Lista zadań zgodnie z instrukcją 4.2
  const myTasks = [
    {
      id: 1,
      task: "Przygotuj pliki DXF dla recepcji",
      project: "Smart Kids Planet",
      deadline: "2025-09-02",
      overdue: true,
      completed: false
    },
    {
      id: 2,
      task: "Weryfikacja rysunków technicznych",
      project: "Stoisko GR8 TECH - Londyn 2025",
      deadline: "2025-09-05",
      overdue: false,
      completed: false
    },
    {
      id: 3,
      task: "Kontrola jakości elementów CNC",
      project: "Studio TV - Les 12 Coups de Midi",
      deadline: "2025-09-03",
      overdue: true,
      completed: false
    },
    {
      id: 4,
      task: "Przygotowanie oferty cenowej",
      project: "Projekt Alpha",
      deadline: "2025-09-08",
      overdue: false,
      completed: true
    }
  ];

  // Projekty dla osi czasu zgodnie z instrukcją 4.3
  const projectTimeline = [
    {
      name: "Smart Kids Planet",
      startMonth: "Sierpień",
      endMonth: "Wrzesień",
      progress: 75,
      color: "bg-blue-500"
    },
    {
      name: "Stoisko GR8 TECH - Londyn 2025",
      startMonth: "Wrzesień", 
      endMonth: "Październik",
      progress: 45,
      color: "bg-green-500"
    },
    {
      name: "Studio TV - Les 12 Coups de Midi",
      startMonth: "Sierpień",
      endMonth: "Listopad",
      progress: 30,
      color: "bg-purple-500"
    },
    {
      name: "Projekt Alpha",
      startMonth: "Wrzesień",
      endMonth: "Grudzień",
      progress: 15,
      color: "bg-orange-500"
    }
  ];

  const isOverdue = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate < today;
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Centrum dowodzenia - przegląd najważniejszych informacji i zadań wymagających uwagi
        </p>
      </div>

      {/* Instrukcja 4.1: Karty KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {kpiCards.map((card, index) => (
          <Card key={index} className={card.variant === 'warning' ? 'border-yellow-200 bg-yellow-50/50' : ''}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                    {card.value}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {card.title}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.variant === 'warning' ? 'bg-yellow-100' : 'bg-muted'}`}>
                  <card.icon className={`w-6 h-6 ${card.variant === 'warning' ? 'text-yellow-600' : 'text-muted-foreground'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instrukcja 4.2 i 4.3: Lista Moje Zadania i Oś Czasu Projektów */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Lista Moje Zadania */}
        <Card>
          <CardHeader>
            <CardTitle>Moje Zadania</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <CheckboxComponent 
                    checked={task.completed}
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.task}
                    </p>
                    <button
                      className="text-xs text-primary hover:underline cursor-pointer truncate block"
                      onClick={onProjectClick}
                    >
                      {task.project}
                    </button>
                  </div>
                  <div className="flex-shrink-0">
                    <p className={`text-xs font-medium ${
                      task.overdue && !task.completed ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                      {task.deadline}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Oś Czasu Projektów */}
        <Card>
          <CardHeader>
            <CardTitle>Oś Czasu Projektów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Nagłówki miesięcy */}
              <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground mb-4">
                <div>Sierpień</div>
                <div>Wrzesień</div>
                <div>Październik</div>
                <div>Listopad</div>
              </div>
              
              {/* Projekty */}
              {projectTimeline.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      className="text-sm font-medium text-primary hover:underline cursor-pointer text-left truncate"
                      onClick={onProjectClick}
                    >
                      {project.name}
                    </button>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {project.progress}%
                    </span>
                  </div>
                  
                  <div className="relative">
                    {/* Tło osi czasu */}
                    <div className="h-6 bg-muted rounded-full relative overflow-hidden">
                      {/* Pasek postępu projektu */}
                      <div 
                        className={`h-full ${project.color} rounded-full transition-all duration-300`}
                        style={{ width: `${project.progress}%` }}
                      />
                      
                      {/* Etykiety czasu */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-white mix-blend-difference">
                          {project.startMonth} - {project.endMonth}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}