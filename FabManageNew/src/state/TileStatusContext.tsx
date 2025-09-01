import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { listTiles, updateTile as sbUpdate, createTile as sbCreate } from '../services/tiles'
import { showToast } from '../lib/toast'

export type BomItem = {
    id: string
    type: 'Materiał surowy' | 'Komponent gotowy' | 'Usługa'
    name: string
    quantity: number
    unit: string
    supplier?: string
    status?: 'Na stanie' | 'Do zamówienia' | 'Zamówione'
    unitCost?: number
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

type TileStatusContextType = {
    tiles: Tile[]
    setStatus: (id: string, status: Tile['status']) => void
    updateTile: (id: string, patch: Partial<Tile>) => void
    addTile: (tile: Tile) => void
}

const TileStatusContext = createContext<TileStatusContextType | undefined>(undefined)

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

export function TileStatusProvider({ children }: { children: React.ReactNode }) {
    const [tiles, setTiles] = useState<Tile[]>(demoTiles)

    useEffect(() => {
        (async () => {
            if (!isSupabaseConfigured) return
            try {
                const data = await listTiles()
                if (data.length) setTiles(data)
            } catch { }
        })()
    }, [])

    useEffect(() => {
        if (!isSupabaseConfigured) return
        const channel = supabase.channel('tiles-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tiles' }, async () => {
                try {
                    const data = await listTiles()
                    if (data) setTiles(data)
                } catch { }
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [])

    const setStatus = async (id: string, status: Tile['status']) => {
        setTiles(prev => prev.map(t => (t.id === id ? { ...t, status } : t)))
        try {
            await sbUpdate(id, { status })
            showToast(`Zmieniono status kafelka ${id} → ${status}`, 'success')
        } catch {
            showToast('Błąd zapisu statusu kafelka', 'danger')
        }
    }

    const updateTile = async (id: string, patch: Partial<Tile>) => {
        setTiles(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)))
        try { await sbUpdate(id, patch as any) } catch { }
    }

    const addTile = async (tile: Tile) => {
        setTiles(prev => [...prev, tile])
        try {
            await sbCreate(tile)
            showToast('Kafelek dodany pomyślnie', 'success')
        } catch (error) {
            console.error('Błąd podczas dodawania kafelka:', error)
            showToast('Błąd podczas dodawania kafelka', 'danger')
        }
    }

    const value = useMemo(() => ({ tiles, setStatus, updateTile, addTile }), [tiles])
    return <TileStatusContext.Provider value={value}>{children}</TileStatusContext.Provider>
}

export function useTileStatus() {
    const ctx = useContext(TileStatusContext)
    if (!ctx) throw new Error('useTileStatus must be used within TileStatusProvider')
    return ctx
}


