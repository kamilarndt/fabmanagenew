export type CreateTileDemandPayload = {
    materialId: string
    requiredQty: number
    projectId?: string
    name?: string
}

export async function createTileDemand(tileId: string, payload: CreateTileDemandPayload): Promise<void> {
    const base = import.meta.env.VITE_API_BASE_URL || ''
    const res = await fetch(`${base}/api/tiles/${encodeURIComponent(tileId)}/demands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(`Demand create failed: ${res.status}`)
}


