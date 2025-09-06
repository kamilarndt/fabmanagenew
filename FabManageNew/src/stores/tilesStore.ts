import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isSupabaseConfigured } from '../lib/supabase'
import { listTiles, updateTile as sbUpdate, createTile as sbCreate } from '../services/tiles'
import { showToast } from '../lib/toast'
import { subscribeTable } from '../lib/realtime'

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
    status: 'W KOLEJCE' | 'W TRAKCIE CIĘCIA' | 'WYCIĘTE' | 'Projektowanie' | 'W trakcie projektowania' | 'Do akceptacji' | 'Zaakceptowane' | 'Wymagają poprawek' | 'Gotowy do montażu'
    project?: string
    priority?: 'Wysoki' | 'Średni' | 'Niski'
    technology?: string
    bom?: BomItem[]
    laborCost?: number
    assignee?: string
    dxfFile?: string | null
    assemblyDrawing?: string | null
    group?: string
}

const demoTiles: Tile[] = [
    {
        id: 'T-001', name: 'PUPITRE JEAN-LUC', status: 'W KOLEJCE', project: 'P-001', priority: 'Wysoki', technology: 'Frezowanie CNC', laborCost: 180, assignee: 'Anna', dxfFile: null, assemblyDrawing: null,
        bom: [
            { id: 'B-1', type: 'Materiał surowy', name: 'MDF 18mm', quantity: 2, unit: 'ark', status: 'Na stanie', unitCost: 120 },
            { id: 'B-2', type: 'Materiał surowy', name: 'Laminat HPL biały', quantity: 3, unit: 'm²', status: 'Do zamówienia', unitCost: 45 },
            { id: 'B-3', type: 'Komponent gotowy', name: 'Profil LED GS-PLAT-1616', quantity: 5, unit: 'mb', supplier: 'LEDCo', status: 'Na stanie', unitCost: 25 },
            { id: 'B-4', type: 'Komponent gotowy', name: 'Zasilacz LED 24V', quantity: 1, unit: 'szt', supplier: 'MeanWell', status: 'Zamówione', unitCost: 95 },
            { id: 'B-5', type: 'Usługa', name: 'Lakierowanie krawędzi', quantity: 1, unit: 'usł', status: 'Do zamówienia', unitCost: 60 },
        ]
    },
    {
        id: 'T-002', name: 'Stelaż LED', status: 'W TRAKCIE CIĘCIA', project: 'P-001', priority: 'Średni', technology: 'Cięcie profili', laborCost: 90, assignee: 'Paweł', dxfFile: null, assemblyDrawing: null,
        bom: [{ id: 'B-6', type: 'Materiał surowy', name: 'Aluminium 2mm', quantity: 1, unit: 'ark', status: 'Na stanie', unitCost: 150 }]
    },
    {
        id: 'T-003', name: 'Płyta tylna', status: 'WYCIĘTE', project: 'P-003', priority: 'Niski', technology: 'Frezowanie CNC', laborCost: 40, assignee: 'Ola', dxfFile: null, assemblyDrawing: null,
        bom: [{ id: 'B-7', type: 'Materiał surowy', name: 'MDF 12mm', quantity: 1, unit: 'ark', status: 'Na stanie', unitCost: 85 }]
    }
]

interface TilesState {
    tiles: Tile[]
    tilesById: Record<string, Tile>
    isLoading: boolean
    isInitialized: boolean

    // Actions
    initialize: () => Promise<void>
    setStatus: (id: string, status: Tile['status']) => Promise<void>
    updateTile: (id: string, patch: Partial<Tile>) => Promise<void>
    addTile: (tile: Tile) => Promise<void>
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
                    } else {
                        // If database is empty, use demo tiles
                        set({ tiles: demoTiles, tilesById: Object.fromEntries(demoTiles.map(t => [t.id, t])), isInitialized: true })
                    }
                } catch (error) {
                    const { logger } = await import('../lib/logger')
                    logger.error('Błąd podczas ładowania kafelków:', error)
                    // Fallback to demo tiles
                    set({ tiles: demoTiles, isInitialized: true })
                } finally {
                    set({ isLoading: false })
                }
            },

            setStatus: async (id: string, status: Tile['status']) => {
                set(state => {
                    const nextTiles = state.tiles.map(t => t.id === id ? { ...t, status } : t)
                    const next = { ...state.tilesById }
                    if (next[id]) next[id] = { ...next[id], status }
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
