import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Plus, FileText, Download, Eye } from "lucide-react";
import {
  DashboardCard,
  StatusBadge,
  ActionButton,
  ConstructorContainer,
  ConstructorSection,
  ConstructorGrid,
  ConstructorFlex
} from "../ui-kit";

export function DzialProjektowy() {
  const designs = [
    {
      id: "D-001",
      name: "Projekt Alpha - Dokumentacja techniczna",
      project: "P-001",
      designer: "Marek Nowacki",
      status: "Gotowe",
      version: "v2.1",
      lastModified: "2024-01-22",
      fileType: "DWG",
      progress: 100
    },
    {
      id: "D-002",
      name: "Modernizacja linii - Schemat układu",
      project: "P-002",
      designer: "Ewa Kowalczyk",
      status: "W trakcie",
      version: "v1.3",
      lastModified: "2024-01-21",
      fileType: "PDF",
      progress: 75
    },
    {
      id: "D-003",
      name: "Prototyp Beta - Rysunki wykonawcze",
      project: "P-003",
      designer: "Tomasz Zieliński",
      status: "Do weryfikacji",
      version: "v1.0",
      lastModified: "2024-01-20",
      fileType: "DXF",
      progress: 95
    }
  ];

  const templates = [
    {
      name: "Standard ISO 9001",
      description: "Szablon dokumentacji zgodny z normą ISO 9001",
      downloads: 24
    },
    {
      name: "Rysunki techniczne",
      description: "Standardowy format rysunków wykonawczych",
      downloads: 18
    },
    {
      name: "Specyfikacja materiałów",
      description: "Template dla zestawień materiałowych",
      downloads: 31
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Gotowe": return "bg-green-100 text-green-800";
      case "W trakcie": return "bg-blue-100 text-blue-800";
      case "Do weryfikacji": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ConstructorContainer size="xl" padding="lg" className="w-full">
      <ConstructorSection
        title="Dział Projektowy"
        subtitle="Zarządzanie dokumentacją projektową i rysunkami technicznymi"
        spacing="lg"
      >
        {/* Header */}
        <ConstructorFlex direction="row" justify="end" align="center" gap="md">
          <ActionButton action="secondary" size="md">
            Szablony
          </ActionButton>
          <ActionButton action="add" size="md">
            Nowy projekt
          </ActionButton>
        </ConstructorFlex>

        <ConstructorGrid cols={3} gap="lg">
          <div className="lg:col-span-2">
            <DashboardCard
              title="Aktualne projekty"
              subtitle="Dokumentacja projektowa w toku"
              icon={<FileText className="w-5 h-5" />}
            >
              {designs.map((design) => (
                <div key={design.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{design.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Projekt: {design.project} • Designer: {design.designer}
                      </p>
                    </div>
                    <StatusBadge status={design.status} size="sm" />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{design.version}</span>
                    <span>•</span>
                    <span>{design.fileType}</span>
                    <span>•</span>
                    <span>Modyfikowano: {design.lastModified}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Postęp</span>
                      <span>{design.progress}%</span>
                    </div>
                    <Progress value={design.progress} className="h-2" />
                  </div>

                  <ConstructorFlex direction="row" gap="sm">
                    <ActionButton action="secondary" size="sm">
                      Podgląd
                    </ActionButton>
                    <ActionButton action="secondary" size="sm">
                      Pobierz
                    </ActionButton>
                    <ActionButton action="ghost" size="sm">
                      Edytuj
                    </ActionButton>
                  </ConstructorFlex>
                </div>
              ))}
            </DashboardCard>
          </div>

          <div className="space-y-6">
            <DashboardCard
              title="Szablony dokumentów"
              subtitle="Dostępne szablony do pobrania"
              icon={<FileText className="w-5 h-5" />}
            >
              {templates.map((template, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-1">{template.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {template.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {template.downloads} pobrań
                    </span>
                    <ActionButton action="ghost" size="sm">
                      Pobierz
                    </ActionButton>
                  </div>
                </div>
              ))}
            </DashboardCard>

            <DashboardCard
              title="Statystyki zespołu"
              subtitle="Podsumowanie działalności projektowej"
              icon={<FileText className="w-5 h-5" />}
            >
              <div className="text-center">
                <div className="text-2xl font-bold">23</div>
                <p className="text-sm text-muted-foreground">Projekty w tym miesiącu</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">87%</div>
                <p className="text-sm text-muted-foreground">Terminowość realizacji</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">5</div>
                <p className="text-sm text-muted-foreground">Aktywni projektanci</p>
              </div>
            </DashboardCard>
          </div>
        </ConstructorGrid>
      </ConstructorSection>
    </ConstructorContainer>
  );
}