// Logistics API Service - Transport and logistics management
import { supabase } from '../../lib/supabase'
import { BaseApiService } from './base'
import type {
    LogisticsOrder,
    LogisticsOrderInsert,
    LogisticsOrderUpdate,
    LogisticsOrderWithProject,
    PaginatedResponse,
    QueryParams,
    TransportRoute
} from './types'

export interface LogisticsFilters extends QueryParams {
  project_id?: string
  status?: string
  transport_type?: string
  from_city?: string
  to_city?: string
  date_from?: string
  date_to?: string
}

export interface LogisticsStats {
  total_orders: number
  by_status: Record<string, number>
  by_transport_type: Record<string, number>
  total_cost: number
  avg_cost_per_order: number
  pending_orders: number
  completed_orders: number
}

export interface RouteOptimization {
  route_id: string
  optimized_sequence: string[]
  total_distance: number
  estimated_time: number
  cost_savings: number
}

export class LogisticsApiService extends BaseApiService<LogisticsOrder, LogisticsOrderInsert, LogisticsOrderUpdate> {
  constructor() {
    super('logistics_orders', {
      useCache: true,
      cacheTimeout: 5 * 60 * 1000, // 5 minutes for logistics
      retryAttempts: 3
    })
  }

  // Get logistics orders with project information
  async listWithProjects(params: LogisticsFilters = {}): Promise<PaginatedResponse<LogisticsOrderWithProject>> {
    const cacheKey = this.getCacheKey('listWithProjects', params)
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      const { page = 1, limit = 10, sortBy, sortOrder = 'desc', ...filters } = params
      
      let query = supabase
        .from('logistics_orders')
        .select(`
          *,
          project:projects (
            id,
            name,
            status
          )
        `, { count: 'exact' })

      // Apply filters
      if (filters.project_id) {
        query = query.eq('project_id', filters.project_id)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.transport_type) {
        query = query.eq('transport_type', filters.transport_type)
      }
      if (filters.from_city) {
        query = query.eq('from_city', filters.from_city)
      }
      if (filters.to_city) {
        query = query.eq('to_city', filters.to_city)
      }
      if (filters.date_from) {
        query = query.gte('pickup_date', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('pickup_date', filters.date_to)
      }
      if (filters.search) {
        query = query.or(`description.ilike.%${filters.search}%,from_city.ilike.%${filters.search}%,to_city.ilike.%${filters.search}%`)
      }

      // Apply sorting
      if (sortBy) {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' })
      } else {
        query = query.order('pickup_date', { ascending: true })
      }

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      const result = {
        data: data || [],
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
      throw this.handleError(error, 'Failed to fetch logistics orders with projects')
    }
  }

  // Get logistics statistics
  async getStats(filters: Partial<LogisticsFilters> = {}): Promise<LogisticsStats> {
    const cacheKey = this.getCacheKey('getStats', filters)
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      let query = supabase.from('logistics_orders').select('status, transport_type, cost')

      // Apply filters
      if (filters.project_id) {
        query = query.eq('project_id', filters.project_id)
      }
      if (filters.date_from) {
        query = query.gte('pickup_date', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('pickup_date', filters.date_to)
      }

      const { data: orders, error } = await query

      if (error) throw error

      const stats: LogisticsStats = {
        total_orders: orders?.length || 0,
        by_status: {},
        by_transport_type: {},
        total_cost: 0,
        avg_cost_per_order: 0,
        pending_orders: 0,
        completed_orders: 0
      }

      if (orders) {
        orders.forEach(order => {
          // Status stats
          stats.by_status[order.status] = (stats.by_status[order.status] || 0) + 1
          
          // Transport type stats
          if (order.transport_type) {
            stats.by_transport_type[order.transport_type] = (stats.by_transport_type[order.transport_type] || 0) + 1
          }
          
          // Cost stats
          if (order.cost) {
            stats.total_cost += order.cost
          }
          
          // Status counts
          if (order.status === 'pending' || order.status === 'confirmed') {
            stats.pending_orders++
          } else if (order.status === 'completed' || order.status === 'delivered') {
            stats.completed_orders++
          }
        })

        stats.avg_cost_per_order = stats.total_orders > 0 ? stats.total_cost / stats.total_orders : 0
      }

      if (this.config.useCache) {
        this.setCache(cacheKey, stats)
      }

      return stats
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch logistics statistics')
    }
  }

  // Update order status
  async updateStatus(id: string, status: string): Promise<LogisticsOrder> {
    try {
      const result = await this.update(id, { status } as LogisticsOrderUpdate)
      
      // Log status change activity if needed
      console.log(`Logistics order ${id} status updated to: ${status}`)
      
      return result
    } catch (error) {
      throw this.handleError(error, `Failed to update logistics order status for id ${id}`)
    }
  }

  // Calculate route optimization
  async optimizeRoute(routeId: string): Promise<RouteOptimization> {
    try {
      // This is a simplified optimization algorithm
      // In a real implementation, you would integrate with a routing service like Google Maps API
      
      const { data: route, error } = await supabase
        .from('transport_routes')
        .select('*')
        .eq('id', routeId)
        .single()

      if (error) throw error

      // Mock optimization logic
      const optimized_sequence = route.waypoints || []
      const total_distance = route.total_distance || 0
      const estimated_time = route.estimated_time || 0
      const cost_savings = Math.random() * 100 // Mock savings

      return {
        route_id: routeId,
        optimized_sequence,
        total_distance,
        estimated_time,
        cost_savings
      }
    } catch (error) {
      throw this.handleError(error, `Failed to optimize route ${routeId}`)
    }
  }

  // Get transport routes
  async getRoutes(params: QueryParams = {}): Promise<TransportRoute[]> {
    try {
      let query = supabase.from('transport_routes').select('*')

      if (params.search) {
        query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch transport routes')
    }
  }

  // Create transport route
  async createRoute(data: Partial<TransportRoute>): Promise<TransportRoute> {
    try {
      const { data: result, error } = await supabase
        .from('transport_routes')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return result
    } catch (error) {
      throw this.handleError(error, 'Failed to create transport route')
    }
  }

  // Get orders by date range
  async getOrdersByDateRange(startDate: string, endDate: string, projectId?: string): Promise<LogisticsOrder[]> {
    try {
      let query = supabase
        .from('logistics_orders')
        .select('*')
        .gte('pickup_date', startDate)
        .lte('pickup_date', endDate)

      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      query = query.order('pickup_date', { ascending: true })

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch orders by date range')
    }
  }

  // Get pending orders
  async getPendingOrders(): Promise<LogisticsOrder[]> {
    try {
      const { data, error } = await supabase
        .from('logistics_orders')
        .select('*')
        .in('status', ['pending', 'confirmed'])
        .order('pickup_date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch pending orders')
    }
  }

  // Private helper methods
  private getCacheKey(operation: string, params: any): string {
    return `logistics:${operation}:${JSON.stringify(params)}`
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
export const logisticsApiService = new LogisticsApiService()
