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

export type GanttTask = {
    id: string
    text: string
    start_date: string // 'YYYY-MM-DD'
    duration: number // days
    parent?: string
    progress?: number // 0..1
    type?: 'project' | 'module' | 'task'
    status?: string
    dependencies?: string // comma-separated ids
}

type CalendarState = {
    events: CalendarEvent[]
    resources: CalendarResource[]
    ganttTasks: GanttTask[]
    setEvents: (events: CalendarEvent[]) => void
    setResources: (resources: CalendarResource[]) => void
    setGanttTasks: (tasks: GanttTask[]) => void
    updateGanttTask: (id: string, updates: Partial<GanttTask>) => void
    addGanttTask: (task: GanttTask) => void
    createEvent: (event: Omit<CalendarEvent, 'id'>) => CalendarEvent
    updateEvent: (id: string, updates: Partial<Omit<CalendarEvent, 'id'>>) => void
    deleteEvent: (id: string) => void
    updateEventTimes: (id: string, start: Date, end: Date, resourceId?: string) => void
    autoSchedule: (opts: { resourceId: string; tasks: Array<{ title: string; durationH: number; meta?: CalendarEvent['meta']; phase?: CalendarEvent['phase'] }>; dayStart?: string; dayEnd?: string; slotMinutes?: number }) => CalendarEvent[]
    exportWeekToBlob: (weekStart: Date, filterResourceId?: string) => Promise<Blob>
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
    ganttTasks: [],
    setEvents: (events) => set({ events }),
    setResources: (resources) => set({ resources }),
    setGanttTasks: (tasks) => set({ ganttTasks: tasks }),
    updateGanttTask: (id, updates) => set(state => ({ ganttTasks: state.ganttTasks.map(t => t.id === id ? { ...t, ...updates } : t) })),
    addGanttTask: (task) => set(state => ({ ganttTasks: [...state.ganttTasks, task] })),
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
    autoSchedule: ({ resourceId, tasks, dayStart = '09:00', dayEnd = '17:00', slotMinutes = 30 }) => {
        const state = get()
        const dayStartParts = dayStart.split(':').map(Number)
        const dayEndParts = dayEnd.split(':').map(Number)
        const result: CalendarEvent[] = []
        const now = new Date()
        let cursor = new Date(now)
        cursor.setHours(dayStartParts[0], dayStartParts[1], 0, 0)
        const endOfDay = (d: Date) => {
            const eod = new Date(d)
            eod.setHours(dayEndParts[0], dayEndParts[1], 0, 0)
            return eod
        }
        const step = slotMinutes * 60 * 1000
        const isFree = (start: Date, end: Date) => {
            const conflicts = state.events.filter(e => (e.resourceId === resourceId) && !(e.end <= start || e.start >= end))
            return conflicts.length === 0
        }
        for (const task of tasks) {
            let remainingMs = task.durationH * 60 * 60 * 1000
            while (remainingMs > 0) {
                if (cursor > endOfDay(cursor)) {
                    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1, dayStartParts[0], dayStartParts[1], 0, 0)
                }
                const slotEnd = new Date(cursor.getTime() + Math.min(step, remainingMs))
                if (slotEnd > endOfDay(cursor)) {
                    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1, dayStartParts[0], dayStartParts[1], 0, 0)
                    continue
                }
                if (isFree(cursor, slotEnd)) {
                    const newEvent: CalendarEvent = {
                        id: crypto.randomUUID(),
                        title: task.title,
                        start: new Date(cursor),
                        end: slotEnd,
                        resourceId,
                        phase: task.phase,
                        meta: task.meta
                    }
                    result.push(newEvent)
                    set((state) => ({ events: [...state.events, newEvent] }))
                    remainingMs -= (slotEnd.getTime() - cursor.getTime())
                    cursor = new Date(slotEnd)
                } else {
                    cursor = new Date(cursor.getTime() + step)
                }
            }
        }
        return result
    },
    exportWeekToBlob: async (weekStart: Date, filterResourceId?: string) => {
        const state = get()
        const ws = new Date(weekStart)
        const we = new Date(ws)
        we.setDate(ws.getDate() + 7)
        const events = state.events.filter(e => e.start >= ws && e.end <= we && (!filterResourceId || e.resourceId === filterResourceId))
        const lines = ['Harmonogram tygodniowy', '', ...events.map(e => `${e.start.toLocaleString()} - ${e.end.toLocaleString()} | ${e.title} | ${state.resources.find(r => r.id === e.resourceId)?.title ?? ''}`)]
        const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
        return blob
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



