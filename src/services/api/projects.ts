// Projects API Service - Comprehensive project management
import { supabase } from '../../lib/supabase'
import { BaseApiService } from './base'
import type {
    PaginatedResponse,
    Project,
    ProjectInsert,
    ProjectUpdate,
    ProjectWithClient,
    QueryParams
} from './types'

export interface ProjectFilters extends QueryParams {
  status?: string
  client_id?: string
  created_by?: string
  start_date_from?: string
  start_date_to?: string
  end_date_from?: string
  end_date_to?: string
  budget_min?: number
  budget_max?: number
  modules?: string[]
}

export interface ProjectStats {
  total: number
  by_status: Record<string, number>
  by_client: Record<string, number>
  total_budget: number
  avg_budget: number
  completion_rate: number
}

export class ProjectsApiService extends BaseApiService<Project, ProjectInsert, ProjectUpdate> {
  constructor() {
    super('projects', {
      useCache: true,
      cacheTimeout: 2 * 60 * 1000, // 2 minutes for projects
      retryAttempts: 3
    })
  }

  // List projects with client information
  async listWithClients(params: ProjectFilters = {}): Promise<PaginatedResponse<ProjectWithClient>> {
    const cacheKey = this.getCacheKey('listWithClients', params)
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      const { page = 1, limit = 10, sortBy, sortOrder = 'desc', ...filters } = params
      
      let query = supabase
        .from('projects')
        .select(`
          *,
          client:clients (
            id,
            name,
            company_name,
            email,
            phone
          )
        `, { count: 'exact' })

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.client_id) {
        query = query.eq('client_id', filters.client_id)
      }
      if (filters.created_by) {
        query = query.eq('created_by', filters.created_by)
      }
      if (filters.start_date_from) {
        query = query.gte('start_date', filters.start_date_from)
      }
      if (filters.start_date_to) {
        query = query.lte('start_date', filters.start_date_to)
      }
      if (filters.end_date_from) {
        query = query.gte('end_date', filters.end_date_from)
      }
      if (filters.end_date_to) {
        query = query.lte('end_date', filters.end_date_to)
      }
      if (filters.budget_min) {
        query = query.gte('budget', filters.budget_min)
      }
      if (filters.budget_max) {
        query = query.lte('budget', filters.budget_max)
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
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
      throw this.handleError(error, 'Failed to fetch projects with clients')
    }
  }

  // Get project with full details
  async getWithDetails(id: string): Promise<ProjectWithClient & {
    messages_count: number
    bom_items_count: number
    tiles_count: number
    files_count: number
    total_cost: number
  }> {
    const cacheKey = this.getCacheKey('getWithDetails', { id })
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      // Get project with client
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients (
            id,
            name,
            company_name,
            email,
            phone,
            address
          )
        `)
        .eq('id', id)
        .single()

      if (projectError) throw projectError

      // Get counts
      const [
        { count: messagesCount },
        { count: bomItemsCount },
        { count: tilesCount },
        { count: filesCount }
      ] = await Promise.all([
        supabase.from('project_messages').select('*', { count: 'exact', head: true }).eq('project_id', id),
        supabase.from('bom_items').select('*', { count: 'exact', head: true }).eq('project_id', id),
        supabase.from('tiles').select('*', { count: 'exact', head: true }).eq('project_id', id),
        supabase.from('files').select('*', { count: 'exact', head: true }).eq('project_id', id)
      ])

      // Get total cost from BOM
      const { data: bomItems } = await supabase
        .from('bom_items')
        .select('total_cost')
        .eq('project_id', id)

      const totalCost = bomItems?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0

      const result = {
        ...project,
        messages_count: messagesCount || 0,
        bom_items_count: bomItemsCount || 0,
        tiles_count: tilesCount || 0,
        files_count: filesCount || 0,
        total_cost: totalCost
      }

      if (this.config.useCache) {
        this.setCache(cacheKey, result)
      }

      return result
    } catch (error) {
      throw this.handleError(error, `Failed to fetch project details for id ${id}`)
    }
  }

  // Get project statistics
  async getStats(filters: Partial<ProjectFilters> = {}): Promise<ProjectStats> {
    const cacheKey = this.getCacheKey('getStats', filters)
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      let query = supabase.from('projects').select('status, client_id, budget')

      // Apply filters
      if (filters.client_id) {
        query = query.eq('client_id', filters.client_id)
      }
      if (filters.created_by) {
        query = query.eq('created_by', filters.created_by)
      }
      if (filters.start_date_from) {
        query = query.gte('start_date', filters.start_date_from)
      }
      if (filters.start_date_to) {
        query = query.lte('start_date', filters.start_date_to)
      }

      const { data: projects, error } = await query

      if (error) throw error

      const stats: ProjectStats = {
        total: projects?.length || 0,
        by_status: {},
        by_client: {},
        total_budget: 0,
        avg_budget: 0,
        completion_rate: 0
      }

      if (projects) {
        // Calculate stats
        projects.forEach(project => {
          // Status stats
          stats.by_status[project.status] = (stats.by_status[project.status] || 0) + 1
          
          // Client stats
          if (project.client_id) {
            stats.by_client[project.client_id] = (stats.by_client[project.client_id] || 0) + 1
          }
          
          // Budget stats
          if (project.budget) {
            stats.total_budget += project.budget
          }
        })

        stats.avg_budget = stats.total > 0 ? stats.total_budget / stats.total : 0
        
        // Completion rate (assuming 'completed' status means 100% complete)
        const completedCount = stats.by_status['completed'] || 0
        stats.completion_rate = stats.total > 0 ? (completedCount / stats.total) * 100 : 0
      }

      if (this.config.useCache) {
        this.setCache(cacheKey, stats)
      }

      return stats
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch project statistics')
    }
  }

  // Update project status
  async updateStatus(id: string, status: string): Promise<Project> {
    try {
      const result = await this.update(id, { status } as ProjectUpdate)
      
      // Log activity
      await this.logActivity(id, 'status_changed', { 
        old_status: 'unknown', // You might want to track the previous status
        new_status: status 
      })
      
      return result
    } catch (error) {
      throw this.handleError(error, `Failed to update project status for id ${id}`)
    }
  }

  // Update project budget
  async updateBudget(id: string, budget: number): Promise<Project> {
    try {
      const result = await this.update(id, { budget } as ProjectUpdate)
      
      // Log activity
      await this.logActivity(id, 'budget_updated', { 
        new_budget: budget 
      })
      
      return result
    } catch (error) {
      throw this.handleError(error, `Failed to update project budget for id ${id}`)
    }
  }

  // Duplicate project
  async duplicate(id: string, newName: string): Promise<Project> {
    try {
      const original = await this.get(id)
      
      const duplicateData: ProjectInsert = {
        ...original,
        id: undefined, // Let Supabase generate new ID
        name: newName,
        status: 'draft',
        created_at: undefined,
        updated_at: undefined
      }

      const duplicated = await this.create(duplicateData)
      
      // Log activity
      await this.logActivity(duplicated.id, 'project_duplicated', { 
        original_project_id: id,
        original_name: original.name 
      })
      
      return duplicated
    } catch (error) {
      throw this.handleError(error, `Failed to duplicate project with id ${id}`)
    }
  }

  // Archive project
  async archive(id: string): Promise<Project> {
    try {
      const result = await this.update(id, { status: 'archived' } as ProjectUpdate)
      
      // Log activity
      await this.logActivity(id, 'project_archived', {})
      
      return result
    } catch (error) {
      throw this.handleError(error, `Failed to archive project with id ${id}`)
    }
  }

  // Restore archived project
  async restore(id: string): Promise<Project> {
    try {
      const result = await this.update(id, { status: 'active' } as ProjectUpdate)
      
      // Log activity
      await this.logActivity(id, 'project_restored', {})
      
      return result
    } catch (error) {
      throw this.handleError(error, `Failed to restore project with id ${id}`)
    }
  }

  // Get project timeline
  async getTimeline(id: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('project_activity')
        .select(`
          *,
          actor:auth.users (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .eq('project_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      throw this.handleError(error, `Failed to fetch timeline for project ${id}`)
    }
  }

  // Private helper methods
  private async logActivity(projectId: string, type: string, payload: any): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser()
      
      await supabase.from('project_activity').insert({
        project_id: projectId,
        type,
        payload_json: payload,
        actor_id: user.user?.id
      })
    } catch (error) {
      console.warn('Failed to log activity:', error)
    }
  }

  private getCacheKey(operation: string, params: any): string {
    return `projects:${operation}:${JSON.stringify(params)}`
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
export const projectsApiService = new ProjectsApiService()
