import { useState, useCallback } from "react";
import { useTileStatus, getStatusForView } from "../TileStatusSync";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import {
  DashboardCard,
  StatusBadge,
  PriorityBadge,
  ActionButton,
  ConstructorContainer,
  ConstructorSection,
  ConstructorGrid,
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
  Download
} from "lucide-react";

export function CNC() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const { tiles, updateTileStatus } = useTileStatus();

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

  // Filtruj kafelki tylko do statusów CNC i przekonwertuj statusy
  const cncTiles = tiles
    .map(tile => ({
      ...tile,
      status: getStatusForView(tile.status, "cnc")
    }))
    .filter(tile => ["W KOLEJCE", "W TRAKCIE CIĘCIA", "WYCIĘTE"].includes(tile.status));

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

  const filteredTiles = cncTiles.filter(tile => {
    const matchesSearch = tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tile.projectName && tile.projectName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProject = filterProject === "all" || tile.project === filterProject;
    const matchesPriority = filterPriority === "all" || tile.priority === filterPriority;
    return matchesSearch && matchesProject && matchesPriority;
  });

  const queueTiles = filteredTiles.filter(tile => tile.status === "W KOLEJCE");
  const inProgressTiles = filteredTiles.filter(tile => tile.status === "W TRAKCIE CIĘCIA");
  const doneTiles = filteredTiles.filter(tile => tile.status === "WYCIĘTE");

  const handleTileMove = useCallback((tileId: string, newStatus: string) => {
    // Aktualizuj status w kontekście globalnym - automatycznie zsynchronizuje z PojedynczyProjekt
    updateTileStatus(tileId, newStatus, "cnc");
  }, [updateTileStatus]);

  const handleTileDrop = useCallback((e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const tileId = e.dataTransfer.getData("text/plain");
    handleTileMove(tileId, targetStatus);
  }, [handleTileMove]);

  const handleTileDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const TileCard = ({ tile }: { tile: any }) => (
    <Card
      className="mb-3 cursor-move hover:shadow-md transition-shadow"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", tile.id);
      }}
    >
      <CardContent className="p-3">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-sm truncate">{tile.name}</h4>
              <p className="text-xs text-muted-foreground">{tile.id} • {tile.projectName}</p>
            </div>
            <Badge className={`text-xs ${getPriorityColor(tile.priority)} flex-shrink-0`}>
              {tile.priority}
            </Badge>
          </div>

          {tile.status === "W TRAKCIE CIĘCIA" && tile.progress && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Postęp</span>
                <span>{tile.progress}%</span>
              </div>
              <Progress value={tile.progress} className="h-1" />
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
                {tile.status === "WYCIĘTE" ? tile.actualTime : tile.estimatedTime}
              </span>
            </div>
            {tile.machine && (
              <div className="flex items-center gap-1">
                <Wrench className="w-3 h-3 text-blue-600" />
                <span className="text-blue-600 text-xs">{machines.find(m => m.id === tile.machine)?.name}</span>
              </div>
            )}
          </div>

          {tile.materials && tile.materials.length > 0 && (
            <div className="text-xs">
              <p className="text-muted-foreground mb-1">Materiały:</p>
              <p className="text-foreground truncate">{tile.materials[0]}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {tile.dxfFile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-1 text-xs text-green-600 hover:text-green-700"
                >
                  <Download className="w-3 h-3 mr-1" />
                  DXF
                </Button>
              )}
            </div>

            {tile.status === "WYCIĘTE" && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle2 className="w-3 h-3" />
                <span>{tile.completedTime}</span>
              </div>
            )}

            {tile.status === "W TRAKCIE CIĘCIA" && tile.startTime && (
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
      </CardContent>
    </Card>
  );

  const KanbanColumn = ({ title, tiles, status, icon: Icon, color }: any) => (
    <div className="flex-1 min-w-0">
      <Card
        className="h-full"
        onDrop={(e) => handleTileDrop(e, status)}
        onDragOver={handleTileDragOver}
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
        <CardContent className="max-h-96 overflow-y-auto">
          {tiles.map((tile: any) => (
            <TileCard key={tile.id} tile={tile} />
          ))}
          {tiles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Brak zadań</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ConstructorContainer size="xl" padding="lg" className="w-full">
      <ConstructorSection
        title="CNC - Tablica Kanban"
        subtitle="Zarządzanie kolejką zadań CNC i monitoring maszyn"
        spacing="lg"
      >
        {/* Header */}
        <ConstructorFlex direction="row" justify="end" align="center" gap="md">
          <ActionButton action="secondary" size="md">
            Dodaj Zadanie
          </ActionButton>
          <ActionButton action="secondary" size="md">
            Ustawienia Maszyn
          </ActionButton>
        </ConstructorFlex>

        {/* Machines Status */}
        <ConstructorGrid cols={3} gap="md">
          {machines.map((machine) => (
            <DashboardCard
              key={machine.id}
              title={machine.name}
              subtitle={machine.id}
              icon={getStatusIcon(machine.status)}
            >
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

              <div className="grid grid-cols-3 gap-2 pt-2 border-t text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Wykorzystanie</p>
                  <p className="font-semibold text-sm">{machine.utilization}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Temperatura</p>
                  <p className="font-semibold text-sm">{machine.temperature}°C</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Wrzeciono</p>
                  <p className="font-semibold text-sm">{machine.spindle} RPM</p>
                </div>
              </div>
            </DashboardCard>
          ))}
        </ConstructorGrid>

        {/* Filters */}
        <DashboardCard
          title="Filtry i wyszukiwanie"
          subtitle="Znajdź i przefiltruj zadania CNC"
          icon={<Filter className="w-5 h-5" />}
        >
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

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <KanbanColumn
          title="W KOLEJCE"
          tiles={queueTiles}
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

      {/* Statistics */}
      <ConstructorGrid cols={4} gap="md">
        <DashboardCard
          title={queueTiles.length.toString()}
          subtitle="Zadania w kolejce"
          icon={<Clock className="w-5 h-5 text-blue-600" />}
        />

        <DashboardCard
          title={inProgressTiles.length.toString()}
          subtitle="Zadania w realizacji"
          icon={<Play className="w-5 h-5 text-orange-600" />}
        />

        <DashboardCard
          title={doneTiles.length.toString()}
          subtitle="Zadania ukończone"
          icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
        />

        <DashboardCard
          title="67%"
          subtitle="Średnie wykorzystanie"
          icon={<Activity className="w-5 h-5 text-purple-600" />}
        />
      </ConstructorGrid>
    </ConstructorSection>
    </ConstructorContainer >
  );
}