import { api } from '../lib/httpClient'
import type { Tile } from '../types/tiles.types'
import { TileSchema } from '../lib/validation'

function mapBackendTileToUi(row: any): Tile {
    const stage = String(row.stage || '').toLowerCase()
    let status: Tile['status'] = 'Do akceptacji'
    switch (stage) {
        case 'design': status = 'Projektowanie'; break
        case 'cnc':
        case 'finishing':
        case 'assembly':
        case 'qc': status = 'W produkcji CNC'; break
        case 'done': status = 'Gotowy do montażu'; break
        default: status = 'Do akceptacji'
    }
    const tile: Partial<Tile> = {
        id: row.id,
        name: row.name,
        status,
        project: row.project_id || row.project || undefined,
        opis: row.description || row.opis,
        link_model_3d: row.link_model_3d,
        speckle_object_ids: row.speckle_object_ids,
        załączniki: row.attachments || row.załączniki,
        przypisany_projektant: row.assignee || row.przypisany_projektant,
        termin: row.termin || null,
        priority: (row.priority as any) || 'Średni',
        bom: Array.isArray(row.bom) ? row.bom : [],
        laborCost: row.laborCost || 0,
        dxfFile: row.dxfFile ?? null,
        assemblyDrawing: row.assemblyDrawing ?? null,
        group: row.group || undefined
    }
    return TileSchema.parse(tile) as Tile
}

export async function listTiles(): Promise<Tile[]> {
    console.log('🔧 listTiles: Starting tiles API call...')
    try {
        const data = await api.call<any[]>('/api/tiles', {
            method: 'GET',
            table: 'tiles',
            statusTransform: false
        })
        console.log('🔧 listTiles: Received data:', { count: data.length, sample: data[0] })
        return (data as any[]).map((d: any) => {
            // Accept both UI-ready and raw backend shape
            if (d && typeof d.status === 'string') {
                return TileSchema.parse(d) as Tile
            }
            return mapBackendTileToUi(d)
        })
    } catch (error) {
        console.error('🔧 listTiles: Error loading tiles:', error)
        throw error
    }
}

export async function createTile(t: Omit<Tile, 'id'> & { id?: string }): Promise<Tile | null> {
    const payload = {
        ...t,
        project: (t as any).projectId || (t as any).project_id || (t as any).project
    }

    const data = await api.call<any>('/api/tiles', {
        method: 'POST',
        data: payload,
        table: 'tiles',
        statusTransform: false
    })
    if (!data) return null
    return (data && typeof data.status === 'string') ? (TileSchema.parse(data) as Tile) : mapBackendTileToUi(data)
}

export async function createTileFromSelection(projectId: string, selectionIds: string[], name?: string): Promise<Tile | null> {
    const data = await api.call<any>('/api/tiles/from-selection', {
        method: 'POST',
        data: { project_id: projectId, selectionIds, name },
        table: 'tiles',
        useSupabase: false,
        statusTransform: false
    })
    return data ? ((typeof data.status === 'string') ? (TileSchema.parse(data) as Tile) : mapBackendTileToUi(data)) : null
}

export async function updateTile(id: string, patch: Partial<Tile>): Promise<void> {
    await api.call(`/api/tiles/${id}`, {
        method: 'PUT',
        data: { ...patch, id },
        table: 'tiles',
        statusTransform: false
    })
}

export async function deleteTile(id: string): Promise<void> {
    await api.call(`/api/tiles/${id}`, {
        method: 'DELETE',
        data: { id },
        table: 'tiles'
    })
}


