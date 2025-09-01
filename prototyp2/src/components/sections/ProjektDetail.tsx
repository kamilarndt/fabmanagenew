import { useState, useEffect } from "react";
import { useTileStatus } from "../TileStatusSync";
import { TileEditModal } from "../TileEditModal";
import { EditProjectModal } from "../EditProjectModal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Star, 
  Share, 
  Edit, 
  Users, 
  Calendar, 
  File, 
  MoreHorizontal,
  Phone,
  Mail,
  Reply,
  Paperclip,
  Filter,
  Grid,
  Layers,
  Timer,
  User,
  Package,
  FileText,
  Euro,
  BarChart3,
  Download,
  Settings,
  Eye,
  MessageSquare,
  Bell
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import svgPaths from "../../imports/svg-9lkymufk9g";
import { mockProjects, getProjectDisplayData } from "../../utils/mockData";

interface ProjektDetailProps {
  projectId?: string | null;
  onBack: () => void;
}

export function ProjektDetail({ projectId, onBack }: ProjektDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newComment, setNewComment] = useState("");
  const [showTileModal, setShowTileModal] = useState(false);
  const [editingTile, setEditingTile] = useState<any>(null);
  const [filterBy, setFilterBy] = useState("all");
  const [groupBy, setGroupBy] = useState("zone");
  const [showEditModal, setShowEditModal] = useState(false);
  
  const { tiles, updateTileStatus, addTile, updateTile, getTilesByProject, refreshData } = useTileStatus();

  // Find the current project or default to first one
  const currentProject = mockProjects.find(p => p.id === projectId) || mockProjects[0];
  
  const [projectState, setProjectState] = useState(currentProject);
  const [commentsState, setCommentsState] = useState([
    {
      id: 1,
      user: currentProject.manager,
      content: `Projekt ${currentProject.name} przebiega zgodnie z harmonogramem. Zespół pracuje wydajnie nad realizacją zadań w fazie ${currentProject.stage}.`,
      time: "30 Sierpień 2024, 16:45",
      avatar: (currentProject.manager || '').split(' ').map(n => n[0]).join(''),
      replies: []
    },
  ]);

  // Use projectState if updated, otherwise use currentProject
  const activeProject = projectState.id === currentProject.id ? projectState : currentProject;

  // Update project state when projectId changes and refresh tiles
  useEffect(() => {
    if (currentProject && projectState.id !== currentProject.id) {
      setProjectState(currentProject);
      setCommentsState([{
        id: 1,
        user: currentProject.manager,
        content: `Projekt ${currentProject.name} przebiega zgodnie z harmonogramem. Zespół pracuje wydajnie nad realizacją zadań w fazie ${currentProject.stage}.`,
        time: "30 Sierpień 2024, 16:45",
        avatar: (currentProject.manager || '').split(' ').map(n => n[0]).join(''),
        replies: []
      }]);
      
      // Refresh tiles data to ensure we have latest data including any missing tiles
      refreshData();
    }
  }, [currentProject, projectState.id, refreshData]);

  // Transform project data using centralized function
  const projectData = getProjectDisplayData(activeProject);

  // Comments and activities
  const activities = [
    {
      id: 1,
      user: activeProject.manager,
      action: "Rozpoczęcie fazy produkcji",
      description: "zmienił status projektu na W realizacji",
      time: "01/09/25, 09:00",
      avatar: (activeProject.manager || '').split(' ').map(n => n[0]).join('')
    },
    {
      id: 2,
      user: typeof activeProject.team[1] === 'string' ? activeProject.team[1] : (activeProject.team[1]?.name || activeProject.manager),
      action: "Aktualizacja postępu", 
      description: `zaktualizował postęp do ${activeProject.progress}%`,
      time: "28/08/25, 14:30",
      avatar: (typeof activeProject.team[1] === 'string' ? activeProject.team[1] : (activeProject.team[1]?.name || activeProject.manager) || '').split(' ').map(n => n[0]).join(''),
      statusChange: { from: "Projektowanie", to: activeProject.status }
    },
  ];

  const comments = [
    {
      id: 1,
      user: currentProject.manager,
      content: `Projekt ${currentProject.name} przebiega zgodnie z harmonogramem. Zespół pracuje wydajnie nad realizacją zadań w fazie ${currentProject.stage}.`,
      time: "30 Sierpień 2024, 16:45",
      avatar: (currentProject.manager || '').split(' ').map(n => n[0]).join(''),
      replies: []
    },
  ];

  // Generate unique tiles for each project
  const generateProjectTiles = (projectId: string, projectName: string) => {
    const baseNames = [
      "Płyta montażowa główna",
      "Elementy konstrukcyjne", 
      "Panele boczne",
      "System mocowań",
      "Osłony bezpieczeństwa",
      "Komponenty elektryczne",
      "Elementy pneumatyczne",
      "Podstawa maszyny"
    ];
    
    return baseNames.map((name, index) => ({
      id: `${projectId}-T-${String(index + 1).padStart(3, '0')}`,
      name: `${name} - ${projectName.split(' ').slice(0, 3).join(' ')}`,
      status: ["Projektowanie", "Do akceptacji", "W kolejce CNC", "W produkcji CNC", "Gotowy do montażu"][Math.floor(Math.random() * 5)],
      project: projectId,
      projectName: projectName,
      zone: ["Strefa A", "Strefa B", "Strefa C", "Strefa D"][Math.floor(Math.random() * 4)],
      assignedTo: typeof activeProject.team[Math.floor(Math.random() * activeProject.team.length)] === 'string' 
        ? activeProject.team[Math.floor(Math.random() * activeProject.team.length)] 
        : activeProject.team[Math.floor(Math.random() * activeProject.team.length)].name || '',
      priority: ["Wysoki", "Średni", "Niski"][Math.floor(Math.random() * 3)],
      estimatedTime: `${Math.floor(Math.random() * 40) + 10}h`,
      progress: Math.floor(Math.random() * 100),
      materials: ["Stal S355", "Aluminium 6061", "Płyta HPL"][Math.floor(Math.random() * 3)]
    }));
  };

  // Tile management data
  const zones = ["Strefa A", "Strefa B", "Strefa C", "Strefa D"];
  const statuses = ["Projektowanie", "Do akceptacji", "W kolejce CNC", "W produkcji CNC", "Gotowy do montażu", "W montażu", "Zakończony"];
  const assignableMembers = activeProject.team.map(member => 
    typeof member === 'string' ? member : member.name || ''
  );
  const materials = [
    { id: "MAT-001", name: "Stal S355", unit: "kg", price: "4.50 PLN", category: "Metale" },
    { id: "MAT-002", name: "Aluminium 6061", unit: "kg", price: "12.80 PLN", category: "Metale" },
    { id: "MAT-003", name: "Płyta HPL 12mm", unit: "arkusz", price: "180 PLN", category: "Płyty" },
  ];

  // Get project tiles from global state using centralized function
  const projectTiles = getTilesByProject(activeProject.id);

  const handlePostComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: commentsState.length + 1,
        user: "Ty", // In a real app, this would be the current user
        content: newComment,
        time: new Date().toLocaleDateString('pl-PL', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        avatar: "TY",
        replies: []
      };
      setCommentsState(prev => [newCommentObj, ...prev]);
      setNewComment("");
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

  const handleSaveTile = async (tileData: any) => {
    try {
      if (editingTile) {
        await updateTile(editingTile.id, tileData);
        if (tileData.status !== editingTile.status) {
          await updateTileStatus(editingTile.id, tileData.status, "project");
        }
      } else {
        const newTile = {
          id: `${activeProject.id}-T-${String(Date.now()).slice(-3)}`,
          ...tileData,
          progress: 0,
          project: activeProject.id,
          projectName: activeProject.name
        };
        await addTile(newTile);
      }
      setShowTileModal(false);
      setEditingTile(null);
    } catch (error) {
      console.error('Error saving tile:', error);
    }
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

  const handleEditProject = () => {
    setShowEditModal(true);
  };

  const handleSaveProject = (updatedProject: any) => {
    setProjectState(updatedProject);
    // In a real app, you would also call an API to save the changes
  };

  return (
    <div className="min-h-screen bg-background font-plus-jakarta">
      {/* Page Header with Breadcrumb */}
      <div className="bg-white border-b border-[#e6e7e8]/25">
        <div className="flex items-center justify-between px-8 py-3.5">
          {/* Breadcrumb with Back Button */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót do projektów
            </Button>
            <div className="flex items-center gap-1 px-1 py-0.5">
              <div className="w-5 h-5 text-[#69686d]">
                <svg fill="none" viewBox="0 0 20 20">
                  <path d={svgPaths.p2c027880} fill="currentColor" opacity="0.5" />
                  <g>
                    <path d={svgPaths.p27ce5a80} fill="currentColor" />
                    <path d={svgPaths.p2fbf8d00} fill="currentColor" />
                    <path d={svgPaths.p3652d800} fill="currentColor" />
                  </g>
                </svg>
              </div>
              <span className="text-sm text-[#69686d] font-medium">Dashboard</span>
            </div>
            <span className="text-sm text-[#69686d] font-medium">/</span>
            <div className="px-1 py-0.5">
              <span className="text-sm text-[#69686d] font-medium">Projekty</span>
            </div>
            <span className="text-sm text-[#69686d] font-medium">/</span>
            <div className="px-1 py-0.5">
              <span className="text-sm text-[#171a26] font-medium">{projectData.name}</span>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-2.5">
            <div className="bg-white border border-[#e8e8e9] rounded-[12px] px-3 py-2.5 w-[260px]">
              <div className="flex items-center gap-1.5">
                <Search className="w-5 h-5 text-[#69686d]" />
                <Input 
                  placeholder="Szukaj..." 
                  className="border-0 p-0 text-sm placeholder:text-[#69686d] focus-visible:ring-0"
                />
                <span className="text-sm text-[#69686d]">⌘+F</span>
              </div>
            </div>

            <Button variant="ghost" className="p-[10px] rounded-[12px]">
              <Star className="w-5 h-5 text-[#69686d]" />
            </Button>
            <Button variant="outline" className="border-[#e8e8e9] rounded-[12px] px-[10px] py-2 gap-2">
              <Share className="w-5 h-5 text-[#69686d]" />
              <span className="text-sm font-semibold text-[#69686d]">Udostępnij</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              ⚙️ Zarządzaj Modułami
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-44 project-detail-gradient-bg rounded-[16px] mx-2 mt-2" />
        <div className="px-8 pb-2 pt-[140px] relative">
          <div className="flex flex-col gap-6">
            {/* Project Avatar and Info */}
            <div className="flex items-end justify-between w-full">
              <div className="flex flex-col gap-4">
                <div className="bg-white border border-[#e8e8e9] rounded-full size-[88px] flex items-center justify-center">
                  <span className="text-2xl font-bold">{activeProject.name.charAt(0)}</span>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-[#171a26] font-plus-jakarta mb-4">
                      {projectData.name}
                    </h1>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-[#fff1e9] border-[#fdd4ba] text-[#fa7522] px-3 py-1.5 rounded-full">
                        {projectData.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-5 h-5 text-[#69686d]" />
                        <span className="text-sm text-[#69686d]">{projectData.startDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-[#e8e8e9] rounded-full flex items-center justify-center">
                          <span className="text-xs">{projectData.manager.charAt(0)}</span>
                        </div>
                        <span className="text-sm text-[#69686d]">{projectData.manager}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team and Actions */}
              <div className="flex items-center gap-4">
                <div className="flex items-center pr-3">
                  {projectData.team.slice(0, 3).map((member, index) => (
                    <div 
                      key={member.id}
                      className="w-11 h-11 bg-[#f0f0f0] rounded-full border-2 border-white -mr-3 flex items-center justify-center"
                    >
                      <span className="text-sm font-medium">{member.avatar}</span>
                    </div>
                  ))}
                  <div className="w-11 h-11 bg-[#f0f0f0] rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-sm font-semibold text-[#171a26]">+{projectData.team.length - 3}</span>
                  </div>
                </div>
                <Button variant="outline" className="border-[#d1d0d2] text-[#69686d] px-3.5 py-3 rounded-[12px] gap-1.5">
                  <Users className="w-5 h-5" />
                  <span className="font-bold text-sm">Zaproś</span>
                </Button>
                <div className="w-0 h-11 border-l border-[#f0f0f0]" />
                <Button variant="outline" className="border-[#d1d0d2] p-3 rounded-[12px]">
                  <Plus className="w-5 h-5 text-[#69686d]" />
                </Button>
                <Button 
                  onClick={handleEditProject}
                  className="project-modal-gradient-btn text-white px-3.5 py-3 rounded-[12px] gap-1.5"
                >
                  <Edit className="w-5 h-5" />
                  <span className="font-bold text-sm">Edytuj</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="bg-white border-b border-[#e6e7e8]">
        <div className="px-8 pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b-0 gap-4 h-auto p-0">
              <TabsTrigger 
                value="overview" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none pb-3.5 px-1 font-plus-jakarta font-bold"
              >
                Przegląd
              </TabsTrigger>
              <TabsTrigger 
                value="kafelki" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none pb-3.5 px-1 font-plus-jakarta font-semibold text-[#69686d]"
              >
                Kafelki / Produkcja
              </TabsTrigger>
              <TabsTrigger 
                value="pliki" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none pb-3.5 px-1 font-plus-jakarta font-semibold text-[#69686d]"
              >
                Pliki
              </TabsTrigger>
              <TabsTrigger 
                value="wycena" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none pb-3.5 px-1 font-plus-jakarta font-semibold text-[#69686d]"
              >
                Wycena i Finanse
              </TabsTrigger>
              <TabsTrigger 
                value="zespol" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none pb-3.5 px-1 font-plus-jakarta font-semibold text-[#69686d]"
              >
                Zespół
              </TabsTrigger>
              <TabsTrigger 
                value="logistyka" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none pb-3.5 px-1 font-plus-jakarta font-semibold text-[#69686d]"
              >
                Logistyka
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="overview" className="mt-8">
              <div className="flex gap-4">
                {/* Left Column - Main Content */}
                <div className="flex-1 space-y-4">
                  {/* About Project */}
                  <div className="bg-white border border-[#e8e8e9] rounded-[20px] p-6">
                    <h3 className="text-lg font-semibold text-[#171a26] mb-3 font-plus-jakarta">
                      O Projekcie
                    </h3>
                    <p className="text-sm text-[#69686d] leading-5">
                      {projectData.description}
                    </p>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Progress Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                          Postęp
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center space-y-4">
                        <div className="relative w-20 h-20 mx-auto">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
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
                              strokeDasharray={`${projectData.progress}, 100`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-blue-600">{projectData.progress}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Budget Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Euro className="w-5 h-5 text-green-600" />
                          Budżet
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Wydano:</span>
                          <span className="font-medium">{projectData.currency} {projectData.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Budżet:</span>
                          <span className="font-medium">{projectData.currency} {projectData.maxBudget.toLocaleString()}</span>
                        </div>
                        <Progress value={(projectData.budget / projectData.maxBudget) * 100} />
                      </CardContent>
                    </Card>

                    {/* Team Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-600" />
                          Zespół
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{projectData.team.length}</div>
                        <p className="text-sm text-muted-foreground">członków</p>
                      </CardContent>
                    </Card>

                    {/* Files Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-orange-600" />
                          Pliki
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{projectData.attachments.length}</div>
                        <p className="text-sm text-muted-foreground">załączników</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Activities */}
                  <div className="bg-white border border-[#e8e8e9] rounded-[20px] p-6">
                    <h3 className="text-lg font-semibold text-[#171a26] mb-[18px] font-plus-jakarta">
                      Aktywność
                    </h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex gap-2">
                          <div className="flex flex-col items-center">
                            <div className="w-9 h-9 bg-[#f0f0f0] rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">{activity.avatar}</span>
                            </div>
                            <div className="w-px h-16 bg-[#e8e8e9] mt-1" />
                          </div>
                          <div className="flex-1 pb-5">
                            <div className="flex items-center justify-between mb-2.5">
                              <h4 className="font-semibold text-[#171a26] text-base">
                                {activity.action}
                              </h4>
                              <Button variant="ghost" size="sm" className="p-2">
                                <MoreHorizontal className="w-4 h-4 text-[#69686d]" />
                              </Button>
                            </div>
                            <p className="text-sm text-[#4b4a4d] mb-2.5">
                              <span className="font-semibold text-[#0167ff]">{activity.user}</span> {activity.description}
                            </p>
                            {activity.statusChange && (
                              <div className="flex items-center gap-2 mb-2.5">
                                <Badge className="bg-[#fff1e9] border-[#fdd4ba] text-[#fa7522] px-2.5 py-1 rounded-full">
                                  {activity.statusChange.from}
                                </Badge>
                                <span className="text-[#69686d]">→</span>
                                <Badge className="bg-[#e7f7ed] border-[#b5e7c7] text-[#0fa144] px-2.5 py-1 rounded-full">
                                  {activity.statusChange.to}
                                </Badge>
                              </div>
                            )}
                            <p className="text-xs text-[#87868a]">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="bg-white border border-[#e8e8e9] rounded-[20px] p-6">
                    <h3 className="text-lg font-semibold text-[#171a26] mb-[18px] font-plus-jakarta">
                      Komentarze
                    </h3>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide mb-4">
                      {commentsState.map((comment) => (
                        <div key={comment.id}>
                          <div className="flex gap-3 pb-5 border-b border-[#f0f0f0]">
                            <div className="w-10 h-10 bg-[#f0f0f0] rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">{comment.avatar}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-[#171a26] text-sm">{comment.user}</span>
                                <span className="text-xs text-[#87868a]">{comment.time}</span>
                              </div>
                              <p className="text-sm text-[#69686d] mb-2">{comment.content}</p>
                              <Button variant="ghost" className="text-primary p-0 h-auto gap-1 font-bold text-sm">
                                <Reply className="w-5 h-5" />
                                Odpowiedz
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment */}
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-[#4b4a4d]">Komentarz</Label>
                        <div className="bg-white border border-[#e8e8e9] rounded-[12px] p-4">
                          <Textarea
                            placeholder="Dodaj komentarz..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="border-0 p-0 text-sm placeholder:text-[#69686d] focus-visible:ring-0 resize-none min-h-[80px]"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" className="border-[#d1d0d2] p-3 rounded-[12px]">
                          <Paperclip className="w-5 h-5 text-[#69686d]" />
                        </Button>
                        <Button 
                          onClick={handlePostComment}
                          className="project-modal-gradient-btn text-white px-4 py-3 rounded-[12px] font-bold text-sm"
                        >
                          Opublikuj Komentarz
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="w-[360px] space-y-4">
                  {/* Budget */}
                  <div className="bg-white border border-[#e8e8e9] rounded-[20px] p-6">
                    <div className="flex items-center justify-between mb-[18px]">
                      <h3 className="text-lg font-semibold text-[#171a26] font-plus-jakarta">
                        Budżet
                      </h3>
                      <Button variant="ghost" className="text-primary p-0 h-auto gap-1 font-bold text-sm">
                        <Plus className="w-5 h-5" />
                        Dodaj Transakcję
                      </Button>
                    </div>
                    
                    <div className="space-y-2 mb-[18px]">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#69686d]">Budżet całkowity</span>
                        <span className="font-semibold text-[#171a26]">{projectData.currency} {projectData.maxBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#69686d]">Wydano</span>
                        <span className="font-semibold text-[#fa7522]">{projectData.currency} {projectData.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#69686d]">Pozostało</span>
                        <span className="font-semibold text-[#0fa144]">{projectData.currency} {(projectData.maxBudget - projectData.budget).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {projectData.transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-[#fafafa] rounded-[12px]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              <span className="text-sm">{transaction.icon}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#171a26]">{transaction.name}</p>
                              <p className="text-xs text-[#69686d]">{transaction.type}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-red-600">
                            {projectData.currency} {Math.abs(transaction.amount).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team */}
                  <div className="bg-white border border-[#e8e8e9] rounded-[20px] p-6">
                    <div className="flex items-center justify-between mb-[18px]">
                      <h3 className="text-lg font-semibold text-[#171a26] font-plus-jakarta">
                        Zespół Projektowy
                      </h3>
                      <Button variant="ghost" className="text-primary p-0 h-auto gap-1 font-bold text-sm">
                        <Plus className="w-5 h-5" />
                        Dodaj
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {projectData.team.map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 bg-[#f0f0f0] rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium">{member.avatar}</span>
                              </div>
                              {member.isOnline && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#171a26]">{member.name}</p>
                              <p className="text-xs text-[#69686d]">{member.role}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="p-2">
                            <MoreHorizontal className="w-4 h-4 text-[#69686d]" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="bg-white border border-[#e8e8e9] rounded-[20px] p-6">
                    <div className="flex items-center justify-between mb-[18px]">
                      <h3 className="text-lg font-semibold text-[#171a26] font-plus-jakarta">
                        Pliki
                      </h3>
                      <Button variant="ghost" className="text-primary p-0 h-auto gap-1 font-bold text-sm">
                        <Plus className="w-5 h-5" />
                        Dodaj
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {projectData.attachments.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-[#fafafa] rounded-[12px]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              <FileText className="w-4 h-4 text-[#69686d]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#171a26]">{file.name}</p>
                              <p className="text-xs text-[#69686d]">{file.size}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="p-2">
                            <Download className="w-4 h-4 text-[#69686d]" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Kafelki Tab */}
            <TabsContent value="kafelki" className="mt-8">
              <div className="space-y-6">
                {/* Filters and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtruj po statusie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Wszystkie statusy</SelectItem>
                        {statuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={groupBy} onValueChange={setGroupBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Grupuj według" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zone">Według strefy</SelectItem>
                        <SelectItem value="status">Według statusu</SelectItem>
                        <SelectItem value="none">Bez grupowania</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={handleAddTile} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Nowy kafelek
                  </Button>
                </div>

                {/* Tiles Grid */}
                <div className="space-y-6">
                  {Object.entries(groupedTiles).map(([group, tiles]) => (
                    <div key={group}>
                      <h3 className="text-lg font-semibold mb-4">{group}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {tiles.map((tile) => (
                          <Card 
                            key={tile.id} 
                            className="hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleEditTile(tile)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-sm">{tile.name}</CardTitle>
                                <Badge className={`${getTileStatusColor(tile.status)} text-xs`}>
                                  {tile.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Strefa: {tile.zone}</span>
                                <span>Czas: {tile.estimatedTime}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span>Przypisano: {tile.assignedTo}</span>
                                <Badge className={`${getTilePriorityColor(tile.priority)} text-xs px-2 py-1`}>
                                  {tile.priority}
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Postęp</span>
                                  <span>{tile.progress}%</span>
                                </div>
                                <Progress value={tile.progress} className="h-2" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="pliki" className="mt-8">
              <div className="space-y-6">
                {/* Files Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Pliki projektu</h2>
                    <p className="text-muted-foreground">Zarządzaj dokumentami, rysunkami i załącznikami projektu</p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Dodaj pliki
                  </Button>
                </div>

                {/* Files Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectData.attachments.concat([
                    { id: 5, name: "Certyfikat_ISO.pdf", size: "1.2 MB", type: "pdf" },
                    { id: 6, name: "Instrukcja_montazu.docx", size: "850 KB", type: "docx" },
                    { id: 7, name: "Zdjecia_postep.zip", size: "45.2 MB", type: "zip" },
                    { id: 8, name: "Model_3D.step", size: "12.8 MB", type: "step" }
                  ]).map((file) => (
                    <Card key={file.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{file.name}</h3>
                            <p className="text-xs text-muted-foreground">{file.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-1" />
                          Pobierz
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          Podgląd
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* File Categories */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Kategorie plików</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { name: "Dokumentacja techniczna", count: 8, icon: "📋" },
                      { name: "Rysunki CAD", count: 15, icon: "📐" },
                      { name: "Zdjęcia", count: 23, icon: "📷" },
                      { name: "Certyfikaty", count: 4, icon: "🏆" }
                    ].map((category) => (
                      <Card key={category.name} className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <h4 className="font-medium text-sm mb-1">{category.name}</h4>
                        <p className="text-xs text-muted-foreground">{category.count} plików</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Finance Tab */}
            <TabsContent value="wycena" className="mt-8">
              <div className="space-y-6">
                {/* Finance Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Wycena i Finanse</h2>
                    <p className="text-muted-foreground">Szczegółowa analiza kosztów i zarządzanie finansami projektu</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Eksport raportu
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Nowa pozycja
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Budget Overview */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Budget Breakdown */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Podział budżetu</h3>
                      <div className="space-y-4">
                        {[
                          { category: "Materiały", planned: 300000, actual: 194000, color: "bg-blue-500" },
                          { category: "Robocizna", planned: 200000, actual: 169750, color: "bg-green-500" },
                          { category: "Transport", planned: 80000, actual: 72750, color: "bg-yellow-500" },
                          { category: "Usługi zewnętrzne", planned: 120000, actual: 48500, color: "bg-purple-500" },
                          { category: "Narzędzia", planned: 50000, actual: 0, color: "bg-red-500" }
                        ].map((item) => (
                          <div key={item.category} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{item.category}</span>
                              <div className="text-sm text-muted-foreground">
                                {((item.actual / item.planned) * 100).toFixed(0)}%
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div 
                                  className={`${item.color} h-2 rounded-full`}
                                  style={{ width: `${Math.min((item.actual / item.planned) * 100, 100)}%` }}
                                />
                              </div>
                              <div className="text-sm font-medium min-w-0">
                                {item.actual.toLocaleString()} / {item.planned.toLocaleString()} PLN
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Invoices */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Faktury</h3>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Nowa faktura
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {[
                          { id: "FV/2024/001", supplier: "Stal-Hurt Sp. z o.o.", amount: 125000, status: "Opłacona", date: "15.08.2024" },
                          { id: "FV/2024/002", supplier: "Transport Express", amount: 8500, status: "Oczekująca", date: "22.08.2024" },
                          { id: "FV/2024/003", supplier: "Usługi CNC Pro", amount: 45000, status: "Opłacona", date: "28.08.2024" },
                          { id: "FV/2024/004", supplier: "Elektro-Montaż", amount: 32000, status: "Do sprawdzenia", date: "05.09.2024" }
                        ].map((invoice) => (
                          <div key={invoice.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-medium text-sm">{invoice.id}</p>
                                <p className="text-xs text-muted-foreground">{invoice.supplier}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-medium text-sm">{invoice.amount.toLocaleString()} PLN</p>
                                <p className="text-xs text-muted-foreground">{invoice.date}</p>
                              </div>
                              <Badge className={
                                invoice.status === "Opłacona" ? "bg-green-100 text-green-800" :
                                invoice.status === "Oczekująca" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }>
                                {invoice.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Finance Summary */}
                  <div className="space-y-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Podsumowanie finansowe</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Budżet całkowity:</span>
                          <span className="font-medium">{projectData.maxBudget.toLocaleString()} PLN</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Wydano:</span>
                          <span className="font-medium text-red-600">{projectData.spent.toLocaleString()} PLN</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Pozostało:</span>
                          <span className="font-medium text-green-600">{(projectData.maxBudget - projectData.spent).toLocaleString()} PLN</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Wykorzystanie:</span>
                            <span className="font-semibold">{Math.round((projectData.spent / projectData.maxBudget) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Płatności</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Opłacone:</span>
                          <span className="text-green-600 font-medium">170,000 PLN</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Oczekujące:</span>
                          <span className="text-yellow-600 font-medium">8,500 PLN</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Zaległe:</span>
                          <span className="text-red-600 font-medium">0 PLN</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Analiza kosztów</h4>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {((projectData.spent / projectData.maxBudget) * 100).toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">budżetu wykorzystano</p>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="zespol" className="mt-8">
              <div className="space-y-6">
                {/* Team Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Zespół projektowy</h2>
                    <p className="text-muted-foreground">Zarządzaj członkami zespołu i przydzielaj zadania</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Czat zespołu
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Dodaj członka
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Team Members */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Członkowie zespołu</h3>
                      <div className="space-y-4">
                        {projectData.team.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="font-medium text-primary">{member.avatar}</span>
                                </div>
                                {member.isOnline && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">{member.name}</h4>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {Math.floor(Math.random() * 8) + 1} zadań
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {Math.floor(Math.random() * 40) + 10}h/tydzień
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Tasks */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Zadania zespołu</h3>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Nowe zadanie
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {[
                          { id: 1, title: "Przygotowanie dokumentacji technicznej", assignee: "Anna Lewandowska", status: "W trakcie", priority: "Wysoki", dueDate: "15.09.2024" },
                          { id: 2, title: "Kontrola jakości komponentów", assignee: "Tomasz Nowak", status: "Zakończone", priority: "Średni", dueDate: "10.09.2024" },
                          { id: 3, title: "Testowanie systemu bezpieczeństwa", assignee: "Katarzyna Wiśniewska", status: "Oczekujące", priority: "Krytyczny", dueDate: "20.09.2024" },
                          { id: 4, title: "Przygotowanie raportu postępu", assignee: "Marek Kowalczyk", status: "W trakcie", priority: "Niski", dueDate: "25.09.2024" }
                        ].map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <input type="checkbox" checked={task.status === "Zakończone"} className="w-4 h-4" />
                              <div>
                                <p className="font-medium text-sm">{task.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">{task.assignee}</span>
                                  <span className="text-xs">•</span>
                                  <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={
                                task.priority === "Krytyczny" ? "bg-red-100 text-red-800" :
                                task.priority === "Wysoki" ? "bg-orange-100 text-orange-800" :
                                task.priority === "Średni" ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              }>
                                {task.priority}
                              </Badge>
                              <Badge className={
                                task.status === "Zakończone" ? "bg-green-100 text-green-800" :
                                task.status === "W trakcie" ? "bg-blue-100 text-blue-800" :
                                "bg-gray-100 text-gray-800"
                              }>
                                {task.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Team Stats */}
                  <div className="space-y-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Statystyki zespołu</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Członkowie online:</span>
                          <span className="font-medium">{projectData.team.filter(m => m.isOnline).length}/{projectData.team.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Aktywne zadania:</span>
                          <span className="font-medium">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Ukończone zadania:</span>
                          <span className="font-medium text-green-600">45</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Średni czas zadania:</span>
                          <span className="font-medium">2.3 dni</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Wydajność</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ten tydzień:</span>
                          <span className="font-medium text-green-600">+15%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ten miesiąc:</span>
                          <span className="font-medium text-green-600">+8%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Średnia zespołu:</span>
                          <span className="font-medium">87%</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Komunikacja</h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Czat zespołu
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="w-4 h-4 mr-2" />
                          Spotkania
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Bell className="w-4 h-4 mr-2" />
                          Powiadomienia
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Logistics Tab */}
            <TabsContent value="logistyka" className="mt-8">
              <div className="space-y-6">
                {/* Logistics Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Logistyka i harmonogram</h2>
                    <p className="text-muted-foreground">Zarządzaj dostawami, harmonogramem i zasobami projektu</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Kalendarz dostaw
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Nowa dostawa
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Schedule & Deliveries */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Project Timeline */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Harmonogram projektu</h3>
                      <div className="space-y-4">
                        {[
                          { phase: "Projektowanie", start: "2024-11-15", end: "2024-12-31", progress: 100, status: "completed" },
                          { phase: "Zakup materiałów", start: "2024-12-15", end: "2025-01-15", progress: 85, status: "active" },
                          { phase: "Produkcja CNC", start: "2025-01-01", end: "2025-02-15", progress: 60, status: "active" },
                          { phase: "Montaż", start: "2025-02-01", end: "2025-02-28", progress: 15, status: "upcoming" },
                          { phase: "Testowanie", start: "2025-02-15", end: "2025-03-10", progress: 0, status: "upcoming" },
                          { phase: "Dostawa", start: "2025-03-10", end: "2025-03-20", progress: 0, status: "upcoming" }
                        ].map((phase, index) => (
                          <div key={phase.phase} className="relative">
                            <div className="flex items-center gap-4">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                phase.status === "completed" ? "bg-green-500 border-green-500" :
                                phase.status === "active" ? "bg-blue-500 border-blue-500" :
                                "bg-gray-200 border-gray-300"
                              }`} />
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium">{phase.phase}</h4>
                                  <span className="text-sm text-muted-foreground">
                                    {phase.start} - {phase.end}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="flex-1 bg-muted rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        phase.status === "completed" ? "bg-green-500" :
                                        phase.status === "active" ? "bg-blue-500" :
                                        "bg-gray-300"
                                      }`}
                                      style={{ width: `${phase.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium min-w-0">{phase.progress}%</span>
                                </div>
                              </div>
                            </div>
                            {index < 5 && (
                              <div className="absolute left-2 top-6 w-0.5 h-8 bg-gray-200" />
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Deliveries */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Harmonogram dostaw</h3>
                        <Button variant="outline" size="sm">
                          <Package className="w-4 h-4 mr-1" />
                          Śledź przesyłki
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {[
                          { id: "D001", supplier: "Stal-Hurt Sp. z o.o.", items: "Płyty stalowe S355", scheduled: "2024-12-15", status: "Dostarczone", tracking: "DHL123456" },
                          { id: "D002", supplier: "CNC Tools Pro", items: "Narzędzia obróbcze", scheduled: "2024-12-20", status: "W drodze", tracking: "UPS789012" },
                          { id: "D003", supplier: "Elektro Components", items: "Komponenty elektryczne", scheduled: "2024-12-28", status: "Przygotowywane", tracking: "-" },
                          { id: "D004", supplier: "Transport Express", items: "Części zamienne", scheduled: "2025-01-05", status: "Zaplanowane", tracking: "-" }
                        ].map((delivery) => (
                          <div key={delivery.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{delivery.items}</p>
                                <p className="text-xs text-muted-foreground">{delivery.supplier}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">Data: {delivery.scheduled}</span>
                                  {delivery.tracking !== "-" && (
                                    <>
                                      <span className="text-xs">•</span>
                                      <span className="text-xs text-blue-600">{delivery.tracking}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Badge className={
                              delivery.status === "Dostarczone" ? "bg-green-100 text-green-800" :
                              delivery.status === "W drodze" ? "bg-blue-100 text-blue-800" :
                              delivery.status === "Przygotowywane" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }>
                              {delivery.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Logistics Summary */}
                  <div className="space-y-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Podsumowanie logistyki</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Dostawy w tym miesiącu:</span>
                          <span className="font-medium">8</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Średnie opóźnienie:</span>
                          <span className="font-medium text-yellow-600">2.3 dni</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Dostarczone na czas:</span>
                          <span className="font-medium text-green-600">75%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Koszt transportu:</span>
                          <span className="font-medium">72,750 PLN</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Zasoby</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Materiały na stanie:</span>
                          <span className="font-medium text-green-600">85%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Narzędzia dostępne:</span>
                          <span className="font-medium text-green-600">12/15</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Magazyn główny:</span>
                          <span className="font-medium">67% pełny</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Następne kroki</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                          <div>
                            <p className="text-sm font-medium">Dostawa narzędzi CNC</p>
                            <p className="text-xs text-muted-foreground">20 grudnia 2024</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                          <div>
                            <p className="text-sm font-medium">Kontrola jakości materiałów</p>
                            <p className="text-xs text-muted-foreground">28 grudnia 2024</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                          <div>
                            <p className="text-sm font-medium">Rozpoczęcie produkcji</p>
                            <p className="text-xs text-muted-foreground">1 stycznia 2025</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Działania</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Package className="w-4 h-4 mr-2" />
                          Śledź przesyłki
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          Kalendarz dostaw
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Raport logistyki
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Tile Edit Modal */}
      {showTileModal && (
        <TileEditModal
          tile={editingTile}
          isOpen={showTileModal}
          onClose={() => setShowTileModal(false)}
          onSave={handleSaveTile}
          zones={zones}
          statuses={statuses}
          assignableMembers={assignableMembers}
          materials={materials}
        />
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <EditProjectModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          project={{
            ...projectData,
            // Pass original dates in YYYY-MM-DD format instead of formatted ones
            startDate: activeProject.startDate,
            endDate: activeProject.endDate
          }}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
}