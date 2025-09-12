export type CreateTileDemandPayload = {
    materialId: string
    requiredQty: number
    projectId?: string
    name?: string
}

export type Demand = {
    id: string
    materialId: string
    name: string
    requiredQty: number
    createdAt: string
    status: string
    projectId?: string | null
    tileId?: string | null
}

const base = import.meta.env.VITE_API_BASE_URL || ''

export async function createTileDemand(tileId: string, payload: CreateTileDemandPayload): Promise<Demand> {
    const res = await fetch(`${base}/api/tiles/${encodeURIComponent(tileId)}/demands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(`Demand create failed: ${res.status}`)
    return res.json()
}

export async function createDemand(payload: CreateTileDemandPayload & { tileId?: string }): Promise<Demand> {
    const res = await fetch(`${base}/api/demands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(`Demand create failed: ${res.status}`)
    return res.json()
}

export async function listDemands(params?: { projectId?: string; tileId?: string }): Promise<Demand[]> {
    const qs = new URLSearchParams()
    if (params?.projectId) qs.set('projectId', params.projectId)
    if (params?.tileId) qs.set('tileId', params.tileId)
    const url = `${base}/api/demands${qs.toString() ? `?${qs.toString()}` : ''}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Demand list failed: ${res.status}`)
    return res.json()
}


