import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useTiles } from "../utils/supabase/hooks";
import { mockProjects } from "../utils/mockData";

// Mapowanie statusów między różnymi widokami
const statusMapping = {
  // Z widoku PojjedynczyProjekt do CNC Kanban
  "W kolejce CNC": "W KOLEJCE",
  "W produkcji CNC": "W TRAKCIE CIĘCIA",
  "Gotowy do montażu": "WYCIĘTE",
  
  // Z CNC Kanban do widoku PojjedynczyProjekt
  "W KOLEJCE": "W kolejce CNC",
  "W TRAKCIE CIĘCIA": "W produkcji CNC", 
  "WYCIĘTE": "Gotowy do montażu"
};

// Typy danych
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

interface TileStatusContextType {
  tiles: TileData[];
  updateTileStatus: (tileId: string, newStatus: string, source: string) => Promise<void>;
  getTilesByStatus: (status: string) => TileData[];
  getTilesByProject: (projectId: string) => TileData[];
  addTile: (tile: TileData) => Promise<void>;
  updateTile: (tileId: string, updates: Partial<TileData>) => Promise<void>;
  loading: boolean;
  error: string | null;
  fetchTiles: () => Promise<void>;
  refreshData: () => Promise<void>;
}

// Context dla synchronizacji statusów
const TileStatusContext = createContext<TileStatusContextType | undefined>(undefined);

// Provider komponent
export function TileStatusProvider({ children }: { children: React.ReactNode }) {
  const {
    tiles,
    loading,
    error,
    fetchTiles,
    updateTileStatus: updateTileStatusBackend,
    updateTile: updateTileBackend,
    addTile: addTileBackend,
    saveTiles
  } = useTiles();

  // State to track if we've initialized default data
  const [hasInitialized, setHasInitialized] = useState(false);

  // Function to generate missing tiles for projects
  const generateMissingTiles = useCallback(async () => {
    if (loading || hasInitialized) return;

    try {
      // Get project IDs that already have tiles
      const projectsWithTiles = new Set(tiles.map(tile => tile.project).filter(Boolean));
      
      // Find projects without tiles
      const projectsWithoutTiles = mockProjects.filter(project => 
        !projectsWithTiles.has(project.id)
      );

      if (projectsWithoutTiles.length > 0) {
        console.log(`Generating tiles for ${projectsWithoutTiles.length} projects without tiles`);
        
        const newTiles: TileData[] = [];
        
        for (const project of projectsWithoutTiles) {
          // Generate 3-5 tiles per project based on project type
          const tileCount = Math.floor(Math.random() * 3) + 3; // 3-5 tiles
          
          const tileTemplates = [
            "Rama konstrukcyjna główna",
            "Panel sterowania", 
            "System mocowań",
            "Elementy bezpieczeństwa",
            "Komponenty elektryczne",
            "Części mechaniczne",
            "Obudowa zewnętrzna",
            "System wentylacji"
          ];
          
          for (let i = 0; i < tileCount; i++) {
            const template = tileTemplates[i % tileTemplates.length];
            const statuses = ["Projektowanie", "Do akceptacji", "W kolejce CNC", "W produkcji CNC", "Gotowy do montażu"];
            const zones = ["Strefa A", "Strefa B", "Strefa C", "Strefa D"];
            const priorities = ["Wysoki", "Średni", "Niski"];
            const materials = ["Stal S355", "Aluminium 6061", "Płyta HPL", "Blacha ocynkowana"];
            
            newTiles.push({
              id: `${project.id}-T-${String(i + 1).padStart(3, '0')}`,
              name: `${template} - ${project.name.split(' ').slice(0, 3).join(' ')}`,
              zone: zones[Math.floor(Math.random() * zones.length)],
              status: statuses[Math.floor(Math.random() * statuses.length)],
              assignedTo: project.team[Math.floor(Math.random() * project.team.length)],
              materials: [materials[Math.floor(Math.random() * materials.length)]],
              dxfFile: Math.random() > 0.3 ? `${template.toLowerCase().replace(/\s+/g, '_')}.dxf` : null,
              assemblyDrawing: Math.random() > 0.5 ? `${template.toLowerCase().replace(/\s+/g, '_')}_montaz.pdf` : null,
              priority: priorities[Math.floor(Math.random() * priorities.length)],
              estimatedTime: `${Math.floor(Math.random() * 20) + 4}h`,
              progress: Math.floor(Math.random() * 100),
              project: project.id,
              projectName: project.name,
              notes: Math.random() > 0.7 ? "Uwagi specjalne dotyczące realizacji tego elementu." : undefined
            });
          }
        }
        
        if (newTiles.length > 0) {
          await saveTiles([...tiles, ...newTiles]);
        }
      }
    } catch (error) {
      console.error("Error generating missing tiles:", error);
    }
  }, [loading, hasInitialized, tiles, saveTiles]);

  // Initialize with default data if no tiles exist
  const initializeDefaultTiles = useCallback(async () => {
    if (!loading && tiles.length === 0 && !hasInitialized) {
      try {
        setHasInitialized(true);
        const defaultTiles: TileData[] = [
          // Tiles for P-2025-001 (Automatyzacja Linii Spawalniczej Robot ABB)
          {
            id: "P-2025-001-T-001",
            name: "Rama główna robota spawalniczego",
            zone: "Strefa A",
            status: "W produkcji CNC",
            assignedTo: "Marek Kowalczyk",
            materials: ["Stal S355 - 50kg", "Elektrody spawalnicze - 5kg"],
            dxfFile: "rama_robot_spawalniczy.dxf",
            assemblyDrawing: "rama_montaz.pdf",
            priority: "Krytyczny",
            estimatedTime: "12h",
            progress: 65,
            project: "P-2025-001",
            projectName: "Automatyzacja Linii Spawalniczej Robot ABB",
            machine: "CNC-001",
            startTime: "08:00"
          },
          {
            id: "P-2025-001-T-002",
            name: "Panel sterowania automatyki",
            zone: "Strefa A",
            status: "W kolejce CNC",
            assignedTo: "Anna Lewandowska",
            materials: ["Stal nierdzewna 316L - 8kg", "Elementy elektroniczne"],
            dxfFile: "panel_sterowania.dxf",
            assemblyDrawing: "panel_schemat.pdf",
            priority: "Krytyczny",
            estimatedTime: "8h",
            progress: 15,
            project: "P-2025-001",
            projectName: "Automatyzacja Linii Spawalniczej Robot ABB"
          },
          {
            id: "P-2025-001-T-003",
            name: "System podawania prętów",
            zone: "Strefa B",
            status: "Projektowanie",
            assignedTo: "Tomasz Nowak",
            materials: ["Aluminium 6061 - 25kg", "Rolki transportowe - 8szt"],
            dxfFile: null,
            assemblyDrawing: null,
            priority: "Wysoki",
            estimatedTime: "16h",
            progress: 5,
            project: "P-2025-001",
            projectName: "Automatyzacja Linii Spawalniczej Robot ABB"
          },
          // Tiles for P-2025-002 (Modernizacja Systemu HVAC Zakładu)
          {
            id: "P-2025-002-T-001",
            name: "Kanały wentylacyjne główne",
            zone: "Strefa C",
            status: "Do akceptacji",
            assignedTo: "Agnieszka Dąbrowska",
            materials: ["Blacha ocynkowana - 100m²", "Izolacja termiczna - 50m²"],
            dxfFile: "kanaly_wentylacyjne.dxf",
            assemblyDrawing: "hvac_kanaly.pdf",
            priority: "Wysoki",
            estimatedTime: "20h",
            progress: 25,
            project: "P-2025-002",
            projectName: "Modernizacja Systemu HVAC Zakładu"
          },
          {
            id: "P-2025-002-T-002",
            name: "Centrala wentylacyjna AHU-01",
            zone: "Strefa C",
            status: "W kolejce CNC",
            assignedTo: "Michał Zieliński",
            materials: ["Obudowa stalowa - 200kg", "Filtry HEPA - 4szt"],
            dxfFile: "centrala_ahu01.dxf",
            assemblyDrawing: "centrala_montaz.pdf",
            priority: "Wysoki",
            estimatedTime: "24h",
            progress: 10,
            project: "P-2025-002",
            projectName: "Modernizacja Systemu HVAC Zakładu"
          },
          // Tiles for P-2025-003 (Instalacja Centrum Obróbczego DMG MORI)
          {
            id: "P-2025-003-T-001",
            name: "Fundament maszyny DMG MORI",
            zone: "Strefa D",
            status: "Gotowy do montażu",
            assignedTo: "Łukasz Wójcik",
            materials: ["Beton zbrojony - 15m³", "Śruby kotwiące M24 - 16szt"],
            dxfFile: "fundament_dmg.dxf",
            assemblyDrawing: "fundament_plan.pdf",
            priority: "Wysoki",
            estimatedTime: "32h",
            progress: 95,
            project: "P-2025-003",
            projectName: "Instalacja Centrum Obróbczego DMG MORI",
            completedTime: "15:30",
            actualTime: "30h 45min"
          },
          {
            id: "P-2025-003-T-002",
            name: "System odprowadzania wiórów",
            zone: "Strefa D",
            status: "W montażu",
            assignedTo: "Magdalena Piotrowska",
            materials: ["Rury stalowe Ø150 - 50m", "Przenośnik ślimakowy"],
            dxfFile: "system_wiorow.dxf",
            assemblyDrawing: "wiory_montaz.pdf",
            priority: "Średni",
            estimatedTime: "12h",
            progress: 80,
            project: "P-2025-003",
            projectName: "Instalacja Centrum Obróbczego DMG MORI"
          }
        ];
        
        await saveTiles(defaultTiles);
      } catch (error) {
        console.error("Error initializing default tiles:", error);
      }
    }
  }, [loading, tiles.length, hasInitialized, saveTiles]);

  useEffect(() => {
    initializeDefaultTiles();
  }, [initializeDefaultTiles]);

  useEffect(() => {
    generateMissingTiles();
  }, [generateMissingTiles]);

  const updateTileStatus = async (tileId: string, newStatus: string, source: string) => {
    try {
      // CNC Kanban już przesyła docelowe statusy globalne (mapowanie już zostało wykonane)
      // Więc przekazujemy status bez dodatkowego mapowania
      let mappedStatus = newStatus;
      
      if (source === "project") {
        // Dla aktualizacji z widoku projektu, status pozostaje bez zmian
        // gdyż już zawiera poprawny globalny status
      } else if (source === "cnc") {
        // CNC Kanban już przekazuje zmapowany status globalny
        // np. "W kolejce CNC", "W produkcji CNC", "Gotowy do montażu"
      }

      await updateTileStatusBackend(tileId, mappedStatus, source);
    } catch (error) {
      console.error("Failed to update tile status:", error);
      throw error;
    }
  };

  const getTilesByStatus = (status: string): TileData[] => {
    return tiles.filter(tile => tile.status === status);
  };

  const getTilesByProject = (projectId: string): TileData[] => {
    return tiles.filter(tile => tile.project === projectId);
  };

  const refreshData = async () => {
    try {
      await fetchTiles();
      // After fetching, check for missing tiles
      await generateMissingTiles();
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const addTile = async (tile: TileData) => {
    try {
      await addTileBackend(tile);
    } catch (error) {
      console.error("Failed to add tile:", error);
      throw error;
    }
  };

  const updateTile = async (tileId: string, updates: Partial<TileData>) => {
    try {
      await updateTileBackend(tileId, updates);
    } catch (error) {
      console.error("Failed to update tile:", error);
      throw error;
    }
  };

  return (
    <TileStatusContext.Provider value={{
      tiles,
      updateTileStatus,
      getTilesByStatus,
      getTilesByProject,
      addTile,
      updateTile,
      loading,
      error,
      fetchTiles,
      refreshData
    }}>
      {children}
    </TileStatusContext.Provider>
  );
}

// Hook do używania kontekstu
export function useTileStatus() {
  const context = useContext(TileStatusContext);
  if (context === undefined) {
    throw new Error('useTileStatus must be used within a TileStatusProvider');
  }
  return context;
}

// Funkcje pomocnicze
export function getStatusForView(status: string, targetView: "cnc" | "project"): string {
  if (targetView === "cnc") {
    return statusMapping[status as keyof typeof statusMapping] || status;
  } else {
    // Znajdź odwrotne mapowanie
    const reverseMapping = Object.entries(statusMapping).reduce((acc, [key, value]) => {
      acc[value] = key;
      return acc;
    }, {} as Record<string, string>);
    
    return reverseMapping[status] || status;
  }
}

export function isCNCStatus(status: string): boolean {
  return ["W KOLEJCE", "W TRAKCIE CIĘCIA", "WYCIĘTE"].includes(status);
}

export function isProjectStatus(status: string): boolean {
  return ["Projektowanie", "Do akceptacji", "W kolejce CNC", "W produkcji CNC", "Gotowy do montażu", "W montażu", "Zakończony"].includes(status);
}