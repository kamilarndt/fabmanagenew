/**
 * Centralne definicje wszystkich typów enum dla aplikacji FabManage
 */

// ===== PROJECT STATUSES =====
export const PROJECT_STATUSES = {
    NEW: 'new',
    ACTIVE: 'active',
    ON_HOLD: 'on_hold',
    DONE: 'done',
    CANCELLED: 'cancelled'
} as const

export type ProjectStatus =
    | (typeof PROJECT_STATUSES)[keyof typeof PROJECT_STATUSES]
    // Legacy UI labels support (temporary compatibility layer)
    | 'Nowy' | 'W realizacji' | 'Wstrzymany' | 'Zakończony' | 'Anulowany'

// Mapowanie statusów backend → UI
export const PROJECT_STATUS_LABELS: Record<string, string> = {
    [PROJECT_STATUSES.NEW]: 'Nowy',
    [PROJECT_STATUSES.ACTIVE]: 'W realizacji',
    [PROJECT_STATUSES.ON_HOLD]: 'Wstrzymany',
    [PROJECT_STATUSES.DONE]: 'Zakończony',
    [PROJECT_STATUSES.CANCELLED]: 'Anulowany'
}

// ===== TILE STATUSES =====
export const TILE_STATUSES = {
    NEW: 'new',
    IN_PROGRESS: 'in_progress',
    WAITING_FOR_APPROVAL: 'waiting_for_approval',
    APPROVED: 'approved',
    IN_PRODUCTION: 'in_production',
    COMPLETED: 'completed',
    ON_HOLD: 'on_hold',
    CANCELLED: 'cancelled'
} as const

export type TileStatus =
    | (typeof TILE_STATUSES)[keyof typeof TILE_STATUSES]
    // Legacy UI labels support (temporary compatibility layer)
    | 'W KOLEJCE'
    | 'Projektowanie' | 'W trakcie projektowania'
    | 'Do akceptacji' | 'Zaakceptowane' | 'Wymagają poprawek'
    | 'W TRAKCIE CIĘCIA' | 'W produkcji CNC'
    | 'Gotowy do montażu' | 'WYCIĘTE'

export const TILE_STATUS_LABELS: Record<string, string> = {
    [TILE_STATUSES.NEW]: 'Nowy',
    [TILE_STATUSES.IN_PROGRESS]: 'W trakcie',
    [TILE_STATUSES.WAITING_FOR_APPROVAL]: 'Oczekuje na zatwierdzenie',
    [TILE_STATUSES.APPROVED]: 'Zatwierdzony',
    [TILE_STATUSES.IN_PRODUCTION]: 'W produkcji',
    [TILE_STATUSES.COMPLETED]: 'Ukończony',
    [TILE_STATUSES.ON_HOLD]: 'Wstrzymany',
    [TILE_STATUSES.CANCELLED]: 'Anulowany'
}

// ===== MATERIAL STATUSES =====
export const MATERIAL_STATUSES = {
    AVAILABLE: 'available',
    LOW_STOCK: 'low_stock',
    OUT_OF_STOCK: 'out_of_stock',
    ORDERED: 'ordered',
    DISCONTINUED: 'discontinued'
} as const

export type MaterialStatus =
    | (typeof MATERIAL_STATUSES)[keyof typeof MATERIAL_STATUSES]
    // Legacy UI labels support (temporary compatibility layer)
    | 'Na stanie' | 'Niski stan' | 'Brak na stanie' | 'Do zamówienia' | 'Zamówione' | 'Wycofany'

export const MATERIAL_STATUS_LABELS: Record<string, string> = {
    [MATERIAL_STATUSES.AVAILABLE]: 'Dostępny',
    [MATERIAL_STATUSES.LOW_STOCK]: 'Niski stan',
    [MATERIAL_STATUSES.OUT_OF_STOCK]: 'Brak na stanie',
    [MATERIAL_STATUSES.ORDERED]: 'Zamówiony',
    [MATERIAL_STATUSES.DISCONTINUED]: 'Wycofany'
}

// ===== PROJECT TYPES =====
export const PROJECT_TYPES = {
    THEATER: 'Teatr',
    MUSEUM: 'Muzeum',
    EVENT: 'Event',
    INTERIOR: 'Wnętrza',
    TV: 'TV',
    RETAIL: 'Retail',
    CONCERT: 'Koncert'
} as const

export type ProjectType =
    | (typeof PROJECT_TYPES)[keyof typeof PROJECT_TYPES]
    // Compatibility label
    | 'Inne'

// ===== PROJECT MODULES =====
export const PROJECT_MODULES = {
    CONCEPT: 'koncepcja',
    DESIGN: 'projektowanie',
    TECHNICAL_DESIGN: 'projektowanie_techniczne',
    MATERIALS: 'materialy',
    PRODUCTION: 'produkcja',
    LOGISTICS: 'logistyka',
    LOGISTICS_ASSEMBLY: 'logistyka_montaz',
    PRICING: 'wycena',
    ACCOMMODATION: 'zakwaterowanie',
    MODEL_3D: 'model_3d'
} as const

export type ProjectModule = typeof PROJECT_MODULES[keyof typeof PROJECT_MODULES]

export const PROJECT_MODULE_LABELS: Record<ProjectModule, string> = {
    [PROJECT_MODULES.CONCEPT]: 'Koncepcja',
    [PROJECT_MODULES.DESIGN]: 'Projektowanie',
    [PROJECT_MODULES.TECHNICAL_DESIGN]: 'Projektowanie techniczne',
    [PROJECT_MODULES.MATERIALS]: 'Materiały',
    [PROJECT_MODULES.PRODUCTION]: 'Produkcja',
    [PROJECT_MODULES.LOGISTICS]: 'Logistyka',
    [PROJECT_MODULES.LOGISTICS_ASSEMBLY]: 'Logistyka + Montaż',
    [PROJECT_MODULES.PRICING]: 'Wycena',
    [PROJECT_MODULES.ACCOMMODATION]: 'Zakwaterowanie',
    [PROJECT_MODULES.MODEL_3D]: 'Model 3D'
}

// ===== PRIORITIES =====
export const PRIORITIES = {
    LOW: 'Niski',
    MEDIUM: 'Średni',
    HIGH: 'Wysoki',
    URGENT: 'Pilny'
} as const

export type Priority =
    | (typeof PRIORITIES)[keyof typeof PRIORITIES]
    // Legacy values
    | 'low' | 'medium' | 'high' | 'urgent'

// ===== CONNECTION SOURCES =====
export const CONNECTION_SOURCES = {
    DATABASE: 'database',
    LOCAL: 'local',
    MOCK: 'mock'
} as const

export type ConnectionSource = typeof CONNECTION_SOURCES[keyof typeof CONNECTION_SOURCES]

export const CONNECTION_SOURCE_LABELS: Record<ConnectionSource, string> = {
    [CONNECTION_SOURCES.DATABASE]: 'Baza danych',
    [CONNECTION_SOURCES.LOCAL]: 'Dane lokalne',
    [CONNECTION_SOURCES.MOCK]: 'Dane testowe'
}

// ===== UTILITY FUNCTIONS =====

/**
 * Sprawdza czy status projektu jest aktywny
 */
export function isProjectActive(status: ProjectStatus): boolean {
    return status === PROJECT_STATUSES.ACTIVE
}

/**
 * Sprawdza czy status projektu jest zakończony
 */
export function isProjectCompleted(status: ProjectStatus): boolean {
    return status === PROJECT_STATUSES.DONE
}

/**
 * Sprawdza czy kafelek jest w produkcji lub ukończony
 */
export function isTileInProductionOrCompleted(status: TileStatus): boolean {
    return (
        status === TILE_STATUSES.IN_PRODUCTION ||
        status === TILE_STATUSES.COMPLETED ||
        status === 'W TRAKCIE CIĘCIA' ||
        status === 'W produkcji CNC' ||
        status === 'WYCIĘTE' ||
        status === 'Gotowy do montażu'
    )
}

/**
 * Zwraca kolor statusu dla UI
 */
export function getStatusColor(status: ProjectStatus | TileStatus): string {
    switch (status) {
        case PROJECT_STATUSES.NEW:
        case 'Nowy':
        case TILE_STATUSES.NEW:
            return '#1890ff' // blue
        case PROJECT_STATUSES.ACTIVE:
        case 'W realizacji':
        case TILE_STATUSES.IN_PROGRESS:
        case TILE_STATUSES.IN_PRODUCTION:
        case 'Projektowanie':
        case 'W trakcie projektowania':
        case 'W TRAKCIE CIĘCIA':
        case 'W produkcji CNC':
            return '#52c41a' // green
        case PROJECT_STATUSES.ON_HOLD:
        case 'Wstrzymany':
        case TILE_STATUSES.ON_HOLD:
        case TILE_STATUSES.WAITING_FOR_APPROVAL:
        case 'Do akceptacji':
        case 'Wymagają poprawek':
            return '#faad14' // orange
        case PROJECT_STATUSES.DONE:
        case 'Zakończony':
        case TILE_STATUSES.COMPLETED:
        case TILE_STATUSES.APPROVED:
        case 'Zaakceptowane':
        case 'WYCIĘTE':
        case 'Gotowy do montażu':
            return '#13c2c2' // cyan
        case PROJECT_STATUSES.CANCELLED:
        case 'Anulowany':
        case TILE_STATUSES.CANCELLED:
            return '#ff4d4f' // red
        default:
            return '#d9d9d9' // gray
    }
}
