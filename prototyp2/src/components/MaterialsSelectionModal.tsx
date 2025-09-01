import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { useMaterials } from "../utils/supabase/hooks";
import { 
  Package,
  Search,
  Filter,
  Loader2,
  Check,
  X
} from "lucide-react";

interface MaterialsSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialSelect: (material: any) => void;
}

export function MaterialsSelectionModal({ 
  open, 
  onOpenChange,
  onMaterialSelect
}: MaterialsSelectionModalProps) {
  const { 
    materials, 
    loading, 
    error, 
    fetchMaterials
  } = useMaterials();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());

  const categories = [
    "Płyty",
    "Laminaty", 
    "Okleiny",
    "Farby",
    "Kleje",
    "Okucia",
    "Elektronika",
    "Narzędzia",
    "Akcesoria"
  ];

  useEffect(() => {
    if (open) {
      fetchMaterials();
      setSelectedMaterials(new Set());
    }
  }, [open, fetchMaterials]);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || material.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Płyty": "bg-blue-100 text-blue-800",
      "Laminaty": "bg-green-100 text-green-800",
      "Okleiny": "bg-yellow-100 text-yellow-800",
      "Farby": "bg-purple-100 text-purple-800",
      "Kleje": "bg-orange-100 text-orange-800",
      "Okucia": "bg-gray-100 text-gray-800",
      "Elektronika": "bg-red-100 text-red-800",
      "Narzędzia": "bg-indigo-100 text-indigo-800",
      "Akcesoria": "bg-pink-100 text-pink-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const handleMaterialClick = (material: any) => {
    const materialId = material.id;
    const newSelected = new Set(selectedMaterials);
    
    if (selectedMaterials.has(materialId)) {
      newSelected.delete(materialId);
    } else {
      newSelected.add(materialId);
    }
    
    setSelectedMaterials(newSelected);
  };

  const handleConfirmSelection = () => {
    selectedMaterials.forEach(materialId => {
      const material = materials.find(m => m.id === materialId);
      if (material) {
        onMaterialSelect(material);
      }
    });
    onOpenChange(false);
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Ładowanie materiałów...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Wybierz Materiały
          </DialogTitle>
          <DialogDescription>
            Wybierz materiały z bazy, które chcesz przypisać do kafelka
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filtry i wyszukiwanie */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj materiałów..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Kategoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie kategorie</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lista materiałów */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {filteredMaterials.map((material) => (
              <Card 
                key={material.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMaterials.has(material.id) 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleMaterialClick(material)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{material.name}</h4>
                        <p className="text-xs text-muted-foreground">{material.id}</p>
                      </div>
                      {selectedMaterials.has(material.id) && (
                        <div className="ml-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    
                    <Badge className={`${getCategoryColor(material.category)} text-xs`}>
                      {material.category}
                    </Badge>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{material.unit}</span>
                      <span className="font-medium">{material.price}</span>
                    </div>
                    
                    {material.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {material.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                {searchTerm || filterCategory !== "all" 
                  ? "Nie znaleziono materiałów spełniających kryteria"
                  : "Brak materiałów w bazie"
                }
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Wybrano: {selectedMaterials.size} materiał(ów)
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" />
              Anuluj
            </Button>
            <Button 
              onClick={handleConfirmSelection}
              disabled={selectedMaterials.size === 0}
            >
              <Check className="w-4 h-4 mr-2" />
              Dodaj Wybrane ({selectedMaterials.size})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}