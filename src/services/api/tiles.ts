// Tiles API Service - Kanban board and tile management
import { supabase } from '../../lib/supabase'
import { BaseApiService } from './base'
import type {
    KanbanCard,
    KanbanCardInsert,
    KanbanCardUpdate,
    KanbanCardWithTile,
    PaginatedResponse,
    QueryParams,
    Tile,
    TileInsert,
    TileUpdate,
    TileWithProject
} from './types'

export interface TileFilters extends QueryParams {
  project_id?: string
  status?: string
  priority?: string
  assigned_to?: string
  created_by?: string
}

export interface KanbanFilters extends QueryParams {
  column_id?: string
  tile_id?: string
  assigned_to?: string
}

export interface TileStats {
  total_tiles: number
  by_status: Record<string, number>
  by_priority: Record<string, number>
  by_assigned: Record<string, number>
  overdue_count: number
  completed_count: number
  completion_rate: number
}

export interface KanbanBoard {
  columns: Array<{
    id: string
    name: string
    position: number
    cards: KanbanCardWithTile[]
  }>
  stats: {
    total_cards: number
    completed_cards: number
    in_progress_cards: number
  }
}

export class TilesApiService extends BaseApiService<Tile, TileInsert, TileUpdate> {
  constructor() {
    super('tiles', {
      useCache: true,
      cacheTimeout: 2 * 60 * 1000, // 2 minutes for tiles
      retryAttempts: 3
    })
  }

  // Get tiles with project information
  async listWithProjects(params: TileFilters = {}): Promise<PaginatedResponse<TileWithProject>> {
    const cacheKey = this.getCacheKey('listWithProjects', params)
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      const { page = 1, limit = 10, sortBy, sortOrder = 'desc', ...filters } = params
      
      let query = supabase
        .from('tiles')
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
      if (filters.priority) {
        query = query.eq('priority', filters.priority)
      }
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to)
      }
      if (filters.created_by) {
        query = query.eq('created_by', filters.created_by)
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
      throw this.handleError(error, 'Failed to fetch tiles with projects')
    }
  }

  // Get kanban board for project
  async getKanbanBoard(projectId: string): Promise<KanbanBoard> {
    const cacheKey = this.getCacheKey('getKanbanBoard', { projectId })
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      // Get columns
      const { data: columns, error: columnsError } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('project_id', projectId)
        .order('position', { ascending: true })

      if (columnsError) throw columnsError

      // Get cards with tiles
      const { data: cards, error: cardsError } = await supabase
        .from('kanban_cards')
        .select(`
          *,
          tile:tiles (
            id,
            name,
            description,
            status,
            priority,
            assigned_to,
            due_date
          )
        `)
        .eq('project_id', projectId)
        .order('position', { ascending: true })

      if (cardsError) throw cardsError

      // Organize cards by column
      const columnsWithCards = (columns || []).map(column => ({
        ...column,
        cards: (cards || [])
          .filter(card => card.column_id === column.id)
          .sort((a, b) => (a.position || 0) - (b.position || 0))
      }))

      // Calculate stats
      const totalCards = cards?.length || 0
      const completedCards = cards?.filter(card => 
        card.tile?.status === 'completed' || column.name.toLowerCase().includes('done')
      ).length || 0
      const inProgressCards = cards?.filter(card => 
        card.tile?.status === 'in_progress' || column.name.toLowerCase().includes('progress')
      ).length || 0

      const result = {
        columns: columnsWithCards,
        stats: {
          total_cards: totalCards,
          completed_cards: completedCards,
          in_progress_cards: inProgressCards
        }
      }

      if (this.config.useCache) {
        this.setCache(cacheKey, result)
      }

      return result
    } catch (error) {
      throw this.handleError(error, `Failed to fetch kanban board for project ${projectId}`)
    }
  }

  // Move card between columns
  async moveCard(cardId: string, newColumnId: string, newPosition: number): Promise<KanbanCard> {
    try {
      const { data: result, error } = await supabase
        .from('kanban_cards')
        .update({
          column_id: newColumnId,
          position: newPosition,
          updated_at: new Date().toISOString()
        })
        .eq('id', cardId)
        .select()
        .single()

      if (error) throw error

      // Clear kanban board cache for this project
      if (result.project_id) {
        this.clearProjectCache(result.project_id)
      }

      return result
    } catch (error) {
      throw this.handleError(error, `Failed to move card ${cardId}`)
    }
  }

  // Create kanban card
  async createCard(data: KanbanCardInsert): Promise<KanbanCard> {
    try {
      // Get the next position in the column
      const { data: lastCard } = await supabase
        .from('kanban_cards')
        .select('position')
        .eq('column_id', data.column_id)
        .eq('project_id', data.project_id)
        .order('position', { ascending: false })
        .limit(1)
        .single()

      const nextPosition = (lastCard?.position || 0) + 1

      const { data: result, error } = await supabase
        .from('kanban_cards')
        .insert({
          ...data,
          position: nextPosition
        })
        .select()
        .single()

      if (error) throw error

      // Clear project cache
      this.clearProjectCache(data.project_id)

      return result
    } catch (error) {
      throw this.handleError(error, 'Failed to create kanban card')
    }
  }

  // Update kanban card
  async updateCard(id: string, data: KanbanCardUpdate): Promise<KanbanCard> {
    try {
      const { data: result, error } = await supabase
        .from('kanban_cards')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Clear project cache
      if (result.project_id) {
        this.clearProjectCache(result.project_id)
      }

      return result
    } catch (error) {
      throw this.handleError(error, `Failed to update kanban card ${id}`)
    }
  }

  // Delete kanban card
  async deleteCard(id: string): Promise<void> {
    try {
      // Get project_id before deletion for cache clearing
      const { data: card } = await supabase
        .from('kanban_cards')
        .select('project_id')
        .eq('id', id)
        .single()

      const { error } = await supabase
        .from('kanban_cards')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Clear project cache
      if (card?.project_id) {
        this.clearProjectCache(card.project_id)
      }
    } catch (error) {
      throw this.handleError(error, `Failed to delete kanban card ${id}`)
    }
  }

  // Update tile status
  async updateTileStatus(tileId: string, status: string): Promise<Tile> {
    try {
      const result = await this.update(tileId, { status } as TileUpdate)
      
      // Clear project cache
      this.clearProjectCache(result.project_id)
      
      return result
    } catch (error) {
      throw this.handleError(error, `Failed to update tile status for ${tileId}`)
    }
  }

  // Assign tile to user
  async assignTile(tileId: string, userId: string): Promise<Tile> {
    try {
      const result = await this.update(tileId, { assigned_to: userId } as TileUpdate)
      
      // Clear project cache
      this.clearProjectCache(result.project_id)
      
      return result
    } catch (error) {
      throw this.handleError(error, `Failed to assign tile ${tileId}`)
    }
  }

  // Get tile statistics
  async getStats(filters: Partial<TileFilters> = {}): Promise<TileStats> {
    const cacheKey = this.getCacheKey('getStats', filters)
    
    if (this.config.useCache) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      let query = supabase.from('tiles').select('status, priority, assigned_to, due_date')

      // Apply filters
      if (filters.project_id) {
        query = query.eq('project_id', filters.project_id)
      }
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to)
      }

      const { data: tiles, error } = await query

      if (error) throw error

      const stats: TileStats = {
        total_tiles: tiles?.length || 0,
        by_status: {},
        by_priority: {},
        by_assigned: {},
        overdue_count: 0,
        completed_count: 0,
        completion_rate: 0
      }

      if (tiles) {
        const now = new Date()
        
        tiles.forEach(tile => {
          // Status stats
          stats.by_status[tile.status] = (stats.by_status[tile.status] || 0) + 1
          
          // Priority stats
          if (tile.priority) {
            stats.by_priority[tile.priority] = (stats.by_priority[tile.priority] || 0) + 1
          }
          
          // Assigned stats
          if (tile.assigned_to) {
            stats.by_assigned[tile.assigned_to] = (stats.by_assigned[tile.assigned_to] || 0) + 1
          }
          
          // Overdue count
          if (tile.due_date && new Date(tile.due_date) < now && tile.status !== 'completed') {
            stats.overdue_count++
          }
          
          // Completed count
          if (tile.status === 'completed') {
            stats.completed_count++
          }
        })

        stats.completion_rate = stats.total_tiles > 0 ? (stats.completed_count / stats.total_tiles) * 100 : 0
      }

      if (this.config.useCache) {
        this.setCache(cacheKey, stats)
      }

      return stats
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch tile statistics')
    }
  }

  // Get user's assigned tiles
  async getUserTiles(userId: string, params: TileFilters = {}): Promise<PaginatedResponse<TileWithProject>> {
    return this.listWithProjects({ ...params, assigned_to: userId })
  }

  // Get overdue tiles
  async getOverdueTiles(params: TileFilters = {}): Promise<Tile[]> {
    try {
      const now = new Date().toISOString()
      
      let query = supabase
        .from('tiles')
        .select('*')
        .lt('due_date', now)
        .neq('status', 'completed')

      // Apply additional filters
      if (params.project_id) {
        query = query.eq('project_id', params.project_id)
      }
      if (params.assigned_to) {
        query = query.eq('assigned_to', params.assigned_to)
      }

      query = query.order('due_date', { ascending: true })

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch overdue tiles')
    }
  }

  // Private helper methods
  private getCacheKey(operation: string, params: any): string {
    return `tiles:${operation}:${JSON.stringify(params)}`
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
export const tilesApiService = new TilesApiService()
