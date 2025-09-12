import { useEffect, useMemo } from 'react';
import CalendarShell from '../components/Calendar/CalendarShell';
import { useCalendarStore } from '../stores/calendarStore';
import { useProjectsStore } from '../stores/projectsStore';

export default function CalendarTeams() {
    const {
        events,
        resources,
        createEvent,
        updateEvent,
        deleteEvent,
        updateEventTimes,
        getEventsByResourceType,
        getResourcesByType
    } = useCalendarStore();

    const { projects } = useProjectsStore();

    // Initialize resources from projects
    useEffect(() => {
        const projectResources = projects.map(project => ({
            id: project.id,
            title: project.name,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            type: 'project' as const,
        }));

        // Add some mock designers and teams
        const mockResources = [
            ...projectResources,
            {
                id: 'designer-1',
                title: 'Anna Kowalska',
                color: '#1890ff',
                type: 'designer' as const,
            },
            {
                id: 'designer-2',
                title: 'Piotr Nowak',
                color: '#52c41a',
                type: 'designer' as const,
            },
            {
                id: 'team-1',
                title: 'Ekipa Tomka',
                color: '#fa8c16',
                type: 'team' as const,
            },
            {
                id: 'team-2',
                title: 'Ekipa Józefa',
                color: '#eb2f96',
                type: 'team' as const,
            },
        ];

        useCalendarStore.getState().setResources(mockResources);
    }, [projects]);

    const teamEvents = useMemo(() => {
        return getEventsByResourceType('team');
    }, [events, getEventsByResourceType]);

    const teamResources = useMemo(() => {
        return getResourcesByType('team');
    }, [resources, getResourcesByType]);

    const handleEventCreate = (eventData: Omit<import('../stores/calendarStore').CalendarEvent, 'id'>) => {
        createEvent(eventData);
    };

    const handleEventUpdate = (id: string, updates: Partial<import('../stores/calendarStore').CalendarEvent>) => {
        updateEvent(id, updates);
    };

    const handleEventDelete = (id: string) => {
        deleteEvent(id);
    };

    const handleEventDrop = (event: import('../stores/calendarStore').CalendarEvent, start: Date, end: Date, resourceId?: string) => {
        updateEventTimes(event.id, start, end, resourceId);
    };

    const handleEventResize = (event: import('../stores/calendarStore').CalendarEvent, start: Date, end: Date) => {
        updateEventTimes(event.id, start, end);
    };

    return (
        <CalendarShell
            mode="teams"
            title="Kalendarz Ekip"
            resources={teamResources}
            events={teamEvents}
            onEventCreate={handleEventCreate}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            showResourceColumns={true}
        />
    );
}
