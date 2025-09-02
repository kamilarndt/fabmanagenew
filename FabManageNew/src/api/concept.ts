import { apiFetch } from './client'

export async function createMiroBoard(projectId: string): Promise<{ id: string; url: string }> {
    return apiFetch<{ id: string; url: string }>("/api/concept/miro/boards", {
        method: 'POST',
        json: { projectId }
    })
}



