import type { ProjectStatus, ProjectModule, ProjectType, Priority } from './enums'

export type { ProjectStatus, ProjectModule, ProjectType, Priority }

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
    numer: string // np. P-2025/09/01
    name: string
    typ: ProjectType
    lokalizacja: string
    clientId: string
    client: string
    status: ProjectStatus
    data_utworzenia: string
    data_rozpoczęcia?: string
    deadline: string
    postep: number // w procentach
    budget?: number
    manager?: string
    manager_id?: string
    description?: string
    miniatura?: string // URL do obrazka
    repozytorium_plikow?: string // link
    link_model_3d?: string // np. link do Speckle
    progress?: number // deprecated, use postep
    groups?: ProjectGroup[]
    modules?: ProjectModule[]
    clientColor?: string
    colorScheme?: {
        primary: string
        light: string
        dark: string
        accent: string
    }
    // Speckle 3D Integration fields
    speckle_stream_url?: string
    speckle_stream_id?: string
    model_3d_status?: 'not_loaded' | 'loading' | 'loaded' | 'error'
}

export type ProjectWithStats = Project & {
    modulesCount: number
    tilesCount: number
}
