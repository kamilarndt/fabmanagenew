import { useState, useEffect, useCallback } from 'react';
import { apiCall } from './client';

// Types
interface TileData {
  id: string;
  name: string;
  status: string;
  project?: string;
  zone?: string;
  assignedTo?: string;
  priority?: string;
  estimatedTime?: string;
  progress?: number;
  materials?: string[];
  dxfFile?: string | null;
  assemblyDrawing?: string | null;
  notes?: string;
  machine?: string;
  startTime?: string;
  completedTime?: string;
  actualTime?: string;
  projectName?: string;
}

interface ProjectData {
  id: string;
  name: string;
  client: string;
  manager?: string;
  budget?: number | string;
  spent?: number;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
  description?: string;
  modules?: string[];
  progress?: number;
  team?: string[];
  stage?: string;
  overdue?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Hook for tiles management
export function useTiles() {
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching tiles from API...');
      const response = await apiCall('/tiles');
      console.log('Tiles API response:', response);
      setTiles(response.tiles || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tiles';
      setError(errorMessage);
      console.error('Error fetching tiles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTiles = useCallback(async (newTiles: TileData[]) => {
    try {
      setError(null);
      console.log('Saving tiles to API:', newTiles);
      const response = await apiCall('/tiles', {
        method: 'POST',
        body: JSON.stringify({ tiles: newTiles }),
      });
      console.log('Save tiles API response:', response);
      setTiles(newTiles);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save tiles';
      setError(errorMessage);
      console.error('Error saving tiles:', err);
      throw err;
    }
  }, []);

  const updateTileStatus = useCallback(async (tileId: string, status: string, source: string) => {
    try {
      setError(null);
      console.log(`[useTiles] updateTileStatus called:`, { tileId, status, source });
      
      const response = await apiCall(`/tiles/${tileId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status, source }),
      });
      
      console.log(`[useTiles] API response:`, response);
      
      // Update local state
      setTiles(prevTiles => {
        const updatedTiles = prevTiles.map(tile => 
          tile.id === tileId ? response.tile : tile
        );
        console.log(`[useTiles] Updated local state - tile ${tileId} now has status:`, response.tile?.status);
        return updatedTiles;
      });
      
      return response.tile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update tile status';
      setError(errorMessage);
      console.error('Error updating tile status:', err);
      throw err;
    }
  }, []);

  const updateTile = useCallback(async (tileId: string, updates: Partial<TileData>) => {
    try {
      setError(null);
      const response = await apiCall(`/tiles/${tileId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      // Update local state
      setTiles(prevTiles => 
        prevTiles.map(tile => 
          tile.id === tileId ? response.tile : tile
        )
      );
      
      return response.tile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tile');
      console.error('Error updating tile:', err);
      throw err;
    }
  }, []);

  const addTile = useCallback(async (tile: TileData) => {
    try {
      setTiles(prevTiles => {
        const newTiles = [...prevTiles, tile];
        saveTiles(newTiles).catch(console.error);
        return newTiles;
      });
    } catch (err) {
      console.error('Error adding tile:', err);
      throw err;
    }
  }, [saveTiles]);

  useEffect(() => {
    fetchTiles();
  }, [fetchTiles]);

  return {
    tiles,
    loading,
    error,
    fetchTiles,
    saveTiles,
    updateTileStatus,
    updateTile,
    addTile,
  };
}

// Hook for projects management
export function useProjects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall('/projects');
      setProjects(response.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData: Omit<ProjectData, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      console.log('Creating project with data:', projectData);
      const response = await apiCall('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
      console.log('Create project API response:', response);
      
      setProjects(prevProjects => [...prevProjects, response.project]);
      return response.project;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      console.error('Error creating project:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
  };
}

// Types for materials
interface MaterialData {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Hook for materials management
export function useMaterials() {
  const [materials, setMaterials] = useState<MaterialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching materials from API...');
      const response = await apiCall('/materials');
      console.log('Materials API response:', response);
      setMaterials(response.materials || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch materials';
      setError(errorMessage);
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMaterial = useCallback(async (materialData: Omit<MaterialData, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      console.log('Creating material with data:', materialData);
      const response = await apiCall('/materials', {
        method: 'POST',
        body: JSON.stringify(materialData),
      });
      console.log('Create material API response:', response);
      
      setMaterials(prevMaterials => [...prevMaterials, response.material]);
      return response.material;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create material';
      setError(errorMessage);
      console.error('Error creating material:', err);
      throw err;
    }
  }, []);

  const updateMaterial = useCallback(async (materialId: string, updates: Partial<MaterialData>) => {
    try {
      setError(null);
      console.log('Updating material:', materialId, updates);
      const response = await apiCall(`/materials/${materialId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      console.log('Update material API response:', response);
      
      setMaterials(prevMaterials => 
        prevMaterials.map(material => 
          material.id === materialId ? response.material : material
        )
      );
      
      return response.material;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update material';
      setError(errorMessage);
      console.error('Error updating material:', err);
      throw err;
    }
  }, []);

  const deleteMaterial = useCallback(async (materialId: string) => {
    try {
      setError(null);
      console.log('Deleting material:', materialId);
      await apiCall(`/materials/${materialId}`, {
        method: 'DELETE',
      });
      
      setMaterials(prevMaterials => 
        prevMaterials.filter(material => material.id !== materialId)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete material';
      setError(errorMessage);
      console.error('Error deleting material:', err);
      throw err;
    }
  }, []);

  const initializeDefaultMaterials = useCallback(async () => {
    if (!loading && materials.length === 0) {
      try {
        const defaultMaterials = [
          {
            name: "MDF 18mm Surowy",
            category: "Płyty",
            unit: "arkusz",
            price: "120 PLN",
            description: "Płyta MDF 18mm, wymiary 280x207cm, surowa bez laminatu"
          },
          {
            name: "Krawędź ABS Biała",
            category: "Akcesoria",
            unit: "m",
            price: "8.50 PLN",
            description: "Krawędź ABS w kolorze białym, szerokość 22mm"
          },
          {
            name: "Laminat HPL Biały",
            category: "Laminaty",
            unit: "arkusz",
            price: "180 PLN",
            description: "Laminat HPL w kolorze białym, grubość 0.8mm"
          },
          {
            name: "Klej PUR",
            category: "Kleje",
            unit: "L",
            price: "35 PLN",
            description: "Klej poliuretanowy do laminowania"
          },
          {
            name: "Taśma LED 24V",
            category: "Elektronika",
            unit: "m",
            price: "25 PLN",
            description: "Taśma LED 24V, 120 diod/m, ciepła biel"
          },
          {
            name: "Profil aluminiowy",
            category: "Akcesoria",
            unit: "m",
            price: "15 PLN",
            description: "Profil aluminiowy do taśm LED, 16x16mm"
          },
          {
            name: "Zasilacz LED 60W",
            category: "Elektronika",
            unit: "szt",
            price: "85 PLN",
            description: "Zasilacz LED 24V 60W z regulacją"
          },
          {
            name: "Farba RAL 9003",
            category: "Farby",
            unit: "L",
            price: "45 PLN",
            description: "Farba biała RAL 9003, akrylowa"
          }
        ];

        for (const material of defaultMaterials) {
          await createMaterial(material);
        }
      } catch (error) {
        console.error('Error initializing default materials:', error);
      }
    }
  }, [loading, materials.length, createMaterial]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  useEffect(() => {
    initializeDefaultMaterials();
  }, [initializeDefaultMaterials]);

  return {
    materials,
    loading,
    error,
    fetchMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial,
  };
}