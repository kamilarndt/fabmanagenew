import React, { useState, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Plus,
  Package,
  Filter,
  Grid,
  Layers,
  User,
  Timer,
  FileText,
  Euro,
  Users,
  Calendar,
  MapPin,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  Settings,
  Download,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Home,
  Search,
  Bell,
  Menu,
  Wrench
} from "lucide-react";
import { TileEditModal } from "../TileEditModal";
import { MaterialsModal } from "../MaterialsModal";
import { useProjects } from "../../utils/supabase/hooks";
import { useTileStatus } from "../TileStatusSync";
import {
  ProjectTileCard,
  StatusBadge,
  PriorityBadge,
  ZoneBadge,
  ActionButton,
  ConstructorContainer,
  ConstructorSection,
  ConstructorGrid,
  ConstructorFlex,
  ConstructorCard,
  ConstructorStack
} from "../ui-kit";
import { Input } from "../ui/input";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

interface PojjedynczyProjektCompleteProps {
  onBack: () => void;
  projectId?: string;
}

const ItemType = "PROJECT_TILE";

interface DragItem {
  id: string;
  status: string;
  source: string;
}

function PojjedynczyProjektCompleteInner({ onBack, projectId }: PojjedynczyProjektCompleteProps) {
  const [activeTab, setActiveTab] = useState("podsumowanie");
  const [showTileModal, setShowTileModal] = useState(false);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [editingTile, setEditingTile] = useState<any>(null);
  const [filterBy, setFilterBy] = useState("all");
  const [groupBy, setGroupBy] = useState("zone");
  const [dragLoading, setDragLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedZone, setSelectedZone] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const { projects } = useProjects();

  // Define missing variables
  const priorities = ["Wysoki", "Średni", "Niski"];

  // Get status icon function
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Projektowanie": return Clock;
      case "Do akceptacji": return AlertCircle;
      case "W kolejce CNC": return Package;
      case "W produkcji CNC": return Settings;
      case "Gotowy do montażu": return CheckCircle2;
      case "W montażu": return Wrench;
      case "Zakończony": return CheckCircle2;
      default: return Package;
    }
  };

  // Project data (from store or fallback)
  const fallbackProject = {
    id: "P-001",
    name: "Stoisko GR8 TECH - Londyn 2025",
    client: "GR8 TECH",
    manager: "Kamil Arndt",
    status: "W Produkcji",
    priority: "Wysoki",
    startDate: "2024-08-01",
    endDate: "2024-10-15",
    progress: 68,
    budget: "450,000 PLN",
    spent: "306,000 PLN",
    materialsSpent: "180,000 PLN",
    laborSpent: "126,000 PLN",
    expectedMargin: "144,000 PLN",
    expectedMarginPercent: 32,
    tilesCompleted: 135,
    totalTiles: 200,
    description: "Kompleksowa realizacja stoiska targowego dla firmy GR8 TECH na międzynarodowych targach w Londynie. Projekt obejmuje niestandardowe elementy wystawiennicze, systemy multimedialne oraz interaktywne strefy prezentacyjne."
  };

  const project = useMemo(() => {
    if (projects && projects.length) {
      const found = projects.find(p => p.id === projectId);
      if (found) {
        return {
          ...fallbackProject,
          id: found.id,
          name: found.name,
          client: found.client,
          manager: found.manager || fallbackProject.manager,
          status: found.status || fallbackProject.status,
          priority: found.priority || fallbackProject.priority,
          startDate: found.startDate || fallbackProject.startDate,
          endDate: found.endDate || fallbackProject.endDate,
          description: found.description || fallbackProject.description,
        };
      }
    }
    return fallbackProject;
  }, [projects, projectId]);

  // Team members
  const teamMembers = [
    { name: "Kamil Arndt", role: "Project Manager", initials: "KA" },
    { name: "Paweł Kasperovich", role: "Lead Designer", initials: "PK" },
    { name: "Łukasz Jastrzębski", role: "Senior Developer", initials: "ŁJ" },
    { name: "Anna Nowak", role: "Production Manager", initials: "AN" }
  ];

  // Key files
  const keyFiles = [
    {
      name: "Brief_Klienta.pdf",
      type: "PDF",
      size: "2.4 MB",
      date: "2024-08-01",
      icon: FileText
    },
    {
      name: "Wizualizacje_Finalne.zip",
      type: "ZIP",
      size: "45.8 MB",
      date: "2024-08-15",
      icon: Package
    },
    {
      name: "Specyfikacja_Techniczna.docx",
      type: "DOCX",
      size: "1.2 MB",
      date: "2024-08-10",
      icon: FileText
    },
    {
      name: "Rysunki_CNC.dwg",
      type: "DWG",
      size: "8.7 MB",
      date: "2024-08-20",
      icon: Edit
    }
  ];

  // Tiles from global store (filtered by project)
  const { tiles, addTile, updateTile, updateTileStatus } = useTileStatus();
  const projectTiles = useMemo(() => {
    const pid = project.id;
    return tiles.filter(t => !pid || t.project === pid);
  }, [tiles, project.id]);

  // Calculate overall progress
  const overallProgress = tiles.length > 0
    ? Math.round(tiles.reduce((sum, tile) => sum + (tile.progress || 0), 0) / tiles.length)
    : 0;

  // Materials database
  const [materials, setMaterials] = useState<any[]>([
    {
      id: "MAT-001",
      name: "MDF 18mm Surowy",
      category: "Płyty",
      unit: "arkusz",
      price: "120 PLN",
      stock: 15,
      description: "Płyta MDF 18mm surowa, wymiary 2800x2070mm"
    },
    {
      id: "MAT-002",
      name: "Laminat Biały",
      category: "Laminaty",
      unit: "m²",
      price: "45 PLN",
      stock: 50,
      description: "Laminat biały matowy, grubość 0.8mm"
    },
    {
      id: "MAT-003",
      name: "Klej PVA",
      category: "Kleje",
      unit: "L",
      price: "25 PLN",
      stock: 8,
      description: "Klej PVA do drewna, 1L"
    }
  ]);

  // Project zones
  const zones = ["Recepcja", "Bar", "Strefa VIP", "Multimedia", "Oświetlenie", "Konstrukcje"];

  // Tile statuses
  const statuses = ["Projektowanie", "Do akceptacji", "W kolejce CNC", "W produkcji CNC", "Gotowy do montażu", "W montażu", "Zakończony"];

  // Assignable team members
  const assignableMembers = [
    "Kamil Arndt", "Paweł Kasperovich", "Łukasz Jastrzębski", "Anna Nowak", "Marek Kowalski", "Ewa Nowacka"
  ];

  // Helper functions
  const getTileStatusColor = (status: string) => {
    switch (status) {
      case "Projektowanie": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Do akceptacji": return "bg-orange-100 text-orange-800 border-orange-200";
      case "W kolejce CNC": return "bg-blue-100 text-blue-800 border-blue-200";
      case "W produkcji CNC": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Gotowy do montażu": return "bg-green-100 text-green-800 border-green-200";
      case "W montażu": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Zakończony": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTilePriorityColor = (priority: string) => {
    switch (priority) {
      case "Wysoki": return "text-red-600 bg-red-50";
      case "Średni": return "text-yellow-600 bg-yellow-50";
      case "Niski": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  // Event handlers
  const handleEditTile = (tile: any) => {
    setEditingTile(tile);
    setShowTileModal(true);
  };

  const handleAddTile = () => {
    setEditingTile(null);
    setShowTileModal(true);
  };

  const handleSaveTile = async (tileData: any) => {
    if (editingTile) {
      await updateTile(editingTile.id, { ...tileData, project: project.id, projectName: project.name });
    } else {
      const newTile = {
        id: `T-${String(tiles.length + 1).padStart(3, '0')}`,
        project: project.id,
        projectName: project.name,
        progress: 0,
        ...tileData
      };
      await addTile(newTile as any);
    }
    setShowTileModal(false);
    setEditingTile(null);
  };

  const handleMaterialAdd = (material: any) => {
    setMaterials(prev => [...prev, material]);
  };

  const handleMaterialUpdate = (id: string, material: any) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, ...material } : m));
  };

  const handleMaterialDelete = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  // Enhanced drag and drop handlers
  const handleTileMove = async (tileId: string, newStatus: string) => {
    try {
      if (dragLoading) return;
      setDragLoading(true);

      // Update tile status in global store
      await updateTileStatus(tileId, newStatus, "project");

      // Update progress based on status
      let newProgress = 0;
      switch (newStatus) {
        case "Projektowanie": newProgress = 10; break;
        case "Do akceptacji": newProgress = 25; break;
        case "W kolejce CNC": newProgress = 40; break;
        case "W produkcji CNC": newProgress = 60; break;
        case "Gotowy do montażu": newProgress = 80; break;
        case "W montażu": newProgress = 95; break;
        case "Zakończony": newProgress = 100; break;
        default: newProgress = 0;
      }

      // Update tile with new progress and timestamp
      const updates: any = { progress: newProgress };
      if (newStatus === "W produkcji CNC") {
        updates.startTime = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
      } else if (newStatus === "Zakończony") {
        updates.completedTime = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
      }

      await updateTile(tileId, updates);

      showSuccessToast(`Kafelek przeniesiony do: ${newStatus}`);
    } catch (error) {
      console.error("Failed to move tile:", error);
      showErrorToast("Błąd podczas przenoszenia kafelka. Spróbuj ponownie.");
    } finally {
      setDragLoading(false);
    }
  };

  // Enhanced filtering and grouping
  const filteredAndGroupedTiles = useMemo(() => {
    let filtered = tiles.filter(tile => {
      const matchesSearch = tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tile.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tile.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "all" || tile.status === selectedStatus;
      const matchesPriority = selectedPriority === "all" || tile.priority === selectedPriority;
      const matchesZone = selectedZone === "all" || tile.zone === selectedZone;
      return matchesSearch && matchesStatus && matchesPriority && matchesZone;
    });

    if (groupBy === "status") {
      const grouped: Record<string, any[]> = {};
      statuses.forEach(status => {
        grouped[status] = filtered.filter(tile => tile.status === status);
      });
      return grouped;
    } else if (groupBy === "priority") {
      const grouped: Record<string, any[]> = {};
      priorities.forEach(priority => {
        grouped[priority] = filtered.filter(tile => tile.priority === priority);
      });
      return grouped;
    } else if (groupBy === "zone") {
      const grouped: Record<string, any[]> = {};
      zones.forEach(zone => {
        grouped[zone] = filtered.filter(tile => tile.zone === zone);
      });
      return grouped;
    } else {
      return filtered;
    }
  }, [tiles, searchTerm, selectedStatus, selectedPriority, selectedZone, groupBy, statuses, priorities, zones]);

  // Drag and Drop Components
  const DraggableTile = ({ tile }: { tile: any; key?: string }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemType,
      item: { id: tile.id, status: tile.status, source: "project" },
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
        <ProjectTileCard
          priority={tile.priority}
          status={tile.status}
          onClick={() => handleEditTile(tile)}
          className="hover:shadow-md transition-shadow active:cursor-grabbing"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0 flex-1">
                <h4 className="font-medium text-sm truncate">{tile.name}</h4>
                <p className="text-xs text-muted-foreground">{tile.id}</p>
              </div>
              <PriorityBadge priority={tile.priority} size="sm" />
            </div>

            <StatusBadge status={tile.status} size="sm" />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Postęp</span>
                <span className="font-medium">{tile.progress}%</span>
              </div>
              <Progress value={tile.progress} className="h-2" />
            </div>

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
                {tile.materials.length > 1 && (
                  <p className="text-muted-foreground">+{tile.materials.length - 1} więcej</p>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t">
              {tile.dxfFile && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <FileText className="w-3 h-3" />
                  <span>DXF</span>
                </div>
              )}
              {tile.assemblyDrawing && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Package className="w-3 h-3" />
                  <span>PDF</span>
                </div>
              )}
            </div>
          </div>
        </ProjectTileCard>
      </div>
    );
  };

  const DroppableStatusSection = ({ status, tiles, title, icon: Icon, color }: any) => {
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
      <div className="space-y-4">
        <div className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${isOver ? 'border-primary bg-primary/5' : 'border-muted'
          }`}>
          <Icon className={`w-5 h-5 ${color}`} />
          <h3 className="font-semibold text-lg">{title}</h3>
          <Badge variant="outline" className="ml-auto">
            {tiles.length}
          </Badge>
        </div>

        <ConstructorGrid cols={4} gap="md">
          {tiles.map((tile: any) => (
            <DraggableTile key={tile.id} tile={tile} />
          ))}
          {tiles.length === 0 && (
            <div className="col-span-4 text-center py-8 text-muted-foreground">
              <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Brak kafelków</p>
            </div>
          )}
        </ConstructorGrid>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {dragLoading && (
        <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-3 py-2 rounded-md shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
            <span className="text-sm">Aktualizowanie...</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Enhanced Summary Cards */}
        <ConstructorGrid cols={4} gap="lg" className="mb-8">
          <ConstructorCard variant="elevated" size="md">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{tiles.length}</div>
              <p className="text-sm text-muted-foreground">Łącznie kafelków</p>
              <Progress value={overallProgress} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">{overallProgress}% ukończone</p>
            </div>
          </ConstructorCard>

          <ConstructorCard variant="elevated" size="md">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {tiles.filter(t => t.status === "Zakończony").length}
              </div>
              <p className="text-sm text-muted-foreground">Ukończone</p>
              <div className="text-xs text-muted-foreground mt-1">
                {tiles.filter(t => t.status === "W produkcji CNC").length} w produkcji
              </div>
            </div>
          </ConstructorCard>

          <ConstructorCard variant="elevated" size="md">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {tiles.reduce((sum, tile) => sum + (tile.totalCost || 0), 0).toFixed(0)} PLN
              </div>
              <p className="text-sm text-muted-foreground">Łączny koszt</p>
              <div className="text-xs text-muted-foreground mt-1">
                {materials.length} materiałów w bazie
              </div>
            </div>
          </ConstructorCard>

          <ConstructorCard variant="elevated" size="md">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {tiles.filter(t => t.priority === "Wysoki").length}
              </div>
              <p className="text-sm text-muted-foreground">Wysoki priorytet</p>
              <div className="text-xs text-muted-foreground mt-1">
                {tiles.filter(t => t.priority === "Średni").length} średni
              </div>
            </div>
          </ConstructorCard>
        </ConstructorGrid>

        {/* Enhanced Controls */}
        <ConstructorCard variant="elevated" size="lg" className="mb-6">
          <div className="space-y-4">
            <ConstructorFlex direction="row" justify="between" align="center" gap="md">
              <h2 className="text-xl font-semibold">Kafelki Projektu</h2>
              <ConstructorFlex gap="md">
                <ActionButton
                  action="add"
                  size="sm"
                  onClick={() => setShowTileModal(true)}
                >
                  Dodaj Kafelek
                </ActionButton>
                <ActionButton
                  action="settings"
                  size="sm"
                  onClick={() => setShowMaterialsModal(true)}
                >
                  Baza Materiałów
                </ActionButton>
              </ConstructorFlex>
            </ConstructorFlex>

            <ConstructorFlex direction="row" justify="between" align="center" gap="md" className="flex-col sm:flex-row">
              <ConstructorFlex gap="md" wrap="wrap" className="flex-1">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Szukaj kafelków..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie statusy</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Priorytet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie priorytety</SelectItem>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Strefa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie strefy</SelectItem>
                    {zones.map((zone) => (
                      <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={groupBy} onValueChange={setGroupBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Grupuj wg" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Brak grupowania</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="priority">Priorytet</SelectItem>
                    <SelectItem value="zone">Strefa</SelectItem>
                  </SelectContent>
                </Select>
              </ConstructorFlex>

              <ConstructorFlex gap="md">
                <div className="flex border rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-2 text-sm ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-background"}`}
                  >
                    Siatka
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 text-sm ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background"}`}
                  >
                    Lista
                  </button>
                </div>
              </ConstructorFlex>
            </ConstructorFlex>
          </div>
        </ConstructorCard>

        {/* Enhanced Tiles Display */}
        {groupBy !== "none" ? (
          <ConstructorStack gap="lg">
            {Object.entries(filteredAndGroupedTiles as Record<string, any[]>).map(([group, groupTiles]) => (
              <DroppableStatusSection
                key={group}
                status={group}
                tiles={groupTiles}
                title={group}
                icon={getStatusIcon(group)}
                color="text-primary"
              />
            ))}
          </ConstructorStack>
        ) : (
          viewMode === "grid" ? (
            <ConstructorGrid cols={4} gap="md">
              {filteredAndGroupedTiles.map((tile: any) => (
                <DraggableTile key={tile.id} tile={tile} />
              ))}
            </ConstructorGrid>
          ) : (
            <div className="space-y-2">
              {filteredAndGroupedTiles.map((tile: any) => (
                <DraggableTile key={tile.id} tile={tile} />
              ))}
            </div>
          )
        )}

        {filteredAndGroupedTiles.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Brak kafelków</h3>
            <p className="text-sm mb-4">
              {searchTerm || selectedStatus !== "all" || selectedPriority !== "all" || selectedZone !== "all"
                ? "Nie znaleziono kafelków spełniających kryteria wyszukiwania"
                : "Nie ma jeszcze żadnych kafelków w tym projekcie"
              }
            </p>
            <ActionButton
              action="add"
              size="md"
              onClick={() => setShowTileModal(true)}
            >
              Dodaj Pierwszy Kafelek
            </ActionButton>
          </div>
        )}
      </div>

      {/* Enhanced Tile Edit Modal */}
      <TileEditModal
        open={showTileModal}
        onOpenChange={setShowTileModal}
        onSave={handleSaveTile}
        editingTile={editingTile}
        zones={zones}
        statuses={statuses}
        assignableMembers={assignableMembers}
        materials={materials}
        onMaterialAdd={handleMaterialAdd}
        onMaterialUpdate={handleMaterialUpdate}
        onMaterialDelete={handleMaterialDelete}
      />

      {/* Materials Modal */}
      <MaterialsModal
        open={showMaterialsModal}
        onOpenChange={setShowMaterialsModal}
        materials={materials}
        onMaterialAdd={handleMaterialAdd}
        onMaterialUpdate={handleMaterialUpdate}
        onMaterialDelete={handleMaterialDelete}
      />
    </div>
  );
}

export function PojjedynczyProjektComplete({ onBack, projectId }: PojjedynczyProjektCompleteProps) {
  // Detect if device supports touch
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const backend = isTouchDevice ? TouchBackend : HTML5Backend;

  const touchBackendOptions = {
    enableMouseEvents: true,
    delayTouchStart: 200,
  };

  return (
    <DndProvider backend={backend} options={isTouchDevice ? touchBackendOptions : undefined}>
      <PojjedynczyProjektCompleteInner onBack={onBack} projectId={projectId} />
    </DndProvider>
  );
}