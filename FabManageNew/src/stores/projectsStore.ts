import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { listProjects, createProject, updateProject as sbUpdate } from '../services/projects'
import { generateProjectColorScheme } from '../lib/clientUtils'
import { subscribeTable } from '../lib/realtime'
import { config } from '../lib/config'
import type { Project, ProjectModule, ProjectGroup, ProjectWithStats } from '../types/projects.types'

// Re-export types for backward compatibility
export type { Project, ProjectModule, ProjectGroup, ProjectWithStats }

interface ProjectsState {
    projects: Project[]
    projectsById: Record<string, Project>
    isLoading: boolean
    isInitialized: boolean

    // Cache dla optymalizacji
    _clientProjectsCache?: Map<string, Project[]>

    // Actions
    initialize: () => Promise<void>
    add: (project: Omit<Project, 'id'>) => Promise<void>
    update: (id: string, project: Partial<Project>) => Promise<void>
    remove: (id: string) => Promise<void>
    setProjects: (projects: Project[]) => void
    syncWithClients: () => void

    // Client integration
    getProjectsByClient: (clientId: string) => Project[]
    updateProjectColors: (clientId: string, newColor: string) => void
    syncProjectWithClient: (clientId: string, clientName: string, clientColor: string) => void

    // Selektory - optymalizacja wydajności
    getProjectStats: () => { active: number; onHold: number; done: number; total: number }
    getProjectsByStatus: (status: Project['status']) => Project[]
    getProjectsByModule: (module: ProjectModule) => Project[]
    getOverdueProjects: () => Project[]
    getLowProgressProjects: () => Project[]
    getProjectsByBudgetRange: (min: number, max: number) => Project[]
    getProjectsByManager: (manager: string) => Project[]
    getProjectsByClientCached: (clientId: string) => Project[]
    getRecentProjects: (days?: number) => Project[]
    getHighPriorityProjects: () => Project[]
    getProjectsByProgressRange: (min: number, max: number) => Project[]
    getProjectsWithFiles: () => Project[]
    getProjectsWithoutFiles: () => Project[]
    getProjectsByClientColor: (color: string) => Project[]
    getProjectsByYear: (year: number) => Project[]
    getProjectsByMonth: (year: number, month: number) => Project[]
    getProjectsByQuarter: (year: number, quarter: number) => Project[]
    getProjectsByBudgetCategory: () => { low: Project[]; medium: Project[]; high: Project[] }
    getProjectsByDuration: () => Project[]
    getModuleStats: () => any
    getProjectsByStatusAndModule: (status: Project['status'], module: ProjectModule) => Project[]
    getProjectsByDeadlineRange: (days: number, status: Project['status'], module: ProjectModule) => Project[]
}

export const useProjectsStore = create<ProjectsState>()(
    persist<ProjectsState, [], [], { projects: Project[] }>(
        (set, get) => ({
            projects: [],
            projectsById: {},
            isLoading: false,
            isInitialized: false,

            // Cache dla optymalizacji
            _clientProjectsCache: new Map(),

            initialize: async () => {
                set({ isLoading: true })

                try {
                    // Try to load from API
                    const data = await listProjects()

                    if (data.length > 0) {
                        // API has data - use it
                        set({ projects: data, projectsById: Object.fromEntries(data.map(p => [p.id, p])), isInitialized: true })
                        get().syncWithClients()
                    } else if (config.useMockData) {
                        // API empty but mock data enabled - use mock projects
                        const { logger } = await import('../lib/logger')
                        const { mockProjects } = await import('../data/development')

                        logger.info('API empty, using mock projects for development')

                        set({ projects: mockProjects, projectsById: Object.fromEntries(mockProjects.map(p => [p.id, p])), isInitialized: true })
                        get().syncWithClients()
                    } else {
                        // No data and mock disabled - empty state
                        set({ projects: [], projectsById: {}, isInitialized: true })
                    }
                } catch (error) {
                    const { logger } = await import('../lib/logger')
                    logger.error('Błąd podczas ładowania projektów:', error)

                    // Fallback only if mock data is enabled
                    if (config.useMockData) {
                        const { mockProjects } = await import('../data/development')
                        set({ projects: mockProjects, projectsById: Object.fromEntries(mockProjects.map(p => [p.id, p])), isInitialized: true })
                        get().syncWithClients()
                    } else {
                        set({ projects: [], projectsById: {}, isInitialized: true })
                    }
                } finally {
                    set({ isLoading: false })
                }
            },

            // Helper method for client synchronization
            syncWithClients: () => {
                setTimeout(() => {
                    if (typeof window !== 'undefined') {
                        import('../stores/clientDataStore').then(({ useClientDataStore }) => {
                            const clients = useClientDataStore.getState().clients
                            clients.forEach((client: any) => {
                                get().syncProjectWithClient(
                                    client.id,
                                    client.companyName,
                                    client.cardColor
                                )
                            })
                        })
                    }
                }, 100)
            },

            add: async (projectData: Omit<Project, 'id'>) => {
                try {
                    const newProject = await createProject(projectData)
                    if (newProject) {
                        set(state => ({
                            projects: [...state.projects, newProject],
                            projectsById: { ...state.projectsById, [newProject.id]: newProject }
                        }))
                    }
                } catch (error) {
                    const { logger } = await import('../lib/logger')
                    logger.error('Błąd podczas dodawania projektu:', error)
                    throw error
                }
            },

            update: async (id: string, updates: Partial<Project>) => {
                // Optimistic update
                set(state => {
                    const updatedProject = { ...state.projectsById[id], ...updates }
                    return {
                        projects: state.projects.map(p => p.id === id ? updatedProject : p),
                        projectsById: { ...state.projectsById, [id]: updatedProject }
                    }
                })

                try {
                    await sbUpdate(id, updates)
                } catch (error) {
                    const { logger } = await import('../lib/logger')
                    logger.error('Błąd podczas aktualizacji projektu:', error)
                    // Revert optimistic update on error
                    const { projects } = get()
                    set({ projects: [...projects] })
                    throw error
                }
            },

            remove: async (id: string) => {
                // Remove from state immediately
                set(state => ({
                    projects: state.projects.filter(p => p.id !== id),
                    projectsById: Object.fromEntries(Object.entries(state.projectsById).filter(([k]) => k !== id))
                }))

                try {
                    // API delete logic here if needed
                } catch (error) {
                    const { logger } = await import('../lib/logger')
                    logger.error('Błąd podczas usuwania projektu:', error)
                }
            },

            setProjects: (projects: Project[]) => {
                set({
                    projects,
                    projectsById: Object.fromEntries(projects.map(p => [p.id, p]))
                })
            },

            // Client integration methods
            getProjectsByClient: (clientId: string) => {
                const { projects } = get()
                return projects.filter(p => p.clientId === clientId)
            },

            updateProjectColors: (clientId: string, newColor: string) => {
                set(state => {
                    const updatedProjects = state.projects.map(project =>
                        project.clientId === clientId
                            ? { ...project, ...generateProjectColorScheme(newColor) }
                            : project
                    )
                    return {
                        projects: updatedProjects,
                        projectsById: Object.fromEntries(updatedProjects.map(p => [p.id, p]))
                    }
                })
            },

            syncProjectWithClient: (clientId: string, clientName: string, clientColor: string) => {
                set(state => {
                    const updatedProjects = state.projects.map(project =>
                        project.clientId === clientId
                            ? {
                                ...project,
                                client: clientName,
                                ...generateProjectColorScheme(clientColor)
                            }
                            : project
                    )
                    return {
                        projects: updatedProjects,
                        projectsById: Object.fromEntries(updatedProjects.map(p => [p.id, p]))
                    }
                })
            },

            // Selectors
            getProjectStats: () => {
                const { projects } = get()
                return {
                    active: projects.filter(p => p.status === 'W realizacji').length,
                    onHold: projects.filter(p => p.status === 'Wstrzymany').length,
                    done: projects.filter(p => p.status === 'Zakończony').length,
                    total: projects.length
                }
            },

            getProjectsByStatus: (status: Project['status']) => {
                const { projects } = get()
                return projects.filter(p => p.status === status)
            },

            getProjectsByModule: (module: ProjectModule) => {
                const { projects } = get()
                return projects.filter(p => p.modules?.includes(module))
            },

            getOverdueProjects: () => {
                const { projects } = get()
                const today = new Date().toISOString().slice(0, 10)
                return projects.filter(p => p.deadline && p.deadline < today && p.status !== 'Zakończony')
            },

            getLowProgressProjects: () => {
                const { projects } = get()
                return projects.filter(p => p.postep < 30 && p.status === 'W realizacji')
            },

            getProjectsByBudgetRange: (min: number, max: number) => {
                const { projects } = get()
                return projects.filter(p => p.budget && p.budget >= min && p.budget <= max)
            },

            getProjectsByManager: (manager: string) => {
                const { projects } = get()
                return projects.filter(p => p.manager === manager)
            },

            getProjectsByClientCached: (clientId: string) => {
                const cache = get()._clientProjectsCache
                if (cache?.has(clientId)) {
                    return cache.get(clientId)!
                }
                const result = get().getProjectsByClient(clientId)
                cache?.set(clientId, result)
                return result
            },

            getRecentProjects: (days = 30) => {
                const { projects } = get()
                const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
                return projects.filter(p => p.data_utworzenia >= cutoff)
            },

            getHighPriorityProjects: () => {
                const { projects } = get()
                return projects.filter(p => {
                    const isOverdue = p.deadline && p.deadline < new Date().toISOString().slice(0, 10)
                    const isLowProgress = p.postep < 50 && p.status === 'W realizacji'
                    return isOverdue || isLowProgress
                })
            },

            getProjectsByProgressRange: (min: number, max: number) => {
                const { projects } = get()
                return projects.filter(p => p.postep >= min && p.postep <= max)
            },

            getProjectsWithFiles: () => {
                const { projects } = get()
                return projects.filter(p => p.groups && p.groups.some(g => g.files && g.files.length > 0))
            },

            getProjectsWithoutFiles: () => {
                const { projects } = get()
                return projects.filter(p => !p.groups || p.groups.every(g => !g.files || g.files.length === 0))
            },

            getProjectsByClientColor: (color: string) => {
                const { projects } = get()
                return projects.filter(p => p.miniatura === color)
            },

            getProjectsByYear: (year: number) => {
                const { projects } = get()
                return projects.filter(p => new Date(p.data_utworzenia).getFullYear() === year)
            },

            getProjectsByMonth: (year: number, month: number) => {
                const { projects } = get()
                return projects.filter(p => {
                    const date = new Date(p.data_utworzenia)
                    return date.getFullYear() === year && date.getMonth() + 1 === month
                })
            },

            getProjectsByQuarter: (year: number, quarter: number) => {
                const { projects } = get()
                const startMonth = (quarter - 1) * 3 + 1
                const endMonth = quarter * 3
                return projects.filter(p => {
                    const date = new Date(p.data_utworzenia)
                    const month = date.getMonth() + 1
                    return date.getFullYear() === year && month >= startMonth && month <= endMonth
                })
            },

            getProjectsByBudgetCategory: () => {
                const { projects } = get()
                return {
                    low: projects.filter(p => (p.budget || 0) < 50000),
                    medium: projects.filter(p => (p.budget || 0) >= 50000 && (p.budget || 0) < 200000),
                    high: projects.filter(p => (p.budget || 0) >= 200000)
                }
            },

            getProjectsByDuration: () => {
                const { projects } = get()
                return projects.sort((a, b) => {
                    const aDuration = a.deadline ? new Date(a.deadline).getTime() - new Date(a.data_utworzenia).getTime() : 0
                    const bDuration = b.deadline ? new Date(b.deadline).getTime() - new Date(b.data_utworzenia).getTime() : 0
                    return bDuration - aDuration
                })
            },

            getModuleStats: () => {
                const { projects } = get()
                const stats = {
                    projektowanie: 0,
                    produkcja: 0,
                    logistyka: 0,
                    koncepcja: 0,
                    wycena: 0,
                    zakwaterowanie: 0
                }

                projects.forEach(p => {
                    p.modules?.forEach(module => {
                        if (module in stats) {
                            stats[module as keyof typeof stats]++
                        }
                    })
                })

                return stats
            },

            getProjectsByStatusAndModule: (status: Project['status'], module: ProjectModule) => {
                const { projects } = get()
                return projects.filter(p => p.status === status && p.modules?.includes(module))
            },

            getProjectsByDeadlineRange: (days: number, status: Project['status'], module: ProjectModule) => {
                const { projects } = get()
                const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
                return projects.filter(p =>
                    p.status === status &&
                    p.modules?.includes(module) &&
                    p.deadline &&
                    p.deadline <= futureDate
                )
            }
        }),
        {
            name: 'fabmanage-projects',
            partialize: (state) => ({ projects: state.projects, isInitialized: state.isInitialized }),
            onRehydrateStorage: () => (state) => {
                if (!state) return

                // Rebuild projectsById from persisted projects
                if (state.projects && state.projects.length > 0) {
                    state.projectsById = Object.fromEntries(state.projects.map(p => [p.id, p]))
                    state.isInitialized = true
                }

                // Initialize if not done yet
                if (!state.isInitialized) {
                    state.initialize()
                }

                // Subscribe to realtime updates if configured
                if (config.enableRealtimeUpdates) {
                    const unsubscribe = subscribeTable<Project>('projects', (rows) => {
                        const map = { ...state.projectsById }
                        rows.forEach(r => { map[r.id] = r })
                        state.setProjects(Object.values(map))
                    }, (ids) => {
                        const map = { ...state.projectsById }
                        ids.forEach(id => { delete map[id] })
                        state.setProjects(Object.values(map))
                    })
                        // Store unsubscribe function
                        ; (state as any)._unsubscribeProjects = unsubscribe
                }
            }
        }
    )
)