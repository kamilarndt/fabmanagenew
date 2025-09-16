import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { isSupabaseConfigured } from '../lib/supabase'
import { showToast } from "../lib/notifications";
import { canTransitionTo } from "../lib/statusUtils";
import {
  listTiles,
  createTile as sbCreate,
  deleteTile as sbDelete,
  updateTile as sbUpdate,
} from "../services/tiles";
// import { config } from '../lib/config'
import type { Tile } from "../types/tiles.types";

// Re-export types from central types file
export type { BomItem, Tile } from "../types/tiles.types";

// Zasilanie kafelków danymi z mockDatabase

interface TilesState {
  tiles: Tile[];
  tilesById: Record<string, Tile>;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  refresh: () => Promise<void>;
  setStatus: (id: string, status: Tile["status"]) => Promise<void>;
  updateTile: (id: string, patch: Partial<Tile>) => Promise<void>;
  addTile: (tile: Tile) => Promise<void>;
  deleteTile: (id: string) => Promise<void>;
  setTiles: (tiles: Tile[]) => void;
  pushAcceptedTilesToQueue: (projectId: string) => Promise<void>;
  addDependency: (fromTileId: string, toTileId: string) => void;
  removeDependency: (fromTileId: string, toTileId: string) => void;
  autoScheduleProject: (projectId: string) => void;
}

export const useTilesStore = create<TilesState>()(
  // persist(
  (set, get) => ({
    tiles: [],
    tilesById: {},
    isLoading: false,
    isInitialized: false,
    error: null,

     initialize: async () => {
       console.warn("🚀 TilesStore: Starting initialization...");
       console.warn("🚀 TilesStore: Current state:", get());
       alert("TilesStore initialize called!");

       // Prevent multiple initializations but allow reload
       const currentState = get();
       if (currentState.isLoading) {
         console.warn("🔧 TilesStore: Already loading, skipping...");
         return;
       }

       if (currentState.isInitialized) {
         console.warn(
           "🔧 TilesStore: Already initialized, forcing reload from API..."
         );
         // Continue to reload fresh data instead of returning
       }

       console.warn("🔧 TilesStore: Setting loading state...");
       set({ isLoading: true, error: null });

      try {
        // DEMO MODE: Clear any cached tiles to ensure fresh data
        console.warn("🔧 TilesStore: Clearing cached tiles for demo mode...");
        try {
          localStorage.removeItem("fabmanage-tiles");
        } catch {
          console.warn(
            "🔧 TilesStore: localStorage not available, skipping cache clear"
          );
        }

        // Force refresh - always load fresh data for demo
        console.warn(
          "🔧 TilesStore: Force loading fresh tiles data for demo..."
        );
        // if (currentState.tiles.length > 0) {
        //     set({ isInitialized: true, isLoading: false })
        //     return
        // }

        // Simplified: just call API, httpClient handles all fallback logic
        console.warn("🔧 TilesStore: Calling listTiles()...");
        const data = await listTiles();
        console.warn("🔧 TilesStore INITIALIZED:", {
          tilesCount: data.length,
          tiles: data.map((t) => ({
            id: t.id,
            name: t.name,
            project: t.project,
          })),
        });
        set({
          tiles: data,
          tilesById: Object.fromEntries(data.map((t) => [t.id, t])),
          isInitialized: true,
          isLoading: false,
          error: null,
        });
        console.warn(
          "✅ TilesStore: Successfully initialized with",
          data.length,
          "tiles"
        );
      } catch (error) {
        console.error(
          "❌ TilesStore: Failed to initialize tiles store:",
          error
        );
        if (error && typeof error === "object") {
          const err = error as { message?: string; stack?: string };
          console.error(
            "❌ TilesStore: Error details:",
            err.message,
            err.stack
          );
        }
        set({ tiles: [], tilesById: {}, isInitialized: true });
      } finally {
        console.warn("🔧 TilesStore: Setting loading to false...");
        set({ isLoading: false });
      }
    },

    refresh: async () => {
      set({ isLoading: true });
      try {
        const data = await listTiles();
        set({
          tiles: data,
          tilesById: Object.fromEntries(data.map((t) => [t.id, t])),
        });
      } finally {
        set({ isLoading: false });
      }
    },

    setStatus: async (id: string, status: Tile["status"]) => {
      set((state) => {
        const currentTile = state.tilesById[id];
        if (!currentTile) return state;
        // Enforce allowed transitions
        if (!canTransitionTo(currentTile.status, status)) {
          return state;
        }

        const nextTiles = state.tiles.map((t) =>
          t.id === id ? { ...t, status } : t
        );
        const next = { ...state.tilesById };
        if (next[id]) next[id] = { ...next[id], status };

        // Sprawdź czy status jest produkcyjny i przetwórz BOM
        const productionStatuses: Tile["status"][] = [
          "W TRAKCIE CIĘCIA",
          "W produkcji CNC",
          "WYCIĘTE",
        ];
        if (productionStatuses.includes(status) && currentTile.bom) {
          // Uruchom przetwarzanie BOM asynchronicznie
          processBomForProduction(id, currentTile).catch((error) => {
            console.error("Błąd podczas przetwarzania BOM:", error);
          });
        }

        return { tiles: nextTiles, tilesById: next };
      });

      try {
        await sbUpdate(id, { status });
        showToast(`Zmieniono status kafelka ${id} → ${status}`, "success");
      } catch (error) {
        const { logger } = await import("../lib/logger");
        logger.error("Błąd podczas aktualizacji statusu:", error);
        showToast("Błąd zapisu statusu kafelka", "danger");
      }
    },

    updateTile: async (id: string, patch: Partial<Tile>) => {
      set((state) => {
        const current = state.tilesById[id];
        if (
          current &&
          patch.status &&
          !canTransitionTo(current.status, patch.status)
        ) {
          // block illegal transition in state
          const { status: _status, ...rest } = patch;
          patch = rest;
        }
        const nextTiles = state.tiles.map((t) =>
          t.id === id ? { ...t, ...patch } : t
        );
        const next = { ...state.tilesById };
        if (next[id]) next[id] = { ...next[id], ...patch };
        return { tiles: nextTiles, tilesById: next };
      });

      try {
        await sbUpdate(id, patch);
      } catch (error) {
        const { logger } = await import("../lib/logger");
        logger.error("Błąd podczas aktualizacji kafelka:", error);
      }
    },

    addTile: async (tile: Tile) => {
      set((state) => ({
        tiles: [...state.tiles, tile],
        tilesById: { ...state.tilesById, [tile.id]: tile },
      }));

      try {
        await sbCreate(tile);
        showToast("Kafelek dodany pomyślnie", "success");
      } catch (error) {
        const { logger } = await import("../lib/logger");
        logger.error("Błąd podczas dodawania kafelka:", error);
        showToast("Błąd podczas dodawania kafelka", "danger");
      }
    },

    deleteTile: async (id: string) => {
      set((state) => ({
        tiles: state.tiles.filter((t) => t.id !== id),
        tilesById: Object.fromEntries(
          Object.entries(state.tilesById).filter(([k]) => k !== id)
        ),
      }));
      try {
        await sbDelete(id);
        showToast("Kafelek usunięty", "success");
      } catch (error) {
        const { logger } = await import("../lib/logger");
        logger.error("Błąd podczas usuwania kafelka:", error);
        showToast("Błąd podczas usuwania kafelka", "danger");
      }
    },

    setTiles: (tiles: Tile[]) => {
      set({
        tiles,
        tilesById: Object.fromEntries(tiles.map((t) => [t.id, t])),
      });
    },

    pushAcceptedTilesToQueue: async (projectId: string) => {
      set((state) => ({
        tiles: state.tiles.map((t) =>
          t.project === projectId && t.status === "Zaakceptowane"
            ? { ...t, status: "W KOLEJCE" as Tile["status"] }
            : t
        ),
      }));

      try {
        // Update all accepted tiles for this project to 'W KOLEJCE'
        const acceptedTiles = useTilesStore
          .getState()
          .tiles.filter(
            (t) => t.project === projectId && t.status === "Zaakceptowane"
          );

        for (const tile of acceptedTiles) {
          await sbUpdate(tile.id, { status: "W KOLEJCE" });
        }

        if (acceptedTiles.length > 0) {
          showToast(
            `${acceptedTiles.length} zaakceptowanych elementów przeniesiono do kolejki produkcji`,
            "success"
          );
        }
      } catch (error) {
        const { logger } = await import("../lib/logger");
        logger.error("Błąd podczas przenoszenia elementów do kolejki:", error);
        showToast("Błąd podczas przenoszenia elementów do kolejki", "danger");
      }
    },
    addDependency: (fromTileId: string, toTileId: string) => {
      set((state) => {
        const t = state.tilesById[fromTileId];
        if (!t) return state;
        const deps = new Set<string>(
          Array.isArray((t as any).dependencies)
            ? (t as any).dependencies
            : (t as any).dependencies
            ? [(t as any).dependencies]
            : []
        );
        deps.add(toTileId);
        const patch: Partial<Tile> = {
          ...(t as any),
          dependencies: Array.from(deps) as any,
        };
        const tiles = state.tiles.map((x) =>
          x.id === fromTileId ? { ...x, ...(patch as any) } : x
        );
        const tilesById = {
          ...state.tilesById,
          [fromTileId]: { ...state.tilesById[fromTileId], ...(patch as any) },
        };
        return { tiles, tilesById };
      });
    },
    removeDependency: (fromTileId: string, toTileId: string) => {
      set((state) => {
        const t = state.tilesById[fromTileId];
        if (!t) return state;
        const list: string[] = Array.isArray((t as any).dependencies)
          ? (t as any).dependencies
          : (t as any).dependencies
          ? [(t as any).dependencies]
          : [];
        const next = list.filter((id) => id !== toTileId);
        const patch: Partial<Tile> = {
          ...(t as any),
          dependencies: next as any,
        };
        const tiles = state.tiles.map((x) =>
          x.id === fromTileId ? { ...x, ...(patch as any) } : x
        );
        const tilesById = {
          ...state.tilesById,
          [fromTileId]: { ...state.tilesById[fromTileId], ...(patch as any) },
        };
        return { tiles, tilesById };
      });
    },
    autoScheduleProject: (projectId: string) => {
      set((state) => {
        // Topological-like ordering based on dependencies
        const tiles = state.tiles.filter((t) => t.project === projectId);
        const idToTile = Object.fromEntries(
          tiles.map((t) => [t.id, t])
        ) as Record<string, Tile>;
        const depsMap = new Map<string, Set<string>>();
        tiles.forEach((t) => {
          const deps: string[] = Array.isArray((t as any).dependencies)
            ? (t as any).dependencies
            : (t as any).dependencies
            ? [(t as any).dependencies]
            : [];
          depsMap.set(t.id, new Set(deps.filter((id) => idToTile[id])));
        });
        const visited = new Set<string>();
        const order: string[] = [];
        const temp = new Set<string>();
        const dfs = (id: string) => {
          if (visited.has(id)) return;
          if (temp.has(id)) {
            return;
          } // cycle; ignore
          temp.add(id);
          const deps = depsMap.get(id);
          if (deps) deps.forEach((d) => dfs(d));
          temp.delete(id);
          visited.add(id);
          order.push(id);
        };
        tiles.forEach((t) => dfs(t.id));

        // Assign dates: if no deps, today; else max(deps)+1 day
        const msPerDay = 24 * 3600 * 1000;
        const today = new Date();
        const assigned = new Map<string, string>();
        for (const id of order) {
          const deps = depsMap.get(id);
          if (!deps || deps.size === 0) {
            assigned.set(id, today.toISOString().slice(0, 10));
          } else {
            let maxDate = today;
            deps.forEach((did) => {
              const d = assigned.get(did);
              if (d) {
                const dt = new Date(d);
                if (dt > maxDate) maxDate = dt;
              }
            });
            const next = new Date(maxDate.getTime() + msPerDay);
            assigned.set(id, next.toISOString().slice(0, 10));
          }
        }

        const nextTiles = state.tiles.map((t) =>
          t.project === projectId && assigned.has(t.id)
            ? { ...t, termin: assigned.get(t.id)! }
            : t
        );
        const nextById = { ...state.tilesById };
        assigned.forEach((date, id) => {
          if (nextById[id]) nextById[id] = { ...nextById[id], termin: date };
        });
        showToast(
          "Auto-planowanie ukończone (zależności uwzględnione)",
          "success"
        );
        return { tiles: nextTiles, tilesById: nextById };
      });
    },
  })
);

// realtime is handled via lib/realtime in onRehydrateStorage

// Funkcja do przetwarzania BOM przy zmianie statusu na produkcyjny
async function processBomForProduction(tileId: string, tile: Tile) {
  if (!tile.bom || !tile.project) return;

  try {
    // Import materialsStore dynamicznie, aby uniknąć circular dependencies
    const { useMaterialsStore } = await import("./materialsStore");
    const materialsStore = useMaterialsStore.getState();

    for (const bomItem of tile.bom) {
      if (!bomItem.materialId) continue;

      // Sprawdź dostępność materiału w magazynie
      const material = materialsStore.materials.find(
        (m) => m.id === bomItem.materialId
      );
      if (!material) {
        // Materiał nie istnieje w magazynie - utwórz zapotrzebowanie
        const purchaseRequest: import("./materialsStore").PurchaseRequest = {
          id: `pr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          projectId: tile.project!,
          materialId: bomItem.materialId,
          materialName: bomItem.name,
          quantity: bomItem.quantity,
          unit: bomItem.unit,
          requestedBy: "System",
          requestedAt: Date.now(),
          status: "pending",
          priority:
            tile.priority === "high"
              ? "high"
              : tile.priority === "medium"
              ? "medium"
              : "low",
          notes: `Automatyczne zapotrzebowanie dla kafelka: ${tile.name} (${tileId})`,
        };

        materialsStore.addPurchaseRequest(purchaseRequest);
        showToast(
          `Utworzono zapotrzebowanie na materiał: ${bomItem.name}`,
          "warning"
        );
        continue;
      }

      // Sprawdź czy materiał jest dostępny w wystarczającej ilości
      const availableQuantity = material.stock || 0;
      if (availableQuantity >= bomItem.quantity) {
        // Materiał dostępny - utwórz rezerwację
        const reservation: import("./materialsStore").StockReservation = {
          id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          projectId: tile.project!,
          materialId: bomItem.materialId,
          materialName: bomItem.name,
          quantity: bomItem.quantity,
          unit: bomItem.unit,
          reservedAt: Date.now(),
          reservedBy: "System",
          status: "reserved",
        };

        materialsStore.addStockReservation(reservation);

        // Zmniejsz dostępną ilość w magazynie
        materialsStore.updateMaterialStock(
          bomItem.materialId,
          availableQuantity - bomItem.quantity
        );

        showToast(
          `Zarezerwowano materiał: ${bomItem.name} (${bomItem.quantity} ${bomItem.unit})`,
          "success"
        );
      } else {
        // Materiał niedostępny - utwórz zapotrzebowanie
        const neededQuantity = bomItem.quantity - availableQuantity;
        const purchaseRequest: import("./materialsStore").PurchaseRequest = {
          id: `pr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          projectId: tile.project!,
          materialId: bomItem.materialId,
          materialName: bomItem.name,
          quantity: neededQuantity,
          unit: bomItem.unit,
          requestedBy: "System",
          requestedAt: Date.now(),
          status: "pending",
          priority:
            tile.priority === "high"
              ? "high"
              : tile.priority === "medium"
              ? "medium"
              : "low",
          notes: `Automatyczne zapotrzebowanie dla kafelka: ${tile.name} (${tileId}). Dostępne: ${availableQuantity} ${bomItem.unit}, potrzebne: ${bomItem.quantity} ${bomItem.unit}`,
        };

        materialsStore.addPurchaseRequest(purchaseRequest);
        showToast(
          `Utworzono zapotrzebowanie na materiał: ${bomItem.name} (brakuje ${neededQuantity} ${bomItem.unit})`,
          "warning"
        );
      }
    }
  } catch (error) {
    const { logger } = await import("../lib/logger");
    logger.error("Błąd podczas przetwarzania BOM:", error);
    showToast("Błąd podczas przetwarzania listy materiałów", "danger");
  }
}
