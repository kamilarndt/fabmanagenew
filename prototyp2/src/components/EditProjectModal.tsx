import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";

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
  maxBudget: number;
  description: string;
  team: Array<{ id: number; name: string; role: string; avatar: string; isOnline: boolean }>;
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
  onSave: (updatedProject: ProjectData) => void;
}

export function EditProjectModal({ isOpen, onClose, project, onSave }: EditProjectModalProps) {
  // Helper function to safely convert date strings to ISO format
  const safelyFormatDateForInput = (dateString: string): string => {
    try {
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      // Try to parse various date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If parsing fails, return current date as fallback
        return new Date().toISOString().split('T')[0];
      }
      
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Error parsing date:', dateString, error);
      return new Date().toISOString().split('T')[0];
    }
  };

  const [formData, setFormData] = useState({
    name: project.name,
    client: project.client,
    manager: project.manager,
    status: project.status,
    priority: project.priority,
    startDate: safelyFormatDateForInput(project.startDate),
    endDate: safelyFormatDateForInput(project.endDate),
    budget: project.budget,
    maxBudget: project.maxBudget,
    description: project.description
  });

  const [teamEmails, setTeamEmails] = useState("");

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const updatedProject: ProjectData = {
      ...project,
      ...formData,
      // In a real app, team updates would be handled separately
    };
    onSave(updatedProject);
    onClose();
  };

  const statusOptions = [
    { value: "Oferta", label: "Oferta", color: "bg-orange-100 text-orange-800" },
    { value: "Projektowanie", label: "Projektowanie", color: "bg-yellow-100 text-yellow-800" },
    { value: "W realizacji", label: "W realizacji", color: "bg-blue-100 text-blue-800" },
    { value: "Testowanie", label: "Testowanie", color: "bg-purple-100 text-purple-800" },
    { value: "Zakończony", label: "Zakończony", color: "bg-green-100 text-green-800" }
  ];

  const priorityOptions = [
    { value: "Niski", label: "Niski", color: "bg-green-100 text-green-800" },
    { value: "Średni", label: "Średni", color: "bg-yellow-100 text-yellow-800" },
    { value: "Wysoki", label: "Wysoki", color: "bg-orange-100 text-orange-800" },
    { value: "Krytyczny", label: "Krytyczny", color: "bg-red-100 text-red-800" }
  ];

  const managers = [
    "Marek Kowalczyk",
    "Agnieszka Dąbrowska", 
    "Łukasz Wójcik",
    "Dorota Kamińska",
    "Bartosz Mazurek",
    "Natalia Woźniak"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edytuj projekt
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Zaktualizuj informacje o projekcie, harmonogram, budżet i składzie zespołu.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Podstawowe informacje</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nazwa projektu</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Wprowadź nazwę projektu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Klient</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => handleInputChange("client", e.target.value)}
                  placeholder="Nazwa klienta"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manager">Project Manager</Label>
                <Select value={formData.manager} onValueChange={(value) => handleInputChange("manager", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz managera" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((manager) => (
                      <SelectItem key={manager} value={manager}>
                        {manager}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status projektu</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={status.color}>{status.label}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priorytet</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz priorytet" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={priority.color}>{priority.label}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Opis projektu</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Opisz projekt..."
                rows={3}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Harmonogram</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data rozpoczęcia</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data zakończenia</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Budżet</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Wydane środki (PLN)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxBudget">Budżet całkowity (PLN)</Label>
                <Input
                  id="maxBudget"
                  type="number"
                  value={formData.maxBudget}
                  onChange={(e) => handleInputChange("maxBudget", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Wykorzystanie budżetu:</span>
                <span className="font-medium">
                  {formData.maxBudget > 0 ? ((formData.budget / formData.maxBudget) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Zespół</h3>
            
            <div className="space-y-2">
              <Label>Obecni członkowie zespołu</Label>
              <div className="flex flex-wrap gap-2">
                {project.team.map((member) => (
                  <Badge key={member.id} variant="outline" className="flex items-center gap-1">
                    {member.name}
                    <Button variant="ghost" size="sm" className="h-auto p-0 ml-1">
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamEmails">Dodaj członków zespołu (email)</Label>
              <Input
                id="teamEmails"
                value={teamEmails}
                onChange={(e) => setTeamEmails(e.target.value)}
                placeholder="email1@company.com, email2@company.com"
              />
              <p className="text-xs text-muted-foreground">
                Wprowadź adresy email oddzielone przecinkami
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Anuluj
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Zapisz zmiany
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}