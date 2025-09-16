import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ActivityCategory = 'activity' | 'update'

export type ActivityItem = {
    id: string
    projectId: string
    category: ActivityCategory
    text: string
    userName: string
    userAvatar?: string
    timestamp: number
}

type ActivityState = {
    items: ActivityItem[]
    add: (item: Omit<ActivityItem, 'id' | 'timestamp'> & { timestamp?: number }) => void
    getByProject: (projectId: string, category?: ActivityCategory) => ActivityItem[]
}

export const useActivityStore = create<ActivityState>()(
    persist(
        (set, get) => ({
            items: [],
            add: (item) => {
                const newItem: ActivityItem = {
                    id: crypto.randomUUID(),
                    timestamp: item.timestamp ?? Date.now(),
                    ...item
                }
                set(state => ({ items: [newItem, ...state.items] }))
            },
            getByProject: (projectId, category) => {
                const list = get().items.filter(i => i.projectId === projectId)
                return category ? list.filter(i => i.category === category) : list
            }
        }),
        { name: 'fabmanage-activity' }
    )
)


