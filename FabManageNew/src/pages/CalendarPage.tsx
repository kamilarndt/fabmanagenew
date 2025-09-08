import { useEffect, useState, useCallback, useMemo } from 'react'
import { Typography, Button, Select, Space, Alert, Segmented, Progress, Card } from 'antd'
import { Calendar as RBCalendar, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import { useCalendarStore, type CalendarEvent, type CalendarResource } from '../stores/calendarStore'
import { localizer } from '../lib/calendarLocalizer'
import EventFormModal from '../components/Calendar/EventFormModal'

const MOCK_RESOURCES: CalendarResource[] = [
    { id: 'designer-kamil-a', title: 'Kamil Arndt', color: 'var(--primary-main)' },
    { id: 'designer-anna-k', title: 'Anna Kowalska', color: '#eb2f96' },
    { id: 'team-tomek', title: 'Ekipa Tomka', color: '#52c41a' },
]

const MOCK_EVENTS: Omit<CalendarEvent, 'id'>[] = [
    {
        title: 'Projektowanie: Panel frontowy',
        start: new Date(2025, 8, 8, 10, 0, 0),
        end: new Date(2025, 8, 10, 14, 0, 0),
        resourceId: 'designer-kamil-a',
        meta: { projectId: 'P-001' },
    },
    {
        title: 'Montaż: Stoisko TVP',
        start: new Date(2025, 8, 9, 8, 0, 0),
        end: new Date(2025, 8, 12, 16, 0, 0),
        resourceId: 'team-tomek',
        meta: { projectId: 'P-002' },
    },
]

const DnDCalendar = withDragAndDrop<CalendarEvent, CalendarResource>(RBCalendar as any)

export default function CalendarPage() {
    const { events, resources, setEvents, setResources, createEvent, updateEventTimes, updateEvent, deleteEvent } = useCalendarStore()
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<CalendarEvent | null>(null)
    const [pendingRange, setPendingRange] = useState<{ start: Date; end: Date } | null>(null)
    const [resourceFilter, setResourceFilter] = useState<string | undefined>(undefined)
    const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('week')

    useEffect(() => {
        if (events.length === 0) {
            // seed with ids
            const seeded = MOCK_EVENTS.map(e => ({ id: crypto.randomUUID(), ...e }))
            setEvents(seeded)
            setResources(MOCK_RESOURCES)
        }
    }, [events.length, setEvents, setResources])

    const eventPropGetter = (event: CalendarEvent) => {
        const resource = resources.find(r => r.id === event.resourceId)
        let baseColor = resource?.color || 'var(--primary-main)'
        if (event.phase === 'projektowanie') baseColor = '#1677ff'
        if (event.phase === 'wycinanie') baseColor = '#faad14'
        if (event.phase === 'produkcja') baseColor = '#52c41a'
        return { style: { backgroundColor: baseColor, borderColor: baseColor } }
    }

    const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
        setEditing(null)
        setPendingRange({ start, end })
        setModalOpen(true)
    }, [])

    const handleSelectEvent = useCallback((event: CalendarEvent) => {
        // If linked to tile, open tile edit elsewhere in future; for now open modal
        setEditing(event)
        setPendingRange(null)
        setModalOpen(true)
    }, [])

    const handleEventDrop = useCallback(({ event, start, end, resourceId }: any) => {
        updateEventTimes(event.id, start, end, resourceId)
    }, [updateEventTimes])

    const handleEventResize = useCallback(({ event, start, end }: any) => {
        updateEventTimes(event.id, start, end)
    }, [updateEventTimes])

    const handleCreateOrUpdate = useCallback((values: Omit<CalendarEvent, 'id'>) => {
        if (editing) {
            updateEvent(editing.id, values)
        } else {
            createEvent(values)
        }
        setModalOpen(false)
        setEditing(null)
        setPendingRange(null)
    }, [editing, createEvent, updateEvent])

    const handleDelete = useCallback(() => {
        if (editing) {
            deleteEvent(editing.id)
        }
        setModalOpen(false)
        setEditing(null)
        setPendingRange(null)
    }, [editing, deleteEvent])

    const filteredEvents = resourceFilter ? events.filter(e => e.resourceId === resourceFilter) : events
    const hasConflicts = useMemo(() => {
        const byResource: Record<string, CalendarEvent[]> = {}
        for (const e of filteredEvents) {
            if (!e.resourceId) continue
            byResource[e.resourceId] = byResource[e.resourceId] || []
            byResource[e.resourceId].push(e)
        }
        for (const list of Object.values(byResource)) {
            const sorted = [...list].sort((a, b) => +a.start - +b.start)
            for (let i = 1; i < sorted.length; i++) {
                if (sorted[i].start < sorted[i - 1].end) return true
            }
        }
        return false
    }, [filteredEvents])

    const workload = useMemo(() => {
        // naive: sum event hours for current week per resource
        const startOfWeek = new Date()
        startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7))
        startOfWeek.setHours(0, 0, 0, 0)
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(endOfWeek.getDate() + 7)

        const by: Record<string, number> = {}
        for (const e of events) {
            if (!e.resourceId) continue
            const s = e.start
            const en = e.end
            if (en <= startOfWeek || s >= endOfWeek) continue
            const start = s < startOfWeek ? startOfWeek : s
            const end = en > endOfWeek ? endOfWeek : en
            const hours = (end.getTime() - start.getTime()) / 36e5
            by[e.resourceId] = (by[e.resourceId] || 0) + hours
        }
        return by
    }, [events])

    return (
        <div>
            <Typography.Title level={4} style={{ marginTop: 0 }}>Kalendarz Planowania</Typography.Title>
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
                                value: r.id, label: (
                                    <span><span style={{ display: 'inline-block', width: 10, height: 10, background: r.color, marginRight: 8 }} />{r.title}</span>
                                )
                            }))}
                        />
                        <Segmented
                            options={[{ label: 'Miesiąc', value: 'month' }, { label: 'Tydzień', value: 'week' }, { label: 'Dzień', value: 'day' }]}
                            value={currentView}
                            onChange={(val) => setCurrentView(val as any)}
                        />
                    </Space>
                    <Button type="primary" onClick={() => { setEditing(null); setPendingRange({ start: new Date(), end: new Date(new Date().getTime() + 60 * 60 * 1000) }); setModalOpen(true) }}>Dodaj</Button>
                </Space>
                {hasConflicts && (
                    <Alert type="warning" showIcon style={{ marginBottom: 8 }} message="Konflikty w grafiku dla wybranego zasobu" />
                )}
                <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                    {resources.map(r => {
                        const hours = workload[r.id] || 0
                        const pct = Math.min(100, Math.round((hours / 40) * 100))
                        return (
                            <Card key={r.id} size="small" style={{ width: 200 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ width: 10, height: 10, background: r.color, display: 'inline-block' }} />
                                    <strong>{r.title}</strong>
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    <Progress percent={pct} size="small" status={pct > 100 ? 'exception' : 'normal'} />
                                    <div style={{ fontSize: 12, opacity: 0.8 }}>{hours.toFixed(1)}h / 40h</div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
                <DnDCalendar
                    localizer={localizer}
                    events={filteredEvents}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView={Views.WEEK}
                    views={[Views.MONTH, Views.WEEK, Views.DAY]}
                    view={currentView}
                    onView={(v) => setCurrentView(v as any)}
                    selectable
                    resizable
                    onSelectSlot={handleSelectSlot as any}
                    onSelectEvent={handleSelectEvent as any}
                    onEventDrop={handleEventDrop as any}
                    onEventResize={handleEventResize as any}
                    eventPropGetter={eventPropGetter}
                    messages={{
                        next: 'Następny',
                        previous: 'Poprzedni',
                        today: 'Dziś',
                        month: 'Miesiąc',
                        week: 'Tydzień',
                        day: 'Dzień',
                        agenda: 'Agenda',
                        date: 'Data',
                        time: 'Godzina',
                        event: 'Wydarzenie',
                        noEventsInRange: 'Brak wydarzeń w tym okresie.',
                    }}
                />
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
    )
}



