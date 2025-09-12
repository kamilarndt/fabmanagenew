// Universal Material Management System (UMMS) Types
// Zgodne z PRD UMMS - rozróżnienie katalog vs magazyn

export interface UniversalMaterial {
  // Podstawowe informacje katalogowe
  id: string
  fabManageCode: string // np. "MDF_18_STD_001"
  universalName: string // np. "MDF 18mm Standard White"
  category: MaterialCategory // SHEET_MATERIAL, HARDWARE, LIGHTING, CUSTOM
  type: string // np. "MDF", "Śruba", "LED"
  
  // Właściwości fizyczne
  physicalProperties: {
    thickness?: number // mm
    density?: number // kg/m³
    dimensions?: {
      length?: number // mm
      width?: number // mm
      area?: number // m²
    }
    weight?: number // kg per unit
    color?: string // hex color
    finish?: string
    diameter?: number // mm for hardware
    length?: number // mm for hardware like screws
  }
  
  // Właściwości projektowe (dla CAD)
  designProperties: {
    renderColor: string // hex color for 3D rendering
    roughness?: number // 0-1
    metallic?: number // 0-1
    transparency?: number // 0-1
    textureMap?: string // URL to texture
    bumpMap?: string // URL to bump map
  }
  
  // Reguły walidacji
  validationRules: {
    allowedThickness?: number[] // mm tolerance
    warningThreshold?: number // mm
    errorThreshold?: number // mm
    cuttingConstraints?: {
      minCutWidth?: number // mm
      kerf?: number // mm
    }
  }
  
  // Dane kosztowe
  costData: {
    costPerUnit: number
    currency: string // PLN, EUR, USD
    lastUpdated: string // ISO date
    priceHistory?: PriceHistoryEntry[]
  }
  
  // Metadane
  metadata: {
    isStandardItem: boolean
    isCustomOrder: boolean
    datasheet?: string // URL to PDF
    certifications?: string[] // ["CE", "FSC"]
    createdBy: string
    lastModified: string // ISO date
    description?: string
    tags?: string[]
  }
}

export interface PriceHistoryEntry {
  date: string // ISO date
  price: number
  supplier?: string
}

export const MaterialCategory = {
  SHEET_MATERIAL: 'SHEET_MATERIAL', // Płyty (MDF, sklejka, etc.)
  HARDWARE: 'HARDWARE', // Okucia, śruby, kołki
  LIGHTING: 'LIGHTING', // Oświetlenie, diody LED
  ELECTRONICS: 'ELECTRONICS', // Komponenty elektroniczne
  METAL_PROFILES: 'METAL_PROFILES', // Profile aluminiowe, stal
  TEXTILES: 'TEXTILES', // Tkaniny, materiały miękkie
  CUSTOM: 'CUSTOM' // Materiały niestandardowe/jednorazowe
} as const

export type MaterialCategory = typeof MaterialCategory[keyof typeof MaterialCategory]

// Stany magazynowe - oddzielne od katalogu
export interface InventoryData {
  materialId: string // FK do UniversalMaterial
  currentStock: number
  unit: string // szt, m2, mb, kg
  reservedQuantity: number
  availableQuantity: number // currentStock - reservedQuantity
  minStockLevel: number
  maxStockLevel: number
  reorderPoint: number
  leadTime: number // days
  supplierId?: string
  location?: string // lokalizacja w magazynie
  lastMovement?: InventoryMovement
  abcClass?: 'A' | 'B' | 'C' // klasyfikacja ABC
}

export interface InventoryMovement {
  id: string
  materialId: string
  type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT'
  quantity: number
  date: string // ISO date
  user: string
  documentNumber?: string
  fromLocation?: string
  toLocation?: string
  notes?: string
  projectId?: string // jeśli związane z projektem
}

// Materiały niestandardowe/jednorazowe
export interface CustomMaterial extends UniversalMaterial {
  parentMaterialId?: string // Reference to base material
  customProperties: {
    totalLength?: number // meters - custom dla projektu
    cuttingPoints?: number[] // specific cutting requirements
    specialInstructions?: string
  }
  orderStatus: OrderStatus
  projectId: string
  estimatedCost: number
  supplier?: string
  expectedDelivery?: string // ISO date
}

export const OrderStatus = {
  TO_ORDER: 'TO_ORDER',
  ORDERED: 'ORDERED', 
  RECEIVED: 'RECEIVED',
  USED: 'USED'
} as const

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus]

// Zamówienia materiałów (była PurchaseRequest)
export interface MaterialOrder {
  id: string
  materialId: string
  materialName: string
  quantity: number
  unit: string
  projectId?: string
  requestedBy: string
  requestedAt: string // ISO date
  status: OrderStatus
  priority: 'low' | 'medium' | 'high'
  notes?: string
  
  // Dodatkowe pola dla zamówień
  supplierId?: string
  estimatedCost?: number
  estimatedDelivery?: string // ISO date
  actualDelivery?: string // ISO date
  orderNumber?: string
  trackingNumber?: string
}

// Kanban board dla zamówień
export interface MaterialKanbanColumn {
  id: string
  title: string
  status: OrderStatus
  color: string
  materials: MaterialOrder[]
  assignedTo?: string[]
  showEstimatedDelivery?: boolean
}

// Filtry dla widoków materiałów
export interface MaterialFilters {
  category?: MaterialCategory[]
  availability?: 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
  priceRange?: { min: number; max: number }
  supplier?: string[]
  abcClass?: ('A' | 'B' | 'C')[]
  tags?: string[]
  search?: string
}

// Wynik walidacji grubości
export interface ValidationResult {
  status: 'VALID' | 'WARNING' | 'ERROR' | 'AUTO_CORRECTED'
  message?: string
  action?: 'BLOCK_PRODUCTION' | 'REQUIRE_CONFIRMATION' | 'UPDATE_GEOMETRY'
  actualThickness?: number
  expectedThickness?: number
  deviation?: number
}

// Statystyki materiałów
export interface MaterialStats {
  totalCatalogItems: number // wszystkie materiały w katalogu
  warehouseItems: number // materiały na stanie
  ordersCount: number // materiały w zamówieniach
  totalValue: number
  criticalCount: number // poniżej minStock
  lowCount: number // niski stan
  normalCount: number
  excessCount: number // powyżej maxStock
}

// Konfiguracja widoku materiałów
export interface MaterialViewConfig {
  viewMode: 'catalog' | 'warehouse' | 'orders'
  showOnlyInStock: boolean
  showStockLevels: boolean
  enableQuickOrdering: boolean
  defaultFilters: MaterialFilters
}
