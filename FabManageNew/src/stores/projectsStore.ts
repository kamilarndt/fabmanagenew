import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { listProjects, createProject, updateProject as sbUpdate, deleteProject as sbDelete } from '../services/projects'
import { generateProjectColorScheme } from '../lib/clientUtils'

export type ProjectModule = 'wycena' | 'koncepcja' | 'projektowanie_techniczne' | 'produkcja' | 'materialy' | 'logistyka_montaz' | 'zakwaterowanie'

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
    clientId: string // ID klienta zamiast client string
    client: string // Nazwa klienta (dla kompatybilności wstecznej)
    status: 'Active' | 'On Hold' | 'Done'
    deadline: string
    budget?: number
    manager?: string
    description?: string
    progress?: number
    groups?: ProjectGroup[]
    modules?: ProjectModule[]
    // Nowe pola dla kolorów projektu
    clientColor?: string // Kolor klienta
    colorScheme?: {
        primary: string
        light: string
        dark: string
        accent: string
    }
}

// Sample projects data - Projekty dla stacji telewizyjnych
const sampleProjects: Project[] = [
    {
        id: 'P-001',
        name: 'TVP - Studio Wiadomości',
        clientId: 'C-001', // Telewizja Polska S.A.
        client: 'Telewizja Polska S.A.',
        status: 'Active',
        deadline: '2025-02-15',
        budget: 450000,
        manager: 'Anna Kowalska',
        description: 'Modernizacja studia wiadomości z systemem LED i interaktywnymi elementami',
        progress: 75,
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy'],
        clientColor: '#e60012',
        colorScheme: {
            primary: '#e60012',
            light: '#ff4d4d',
            dark: '#cc0000',
            accent: '#00cc00'
        }
    },
    {
        id: 'P-002',
        name: 'Polsat - Studio Rozrywki',
        clientId: 'C-002', // Polsat
        client: 'Polsat',
        status: 'Active',
        deadline: '2025-03-20',
        budget: 380000,
        manager: 'Piotr Nowak',
        description: 'Nowe studio rozrywkowe z systemem oświetlenia i scenografią',
        progress: 60,
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja'],
        clientColor: '#ff6b35',
        colorScheme: {
            primary: '#ff6b35',
            light: '#ff8f66',
            dark: '#e55a2b',
            accent: '#00cc00'
        }
    },
    {
        id: 'P-003',
        name: 'TVN - Studio Informacyjne',
        clientId: 'C-003', // TVN
        client: 'TVN',
        status: 'On Hold',
        deadline: '2025-04-10',
        budget: 320000,
        manager: 'Marek Wiśniewski',
        description: 'Remont studia informacyjnego z nowoczesnym systemem telewizyjnym',
        progress: 30,
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne'],
        clientColor: '#1e3a8a',
        colorScheme: {
            primary: '#1e3a8a',
            light: '#3b82f6',
            dark: '#1e40af',
            accent: '#00cc00'
        }
    },
    {
        id: 'P-004',
        name: 'TV Puls - Studio Religijne',
        clientId: 'C-004', // TV Puls
        client: 'TV Puls',
        status: 'Done',
        deadline: '2024-12-15',
        budget: 280000,
        manager: 'Katarzyna Zielińska',
        description: 'Studio do programów religijnych z systemem oświetlenia',
        progress: 100,
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy'],
        clientColor: '#7c3aed',
        colorScheme: {
            primary: '#7c3aed',
            light: '#a78bfa',
            dark: '#6d28d9',
            accent: '#00cc00'
        }
    },
    {
        id: 'P-005',
        name: 'TV4 - Studio Show',
        clientId: 'C-005', // TV4
        client: 'TV4',
        status: 'Active',
        deadline: '2025-01-30',
        budget: 250000,
        manager: 'Tomasz Kowalczyk',
        description: 'Studio do programów rozrywkowych z systemem dźwięku',
        progress: 80,
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy'],
        clientColor: '#059669',
        colorScheme: {
            primary: '#059669',
            light: '#10b981',
            dark: '#047857',
            accent: '#00cc00'
        }
    }
];

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

    // Client integration
    getProjectsByClient: (clientId: string) => Project[]
    updateProjectColors: (clientId: string, newColor: string) => void
    syncProjectWithClient: (clientId: string, clientName: string, clientColor: string) => void
}

export const useProjectsStore = create<ProjectsState>()(
    persist(
        (set, get) => ({
            projects: [],
            isLoading: false,
            isInitialized: false,

            initialize: async () => {
                set({ isLoading: true })

                try {
                    if (!isSupabaseConfigured) {
                        // If no database, use sample projects
                        set({ projects: sampleProjects, isInitialized: true })

                        // Synchronizuj projekty z klientami
                        setTimeout(() => {
                            if (typeof window !== 'undefined') {
                                import('../stores/clientsStore').then(({ useClientsStore }) => {
                                    const clients = useClientsStore.getState().clients
                                    clients.forEach(client => {
                                        get().syncProjectWithClient(
                                            client.id,
                                            client.companyName,
                                            client.cardColor
                                        )
                                    })
                                })
                            }
                        }, 100)
                        return
                    }

                    const data = await listProjects()
                    if (data.length > 0) {
                        set({ projects: data, isInitialized: true })

                        // Synchronizuj projekty z klientami
                        setTimeout(() => {
                            if (typeof window !== 'undefined') {
                                import('../stores/clientsStore').then(({ useClientsStore }) => {
                                    const clients = useClientsStore.getState().clients
                                    clients.forEach(client => {
                                        get().syncProjectWithClient(
                                            client.id,
                                            client.companyName,
                                            client.cardColor
                                        )
                                    })
                                })
                            }
                        }, 100)
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

                        // Synchronizuj projekty z klientami
                        setTimeout(() => {
                            if (typeof window !== 'undefined') {
                                import('../stores/clientsStore').then(({ useClientsStore }) => {
                                    const clients = useClientsStore.getState().clients
                                    clients.forEach(client => {
                                        get().syncProjectWithClient(
                                            client.id,
                                            client.companyName,
                                            client.cardColor
                                        )
                                    })
                                })
                            }
                        }, 100)
                    }
                } catch (error) {
                    const { logger } = await import('../lib/logger')
                    logger.error('Błąd podczas ładowania projektów:', error)
                    // Fallback to sample projects
                    set({ projects: sampleProjects, isInitialized: true })

                    // Synchronizuj projekty z klientami
                    setTimeout(() => {
                        if (typeof window !== 'undefined') {
                            import('../stores/clientsStore').then(({ useClientsStore }) => {
                                const clients = useClientsStore.getState().clients
                                clients.forEach(client => {
                                    get().syncProjectWithClient(
                                        client.id,
                                        client.companyName,
                                        client.cardColor
                                    )
                                })
                            })
                        }
                    }, 100)
                } finally {
                    set({ isLoading: false })
                }
            },

            add: async (project: Omit<Project, 'id'>) => {
                const nextId = `P-${(get().projects.length + 1).toString().padStart(3, '0')}`

                // Automatycznie generuj schemat kolorów jeśli nie podano
                const finalProject = { id: nextId, ...project }
                if (project.clientColor && !project.colorScheme) {
                    finalProject.colorScheme = generateProjectColorScheme(project.clientColor)
                }

                set(state => ({ projects: [...state.projects, finalProject] }))

                if (isSupabaseConfigured) {
                    try {
                        await createProject(finalProject)
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
            },

            // Pobierz wszystkie projekty dla danego klienta
            getProjectsByClient: (clientId: string) => {
                return get().projects.filter(p => p.clientId === clientId)
            },

            // Zaktualizuj kolory wszystkich projektów klienta
            updateProjectColors: (clientId: string, newColor: string) => {
                const colorScheme = generateProjectColorScheme(newColor)
                set(state => ({
                    projects: state.projects.map(p =>
                        p.clientId === clientId
                            ? { ...p, clientColor: newColor, colorScheme }
                            : p
                    )
                }))
            },

            // Synchronizuj projekty z danymi klienta
            syncProjectWithClient: (clientId: string, clientName: string, clientColor: string) => {
                const colorScheme = generateProjectColorScheme(clientColor)
                set(state => ({
                    projects: state.projects.map(p =>
                        p.clientId === clientId
                            ? {
                                ...p,
                                client: clientName,
                                clientColor,
                                colorScheme
                            }
                            : p
                    )
                }))
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
