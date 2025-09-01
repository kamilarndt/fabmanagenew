import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { useProjects } from "../utils/supabase/hooks";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { 
  Building2, 
  Calendar, 
  Euro, 
  User, 
  FileText, 
  Wrench, 
  Package,
  Eye,
  Palette,
  Loader2
} from "lucide-react";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreate: (projectData: any) => void;
}

export function CreateProjectModal({ open, onOpenChange, onProjectCreate }: CreateProjectModalProps) {
  const { createProject, loading: projectLoading } = useProjects();
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableClients = [
    { id: "abc-corp", name: "ABC Corporation" },
    { id: "xyz-mfg", name: "XYZ Manufacturing" },
    { id: "tech-sol", name: "Tech Solutions Ltd" },
    { id: "media-corp", name: "MediaCorp" },
    { id: "gr8-tech", name: "GR8 TECH" },
    { id: "new-client", name: "➕ Dodaj nowego klienta" }
  ];

  const projectManagers = [
    "Kamil Arndt",
    "Anna Nowak", 
    "Paweł Kasperovich",
    "Łukasz Jastrzębski",
    "Marek Kowalski",
    "Ewa Nowacka"
  ];

  const projectModules = [
    {
      id: "wycena",
      name: "Wycena",
      description: "Kalkulacja kosztów i przygotowanie oferty",
      icon: Euro,
      color: "text-green-600"
    },
    {
      id: "koncepcja",
      name: "Koncepcja",
      description: "Projektowanie koncepcyjne i wizualizacje",
      icon: Eye,
      color: "text-blue-600"
    },
    {
      id: "projektowanie",
      name: "Dział Projektowy",
      description: "Dokumentacja techniczna i rysunki",
      icon: FileText,
      color: "text-purple-600"
    },
    {
      id: "produkcja",
      name: "Produkcja",
      description: "System kafelków i zarządzanie produkcją",
      icon: Package,
      color: "text-orange-600"
    },
    {
      id: "cnc",
      name: "CNC",
      description: "Programowanie i sterowanie maszynami",
      icon: Wrench,
      color: "text-indigo-600"
    },
    {
      id: "wykończenie",
      name: "Wykończenie",
      description: "Malowanie, laminowanie, montaż",
      icon: Palette,
      color: "text-pink-600"
    }
  ];

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSubmit = async () => {
    if (!projectName || !clientName || !projectManager) {
      showErrorToast("Proszę wypełnić wszystkie wymagane pola");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const projectData = {
        name: projectName,
        client: clientName,
        manager: projectManager,
        budget,
        startDate,
        endDate,
        description,
        modules: selectedModules,
        status: "Wycena",
        priority: "Średni"
      };

      const newProject = await createProject(projectData);
      
      showSuccessToast(`Projekt "${projectName}" został utworzony pomyślnie!`);
      onProjectCreate(newProject);
      
      // Reset form
      setProjectName("");
      setClientName("");
      setProjectManager("");
      setBudget("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setSelectedModules([]);
      
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create project:", error);
      showErrorToast("Błąd podczas tworzenia projektu. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Stwórz Nowy Projekt
          </DialogTitle>
          <DialogDescription>
            Utwórz nowy projekt produkcyjny z wybranymi modułami funkcjonalnymi
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Podstawowe informacje */}
          <div className="space-y-4">
            <h3 className="font-medium">Podstawowe informacje</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Nazwa projektu *</Label>
                <Input
                  id="project-name"
                  placeholder="np. Stoisko GR8 TECH - Londyn 2025"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Klient *</Label>
                <Select value={clientName} onValueChange={setClientName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz klienta" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClients.map((client) => (
                      <SelectItem key={client.id} value={client.name}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manager">Project Manager *</Label>
                <Select value={projectManager} onValueChange={setProjectManager}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz PM" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectManagers.map((manager) => (
                      <SelectItem key={manager} value={manager}>
                        {manager}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-date">Data rozpoczęcia</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">Planowane zakończenie</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budżet (PLN)</Label>
              <Input
                id="budget"
                placeholder="np. 450000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Opis projektu</Label>
              <Textarea
                id="description"
                placeholder="Krótki opis celu i zakresu projektu..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Wybór modułów */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Aktywne moduły projektu</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Wybierz które moduły będą aktywne dla tego projektu. Możesz je później zmienić w ustawieniach projektu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projectModules.map((module) => {
                const IconComponent = module.icon;
                const isSelected = selectedModules.includes(module.id);
                
                return (
                  <div
                    key={module.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleModuleToggle(module.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={isSelected}
                        onChange={() => handleModuleToggle(module.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <IconComponent className={`w-4 h-4 ${module.color}`} />
                          <span className="font-medium text-sm">{module.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedModules.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Wybrano {selectedModules.length} z {projectModules.length} dostępnych modułów
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Anuluj
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!projectName || !clientName || !projectManager || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Tworzenie...
              </>
            ) : (
              "Utwórz Projekt"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}