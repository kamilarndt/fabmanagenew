import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Tile, TileStatus, TileFilter } from '../types/tiles.types';

interface TilesState {
  tiles: Tile[];
  tilesLoading: boolean;
  tilesError: string | null;
  
  selectedTile: Tile | null;
  filters: TileFilter;
  
  // Actions
  fetchTiles: () => Promise<void>;
  addTile: (tile: Omit<Tile, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTile: (id: string, updates: Partial<Tile>) => Promise<void>;
  deleteTile: (id: string) => Promise<void>;
  moveTile: (id: string, newStatus: TileStatus) => Promise<void>;
  
  setSelectedTile: (tile: Tile | null) => void;
  setFilters: (filters: Partial<TileFilter>) => void;
  
  // Computed
  getTilesByStatus: (status: TileStatus) => Tile[];
  getFilteredTiles: () => Tile[];
}

export const useTilesStore = create<TilesState>()(
  immer((set, get) => ({
    tiles: [],
    tilesLoading: false,
    tilesError: null,
    selectedTile: null,
    filters: {},
    
    fetchTiles: async () => {
      set((state) => {
        state.tilesLoading = true;
        state.tilesError = null;
      });
      
      try {
        const response = await fetch('/api/tiles');
        const tiles = await response.json();
        
        set((state) => {
          state.tiles = tiles;
          state.tilesLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.tilesError = error instanceof Error ? error.message : 'Unknown error';
          state.tilesLoading = false;
        });
      }
    },
    
    addTile: async (tileData) => {
      try {
        const response = await fetch('/api/tiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tileData),
        });
        const tile = await response.json();
        
        set((state) => {
          state.tiles.push(tile);
        });
      } catch (error) {
        throw error;
      }
    },
    
    updateTile: async (id, updates) => {
      try {
        const response = await fetch(`/api/tiles/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        const tile = await response.json();
        
        set((state) => {
          const index = state.tiles.findIndex(t => t.id === id);
          if (index !== -1) {
            state.tiles[index] = { ...state.tiles[index], ...tile };
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    deleteTile: async (id) => {
      try {
        const response = await fetch(`/api/tiles/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete tile');
        
        set((state) => {
          state.tiles = state.tiles.filter(t => t.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },
    
    moveTile: async (id, newStatus) => {
      try {
        const response = await fetch(`/api/tiles/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        
        if (!response.ok) throw new Error('Failed to move tile');
        
        set((state) => {
          const tile = state.tiles.find(t => t.id === id);
          if (tile) {
            tile.status = newStatus;
          }
        });
      } catch (error) {
        throw error;
      }
    },
    
    setSelectedTile: (tile) => {
      set((state) => {
        state.selectedTile = tile;
      });
    },
    
    setFilters: (filters) => {
      set((state) => {
        state.filters = { ...state.filters, ...filters };
      });
    },
    
    getTilesByStatus: (status) => {
      return get().tiles.filter(tile => tile.status === status);
    },
    
    getFilteredTiles: () => {
      const { tiles, filters } = get();
      return tiles.filter(tile => {
        if (filters.status && !filters.status.includes(tile.status)) return false;
        if (filters.assignee_id && tile.assignee_id !== filters.assignee_id) return false;
        if (filters.project_id && tile.project_id !== filters.project_id) return false;
        if (filters.priority && !filters.priority.includes(tile.priority)) return false;
        if (filters.tags && !filters.tags.some(tag => tile.tags?.includes(tag))) return false;
        return true;
      });
    },
  }))
);