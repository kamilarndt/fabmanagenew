import { create } from 'zustand'

export type CalendarResource = {
    id: string
    title: string
    color: string
    type: 'project' | 'designer' | 'team'
}

export type CalendarEvent = {
    id: string
    title: string
    start: Date
    end: Date
    allDay?: boolean
    resourceId?: string
    eventType?: 'task' | 'milestone' | 'phase'
    phase?: 'projektowanie' | 'wycinanie' | 'produkcja'
    designerId?: string
    teamId?: string
    tags?: string[]
    meta?: {
        tileId?: string
        projectId?: string
    }
}

type CalendarState = {
    events: CalendarEvent[]
    resources: CalendarResource[]
    setEvents: (events: CalendarEvent[]) => void
    setResources: (resources: CalendarResource[]) => void
    createEvent: (event: Omit<CalendarEvent, 'id'>) => CalendarEvent
    updateEvent: (id: string, updates: Partial<Omit<CalendarEvent, 'id'>>) => void
    deleteEvent: (id: string) => void
    updateEventTimes: (id: string, start: Date, end: Date, resourceId?: string) => void
    // Selektory
    getEventsByProject: (projectId: string) => CalendarEvent[]
    getEventsByDesigner: (designerId: string) => CalendarEvent[]
    getEventsByTeam: (teamId: string) => CalendarEvent[]
    getEventsByResourceType: (type: 'project' | 'designer' | 'team') => CalendarEvent[]
    getResourcesByType: (type: 'project' | 'designer' | 'team') => CalendarResource[]
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
    events: [],
    resources: [],
    setEvents: (events) => set({ events }),
    setResources: (resources) => set({ resources }),
    createEvent: (event) => {
        const newEvent: CalendarEvent = { id: crypto.randomUUID(), ...event }
        set((state) => ({ events: [...state.events, newEvent] }))
        return newEvent
    },
    updateEvent: (id, updates) => {
        set((state) => ({
            events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }))
    },
    deleteEvent: (id) => {
        set((state) => ({ events: state.events.filter((e) => e.id !== id) }))
    },
    updateEventTimes: (id, start, end, resourceId) => {
        set((state) => ({
            events: state.events.map((e) =>
                e.id === id ? { ...e, start, end, resourceId: resourceId ?? e.resourceId } : e,
            ),
        }))
    },
    // Selektory
    getEventsByProject: (projectId) => {
        const state = get()
        return state.events.filter(e => e.meta?.projectId === projectId)
    },
    getEventsByDesigner: (designerId) => {
        const state = get()
        return state.events.filter(e => e.designerId === designerId || e.resourceId === designerId)
    },
    getEventsByTeam: (teamId) => {
        const state = get()
        return state.events.filter(e => e.teamId === teamId || e.resourceId === teamId)
    },
    getEventsByResourceType: (type) => {
        const state = get()
        return state.events.filter(e => {
            const resource = state.resources.find(r => r.id === e.resourceId)
            return resource?.type === type
        })
    },
    getResourcesByType: (type) => {
        const state = get()
        return state.resources.filter(r => r.type === type)
    },
}))



