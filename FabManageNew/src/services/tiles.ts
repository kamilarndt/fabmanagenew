import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Tile } from '../stores/tilesStore'
import { TileSchema } from '../lib/validation'

const table = 'tiles'

export async function listTiles(): Promise<Tile[]> {
    if (!isSupabaseConfigured) {
        // Fallback to local backend
        const res = await fetch('/api/tiles');
        if (!res.ok) throw new Error('Failed to fetch tiles');
        const data = await res.json();
        return data as Tile[];
    }
    const { data, error } = await supabase.from(table).select('*').order('id')
    if (error) throw error
    const parsed = (data ?? []).map((d: unknown) => TileSchema.parse(d))
    return parsed as Tile[]
}

export async function createTile(t: Omit<Tile, 'id'> & { id?: string }): Promise<Tile | null> {
    if (!isSupabaseConfigured) {
        const res = await fetch('/api/tiles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(t) });
        if (!res.ok) throw new Error('Failed to create tile');
        const data = await res.json();
        return data as Tile;
    }
    const { data, error } = await supabase.from(table).insert(t).select().single()
    if (error) throw error
    return data ? (TileSchema.parse(data) as Tile) : null
}

export async function updateTile(id: string, patch: Partial<Tile>): Promise<void> {
    if (!isSupabaseConfigured) {
        const res = await fetch(`/api/tiles/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
        if (!res.ok) throw new Error('Failed to update tile');
        return
    }
    const { error } = await supabase.from(table).update(patch).eq('id', id)
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


