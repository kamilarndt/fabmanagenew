import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Plus, Filter, Calendar, User, Search, Eye } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { CreateProjectModal } from "../CreateProjectModal";
import { useProjects } from "../../utils/supabase/hooks";
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

interface ProjektyProps {
  onProjectClick?: (projectId?: string) => void;
}

export function Projekty({ onProjectClick }: ProjektyProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { projects: remoteProjects, createProject } = useProjects();

  const projects = useMemo(() => remoteProjects?.length ? remoteProjects : [
    {
      id: "P-001",
      name: "Projekt Alpha",
      client: "ABC Corporation",
      manager: "Jan Kowalski",
      status: "W realizacji",
      priority: "Wysoki",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      progress: 65,
      image: "https://images.unsplash.com/photo-1720036236694-d0a231c52563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbWFudWZhY3R1cmluZyUyMHByb2plY3R8ZW58MXx8fHwxNzU2NjYxOTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Kompleksowy projekt automatyzacji linii produkcyjnej z integracją systemów CNC."
    },
    {
      id: "P-002",
      name: "Modernizacja linii produkcyjnej",
      client: "XYZ Manufacturing",
      manager: "Anna Nowak",
      status: "Projektowanie",
      priority: "Średni",
      startDate: "2024-02-01",
      endDate: "2024-05-15",
      progress: 25,
      image: "https://images.unsplash.com/photo-1720036236694-d0a231c52563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbWFudWZhY3R1cmluZyUyMHByb2plY3R8ZW58MXx8fHwxNzU2NjYxOTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Upgrade istniejącej linii montażowej z nowymi stacjami roboczymi."
    },
    {
      id: "P-003",
      name: "Prototyp Beta",
      client: "Tech Solutions Ltd",
      manager: "Piotr Wiśniewski",
      status: "Testowanie",
      priority: "Niski",
      startDate: "2024-01-10",
      endDate: "2024-02-28",
      progress: 90,
      image: "https://images.unsplash.com/photo-1705475092160-d2b197d2570b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm90b3R5cGUlMjBtYW51ZmFjdHVyaW5nfGVufDF8fHx8MTc1NjY2MTk3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Prototypowanie nowego urządzenia z wykorzystaniem drukarek 3D."
    },
    {
      id: "P-004",
      name: "Studio TV - Les 12 Coups de Midi",
      client: "MediaCorp",
      manager: "Kamila Zielińska",
      status: "Wycena",
      priority: "Wysoki",
      startDate: "2024-02-10",
      endDate: "2024-04-20",
      progress: 15,
      image: "https://images.unsplash.com/photo-1583004605294-3d041b6044be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0diUyMHN0dWRpbyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NTY2NjE5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Kompleksowa budowa studia telewizyjnego z profesjonalnym oświetleniem i akustyką."
    }
  ], [remoteProjects]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "W realizacji": return "bg-blue-100 text-blue-800";
      case "Projektowanie": return "bg-yellow-100 text-yellow-800";
      case "Testowanie": return "bg-green-100 text-green-800";
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

  const handleProjectCreate = async (projectData: any) => {
    const proj = await createProject(projectData);
    setIsCreateModalOpen(false);
    if (onProjectClick) onProjectClick(proj.id);
  };

  return (
    <ConstructorContainer size="xl" padding="lg" className="w-full">
      <ConstructorSection spacing="lg">
        {/* Header */}
        <ConstructorFlex direction="row" justify="between" align="center" gap="md" className="flex-col sm:flex-row">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold mb-2">Projekty</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Zarządzaj wszystkimi projektami produkcyjnymi
            </p>
          </div>
          <ActionButton action="add" size="md" onClick={() => setIsCreateModalOpen(true)}>
            Stwórz Nowy Projekt
          </ActionButton>
        </ConstructorFlex>

        <DashboardCard
          title="Filtry i wyszukiwanie"
          subtitle="Znajdź i przefiltruj projekty"
          icon={<Filter className="w-5 h-5" />}
        >
          <ConstructorGrid cols={4} gap="md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj projektów..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status:" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="w-realizacji">W realizacji</SelectItem>
                <SelectItem value="projektowanie">Projektowanie</SelectItem>
                <SelectItem value="testowanie">Testowanie</SelectItem>
                <SelectItem value="wycena">Wycena</SelectItem>
                <SelectItem value="zakonczony">Zakończony</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Klient:" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszyscy klienci</SelectItem>
                <SelectItem value="abc-corp">ABC Corporation</SelectItem>
                <SelectItem value="xyz-mfg">XYZ Manufacturing</SelectItem>
                <SelectItem value="tech-sol">Tech Solutions Ltd</SelectItem>
                <SelectItem value="media-corp">MediaCorp</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sortuj wg:" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nazwa projektu</SelectItem>
                <SelectItem value="date-new">Najnowsze</SelectItem>
                <SelectItem value="date-old">Najstarsze</SelectItem>
                <SelectItem value="progress">Postęp</SelectItem>
                <SelectItem value="deadline">Termin</SelectItem>
              </SelectContent>
            </Select>
          </ConstructorGrid>
        </DashboardCard>

        {/* Projects Grid */}
        <ConstructorGrid cols={5} gap="lg">
          {projects.map((project) => (
            <DashboardCard
              key={project.id}
              title={project.name}
              subtitle={project.id}
              className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              onClick={() => onProjectClick?.(project.id)}
            >
              <div className="relative h-32 overflow-hidden mb-4">
                <ImageWithFallback
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <PriorityBadge priority={project.priority} size="sm" />
                </div>
                <div className="absolute top-2 left-2">
                  <StatusBadge status={project.status} size="sm" />
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 mb-4">{project.description}</p>

              <CardContent className="space-y-3 sm:space-y-4 mt-auto">
                <div>
                  <p className="text-sm font-medium mb-1">Klient:</p>
                  <p className="text-sm text-muted-foreground truncate">{project.client}</p>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm truncate">{project.manager}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm truncate">{project.startDate} - {project.endDate}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Postęp</span>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <ConstructorFlex gap="md" className="pt-2">
                  <ActionButton
                    action="edit"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => { e.stopPropagation(); onProjectClick?.(project.id); }}
                  >
                    <span className="hidden sm:inline">Otwórz</span>
                    <span className="sm:hidden">Zobacz</span>
                  </ActionButton>
                  <ActionButton action="edit" size="sm" className="flex-1">
                    <span className="hidden sm:inline">Edytuj</span>
                    <span className="sm:hidden">Edit</span>
                  </ActionButton>
                </ConstructorFlex>
              </CardContent>
            </DashboardCard>
          ))}
        </ConstructorGrid>

        {/* Modal tworzenia projektu */}
        <CreateProjectModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onProjectCreate={handleProjectCreate}
        />
      </ConstructorSection>
    </ConstructorContainer>
  );
}