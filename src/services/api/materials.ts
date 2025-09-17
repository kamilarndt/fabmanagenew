// Materials API Service - Comprehensive material and BOM management
import { supabase } from '../../lib/supabase'
import { BaseApiService } from './base'
import type {
    BOMItem,
    BOMItemInsert,
    BOMItemUpdate,
    BOMItemWithMaterial,
    Material,
    MaterialInsert,
    MaterialUpdate,
    PaginatedResponse,
    QueryParams,
    Supplier
} from './types'

export interface MaterialFilters extends QueryParams {
  category?: string
  supplier_id?: string
  price_min?: number
  price_max?: number
  in_stock?: boolean
  low_stock?: boolean
}

export interface BOMItemFilters extends QueryParams {
  project_id?: string
  material_id?: string
  category?: string
}

export interface MaterialStats {
  total_materials: number
  total_suppliers: number
  total_bom_items: number
  total_material_cost: number
  by_category: Record<string, number>
  by_supplier: Record<string, number>
  low_stock_count: number
  out_of_stock_count: number
}

export class MaterialsApiService extends BaseApiService<Material, MaterialInsert, MaterialUpdate> {
  constructor() {
    super('materials', {
      useCache: true,
      cacheTimeout: 5 * 60 * 1000, // 5 minutes for materials
      retryAttempts: 3
    })
  }

  // Get materials with supplier information
  async listWithSuppliers(params: MaterialFilters = {}): Promise<PaginatedResponse<Material & { supplier?: Supplier }>> {
    const cacheKey = this.getCacheKey('listWithSuppliers', params)
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      const { page = 1, limit = 10, sortBy, sortOrder = 'desc', ...filters } = params
      
      let query = supabase
        .from('materials')
        .select(`
          *,
          supplier:suppliers (
            id,
            name,
            contact_person,
            email,
            phone
          )
        `, { count: 'exact' })

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.supplier_id) {
        query = query.eq('supplier_id', filters.supplier_id)
      }
      if (filters.price_min) {
        query = query.gte('unit_price', filters.price_min)
      }
      if (filters.price_max) {
        query = query.lte('unit_price', filters.price_max)
      }
      if (filters.in_stock !== undefined) {
        if (filters.in_stock) {
          query = query.gt('stock_quantity', 0)
        } else {
          query = query.eq('stock_quantity', 0)
        }
      }
      if (filters.low_stock) {
        query = query.lte('stock_quantity', 'min_stock_level')
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
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
      throw this.handleError(error, 'Failed to fetch materials with suppliers')
    }
  }

  // Get material categories
  async getCategories(): Promise<string[]> {
    const cacheKey = this.getCacheKey('getCategories', {})
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      const { data, error } = await supabase
        .from('materials')
        .select('category')
        .not('category', 'is', null)

      if (error) throw error

      const categories = [...new Set(data?.map(item => item.category).filter(Boolean))] as string[]
      categories.sort()

      if (this.config.useCache) {
        this.setCache(cacheKey, categories)
      }

      return categories
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch material categories')
    }
  }

  // Get low stock materials
  async getLowStockMaterials(): Promise<Material[]> {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .lte('stock_quantity', 'min_stock_level')
        .order('stock_quantity', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch low stock materials')
    }
  }

  // Update stock quantity
  async updateStock(materialId: string, quantity: number, operation: 'add' | 'subtract' | 'set' = 'set'): Promise<Material> {
    try {
      const material = await this.get(materialId)
      
      let newQuantity: number
      switch (operation) {
        case 'add':
          newQuantity = (material.stock_quantity || 0) + quantity
          break
        case 'subtract':
          newQuantity = Math.max(0, (material.stock_quantity || 0) - quantity)
          break
        case 'set':
        default:
          newQuantity = quantity
          break
      }

      const updated = await this.update(materialId, { stock_quantity: newQuantity } as MaterialUpdate)
      
      // Log stock change activity if needed
      console.log(`Stock updated for material ${materialId}: ${operation} ${quantity} -> ${newQuantity}`)
      
      return updated
    } catch (error) {
      throw this.handleError(error, `Failed to update stock for material ${materialId}`)
    }
  }

  // BOM Management
  async getBOMItems(projectId: string, params: BOMItemFilters = {}): Promise<PaginatedResponse<BOMItemWithMaterial>> {
    try {
      const { page = 1, limit = 50, sortBy, sortOrder = 'desc', ...filters } = params
      
      let query = supabase
        .from('bom_items')
        .select(`
          *,
          material:materials (
            id,
            code,
            name,
            category,
            unit_price,
            unit,
            supplier_id,
            supplier:suppliers (
              id,
              name
            )
          )
        `, { count: 'exact' })
        .eq('project_id', projectId)

      // Apply additional filters
      if (filters.material_id) {
        query = query.eq('material_id', filters.material_id)
      }
      if (filters.category) {
        query = query.eq('material.category', filters.category)
      }

      // Apply sorting
      if (sortBy) {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    } catch (error) {
      throw this.handleError(error, `Failed to fetch BOM items for project ${projectId}`)
    }
  }

  async addBOMItem(projectId: string, data: Omit<BOMItemInsert, 'project_id'>): Promise<BOMItem> {
    try {
      const { data: result, error } = await supabase
        .from('bom_items')
        .insert({
          ...data,
          project_id: projectId
        })
        .select()
        .single()

      if (error) throw error

      // Clear project-related caches
      this.clearProjectCache(projectId)

      return result
    } catch (error) {
      throw this.handleError(error, 'Failed to add BOM item')
    }
  }

  async updateBOMItem(id: string, data: BOMItemUpdate): Promise<BOMItem> {
    try {
      const { data: result, error } = await supabase
        .from('bom_items')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Clear project-related caches
      if (result.project_id) {
        this.clearProjectCache(result.project_id)
      }

      return result
    } catch (error) {
      throw this.handleError(error, `Failed to update BOM item ${id}`)
    }
  }

  async deleteBOMItem(id: string): Promise<void> {
    try {
      // Get project_id before deletion for cache clearing
      const bomItem = await supabase
        .from('bom_items')
        .select('project_id')
        .eq('id', id)
        .single()

      const { error } = await supabase
        .from('bom_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Clear project-related caches
      if (bomItem.data?.project_id) {
        this.clearProjectCache(bomItem.data.project_id)
      }
    } catch (error) {
      throw this.handleError(error, `Failed to delete BOM item ${id}`)
    }
  }

  // Get BOM summary for project
  async getBOMSummary(projectId: string): Promise<{
    total_items: number
    total_cost: number
    by_category: Record<string, { count: number; cost: number }>
    by_supplier: Record<string, { count: number; cost: number }>
  }> {
    try {
      const { data: bomItems, error } = await supabase
        .from('bom_items')
        .select(`
          quantity,
          unit_cost,
          total_cost,
          material:materials (
            category,
            supplier_id,
            supplier:suppliers (
              name
            )
          )
        `)
        .eq('project_id', projectId)

      if (error) throw error

      const summary = {
        total_items: 0,
        total_cost: 0,
        by_category: {} as Record<string, { count: number; cost: number }>,
        by_supplier: {} as Record<string, { count: number; cost: number }>
      }

      if (bomItems) {
        bomItems.forEach(item => {
          summary.total_items += item.quantity || 0
          summary.total_cost += item.total_cost || 0

          const category = item.material?.category || 'Uncategorized'
          const supplier = item.material?.supplier?.name || 'Unknown'

          // Category summary
          if (!summary.by_category[category]) {
            summary.by_category[category] = { count: 0, cost: 0 }
          }
          summary.by_category[category].count += item.quantity || 0
          summary.by_category[category].cost += item.total_cost || 0

          // Supplier summary
          if (!summary.by_supplier[supplier]) {
            summary.by_supplier[supplier] = { count: 0, cost: 0 }
          }
          summary.by_supplier[supplier].count += item.quantity || 0
          summary.by_supplier[supplier].cost += item.total_cost || 0
        })
      }

      return summary
    } catch (error) {
      throw this.handleError(error, `Failed to fetch BOM summary for project ${projectId}`)
    }
  }

  // Get material statistics
  async getStats(): Promise<MaterialStats> {
    const cacheKey = this.getCacheKey('getStats', {})
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      const [
        { data: materials, error: materialsError },
        { count: suppliersCount, error: suppliersError },
        { count: bomItemsCount, error: bomItemsError }
      ] = await Promise.all([
        supabase.from('materials').select('category, supplier_id, unit_price, stock_quantity, min_stock_level'),
        supabase.from('suppliers').select('*', { count: 'exact', head: true }),
        supabase.from('bom_items').select('*', { count: 'exact', head: true })
      ])

      if (materialsError) throw materialsError
      if (suppliersError) throw suppliersError
      if (bomItemsError) throw bomItemsError

      const stats: MaterialStats = {
        total_materials: materials?.length || 0,
        total_suppliers: suppliersCount || 0,
        total_bom_items: bomItemsCount || 0,
        total_material_cost: 0,
        by_category: {},
        by_supplier: {},
        low_stock_count: 0,
        out_of_stock_count: 0
      }

      if (materials) {
        materials.forEach(material => {
          // Category stats
          const category = material.category || 'Uncategorized'
          stats.by_category[category] = (stats.by_category[category] || 0) + 1

          // Supplier stats
          if (material.supplier_id) {
            stats.by_supplier[material.supplier_id] = (stats.by_supplier[material.supplier_id] || 0) + 1
          }

          // Stock stats
          const stock = material.stock_quantity || 0
          const minStock = material.min_stock_level || 0
          
          if (stock === 0) {
            stats.out_of_stock_count++
          } else if (stock <= minStock) {
            stats.low_stock_count++
          }
        })
      }

      if (this.config.useCache) {
        this.setCache(cacheKey, stats)
      }

      return stats
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch material statistics')
    }
  }

  // Private helper methods
  private getCacheKey(operation: string, params: any): string {
    return `materials:${operation}:${JSON.stringify(params)}`
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

  private clearProjectCache(projectId: string): void {
    // Clear all cache entries related to this project
    for (const [key] of this.cache) {
      if (key.includes(projectId)) {
        this.cache.delete(key)
      }
    }
  }
}

// Export singleton instance
export const materialsApiService = new MaterialsApiService()
