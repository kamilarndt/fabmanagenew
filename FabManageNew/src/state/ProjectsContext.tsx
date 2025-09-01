import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { listProjects, createProject, updateProject as sbUpdate, deleteProject as sbDelete } from '../services/projects'

export type GroupFile = {
    id: string
    name: string
    url: string
    type: string
    size?: number
}

export type ProjectGroup = {
    id: string
    name: string
    description?: string
    thumbnail?: string
    files?: GroupFile[]
}

export type Project = {
    id: string
    name: string
    client: string
    status: 'Active' | 'On Hold' | 'Done'
    deadline: string
    budget?: number
    manager?: string
    description?: string
    progress?: number
    groups?: ProjectGroup[]
}

type ProjectsContextType = {
    projects: Project[]
    add: (p: Omit<Project, 'id'>) => void
    update: (id: string, p: Partial<Project>) => void
    remove: (id: string) => void
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

// Sample projects data - will be automatically loaded
const sampleProjects: Project[] = [
    {
        id: 'P-001',
        name: 'Smart Kids Planet - Recepcja',
        client: 'Smart Kids Planet',
        status: 'Active',
        deadline: '2025-02-15',
        budget: 45000,
        manager: 'Anna Kowalska',
        description: 'Kompleksowa modernizacja recepcji z elementami interaktywnymi dla dzieci',
        progress: 75
    },
    {
        id: 'P-002',
        name: 'Stoisko GR8 TECH - Londyn 2025',
        client: 'GR8 TECH',
        status: 'Active',
        deadline: '2025-03-20',
        budget: 120000,
        manager: 'Paweł Nowak',
        description: 'Stoisko targowe na London Tech Week z systemem LED i interaktywnymi ekranami',
        progress: 45
    },
    {
        id: 'P-003',
        name: 'Studio TV - Les 12 Coups de Midi',
        client: 'France Television',
        status: 'On Hold',
        deadline: '2025-04-10',
        budget: 85000,
        manager: 'Ola Wiśniewska',
        description: 'Scenografia do programu telewizyjnego z elementami modułowymi',
        progress: 30
    },
    {
        id: 'P-004',
        name: 'Kawiarnia Nowa Oferta - Warszawa',
        client: 'Nowa Oferta',
        status: 'Active',
        deadline: '2025-01-30',
        budget: 28000,
        manager: 'Kamil Zieliński',
        description: 'Wnętrze kawiarni z niestandardowymi elementami dekoracyjnymi',
        progress: 10
    },
    {
        id: 'P-005',
        name: 'Muzeum Historii - Sala Interaktywna',
        client: 'Muzeum Narodowe',
        status: 'Active',
        deadline: '2025-05-15',
        budget: 95000,
        manager: 'Maria Lis',
        description: 'Sala interaktywna z elementami multimedialnymi i rekonstrukcjami historycznymi',
        progress: 60
    },
    {
        id: 'P-006',
        name: 'Centrum Handlowe Galaxy - Strefa Dzieci',
        client: 'Galaxy Mall',
        status: 'Done',
        deadline: '2024-12-20',
        budget: 65000,
        manager: 'Tomasz Kowal',
        description: 'Strefa zabaw dla dzieci z elementami bezpiecznymi i edukacyjnymi',
        progress: 100
    },
    {
        id: 'P-007',
        name: 'Hotel Premium - Lobby',
        client: 'Premium Hotels',
        status: 'Active',
        deadline: '2025-06-30',
        budget: 150000,
        manager: 'Anna Kowalska',
        description: 'Lobby hotelowe z luksusowymi elementami dekoracyjnymi i oświetleniem',
        progress: 25
    },
    {
        id: 'P-008',
        name: 'Szkoła Podstawowa - Sala Gimnastyczna',
        client: 'Miasto Warszawa',
        status: 'On Hold',
        deadline: '2025-07-15',
        budget: 75000,
        manager: 'Paweł Nowak',
        description: 'Wyposażenie sali gimnastycznej z elementami sportowymi i bezpieczeństwa',
        progress: 15
    },
    {
        id: 'P-009',
        name: 'Restauracja Fusion - Kuchnia',
        client: 'Fusion Restaurant',
        status: 'Active',
        deadline: '2025-02-28',
        budget: 55000,
        manager: 'Ola Wiśniewska',
        description: 'Wyposażenie kuchni z elementami funkcjonalnymi i estetycznymi',
        progress: 80
    },
    {
        id: 'P-010',
        name: 'Biuro Startup - Przestrzeń Kreatywna',
        client: 'TechStart Inc.',
        status: 'Active',
        deadline: '2025-03-10',
        budget: 42000,
        manager: 'Kamil Zieliński',
        description: 'Przestrzeń biurowa z elementami kreatywnymi i funkcjonalnymi',
        progress: 55
    }
]

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        (async () => {
            if (!isSupabaseConfigured) {
                // If no database, use sample projects
                setProjects(sampleProjects)
                setLoaded(true)
                return
            }

            try {
                const data = await listProjects()
                if (data.length > 0) {
                    setProjects(data)
                } else {
                    // If database is empty, populate with sample projects
                    console.log('Baza danych jest pusta, dodaję przykładowe projekty...')
                    for (const project of sampleProjects) {
                        try {
                            await createProject(project)
                        } catch (error) {
                            console.error('Błąd podczas dodawania projektu:', error)
                        }
                    }
                    setProjects(sampleProjects)
                }
            } catch (error) {
                console.error('Błąd podczas ładowania projektów:', error)
                // Fallback to sample projects
                setProjects(sampleProjects)
            } finally {
                setLoaded(true)
            }
        })()
    }, [])

    useEffect(() => {
        if (!isSupabaseConfigured) return
        const channel = supabase.channel('projects-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, async () => {
                try {
                    const data = await listProjects()
                    if (data) setProjects(data)
                } catch { }
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [])

    const add = async (p: Omit<Project, 'id'>) => {
        const nextId = `P-${(projects.length + 1).toString().padStart(3, '0')}`
        const optimistic = { id: nextId, ...p }
        setProjects(prev => [...prev, optimistic])
        try { await createProject(p) } catch { }
    }

    const update = async (id: string, patch: Partial<Project>) => {
        setProjects(prev => prev.map(pr => (pr.id === id ? { ...pr, ...patch } : pr)))
        try { await sbUpdate(id, patch) } catch { }
    }

    const remove = async (id: string) => {
        setProjects(prev => prev.filter(pr => pr.id !== id))
        try { await sbDelete(id) } catch { }
    }

    const value = useMemo(() => ({ projects, add, update, remove }), [projects])
    return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}

export function useProjects() {
    const ctx = useContext(ProjectsContext)
    if (!ctx) throw new Error('useProjects must be used within ProjectsProvider')
    return ctx
}


