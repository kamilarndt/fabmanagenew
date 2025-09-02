import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Accommodation = {
    id: string
    projectId: string
    hotelName: string
    address?: string
    fromDate: string
    toDate: string
    rooms?: number
    contact?: string
    cost?: number
    notes?: string
}

type AccommodationState = {
    byProject: Record<string, Accommodation[]>
    add: (projectId: string, data: Omit<Accommodation, 'id' | 'projectId'>) => Accommodation
    remove: (projectId: string, id: string) => void
    update: (projectId: string, id: string, data: Partial<Accommodation>) => void
}

export const useAccommodationStore = create<AccommodationState>()(
    persist(
        (set, get) => ({
            byProject: {},
            add: (projectId, data) => {
                const acc: Accommodation = { id: crypto.randomUUID(), projectId, ...data }
                const current = get().byProject[projectId] || []
                set({ byProject: { ...get().byProject, [projectId]: [...current, acc] } })
                return acc
            },
            remove: (projectId, id) => {
                const current = get().byProject[projectId] || []
                set({ byProject: { ...get().byProject, [projectId]: current.filter(a => a.id !== id) } })
            },
            update: (projectId, id, data) => {
                const current = get().byProject[projectId] || []
                set({ byProject: { ...get().byProject, [projectId]: current.map(a => a.id === id ? { ...a, ...data } : a) } })
            }
        }),
        { name: 'fabmanage-accommodation' }
    )
)


