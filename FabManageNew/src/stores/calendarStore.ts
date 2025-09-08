import { create } from 'zustand'

export type CalendarResource = {
    id: string
    title: string
    color: string
}

export type CalendarEvent = {
    id: string
    title: string
    start: Date
    end: Date
    allDay?: boolean
    resourceId?: string
    phase?: 'projektowanie' | 'wycinanie' | 'produkcja'
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
}

export const useCalendarStore = create<CalendarState>((set) => ({
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
}))



