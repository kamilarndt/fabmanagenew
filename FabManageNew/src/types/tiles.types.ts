export type BomItem = {
    id: string
    type: 'Materiał surowy' | 'Komponent gotowy' | 'Usługa'
    name: string
    quantity: number
    unit: string
    supplier?: string
    status?: 'Na stanie' | 'Do zamówienia' | 'Zamówione'
    unitCost?: number
}

export type Tile = {
    id: string
    name: string
    status: 'W KOLEJCE' | 'W TRAKCIE CIĘCIA' | 'WYCIĘTE' | 'Projektowanie' | 'W trakcie projektowania' | 'Do akceptacji' | 'Zaakceptowane' | 'Wymagają poprawek' | 'Gotowy do montażu'
    project?: string
    priority?: 'Wysoki' | 'Średni' | 'Niski'
    technology?: string
    bom?: BomItem[]
    laborCost?: number
    assignee?: string
    dxfFile?: string | null
    assemblyDrawing?: string | null
    group?: string
}
