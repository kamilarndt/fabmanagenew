import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { MaterialsSelectionModal } from "./MaterialsSelectionModal";
import { useMaterials } from "../utils/supabase/hooks";
import { 
  Package,
  Upload,
  FileText,
  Timer,
  User,
  Layers,
  AlertTriangle,
  X,
  Plus,
  Database
} from "lucide-react";

interface TileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tileData: any) => void;
  editingTile?: any;
  zones: string[];
  statuses: string[];
  assignableMembers: string[];
}

export function TileEditModal({ 
  open, 
  onOpenChange, 
  onSave, 
  editingTile,
  zones,
  statuses,
  assignableMembers
}: TileEditModalProps) {
  const [tileName, setTileName] = useState("");
  const [zone, setZone] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [progress, setProgress] = useState(0);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [dxfFile, setDxfFile] = useState("");
  const [assemblyDrawing, setAssemblyDrawing] = useState("");
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);

  // Use the materials from the hook
  const { materials } = useMaterials();

  useEffect(() => {
    if (editingTile) {
      setTileName(editingTile.name || "");
      setZone(editingTile.zone || "");
      setStatus(editingTile.status || "");
      setAssignedTo(editingTile.assignedTo || "");
      setPriority(editingTile.priority || "");
      setEstimatedTime(editingTile.estimatedTime || "");
      setNotes(editingTile.notes || "");
      setProgress(editingTile.progress || 0);
      setSelectedMaterials(editingTile.materials || []);
      setDxfFile(editingTile.dxfFile || "");
      setAssemblyDrawing(editingTile.assemblyDrawing || "");
    } else {
      // Reset form for new tile
      setTileName("");
      setZone("");
      setStatus("Projektowanie");
      setAssignedTo("");
      setPriority("Średni");
      setEstimatedTime("");
      setNotes("");
      setProgress(0);
      setSelectedMaterials([]);
      setDxfFile("");
      setAssemblyDrawing("");
    }
  }, [editingTile, open]);

  const priorities = ["Wysoki", "Średni", "Niski"];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Wysoki": return "text-red-600 bg-red-50";
      case "Średni": return "text-yellow-600 bg-yellow-50";
      case "Niski": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
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

  const handleMaterialAdd = (material: any) => {
    const materialString = `${material.name} - ${material.price}/${material.unit}`;
    if (materialString && !selectedMaterials.includes(materialString)) {
      setSelectedMaterials(prev => [...prev, materialString]);
    }
  };

  const handleMaterialRemove = (materialToRemove: string) => {
    setSelectedMaterials(prev => prev.filter(m => m !== materialToRemove));
  };

  const handleSubmit = () => {
    if (!tileName || !zone || !status || !assignedTo) {
      alert("Proszę wypełnić wszystkie wymagane pola");
      return;
    }

    const tileData = {
      name: tileName,
      zone,
      status,
      assignedTo,
      priority,
      estimatedTime,
      notes,
      progress,
      materials: selectedMaterials,
      dxfFile: dxfFile || null,
      assemblyDrawing: assemblyDrawing || null
    };

    onSave(tileData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {editingTile ? "Edytuj Kafelek" : "Dodaj Nowy Kafelek"}
          </DialogTitle>
          <DialogDescription>
            {editingTile 
              ? "Zaktualizuj informacje o kafelku produkcyjnym"
              : "Utwórz nowy kafelek produkcyjny z materiałami i dokumentacją"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Podstawowe informacje */}
          <div className="space-y-4">
            <h3 className="font-medium">Podstawowe informacje</h3>
            
            <div className="space-y-2">
              <Label htmlFor="tile-name">Nazwa kafelka *</Label>
              <Input
                id="tile-name"
                placeholder="np. Panel główny recepcji"
                value={tileName}
                onChange={(e) => setTileName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="zone">Strefa *</Label>
                <Select value={zone} onValueChange={setZone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz strefę" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((z) => (
                      <SelectItem key={z} value={z}>{z}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priorytet</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assigned">Przypisany do *</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz osobę" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableMembers.map((member) => (
                      <SelectItem key={member} value={member}>{member}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated-time">Szacowany czas</Label>
              <Input
                id="estimated-time"
                placeholder="np. 4h, 2 dni"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Postęp (%)</Label>
              <div className="space-y-3">
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value) || 0)}
                />
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notatki</Label>
              <Textarea
                id="notes"
                placeholder="Dodatkowe informacje o kafelku..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Materiały i pliki */}
          <div className="space-y-4">
            <h3 className="font-medium">Materiały i dokumentacja</h3>
            
            {/* Materiały */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Materiały</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMaterialsModal(true)}
                  className="gap-2"
                >
                  <Database className="w-4 h-4" />
                  Wybierz z bazy
                </Button>
              </div>

              {selectedMaterials.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Wybrane materiały:</p>
                  <div className="space-y-1">
                    {selectedMaterials.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">{material}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMaterialRemove(material)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Pliki */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Pliki techniczne</h4>
              
              <div className="space-y-2">
                <Label htmlFor="dxf-file">Plik DXF/DWG</Label>
                <div className="flex gap-2">
                  <Input
                    id="dxf-file"
                    placeholder="nazwa_pliku.dxf"
                    value={dxfFile}
                    onChange={(e) => setDxfFile(e.target.value)}
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assembly-drawing">Rysunek montażowy</Label>
                <div className="flex gap-2">
                  <Input
                    id="assembly-drawing"
                    placeholder="montaz_schemat.pdf"
                    value={assemblyDrawing}
                    onChange={(e) => setAssemblyDrawing(e.target.value)}
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Podgląd statusu */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Podgląd</h4>
              <div className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{tileName || "Nazwa kafelka"}</span>
                  <Badge className={`text-xs ${getPriorityColor(priority)}`}>
                    {priority}
                  </Badge>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(status)} text-xs`}
                >
                  {status}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{assignedTo || "Nie przypisano"}</span>
                </div>
                {estimatedTime && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Timer className="w-3 h-3" />
                    <span>{estimatedTime}</span>
                  </div>
                )}
              </div>
            </div>
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
            disabled={!tileName || !zone || !status || !assignedTo}
          >
            {editingTile ? "Aktualizuj" : "Dodaj"} Kafelek
          </Button>
        </div>

        {/* Materials Selection Modal */}
        <MaterialsSelectionModal
          open={showMaterialsModal}
          onOpenChange={setShowMaterialsModal}
          onMaterialSelect={handleMaterialAdd}
        />
      </DialogContent>
    </Dialog>
  );
}