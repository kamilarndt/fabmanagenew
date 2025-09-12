import { api } from '../lib/httpClient'
import type { Tile } from '../types/tiles.types'
import { TileSchema } from '../lib/validation'

function mapBackendTileToUi(row: Record<string, unknown>): Tile {
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
        id: String(row.id || ''),
        name: String(row.name || ''),
        status,
        project: row.project_id ? String(row.project_id) : row.project ? String(row.project) : undefined,
        opis: row.description ? String(row.description) : row.opis ? String(row.opis) : undefined,
        link_model_3d: row.link_model_3d ? String(row.link_model_3d) : undefined,
        speckle_object_ids: Array.isArray(row.speckle_object_ids) ? row.speckle_object_ids.map(String) : undefined,
        załączniki: Array.isArray(row.attachments) ? row.attachments.map(String) : Array.isArray(row.załączniki) ? row.załączniki.map(String) : undefined,
        przypisany_projektant: row.assignee ? String(row.assignee) : row.przypisany_projektant ? String(row.przypisany_projektant) : undefined,
        termin: row.termin ? String(row.termin) : undefined,
        priority: (row.priority as any) || 'Średni',
        bom: Array.isArray(row.bom) ? row.bom : [],
        laborCost: typeof row.laborCost === 'number' ? row.laborCost : 0,
        dxfFile: row.dxfFile ? String(row.dxfFile) : null,
        assemblyDrawing: row.assemblyDrawing ? String(row.assemblyDrawing) : null,
        group: row.group ? String(row.group) : undefined
    }
    return TileSchema.parse(tile) as Tile
}

export async function listTiles(): Promise<Tile[]> {
    console.warn('🔧 listTiles: Starting tiles API call...')
    try {
        const data = await api.call<any[]>('/api/tiles', {
            method: 'GET',
            table: 'tiles',
            statusTransform: false
        })
        console.warn('🔧 listTiles: Received data:', { count: data.length, sample: data[0] })
        return (data as Record<string, unknown>[]).map((d: Record<string, unknown>) => {
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


