import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
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
  Euro,
  Calculator,
  Settings,
  CheckCircle2
} from "lucide-react";
import { 
  ActionButton,
  ConstructorCard,
  ConstructorFlex,
  ConstructorGrid,
  ConstructorStack,
  StatusBadge,
  PriorityBadge,
  ZoneBadge
} from "./ui-kit";
import { MaterialsModal } from "./MaterialsModal";

interface TileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tileData: any) => void;
  editingTile?: any;
  zones: string[];
  statuses: string[];
  assignableMembers: string[];
  materials: any[];
  onMaterialAdd?: (material: any) => void;
  onMaterialUpdate?: (id: string, material: any) => void;
  onMaterialDelete?: (id: string) => void;
}

export function TileEditModal({ 
  open, 
  onOpenChange, 
  onSave, 
  editingTile,
  zones,
  statuses,
  assignableMembers,
  materials,
  onMaterialAdd,
  onMaterialUpdate,
  onMaterialDelete
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

  const handleMaterialSelect = (material: any) => {
    const materialString = `${material.name} - ${material.price}`;
    if (!selectedMaterials.includes(materialString)) {
      setSelectedMaterials(prev => [...prev, materialString]);
    }
  };

  const handleMaterialRemove = (materialToRemove: string) => {
    setSelectedMaterials(prev => prev.filter(m => m !== materialToRemove));
  };

  const calculateTotalCost = () => {
    return selectedMaterials.reduce((total, materialString) => {
      const priceMatch = materialString.match(/(\d+(?:\.\d+)?) PLN/);
      if (priceMatch) {
        return total + parseFloat(priceMatch[1]);
      }
      return total;
    }, 0);
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
      assemblyDrawing: assemblyDrawing || null,
      totalCost: calculateTotalCost()
    };

    onSave(tileData);
  };

  const getSelectedMaterialsData = () => {
    return selectedMaterials.map(materialString => {
      const [name, price] = materialString.split(" - ");
      return { name, price };
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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
            {/* Left Column - Basic Information */}
            <ConstructorStack gap="lg">
              <ConstructorCard variant="elevated" size="lg">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Podstawowe informacje
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="tile-name">Nazwa kafelka *</Label>
                      <Input
                        id="tile-name"
                        placeholder="np. Panel główny recepcji"
                        value={tileName}
                        onChange={(e) => setTileName(e.target.value)}
                      />
                    </div>

                    <ConstructorGrid cols={2} gap="md">
                      <div>
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

                      <div>
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
                    </ConstructorGrid>

                    <ConstructorGrid cols={2} gap="md">
                      <div>
                        <Label htmlFor="status">Status *</Label>
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="assigned-to">Przypisana osoba *</Label>
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
                    </ConstructorGrid>

                    <div>
                      <Label htmlFor="estimated-time">Szacowany czas</Label>
                      <Input
                        id="estimated-time"
                        placeholder="np. 4h, 2d"
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(e.target.value)}
                      />
                    </div>

                    <div>
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
                </div>
              </ConstructorCard>

              {/* Progress and Files */}
              <ConstructorCard variant="elevated" size="lg">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Postęp i pliki
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="progress">Postęp (%)</Label>
                      <div className="space-y-2">
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

                    <div>
                      <Label htmlFor="dxf-file">Plik DXF</Label>
                      <Input
                        id="dxf-file"
                        placeholder="nazwa_pliku.dxf"
                        value={dxfFile}
                        onChange={(e) => setDxfFile(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="assembly-drawing">Rysunek montażowy</Label>
                      <Input
                        id="assembly-drawing"
                        placeholder="nazwa_pliku.pdf"
                        value={assemblyDrawing}
                        onChange={(e) => setAssemblyDrawing(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </ConstructorCard>
            </ConstructorStack>

            {/* Right Column - Materials and Preview */}
            <ConstructorStack gap="lg">
              {/* Materials Selection */}
              <ConstructorCard variant="elevated" size="lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Materiały
                    </h3>
                    <ActionButton 
                      action="add" 
                      size="sm"
                      onClick={() => setShowMaterialsModal(true)}
                    >
                      Wybierz Materiały
                    </ActionButton>
                  </div>
                  
                  {selectedMaterials.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Wybrane materiały:</span>
                        <span className="font-medium">{selectedMaterials.length}</span>
                      </div>
                      
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {getSelectedMaterialsData().map((material, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{material.name}</p>
                              <p className="text-xs text-muted-foreground">{material.price}</p>
                            </div>
                            <ActionButton 
                              action="delete" 
                              size="sm"
                              onClick={() => handleMaterialRemove(selectedMaterials[index])}
                            >
                              <X className="w-3 h-3" />
                            </ActionButton>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Łączny koszt materiałów:</span>
                        <span className="font-semibold text-lg text-green-600">
                          {calculateTotalCost().toFixed(2)} PLN
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Brak wybranych materiałów</p>
                      <p className="text-xs">Kliknij "Wybierz Materiały" aby dodać</p>
                    </div>
                  )}
                </div>
              </ConstructorCard>

              {/* Tile Preview */}
              <ConstructorCard variant="elevated" size="lg">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Podgląd kafelka
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {tileName || "Nazwa kafelka"}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {zone || "Strefa"} • {assignedTo || "Osoba"}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {priority && <PriorityBadge priority={priority} size="sm" />}
                        {status && <StatusBadge status={status} size="sm" />}
                        {zone && <ZoneBadge zone={zone} size="sm" />}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Postęp</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1">
                        <Timer className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {estimatedTime || "Brak szacowania"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Euro className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Koszt: {calculateTotalCost().toFixed(2)} PLN
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Materiały: {selectedMaterials.length}
                        </span>
                      </div>
                    </div>

                    {dxfFile && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <FileText className="w-3 h-3" />
                        <span>DXF: {dxfFile}</span>
                      </div>
                    )}

                    {assemblyDrawing && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <FileText className="w-3 h-3" />
                        <span>PDF: {assemblyDrawing}</span>
                      </div>
                    )}
                  </div>
                </div>
              </ConstructorCard>
            </ConstructorStack>
          </div>

          {/* Action Buttons */}
          <ConstructorFlex direction="row" justify="end" gap="md" className="pt-4 border-t">
            <ActionButton 
              action="cancel" 
              size="md"
              onClick={() => onOpenChange(false)}
            >
              Anuluj
            </ActionButton>
            <ActionButton 
              action="save" 
              size="md"
              onClick={handleSubmit}
            >
              {editingTile ? "Zapisz Zmiany" : "Utwórz Kafelek"}
            </ActionButton>
          </ConstructorFlex>
        </DialogContent>
      </Dialog>

      {/* Materials Modal */}
      <MaterialsModal
        open={showMaterialsModal}
        onOpenChange={setShowMaterialsModal}
        materials={materials}
        onMaterialAdd={onMaterialAdd}
        onMaterialUpdate={onMaterialUpdate}
        onMaterialDelete={onMaterialDelete}
        onMaterialSelect={handleMaterialSelect}
        selectedMaterials={selectedMaterials}
        isSelectionMode={true}
      />
    </>
  );
}