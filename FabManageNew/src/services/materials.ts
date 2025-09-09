export type BomRow = { project_id: string | null; name: string; unit: string; quantity: number }

export async function fetchProjectBom(projectId: string): Promise<BomRow[]> {
    try {
        const res = await fetch(`/api/materials/bom?projectId=${encodeURIComponent(projectId)}`)
        if (res.ok) {
            return await res.json()
        }
    } catch { }
    return []
}
