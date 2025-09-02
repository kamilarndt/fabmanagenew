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
    clientId: string
    client: string
    status: 'Active' | 'On Hold' | 'Done'
    deadline: string
    budget?: number
    manager?: string
    description?: string
    progress?: number
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
