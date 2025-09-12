export type BackendFlatMaterial = {
    id: string
    name: string // fullPath like _MATERIAL::MDF::18mm
    stock: number
    minStock: number
    price?: number
    supplier?: string
    location?: string
    unit?: string
    materialType?: string
    category?: string[]
}

function getBase(baseUrl?: string) {
    return baseUrl || (import.meta.env.VITE_API_BASE_URL || '')
}

export async function reloadMaterials(baseUrl?: string): Promise<boolean> {
    const base = getBase(baseUrl)
    try {
        const res = await fetch(`${base}/api/materials/reload`, { method: 'POST' })
        return res.ok
    } catch {
        return false
    }
}

export async function fetchBackendFlatMaterials(baseUrl?: string): Promise<BackendFlatMaterial[]> {
    const base = getBase(baseUrl)
    const res = await fetch(`${base}/api/materials/flat`)
    if (!res.ok) throw new Error(`materials/flat ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data as BackendFlatMaterial[]
}


