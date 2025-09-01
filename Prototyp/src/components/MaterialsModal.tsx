import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Euro,
  Filter,
  Check,
  X,
  Info,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { 
  ActionButton,
  ConstructorCard,
  ConstructorFlex,
  ConstructorGrid,
  ConstructorStack
} from "./ui-kit";

interface MaterialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materials: any[];
  onMaterialAdd: (material: any) => void;
  onMaterialUpdate: (id: string, material: any) => void;
  onMaterialDelete: (id: string) => void;
  // New props for tile integration
  onMaterialSelect?: (material: any) => void;
  selectedMaterials?: string[];
  isSelectionMode?: boolean;
}

export function MaterialsModal({ 
  open, 
  onOpenChange, 
  materials,
  onMaterialAdd,
  onMaterialUpdate,
  onMaterialDelete,
  onMaterialSelect,
  selectedMaterials = [],
  isSelectionMode = false
}: MaterialsModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Form states
  const [materialName, setMaterialName] = useState("");
  const [materialCategory, setMaterialCategory] = useState("");
  const [materialUnit, setMaterialUnit] = useState("");
  const [materialPrice, setMaterialPrice] = useState("");
  const [materialDescription, setMaterialDescription] = useState("");
  const [materialStock, setMaterialStock] = useState("");

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
    setMaterialStock("");
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
    setMaterialStock(material.stock || "");
    setShowAddForm(true);
  };

  const handleSubmit = () => {
    if (!materialName || !materialCategory || !materialUnit || !materialPrice) {
      alert("Proszę wypełnić wszystkie wymagane pola");
      return;
    }

    const materialData = {
      name: materialName,
      category: materialCategory,
      unit: materialUnit,
      price: `${materialPrice} PLN`,
      description: materialDescription,
      stock: materialStock ? parseInt(materialStock) : 0,
      lastUpdated: new Date().toISOString()
    };

    if (editingMaterial) {
      onMaterialUpdate(editingMaterial.id, materialData);
    } else {
      const newMaterial = {
        id: `MAT-${String(materials.length + 1).padStart(3, '0')}`,
        ...materialData,
        createdAt: new Date().toISOString()
      };
      onMaterialAdd(newMaterial);
    }

    resetForm();
  };

  const handleMaterialSelect = (material: any) => {
    if (isSelectionMode && onMaterialSelect) {
      onMaterialSelect(material);
    }
  };

  const filteredAndSortedMaterials = useMemo(() => {
    let filtered = materials.filter(material => {
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (material.description && material.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === "all" || material.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort materials
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "category":
          return a.category.localeCompare(b.category);
        case "price":
          return parseFloat(a.price) - parseFloat(b.price);
        case "stock":
          return (a.stock || 0) - (b.stock || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [materials, searchTerm, filterCategory, sortBy]);

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

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: "text-red-600", text: "Brak" };
    if (stock < 10) return { color: "text-orange-600", text: "Niski" };
    return { color: "text-green-600", text: "OK" };
  };

  // Statistics
  const stats = useMemo(() => {
    const totalMaterials = materials.length;
    const totalValue = materials.reduce((sum, m) => sum + parseFloat(m.price.replace(" PLN", "")) * (m.stock || 0), 0);
    const lowStock = materials.filter(m => (m.stock || 0) < 10).length;
    const categories = [...new Set(materials.map(m => m.category))].length;

    return { totalMaterials, totalValue, lowStock, categories };
  }, [materials]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Baza Materiałów
            {isSelectionMode && (
              <Badge variant="secondary" className="ml-2">
                Tryb wyboru
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Zarządzaj bazą materiałów używanych w projektach produkcyjnych
          </DialogDescription>
        </DialogHeader>

        {/* Statistics */}
        <ConstructorGrid cols={4} gap="md" className="mb-6">
          <ConstructorCard variant="outlined" size="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalMaterials}</div>
              <p className="text-sm text-muted-foreground">Łącznie materiałów</p>
            </div>
          </ConstructorCard>
          <ConstructorCard variant="outlined" size="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.categories}</div>
              <p className="text-sm text-muted-foreground">Kategorie</p>
            </div>
          </ConstructorCard>
          <ConstructorCard variant="outlined" size="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
              <p className="text-sm text-muted-foreground">Niski stan</p>
            </div>
          </ConstructorCard>
          <ConstructorCard variant="outlined" size="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalValue.toFixed(0)} PLN</div>
              <p className="text-sm text-muted-foreground">Wartość magazynu</p>
            </div>
          </ConstructorCard>
        </ConstructorGrid>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Lista materiałów */}
          <div className="flex-1 space-y-4">
            {/* Enhanced Filters and Search */}
            <ConstructorFlex direction="row" justify="between" align="center" gap="md" className="flex-col sm:flex-row">
              <ConstructorFlex gap="md" wrap="wrap" className="flex-1">
                <div className="relative flex-1 min-w-0">
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

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sortuj" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nazwa</SelectItem>
                    <SelectItem value="category">Kategoria</SelectItem>
                    <SelectItem value="price">Cena</SelectItem>
                    <SelectItem value="stock">Stan</SelectItem>
                  </SelectContent>
                </Select>
              </ConstructorFlex>

              <ConstructorFlex gap="md">
                <div className="flex border rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-2 text-sm ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-background"}`}
                  >
                    Siatka
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 text-sm ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background"}`}
                  >
                    Lista
                  </button>
                </div>

                {!isSelectionMode && (
                  <ActionButton 
                    action="add" 
                    size="sm"
                    onClick={() => setShowAddForm(true)}
                  >
                    Dodaj Materiał
                  </ActionButton>
                )}
              </ConstructorFlex>
            </ConstructorFlex>

            {/* Materials List */}
            {viewMode === "grid" ? (
              <ConstructorGrid cols={3} gap="md" className="max-h-96 overflow-y-auto">
                {filteredAndSortedMaterials.map((material) => (
                  <ConstructorCard
                    key={material.id}
                    variant="elevated"
                    size="md"
                    className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
                      isSelectionMode && selectedMaterials.includes(material.id) 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : ''
                    }`}
                    onClick={() => handleMaterialSelect(material)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{material.name}</h4>
                          <p className="text-xs text-muted-foreground">{material.id}</p>
                        </div>
                        <Badge className={getCategoryColor(material.category)}>
                          {material.category}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Cena:</span>
                          <span className="font-medium">{material.price}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Jednostka:</span>
                          <span className="font-medium">{material.unit}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Stan:</span>
                          <span className={`font-medium ${getStockStatus(material.stock || 0).color}`}>
                            {material.stock || 0} {material.unit}
                          </span>
                        </div>
                      </div>

                      {material.description && (
                        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                          {material.description}
                        </div>
                      )}

                      {!isSelectionMode && (
                        <ConstructorFlex gap="sm">
                          <ActionButton 
                            action="edit" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(material);
                            }}
                          >
                            Edytuj
                          </ActionButton>
                          <ActionButton 
                            action="delete" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Czy na pewno chcesz usunąć materiał "${material.name}"?`)) {
                                onMaterialDelete(material.id);
                              }
                            }}
                          >
                            Usuń
                          </ActionButton>
                        </ConstructorFlex>
                      )}

                      {isSelectionMode && selectedMaterials.includes(material.id) && (
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Check className="w-3 h-3" />
                          <span>Wybrany</span>
                        </div>
                      )}
                    </div>
                  </ConstructorCard>
                ))}
              </ConstructorGrid>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredAndSortedMaterials.map((material) => (
                  <ConstructorCard
                    key={material.id}
                    variant="outlined"
                    size="sm"
                    className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
                      isSelectionMode && selectedMaterials.includes(material.id) 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : ''
                    }`}
                    onClick={() => handleMaterialSelect(material)}
                  >
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{material.name}</h4>
                          <p className="text-xs text-muted-foreground">{material.id}</p>
                        </div>
                        <Badge className={getCategoryColor(material.category)}>
                          {material.category}
                        </Badge>
                        <div className="text-sm font-medium">{material.price}</div>
                        <div className="text-sm text-muted-foreground">{material.unit}</div>
                        <div className={`text-sm font-medium ${getStockStatus(material.stock || 0).color}`}>
                          {material.stock || 0}
                        </div>
                      </div>

                      {!isSelectionMode && (
                        <ConstructorFlex gap="sm">
                          <ActionButton 
                            action="edit" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(material);
                            }}
                          >
                            Edytuj
                          </ActionButton>
                          <ActionButton 
                            action="delete" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Czy na pewno chcesz usunąć materiał "${material.name}"?`)) {
                                onMaterialDelete(material.id);
                              }
                            }}
                          >
                            Usuń
                          </ActionButton>
                        </ConstructorFlex>
                      )}

                      {isSelectionMode && selectedMaterials.includes(material.id) && (
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Check className="w-3 h-3" />
                          <span>Wybrany</span>
                        </div>
                      )}
                    </div>
                  </ConstructorCard>
                ))}
              </div>
            )}

            {filteredAndSortedMaterials.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nie znaleziono materiałów</p>
                <p className="text-sm">Spróbuj zmienić filtry wyszukiwania</p>
              </div>
            )}
          </div>

          {/* Form Section */}
          {showAddForm && (
            <div className="lg:w-80 space-y-4">
              <ConstructorCard variant="elevated" size="lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {editingMaterial ? "Edytuj Materiał" : "Dodaj Nowy Materiał"}
                    </h3>
                    <button
                      onClick={resetForm}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">Nazwa materiału *</Label>
                      <Input
                        id="name"
                        value={materialName}
                        onChange={(e) => setMaterialName(e.target.value)}
                        placeholder="np. MDF 18mm Surowy"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Kategoria *</Label>
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
                      <div>
                        <Label htmlFor="unit">Jednostka *</Label>
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

                      <div>
                        <Label htmlFor="price">Cena (PLN) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={materialPrice}
                          onChange={(e) => setMaterialPrice(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="stock">Stan magazynowy</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={materialStock}
                        onChange={(e) => setMaterialStock(e.target.value)}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Opis</Label>
                      <textarea
                        id="description"
                        value={materialDescription}
                        onChange={(e) => setMaterialDescription(e.target.value)}
                        placeholder="Dodatkowe informacje o materiale..."
                        className="w-full min-h-[80px] p-3 border border-input rounded-md bg-background text-sm resize-none"
                      />
                    </div>

                    <ConstructorFlex gap="md">
                      <ActionButton 
                        action="save" 
                        size="md"
                        onClick={handleSubmit}
                        className="flex-1"
                      >
                        {editingMaterial ? "Zapisz Zmiany" : "Dodaj Materiał"}
                      </ActionButton>
                      <ActionButton 
                        action="cancel" 
                        size="md"
                        onClick={resetForm}
                        className="flex-1"
                      >
                        Anuluj
                      </ActionButton>
                    </ConstructorFlex>
                  </div>
                </div>
              </ConstructorCard>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}