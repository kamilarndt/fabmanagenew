import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ConceptFile = {
    id: string
    name: string
    size: number
    type: string
    url: string
}

type ProjectConcept = {
    files: ConceptFile[]
    miro?: { id: string; url: string }
}

type ConceptState = {
    byProject: Record<string, ProjectConcept>
    addFiles: (projectId: string, files: ConceptFile[]) => void
    removeFile: (projectId: string, fileId: string) => void
    setMiro: (projectId: string, miro: { id: string; url: string }) => void
}

export const useConceptStore = create<ConceptState>()(
    persist(
        (set, get) => ({
            byProject: {},
            addFiles: (projectId, files) => {
                const current = get().byProject[projectId] || { files: [] }
                set({
                    byProject: {
                        ...get().byProject,
                        [projectId]: { ...current, files: [...current.files, ...files] }
                    }
                })
            },
            removeFile: (projectId, fileId) => {
                const current = get().byProject[projectId] || { files: [] }
                set({
                    byProject: {
                        ...get().byProject,
                        [projectId]: { ...current, files: current.files.filter(f => f.id !== fileId) }
                    }
                })
            },
            setMiro: (projectId, miro) => {
                const current = get().byProject[projectId] || { files: [] }
                set({ byProject: { ...get().byProject, [projectId]: { ...current, miro } } })
            }
        }),
        { name: 'fabmanage-concept' }
    )
)



