import { api } from '../lib/httpClient'

export type Material = {
    id: string
    category: string
    name: string
    unit: string
    unitCost: number
    description?: string
}

export async function fetchMaterials(): Promise<Material[]> {
    return api.call<Material[]>('/api/materials', {
        method: 'GET',
        table: 'materials'
    })
}

export async function postEstimate(payload: {
    projectId: string
    lineItems: { materialId: string; quantity: number }[]
    laborRate: number
    discountRate: number
}): Promise<Blob> {
    // Special handling for PDF responses - use direct HTTP call
    const response = await api.post<ArrayBuffer>('/api/estimate', payload, {
        responseType: 'arraybuffer',
        headers: {
            'Accept': 'application/pdf'
        }
    })

    return new Blob([response], { type: 'application/pdf' })
}


