import React, { useMemo, useState, useEffect } from "react";
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
  StatusBadge,
  PriorityBadge,
  ActionButton,
  ConstructorCard,
  ConstructorFlex
} from "../ui-kit";
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
  RefreshCw,
  TrendingUp,
  BarChart3,
  Calendar,
  Zap
} from "lucide-react";

const ItemType = "TILE";

interface DragItem {
  id: string;
  status: string;
  source: string;
}

function CNCKanbanInner() {
  const { tiles, updateTileStatus, getTilesByStatus, loading, error, fetchTiles } = useTileStatus();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [dragLoading, setDragLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTiles();
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchTiles]);

  // CNC Machines data with enhanced monitoring
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
      operator: "Paweł Kasperovich",
      efficiency: 94,
      quality: 98,
      maintenance: "2024-12-15"
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
      operator: null,
      efficiency: 0,
      quality: 0,
      maintenance: "2024-12-20"
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
      operator: "Anna Nowak",
      efficiency: 87,
      quality: 96,
      maintenance: "2024-12-25"
    }
  ];

  // Enhanced status mapping with progress tracking
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
      case "Aktywna": return "bg-green-100 text-green-800";
      case "Oczekiwanie": return "bg-yellow-100 text-yellow-800";
      case "Konserwacja": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
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
      case "Wysoki": return "text-red-600 bg-red-50 border-red-200";
      case "Średni": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Niski": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Enhanced filtering for tiles with CNC statuses
  const cncTiles = useMemo(() => (tiles || []).filter(tile =>
    Object.keys(reverseCncStatusMap).includes(tile.status)
  ), [tiles]);

  const filteredTiles = useMemo(() => cncTiles.filter(tile => {
    const matchesSearch = tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tile.projectName && tile.projectName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProject = filterProject === "all" || tile.project === filterProject;
    const matchesPriority = filterPriority === "all" || tile.priority === filterPriority;
    return matchesSearch && matchesProject && matchesPriority;
  }), [cncTiles, searchTerm, filterProject, filterPriority]);

  const todoTiles = useMemo(() => filteredTiles.filter(tile => reverseCncStatusMap[tile.status] === "W KOLEJCE"), [filteredTiles]);
  const inProgressTiles = useMemo(() => filteredTiles.filter(tile => reverseCncStatusMap[tile.status] === "W TRAKCIE CIĘCIA"), [filteredTiles]);
  const doneTiles = useMemo(() => filteredTiles.filter(tile => reverseCncStatusMap[tile.status] === "WYCIĘTE"), [filteredTiles]);

  // Enhanced tile movement with progress tracking
  const handleTileMove = async (tileId: string, newCncStatus: string) => {
    const newProjectStatus = cncStatusMap[newCncStatus as keyof typeof cncStatusMap];
    if (newProjectStatus) {
      try {
        if (dragLoading) return;
        setDragLoading(true);

        // Update tile status in global store
        await updateTileStatus(tileId, newProjectStatus, "cnc");

        // Update progress based on CNC status
        let newProgress = 0;
        switch (newCncStatus) {
          case "W KOLEJCE": newProgress = 40; break;
          case "W TRAKCIE CIĘCIA": newProgress = 60; break;
          case "WYCIĘTE": newProgress = 80; break;
          default: newProgress = 0;
        }

        // Find the tile and update its progress
        const tile = tiles.find(t => t.id === tileId);
        if (tile) {
          const updates: any = { progress: newProgress };
          if (newCncStatus === "W TRAKCIE CIĘCIA") {
            updates.startTime = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
          } else if (newCncStatus === "WYCIĘTE") {
            updates.completedTime = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
          }

          // Update tile with new progress and timestamp
          await updateTileStatus(tileId, newProjectStatus, "cnc");
        }

        showSuccessToast(`Kafelek przeniesiony do sekcji: ${newCncStatus}`);
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Failed to move tile:", error);
        showErrorToast("Błąd podczas przenoszenia kafelka. Spróbuj ponownie.");
      } finally {
        setDragLoading(false);
      }
    }
  };

  // Enhanced TileCard with better visual feedback
  const TileCard = ({ tile }: { tile: any }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemType,
      item: { id: tile.id, status: reverseCncStatusMap[tile.status], source: "cnc" },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const cncStatus = reverseCncStatusMap[tile.status];
    const isInProgress = cncStatus === "W TRAKCIE CIĘCIA";
    const isCompleted = cncStatus === "WYCIĘTE";

    return (
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'grab'
        }}
      >
        <ConstructorCard
          variant="elevated"
          size="md"
          className={`mb-3 cursor-grab hover:shadow-md transition-all duration-200 active:cursor-grabbing ${isInProgress ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
            } ${isCompleted ? 'ring-2 ring-green-200 bg-green-50/30' : ''}`}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-sm truncate">{tile.name}</h4>
                <p className="text-xs text-muted-foreground">{tile.id} • {tile.projectName}</p>
              </div>
              <PriorityBadge priority={tile.priority} size="sm" />
            </div>

            {isInProgress && tile.progress && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Postęp CNC</span>
                  <span className="font-medium">{tile.progress}%</span>
                </div>
                <Progress value={tile.progress} className="h-2" />
              </div>
            )}

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground truncate">{tile.assignedTo}</span>
              </div>
              <div className="flex items-center gap-1">
                <Timer className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {isCompleted ? tile.actualTime || tile.estimatedTime : tile.estimatedTime}
                </span>
              </div>
              {tile.machine && (
                <div className="flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-blue-600" />
                  <span className="text-blue-600 text-xs">{machines.find(m => m.id === tile.machine)?.name}</span>
                </div>
              )}
            </div>

            {tile.materials.length > 0 && (
              <div className="text-xs">
                <p className="text-muted-foreground mb-1">Materiały:</p>
                <p className="text-foreground truncate">{tile.materials[0]}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {tile.dxfFile && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <FileText className="w-3 h-3" />
                    <span>DXF</span>
                  </div>
                )}
              </div>

              {isCompleted && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{tile.completedTime}</span>
                </div>
              )}

              {isInProgress && tile.startTime && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Clock className="w-3 h-3" />
                  <span>Start: {tile.startTime}</span>
                </div>
              )}
            </div>

            {tile.notes && (
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                {tile.notes}
              </div>
            )}
          </div>
        </ConstructorCard>
      </div>
    );
  };

  // Enhanced KanbanColumn with better drop feedback
  const KanbanColumn = ({ title, tiles, status, icon: Icon, color }: any) => {
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: ItemType,
      drop: (item: DragItem) => {
        if (item.status !== status && item.id) {
          handleTileMove(item.id, status);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    });

    return (
      <div className="flex-1 min-w-0">
        <Card
          ref={drop}
          className={`h-full transition-all duration-200 min-h-[400px] ${isOver ? 'ring-2 ring-primary bg-primary/5 scale-[1.02]' : 'ring-0'
            }`}
        >
          <CardHeader className="pb-3">
            <CardTitle className={`flex items-center gap-2 text-sm ${color}`}>
              <Icon className="w-4 h-4" />
              {title}
              <Badge variant="outline" className="ml-auto">
                {tiles.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[420px] md:max-h-[560px]">
            {tiles.map((tile: any) => (
              <TileCard key={tile.id} tile={tile} />
            ))}
            {tiles.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <Icon className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Brak zadań</p>
              </div>
            )}
          </CardContent>
        </Card>
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
          <div className="text-red-500 mb-2">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>Błąd ładowania danych</p>
            <p className="text-sm text-muted-foreground">{error}</p>
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
        <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-3 py-2 rounded-md shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
            <span className="text-sm">Aktualizowanie...</span>
          </div>
        </div>
      )}

      {/* Header with real-time updates */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-2">CNC - Zarządzanie Kolejką</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Kanban do zarządzania zadaniami CNC i monitoring maszyn
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Clock className="w-3 h-3" />
            <span>Ostatnia aktualizacja: {lastUpdate.toLocaleTimeString('pl-PL')}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { fetchTiles(); setLastUpdate(new Date()); }}
              className="h-4 w-4 p-0 hover:bg-muted"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
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

      {/* Enhanced Machines Status with KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {machines.map((machine) => (
          <Card key={machine.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{machine.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{machine.id}</p>
                </div>
                <Badge className={`${getStatusColor(machine.status)} flex items-center gap-1`}>
                  {getStatusIcon(machine.status)}
                  {machine.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">Bieżące zadanie:</p>
                <p className="text-sm text-muted-foreground">{machine.currentJob}</p>
              </div>

              {machine.operator && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{machine.operator}</span>
                </div>
              )}

              {machine.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Postęp</span>
                    <span>{machine.progress}%</span>
                  </div>
                  <Progress value={machine.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Pozostało: {machine.timeLeft}
                  </p>
                </div>
              )}

              {/* Enhanced machine metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Wydajność</span>
                  </div>
                  <p className="font-semibold text-sm text-green-600">{machine.efficiency}%</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>Jakość</span>
                  </div>
                  <p className="font-semibold text-sm text-blue-600">{machine.quality}%</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <Zap className="w-3 h-3" />
                    <span>Wykorzystanie</span>
                  </div>
                  <p className="font-semibold text-sm text-orange-600">{machine.utilization}%</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>Konserwacja</span>
                  </div>
                  <p className="font-semibold text-sm text-purple-600">{machine.maintenance}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Filters */}
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

            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Łącznie zadań: {filteredTiles.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <KanbanColumn
          title="W KOLEJCE"
          tiles={todoTiles}
          status="W KOLEJCE"
          icon={Clock}
          color="text-yellow-600"
        />

        <KanbanColumn
          title="W TRAKCIE CIĘCIA"
          tiles={inProgressTiles}
          status="W TRAKCIE CIĘCIA"
          icon={Play}
          color="text-blue-600"
        />

        <KanbanColumn
          title="WYCIĘTE"
          tiles={doneTiles}
          status="WYCIĘTE"
          icon={CheckCircle2}
          color="text-green-600"
        />
      </div>

      {/* Enhanced Statistics with real-time data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{todoTiles.length}</div>
            <p className="text-sm text-muted-foreground">Zadania w kolejce</p>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
              <Clock className="w-3 h-3" />
              <span>Oczekujące</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{inProgressTiles.length}</div>
            <p className="text-sm text-muted-foreground">Zadania w realizacji</p>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
              <Play className="w-3 h-3" />
              <span>Aktywne</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{doneTiles.length}</div>
            <p className="text-sm text-muted-foreground">Zadania ukończone</p>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Gotowe</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {filteredTiles.length > 0 ? Math.round((doneTiles.length / filteredTiles.length) * 100) : 0}%
            </div>
            <p className="text-sm text-muted-foreground">Wskaźnik ukończenia</p>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Dzisiaj</span>
            </div>
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