import type { TileStatus, MaterialStatus, Priority } from './enums'

export type { TileStatus, MaterialStatus, Priority }

export type BomItem = {
    id: string
    type: 'Materiał surowy' | 'Komponent gotowy' | 'Usługa'
    name: string
    quantity: number
    unit: string
    supplier?: string
    status?: MaterialStatus
    unitCost?: number
    materialId?: string
}

export type Tile = {
    id: string
    name: string
    status: TileStatus
    project?: string
    moduł_nadrzędny?: string // np. "Scena Główna"
    opis?: string
    link_model_3d?: string
    speckle_object_ids?: string[]
    załączniki?: string[] // URLs do plików
    przypisany_projektant?: string
    termin?: string
    priority?: Priority
    estimated_cost?: number // Szacowany koszt robocizny w PLN
    technology?: string // deprecated - usunięte zgodnie z redesignem
    bom?: BomItem[]
    laborCost?: number // deprecated, use estimated_cost
    assignee?: string // deprecated, use przypisany_projektant
    dxfFile?: string | null
    assemblyDrawing?: string | null
    group?: string
    dependencies?: string[]
    // Speckle 3D Integration fields
    geometry_data?: any // JSONB geometry data from Speckle
    screenshot_url?: string // URL to 3D screenshot
    material_assignments?: any // JSONB material assignment data
}

export type TileMaterial = {
    id: string
    tile_id: string
    material_id?: string
    speckle_object_id?: string
    volume_m3?: number
    area_m2?: number
    estimated_plates?: number
    waste_percentage?: number
    created_at?: string
}
