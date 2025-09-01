import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Project } from '../stores/projectsStore'

const table = 'projects'

export async function listProjects(): Promise<Project[]> {
    if (!isSupabaseConfigured) return []
    const { data, error } = await supabase.from(table).select('*').order('id')
    if (error) throw error
    return data as any
}

export async function createProject(p: Omit<Project, 'id'>): Promise<Project | null> {
    if (!isSupabaseConfigured) return null
    const { data, error } = await supabase.from(table).insert(p as any).select().single()
    if (error) throw error
    return data as any
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await supabase.from(table).update(patch as any).eq('id', id)
    if (error) throw error
}

export async function deleteProject(id: string): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
}


