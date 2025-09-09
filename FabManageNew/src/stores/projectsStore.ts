import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isSupabaseConfigured } from '../lib/supabase'
import { listProjects, createProject, updateProject as sbUpdate, deleteProject as sbDelete } from '../services/projects'
import { generateProjectColorScheme } from '../lib/clientUtils'
import { subscribeTable } from '../lib/realtime'
import { mockProjects } from '../data/mockDatabase'
import type { Project, ProjectModule, ProjectGroup, ProjectWithStats } from '../types/projects.types'

// Re-export types for backward compatibility
export type { Project, ProjectModule, ProjectGroup, ProjectWithStats }

// Projekty zasilane z rozbudowanej bazy mockProjects

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
    getModuleStats: () => Record<ProjectModule, number>
    getProjectsByStatusAndModule: (status: Project['status'], module: ProjectModule) => Project[]
    getProjectsByClientAndStatus: (clientId: string, status: Project['status']) => Project[]
    getProjectsByManagerAndStatus: (manager: string, status: Project['status']) => Project[]
    getProjectsByBudgetAndStatus: (min: number, max: number, status: Project['status']) => Project[]
    getProjectsByProgressAndStatus: (min: number, max: number, status: Project['status']) => Project[]
    getProjectsByDeadlineAndStatus: (days: number, status: Project['status']) => Project[]
    getProjectsByModulesAndStatus: (modules: ProjectModule[], status: Project['status']) => Project[]
    getProjectsByClientAndModule: (clientId: string, module: ProjectModule) => Project[]
    getProjectsByManagerAndModule: (manager: string, module: ProjectModule) => Project[]
    getProjectsByBudgetAndModule: (min: number, max: number, module: ProjectModule) => Project[]
    getProjectsByProgressAndModule: (min: number, max: number, module: ProjectModule) => Project[]
    getProjectsByDeadlineAndModule: (days: number, module: ProjectModule) => Project[]
    getProjectsByClientStatusAndModule: (clientId: string, status: Project['status'], module: ProjectModule) => Project[]
    getProjectsByManagerStatusAndModule: (manager: string, status: Project['status'], module: ProjectModule) => Project[]
    getProjectsByBudgetStatusAndModule: (min: number, max: number, status: Project['status'], module: ProjectModule) => Project[]
    getProjectsByProgressStatusAndModule: (min: number, max: number, status: Project['status'], module: ProjectModule) => Project[]
    getProjectsByDeadlineStatusAndModule: (days: number, status: Project['status'], module: ProjectModule) => Project[]
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
                    if (!isSupabaseConfigured) {
                        // If no database, use mock projects
                        set({ projects: mockProjects, projectsById: Object.fromEntries(mockProjects.map(p => [p.id, p])), isInitialized: true })

                        // Synchronizuj projekty z klientami
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
                        return
                    }

                    const data = await listProjects()
                    if (data.length > 0) {
                        set({ projects: data, projectsById: Object.fromEntries(data.map(p => [p.id, p])), isInitialized: true })

                        // Synchronizuj projekty z klientami
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
                    } else {
                        // If database is empty, populate with mock projects
                        const { logger } = await import('../lib/logger')
                        logger.info('Baza danych jest pusta, dodaję projekty z mockDatabase...')
                        for (const project of mockProjects) {
                            try {
                                await createProject(project)
                            } catch (error) {
                                const { logger } = await import('../lib/logger')
                                logger.error('Błąd podczas dodawania projektu:', error)
                            }
                        }
                        set({ projects: mockProjects, projectsById: Object.fromEntries(mockProjects.map(p => [p.id, p])), isInitialized: true })

                        // Synchronizuj projekty z klientami
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
                    }
                } catch (error) {
                    const { logger } = await import('../lib/logger')
                    logger.error('Błąd podczas ładowania projektów:', error)
                    // Fallback to mock projects
                    set({ projects: mockProjects, isInitialized: true })

                    // Synchronizuj projekty z klientami
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

                set(state => ({
                    projects: [...state.projects, finalProject],
                    projectsById: { ...state.projectsById, [nextId]: finalProject }
                }))

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
                set(state => {
                    const nextProjects = state.projects.map(p => p.id === id ? { ...p, ...project } : p)
                    const next = { ...state.projectsById }
                    next[id] = { ...(next[id] || (state.projects.find(p => p.id === id) as Project)), ...project }
                    return { projects: nextProjects, projectsById: next }
                })

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
                set(state => {
                    const next = { ...state.projectsById }
                    delete next[id]
                    return { projects: state.projects.filter(p => p.id !== id), projectsById: next }
                })

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
                set({ projects, projectsById: Object.fromEntries(projects.map(p => [p.id, p])) })
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
            },

            // ========================================
            // SELEKTORY - OPTYMALIZACJA WYDAJNOŚCI
            // ========================================

            // Statystyki projektów
            getProjectStats: () => {
                const projects = get().projects;
                const active = projects.filter(p => p.status === 'W realizacji').length;
                const onHold = projects.filter(p => p.status === 'Wstrzymany').length;
                const done = projects.filter(p => p.status === 'Zakończony').length;
                const total = projects.length;

                return { active, onHold, done, total };
            },

            // Projekty według statusu
            getProjectsByStatus: (status: Project['status']) => {
                return get().projects.filter(p => p.status === status);
            },

            // Projekty według modułu
            getProjectsByModule: (module: ProjectModule) => {
                return get().projects.filter(p => p.modules?.includes(module));
            },

            // Projekty z przekroczonym deadline
            getOverdueProjects: () => {
                const now = new Date();
                return get().projects.filter(p => {
                    const deadline = new Date(p.deadline);
                    return deadline < now && p.status !== 'Zakończony';
                });
            },

            // Projekty z niskim postępem
            getLowProgressProjects: () => {
                return get().projects.filter(p =>
                    p.progress !== undefined && p.progress < 25 && p.status === 'W realizacji'
                );
            },

            // Projekty według budżetu
            getProjectsByBudgetRange: (min: number, max: number) => {
                return get().projects.filter(p =>
                    p.budget !== undefined && p.budget >= min && p.budget <= max
                );
            },

            // Projekty według menedżera
            getProjectsByManager: (manager: string) => {
                return get().projects.filter(p => p.manager === manager);
            },

            // Projekty według klienta (z cache)
            getProjectsByClientCached: (clientId: string) => {
                const state = get();
                if (!state._clientProjectsCache) {
                    state._clientProjectsCache = new Map();
                }

                if (state._clientProjectsCache.has(clientId)) {
                    return state._clientProjectsCache.get(clientId)!;
                }

                const projects = state.projects.filter(p => p.clientId === clientId);
                state._clientProjectsCache.set(clientId, projects);
                return projects;
            },

            // Projekty według daty (ostatnie X dni)
            getRecentProjects: (days: number = 30) => {
                const now = new Date();
                const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

                return get().projects.filter(p => {
                    const deadline = new Date(p.deadline);
                    return deadline >= cutoff;
                }).sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
            },

            // Projekty z wysokim priorytetem (deadline < 7 dni)
            getHighPriorityProjects: () => {
                const now = new Date();
                const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

                return get().projects.filter(p => {
                    const deadline = new Date(p.deadline);
                    return deadline <= weekFromNow && p.status !== 'Zakończony';
                }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
            },

            // Projekty według postępu
            getProjectsByProgressRange: (min: number, max: number) => {
                return get().projects.filter(p =>
                    p.progress !== undefined && p.progress >= min && p.progress <= max
                );
            },

            // Projekty z plikami
            getProjectsWithFiles: () => {
                return get().projects.filter(p => p.groups && p.groups.some(g => g.files && g.files.length > 0));
            },

            // Projekty bez plików
            getProjectsWithoutFiles: () => {
                return get().projects.filter(p => !p.groups || p.groups.every(g => !g.files || g.files.length === 0));
            },

            // Projekty według koloru klienta
            getProjectsByClientColor: (color: string) => {
                return get().projects.filter(p => p.clientColor === color);
            },

            // Projekty według roku
            getProjectsByYear: (year: number) => {
                return get().projects.filter(p => {
                    const deadline = new Date(p.deadline);
                    return deadline.getFullYear() === year;
                });
            },

            // Projekty według miesiąca
            getProjectsByMonth: (year: number, month: number) => {
                return get().projects.filter(p => {
                    const deadline = new Date(p.deadline);
                    return deadline.getFullYear() === year && deadline.getMonth() === month;
                });
            },

            // Projekty według kwartału
            getProjectsByQuarter: (year: number, quarter: number) => {
                const startMonth = (quarter - 1) * 3;
                const endMonth = startMonth + 2;

                return get().projects.filter(p => {
                    const deadline = new Date(p.deadline);
                    const month = deadline.getMonth();
                    return deadline.getFullYear() === year && month >= startMonth && month <= endMonth;
                });
            },

            // Projekty według wartości budżetu
            getProjectsByBudgetCategory: () => {
                const projects = get().projects.filter(p => p.budget !== undefined);

                return {
                    low: projects.filter(p => (p.budget as number) < 100000),
                    medium: projects.filter(p => (p.budget as number) >= 100000 && (p.budget as number) < 500000),
                    high: projects.filter(p => (p.budget as number) >= 500000)
                };
            },

            // Projekty według długości trwania
            getProjectsByDuration: () => {
                const now = new Date();

                return get().projects.filter(p => {
                    const deadline = new Date(p.deadline);
                    const duration = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    return duration > 0;
                }).sort((a, b) => {
                    const aDuration = Math.ceil((new Date(a.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    const bDuration = Math.ceil((new Date(b.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    return aDuration - bDuration;
                });
            },

            // Projekty według modułów (statystyki)
            getModuleStats: () => {
                const projects = get().projects;
                const moduleCounts: Record<ProjectModule, number> = {
                    wycena: 0,
                    koncepcja: 0,
                    projektowanie_techniczne: 0,
                    produkcja: 0,
                    materialy: 0,
                    logistyka_montaz: 0,
                    zakwaterowanie: 0,
                    montaz: 0
                };

                projects.forEach(p => {
                    p.modules?.forEach(module => {
                        if (moduleCounts[module] !== undefined) {
                            moduleCounts[module]++;
                        }
                    });
                });

                return moduleCounts;
            },

            // Projekty według statusu i modułu
            getProjectsByStatusAndModule: (status: Project['status'], module: ProjectModule) => {
                return get().projects.filter(p =>
                    p.status === status && p.modules?.includes(module)
                );
            },

            // Projekty według klienta i statusu
            getProjectsByClientAndStatus: (clientId: string, status: Project['status']) => {
                return get().projects.filter(p =>
                    p.clientId === clientId && p.status === status
                );
            },

            // Projekty według menedżera i statusu
            getProjectsByManagerAndStatus: (manager: string, status: Project['status']) => {
                return get().projects.filter(p =>
                    p.manager === manager && p.status === status
                );
            },

            // Projekty według budżetu i statusu
            getProjectsByBudgetAndStatus: (min: number, max: number, status: Project['status']) => {
                return get().projects.filter(p =>
                    p.budget !== undefined &&
                    (p.budget as number) >= min &&
                    (p.budget as number) <= max &&
                    p.status === status
                );
            },

            // Projekty według postępu i statusu
            getProjectsByProgressAndStatus: (min: number, max: number, status: Project['status']) => {
                return get().projects.filter(p =>
                    p.progress !== undefined &&
                    (p.progress as number) >= min &&
                    (p.progress as number) <= max &&
                    p.status === status
                );
            },

            // Projekty według deadline i statusu
            getProjectsByDeadlineAndStatus: (days: number, status: Project['status']) => {
                const now = new Date();
                const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

                return get().projects.filter(p => {
                    const deadline = new Date(p.deadline);
                    return deadline <= cutoff && p.status === status;
                });
            },

            // Projekty według modułów i statusu
            getProjectsByModulesAndStatus: (modules: ProjectModule[], status: Project['status']) => {
                return get().projects.filter(p =>
                    p.status === status &&
                    modules.every(module => p.modules?.includes(module))
                );
            },

            // Projekty według klienta i modułu
            getProjectsByClientAndModule: (clientId: string, module: ProjectModule) => {
                return get().projects.filter(p =>
                    p.clientId === clientId && p.modules?.includes(module)
                );
            },

            // Projekty według menedżera i modułu
            getProjectsByManagerAndModule: (manager: string, module: ProjectModule) => {
                return get().projects.filter(p =>
                    p.manager === manager && p.modules?.includes(module)
                );
            },

            // Projekty według budżetu i modułu
            getProjectsByBudgetAndModule: (min: number, max: number, module: ProjectModule) => {
                return get().projects.filter(p =>
                    p.budget !== undefined &&
                    (p.budget as number) >= min &&
                    (p.budget as number) <= max &&
                    p.modules?.includes(module)
                );
            },

            // Projekty według postępu i modułu
            getProjectsByProgressAndModule: (min: number, max: number, module: ProjectModule) => {
                return get().projects.filter(p =>
                    p.progress !== undefined &&
                    (p.progress as number) >= min &&
                    (p.progress as number) <= max &&
                    p.modules?.includes(module)
                );
            },

            // Projekty według deadline i modułu
            getProjectsByDeadlineAndModule: (days: number, module: ProjectModule) => {
                const now = new Date();
                const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

                return get().projects.filter(p => {
                    const deadline = new Date(p.deadline);
                    return deadline <= cutoff && p.modules?.includes(module);
                });
            },

            // Projekty według klienta, statusu i modułu
            getProjectsByClientStatusAndModule: (clientId: string, status: Project['status'], module: ProjectModule) => {
                return get().projects.filter(p =>
                    p.clientId === clientId &&
                    p.status === status &&
                    p.modules?.includes(module)
                );
            },

            // Projekty według menedżera, statusu i modułu
            getProjectsByManagerStatusAndModule: (manager: string, status: Project['status'], module: ProjectModule) => {
                return get().projects.filter(p =>
                    p.manager === manager &&
                    p.status === status &&
                    p.modules?.includes(module)
                );
            },

            // Projekty według budżetu, statusu i modułu
            getProjectsByBudgetStatusAndModule: (min: number, max: number, status: Project['status'], module: ProjectModule) => {
                return get().projects.filter(p =>
                    p.budget !== undefined &&
                    (p.budget as number) >= min &&
                    (p.budget as number) <= max &&
                    p.status === status &&
                    p.modules?.includes(module)
                );
            },

            // Projekty według postępu, statusu i modułu
            getProjectsByProgressStatusAndModule: (min: number, max: number, status: Project['status'], module: ProjectModule) => {
                return get().projects.filter(p =>
                    p.progress !== undefined &&
                    (p.progress as number) >= min &&
                    (p.progress as number) <= max &&
                    p.status === status &&
                    p.modules?.includes(module)
                );
            },

            // Projekty według deadline, statusu i modułu
            getProjectsByDeadlineStatusAndModule: (days: number, status: Project['status'], module: ProjectModule) => {
                const now = new Date();
                const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

                return get().projects.filter(p => {
                    const deadline = new Date(p.deadline);
                    return deadline <= cutoff && p.status === status && p.modules?.includes(module);
                });
            }
        }) as ProjectsState,
        {
            name: 'fabmanage-projects',
            partialize: (state): { projects: Project[] } => ({ projects: state.projects }),
            onRehydrateStorage: () => (state) => {
                if (state && !state.isInitialized) {
                    // rebuild map
                    state.projectsById = Object.fromEntries(state.projects.map(p => [p.id, p]))
                    state.initialize()
                }
                // subscribe realtime
                if (state) {
                    const unsubscribe = subscribeTable<Project>('projects', (rows) => {
                        const next = { ...state.projectsById }
                        rows.forEach(r => { next[r.id] = r })
                        state.setProjects(Object.values(next))
                    }, (ids) => {
                        const next = { ...state.projectsById }
                        ids.forEach(id => { delete next[id] })
                        state.setProjects(Object.values(next))
                    })
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ; (state as any)._unsubscribeProjects = unsubscribe
                }
            }
        }
    )
)

// realtime is handled via lib/realtime in onRehydrateStorage
