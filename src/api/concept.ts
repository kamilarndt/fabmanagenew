import { api } from '../lib/httpClient'

export async function createMiroBoard(projectId: string): Promise<{ id: string; url: string }> {
    return api.post<{ id: string; url: string }>("/api/concept/miro/boards", { projectId })
}



