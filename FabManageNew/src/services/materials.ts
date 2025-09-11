import { api } from '../lib/httpClient'

export type BomRow = { project_id: string | null; name: string; unit: string; quantity: number }

export async function fetchProjectBom(projectId: string): Promise<BomRow[]> {
    try {
        const res = await fetch(`/api/materials/bom?projectId=${encodeURIComponent(projectId)}`)
        if (res.ok) {
            return await res.json()
        }
    } catch (error) {
        console.error('Failed to fetch BOM:', error)
    }
    return []
}

export async function assignMaterialToObjects(tileId: string, objectIds: string[], materialId: string, extras?: { quantityPerObject?: number; unit?: string; area?: number; volume?: number }) {
    const body = {
        objectIds,
        material_id: materialId,
        quantity_per_object: extras?.quantityPerObject,
        unit: extras?.unit,
        area: extras?.area,
        volume: extras?.volume
    }
    return api.call(`/api/tiles/${tileId}/object-materials`, { method: 'POST', data: body, useSupabase: false })
}

export async function getTileObjectMaterials(tileId: string) {
    return api.call(`/api/tiles/${tileId}/object-materials`, { method: 'GET', useSupabase: false })
}

export async function removeObjectMaterial(tileId: string, objectId: string) {
    return api.call(`/api/tiles/${tileId}/object-materials/${objectId}`, { method: 'DELETE', useSupabase: false })
}
