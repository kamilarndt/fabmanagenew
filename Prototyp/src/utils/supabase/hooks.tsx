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
  budget?: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
  description?: string;
  modules?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Hook for tiles management
export function useTiles() {
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultTiles: TileData[] = [
    {
      id: "T-001",
      name: "Panel główny recepcji",
      zone: "Recepcja",
      status: "W produkcji CNC",
      assignedTo: "Paweł Kasperovich",
      materials: ["MDF 18mm Surowy - 1 arkusz", "Krawędź ABS Biała - 3m"],
      dxfFile: "panel_recepcji_001.dxf",
      assemblyDrawing: "montaz_panel_recepcji.pdf",
      priority: "Wysoki",
      estimatedTime: "4h",
      progress: 73,
      project: "P-001",
      projectName: "Stoisko GR8 TECH",
      machine: "CNC-001",
      startTime: "08:30"
    },
    {
      id: "T-002",
      name: "Blat recepcji L-kształtny",
      zone: "Recepcja",
      status: "W kolejce CNC",
      assignedTo: "Łukasz Jastrzębski",
      materials: ["Laminat HPL Biały - 1.2 x 3m", "Kleiny PUR - 1L"],
      dxfFile: "blat_recepcji_L.dxf",
      assemblyDrawing: null,
      priority: "Średni",
      estimatedTime: "6h",
      progress: 10,
      project: "P-001",
      projectName: "Stoisko GR8 TECH"
    },
    {
      id: "T-003",
      name: "Oświetlenie LED pod blatem",
      zone: "Recepcja",
      status: "Gotowy do montażu",
      assignedTo: "Anna Nowak",
      materials: ["Taśma LED 24V - 5m", "Profil aluminiowy - 3m", "Zasilacz LED 60W"],
      dxfFile: "led_profil_003.dxf",
      assemblyDrawing: "led_montaz_schemat.pdf",
      priority: "Niski",
      estimatedTime: "3h",
      progress: 90,
      project: "P-001",
      projectName: "Stoisko GR8 TECH"
    }
  ];

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
      console.error('Error fetching tiles, using defaults:', err);
      setTiles(defaultTiles);
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
      console.error('Error saving tiles, keeping local state:', err);
      setTiles(newTiles);
    }
  }, []);

  const updateTileStatus = useCallback(async (tileId: string, status: string, source: string) => {
    try {
      setError(null);
      const response = await apiCall(`/tiles/${tileId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status, source }),
      });

      // Update local state
      setTiles(prevTiles =>
        prevTiles.map(tile =>
          tile.id === tileId ? response.tile : tile
        )
      );

      return response.tile;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update tile status';
      setError(msg);
      console.error('Error updating tile status (offline fallback):', err);
      // Local fallback: update status directly
      setTiles(prev => prev.map(t => t.id === tileId ? { ...t, status } as TileData : t));
      return { id: tileId, status } as any;
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
      const msg = err instanceof Error ? err.message : 'Failed to update tile';
      setError(msg);
      console.error('Error updating tile (offline fallback):', err);
      setTiles(prev => prev.map(t => t.id === tileId ? { ...t, ...updates } as TileData : t));
      return { id: tileId, ...updates } as any;
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

  const defaultProjects: ProjectData[] = [
    {
      id: "P-001",
      name: "Projekt Alpha",
      client: "ABC Corporation",
      manager: "Jan Kowalski",
      status: "W realizacji",
      priority: "Wysoki",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "Kompleksowy projekt automatyzacji linii produkcyjnej z integracją systemów CNC.",
      modules: ["wycena", "projektowanie", "produkcja"]
    },
    {
      id: "P-002",
      name: "Modernizacja linii produkcyjnej",
      client: "XYZ Manufacturing",
      manager: "Anna Nowak",
      status: "Projektowanie",
      priority: "Średni",
      startDate: "2024-02-01",
      endDate: "2024-05-15",
      description: "Upgrade istniejącej linii montażowej z nowymi stacjami roboczymi.",
      modules: ["koncepcja", "projektowanie"]
    }
  ];

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall('/projects');
      setProjects(response.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      console.error('Error fetching projects, using defaults:', err);
      setProjects(defaultProjects);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = async (projectData: Omit<ProjectData, 'id' | 'createdAt' | 'updatedAt'>) => {
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
      console.error('Error creating project, using local fallback:', err);
      // Local fallback: generate lightweight project
      const fallbackProject: ProjectData = {
        id: `P-${String((projects?.length || 0) + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: projectData.status || 'Wycena',
        priority: projectData.priority || 'Średni',
        startDate: projectData.startDate || '',
        endDate: projectData.endDate || '',
        description: projectData.description,
        modules: projectData.modules,
        name: projectData.name,
        client: projectData.client,
        manager: projectData.manager,
      };
      setProjects(prev => [...prev, fallbackProject]);
      return fallbackProject;
    }
  };

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