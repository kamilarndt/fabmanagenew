export type ProjectModule = 'wycena' | 'koncepcja' | 'projektowanie_techniczne' | 'produkcja' | 'materialy' | 'logistyka_montaz' | 'zakwaterowanie' | 'montaz'

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
    typ: 'Targi' | 'Scenografia TV' | 'Muzeum' | 'Wystawa' | 'Event' | 'Inne'
    lokalizacja: string
    clientId: string
    client: string
    status: 'Nowy' | 'Wyceniany' | 'W realizacji' | 'Zakończony' | 'Wstrzymany'
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
}

export type ProjectWithStats = Project & {
    modulesCount: number
    tilesCount: number
}
