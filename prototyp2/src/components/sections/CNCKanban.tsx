import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { useTileStatus } from "../TileStatusSync";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { 
  Settings, 
  Play, 
  Pause, 
  AlertCircle,
  FileText,
  Package,
  User,
  Timer,
  Search,
  Filter,
  Plus,
  MoreVertical,
  CheckCircle2,
  Clock,
  Wrench,
  Target,
  Activity,
  RefreshCw
} from "lucide-react";

const ItemType = "TILE";

interface DragItem {
  id: string;
  status: string;
}

function CNCKanbanInner() {
  const { tiles, updateTileStatus, getTilesByStatus, loading, error, fetchTiles } = useTileStatus();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [dragLoading, setDragLoading] = useState(false);

  // CNC Machines data
  const machines = [
    {
      id: "CNC-001",
      name: "HAAS VF-2",
      status: "Aktywna",
      currentJob: "Panel główny recepcji - T-001",
      currentProject: "P-001",
      progress: 73,
      timeLeft: "2h 15min",
      utilization: 92,
      temperature: 45,
      spindle: 3500,
      operator: "Paweł Kasperovich"
    },
    {
      id: "CNC-002", 
      name: "DMG MORI NLX",
      status: "Konserwacja",
      currentJob: "Brak",
      currentProject: null,
      progress: 0,
      timeLeft: "-",
      utilization: 0,
      temperature: 23,
      spindle: 0,
      operator: null
    },
    {
      id: "CNC-003",
      name: "OKUMA LB3000",
      status: "Oczekiwanie",
      currentJob: "Gotowy do pracy", 
      currentProject: null,
      progress: 0,
      timeLeft: "Oczekuje",
      utilization: 0,
      temperature: 25,
      spindle: 0,
      operator: "Anna Nowak"
    }
  ];

  // Mapowanie statusów CNC do systemu globalnego
  const cncStatusMap = {
    "W KOLEJCE": "W kolejce CNC",
    "W TRAKCIE CIĘCIA": "W produkcji CNC", 
    "WYCIĘTE": "Gotowy do montażu"
  };

  const reverseCncStatusMap = {
    "W kolejce CNC": "W KOLEJCE",
    "W produkcji CNC": "W TRAKCIE CIĘCIA",
    "Gotowy do montażu": "WYCIĘTE"
  };

  const projects = [
    { id: "P-001", name: "Stoisko GR8 TECH" },
    { id: "P-002", name: "Modernizacja linii" },
    { id: "P-003", name: "Prototyp Beta" },
    { id: "P-004", name: "Studio TV" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktywna": return "bg-[var(--chart-2)]/10 text-[var(--chart-2)]";
      case "Oczekiwanie": return "bg-[var(--chart-3)]/10 text-[var(--chart-3)]";
      case "Konserwacja": return "bg-[var(--chart-4)]/10 text-[var(--chart-4)]";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aktywna": return <Play className="w-4 h-4" />;
      case "Oczekiwanie": return <Pause className="w-4 h-4" />;
      case "Konserwacja": return <AlertCircle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Wysoki": return "text-[var(--chart-4)] bg-[var(--chart-4)]/10 border-[var(--chart-4)]/20";
      case "Średni": return "text-[var(--chart-3)] bg-[var(--chart-3)]/10 border-[var(--chart-3)]/20";
      case "Niski": return "text-[var(--chart-2)] bg-[var(--chart-2)]/10 border-[var(--chart-2)]/20";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  // Filtrowanie tiles które mają statusy CNC
  const cncTiles = tiles.filter(tile => 
    Object.keys(reverseCncStatusMap).includes(tile.status)
  );
  
  // Debug info when tiles array changes
  if (tiles.length > 0) {
    console.log(`[CNCKanban] Total tiles: ${tiles.length}, CNC tiles: ${cncTiles.length}`);
  }

  const filteredTiles = cncTiles.filter(tile => {
    const matchesSearch = tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tile.projectName && tile.projectName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProject = filterProject === "all" || tile.project === filterProject;
    const matchesPriority = filterPriority === "all" || tile.priority === filterPriority;
    return matchesSearch && matchesProject && matchesPriority;
  });

  const todoTiles = filteredTiles.filter(tile => reverseCncStatusMap[tile.status] === "W KOLEJCE");
  const inProgressTiles = filteredTiles.filter(tile => reverseCncStatusMap[tile.status] === "W TRAKCIE CIĘCIA");
  const doneTiles = filteredTiles.filter(tile => reverseCncStatusMap[tile.status] === "WYCIĘTE");

  const handleTileMove = async (tileId: string, newCncStatus: string) => {
    const newProjectStatus = cncStatusMap[newCncStatus as keyof typeof cncStatusMap];
    console.log(`[CNCKanban] Moving tile ${tileId} from CNC status ${newCncStatus} to project status ${newProjectStatus}`);
    
    if (newProjectStatus) {
      try {
        setDragLoading(true);
        
        // Znajdź kafelek przed aktualizacją
        const tile = tiles.find(t => t.id === tileId);
        console.log(`[CNCKanban] Current tile status: ${tile?.status}, moving to: ${newProjectStatus}`);
        
        await updateTileStatus(tileId, newProjectStatus, "cnc");
        
        // Odśwież dane po aktualizacji
        setTimeout(() => {
          fetchTiles();
        }, 100);
        
        showSuccessToast(`Kafelek przeniesiony do sekcji: ${newCncStatus}`);
      } catch (error) {
        console.error("Failed to move tile:", error);
        showErrorToast("Błąd podczas przenoszenia kafelka. Spróbuj ponownie.");
      } finally {
        setDragLoading(false);
      }
    } else {
      console.error(`[CNCKanban] No mapping found for CNC status: ${newCncStatus}`);
      showErrorToast("Błąd mapowania statusu. Sprawdź konsole.");
    }
  };

  const TileCard = ({ tile }: { tile: any }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemType,
      item: { id: tile.id, status: reverseCncStatusMap[tile.status] },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'grab'
        }}
      >
        <Card className="mb-3 cursor-grab hover:shadow-[var(--elevation-sm)] transition-shadow active:cursor-grabbing">
          <CardContent className="p-3">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-[var(--font-weight-medium)]">{tile.name}</h4>
              <p className="text-muted-foreground text-[var(--text-label)]">{tile.id} • {tile.projectName}</p>
            </div>
            <Badge className={`${getPriorityColor(tile.priority)} flex-shrink-0 text-[var(--text-label)]`}>
              {tile.priority}
            </Badge>
          </div>

          {reverseCncStatusMap[tile.status] === "W TRAKCIE CIĘCIA" && tile.progress && (
            <div className="space-y-1">
              <div className="flex justify-between text-[var(--text-label)]">
                <span className="text-muted-foreground">Postęp</span>
                <span>{tile.progress}%</span>
              </div>
              <Progress value={tile.progress} className="h-1" />
            </div>
          )}

          <div className="space-y-1 text-[var(--text-label)]">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground truncate">{tile.assignedTo}</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                {reverseCncStatusMap[tile.status] === "WYCIĘTE" ? tile.actualTime || tile.estimatedTime : tile.estimatedTime}
              </span>
            </div>
            {tile.machine && (
              <div className="flex items-center gap-1">
                <Wrench className="w-3 h-3 text-[var(--chart-1)]" />
                <span className="text-[var(--chart-1)] text-[var(--text-label)]">{machines.find(m => m.id === tile.machine)?.name}</span>
              </div>
            )}
          </div>

          {tile.materials.length > 0 && (
            <div className="text-[var(--text-label)]">
              <p className="text-muted-foreground mb-1">Materiały:</p>
              <p className="text-foreground truncate">{tile.materials[0]}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {tile.dxfFile && (
                <div className="flex items-center gap-1 text-[var(--text-label)] text-[var(--chart-2)]">
                  <FileText className="w-3 h-3" />
                  <span>DXF</span>
                </div>
              )}
            </div>
            
            {reverseCncStatusMap[tile.status] === "WYCIĘTE" && (
              <div className="flex items-center gap-1 text-[var(--text-label)] text-[var(--chart-2)]">
                <CheckCircle2 className="w-3 h-3" />
                <span>{tile.completedTime}</span>
              </div>
            )}
            
            {reverseCncStatusMap[tile.status] === "W TRAKCIE CIĘCIA" && tile.startTime && (
              <div className="flex items-center gap-1 text-[var(--text-label)] text-[var(--chart-1)]">
                <Clock className="w-3 h-3" />
                <span>Start: {tile.startTime}</span>
              </div>
            )}
          </div>

          {tile.notes && (
            <div className="text-[var(--text-label)] text-muted-foreground bg-muted/50 p-2 rounded-[var(--radius)]">
              {tile.notes}
            </div>
          )}
        </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const KanbanColumn = ({ title, tiles, status, icon: Icon, color }: any) => {
    const [{ isOver }, drop] = useDrop({
      accept: ItemType,
      drop: (item: DragItem) => {
        if (item.status !== status) {
          handleTileMove(item.id, status);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <div className="flex-1 min-w-0">
        <div 
          ref={drop}
          className={`h-full transition-colors min-h-[400px] bg-card text-card-foreground rounded-[var(--radius-card)] shadow-[var(--elevation-sm)] border border-border ${
            isOver ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}
        >
          <div className="p-6 pb-3">
            <div className={`flex items-center gap-2 font-[var(--font-weight-medium)] ${color}`}>
              <Icon className="w-4 h-4" />
              <span>{title}</span>
              <Badge variant="outline" className="ml-auto text-[var(--text-label)]">
                {tiles.length}
              </Badge>
            </div>
          </div>
          <div className="px-6 pb-6 flex-1 overflow-y-auto max-h-[400px] md:max-h-[500px]">
          {tiles.map((tile: any) => (
            <TileCard key={tile.id} tile={tile} />
          ))}
          {tiles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Brak zadań</p>
            </div>
          )}
        </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Ładowanie danych CNC...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-[var(--chart-4)] mb-2">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>Błąd ładowania danych</p>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={fetchTiles} variant="outline" size="sm">
            Spróbuj ponownie
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {dragLoading && (
        <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-3 py-2 rounded-[var(--radius)] shadow-[var(--elevation-sm)]">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
            <span>Aktualizowanie...</span>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1>CNC - Zarządzanie Kolejką</h1>
          <p className="text-muted-foreground">
            Kanban do zarządzania zadaniami CNC i monitoring maszyn
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Dodaj Zadanie
          </Button>
          <Button size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Ustawienia Maszyn
          </Button>
        </div>
      </div>

      {/* Machines Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {machines.map((machine) => (
          <Card key={machine.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{machine.name}</CardTitle>
                  <p className="text-muted-foreground text-[var(--text-label)]">{machine.id}</p>
                </div>
                <Badge className={`${getStatusColor(machine.status)} flex items-center gap-1 text-[var(--text-label)]`}>
                  {getStatusIcon(machine.status)}
                  {machine.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-[var(--font-weight-medium)] mb-1">Bieżące zadanie:</p>
                <p className="text-muted-foreground">{machine.currentJob}</p>
              </div>
              
              {machine.operator && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{machine.operator}</span>
                </div>
              )}
              
              {machine.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Postęp</span>
                    <span>{machine.progress}%</span>
                  </div>
                  <Progress value={machine.progress} className="h-2" />
                  <p className="text-muted-foreground text-[var(--text-label)]">
                    Pozostało: {machine.timeLeft}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-2 pt-2 border-t text-center">
                <div>
                  <p className="text-muted-foreground text-[var(--text-label)]">Wykorzystanie</p>
                  <p className="font-[var(--font-weight-medium)]">{machine.utilization}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[var(--text-label)]">Temperatura</p>
                  <p className="font-[var(--font-weight-medium)]">{machine.temperature}°C</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[var(--text-label)]">Wrzeciono</p>
                  <p className="font-[var(--font-weight-medium)]">{machine.spindle} RPM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj zadań..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterProject} onValueChange={setFilterProject}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Projekt" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie projekty</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <Target className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Priorytet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie priorytety</SelectItem>
                <SelectItem value="Wysoki">Wysoki</SelectItem>
                <SelectItem value="Średni">Średni</SelectItem>
                <SelectItem value="Niski">Niski</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Łącznie zadań: {filteredTiles.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <KanbanColumn
          title="W KOLEJCE"
          tiles={todoTiles}
          status="W KOLEJCE"
          icon={Clock}
          color="text-[var(--chart-3)]"
        />
        
        <KanbanColumn
          title="W TRAKCIE CIĘCIA"
          tiles={inProgressTiles}
          status="W TRAKCIE CIĘCIA"
          icon={Play}
          color="text-[var(--chart-1)]"
        />
        
        <KanbanColumn
          title="WYCIĘTE"
          tiles={doneTiles}
          status="WYCIĘTE"
          icon={CheckCircle2}
          color="text-[var(--chart-2)]"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-[var(--text-h3)] font-[var(--font-weight-medium)] text-[var(--chart-1)]">{todoTiles.length}</div>
            <p className="text-muted-foreground">Zadania w kolejce</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-[var(--text-h3)] font-[var(--font-weight-medium)] text-[var(--chart-3)]">{inProgressTiles.length}</div>
            <p className="text-muted-foreground">Zadania w realizacji</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-[var(--text-h3)] font-[var(--font-weight-medium)] text-[var(--chart-2)]">{doneTiles.length}</div>
            <p className="text-muted-foreground">Zadania ukończone</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-[var(--text-h3)] font-[var(--font-weight-medium)] text-[var(--chart-5)]">67%</div>
            <p className="text-muted-foreground">Średnie wykorzystanie</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function CNCKanban() {
  // Detect if device supports touch
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const backend = isTouchDevice ? TouchBackend : HTML5Backend;
  
  const touchBackendOptions = {
    enableMouseEvents: true,
    delayTouchStart: 200,
  };
  
  return (
    <DndProvider backend={backend} options={isTouchDevice ? touchBackendOptions : undefined}>
      <CNCKanbanInner />
    </DndProvider>
  );
}