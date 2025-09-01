import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Plus, FileText, Download, Eye } from "lucide-react";

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
    <div className="space-y-4 sm:space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-2">Dział Projektowy</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Zarządzanie dokumentacją projektową i rysunkami technicznymi
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Szablony</span>
            <span className="sm:hidden">Templ.</span>
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Nowy projekt</span>
            <span className="sm:hidden">Nowy</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Aktualne projekty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {designs.map((design) => (
                <div key={design.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{design.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Projekt: {design.project} • Designer: {design.designer}
                      </p>
                    </div>
                    <Badge className={getStatusColor(design.status)}>
                      {design.status}
                    </Badge>
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
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Podgląd
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Pobierz
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edytuj
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Szablony dokumentów</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Statystyki zespołu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}