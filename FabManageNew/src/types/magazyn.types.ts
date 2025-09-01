// Typy dla modułu magazynowego

export interface Material {
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
  properties?: MaterialProperties
}

export interface MaterialProperties {
  color?: string
  finish?: string
  fireResistant?: boolean
  flexible?: boolean
  waterResistant?: boolean
  [key: string]: any
}

export interface MaterialCategory {
  id: string
  name: string
  parent?: string
  children?: MaterialCategory[]
  materialsCount?: number
  icon?: string
}

export interface MaterialMovement {
  id: string
  materialId: string
  documentNumber: string
  type: 'IN' | 'OUT' | 'TRANSFER'
  quantity: number
  date: Date
  user: string
  notes?: string
  fromLocation?: string
  toLocation?: string
}

export interface MaterialFilter {
  search?: string
  categories?: string[]
  suppliers?: string[]
  status?: 'all' | 'critical' | 'low' | 'normal' | 'excess'
  abcClass?: ('A' | 'B' | 'C')[]
  tags?: string[]
}

export interface MaterialStats {
  totalValue: number
  totalItems: number
  criticalCount: number
  lowCount: number
  normalCount: number
  excessCount: number
  turnoverRate: number
  fillRate: number
  stockoutEvents: number
}

export interface WarehouseLocation {
  id: string
  code: string
  name: string
  type: 'shelf' | 'pallet' | 'container'
  zone: string
  row: string
  column: string
  level: string
  capacity: number
  occupied: number
  materials?: Material[]
}

export type ViewMode = 'grid' | 'list' | 'tree'
export type SortField = 'code' | 'name' | 'stock' | 'supplier' | 'lastDelivery' | 'value'
export type SortOrder = 'asc' | 'desc'

export interface UserPreferences {
  viewMode: ViewMode
  sortField: SortField
  sortOrder: SortOrder
  gridColumns: number
  showFilters: boolean
  showStats: boolean
  favoriteCategories: string[]
}