import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import {
  ConstructorCard,
  ProjectTileCard,
  DashboardCard,
  StatusBadge,
  PriorityBadge,
  ZoneBadge,
  ActionButton,
  ConstructorContainer,
  ConstructorSection,
  ConstructorGrid,
  ConstructorFlex,
  ConstructorStack
} from "./index";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import {
  Clock,
  Play,
  CheckCircle2,
  Settings,
  Package,
  User,
  Timer,
  FileText,
  TrendingUp,
  BarChart3,
  Zap,
  Calendar,
  RefreshCw,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

const ItemType = "DEMO_TILE";

interface DragItem {
  id: string;
  status: string;
  source: string;
}

function ConstructorDemoInner() {
  const [activeTab, setActiveTab] = useState("components");
  const [dragLoading, setDragLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Demo data for Sprint 2 showcase
  const demoTiles = [
    {
      id: "T-001",
      name: "Panel główny recepcji",
      zone: "Recepcja",
      status: "W produkcji CNC",
      assignedTo: "Paweł Kasperovich",
      materials: ["MDF 18mm Surowy - 1 arkusz", "Krawędź ABS Biała - 3m"],
      dxfFile: "panel_recepcji_001.dxf",
      priority: "Wysoki",
      estimatedTime: "4h",
      progress: 73,
      project: "P-001",
      projectName: "Stoisko GR8 TECH",
      machine: "CNC-001",
      startTime: "08:30"
    },
    {
      id: "T-002",
      name: "Blat recepcji L-kształtny",
      zone: "Recepcja",
      status: "W kolejce CNC",
      assignedTo: "Łukasz Jastrzębski",
      materials: ["Laminat HPL Biały - 1.2 x 3m", "Kleiny PUR - 1L"],
      dxfFile: "blat_recepcji_L.dxf",
      priority: "Średni",
      estimatedTime: "6h",
      progress: 40,
      project: "P-001",
      projectName: "Stoisko GR8 TECH"
    },
    {
      id: "T-003",
      name: "Oświetlenie LED pod blatem",
      zone: "Recepcja",
      status: "Gotowy do montażu",
      assignedTo: "Anna Nowak",
      materials: ["Taśma LED 24V - 5m", "Profil aluminiowy - 3m"],
      dxfFile: "led_profil_003.dxf",
      priority: "Niski",
      estimatedTime: "3h",
      progress: 80,
      project: "P-001",
      projectName: "Stoisko GR8 TECH"
    }
  ];

  const cncStatuses = ["W KOLEJCE", "W TRAKCIE CIĘCIA", "WYCIĘTE"];
  const projectStatuses = ["Projektowanie", "Do akceptacji", "W kolejce CNC", "W produkcji CNC", "Gotowy do montażu", "W montażu", "Zakończony"];

  // Demo drag and drop functionality
  const handleTileMove = async (tileId: string, newStatus: string) => {
    setDragLoading(true);
    // Simulate API call
    setTimeout(() => {
      setDragLoading(false);
      setLastUpdate(new Date());
    }, 1000);
  };

  // Demo components
  const DemoComponents = () => (
    <ConstructorContainer>
      <ConstructorSection>
        <h2 className="text-2xl font-bold mb-6">Constructor X 6.0 UI Kit Components</h2>

        <ConstructorGrid cols={3} gap="lg">
          <DashboardCard>
            <div className="space-y-4">
              <h3 className="font-semibold">Dashboard Card</h3>
              <p className="text-sm text-muted-foreground">Primary card component for dashboard layouts</p>
              <div className="flex gap-2">
                <StatusBadge status="Aktywny" size="sm" />
                <PriorityBadge priority="Wysoki" size="sm" />
              </div>
            </div>
          </DashboardCard>

          <ProjectTileCard priority="Średni" status="W trakcie" onClick={() => { }}>
            <div className="space-y-3">
              <h3 className="font-semibold">Project Tile Card</h3>
              <p className="text-sm text-muted-foreground">Specialized card for project tiles</p>
              <div className="flex gap-2">
                <ZoneBadge zone="Recepcja" size="sm" />
                <StatusBadge status="W trakcie" size="sm" />
              </div>
            </div>
          </ProjectTileCard>

          <ConstructorCard variant="elevated" size="lg">
            <div className="space-y-4">
              <h3 className="font-semibold">Constructor Card</h3>
              <p className="text-sm text-muted-foreground">Flexible card component with variants</p>
              <div className="flex gap-2">
                <ActionButton action="add" size="sm">Dodaj</ActionButton>
                <ActionButton action="edit" size="sm">Edytuj</ActionButton>
              </div>
            </div>
          </ConstructorCard>
        </ConstructorGrid>

        <ConstructorStack gap="lg" className="mt-8">
          <h3 className="text-xl font-semibold">Badge System</h3>
          <ConstructorFlex gap="md" wrap="wrap">
            <StatusBadge status="Aktywny" />
            <StatusBadge status="W trakcie" />
            <StatusBadge status="Zakończony" />
            <PriorityBadge priority="Wysoki" />
            <PriorityBadge priority="Średni" />
            <PriorityBadge priority="Niski" />
            <ZoneBadge zone="Recepcja" />
            <ZoneBadge zone="Bar" />
          </ConstructorFlex>
        </ConstructorStack>

        <ConstructorStack gap="lg" className="mt-8">
          <h3 className="text-xl font-semibold">Action Buttons</h3>
          <ConstructorFlex gap="md" wrap="wrap">
            <ActionButton action="add" size="lg">Dodaj Nowy</ActionButton>
            <ActionButton action="edit" size="md">Edytuj</ActionButton>
            <ActionButton action="delete" size="sm">Usuń</ActionButton>
            <ActionButton action="view" size="sm">Podgląd</ActionButton>
          </ConstructorFlex>
        </ConstructorStack>
      </ConstructorSection>
    </ConstructorContainer>
  );

  // Demo Sprint 2 functionality
  const DemoSprint2 = () => (
    <ConstructorContainer>
      <ConstructorSection>
        <h2 className="text-2xl font-bold mb-6">🚀 Sprint 2: Bidirectional Synchronization Demo</h2>

        {dragLoading && (
          <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-3 py-2 rounded-md shadow-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
              <span className="text-sm">Aktualizowanie...</span>
            </div>
          </div>
        )}

        {/* Real-time Updates Header */}
        <div className="bg-muted/50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Real-Time Synchronization</h3>
              <p className="text-sm text-muted-foreground">Bidirectional sync between Project View and CNC Kanban</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Ostatnia aktualizacja: {lastUpdate.toLocaleTimeString('pl-PL')}</span>
              <button
                onClick={() => setLastUpdate(new Date())}
                className="p-1 hover:bg-muted rounded"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Project View Demo */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📋 Project View - Drag & Drop Between Statuses
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {projectStatuses.slice(0, 3).map((status) => {
              const statusTiles = demoTiles.filter(tile => {
                if (status === "W kolejce CNC") return tile.status === "W kolejce CNC";
                if (status === "W produkcji CNC") return tile.status === "W produkcji CNC";
                if (status === "Gotowy do montażu") return tile.status === "Gotowy do montażu";
                return false;
              });

              const getStatusIcon = (s: string) => {
                switch (s) {
                  case "Projektowanie": return Clock;
                  case "Do akceptacji": return Package;
                  case "W kolejce CNC": return Package;
                  case "W produkcji CNC": return Settings;
                  case "Gotowy do montażu": return CheckCircle2;
                  default: return Package;
                }
              };

              const getStatusColor = (s: string) => {
                switch (s) {
                  case "Projektowanie": return "text-yellow-600";
                  case "Do akceptacji": return "text-orange-600";
                  case "W kolejce CNC": return "text-blue-600";
                  case "W produkcji CNC": return "text-purple-600";
                  case "Gotowy do montażu": return "text-green-600";
                  default: return "text-gray-600";
                }
              };

              const StatusIcon = getStatusIcon(status);

              return (
                <div key={status} className="space-y-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg border-2 border-muted">
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(status)}`} />
                    <h4 className="font-semibold">{status}</h4>
                    <Badge variant="outline" className="ml-auto">
                      {statusTiles.length}
                    </Badge>
                  </div>

                  <ConstructorStack gap="md">
                    {statusTiles.map((tile) => (
                      <ProjectTileCard
                        key={tile.id}
                        priority={tile.priority}
                        status={tile.status}
                        onClick={() => { }}
                        className="cursor-grab hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h5 className="font-medium text-sm truncate">{tile.name}</h5>
                              <p className="text-xs text-muted-foreground">{tile.id}</p>
                            </div>
                            <PriorityBadge priority={tile.priority} size="sm" />
                          </div>

                          <StatusBadge status={tile.status} size="sm" />

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Postęp</span>
                              <span className="font-medium">{tile.progress}%</span>
                            </div>
                            <Progress value={tile.progress} className="h-2" />
                          </div>

                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span className="truncate">{tile.assignedTo}</span>
                          </div>
                        </div>
                      </ProjectTileCard>
                    ))}
                  </ConstructorStack>
                </div>
              );
            })}
          </div>
        </div>

        {/* CNC Kanban Demo */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            CNC Kanban - Production Workflow Management
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {cncStatuses.map((status) => {
              const statusTiles = demoTiles.filter(tile => {
                if (status === "W KOLEJCE") return tile.status === "W kolejce CNC";
                if (status === "W TRAKCIE CIĘCIA") return tile.status === "W produkcji CNC";
                if (status === "WYCIĘTE") return tile.status === "Gotowy do montażu";
                return false;
              });

              const getStatusIcon = (s: string) => {
                switch (s) {
                  case "W KOLEJCE": return Clock;
                  case "W TRAKCIE CIĘCIA": return Play;
                  case "WYCIĘTE": return CheckCircle2;
                  default: return Package;
                }
              };

              const getStatusColor = (s: string) => {
                switch (s) {
                  case "W KOLEJCE": return "text-yellow-600";
                  case "W TRAKCIE CIĘCIA": return "text-blue-600";
                  case "WYCIĘTE": return "text-green-600";
                  default: return "text-gray-600";
                }
              };

              const StatusIcon = getStatusIcon(status);

              return (
                <div key={status} className="space-y-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg border-2 border-muted">
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(status)}`} />
                    <h4 className="font-semibold">{status}</h4>
                    <Badge variant="outline" className="ml-auto">
                      {statusTiles.length}
                    </Badge>
                  </div>

                  <ConstructorStack gap="md">
                    {statusTiles.map((tile) => (
                      <ConstructorCard
                        key={tile.id}
                        variant="elevated"
                        size="md"
                        className="cursor-grab hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h5 className="font-medium text-sm truncate">{tile.name}</h5>
                              <p className="text-xs text-muted-foreground">{tile.id} • {tile.projectName}</p>
                            </div>
                            <PriorityBadge priority={tile.priority} size="sm" />
                          </div>

                          {status === "W TRAKCIE CIĘCIA" && tile.progress && (
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
                              <span className="text-muted-foreground">{tile.estimatedTime}</span>
                            </div>
                          </div>

                          {tile.materials.length > 0 && (
                            <div className="text-xs">
                              <p className="text-muted-foreground mb-1">Materiały:</p>
                              <p className="text-foreground truncate">{tile.materials[0]}</p>
                            </div>
                          )}
                        </div>
                      </ConstructorCard>
                    ))}
                  </ConstructorStack>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Machine Monitoring Demo */}
        <div>
          <h3 className="text-xl font-semibold mb-4">🏭 Enhanced Machine Monitoring</h3>

          <ConstructorGrid cols={3} gap="md">
            {[
              {
                id: "CNC-001",
                name: "HAAS VF-2",
                status: "Aktywna",
                currentJob: "Panel główny recepcji - T-001",
                progress: 73,
                efficiency: 94,
                quality: 98,
                utilization: 92,
                maintenance: "2024-12-15"
              },
              {
                id: "CNC-002",
                name: "DMG MORI NLX",
                status: "Konserwacja",
                currentJob: "Brak",
                progress: 0,
                efficiency: 0,
                quality: 0,
                utilization: 0,
                maintenance: "2024-12-20"
              },
              {
                id: "CNC-003",
                name: "OKUMA LB3000",
                status: "Oczekiwanie",
                currentJob: "Gotowy do pracy",
                progress: 0,
                efficiency: 87,
                quality: 96,
                utilization: 0,
                maintenance: "2024-12-25"
              }
            ].map((machine) => (
              <DashboardCard key={machine.id} className="hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{machine.name}</h4>
                      <p className="text-sm text-muted-foreground">{machine.id}</p>
                    </div>
                    <Badge className={`${machine.status === "Aktywna" ? "bg-green-100 text-green-800" :
                      machine.status === "Oczekiwanie" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                      {machine.status}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Bieżące zadanie:</p>
                    <p className="text-sm text-muted-foreground">{machine.currentJob}</p>
                  </div>

                  {machine.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Postęp</span>
                        <span>{machine.progress}%</span>
                      </div>
                      <Progress value={machine.progress} className="h-2" />
                    </div>
                  )}

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
                </div>
              </DashboardCard>
            ))}
          </ConstructorGrid>
        </div>
      </ConstructorSection>
    </ConstructorContainer>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold">Constructor X 6.0 UI Kit + Sprint 2 Demo</h1>
          <p className="text-muted-foreground mt-2">
            Showcasing the complete UI Kit and Sprint 2 bidirectional synchronization features
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("components")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "components"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
              }`}
          >
            🎨 UI Kit Components
          </button>
          <button
            onClick={() => setActiveTab("sprint2")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "sprint2"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
              }`}
          >
            🚀 Sprint 2: Bidirectional Sync
          </button>
        </div>

        {activeTab === "components" ? <DemoComponents /> : <DemoSprint2 />}
      </div>
    </div>
  );
}

export function ConstructorDemo() {
  // Detect if device supports touch
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const backend = isTouchDevice ? TouchBackend : HTML5Backend;

  const touchBackendOptions = {
    enableMouseEvents: true,
    delayTouchStart: 200,
  };

  return (
    <DndProvider backend={backend} options={isTouchDevice ? touchBackendOptions : undefined}>
      <ConstructorDemoInner />
    </DndProvider>
  );
}
