import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Project } from '../stores/projectsStore'
import { ProjectSchema } from '../lib/validation'

const table = 'projects'

function mapBackendStatusToUi(status?: string): Project['status'] {
    switch ((status || '').toLowerCase()) {
        case 'new': return 'Nowy'
        case 'active': return 'W realizacji'
        case 'on_hold': return 'Wstrzymany'
        case 'done': return 'Zakończony'
        case 'archived': return 'Zakończony'
        default: return 'Nowy'
    }
}

function generateNumer(created_at?: string): string {
    const d = created_at ? new Date(created_at) : new Date()
    const y = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `P-${y}/${mm}/${dd}`
}

export async function listProjects(): Promise<Project[]> {
    if (!isSupabaseConfigured) {
        const [projectsRes, clientsRes] = await Promise.all([
            fetch('/api/projects'),
            fetch('/api/clients')
        ])
        if (!projectsRes.ok) throw new Error(`projects ${projectsRes.status}`)
        const projects = await projectsRes.json()
        const clients = clientsRes.ok ? await clientsRes.json() : []
        const clientMap = new Map<string, string>()
        for (const c of clients) clientMap.set(c.id, c.name)
        const mapped: Project[] = (projects as any[]).map(p => ({
            id: p.id,
            numer: generateNumer(p.created_at),
            name: p.name || 'Projekt',
            typ: 'Inne',
            lokalizacja: 'Nieznana',
            clientId: p.client_id || '',
            client: clientMap.get(p.client_id) || 'Unknown',
            status: mapBackendStatusToUi(p.status),
            data_utworzenia: (p.created_at || '').slice(0, 10),
            deadline: p.deadline || '',
            postep: 0,
            budget: undefined,
            manager: undefined,
            manager_id: undefined,
            description: '',
            miniatura: undefined,
            repozytorium_plikow: undefined,
            link_model_3d: undefined,
            progress: 0,
            groups: [],
            modules: []
        }))
        return mapped
    }
    const { data, error } = await supabase.from(table).select('*').order('id')
    if (error) throw error
    const parsed = (data ?? []).map((d: unknown) => ProjectSchema.parse(d))
    return parsed as Project[]
}

export async function createProject(p: Omit<Project, 'id'>): Promise<Project | null> {
    if (!isSupabaseConfigured) {
        const payload = {
            client_id: p.clientId,
            name: p.name,
            status: 'new',
            deadline: p.deadline || null
        }
        const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (!res.ok) throw new Error(`create project ${res.status}`)
        const d = await res.json()
        const mapped: Project = {
            id: d.id,
            numer: generateNumer(d.created_at),
            name: d.name,
            typ: 'Inne',
            lokalizacja: 'Nieznana',
            clientId: d.client_id,
            client: '',
            status: mapBackendStatusToUi(d.status),
            data_utworzenia: (d.created_at || '').slice(0, 10),
            deadline: d.deadline || '',
            postep: 0,
            progress: 0,
            groups: [],
            modules: []
        }
        return mapped
    }
    const { data, error } = await supabase.from(table).insert(p).select().single()
    if (error) throw error
    return data ? (data as Project) : null
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<void> {
    if (!isSupabaseConfigured) {
        const payload: any = {}
        if (patch.name !== undefined) payload.name = patch.name
        if (patch.deadline !== undefined) payload.deadline = patch.deadline
        if (patch.status !== undefined) {
            // Basic inverse mapping
            const s = String(patch.status)
            payload.status = s === 'Nowy' ? 'new' : s === 'W realizacji' ? 'active' : s === 'Wstrzymany' ? 'on_hold' : s === 'Zakończony' ? 'done' : 'new'
        }
        if (patch.clientId !== undefined) payload.client_id = patch.clientId
        const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (!res.ok) throw new Error(`update project ${res.status}`)
        return
    }
    const { error } = await supabase.from(table).update(patch).eq('id', id)
    if (error) throw error
}

export async function deleteProject(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
        const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' })
        if (!res.ok) throw new Error(`delete project ${res.status}`)
        return
    }
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
}


