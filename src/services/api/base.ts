// Base API Service - Common functionality for all API services
import { httpClient } from '../../lib/httpClient'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import type {
    ApiResponse,
    PaginatedResponse,
    QueryParams,
    ServiceConfig,
    ServiceError
} from './types'

export abstract class BaseApiService<T, TInsert, TUpdate> {
  protected tableName: string
  protected config: ServiceConfig
  private cache: Map<string, { data: any; timestamp: number }> = new Map()

  constructor(tableName: string, config: ServiceConfig = {}) {
    this.tableName = tableName
    this.config = {
      useCache: true,
      cacheTimeout: 5 * 60 * 1000, // 5 minutes
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    }
  }

  // Generic list method
  async list(params: QueryParams = {}): Promise<PaginatedResponse<T>> {
    const cacheKey = this.getCacheKey('list', params)
    
    // Check cache first
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      let result: PaginatedResponse<T>

      if (isSupabaseConfigured) {
        result = await this.listWithSupabase(params)
      } else {
        result = await this.listWithHttp(params)
      }

      // Cache the result
      if (this.config.useCache) {
        this.setCache(cacheKey, result)
      }

      return result
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch list')
    }
  }

  // Generic get method
  async get(id: string): Promise<T> {
    const cacheKey = this.getCacheKey('get', { id })
    
    // Check cache first
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      let result: T

      if (isSupabaseConfigured) {
        result = await this.getWithSupabase(id)
      } else {
        result = await this.getWithHttp(id)
      }

      // Cache the result
      if (this.config.useCache) {
        this.setCache(cacheKey, result)
      }

      return result
    } catch (error) {
      throw this.handleError(error, `Failed to fetch ${this.tableName} with id ${id}`)
    }
  }

  // Generic create method
  async create(data: TInsert): Promise<T> {
    try {
      let result: T

      if (isSupabaseConfigured) {
        result = await this.createWithSupabase(data)
      } else {
        result = await this.createWithHttp(data)
      }

      // Clear related caches
      this.clearCache()

      return result
    } catch (error) {
      throw this.handleError(error, `Failed to create ${this.tableName}`)
    }
  }

  // Generic update method
  async update(id: string, data: TUpdate): Promise<T> {
    try {
      let result: T

      if (isSupabaseConfigured) {
        result = await this.updateWithSupabase(id, data)
      } else {
        result = await this.updateWithHttp(id, data)
      }

      // Clear related caches
      this.clearCache()

      return result
    } catch (error) {
      throw this.handleError(error, `Failed to update ${this.tableName} with id ${id}`)
    }
  }

  // Generic delete method
  async delete(id: string): Promise<void> {
    try {
      if (isSupabaseConfigured) {
        await this.deleteWithSupabase(id)
      } else {
        await this.deleteWithHttp(id)
      }

      // Clear related caches
      this.clearCache()
    } catch (error) {
      throw this.handleError(error, `Failed to delete ${this.tableName} with id ${id}`)
    }
  }

  // Generic search method
  async search(query: string, params: QueryParams = {}): Promise<PaginatedResponse<T>> {
    const cacheKey = this.getCacheKey('search', { query, ...params })
    
    // Check cache first
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      let result: PaginatedResponse<T>

      if (isSupabaseConfigured) {
        result = await this.searchWithSupabase(query, params)
      } else {
        result = await this.searchWithHttp(query, params)
      }

      // Cache the result
      if (this.config.useCache) {
        this.setCache(cacheKey, result)
      }

      return result
    } catch (error) {
      throw this.handleError(error, `Failed to search ${this.tableName}`)
    }
  }

  // Supabase implementations
  private async listWithSupabase(params: QueryParams): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'desc', ...filters } = params
    
    let query = supabase.from(this.tableName).select('*', { count: 'exact' })

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'search') {
          // For search, we'll need to implement text search
          // This is a simplified version - you might want to use full-text search
          query = query.or(`name.ilike.%${value}%,description.ilike.%${value}%`)
        } else {
          query = query.eq(key, value)
        }
      }
    })

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
  }

  private async getWithSupabase(id: string): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  private async createWithSupabase(data: TInsert): Promise<T> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return result
  }

  private async updateWithSupabase(id: string, data: TUpdate): Promise<T> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return result
  }

  private async deleteWithSupabase(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  private async searchWithSupabase(query: string, params: QueryParams): Promise<PaginatedResponse<T>> {
    // This is a simplified search implementation
    // You might want to use PostgreSQL full-text search for better results
    return this.listWithSupabase({ ...params, search: query })
  }

  // HTTP implementations (fallback)
  private async listWithHttp(params: QueryParams): Promise<PaginatedResponse<T>> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    const response = await httpClient.get<ApiResponse<PaginatedResponse<T>>>(
      `/api/${this.tableName}?${searchParams.toString()}`
    )

    return response.data
  }

  private async getWithHttp(id: string): Promise<T> {
    const response = await httpClient.get<ApiResponse<T>>(`/api/${this.tableName}/${id}`)
    return response.data
  }

  private async createWithHttp(data: TInsert): Promise<T> {
    const response = await httpClient.post<ApiResponse<T>>(`/api/${this.tableName}`, data)
    return response.data
  }

  private async updateWithHttp(id: string, data: TUpdate): Promise<T> {
    const response = await httpClient.put<ApiResponse<T>>(`/api/${this.tableName}/${id}`, data)
    return response.data
  }

  private async deleteWithHttp(id: string): Promise<void> {
    await httpClient.delete(`/api/${this.tableName}/${id}`)
  }

  private async searchWithHttp(query: string, params: QueryParams): Promise<PaginatedResponse<T>> {
    const searchParams = new URLSearchParams({ q: query })
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    const response = await httpClient.get<ApiResponse<PaginatedResponse<T>>>(
      `/api/${this.tableName}/search?${searchParams.toString()}`
    )

    return response.data
  }

  // Cache management
  private getCacheKey(operation: string, params: any): string {
    return `${this.tableName}:${operation}:${JSON.stringify(params)}`
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

  private clearCache(): void {
    this.cache.clear()
  }

  // Error handling
  private handleError(error: any, message: string): ServiceError {
    console.error(`[${this.tableName}] ${message}:`, error)
    
    if (error instanceof ServiceError) {
      return error
    }

    const status = error?.status || error?.code || 500
    const errorMessage = error?.message || message

    return new ServiceError(errorMessage, status)
  }

  // Utility methods
  protected async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: any
    
    for (let attempt = 1; attempt <= this.config.retryAttempts!; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        
        if (attempt < this.config.retryAttempts!) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay! * attempt))
        }
      }
    }
    
    throw this.handleError(lastError, 'Operation failed after retries')
  }

  // Batch operations
  async batchCreate(data: TInsert[]): Promise<T[]> {
    try {
      if (isSupabaseConfigured) {
        const { data: result, error } = await supabase
          .from(this.tableName)
          .insert(data)
          .select()

        if (error) throw error
        return result || []
      } else {
        const response = await httpClient.post<ApiResponse<T[]>>(`/api/${this.tableName}/batch`, data)
        return response.data
      }
    } catch (error) {
      throw this.handleError(error, `Failed to batch create ${this.tableName}`)
    }
  }

  async batchUpdate(updates: Array<{ id: string; data: TUpdate }>): Promise<T[]> {
    try {
      const results: T[] = []
      
      for (const update of updates) {
        const result = await this.update(update.id, update.data)
        results.push(result)
      }
      
      return results
    } catch (error) {
      throw this.handleError(error, `Failed to batch update ${this.tableName}`)
    }
  }

  async batchDelete(ids: string[]): Promise<void> {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from(this.tableName)
          .delete()
          .in('id', ids)

        if (error) throw error
      } else {
        await httpClient.delete(`/api/${this.tableName}/batch`, { data: { ids } })
      }
    } catch (error) {
      throw this.handleError(error, `Failed to batch delete ${this.tableName}`)
    }
  }
}
