// Pricing API Service - Project pricing calculations and management
import { supabase } from '../../lib/supabase'
import { BaseApiService } from './base'
import type {
    ProjectPricing,
    ProjectPricingInsert,
    ProjectPricingUpdate,
    QueryParams
} from './types'

export interface PricingFilters extends QueryParams {
  project_id?: string
  status?: string
  date_from?: string
  date_to?: string
}

export interface PricingCalculation {
  project_id: string
  bom_cost: number
  logistics_cost: number
  accommodation_cost: number
  labor_cost: number
  markup_percentage: number
  markup_amount: number
  total_cost: number
  profit_margin: number
  breakdown: {
    materials: { cost: number; percentage: number }
    logistics: { cost: number; percentage: number }
    accommodation: { cost: number; percentage: number }
    labor: { cost: number; percentage: number }
    markup: { cost: number; percentage: number }
  }
}

export interface PricingStats {
  total_projects: number
  total_value: number
  avg_project_value: number
  by_status: Record<string, { count: number; value: number }>
  profit_margin_avg: number
  top_projects: Array<{
    id: string
    name: string
    total_value: number
    profit_margin: number
  }>
}

export class PricingApiService extends BaseApiService<ProjectPricing, ProjectPricingInsert, ProjectPricingUpdate> {
  constructor() {
    super('project_pricing', {
      useCache: true,
      cacheTimeout: 2 * 60 * 1000, // 2 minutes for pricing
      retryAttempts: 3
    })
  }

  // Calculate project pricing
  async calculatePricing(projectId: string): Promise<PricingCalculation> {
    const cacheKey = this.getCacheKey('calculatePricing', { projectId })
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      // Get BOM cost
      const { data: bomItems } = await supabase
        .from('bom_items')
        .select('total_cost')
        .eq('project_id', projectId)

      const bom_cost = bomItems?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0

      // Get logistics cost
      const { data: logisticsOrders } = await supabase
        .from('logistics_orders')
        .select('cost')
        .eq('project_id', projectId)

      const logistics_cost = logisticsOrders?.reduce((sum, order) => sum + (order.cost || 0), 0) || 0

      // Get accommodation cost
      const { data: accommodations } = await supabase
        .from('accommodation_bookings')
        .select('total_cost')
        .eq('project_id', projectId)

      const accommodation_cost = accommodations?.reduce((sum, booking) => sum + (booking.total_cost || 0), 0) || 0

      // Calculate labor cost (this would be based on project complexity, duration, etc.)
      // For now, using a simple calculation
      const labor_cost = (bom_cost + logistics_cost + accommodation_cost) * 0.3 // 30% of other costs

      // Apply markup (default 20%)
      const markup_percentage = 20
      const base_cost = bom_cost + logistics_cost + accommodation_cost + labor_cost
      const markup_amount = (base_cost * markup_percentage) / 100
      const total_cost = base_cost + markup_amount

      // Calculate profit margin
      const profit_margin = ((total_cost - base_cost) / total_cost) * 100

      const calculation: PricingCalculation = {
        project_id: projectId,
        bom_cost,
        logistics_cost,
        accommodation_cost,
        labor_cost,
        markup_percentage,
        markup_amount,
        total_cost,
        profit_margin,
        breakdown: {
          materials: { 
            cost: bom_cost, 
            percentage: total_cost > 0 ? (bom_cost / total_cost) * 100 : 0 
          },
          logistics: { 
            cost: logistics_cost, 
            percentage: total_cost > 0 ? (logistics_cost / total_cost) * 100 : 0 
          },
          accommodation: { 
            cost: accommodation_cost, 
            percentage: total_cost > 0 ? (accommodation_cost / total_cost) * 100 : 0 
          },
          labor: { 
            cost: labor_cost, 
            percentage: total_cost > 0 ? (labor_cost / total_cost) * 100 : 0 
          },
          markup: { 
            cost: markup_amount, 
            percentage: total_cost > 0 ? (markup_amount / total_cost) * 100 : 0 
          }
        }
      }

      if (this.config.useCache) {
        this.setCache(cacheKey, calculation)
      }

      return calculation
    } catch (error) {
      throw this.handleError(error, `Failed to calculate pricing for project ${projectId}`)
    }
  }

  // Save pricing calculation
  async savePricing(projectId: string, calculation: PricingCalculation): Promise<ProjectPricing> {
    try {
      const pricingData: ProjectPricingInsert = {
        project_id: projectId,
        bom_cost: calculation.bom_cost,
        logistics_cost: calculation.logistics_cost,
        accommodation_cost: calculation.accommodation_cost,
        labor_cost: calculation.labor_cost,
        markup_percentage: calculation.markup_percentage,
        markup_amount: calculation.markup_amount,
        total_cost: calculation.total_cost,
        profit_margin: calculation.profit_margin,
        status: 'calculated'
      }

      // Check if pricing already exists
      const { data: existing } = await supabase
        .from('project_pricing')
        .select('id')
        .eq('project_id', projectId)
        .single()

      let result: ProjectPricing

      if (existing) {
        // Update existing pricing
        result = await this.update(existing.id, pricingData as ProjectPricingUpdate)
      } else {
        // Create new pricing
        result = await this.create(pricingData)
      }

      return result
    } catch (error) {
      throw this.handleError(error, `Failed to save pricing for project ${projectId}`)
    }
  }

  // Get pricing with project details
  async getWithProject(projectId: string): Promise<ProjectPricing & { 
    project: {
      id: string
      name: string
      status: string
      client: {
        id: string
        name: string
        company_name: string | null
      }
    }
  }> {
    try {
      const { data, error } = await supabase
        .from('project_pricing')
        .select(`
          *,
          project:projects (
            id,
            name,
            status,
            client:clients (
              id,
              name,
              company_name
            )
          )
        `)
        .eq('project_id', projectId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw this.handleError(error, `Failed to fetch pricing with project for ${projectId}`)
    }
  }

  // Get pricing statistics
  async getStats(filters: Partial<PricingFilters> = {}): Promise<PricingStats> {
    const cacheKey = this.getCacheKey('getStats', filters)
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      let query = supabase
        .from('project_pricing')
        .select(`
          *,
          project:projects (
            id,
            name,
            status
          )
        `)

      // Apply filters
      if (filters.project_id) {
        query = query.eq('project_id', filters.project_id)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to)
      }

      const { data: pricings, error } = await query

      if (error) throw error

      const stats: PricingStats = {
        total_projects: pricings?.length || 0,
        total_value: 0,
        avg_project_value: 0,
        by_status: {},
        profit_margin_avg: 0,
        top_projects: []
      }

      if (pricings) {
        let totalProfitMargin = 0

        pricings.forEach(pricing => {
          // Total value
          stats.total_value += pricing.total_cost || 0

          // Status stats
          const status = pricing.project?.status || 'unknown'
          if (!stats.by_status[status]) {
            stats.by_status[status] = { count: 0, value: 0 }
          }
          stats.by_status[status].count++
          stats.by_status[status].value += pricing.total_cost || 0

          // Profit margin
          totalProfitMargin += pricing.profit_margin || 0

          // Top projects
          stats.top_projects.push({
            id: pricing.project_id,
            name: pricing.project?.name || 'Unknown',
            total_value: pricing.total_cost || 0,
            profit_margin: pricing.profit_margin || 0
          })
        })

        stats.avg_project_value = stats.total_projects > 0 ? stats.total_value / stats.total_projects : 0
        stats.profit_margin_avg = stats.total_projects > 0 ? totalProfitMargin / stats.total_projects : 0

        // Sort top projects by total value
        stats.top_projects.sort((a, b) => b.total_value - a.total_value)
        stats.top_projects = stats.top_projects.slice(0, 10)
      }

      if (this.config.useCache) {
        this.setCache(cacheKey, stats)
      }

      return stats
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch pricing statistics')
    }
  }

  // Update pricing status
  async updateStatus(id: string, status: string): Promise<ProjectPricing> {
    try {
      const result = await this.update(id, { status } as ProjectPricingUpdate)
      
      // Log status change activity if needed
      console.log(`Pricing ${id} status updated to: ${status}`)
      
      return result
    } catch (error) {
      throw this.handleError(error, `Failed to update pricing status for id ${id}`)
    }
  }

  // Recalculate pricing for project
  async recalculate(projectId: string): Promise<ProjectPricing> {
    try {
      // Calculate new pricing
      const calculation = await this.calculatePricing(projectId)
      
      // Save the new pricing
      const result = await this.savePricing(projectId, calculation)
      
      return result
    } catch (error) {
      throw this.handleError(error, `Failed to recalculate pricing for project ${projectId}`)
    }
  }

  // Get pricing breakdown
  async getBreakdown(projectId: string): Promise<{
    materials: Array<{
      name: string
      cost: number
      percentage: number
    }>
    logistics: Array<{
      description: string
      cost: number
      percentage: number
    }>
    accommodation: Array<{
      name: string
      cost: number
      percentage: number
    }>
  }> {
    try {
      const calculation = await this.calculatePricing(projectId)

      // Get detailed BOM items
      const { data: bomItems } = await supabase
        .from('bom_items')
        .select(`
          quantity,
          total_cost,
          material:materials (
            name
          )
        `)
        .eq('project_id', projectId)

      // Get detailed logistics orders
      const { data: logisticsOrders } = await supabase
        .from('logistics_orders')
        .select('description, cost')
        .eq('project_id', projectId)

      // Get detailed accommodation bookings
      const { data: accommodations } = await supabase
        .from('accommodation_bookings')
        .select('hotel_name, total_cost')
        .eq('project_id', projectId)

      const breakdown = {
        materials: (bomItems || []).map(item => ({
          name: item.material?.name || 'Unknown Material',
          cost: item.total_cost || 0,
          percentage: calculation.total_cost > 0 ? ((item.total_cost || 0) / calculation.total_cost) * 100 : 0
        })),
        logistics: (logisticsOrders || []).map(order => ({
          description: order.description || 'Transport',
          cost: order.cost || 0,
          percentage: calculation.total_cost > 0 ? ((order.cost || 0) / calculation.total_cost) * 100 : 0
        })),
        accommodation: (accommodations || []).map(booking => ({
          name: booking.hotel_name || 'Unknown Hotel',
          cost: booking.total_cost || 0,
          percentage: calculation.total_cost > 0 ? ((booking.total_cost || 0) / calculation.total_cost) * 100 : 0
        }))
      }

      return breakdown
    } catch (error) {
      throw this.handleError(error, `Failed to fetch pricing breakdown for project ${projectId}`)
    }
  }

  // Private helper methods
  private getCacheKey(operation: string, params: any): string {
    return `pricing:${operation}:${JSON.stringify(params)}`
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
export const pricingApiService = new PricingApiService()
