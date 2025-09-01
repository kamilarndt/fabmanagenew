// Struktura danych materiałów na podstawie plików layers_latest.json i layers_20250819_142057.json
export interface MaterialData {
  id: string
  code: string
  name: string
  category: string[]
  subcategory?: string
  thickness?: number
  unit: string
  stock: number
  minStock: number
  maxStock: number
  supplier: string
  supplierCode?: string
  price: number
  lastDelivery?: Date
  location?: string
  abcClass?: 'A' | 'B' | 'C'
  properties?: {
    color?: string
    finish?: string
    fireResistant?: boolean
    flexible?: boolean
    waterResistant?: boolean
    [key: string]: any
  }
}

// Hierarchiczna struktura kategorii
export const materialCategories = {
  "_M": {
    name: "Płyty meblowe",
    subcategories: {
      "MDF": {
        name: "MDF",
        thickness: [3, 6, 8, 10, 12, 16, 18, 19, 22, 25, 28, 30, 38],
        variants: ["STANDARD", "LAKIEROWANA", "DO_GIECIA", "TRUDNOPALNA", "WILGOCIOODPORNA"]
      },
      "SKLEJKA": {
        name: "Sklejka",
        thickness: [3, 4, 6, 9, 12, 15, 18, 21, 24, 27, 30],
        variants: ["BRZOZA", "TOPOLA", "SUCHOTRWALA", "WODOODPORNA", "ANTYPOŚLIZGOWA"]
      },
      "PLYTA_WIÓROWA": {
        name: "Płyta wiórowa",
        thickness: [8, 10, 12, 16, 18, 22, 25, 28, 38],
        variants: ["SUROWA", "LAMINOWANA", "DWUSTRONNA"]
      },
      "OSB": {
        name: "OSB",
        thickness: [6, 9, 12, 15, 18, 22, 25],
        variants: ["OSB2", "OSB3", "OSB4"]
      }
    }
  },
  "_PLEXI": {
    name: "Plexi / Akryl",
    subcategories: {
      "PLEXI_EXTRUDOWANA": {
        name: "Plexi ekstrudowana",
        thickness: [1, 2, 3, 4, 5, 6, 8, 10],
        colors: ["BEZBARWNA", "BIALA", "CZARNA", "CZERWONA", "NIEBIESKA", "ZOLTA", "ZIELONA", "DYMIONA"]
      },
      "PLEXI_LANA": {
        name: "Plexi lana",
        thickness: [3, 4, 5, 6, 8, 10, 12, 15, 20],
        colors: ["BEZBARWNA", "BIALA", "CZARNA", "SATYNOWA"]
      }
    }
  },
  "_DIBOND": {
    name: "Dibond / Kompozyt",
    subcategories: {
      "DIBOND": {
        name: "Dibond",
        thickness: [3, 4],
        colors: ["BIALY", "CZARNY", "SREBRNY", "ZLOTY", "SZARY", "ANTRACYT"]
      },
      "ALURAPID": {
        name: "Alurapid",
        thickness: [3, 4, 6],
        colors: ["BIALY", "CZARNY", "SREBRNY"]
      }
    }
  },
  "_ELEKTRYKA": {
    name: "Elektryka",
    subcategories: {
      "LED": {
        name: "Oświetlenie LED",
        types: ["TASMA_LED", "PROFIL_LED", "ZASILACZ", "STEROWNIK", "MODUL_LED"]
      },
      "KABLE": {
        name: "Kable",
        types: ["YDY", "YDYp", "OMY", "HDMI", "USB", "ETHERNET"]
      }
    }
  }
}

// Przykładowe dane materiałów
export const mockMaterials: MaterialData[] = [
  // MDF
  {
    id: "MAT001",
    code: "_M/MDF/18/STD",
    name: "MDF 18mm Standard",
    category: ["_M", "MDF"],
    thickness: 18,
    unit: "arkusz",
    stock: 42,
    minStock: 20,
    maxStock: 100,
    supplier: "Kronopol",
    price: 125.50,
    lastDelivery: new Date("2025-01-10"),
    location: "A1-01",
    abcClass: "A",
    properties: {
      color: "surowy",
      finish: "gładki",
      fireResistant: false,
      flexible: false,
      waterResistant: false
    }
  },
  {
    id: "MAT002",
    code: "_M/MDF/18/GIEC",
    name: "MDF 18mm Do gięcia",
    category: ["_M", "MDF"],
    thickness: 18,
    unit: "arkusz",
    stock: 8,
    minStock: 15,
    maxStock: 50,
    supplier: "Kronopol",
    price: 168.00,
    lastDelivery: new Date("2024-12-20"),
    location: "A1-02",
    abcClass: "B",
    properties: {
      color: "surowy",
      finish: "gładki",
      fireResistant: false,
      flexible: true,
      waterResistant: false
    }
  },
  {
    id: "MAT003",
    code: "_M/MDF/18/TRUDNO",
    name: "MDF 18mm Trudnopalna",
    category: ["_M", "MDF"],
    thickness: 18,
    unit: "arkusz",
    stock: 5,
    minStock: 10,
    maxStock: 30,
    supplier: "Pfleiderer",
    price: 245.00,
    lastDelivery: new Date("2024-11-15"),
    location: "A1-03",
    abcClass: "C",
    properties: {
      color: "czerwony",
      finish: "gładki",
      fireResistant: true,
      flexible: false,
      waterResistant: false
    }
  },
  // SKLEJKA
  {
    id: "MAT004",
    code: "_M/SKLEJKA/18/BRZOZA",
    name: "Sklejka brzozowa 18mm",
    category: ["_M", "SKLEJKA"],
    thickness: 18,
    unit: "arkusz",
    stock: 25,
    minStock: 15,
    maxStock: 60,
    supplier: "Paged",
    price: 189.00,
    lastDelivery: new Date("2025-01-05"),
    location: "A2-01",
    abcClass: "A",
    properties: {
      color: "naturalna brzoza",
      finish: "szlifowana",
      fireResistant: false,
      flexible: false,
      waterResistant: false
    }
  },
  {
    id: "MAT005",
    code: "_M/SKLEJKA/12/WODOODP",
    name: "Sklejka wodoodporna 12mm",
    category: ["_M", "SKLEJKA"],
    thickness: 12,
    unit: "arkusz",
    stock: 18,
    minStock: 10,
    maxStock: 40,
    supplier: "Paged",
    price: 156.00,
    lastDelivery: new Date("2024-12-28"),
    location: "A2-02",
    abcClass: "B",
    properties: {
      color: "naturalna",
      finish: "szlifowana",
      fireResistant: false,
      flexible: false,
      waterResistant: true
    }
  },
  // PLEXI
  {
    id: "MAT006",
    code: "_PLEXI/EXTR/3/BEZB",
    name: "Plexi ekstrudowana 3mm bezbarwna",
    category: ["_PLEXI", "PLEXI_EXTRUDOWANA"],
    thickness: 3,
    unit: "arkusz",
    stock: 35,
    minStock: 20,
    maxStock: 80,
    supplier: "PlastPro",
    price: 78.00,
    lastDelivery: new Date("2025-01-08"),
    location: "B1-01",
    abcClass: "A",
    properties: {
      color: "bezbarwna",
      finish: "błyszcząca",
      fireResistant: false,
      flexible: false,
      waterResistant: true
    }
  },
  {
    id: "MAT007",
    code: "_PLEXI/LANA/5/BIALA",
    name: "Plexi lana 5mm biała",
    category: ["_PLEXI", "PLEXI_LANA"],
    thickness: 5,
    unit: "arkusz",
    stock: 12,
    minStock: 10,
    maxStock: 40,
    supplier: "PlastPro",
    price: 135.00,
    lastDelivery: new Date("2024-12-15"),
    location: "B1-02",
    abcClass: "B",
    properties: {
      color: "biała",
      finish: "matowa",
      fireResistant: false,
      flexible: false,
      waterResistant: true
    }
  },
  // DIBOND
  {
    id: "MAT008",
    code: "_DIBOND/3/BIALY",
    name: "Dibond 3mm biały",
    category: ["_DIBOND", "DIBOND"],
    thickness: 3,
    unit: "arkusz",
    stock: 22,
    minStock: 15,
    maxStock: 50,
    supplier: "Aluprint",
    price: 165.00,
    lastDelivery: new Date("2025-01-03"),
    location: "C1-01",
    abcClass: "A",
    properties: {
      color: "biały RAL 9016",
      finish: "matowa",
      fireResistant: true,
      flexible: false,
      waterResistant: true
    }
  },
  // ELEKTRYKA
  {
    id: "MAT009",
    code: "_ELEK/LED/TASMA/5M",
    name: "Taśma LED 5m RGB",
    category: ["_ELEKTRYKA", "LED"],
    unit: "rolka",
    stock: 45,
    minStock: 20,
    maxStock: 100,
    supplier: "LightCo",
    price: 89.00,
    lastDelivery: new Date("2025-01-12"),
    location: "D1-01",
    abcClass: "A",
    properties: {
      color: "RGB",
      power: "14.4W/m",
      voltage: "12V",
      waterResistant: true
    }
  },
  {
    id: "MAT010",
    code: "_ELEK/LED/PROFIL/2M",
    name: "Profil LED aluminiowy 2m",
    category: ["_ELEKTRYKA", "LED"],
    unit: "sztuka",
    stock: 38,
    minStock: 25,
    maxStock: 80,
    supplier: "LightCo",
    price: 42.00,
    lastDelivery: new Date("2025-01-10"),
    location: "D1-02",
    abcClass: "B",
    properties: {
      color: "srebrny anodowany",
      type: "wpuszczany",
      coverType: "mleczny"
    }
  },
  // Więcej przykładowych materiałów...
  {
    id: "MAT011",
    code: "_M/PLYTA_W/18/LAM",
    name: "Płyta wiórowa 18mm laminowana biała",
    category: ["_M", "PLYTA_WIÓROWA"],
    thickness: 18,
    unit: "arkusz",
    stock: 3,
    minStock: 20,
    maxStock: 60,
    supplier: "Egger",
    price: 98.00,
    lastDelivery: new Date("2024-11-20"),
    location: "A3-01",
    abcClass: "A",
    properties: {
      color: "biały",
      finish: "laminat",
      fireResistant: false,
      flexible: false,
      waterResistant: false
    }
  },
  {
    id: "MAT012",
    code: "_M/OSB/12/OSB3",
    name: "OSB3 12mm",
    category: ["_M", "OSB"],
    thickness: 12,
    unit: "arkusz",
    stock: 55,
    minStock: 30,
    maxStock: 100,
    supplier: "Swiss Krono",
    price: 52.00,
    lastDelivery: new Date("2025-01-07"),
    location: "A4-01",
    abcClass: "B",
    properties: {
      color: "naturalna",
      finish: "surowa",
      fireResistant: false,
      flexible: false,
      waterResistant: true
    }
  }
]

// Funkcja do generowania hierarchii z płaskiej listy
export function buildMaterialHierarchy(materials: MaterialData[]) {
  const hierarchy: any = {}
  
  materials.forEach(material => {
    const [mainCat, subCat] = material.category
    
    if (!hierarchy[mainCat]) {
      hierarchy[mainCat] = {
        name: materialCategories[mainCat as keyof typeof materialCategories]?.name || mainCat,
        subcategories: {},
        materials: []
      }
    }
    
    if (subCat) {
      if (!hierarchy[mainCat].subcategories[subCat]) {
        hierarchy[mainCat].subcategories[subCat] = {
          name: subCat,
          materials: []
        }
      }
      hierarchy[mainCat].subcategories[subCat].materials.push(material)
    } else {
      hierarchy[mainCat].materials.push(material)
    }
  })
  
  return hierarchy
}

// Funkcja do filtrowania materiałów
export function filterMaterials(
  materials: MaterialData[],
  filters: {
    search?: string
    category?: string[]
    status?: 'all' | 'critical' | 'low' | 'normal' | 'excess'
    supplier?: string
    abcClass?: 'A' | 'B' | 'C'
  }
): MaterialData[] {
  return materials.filter(material => {
    // Filtr wyszukiwania
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const searchFields = [
        material.code,
        material.name,
        material.supplier,
        material.location
      ].filter(Boolean).join(' ').toLowerCase()
      
      if (!searchFields.includes(searchLower)) {
        return false
      }
    }
    
    // Filtr kategorii
    if (filters.category && filters.category.length > 0) {
      const materialCatPath = material.category.join('/')
      const filterCatPath = filters.category.join('/')
      if (!materialCatPath.startsWith(filterCatPath)) {
        return false
      }
    }
    
    // Filtr statusu
    if (filters.status && filters.status !== 'all') {
      const stockRatio = material.stock / material.minStock
      let materialStatus: typeof filters.status = 'normal'
      
      if (stockRatio < 0.5) materialStatus = 'critical'
      else if (stockRatio < 1) materialStatus = 'low'
      else if (stockRatio > material.maxStock / material.minStock) materialStatus = 'excess'
      
      if (materialStatus !== filters.status) {
        return false
      }
    }
    
    // Filtr dostawcy
    if (filters.supplier && material.supplier !== filters.supplier) {
      return false
    }
    
    // Filtr klasy ABC
    if (filters.abcClass && material.abcClass !== filters.abcClass) {
      return false
    }
    
    return true
  })
}

// Funkcja do obliczania statystyk
export function calculateMaterialStats(materials: MaterialData[]) {
  const stats = {
    totalValue: 0,
    criticalCount: 0,
    lowCount: 0,
    excessCount: 0,
    totalItems: materials.length,
    byCategory: {} as Record<string, number>,
    bySupplier: {} as Record<string, number>,
    byAbcClass: { A: 0, B: 0, C: 0 }
  }
  
  materials.forEach(material => {
    // Wartość magazynu
    stats.totalValue += material.stock * material.price
    
    // Status zapasów
    const stockRatio = material.stock / material.minStock
    if (stockRatio < 0.5) stats.criticalCount++
    else if (stockRatio < 1) stats.lowCount++
    else if (stockRatio > material.maxStock / material.minStock) stats.excessCount++
    
    // Grupowanie po kategorii
    const mainCat = material.category[0]
    stats.byCategory[mainCat] = (stats.byCategory[mainCat] || 0) + 1
    
    // Grupowanie po dostawcy
    stats.bySupplier[material.supplier] = (stats.bySupplier[material.supplier] || 0) + 1
    
    // Grupowanie po klasie ABC
    if (material.abcClass) {
      stats.byAbcClass[material.abcClass]++
    }
  })
  
  return stats
}