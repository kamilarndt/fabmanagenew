import { apiFetch } from './client'

export type Material = {
    id: string
    category: string
    name: string
    unit: string
    unitCost: number
    description?: string
}

export async function fetchMaterials(): Promise<Material[]> {
    return apiFetch<Material[]>('/api/materials', { method: 'GET' })
}

export async function postEstimate(payload: {
    projectId: string
    lineItems: { materialId: string; quantity: number }[]
    laborRate: number
    discountRate: number
}) {
    const base = import.meta.env.VITE_API_BASE_URL || ''
    const res = await fetch(`${base}/api/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/pdf')) {
        return await res.blob()
    }
    const data = await res.json()
    const b = Uint8Array.from(atob(data.pdf), c => c.charCodeAt(0))
    return new Blob([b], { type: 'application/pdf' })
}


