import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit, Save, X } from 'lucide-react';

interface GeneralTabProps {
  projectId?: string;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ projectId }) => {
  // Mock data - replace with actual data fetching
  const projectData = {
    id: projectId || 'proj-1',
    name: 'Smart Kids Planet',
    description: 'Projekt wystawienniczy dla dzieci z interaktywnymi elementami',
    status: 'active',
    priority: 'high',
    startDate: '2025-01-15',
    endDate: '2025-03-30',
    budget: 150000,
    client: 'Smart Kids Planet Sp. z o.o.',
    manager: 'Jan Kowalski',
    team: ['Anna Nowak', 'Piotr Wiśniewski', 'Maria Kowalczyk'],
    tags: ['wystawa', 'dzieci', 'interaktywne', 'multimedia'],
    progress: 65,
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="general-tab p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Informacje ogólne</h2>
          <div className="flex gap-2">
            <Button variant="default">
              <Edit className="w-4 h-4 mr-2" />
              Edytuj
            </Button>
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Zapisz
            </Button>
            <Button variant="outline">
              <X className="w-4 h-4 mr-2" />
              Anuluj
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Podstawowe informacje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nazwa projektu</label>
              <p className="text-sm">{projectData.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant={getStatusVariant(projectData.status)}>
                  {projectData.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Priorytet</label>
              <div className="mt-1">
                <Badge variant={getPriorityVariant(projectData.priority)}>
                  {projectData.priority.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Data rozpoczęcia</label>
              <p className="text-sm">{projectData.startDate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Data zakończenia</label>
              <p className="text-sm">{projectData.endDate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Budżet</label>
              <p className="text-sm">{projectData.budget.toLocaleString('pl-PL')} PLN</p>
            </div>
          </CardContent>
        </Card>

        {/* Client & Team */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Klient i zespół</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Klient</label>
              <p className="text-sm">{projectData.client}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Kierownik projektu</label>
              <p className="text-sm">{projectData.manager}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Zespół</label>
              <div className="space-y-1">
                {projectData.team.map((member, index) => (
                  <div key={index} className="text-sm">
                    • {member}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Opis projektu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{projectData.description}</p>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Tagi:</h4>
              <div className="flex flex-wrap gap-2">
                {projectData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Postęp projektu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Ogólny postęp</span>
              <span className="text-lg font-semibold">{projectData.progress}%</span>
            </div>
            <Progress value={projectData.progress} className="w-full" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-muted-foreground">Zadania ukończone</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-sm text-muted-foreground">W trakcie</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm text-muted-foreground">Do zrobienia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">2</div>
                <div className="text-sm text-muted-foreground">Opóźnione</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneralTab;
