import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useTiles } from "../utils/supabase/hooks";

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
  addTile: (tile: TileData) => Promise<void>;
  updateTile: (tileId: string, updates: Partial<TileData>) => Promise<void>;
  loading: boolean;
  error: string | null;
  fetchTiles: () => Promise<void>;
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

  // Initialize with default data if no tiles exist
  const initializeDefaultTiles = useCallback(async () => {
    if (!loading && tiles.length === 0 && !hasInitialized) {
      try {
        setHasInitialized(true);
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
          },
          {
            id: "T-004",
            name: "Ścianka dzielące - moduł A",
            zone: "Strefa VIP",
            status: "Gotowy do montażu",
            assignedTo: "Paweł Kasperovich", 
            materials: ["MDF 12mm Surowy - 2 arkusze", "Farba RAL 9003 - 0.5L"],
            dxfFile: "scianka_vip_A_004.dxf",
            assemblyDrawing: "scianka_montaz_A.pdf",
            priority: "Wysoki",
            estimatedTime: "8h",
            progress: 100,
            project: "P-001",
            projectName: "Stoisko GR8 TECH",
            completedTime: "14:30",
            actualTime: "7h 15min"
          },
          {
            id: "T-005",
            name: "System prezentacji multimedialnej",
            zone: "Bar",
            status: "Do akceptacji",
            assignedTo: "Kamil Arndt",
            materials: ["Uchwyt VESA 400x400", "Kable HDMI 5m", "Panel sterujący dotykowy"],
            dxfFile: null,
            assemblyDrawing: "multimedia_schemat.pdf",
            priority: "Średni",
            estimatedTime: "5h",
            progress: 5,
            project: "P-001",
            projectName: "Stoisko GR8 TECH"
          },
          {
            id: "T-006",
            name: "Szafka pod barem",
            zone: "Bar",
            status: "Gotowy do montażu",
            assignedTo: "Anna Nowak",
            materials: ["MDF 18mm Laminowany - 1 arkusz", "Zawiasy 35mm - 4szt", "Uchwyt chrom - 2szt"],
            dxfFile: "szafka_bar_006.dxf",
            assemblyDrawing: "szafka_montaz.pdf",
            priority: "Średni",
            estimatedTime: "4h",
            progress: 100,
            project: "P-001",
            projectName: "Stoisko GR8 TECH",
            completedTime: "12:45",
            actualTime: "3h 45min"
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

  const updateTileStatus = async (tileId: string, newStatus: string, source: string) => {
    try {
      let mappedStatus = newStatus;
      
      // Mapowanie statusu w zależności od źródła
      if (source === "cnc" && statusMapping[newStatus as keyof typeof statusMapping]) {
        mappedStatus = statusMapping[newStatus as keyof typeof statusMapping];
      } else if (source === "project" && statusMapping[newStatus as keyof typeof statusMapping]) {
        mappedStatus = statusMapping[newStatus as keyof typeof statusMapping];
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
      addTile,
      updateTile,
      loading,
      error,
      fetchTiles
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