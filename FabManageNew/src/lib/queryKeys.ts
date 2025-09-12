/**
 * Query key factories for TanStack Query
 * Provides consistent, hierarchical query keys for caching and invalidation
 */

// Base query key prefixes
export const QUERY_KEYS = {
    // Projects
    projects: ['projects'] as const,
    project: (id: string) => ['projects', id] as const,
    projectTiles: (projectId: string) => ['projects', projectId, 'tiles'] as const,
    projectMaterials: (projectId: string) => ['projects', projectId, 'materials'] as const,
    projectCosts: (projectId: string) => ['projects', projectId, 'costs'] as const,
    projectTimeline: (projectId: string) => ['projects', projectId, 'timeline'] as const,

    // Tiles
    tiles: ['tiles'] as const,
    tile: (id: string) => ['tiles', id] as const,
    tileBom: (tileId: string) => ['tiles', tileId, 'bom'] as const,
    tileDependencies: (tileId: string) => ['tiles', tileId, 'dependencies'] as const,
    tileAttachments: (tileId: string) => ['tiles', tileId, 'attachments'] as const,
    tileStatus: (tileId: string) => ['tiles', tileId, 'status'] as const,

    // Materials
    materials: ['materials'] as const,
    material: (id: string) => ['materials', id] as const,
    materialStock: (materialId: string) => ['materials', materialId, 'stock'] as const,
    materialHistory: (materialId: string) => ['materials', materialId, 'history'] as const,
    materialSuppliers: (materialId: string) => ['materials', materialId, 'suppliers'] as const,

    // Clients
    clients: ['clients'] as const,
    client: (id: string) => ['clients', id] as const,
    clientProjects: (clientId: string) => ['clients', clientId, 'projects'] as const,
    clientContacts: (clientId: string) => ['clients', clientId, 'contacts'] as const,

    // Subcontractors
    subcontractors: ['subcontractors'] as const,
    subcontractor: (id: string) => ['subcontractors', id] as const,
    subcontractorOrders: (subcontractorId: string) => ['subcontractors', subcontractorId, 'orders'] as const,
    subcontractorSpecialties: (subcontractorId: string) => ['subcontractors', subcontractorId, 'specialties'] as const,

    // Calendar & Scheduling
    calendar: ['calendar'] as const,
    calendarEvents: (dateRange: { start: string; end: string }) => ['calendar', 'events', dateRange] as const,
    calendarConflicts: (dateRange: { start: string; end: string }) => ['calendar', 'conflicts', dateRange] as const,
    calendarResources: ['calendar', 'resources'] as const,

    // Production
    production: ['production'] as const,
    productionOrders: ['production', 'orders'] as const,
    productionStats: (period: string) => ['production', 'stats', period] as const,
    productionMetrics: (period: string) => ['production', 'metrics', period] as const,

    // Warehouse
    warehouse: ['warehouse'] as const,
    warehouseStock: ['warehouse', 'stock'] as const,
    warehouseOperations: (type?: string) => {
        const base = ['warehouse', 'operations'] as const
        return type ? [...base, type] as const : base
    },
    warehouseCategories: ['warehouse', 'categories'] as const,

    // Settings & Configuration
    settings: ['settings'] as const,
    userSettings: (userId: string) => ['settings', 'user', userId] as const,
    systemSettings: ['settings', 'system'] as const,

    // Analytics & Reports
    analytics: ['analytics'] as const,
    report: (type: string, params: Record<string, unknown>) => ['analytics', 'reports', type, params] as const,
    dashboard: (userId: string) => ['analytics', 'dashboard', userId] as const,

    // Speckle & 3D
    speckle: ['speckle'] as const,
    speckleStream: (streamId: string) => ['speckle', 'streams', streamId] as const,
    speckleObject: (streamId: string, objectId: string) => ['speckle', 'streams', streamId, 'objects', objectId] as const,

    // File uploads
    uploads: ['uploads'] as const,
    upload: (uploadId: string) => ['uploads', uploadId] as const,
    uploadProgress: (uploadId: string) => ['uploads', uploadId, 'progress'] as const,
} as const

// Query options with consistent caching strategies
export const QUERY_OPTIONS = {
    // Short-lived data (real-time updates)
    realtime: {
        staleTime: 0,
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 30 * 1000, // 30 seconds
    },

    // Frequently changing data
    frequent: {
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchInterval: 2 * 60 * 1000, // 2 minutes
    },

    // Standard data
    standard: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    },

    // Stable data (rarely changes)
    stable: {
        staleTime: 30 * 60 * 1000, // 30 minutes
        gcTime: 2 * 60 * 60 * 1000, // 2 hours
    },

    // Static data (configuration, settings)
    static: {
        staleTime: 60 * 60 * 1000, // 1 hour
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
    },
} as const

// Query key matchers for invalidation
export const QUERY_MATCHERS = {
    // Invalidate all project-related queries
    allProjects: () => QUERY_KEYS.projects,

    // Invalidate specific project and its related data
    project: (projectId: string) => [
        QUERY_KEYS.project(projectId),
        QUERY_KEYS.projectTiles(projectId),
        QUERY_KEYS.projectMaterials(projectId),
        QUERY_KEYS.projectCosts(projectId),
        QUERY_KEYS.projectTimeline(projectId),
    ],

    // Invalidate all tile-related queries
    allTiles: () => QUERY_KEYS.tiles,

    // Invalidate specific tile and its related data
    tile: (tileId: string) => [
        QUERY_KEYS.tile(tileId),
        QUERY_KEYS.tileBom(tileId),
        QUERY_KEYS.tileDependencies(tileId),
        QUERY_KEYS.tileAttachments(tileId),
        QUERY_KEYS.tileStatus(tileId),
    ],

    // Invalidate all material-related queries
    allMaterials: () => QUERY_KEYS.materials,

    // Invalidate specific material and its related data
    material: (materialId: string) => [
        QUERY_KEYS.material(materialId),
        QUERY_KEYS.materialStock(materialId),
        QUERY_KEYS.materialHistory(materialId),
        QUERY_KEYS.materialSuppliers(materialId),
    ],

    // Invalidate all client-related queries
    allClients: () => QUERY_KEYS.clients,

    // Invalidate specific client and its related data
    client: (clientId: string) => [
        QUERY_KEYS.client(clientId),
        QUERY_KEYS.clientProjects(clientId),
        QUERY_KEYS.clientContacts(clientId),
    ],

    // Invalidate calendar queries for a date range
    calendar: (dateRange?: { start: string; end: string }) => {
        if (dateRange) {
            return [
                QUERY_KEYS.calendarEvents(dateRange),
                QUERY_KEYS.calendarConflicts(dateRange),
            ]
        }
        return [QUERY_KEYS.calendar]
    },

    // Invalidate production data
    production: (period?: string) => {
        if (period) {
            return [
                QUERY_KEYS.productionStats(period),
                QUERY_KEYS.productionMetrics(period),
            ]
        }
        return [QUERY_KEYS.production]
    },

    // Invalidate warehouse data
    warehouse: (type?: string) => {
        if (type) {
            return [QUERY_KEYS.warehouseOperations(type)]
        }
        return [QUERY_KEYS.warehouse]
    },
} as const

// Helper functions for common query patterns
export const queryHelpers = {
    // Get all query keys that should be invalidated when a project changes
    getProjectInvalidationKeys: (projectId: string) => QUERY_MATCHERS.project(projectId),

    // Get all query keys that should be invalidated when a tile changes
    getTileInvalidationKeys: (tileId: string) => QUERY_MATCHERS.tile(tileId),

    // Get all query keys that should be invalidated when a material changes
    getMaterialInvalidationKeys: (materialId: string) => QUERY_MATCHERS.material(materialId),

    // Get all query keys that should be invalidated when a client changes
    getClientInvalidationKeys: (clientId: string) => QUERY_MATCHERS.client(clientId),

    // Check if a query key matches a pattern
    matchesPattern: (queryKey: unknown[], pattern: unknown[]): boolean => {
        if (pattern.length > queryKey.length) return false
        return pattern.every((segment, index) => segment === queryKey[index])
    },

    // Get query options based on data type
    getQueryOptions: (dataType: keyof typeof QUERY_OPTIONS) => QUERY_OPTIONS[dataType],

    // Create a query key with additional parameters
    withParams: <T extends readonly unknown[]>(baseKey: T, ...params: unknown[]): [...T, ...unknown[]] =>
        [...baseKey, ...params] as [...T, ...unknown[]],
}

// Type definitions for better TypeScript support
export type QueryKey = typeof QUERY_KEYS[keyof typeof QUERY_KEYS]
export type QueryOptions = typeof QUERY_OPTIONS[keyof typeof QUERY_OPTIONS]
export type QueryMatcher = typeof QUERY_MATCHERS[keyof typeof QUERY_MATCHERS]

// Export default for convenience
export default QUERY_KEYS
