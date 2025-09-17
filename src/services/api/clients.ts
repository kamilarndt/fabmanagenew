// Clients API Service - Client management
import { supabase } from '../../lib/supabase'
import { BaseApiService } from './base'
import type {
    Client,
    ClientInsert,
    ClientUpdate,
    PaginatedResponse,
    QueryParams
} from './types'

export interface ClientFilters extends QueryParams {
  company_name?: string
  city?: string
  country?: string
  has_projects?: boolean
}

export interface ClientStats {
  total_clients: number
  by_country: Record<string, number>
  by_city: Record<string, number>
  active_clients: number
  total_projects: number
  avg_projects_per_client: number
}

export class ClientsApiService extends BaseApiService<Client, ClientInsert, ClientUpdate> {
  constructor() {
    super('clients', {
      useCache: true,
      cacheTimeout: 10 * 60 * 1000, // 10 minutes for clients
      retryAttempts: 3
    })
  }

  // Get clients with project count
  async listWithProjectCount(params: ClientFilters = {}): Promise<PaginatedResponse<Client & { projects_count: number }>> {
    const cacheKey = this.getCacheKey('listWithProjectCount', params)
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      const { page = 1, limit = 10, sortBy, sortOrder = 'desc', ...filters } = params
      
      let query = supabase
        .from('clients')
        .select(`
          *,
          projects:projects(count)
        `, { count: 'exact' })

      // Apply filters
      if (filters.company_name) {
        query = query.eq('company_name', filters.company_name)
      }
      if (filters.city) {
        query = query.eq('city', filters.city)
      }
      if (filters.country) {
        query = query.eq('country', filters.country)
      }
      if (filters.has_projects !== undefined) {
        if (filters.has_projects) {
          query = query.gt('projects.count', 0)
        } else {
          query = query.eq('projects.count', 0)
        }
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }

      // Apply sorting
      if (sortBy) {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' })
      } else {
        query = query.order('name', { ascending: true })
      }

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      // Transform data to include projects_count
      const transformedData = (data || []).map(client => ({
        ...client,
        projects_count: client.projects?.[0]?.count || 0
      }))

      const result = {
        data: transformedData,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }

      if (this.config.useCache) {
        this.setCache(cacheKey, result)
      }

      return result
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch clients with project count')
    }
  }

  // Get client with full details including projects
  async getWithProjects(id: string): Promise<Client & { 
    projects: Array<{
      id: string
      name: string
      status: string
      budget: number | null
      start_date: string | null
      end_date: string | null
    }>
    total_projects: number
    total_budget: number
  }> {
    const cacheKey = this.getCacheKey('getWithProjects', { id })
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      // Get client with projects
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select(`
          *,
          projects:projects (
            id,
            name,
            status,
            budget,
            start_date,
            end_date
          )
        `)
        .eq('id', id)
        .single()

      if (clientError) throw clientError

      const projects = client.projects || []
      const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0)

      const result = {
        ...client,
        projects,
        total_projects: projects.length,
        total_budget: totalBudget
      }

      if (this.config.useCache) {
        this.setCache(cacheKey, result)
      }

      return result
    } catch (error) {
      throw this.handleError(error, `Failed to fetch client with projects for id ${id}`)
    }
  }

  // Get client statistics
  async getStats(): Promise<ClientStats> {
    const cacheKey = this.getCacheKey('getStats', {})
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      const [
        { data: clients, error: clientsError },
        { count: totalProjects, error: projectsError }
      ] = await Promise.all([
        supabase.from('clients').select('country, city'),
        supabase.from('projects').select('*', { count: 'exact', head: true })
      ])

      if (clientsError) throw clientsError
      if (projectsError) throw projectsError

      const stats: ClientStats = {
        total_clients: clients?.length || 0,
        by_country: {},
        by_city: {},
        active_clients: 0,
        total_projects: totalProjects || 0,
        avg_projects_per_client: 0
      }

      if (clients) {
        clients.forEach(client => {
          // Country stats
          const country = client.country || 'Unknown'
          stats.by_country[country] = (stats.by_country[country] || 0) + 1

          // City stats
          const city = client.city || 'Unknown'
          stats.by_city[city] = (stats.by_city[city] || 0) + 1
        })

        stats.avg_projects_per_client = stats.total_clients > 0 ? stats.total_projects / stats.total_clients : 0
        stats.active_clients = stats.total_clients // Assuming all clients are active for now
      }

      if (this.config.useCache) {
        this.setCache(cacheKey, stats)
      }

      return stats
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch client statistics')
    }
  }

  // Search clients by multiple criteria
  async searchClients(query: string, params: ClientFilters = {}): Promise<PaginatedResponse<Client>> {
    try {
      const searchParams = {
        ...params,
        search: query
      }
      
      return this.list(searchParams)
    } catch (error) {
      throw this.handleError(error, 'Failed to search clients')
    }
  }

  // Get clients by location
  async getByLocation(city?: string, country?: string): Promise<Client[]> {
    try {
      let query = supabase.from('clients').select('*')

      if (city) {
        query = query.eq('city', city)
      }
      if (country) {
        query = query.eq('country', country)
      }

      query = query.order('name', { ascending: true })

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch clients by location')
    }
  }

  // Merge duplicate clients
  async mergeClients(primaryId: string, duplicateIds: string[]): Promise<Client> {
    try {
      // Get primary client
      const primary = await this.get(primaryId)

      // Update all projects from duplicate clients to point to primary client
      for (const duplicateId of duplicateIds) {
        await supabase
          .from('projects')
          .update({ client_id: primaryId })
          .eq('client_id', duplicateId)
      }

      // Delete duplicate clients
      await this.batchDelete(duplicateIds)

      // Return updated primary client
      return await this.getWithProjects(primaryId)
    } catch (error) {
      throw this.handleError(error, `Failed to merge clients into ${primaryId}`)
    }
  }

  // Private helper methods
  private getCacheKey(operation: string, params: any): string {
    return `clients:${operation}:${JSON.stringify(params)}`
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout!) {
      return cached.data
    }
    return null
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }
}

// Export singleton instance
export const clientsApiService = new ClientsApiService()
