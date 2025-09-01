import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useMaterials } from "../utils/supabase/hooks";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { 
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Euro,
  Filter,
  Loader2
} from "lucide-react";

interface MaterialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MaterialsModal({ 
  open, 
  onOpenChange
}: MaterialsModalProps) {
  const { 
    materials, 
    loading, 
    error, 
    createMaterial, 
    updateMaterial, 
    deleteMaterial,
    fetchMaterials
  } = useMaterials();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  
  // Form states
  const [materialName, setMaterialName] = useState("");
  const [materialCategory, setMaterialCategory] = useState("");
  const [materialUnit, setMaterialUnit] = useState("");
  const [materialPrice, setMaterialPrice] = useState("");
  const [materialDescription, setMaterialDescription] = useState("");

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

  const units = [
    "szt",
    "m",
    "m²",
    "m³",
    "L",
    "kg",
    "arkusz",
    "opakowanie"
  ];

  const resetForm = () => {
    setMaterialName("");
    setMaterialCategory("");
    setMaterialUnit("");
    setMaterialPrice("");
    setMaterialDescription("");
    setEditingMaterial(null);
    setShowAddForm(false);
  };

  const handleEdit = (material: any) => {
    setEditingMaterial(material);
    setMaterialName(material.name);
    setMaterialCategory(material.category);
    setMaterialUnit(material.unit);
    setMaterialPrice(material.price.replace(" PLN", ""));
    setMaterialDescription(material.description || "");
    setShowAddForm(true);
  };

  const handleSubmit = async () => {
    if (!materialName || !materialCategory || !materialUnit || !materialPrice) {
      showErrorToast("Proszę wypełnić wszystkie wymagane pola");
      return;
    }

    try {
      const materialData = {
        name: materialName,
        category: materialCategory,
        unit: materialUnit,
        price: `${materialPrice} PLN`,
        description: materialDescription
      };

      if (editingMaterial) {
        await updateMaterial(editingMaterial.id, materialData);
        showSuccessToast("Materiał został zaktualizowany pomyślnie");
      } else {
        await createMaterial(materialData);
        showSuccessToast("Materiał został dodany pomyślnie");
      }

      resetForm();
    } catch (error) {
      showErrorToast("Błąd podczas zapisywania materiału");
      console.error('Error saving material:', error);
    }
  };

  const handleDelete = async (materialId: string) => {
    try {
      await deleteMaterial(materialId);
      showSuccessToast("Materiał został usunięty pomyślnie");
    } catch (error) {
      showErrorToast("Błąd podczas usuwania materiału");
      console.error('Error deleting material:', error);
    }
  };

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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Baza Materiałów
          </DialogTitle>
          <DialogDescription>
            Zarządzaj bazą materiałów używanych w projektach produkcyjnych
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Lista materiałów */}
          <div className="flex-1 space-y-4">
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

              <Button 
                onClick={() => setShowAddForm(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Dodaj Materiał
              </Button>
            </div>

            {/* Lista materiałów */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{material.name}</h4>
                          <p className="text-xs text-muted-foreground">{material.id}</p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(material)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(material.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
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

          {/* Formularz dodawania/edycji */}
          {showAddForm && (
            <div className="w-full lg:w-96">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingMaterial ? "Edytuj Materiał" : "Dodaj Nowy Materiał"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="material-name">Nazwa materiału *</Label>
                    <Input
                      id="material-name"
                      placeholder="np. MDF 18mm Surowy"
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="material-category">Kategoria *</Label>
                    <Select value={materialCategory} onValueChange={setMaterialCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="material-unit">Jednostka *</Label>
                      <Select value={materialUnit} onValueChange={setMaterialUnit}>
                        <SelectTrigger>
                          <SelectValue placeholder="Jednostka" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="material-price">Cena (PLN) *</Label>
                      <div className="relative">
                        <Input
                          id="material-price"
                          placeholder="120"
                          value={materialPrice}
                          onChange={(e) => setMaterialPrice(e.target.value)}
                          className="pr-12"
                        />
                        <Euro className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="material-description">Opis</Label>
                    <Input
                      id="material-description"
                      placeholder="Dodatkowy opis materiału..."
                      value={materialDescription}
                      onChange={(e) => setMaterialDescription(e.target.value)}
                    />
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="flex-1"
                    >
                      Anuluj
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!materialName || !materialCategory || !materialUnit || !materialPrice}
                      className="flex-1"
                    >
                      {editingMaterial ? "Aktualizuj" : "Dodaj"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Łącznie materiałów: {materials.length}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Zamknij
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}