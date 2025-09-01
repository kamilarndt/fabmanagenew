import { useState, useEffect, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  Plus, Search, Grid, Calendar, List, 
  Edit, Copy, Archive, Download, Users, 
  ChevronDown, ChevronUp, ArrowUpDown,
  Flag, Clock, DollarSign, TrendingUp, CheckCircle2,
  Eye, MessageSquare, Paperclip, ChevronLeft, ChevronRight,
  CalendarDays, Play, Pause, CheckCircle, LayoutGrid
} from "lucide-react";
import { CreateProjectModal } from "../CreateProjectModal";
import { useProjects } from "../../utils/supabase/hooks";
import { mockProjects as importedMockProjects } from "../../utils/mockData";

interface ProjektyProps {
  onProjectClick?: (projectId?: string) => void;
}

interface ProjectData {
  id: string;
  name: string;
  client: string;
  manager: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  team: string[];
  stage: string;
  overdue?: boolean;
}

// Detect touch device
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export function Projekty({ onProjectClick }: ProjektyProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'lista' | 'kafelki' | 'kanban' | 'kalendarz'>('lista');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [managerFilter, setManagerFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [budgetRange, setBudgetRange] = useState([0, 500000]);
  const [stageFilter, setStageFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(10);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const { projects, loading, error, fetchProjects } = useProjects();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Transform to match expected interface
  const mockProjects: ProjectData[] = importedMockProjects;

  // Transform backend projects to match our interface
  const transformedProjects = projects.map(p => ({
    ...p,
    budget: typeof p.budget === 'string' ? parseInt(p.budget) || 0 : p.budget || 0,
    spent: p.spent || Math.floor((p.budget || 0) * (p.progress || 0) / 100),
    team: p.team || [p.manager || 'Nie przypisano'],
    stage: p.stage || p.status || 'Nieznany',
    overdue: p.overdue || false,
    progress: p.progress || 0
  }));

  // Temporarily use only mock data to show new project examples
  const displayProjects = mockProjects;

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = [...displayProjects];

    // Apply search
    if (debouncedSearchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    if (managerFilter !== 'all') {
      filtered = filtered.filter(p => p.manager === managerFilter);
    }
    if (clientFilter !== 'all') {
      filtered = filtered.filter(p => p.client === clientFilter);
    }
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(p => p.priority === priorityFilter);
    }

    // Apply budget range
    filtered = filtered.filter(p => p.budget >= budgetRange[0] && p.budget <= budgetRange[1]);

    // Apply stage filter
    if (stageFilter.length > 0) {
      filtered = filtered.filter(p => stageFilter.includes(p.stage));
    }

    // Apply team filter
    if (teamFilter.length > 0) {
      filtered = filtered.filter(p => 
        p.team.some(member => teamFilter.includes(member))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'client':
          aVal = a.client;
          bVal = b.client;
          break;
        case 'budget':
          aVal = a.budget;
          bVal = b.budget;
          break;
        case 'progress':
          aVal = a.progress;
          bVal = b.progress;
          break;
        case 'endDate':
          aVal = new Date(a.endDate);
          bVal = new Date(b.endDate);
          break;
        default:
          aVal = a.name;
          bVal = b.name;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [displayProjects, debouncedSearchQuery, statusFilter, managerFilter, clientFilter, priorityFilter, budgetRange, stageFilter, teamFilter, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, statusFilter, managerFilter, clientFilter, priorityFilter, budgetRange, stageFilter, teamFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "W realizacji": return "bg-blue-500";
      case "Projektowanie": return "bg-yellow-500";
      case "Testowanie": return "bg-purple-500";
      case "Oferta": return "bg-orange-500";
      case "Zakończony": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Krytyczny": return "bg-red-500 text-white";
      case "Wysoki": return "bg-orange-500 text-white";
      case "Średni": return "bg-yellow-500 text-black";
      case "Niski": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(paginatedProjects.map(p => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectProject = (projectId: string, checked: boolean) => {
    if (checked) {
      setSelectedProjects([...selectedProjects, projectId]);
    } else {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const uniqueManagers = [...new Set(displayProjects.map(p => p.manager))];
  const uniqueClients = [...new Set(displayProjects.map(p => p.client))];

  // Handler for project creation
  const handleProjectCreate = (newProject: any) => {
    // Refresh projects from backend
    fetchProjects();
  };

  return (
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
      <div className="space-y-4 w-full max-w-none">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-medium">Projekty</h1>
            <p className="text-muted-foreground">
              Zarządzaj wszystkimi projektami produkcyjnymi ({filteredProjects.length})
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nowy projekt
          </Button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status projektu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie statusy</SelectItem>
                <SelectItem value="Oferta">Oferta</SelectItem>
                <SelectItem value="Projektowanie">Projektowanie</SelectItem>
                <SelectItem value="W realizacji">W realizacji</SelectItem>
                <SelectItem value="Testowanie">Testowanie</SelectItem>
                <SelectItem value="Zakończony">Zakończony</SelectItem>
              </SelectContent>
            </Select>

            <Select value={managerFilter} onValueChange={setManagerFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszyscy managerowie</SelectItem>
                {uniqueManagers.map(manager => (
                  <SelectItem key={manager} value={manager}>{manager}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Klient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszyscy klienci</SelectItem>
                {uniqueClients.map(client => (
                  <SelectItem key={client} value={client}>{client}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Data rozpoczęcia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie daty</SelectItem>
                <SelectItem value="this-month">Ten miesiąc</SelectItem>
                <SelectItem value="last-month">Ostatni miesiąc</SelectItem>
                <SelectItem value="this-quarter">Ten kwartał</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 border rounded-md p-1">
            <Button 
              variant={currentView === 'lista' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentView('lista')}
            >
              <List className="w-4 h-4 mr-1" />
              Lista
            </Button>
            <Button 
              variant={currentView === 'kafelki' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentView('kafelki')}
            >
              <LayoutGrid className="w-4 h-4 mr-1" />
              Kafelki
            </Button>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj projektów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Tiles View */}
        {currentView === 'kafelki' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onProjectClick?.(project.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm truncate">{project.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{project.id}</p>
                    </div>
                    <Badge className={`${getStatusColor(project.status)} text-white text-xs ml-2`}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${project.manager}`} />
                        <AvatarFallback className="text-xs">{project.manager.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground truncate">{project.manager}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{project.client}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{formatCurrency(project.spent)}</span>
                      <span>{formatCurrency(project.budget)}</span>
                    </div>
                    <Progress value={project.progress} className="h-1" />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge className={`${getPriorityColor(project.priority)} text-xs`}>
                      {project.priority}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {project.overdue && <Flag className="w-3 h-3 text-red-500" />}
                      <span className={`text-xs ${project.overdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {new Date(project.endDate).toLocaleDateString('pl-PL', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {currentView === 'lista' && (
          <>
            {/* Bulk Actions Bar */}
            {selectedProjects.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">
                      Wybrano {selectedProjects.length} projektów
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Eksport
                      </Button>
                      <Button size="sm" variant="outline">
                        <Archive className="w-4 h-4 mr-1" />
                        Archiwizuj
                      </Button>
                      <Button size="sm" variant="outline">
                        <Users className="w-4 h-4 mr-1" />
                        Przypisz
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Projects Table */}
            <Card>
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={paginatedProjects.length > 0 && paginatedProjects.every(p => selectedProjects.includes(p.id))}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                        <div className="flex items-center gap-2">
                          Nazwa projektu
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('client')}>
                        <div className="flex items-center gap-2">
                          Klient
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('budget')}>
                        <div className="flex items-center gap-2">
                          Budżet/Wykonanie
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </TableHead>
                      <TableHead>Postęp</TableHead>
                      <TableHead>Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProjects.map((project) => (
                      <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <Checkbox 
                            checked={selectedProjects.includes(project.id)}
                            onCheckedChange={(checked) => handleSelectProject(project.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium truncate max-w-[200px]">{project.name}</p>
                            <p className="text-xs text-muted-foreground">{project.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="truncate max-w-[150px]">{project.client}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${project.manager}`} />
                              <AvatarFallback className="text-xs">{project.manager.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="truncate max-w-[120px]">{project.manager}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(project.status)} text-white text-xs`}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{formatCurrency(project.spent)}</span>
                              <span className="text-muted-foreground">{formatCurrency(project.budget)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={project.progress} className="h-2 w-16" />
                            <span className="text-xs">{project.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => onProjectClick?.(project.id)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Pokazano {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} z {filteredProjects.length} projektów
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Poprzednia
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Następna
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        </div>

        {/* Create Project Modal */}
        <CreateProjectModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onProjectCreate={handleProjectCreate}
        />
      </div>
    </DndProvider>
  );
}