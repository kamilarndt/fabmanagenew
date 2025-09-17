// API Services - Main export file for all API services
export { BaseApiService } from './base'
export type {
    ApiResponse, BaseService, PaginatedResponse,
    QueryParams,
    ServiceError
} from './types'

// Core services
export { ClientsApiService, clientsApiService } from './clients'
export { LogisticsApiService, logisticsApiService } from './logistics'
export { MaterialsApiService, materialsApiService } from './materials'
export { PricingApiService, pricingApiService } from './pricing'
export { ProjectsApiService, projectsApiService } from './projects'
export { TilesApiService, tilesApiService } from './tiles'

// Additional services (to be implemented)
// export { AccommodationApiService, accommodationApiService } from './accommodation'
// export { FilesApiService, filesApiService } from './files'
// export { ConceptsApiService, conceptsApiService } from './concepts'

// Re-export types for convenience
export type {
    BOMItem,
    BOMItemInsert,
    BOMItemUpdate,
    BOMItemWithMaterial, Client,
    ClientInsert,
    ClientUpdate, KanbanCard,
    KanbanCardInsert,
    KanbanCardUpdate,
    KanbanCardWithTile, Material,
    MaterialInsert,
    MaterialUpdate, Project,
    ProjectInsert,
    ProjectUpdate,
    ProjectWithClient, Supplier,
    SupplierInsert,
    SupplierUpdate, Tile,
    TileInsert,
    TileUpdate,
    TileWithProject
} from './types'

// Service registry for dependency injection
export const apiServices = {
  projects: projectsApiService,
  materials: materialsApiService,
  tiles: tilesApiService,
  clients: clientsApiService,
  logistics: logisticsApiService,
  pricing: pricingApiService,
  // accommodation: accommodationApiService,
  // files: filesApiService,
  // concepts: conceptsApiService,
} as const

export type ApiServices = typeof apiServices
