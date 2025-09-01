import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Tile } from '../stores/tilesStore'
import { TileSchema } from '../lib/validation'

const table = 'tiles'

export async function listTiles(): Promise<Tile[]> {
    if (!isSupabaseConfigured) return []
    const { data, error } = await supabase.from(table).select('*').order('id')
    if (error) throw error
    const parsed = (data ?? []).map((d: unknown) => TileSchema.parse(d))
    return parsed as Tile[]
}

export async function createTile(t: Omit<Tile, 'id'> & { id?: string }): Promise<Tile | null> {
    if (!isSupabaseConfigured) return null
    const { data, error } = await supabase.from(table).insert(t).select().single()
    if (error) throw error
    return data ? (TileSchema.parse(data) as Tile) : null
}

export async function updateTile(id: string, patch: Partial<Tile>): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await supabase.from(table).update(patch).eq('id', id)
    if (error) throw error
}

export async function deleteTile(id: string): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
}


