import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Package,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Euro,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Warehouse
} from "lucide-react";
import { MaterialsModal } from "../MaterialsModal";

export function MagazynComplete() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);

  // Extended materials database with stock information
  const [materials, setMaterials] = useState([
    { 
      id: "MAT-001", 
      name: "MDF 18mm Surowy", 
      unit: "arkusz", 
      price: "120 PLN", 
      category: "Płyty",
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      location: "A1-2",
      supplier: "IKEA Industry",
      lastOrder: "2024-08-15",
      usage7d: 8
    },
    { 
      id: "MAT-002", 
      name: "MDF 12mm Surowy", 
      unit: "arkusz", 
      price: "85 PLN", 
      category: "Płyty",
      currentStock: 15,
      minStock: 8,
      maxStock: 40,
      location: "A1-3",
      supplier: "IKEA Industry",
      lastOrder: "2024-08-10",
      usage7d: 5
    },
    { 
      id: "MAT-003", 
      name: "Laminat HPL Biały", 
      unit: "m²", 
      price: "45 PLN", 
      category: "Laminaty",
      currentStock: 120,
      minStock: 50,
      maxStock: 200,
      location: "B2-1",
      supplier: "Formica Group",
      lastOrder: "2024-08-20",
      usage7d: 18
    },
    { 
      id: "MAT-004", 
      name: "Krawędź ABS Biała", 
      unit: "m", 
      price: "12 PLN", 
      category: "Okleiny",
      currentStock: 8,
      minStock: 15,
      maxStock: 100,
      location: "C1-1",
      supplier: "Rehau",
      lastOrder: "2024-07-28",
      usage7d: 12
    },
    { 
      id: "MAT-005", 
      name: "Farba RAL 9003", 
      unit: "L", 
      price: "35 PLN", 
      category: "Farby",
      currentStock: 45,
      minStock: 20,
      maxStock: 60,
      location: "D3-2",
      supplier: "Dulux Professional",
      lastOrder: "2024-08-12",
      usage7d: 3
    },
    { 
      id: "MAT-006", 
      name: "Taśma LED 24V", 
      unit: "m", 
      price: "25 PLN", 
      category: "Elektronika",
      currentStock: 180,
      minStock: 50,
      maxStock: 300,
      location: "E1-4",
      supplier: "Philips Lighting",
      lastOrder: "2024-08-18",
      usage7d: 22
    },
    { 
      id: "MAT-007", 
      name: "Kleiny PUR", 
      unit: "L", 
      price: "28 PLN", 
      category: "Kleje",
      currentStock: 12,
      minStock: 15,
      maxStock: 30,
      location: "F2-3",
      supplier: "Henkel",
      lastOrder: "2024-07-30",
      usage7d: 4
    },
    { 
      id: "MAT-008", 
      name: "Zawiasy 35mm", 
      unit: "szt", 
      price: "18 PLN", 
      category: "Okucia",
      currentStock: 240,
      minStock: 100,
      maxStock: 500,
      location: "G1-1",
      supplier: "Blum",
      lastOrder: "2024-08-14",
      usage7d: 16
    },
    { 
      id: "MAT-009", 
      name: "Uchwyt chrom", 
      unit: "szt", 
      price: "15 PLN", 
      category: "Okucia",
      currentStock: 85,
      minStock: 50,
      maxStock: 200,
      location: "G1-2",
      supplier: "Hettich",
      lastOrder: "2024-08-16",
      usage7d: 7
    }
  ]);

  const categories = [
    "Płyty",
    "Laminaty", 
    "Okleiny",
    "Farby",
    "Kleje",
    "Okucia",
    "Elektronika"
  ];

  const getStockStatus = (material: any) => {
    const { currentStock, minStock, maxStock } = material;
    if (currentStock <= minStock) return "low";
    if (currentStock >= maxStock) return "high";
    return "normal";
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "low": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "normal": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStockStatusText = (status: string) => {
    switch (status) {
      case "low": return "Niski stan";
      case "high": return "Wysokie zapasy";
      case "normal": return "Optymalny";
      default: return "Nieznany";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Płyty": "bg-blue-100 text-blue-800",
      "Laminaty": "bg-green-100 text-green-800",
      "Okleiny": "bg-yellow-100 text-yellow-800",
      "Farby": "bg-purple-100 text-purple-800",
      "Kleje": "bg-orange-100 text-orange-800",
      "Okucia": "bg-gray-100 text-gray-800",
      "Elektronika": "bg-red-100 text-red-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const handleMaterialAdd = (material: any) => {
    const newMaterial = {
      ...material,
      currentStock: 0,
      minStock: 10,
      maxStock: 100,
      location: "Nieprzypisane",
      supplier: "Do określenia",
      lastOrder: new Date().toISOString().split('T')[0],
      usage7d: 0
    };
    setMaterials(prev => [...prev, newMaterial]);
  };

  const handleMaterialUpdate = (id: string, materialData: any) => {
    setMaterials(prev => prev.map(material => 
      material.id === id ? { ...material, ...materialData } : material
    ));
  };

  const handleMaterialDelete = (id: string) => {
    setMaterials(prev => prev.filter(material => material.id !== id));
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || material.category === filterCategory;
    
    let matchesStock = true;
    if (filterStock === "low") {
      matchesStock = getStockStatus(material) === "low";
    } else if (filterStock === "high") {
      matchesStock = getStockStatus(material) === "high";
    } else if (filterStock === "normal") {
      matchesStock = getStockStatus(material) === "normal";
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockCount = materials.filter(m => getStockStatus(m) === "low").length;
  const totalValue = materials.reduce((sum, material) => {
    const price = parseFloat(material.price.replace(" PLN", ""));
    return sum + (price * material.currentStock);
  }, 0);

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-2">Magazyn</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Zarządzanie stanami magazynowymi i bazą materiałów
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowMaterialsModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Dodaj Materiał
          </Button>
          <Button variant="outline" size="sm">
            <Package className="w-4 h-4 mr-2" />
            Import z Excel
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Łączna wartość</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalValue.toLocaleString('pl-PL')} PLN
                </p>
              </div>
              <Euro className="w-8 h-8 text-green-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pozycje magazynowe</p>
                <p className="text-2xl font-bold text-blue-600">{materials.length}</p>
              </div>
              <Warehouse className="w-8 h-8 text-blue-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Niski stan</p>
                <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ostatnie zamówienie</p>
                <p className="text-2xl font-bold text-purple-600">3 dni</p>
                <p className="text-xs text-muted-foreground">temu</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600 opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj materiałów..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
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

            <Select value={filterStock} onValueChange={setFilterStock}>
              <SelectTrigger>
                <BarChart3 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Stan magazynu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie stany</SelectItem>
                <SelectItem value="low">Niski stan</SelectItem>
                <SelectItem value="normal">Optymalny</SelectItem>
                <SelectItem value="high">Wysokie zapasy</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Wyniki: {filteredMaterials.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMaterials.map((material) => {
          const stockStatus = getStockStatus(material);
          const stockPercentage = (material.currentStock / material.maxStock) * 100;
          
          return (
            <Card key={material.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm truncate">{material.name}</h4>
                    <p className="text-xs text-muted-foreground">{material.id}</p>
                  </div>
                  <Badge className={`text-xs ${getCategoryColor(material.category)}`}>
                    {material.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Stock Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stan magazynowy</span>
                    <Badge variant="outline" className={`${getStockStatusColor(stockStatus)} text-xs`}>
                      {getStockStatusText(stockStatus)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{material.currentStock} {material.unit}</span>
                      <span className="text-muted-foreground">
                        Max: {material.maxStock}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          stockStatus === 'low' 
                            ? 'bg-red-500' 
                            : stockStatus === 'high' 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Min: {material.minStock}</span>
                      <span>{Math.round(stockPercentage)}%</span>
                    </div>
                  </div>
                </div>

                {/* Price and Location */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Cena:</p>
                    <p className="font-medium">{material.price}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lokalizacja:</p>
                    <p className="font-medium">{material.location}</p>
                  </div>
                </div>

                {/* Usage */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Zużycie (7 dni):</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{material.usage7d} {material.unit}</span>
                      {material.usage7d > material.currentStock / 4 ? (
                        <TrendingUp className="w-3 h-3 text-red-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Supplier and Last Order */}
                <div className="text-xs text-muted-foreground space-y-1 border-t pt-2">
                  <p>Dostawca: {material.supplier}</p>
                  <p>Ostatnie zamówienie: {material.lastOrder}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Edytuj
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Plus className="w-3 h-3 mr-1" />
                    Zamów
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Brak materiałów</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterCategory !== "all" || filterStock !== "all"
              ? "Nie znaleziono materiałów spełniających kryteria"
              : "Brak materiałów w magazynie"
            }
          </p>
          <Button onClick={() => setShowMaterialsModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Dodaj pierwszy materiał
          </Button>
        </div>
      )}

      {/* Materials Management Modal */}
      <MaterialsModal
        open={showMaterialsModal}
        onOpenChange={setShowMaterialsModal}
        materials={materials}
        onMaterialAdd={handleMaterialAdd}
        onMaterialUpdate={handleMaterialUpdate}
        onMaterialDelete={handleMaterialDelete}
      />
    </div>
  );
}