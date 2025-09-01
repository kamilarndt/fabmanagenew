import { useState } from "react";
import { useTileStatus } from "../TileStatusSync";
import { TileEditModal } from "../TileEditModal";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  DollarSign, 
  FileText, 
  Users, 
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit,
  Settings,
  Download,
  BarChart3,
  Euro,
  Plus,
  Filter,
  Grid,
  Upload,
  X,
  Search,
  Layers,
  Wrench,
  Palette,
  Timer
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface PojjedynczyProjektProps {
  onBack: () => void;
}

export function PojjedynczyProjekt({ onBack }: PojjedynczyProjektProps) {
  const [activeTab, setActiveTab] = useState("podsumowanie");
  const [showTileModal, setShowTileModal] = useState(false);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [editingTile, setEditingTile] = useState<any>(null);
  const [filterBy, setFilterBy] = useState("all");
  const [groupBy, setGroupBy] = useState("zone");
  
  const { tiles, updateTileStatus, addTile, updateTile } = useTileStatus();

  // Aktualizacja danych projektu zgodnie z instrukcją 4.5
  const project = {
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
    image: "https://images.unsplash.com/photo-1720036236694-d0a231c52563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbWFudWZhY3R1cmluZyUyMHByb2plY3R8ZW58MXx8fHwxNzU2NjYxOTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Kompleksowa realizacja stoiska targowego dla firmy GR8 TECH na międzynarodowych targach w Londynie. Projekt obejmuje niestandardowe elementy wystawiennicze, systemy multimedialne oraz interaktywne strefy prezentacyjne."
  };

  // Zespół zgodnie z instrukcją 4.6
  const teamMembers = [
    { name: "Kamil Arndt", role: "Project Manager", initials: "KA" },
    { name: "Paweł Kasperovich", role: "Lead Designer", initials: "PK" },
    { name: "Łukasz Jastrzębski", role: "Senior Developer", initials: "ŁJ" },
    { name: "Anna Nowak", role: "Production Manager", initials: "AN" }
  ];

  // Kluczowe pliki zgodnie z instrukcją 4.6
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

  // Filtruj kafelki z globalnego kontekstu dla tego projektu
  const projectTiles = tiles.filter(tile => tile.project === "P-001");

  // Baza materiałów
  const materials = [
    { id: "MAT-001", name: "MDF 18mm Surowy", unit: "arkusz", price: "120 PLN", category: "Płyty" },
    { id: "MAT-002", name: "MDF 12mm Surowy", unit: "arkusz", price: "85 PLN", category: "Płyty" },
    { id: "MAT-003", name: "Laminat HPL Biały", unit: "m²", price: "45 PLN", category: "Laminaty" },
    { id: "MAT-004", name: "Krawędź ABS Biała", unit: "m", price: "12 PLN", category: "Okleiny" },
    { id: "MAT-005", name: "Farba RAL 9003", unit: "L", price: "35 PLN", category: "Farby" },
    { id: "MAT-006", name: "Taśma LED 24V", unit: "m", price: "25 PLN", category: "Elektronika" },
    { id: "MAT-007", name: "Kleiny PUR", unit: "L", price: "28 PLN", category: "Kleje" },
    { id: "MAT-008", name: "Zawiasy 35mm", unit: "szt", price: "18 PLN", category: "Okucia" },
    { id: "MAT-009", name: "Uchwyt chrom", unit: "szt", price: "15 PLN", category: "Okucia" }
  ];

  // Strefy projektu
  const zones = ["Recepcja", "Bar", "Strefa VIP", "Multimedia", "Oświetlenie", "Konstrukcje"];

  // Statusy kafelków
  const statuses = ["Projektowanie", "Do akceptacji", "W kolejce CNC", "W produkcji CNC", "Gotowy do montażu", "W montażu", "Zakończony"];

  // Członkowie zespołu dostępni do przypisania
  const assignableMembers = [
    "Kamil Arndt", "Paweł Kasperovich", "Łukasz Jastrzębski", "Anna Nowak", "Marek Kowalski", "Ewa Nowacka"
  ];

  const milestones = [
    { name: "Projekt koncepcyjny", status: "completed", date: "2024-02-15" },
    { name: "Dokumentacja techniczna", status: "completed", date: "2024-02-28" },
    { name: "Zakup sprzętu", status: "in-progress", date: "2024-03-15" },
    { name: "Montaż konstrukcji", status: "pending", date: "2024-03-30" },
    { name: "Instalacja systemów", status: "pending", date: "2024-04-10" },
    { name: "Testy i oddanie", status: "pending", date: "2024-04-20" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "W realizacji": return "bg-blue-100 text-blue-800";
      case "Projektowanie": return "bg-yellow-100 text-yellow-800";
      case "Testowanie": return "bg-green-100 text-green-800";
      case "Wycena": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Wysoki": return "bg-red-100 text-red-800";
      case "Średni": return "bg-yellow-100 text-yellow-800";
      case "Niski": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "in-progress": return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Funkcje pomocnicze dla kafelków
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

  const handleEditTile = (tile: any) => {
    setEditingTile(tile);
    setShowTileModal(true);
  };

  const handleAddTile = () => {
    setEditingTile(null);
    setShowTileModal(true);
  };

  const handleSaveTile = (tileData: any) => {
    if (editingTile) {
      // Update existing tile and sync with CNC if status changed
      updateTile(editingTile.id, tileData);
      if (tileData.status !== editingTile.status) {
        updateTileStatus(editingTile.id, tileData.status, "project");
      }
    } else {
      // Add new tile
      const newTile = {
        id: `T-${String(tiles.length + 1).padStart(3, '0')}`,
        ...tileData,
        progress: 0,
        project: "P-001",
        projectName: "Stoisko GR8 TECH"
      };
      addTile(newTile);
    }
    setShowTileModal(false);
    setEditingTile(null);
  };

  const filteredTiles = projectTiles.filter(tile => {
    if (filterBy === "all") return true;
    return tile.status === filterBy;
  });

  const groupedTiles = groupBy === "zone" 
    ? filteredTiles.reduce((acc, tile) => {
        if (!acc[tile.zone]) acc[tile.zone] = [];
        acc[tile.zone].push(tile);
        return acc;
      }, {} as Record<string, typeof projectTiles>)
    : { "Wszystkie kafelki": filteredTiles };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Powrót do projektów</span>
          <span className="sm:hidden">Powrót</span>
        </Button>
      </div>

      {/* Instrukcja 4.5: Nagłówek Projektu */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {project.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Klient:</span>
                  <span className="font-medium">{project.client}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    {project.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                ⚙️ Zarządzaj Modułami
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zakładki */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1">
          <TabsTrigger value="podsumowanie" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Podsumowanie</span>
            <span className="sm:hidden">Podsum.</span>
          </TabsTrigger>
          <TabsTrigger value="kafelki" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Kafelki / Produkcja</span>
            <span className="sm:hidden">Produkcja</span>
          </TabsTrigger>
          <TabsTrigger value="pliki" className="text-xs sm:text-sm">Pliki</TabsTrigger>
          <TabsTrigger value="wycena" className="text-xs sm:text-sm lg:col-start-4">
            <span className="hidden sm:inline">Wycena i Finanse</span>
            <span className="sm:hidden">Finanse</span>
          </TabsTrigger>
          <TabsTrigger value="zespol" className="text-xs sm:text-sm">Zespół</TabsTrigger>
          <TabsTrigger value="logistyka" className="text-xs sm:text-sm">Logistyka</TabsTrigger>
        </TabsList>

        <TabsContent value="podsumowanie" className="space-y-4 sm:space-y-6">
          {/* Instrukcja 4.6: Zawartość zakładki Podsumowanie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Karta Postęp Ogólny */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Postęp Ogólny
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray={`${project.progress}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">{project.progress}%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ukończono kafelków ({project.tilesCompleted} z {project.totalTiles})
                </p>
              </CardContent>
            </Card>

            {/* Karta Finanse Projektu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="w-5 h-5 text-green-600" />
                  Finanse Projektu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budżet:</span>
                    <span className="font-medium">{project.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Koszty materiałów:</span>
                    <span className="font-medium">{project.materialsSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Robocizna:</span>
                    <span className="font-medium">{project.laborSpent}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Przewidywana Marża:</span>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{project.expectedMargin}</div>
                        <div className="text-xs text-green-600">({project.expectedMarginPercent}%)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Karta Zespół Projektowy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Zespół Projektowy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="flex-shrink-0 w-8 h-8">
                      <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Karta Kluczowe Pliki */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Kluczowe Pliki
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {keyFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <file.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Dodatkowy opis projektu */}
          <Card>
            <CardHeader>
              <CardTitle>Opis projektu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kafelki" className="space-y-4 sm:space-y-6">
          {/* Krok 6: Widok Zakładki "Kafelki / Produkcja" */}
          
          {/* Przyciski akcji na górze */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAddTile} className="gap-2">
                <Plus className="w-4 h-4" />
                Dodaj Kafelek
              </Button>
              
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtruj" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger className="w-[160px]">
                  <Grid className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Grupuj" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zone">Grupuj wg Strefy</SelectItem>
                  <SelectItem value="none">Bez grupowania</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredTiles.length} kafelków • {filteredTiles.filter(t => t.status === "Zakończony").length} ukończonych
            </div>
          </div>

          {/* Siatka kafelków */}
          <div className="space-y-6">
            {Object.entries(groupedTiles).map(([groupName, groupTiles]) => (
              <div key={groupName}>
                {groupBy === "zone" && (
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">{groupName}</h3>
                    <Badge variant="outline" className="ml-2">
                      {groupTiles.length} kafelków
                    </Badge>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupTiles.map((tile) => (
                    <Card 
                      key={tile.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
                      onClick={() => handleEditTile(tile)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 min-w-0 flex-1">
                            <h4 className="font-medium text-sm truncate">{tile.name}</h4>
                            <p className="text-xs text-muted-foreground">{tile.id}</p>
                          </div>
                          <Badge 
                            className={`text-xs ${getTilePriorityColor(tile.priority)} flex-shrink-0`}
                          >
                            {tile.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <Badge 
                          variant="outline" 
                          className={`${getTileStatusColor(tile.status)} w-full justify-center text-xs`}
                        >
                          {tile.status}
                        </Badge>

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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pliki">
          <Card>
            <CardHeader>
              <CardTitle>Pliki projektu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tutaj będą wszystkie pliki związane z projektem: dokumentacja techniczna, 
                rysunki, specyfikacje, zdjęcia z postępu prac, itp.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wycena">
          <Card>
            <CardHeader>
              <CardTitle>Wycena i Finanse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Szczegółowa wycena projektu, faktury, płatności, koszty materiałów, 
                robocizna i analiza rentowności.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zespol">
          <Card>
            <CardHeader>
              <CardTitle>Zarządzanie zespołem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Szczegółowy widok zespołu, przypisane zadania, godziny pracy, 
                kompetencje i dostępność członków zespołu.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logistyka">
          <Card>
            <CardHeader>
              <CardTitle>Logistyka</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Zarządzanie dostawami, transport materiałów, koordynacja z dostawcami, 
                harmonogram dostaw i magazynowanie.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal edycji kafelka */}
      <TileEditModal 
        open={showTileModal}
        onOpenChange={setShowTileModal}
        onSave={handleSaveTile}
        editingTile={editingTile}
        zones={zones}
        statuses={statuses}
        assignableMembers={assignableMembers}
        materials={materials}
      />
    </div>
  );
}