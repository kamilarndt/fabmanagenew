import { useState, useCallback, useMemo } from 'react';
import { Typography, Button, Segmented, Card, Progress, Tooltip, Alert, Space, Select } from 'antd';
import { Calendar as RBCalendar, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { localizer } from '../../lib/calendarLocalizer';
import type { CalendarEvent, CalendarResource } from '../../stores/calendarStore';
import EventFormModal from './EventFormModal';

const DnDCalendar = withDragAndDrop<CalendarEvent, CalendarResource>(RBCalendar as any);

type CalendarMode = 'projects' | 'designers' | 'teams';

type CalendarShellProps = {
    mode: CalendarMode;
    title: string;
    resources: CalendarResource[];
    events: CalendarEvent[];
    onEventCreate: (event: Omit<CalendarEvent, 'id'>) => void;
    onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
    onEventDelete: (id: string) => void;
    onEventDrop: (event: CalendarEvent, start: Date, end: Date, resourceId?: string) => void;
    onEventResize: (event: CalendarEvent, start: Date, end: Date) => void;
    onEventClick?: (event: CalendarEvent) => void;
    onDropFromOutside?: (start: Date, end: Date, allDay?: boolean) => void;
    dragFromOutsideItem?: () => CalendarEvent | null;
    showResourceColumns?: boolean;
    phaseFilter?: string[];
    onPhaseFilterChange?: (phases: string[]) => void;
};

export default function CalendarShell({
    title,
    resources,
    events,
    onEventCreate,
    onEventUpdate,
    onEventDelete,
    onEventDrop,
    onEventResize,
    onEventClick,
    phaseFilter = [],
    onPhaseFilterChange,
}: CalendarShellProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<CalendarEvent | null>(null);
    const [pendingRange, setPendingRange] = useState<{ start: Date; end: Date } | null>(null);
    const [resourceFilter, setResourceFilter] = useState<string | undefined>(undefined);
    const [currentView, setCurrentView] = useState<string>(Views.WEEK);

    const filteredEvents = useMemo(() => {
        let filtered = events;

        if (resourceFilter) {
            filtered = filtered.filter(e => e.resourceId === resourceFilter);
        }

        if (phaseFilter.length > 0) {
            filtered = filtered.filter(e => e.phase && phaseFilter.includes(e.phase));
        }

        return filtered;
    }, [events, resourceFilter, phaseFilter]);

    const handleSelectSlot = useCallback(({ start, end }: any) => {
        setEditing(null);
        setPendingRange({ start, end });
        setModalOpen(true);
    }, []);

    const handleSelectEvent = useCallback((event: CalendarEvent) => {
        setEditing(event);
        setModalOpen(true);
        onEventClick?.(event);
    }, [onEventClick]);

    const handleEventDrop = useCallback(({ event, start, end, resourceId }: any) => {
        onEventDrop(event, start, end, resourceId);
    }, [onEventDrop]);

    const handleEventResize = useCallback(({ event, start, end }: any) => {
        onEventResize(event, start, end);
    }, [onEventResize]);

    const handleCreateOrUpdate = useCallback((values: Omit<CalendarEvent, 'id'>) => {
        if (editing) {
            onEventUpdate(editing.id, values);
        } else {
            onEventCreate(values);
        }
        setModalOpen(false);
        setEditing(null);
        setPendingRange(null);
    }, [editing, onEventCreate, onEventUpdate]);

    const handleDelete = useCallback(() => {
        if (editing) {
            onEventDelete(editing.id);
            setModalOpen(false);
            setEditing(null);
        }
    }, [editing, onEventDelete]);


    // Workload calculation
    const workload = useMemo(() => {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        return resources.map(resource => {
            const resourceEvents = filteredEvents.filter(e => e.resourceId === resource.id);
            const weekEvents = resourceEvents.filter(e =>
                e.start <= weekEnd && e.end >= weekStart
            );

            const totalHours = weekEvents.reduce((sum, e) => {
                const duration = (e.end.getTime() - e.start.getTime()) / (1000 * 60 * 60);
                return sum + duration;
            }, 0);

            const percentage = Math.min((totalHours / 40) * 100, 100); // 40h week

            return {
                resource,
                percentage,
                hours: totalHours,
                events: weekEvents.length,
            };
        });
    }, [resources, filteredEvents]);

    const hasConflicts = useMemo(() => {
        const conflicts: { resource: string; events: CalendarEvent[] }[] = [];

        resources.forEach(resource => {
            const resourceEvents = filteredEvents.filter(e => e.resourceId === resource.id);
            const sortedEvents = resourceEvents.sort((a, b) => a.start.getTime() - b.start.getTime());

            for (let i = 0; i < sortedEvents.length - 1; i++) {
                if (sortedEvents[i].end > sortedEvents[i + 1].start) {
                    conflicts.push({
                        resource: resource.title,
                        events: [sortedEvents[i], sortedEvents[i + 1]],
                    });
                }
            }
        });

        return conflicts;
    }, [resources, filteredEvents]);

    return (
        <div>
            <Typography.Title level={4} style={{ marginTop: 0 }}>{title}</Typography.Title>

            <div style={{ height: '75vh', backgroundColor: 'var(--bg-card)', padding: '1rem' }}>
                <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, width: '100%' }}>
                    <Space>
                        <Select
                            allowClear
                            placeholder="Filtr zasobu"
                            style={{ minWidth: 240 }}
                            value={resourceFilter}
                            onChange={(v) => setResourceFilter(v)}
                            options={resources.map(r => ({
                                value: r.id,
                                label: (
                                    <span>
                                        <span style={{ display: 'inline-block', width: 10, height: 10, background: r.color, marginRight: 8 }} />
                                        {r.title}
                                    </span>
                                )
                            }))}
                        />

                        {onPhaseFilterChange && (
                            <Select
                                mode="multiple"
                                placeholder="Filtr faz"
                                style={{ minWidth: 200 }}
                                value={phaseFilter}
                                onChange={onPhaseFilterChange}
                                options={[
                                    { value: 'projektowanie', label: 'Projektowanie' },
                                    { value: 'wycinanie', label: 'Wycinanie' },
                                    { value: 'produkcja', label: 'Produkcja' },
                                ]}
                            />
                        )}

                        <Segmented
                            options={[
                                { label: 'Miesiąc', value: Views.MONTH },
                                { label: 'Tydzień', value: Views.WEEK },
                                { label: 'Dzień', value: Views.DAY }
                            ]}
                            value={currentView}
                            onChange={(val) => setCurrentView(val as string)}
                        />
                    </Space>

                    <Button
                        type="primary"
                        onClick={() => {
                            setEditing(null);
                            setPendingRange({
                                start: new Date(),
                                end: new Date(new Date().getTime() + 60 * 60 * 1000)
                            });
                            setModalOpen(true)
                        }}
                    >
                        Dodaj
                    </Button>
                </Space>

                {hasConflicts.length > 0 && (
                    <Alert
                        message="Wykryto konflikty w harmonogramie"
                        description={
                            <div>
                                {hasConflicts.map((conflict, i) => (
                                    <div key={i} style={{ marginBottom: 4 }}>
                                        <strong>{conflict.resource}:</strong> {conflict.events.map(e => e.title).join(' vs ')}
                                    </div>
                                ))}
                            </div>
                        }
                        type="warning"
                        showIcon
                        style={{ marginBottom: 8 }}
                    />
                )}

                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                        <DnDCalendar
                            localizer={localizer}
                            events={filteredEvents}
                            startAccessor="start"
                            endAccessor="end"
                            defaultView={Views.WEEK}
                            views={[Views.MONTH, Views.WEEK, Views.DAY]}
                            view={currentView as any}
                            onView={(v) => setCurrentView(v as string)}
                            selectable
                            resizable
                            onSelectSlot={handleSelectSlot as any}
                            onSelectEvent={handleSelectEvent as any}
                            onEventDrop={handleEventDrop as any}
                            onEventResize={handleEventResize as any}
                            resources={resources}
                            resourceAccessor="id"
                            resourceIdAccessor={(resource: CalendarResource) => resource.id}
                            messages={{
                                allDay: 'Cały dzień',
                                previous: 'Poprzedni',
                                next: 'Następny',
                                today: 'Dzisiaj',
                                month: 'Miesiąc',
                                week: 'Tydzień',
                                day: 'Dzień',
                                agenda: 'Agenda',
                                date: 'Data',
                                time: 'Czas',
                                event: 'Wydarzenie',
                                noEventsInRange: 'Brak wydarzeń w tym zakresie',
                                showMore: (total: number) => `+${total} więcej`,
                            }}
                        />
                    </div>

                    <Card title="Obłożenie zasobów" style={{ width: 280 }}>
                        <div style={{ maxHeight: 400, overflow: 'auto' }}>
                            {workload.map(({ resource, percentage, hours, events }) => (
                                <div key={resource.id} style={{ marginBottom: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{resource.title}</span>
                                        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{hours.toFixed(1)}h</span>
                                    </div>
                                    <Tooltip title={`${events} wydarzeń, ${hours.toFixed(1)}h`}>
                                        <Progress
                                            percent={percentage}
                                            size="small"
                                            strokeColor={resource.color}
                                            showInfo={false}
                                        />
                                    </Tooltip>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <EventFormModal
                    open={modalOpen}
                    initial={editing ?? (pendingRange ? { start: pendingRange.start, end: pendingRange.end } : undefined)}
                    resources={resources}
                    onCancel={() => { setModalOpen(false); setEditing(null); setPendingRange(null) }}
                    onSubmit={handleCreateOrUpdate}
                    onDelete={editing ? handleDelete : undefined}
                />
            </div>
        </div>
    );
}
