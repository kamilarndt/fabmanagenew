import { api } from '../lib/httpClient'
import type { Tile } from '../types/tiles.types'
import { TileSchema } from '../lib/validation'


export async function listTiles(): Promise<Tile[]> {
    const data = await api.call<any[]>('/api/tiles', {
        method: 'GET',
        table: 'tiles',
        statusTransform: true
    })

    return data.map((d: any) => TileSchema.parse(d)) as Tile[]
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
        statusTransform: true
    })

    return data ? (TileSchema.parse(data) as Tile) : null
}

export async function updateTile(id: string, patch: Partial<Tile>): Promise<void> {
    await api.call(`/api/tiles/${id}`, {
        method: 'PUT',
        data: { ...patch, id },
        table: 'tiles',
        statusTransform: true
    })
}

export async function deleteTile(id: string): Promise<void> {
    await api.call(`/api/tiles/${id}`, {
        method: 'DELETE',
        data: { id },
        table: 'tiles'
    })
}


