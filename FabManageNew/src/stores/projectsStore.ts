import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { listProjects, createProject, updateProject as sbUpdate, deleteProject as sbDelete } from '../services/projects'

export type ProjectModule = 'wycena' | 'koncepcja' | 'projektowanie_techniczne' | 'produkcja' | 'materialy' | 'logistyka_montaz'

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
    modules?: ProjectModule[]
}

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
        progress: 75,
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy']
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
        progress: 45,
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne']
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
        progress: 30,
        modules: ['wycena', 'koncepcja']
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
        progress: 10,
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy', 'logistyka_montaz']
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
        progress: 60,
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja']
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
        progress: 100,
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy', 'logistyka_montaz']
    },
    {
        id: 'P-007',
        name: 'Restauracja Fusion - Kraków',
        client: 'Fusion Group',
        status: 'Active',
        deadline: '2025-03-10',
        budget: 55000,
        manager: 'Karolina Nowak',
        description: 'Wnętrze restauracji z elementami azjatyckimi i europejskimi',
        progress: 25,
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne']
    },
    {
        id: 'P-008',
        name: 'Biuro TechCorp - Warszawa',
        client: 'TechCorp',
        status: 'Active',
        deadline: '2025-04-05',
        budget: 75000,
        manager: 'Adam Wiśniewski',
        description: 'Nowoczesne biuro z elementami smart office',
        progress: 40,
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy']
    },
    {
        id: 'P-009',
        name: 'Hotel Marina - Gdańsk',
        client: 'Marina Hotels',
        status: 'On Hold',
        deadline: '2025-06-15',
        budget: 180000,
        manager: 'Ewa Kowalczyk',
        description: 'Lobby hotelu z elementami morskimi',
        progress: 15,
        modules: ['wycena', 'koncepcja']
    },
    {
        id: 'P-010',
        name: 'Centrum Konferencyjne - Poznań',
        client: 'Poznań Congress Center',
        status: 'Active',
        deadline: '2025-05-20',
        budget: 220000,
        manager: 'Piotr Zieliński',
        description: 'Sala konferencyjna z systemem multimedialnym',
        progress: 35,
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy', 'logistyka_montaz']
    }
]

interface ProjectsState {
    projects: Project[]
    isLoading: boolean
    isInitialized: boolean

    // Actions
    initialize: () => Promise<void>
    add: (project: Omit<Project, 'id'>) => Promise<void>
    update: (id: string, project: Partial<Project>) => Promise<void>
    remove: (id: string) => Promise<void>
    setProjects: (projects: Project[]) => void
}

export const useProjectsStore = create<ProjectsState>()(
    persist(
        (set) => ({
            projects: [],
            isLoading: false,
            isInitialized: false,

            initialize: async () => {
                set({ isLoading: true })

                try {
                    if (!isSupabaseConfigured) {
                        // If no database, use sample projects
                        set({ projects: sampleProjects, isInitialized: true })
                        return
                    }

                    const data = await listProjects()
                    if (data.length > 0) {
                        set({ projects: data, isInitialized: true })
                    } else {
                        // If database is empty, populate with sample projects
                        const { logger } = await import('../lib/logger')
                        logger.info('Baza danych jest pusta, dodaję przykładowe projekty...')
                        for (const project of sampleProjects) {
                            try {
                                await createProject(project)
                            } catch (error) {
                                const { logger } = await import('../lib/logger')
                                logger.error('Błąd podczas dodawania projektu:', error)
                            }
                        }
                        set({ projects: sampleProjects, isInitialized: true })
                    }
                } catch (error) {
                    const { logger } = await import('../lib/logger')
                    logger.error('Błąd podczas ładowania projektów:', error)
                    // Fallback to sample projects
                    set({ projects: sampleProjects, isInitialized: true })
                } finally {
                    set({ isLoading: false })
                }
            },

            add: async (project: Omit<Project, 'id'>) => {
                const nextId = `P-${(useProjectsStore.getState().projects.length + 1).toString().padStart(3, '0')}`
                const newProject = { id: nextId, ...project }

                set(state => ({ projects: [...state.projects, newProject] }))

                if (isSupabaseConfigured) {
                    try {
                        await createProject(project)
                    } catch (error) {
                        const { logger } = await import('../lib/logger')
                        logger.error('Błąd podczas dodawania projektu:', error)
                    }
                }
            },

            update: async (id: string, project: Partial<Project>) => {
                set(state => ({
                    projects: state.projects.map(p =>
                        p.id === id ? { ...p, ...project } : p
                    )
                }))

                if (isSupabaseConfigured) {
                    try {
                        await sbUpdate(id, project)
                    } catch (error) {
                        const { logger } = await import('../lib/logger')
                        logger.error('Błąd podczas aktualizacji projektu:', error)
                    }
                }
            },

            remove: async (id: string) => {
                set(state => ({
                    projects: state.projects.filter(p => p.id !== id)
                }))

                if (isSupabaseConfigured) {
                    try {
                        await sbDelete(id)
                    } catch (error) {
                        const { logger } = await import('../lib/logger')
                        logger.error('Błąd podczas usuwania projektu:', error)
                    }
                }
            },

            setProjects: (projects: Project[]) => {
                set({ projects })
            }
        }),
        {
            name: 'fabmanage-projects',
            partialize: (state) => ({ projects: state.projects }),
            onRehydrateStorage: () => (state) => {
                if (state && !state.isInitialized) {
                    state.initialize()
                }
            }
        }
    )
)

// Set up real-time subscriptions
if (isSupabaseConfigured) {
    supabase.channel('projects-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, async () => {
            try {
                const data = await listProjects()
                if (data) {
                    useProjectsStore.getState().setProjects(data)
                }
            } catch (error) {
                console.error('Błąd podczas synchronizacji projektów:', error)
            }
        })
        .subscribe()
}
