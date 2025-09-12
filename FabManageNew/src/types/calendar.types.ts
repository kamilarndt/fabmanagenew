export type CalendarResource = {
    id: string
    title: string
}

export type CalendarEvent = {
    id: string
    resourceId: string
    title: string
    start: string
    end: string
    backgroundColor?: string
    borderColor?: string
    extendedProps: {
        type: 'PROJECT_MILESTONE' | 'TILE_PRODUCTION' | 'CONCEPT_WORK' | 'DESIGN_TASK' | 'MEETING' | 'VACATION'
        status?: 'planned' | 'in-progress' | 'completed' | 'delayed'
        tileId?: string
        projectId?: string
        notes?: string
    }
}



