import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// import { isSupabaseConfigured } from '../lib/supabase'
import { listTiles, updateTile as sbUpdate, createTile as sbCreate, deleteTile as sbDelete } from '../services/tiles'
import { canTransitionTo } from '../lib/statusUtils'
import { showToast } from '../lib/notifications'
import { subscribeTable } from '../lib/realtime'
import { config } from '../lib/config'

export type BomItem = {
    id: string
    type: 'Materiał surowy' | 'Komponent gotowy' | 'Usługa'
    name: string
    quantity: number
    unit: string
    supplier?: string
    status?: 'Na stanie' | 'Do zamówienia' | 'Zamówione'
    unitCost?: number
    materialId?: string
}

export type Tile = {
    id: string
    name: string
    status: 'W KOLEJCE' | 'W TRAKCIE CIĘCIA' | 'WYCIĘTE' | 'Projektowanie' | 'W trakcie projektowania' | 'Do akceptacji' | 'Zaakceptowane' | 'Wymagają poprawek' | 'Gotowy do montażu' | 'Wstrzymany' | 'Zakończony' | 'W produkcji CNC'
    project?: string
    moduł_nadrzędny?: string // np. "Scena Główna"
    opis?: string
    link_model_3d?: string
    załączniki?: string[] // URLs do plików
    przypisany_projektant?: string
    termin?: string
    priority?: 'Wysoki' | 'Średni' | 'Niski' // deprecated - priorytet zarządzany w module Działu Projektowego
    technology?: string // deprecated - usunięte zgodnie z redesignem
    bom?: BomItem[]
    laborCost?: number
    assignee?: string // deprecated, use przypisany_projektant
    dxfFile?: string | null
    assemblyDrawing?: string | null
    group?: string
}

// Zasilanie kafelków danymi z mockDatabase

interface TilesState {
    tiles: Tile[]
    tilesById: Record<string, Tile>
    isLoading: boolean
    isInitialized: boolean

    // Actions
    initialize: () => Promise<void>
    refresh: () => Promise<void>
    setStatus: (id: string, status: Tile['status']) => Promise<void>
    updateTile: (id: string, patch: Partial<Tile>) => Promise<void>
    addTile: (tile: Tile) => Promise<void>
    deleteTile: (id: string) => Promise<void>
    setTiles: (tiles: Tile[]) => void
    pushAcceptedTilesToQueue: (projectId: string) => Promise<void>
}

export const useTilesStore = create<TilesState>()(
    persist(
        (set) => ({
            tiles: [],
            tilesById: {},
            isLoading: false,
            isInitialized: false,

            initialize: async () => {
                set({ isLoading: true })

                try {
                    // If we already have tiles (e.g., from persisted storage), treat as initialized
                    if (useTilesStore.getState().tiles.length > 0) {
                        set({ isInitialized: true })
                        return
                    }
                    const data = await listTiles()
                    if (data.length > 0) {
                        set({ tiles: data, tilesById: Object.fromEntries(data.map(t => [t.id, t])), isInitialized: true })
                    } else if (config.useMockData) {
                        // If database is empty and mock data is enabled, use mock tiles
                        const { mockTiles } = await import('../data/development')
                        set({ tiles: mockTiles, tilesById: Object.fromEntries(mockTiles.map(t => [t.id, t])), isInitialized: true })
                    } else {
                        // No data available and mock data disabled
                        set({ tiles: [], tilesById: {}, isInitialized: true })
                    }
                } catch (error) {
                    const { logger } = await import('../lib/logger')
                    logger.error('Błąd podczas ładowania kafelków:', error)
                    // Fallback to mock tiles only if enabled
                    if (config.useMockData) {
                        const { mockTiles } = await import('../data/development')
                        set({ tiles: mockTiles, tilesById: Object.fromEntries(mockTiles.map(t => [t.id, t])), isInitialized: true })
                    } else {
                        set({ tiles: [], tilesById: {}, isInitialized: true })
                    }
                } finally {
                    set({ isLoading: false })
                }
            },

            refresh: async () => {
                set({ isLoading: true })
                try {
                    const data = await listTiles()
                    set({ tiles: data, tilesById: Object.fromEntries(data.map(t => [t.id, t])) })
                } finally {
                    set({ isLoading: false })
                }
            },

            setStatus: async (id: string, status: Tile['status']) => {
                set(state => {
                    const currentTile = state.tilesById[id]
                    if (!currentTile) return state
                    // Enforce allowed transitions
                    if (!canTransitionTo(currentTile.status, status)) {
                        return state
                    }

                    const nextTiles = state.tiles.map(t => t.id === id ? { ...t, status } : t)
                    const next = { ...state.tilesById }
                    if (next[id]) next[id] = { ...next[id], status }

                    // Sprawdź czy status jest produkcyjny i przetwórz BOM
                    const productionStatuses: Tile['status'][] = ['W TRAKCIE CIĘCIA', 'W produkcji CNC', 'WYCIĘTE']
                    if (productionStatuses.includes(status) && currentTile.bom) {
                        // Uruchom przetwarzanie BOM asynchronicznie
                        processBomForProduction(id, currentTile).catch(error => {
                            console.error('Błąd podczas przetwarzania BOM:', error)
                        })
                    }

                    return { tiles: nextTiles, tilesById: next }
                })

                try {
                    await sbUpdate(id, { status })
                    showToast(`Zmieniono status kafelka ${id} → ${status}`, 'success')
                } catch (error) {
                    const { logger } = await import('../lib/logger')
                    logger.error('Błąd podczas aktualizacji statusu:', error)
                    showToast('Błąd zapisu statusu kafelka', 'danger')
                }
            },

            updateTile: async (id: string, patch: Partial<Tile>) => {
                set(state => {
                    const current = state.tilesById[id]
                    if (current && patch.status && !canTransitionTo(current.status, patch.status)) {
                        // block illegal transition in state
                        const { status, ...rest } = patch
                        patch = rest
                    }
                    const nextTiles = state.tiles.map(t => t.id === id ? { ...t, ...patch } : t)
                    const next = { ...state.tilesById }
                    if (next[id]) next[id] = { ...next[id], ...patch }
                    return { tiles: nextTiles, tilesById: next }
                })

                try {
                    await sbUpdate(id, patch)
                } catch (error) {
                    const { logger } = await import('../lib/logger')
                    logger.error('Błąd podczas aktualizacji kafelka:', error)
                }
            },

            addTile: async (tile: Tile) => {
                set(state => ({ tiles: [...state.tiles, tile], tilesById: { ...state.tilesById, [tile.id]: tile } }))

                try {
                    await sbCreate(tile)
                    showToast('Kafelek dodany pomyślnie', 'success')
                } catch (error) {
                    const { logger } = await import('../lib/logger')
                    logger.error('Błąd podczas dodawania kafelka:', error)
                    showToast('Błąd podczas dodawania kafelka', 'danger')
                }
            },

            deleteTile: async (id: string) => {
                set(state => ({ tiles: state.tiles.filter(t => t.id !== id), tilesById: Object.fromEntries(Object.entries(state.tilesById).filter(([k]) => k !== id)) }))
                try {
                    await sbDelete(id)
                    showToast('Kafelek usunięty', 'success')
                } catch (error) {
                    const { logger } = await import('../lib/logger')
                    logger.error('Błąd podczas usuwania kafelka:', error)
                    showToast('Błąd podczas usuwania kafelka', 'danger')
                }
            },

            setTiles: (tiles: Tile[]) => {
                set({ tiles, tilesById: Object.fromEntries(tiles.map(t => [t.id, t])) })
            },

            pushAcceptedTilesToQueue: async (projectId: string) => {
                set(state => ({
                    tiles: state.tiles.map(t =>
                        t.project === projectId && t.status === 'Zaakceptowane'
                            ? { ...t, status: 'W KOLEJCE' as Tile['status'] }
                            : t
                    )
                }))

                try {
                    // Update all accepted tiles for this project to 'W KOLEJCE'
                    const acceptedTiles = useTilesStore.getState().tiles.filter(
                        t => t.project === projectId && t.status === 'Zaakceptowane'
                    )

                    for (const tile of acceptedTiles) {
                        await sbUpdate(tile.id, { status: 'W KOLEJCE' })
                    }

                    if (acceptedTiles.length > 0) {
                        showToast(`${acceptedTiles.length} zaakceptowanych elementów przeniesiono do kolejki produkcji`, 'success')
                    }
                } catch (error) {
                    const { logger } = await import('../lib/logger')
                    logger.error('Błąd podczas przenoszenia elementów do kolejki:', error)
                    showToast('Błąd podczas przenoszenia elementów do kolejki', 'danger')
                }
            }
        }),
        {
            name: 'fabmanage-tiles',
            // Persist both tiles and isInitialized to avoid re-running initialize over saved tiles
            partialize: (state) => ({ tiles: state.tiles, isInitialized: state.isInitialized }),
            onRehydrateStorage: () => (state) => {
                if (!state) return
                // If tiles were restored, mark as initialized and skip initialization
                if (state.tiles && state.tiles.length > 0) {
                    state.isInitialized = true
                    state.tilesById = Object.fromEntries(state.tiles.map(t => [t.id, t]))
                    return
                }
                if (!state.isInitialized) {
                    state.initialize()
                }
                // subscribe realtime
                const unsubscribe = subscribeTable<Tile>('tiles', (rows) => {
                    const map = { ...state.tilesById }
                    rows.forEach(r => { map[r.id] = r })
                    state.setTiles(Object.values(map))
                }, (ids) => {
                    const map = { ...state.tilesById }
                    ids.forEach(id => { delete map[id] })
                    state.setTiles(Object.values(map))
                })
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ; (state as any)._unsubscribeTiles = unsubscribe
            }
        }
    )
)

// realtime is handled via lib/realtime in onRehydrateStorage

// Funkcja do przetwarzania BOM przy zmianie statusu na produkcyjny
async function processBomForProduction(tileId: string, tile: Tile) {
    if (!tile.bom || !tile.project) return

    try {
        // Import materialsStore dynamicznie, aby uniknąć circular dependencies
        const { useMaterialsStore } = await import('./materialsStore')
        const materialsStore = useMaterialsStore.getState()

        for (const bomItem of tile.bom) {
            if (!bomItem.materialId) continue

            // Sprawdź dostępność materiału w magazynie
            const material = materialsStore.materials.find(m => m.id === bomItem.materialId)
            if (!material) {
                // Materiał nie istnieje w magazynie - utwórz zapotrzebowanie
                const purchaseRequest: import('./materialsStore').PurchaseRequest = {
                    id: `pr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    projectId: tile.project!,
                    materialId: bomItem.materialId,
                    materialName: bomItem.name,
                    quantity: bomItem.quantity,
                    unit: bomItem.unit,
                    requestedBy: 'System',
                    requestedAt: Date.now(),
                    status: 'pending',
                    priority: tile.priority === 'Wysoki' ? 'high' : tile.priority === 'Średni' ? 'medium' : 'low',
                    notes: `Automatyczne zapotrzebowanie dla kafelka: ${tile.name} (${tileId})`
                }

                materialsStore.addPurchaseRequest(purchaseRequest)
                showToast(`Utworzono zapotrzebowanie na materiał: ${bomItem.name}`, 'warning')
                continue
            }

            // Sprawdź czy materiał jest dostępny w wystarczającej ilości
            const availableQuantity = material.stock || 0
            if (availableQuantity >= bomItem.quantity) {
                // Materiał dostępny - utwórz rezerwację
                const reservation: import('./materialsStore').StockReservation = {
                    id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    projectId: tile.project!,
                    materialId: bomItem.materialId,
                    materialName: bomItem.name,
                    quantity: bomItem.quantity,
                    unit: bomItem.unit,
                    reservedAt: Date.now(),
                    reservedBy: 'System',
                    status: 'reserved'
                }

                materialsStore.addStockReservation(reservation)

                // Zmniejsz dostępną ilość w magazynie
                materialsStore.updateMaterialStock(bomItem.materialId, availableQuantity - bomItem.quantity)

                showToast(`Zarezerwowano materiał: ${bomItem.name} (${bomItem.quantity} ${bomItem.unit})`, 'success')
            } else {
                // Materiał niedostępny - utwórz zapotrzebowanie
                const neededQuantity = bomItem.quantity - availableQuantity
                const purchaseRequest: import('./materialsStore').PurchaseRequest = {
                    id: `pr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    projectId: tile.project!,
                    materialId: bomItem.materialId,
                    materialName: bomItem.name,
                    quantity: neededQuantity,
                    unit: bomItem.unit,
                    requestedBy: 'System',
                    requestedAt: Date.now(),
                    status: 'pending',
                    priority: tile.priority === 'Wysoki' ? 'high' : tile.priority === 'Średni' ? 'medium' : 'low',
                    notes: `Automatyczne zapotrzebowanie dla kafelka: ${tile.name} (${tileId}). Dostępne: ${availableQuantity} ${bomItem.unit}, potrzebne: ${bomItem.quantity} ${bomItem.unit}`
                }

                materialsStore.addPurchaseRequest(purchaseRequest)
                showToast(`Utworzono zapotrzebowanie na materiał: ${bomItem.name} (brakuje ${neededQuantity} ${bomItem.unit})`, 'warning')
            }
        }
    } catch (error) {
        const { logger } = await import('../lib/logger')
        logger.error('Błąd podczas przetwarzania BOM:', error)
        showToast('Błąd podczas przetwarzania listy materiałów', 'danger')
    }
}
