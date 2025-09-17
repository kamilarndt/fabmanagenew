// API Service Types - Common types for all API services
import type { Database } from '../../types/database.types'

// Base API Response
export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  error?: string
}

// Pagination
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Sorting
export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Filtering
export interface FilterParams {
  search?: string
  status?: string
  category?: string
  dateFrom?: string
  dateTo?: string
  [key: string]: any
}

// Common query parameters
export interface QueryParams extends PaginationParams, SortParams, FilterParams {}

// Database table types
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type Client = Database['public']['Tables']['clients']['Row']
export type ClientInsert = Database['public']['Tables']['clients']['Insert']
export type ClientUpdate = Database['public']['Tables']['clients']['Update']

export type Material = Database['public']['Tables']['materials']['Row']
export type MaterialInsert = Database['public']['Tables']['materials']['Insert']
export type MaterialUpdate = Database['public']['Tables']['materials']['Update']

export type Supplier = Database['public']['Tables']['suppliers']['Row']
export type SupplierInsert = Database['public']['Tables']['suppliers']['Insert']
export type SupplierUpdate = Database['public']['Tables']['suppliers']['Update']

export type BOMItem = Database['public']['Tables']['bom_items']['Row']
export type BOMItemInsert = Database['public']['Tables']['bom_items']['Insert']
export type BOMItemUpdate = Database['public']['Tables']['bom_items']['Update']

export type Tile = Database['public']['Tables']['tiles']['Row']
export type TileInsert = Database['public']['Tables']['tiles']['Insert']
export type TileUpdate = Database['public']['Tables']['tiles']['Update']

export type KanbanCard = Database['public']['Tables']['kanban_cards']['Row']
export type KanbanCardInsert = Database['public']['Tables']['kanban_cards']['Insert']
export type KanbanCardUpdate = Database['public']['Tables']['kanban_cards']['Update']

export type LogisticsOrder = Database['public']['Tables']['logistics_orders']['Row']
export type LogisticsOrderInsert = Database['public']['Tables']['logistics_orders']['Insert']
export type LogisticsOrderUpdate = Database['public']['Tables']['logistics_orders']['Update']

export type AccommodationBooking = Database['public']['Tables']['accommodation_bookings']['Row']
export type AccommodationBookingInsert = Database['public']['Tables']['accommodation_bookings']['Insert']
export type AccommodationBookingUpdate = Database['public']['Tables']['accommodation_bookings']['Update']

export type File = Database['public']['Tables']['files']['Row']
export type FileInsert = Database['public']['Tables']['files']['Insert']
export type FileUpdate = Database['public']['Tables']['files']['Update']

export type Concept = Database['public']['Tables']['concepts']['Row']
export type ConceptInsert = Database['public']['Tables']['concepts']['Insert']
export type ConceptUpdate = Database['public']['Tables']['concepts']['Update']

export type ProjectPricing = Database['public']['Tables']['project_pricing']['Row']
export type ProjectPricingInsert = Database['public']['Tables']['project_pricing']['Insert']
export type ProjectPricingUpdate = Database['public']['Tables']['project_pricing']['Update']

// Extended types with relations
export interface ProjectWithClient extends Project {
  client?: Client
}

export interface BOMItemWithMaterial extends BOMItem {
  material?: Material
}

export interface TileWithProject extends Tile {
  project?: Project
}

export interface KanbanCardWithTile extends KanbanCard {
  tile?: Tile
}

export interface LogisticsOrderWithProject extends LogisticsOrder {
  project?: Project
}

export interface AccommodationBookingWithProject extends AccommodationBooking {
  project?: Project
}

export interface FileWithProject extends File {
  project?: Project
}

export interface ConceptWithProject extends Concept {
  project?: Project
}

// Service error types
export class ServiceError extends Error {
  public status: number
  public code?: string

  constructor(message: string, status: number = 500, code?: string) {
    super(message)
    this.name = 'ServiceError'
    this.status = status
    this.code = code
  }
}

// Service configuration
export interface ServiceConfig {
  useCache?: boolean
  cacheTimeout?: number
  retryAttempts?: number
  retryDelay?: number
}

// Service methods interface
export interface BaseService<T, TInsert, TUpdate> {
  list(params?: QueryParams): Promise<PaginatedResponse<T>>
  get(id: string): Promise<T>
  create(data: TInsert): Promise<T>
  update(id: string, data: TUpdate): Promise<T>
  delete(id: string): Promise<void>
  search(query: string, params?: QueryParams): Promise<PaginatedResponse<T>>
}
