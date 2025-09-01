import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Project } from '../stores/projectsStore'
import { ProjectSchema } from '../lib/validation'

const table = 'projects'

export async function listProjects(): Promise<Project[]> {
    if (!isSupabaseConfigured) return []
    const { data, error } = await supabase.from(table).select('*').order('id')
    if (error) throw error
    const parsed = (data ?? []).map((d: unknown) => ProjectSchema.parse(d))
    return parsed as Project[]
}

export async function createProject(p: Omit<Project, 'id'>): Promise<Project | null> {
    if (!isSupabaseConfigured) return null
    const { data, error } = await supabase.from(table).insert(p).select().single()
    if (error) throw error
    return data ? (ProjectSchema.parse(data) as Project) : null
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await supabase.from(table).update(patch).eq('id', id)
    if (error) throw error
}

export async function deleteProject(id: string): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
}


