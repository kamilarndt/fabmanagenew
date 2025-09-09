export type BomItem = {
    id: string
    type: 'Materiał surowy' | 'Komponent gotowy' | 'Usługa'
    name: string
    quantity: number
    unit: string
    supplier?: string
    status?: 'Na stanie' | 'Do zamówienia' | 'Zamówione'
    unitCost?: number
    materialId?: string
}

export type Tile = {
    id: string
    name: string
    status: 'W KOLEJCE' | 'W TRAKCIE CIĘCIA' | 'WYCIĘTE' | 'Projektowanie' | 'W trakcie projektowania' | 'Do akceptacji' | 'Zaakceptowane' | 'Wymagają poprawek' | 'Gotowy do montażu' | 'Wstrzymany' | 'Zakończony' | 'W produkcji CNC'
    project?: string
    moduł_nadrzędny?: string // np. "Scena Główna"
    opis?: string
    link_model_3d?: string
    załączniki?: string[] // URLs do plików
    przypisany_projektant?: string
    termin?: string
    priority?: 'Wysoki' | 'Średni' | 'Niski' // deprecated - priorytet zarządzany w module Działu Projektowego
    technology?: string // deprecated - usunięte zgodnie z redesignem
    bom?: BomItem[]
    laborCost?: number
    assignee?: string // deprecated, use przypisany_projektant
    dxfFile?: string | null
    assemblyDrawing?: string | null
    group?: string
}
