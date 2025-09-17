// API Integration Layer - Unified interface for all API services
import { apiServices } from './index'
import type {
    BOMItem,
    Client,
    KanbanCard,
    LogisticsOrder,
    Material,
    PaginatedResponse,
    PricingCalculation,
    Project,
    ProjectPricing,
    ProjectWithClient,
    QueryParams,
    Tile
} from './types'

// Unified API interface
export class ApiIntegration {
  // Projects
  async getProjects(params?: QueryParams): Promise<PaginatedResponse<ProjectWithClient>> {
    return apiServices.projects.listWithClients(params)
  }

  async getProject(id: string): Promise<ProjectWithClient> {
    return apiServices.projects.getWithDetails(id)
  }

  async createProject(data: any): Promise<Project> {
    return apiServices.projects.create(data)
  }

  async updateProject(id: string, data: any): Promise<Project> {
    return apiServices.projects.update(id, data)
  }

  async deleteProject(id: string): Promise<void> {
    return apiServices.projects.delete(id)
  }

  async getProjectStats(): Promise<any> {
    return apiServices.projects.getStats()
  }

  // Materials & BOM
  async getMaterials(params?: QueryParams): Promise<PaginatedResponse<Material>> {
    return apiServices.materials.listWithSuppliers(params)
  }

  async getMaterial(id: string): Promise<Material> {
    return apiServices.materials.get(id)
  }

  async getBOMItems(projectId: string, params?: QueryParams): Promise<PaginatedResponse<BOMItem>> {
    return apiServices.materials.getBOMItems(projectId, params)
  }

  async addBOMItem(projectId: string, data: any): Promise<BOMItem> {
    return apiServices.materials.addBOMItem(projectId, data)
  }

  async updateBOMItem(id: string, data: any): Promise<BOMItem> {
    return apiServices.materials.updateBOMItem(id, data)
  }

  async deleteBOMItem(id: string): Promise<void> {
    return apiServices.materials.deleteBOMItem(id)
  }

  async getBOMSummary(projectId: string): Promise<any> {
    return apiServices.materials.getBOMSummary(projectId)
  }

  async getMaterialStats(): Promise<any> {
    return apiServices.materials.getStats()
  }

  // Tiles & Kanban
  async getTiles(params?: QueryParams): Promise<PaginatedResponse<Tile>> {
    return apiServices.tiles.listWithProjects(params)
  }

  async getTile(id: string): Promise<Tile> {
    return apiServices.tiles.get(id)
  }

  async getKanbanBoard(projectId: string): Promise<any> {
    return apiServices.tiles.getKanbanBoard(projectId)
  }

  async moveCard(cardId: string, newColumnId: string, newPosition: number): Promise<KanbanCard> {
    return apiServices.tiles.moveCard(cardId, newColumnId, newPosition)
  }

  async createCard(data: any): Promise<KanbanCard> {
    return apiServices.tiles.createCard(data)
  }

  async updateCard(id: string, data: any): Promise<KanbanCard> {
    return apiServices.tiles.updateCard(id, data)
  }

  async deleteCard(id: string): Promise<void> {
    return apiServices.tiles.deleteCard(id)
  }

  async getTileStats(): Promise<any> {
    return apiServices.tiles.getStats()
  }

  // Clients
  async getClients(params?: QueryParams): Promise<PaginatedResponse<Client>> {
    return apiServices.clients.listWithProjectCount(params)
  }

  async getClient(id: string): Promise<Client> {
    return apiServices.clients.getWithProjects(id)
  }

  async createClient(data: any): Promise<Client> {
    return apiServices.clients.create(data)
  }

  async updateClient(id: string, data: any): Promise<Client> {
    return apiServices.clients.update(id, data)
  }

  async deleteClient(id: string): Promise<void> {
    return apiServices.clients.delete(id)
  }

  async getClientStats(): Promise<any> {
    return apiServices.clients.getStats()
  }

  // Logistics
  async getLogisticsOrders(params?: QueryParams): Promise<PaginatedResponse<LogisticsOrder>> {
    return apiServices.logistics.listWithProjects(params)
  }

  async getLogisticsOrder(id: string): Promise<LogisticsOrder> {
    return apiServices.logistics.get(id)
  }

  async createLogisticsOrder(data: any): Promise<LogisticsOrder> {
    return apiServices.logistics.create(data)
  }

  async updateLogisticsOrder(id: string, data: any): Promise<LogisticsOrder> {
    return apiServices.logistics.update(id, data)
  }

  async deleteLogisticsOrder(id: string): Promise<void> {
    return apiServices.logistics.delete(id)
  }

  async getLogisticsStats(): Promise<any> {
    return apiServices.logistics.getStats()
  }

  // Pricing
  async calculatePricing(projectId: string): Promise<PricingCalculation> {
    return apiServices.pricing.calculatePricing(projectId)
  }

  async savePricing(projectId: string, calculation: PricingCalculation): Promise<ProjectPricing> {
    return apiServices.pricing.savePricing(projectId, calculation)
  }

  async getPricing(projectId: string): Promise<ProjectPricing> {
    return apiServices.pricing.getWithProject(projectId)
  }

  async getPricingStats(): Promise<any> {
    return apiServices.pricing.getStats()
  }

  async getPricingBreakdown(projectId: string): Promise<any> {
    return apiServices.pricing.getBreakdown(projectId)
  }

  // Unified project operations
  async getProjectComplete(projectId: string): Promise<{
    project: ProjectWithClient
    bom: PaginatedResponse<BOMItem>
    tiles: any
    logistics: PaginatedResponse<LogisticsOrder>
    pricing: PricingCalculation
  }> {
    const [project, bom, tiles, logistics, pricing] = await Promise.all([
      this.getProject(projectId),
      this.getBOMItems(projectId),
      this.getKanbanBoard(projectId),
      this.getLogisticsOrders({ project_id: projectId }),
      this.calculatePricing(projectId)
    ])

    return {
      project,
      bom,
      tiles,
      logistics,
      pricing
    }
  }

  // Batch operations
  async batchUpdateProject(projectId: string, updates: {
    project?: any
    bomItems?: Array<{ id: string; data: any }>
    cards?: Array<{ id: string; data: any }>
    logisticsOrders?: Array<{ id: string; data: any }>
  }): Promise<{
    project?: Project
    bomItems?: BOMItem[]
    cards?: KanbanCard[]
    logisticsOrders?: LogisticsOrder[]
  }> {
    const results: any = {}

    // Update project
    if (updates.project) {
      results.project = await this.updateProject(projectId, updates.project)
    }

    // Update BOM items
    if (updates.bomItems?.length) {
      results.bomItems = await Promise.all(
        updates.bomItems.map(item => this.updateBOMItem(item.id, item.data))
      )
    }

    // Update cards
    if (updates.cards?.length) {
      results.cards = await Promise.all(
        updates.cards.map(card => this.updateCard(card.id, card.data))
      )
    }

    // Update logistics orders
    if (updates.logisticsOrders?.length) {
      results.logisticsOrders = await Promise.all(
        updates.logisticsOrders.map(order => this.updateLogisticsOrder(order.id, order.data))
      )
    }

    return results
  }

  // Search across all entities
  async searchAll(query: string): Promise<{
    projects: ProjectWithClient[]
    clients: Client[]
    materials: Material[]
    tiles: Tile[]
  }> {
    const [projects, clients, materials, tiles] = await Promise.all([
      this.getProjects({ search: query, limit: 10 }),
      this.getClients({ search: query, limit: 10 }),
      this.getMaterials({ search: query, limit: 10 }),
      this.getTiles({ search: query, limit: 10 })
    ])

    return {
      projects: projects.data,
      clients: clients.data,
      materials: materials.data,
      tiles: tiles.data
    }
  }

  // Dashboard data
  async getDashboardData(): Promise<{
    stats: {
      projects: any
      clients: any
      materials: any
      tiles: any
      logistics: any
      pricing: any
    }
    recent: {
      projects: ProjectWithClient[]
      clients: Client[]
      materials: Material[]
      tiles: Tile[]
    }
  }> {
    const [projectStats, clientStats, materialStats, tileStats, logisticsStats, pricingStats] = await Promise.all([
      this.getProjectStats(),
      this.getClientStats(),
      this.getMaterialStats(),
      this.getTileStats(),
      this.getLogisticsStats(),
      this.getPricingStats()
    ])

    const [recentProjects, recentClients, recentMaterials, recentTiles] = await Promise.all([
      this.getProjects({ limit: 5, sortBy: 'created_at', sortOrder: 'desc' }),
      this.getClients({ limit: 5, sortBy: 'created_at', sortOrder: 'desc' }),
      this.getMaterials({ limit: 5, sortBy: 'created_at', sortOrder: 'desc' }),
      this.getTiles({ limit: 5, sortBy: 'created_at', sortOrder: 'desc' })
    ])

    return {
      stats: {
        projects: projectStats,
        clients: clientStats,
        materials: materialStats,
        tiles: tileStats,
        logistics: logisticsStats,
        pricing: pricingStats
      },
      recent: {
        projects: recentProjects.data,
        clients: recentClients.data,
        materials: recentMaterials.data,
        tiles: recentTiles.data
      }
    }
  }
}

// Export singleton instance
export const apiIntegration = new ApiIntegration()

// Convenience exports for common operations
export const api = {
  // Quick access to all services
  projects: apiServices.projects,
  materials: apiServices.materials,
  tiles: apiServices.tiles,
  clients: apiServices.clients,
  logistics: apiServices.logistics,
  pricing: apiServices.pricing,

  // Unified operations
  integration: apiIntegration,

  // Common patterns
  getProjectComplete: (projectId: string) => apiIntegration.getProjectComplete(projectId),
  getDashboardData: () => apiIntegration.getDashboardData(),
  searchAll: (query: string) => apiIntegration.searchAll(query),
}
