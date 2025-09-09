import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Tile } from '../types/tiles.types'
import { TileSchema } from '../lib/validation'
import { toBackendTileStatus, toUiTileStatus } from '../lib/statusUtils'

const table = 'tiles'

export async function listTiles(): Promise<Tile[]> {
    if (!isSupabaseConfigured) {
        // Fallback to local backend
        const res = await fetch('/api/tiles');
        if (!res.ok) throw new Error('Failed to fetch tiles');
        const data = await res.json();
        return (data as any[]).map(t => ({
            ...t,
            status: t?.status ? toUiTileStatus(t.status) : t?.status
        })) as Tile[];
    }
    const { data, error } = await supabase.from(table).select('*').order('id')
    if (error) throw error
    const parsed = (data ?? []).map((d: any) => TileSchema.parse({
        ...d,
        status: d?.status ? toUiTileStatus(d.status) : d?.status
    }))
    return parsed as Tile[]
}

export async function createTile(t: Omit<Tile, 'id'> & { id?: string }): Promise<Tile | null> {
    if (!isSupabaseConfigured) {
        const payload = { ...t, project: (t as any).projectId || (t as any).project_id || (t as any).project, status: t.status ? toBackendTileStatus(t.status) : t.status }
        const res = await fetch('/api/tiles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Failed to create tile');
        const data = await res.json();
        return data ? ({ ...data, status: data?.status ? toUiTileStatus(data.status) : data?.status } as Tile) : null;
    }
    const payload = { ...t, status: t.status ? toBackendTileStatus(t.status) : t.status }
    const { data, error } = await supabase.from(table).insert(payload).select().single()
    if (error) throw error
    return data ? (TileSchema.parse({ ...data, status: (data as any)?.status ? toUiTileStatus((data as any).status) : (data as any)?.status }) as Tile) : null
}

export async function updateTile(id: string, patch: Partial<Tile>): Promise<void> {
    if (!isSupabaseConfigured) {
        const payload = { ...patch, status: patch.status ? toBackendTileStatus(patch.status) : patch.status }
        const res = await fetch(`/api/tiles/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Failed to update tile');
        return
    }
    const payload = { ...patch, status: patch.status ? toBackendTileStatus(patch.status) : patch.status }
    const { error } = await supabase.from(table).update(payload).eq('id', id)
    if (error) throw error
}

export async function deleteTile(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
        const res = await fetch(`/api/tiles/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete tile');
        return
    }
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
}


