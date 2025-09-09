import { api } from '../lib/httpClient'
import type { Project } from '../stores/projectsStore'

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
    const [projects, clients] = await Promise.all([
        api.call<any[]>('/api/projects', {
            method: 'GET',
            table: 'projects'
        }),
        api.call<any[]>('/api/clients', {
            method: 'GET',
            table: 'clients'
        }).catch(() => []) // Fallback if clients endpoint fails
    ])

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

export async function createProject(p: Omit<Project, 'id'>): Promise<Project | null> {
    const payload = {
        client_id: p.clientId,
        name: p.name,
        status: 'new',
        deadline: p.deadline || null
    }

    const d = await api.call<any>('/api/projects', {
        method: 'POST',
        data: payload,
        table: 'projects'
    })

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

export async function updateProject(id: string, patch: Partial<Project>): Promise<void> {
    const payload = {
        client_id: patch.clientId,
        name: patch.name,
        status: 'active', // map UI status back to backend
        deadline: patch.deadline
    }

    await api.call(`/api/projects/${id}`, {
        method: 'PUT',
        data: { ...payload, id },
        table: 'projects'
    })
}