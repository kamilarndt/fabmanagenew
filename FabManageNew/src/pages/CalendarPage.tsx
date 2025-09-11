import { useEffect, useState, useCallback, useMemo } from 'react'
import { Typography, Button, Select, Space, Alert, Segmented, Progress, Card, DatePicker } from 'antd'
import dayjs from 'dayjs'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
// FullCalendar CSS imports removed to avoid package specifier issues in build
import { useCalendarStore, type CalendarEvent, type CalendarResource } from '../stores/calendarStore'
import EventFormModal from '../components/Calendar/EventFormModal'

const MOCK_RESOURCES: CalendarResource[] = [
    { id: 'designer-kamil-a', title: 'Kamil Arndt', color: 'var(--primary-main)', type: 'designer' },
    { id: 'designer-anna-k', title: 'Anna Kowalska', color: '#eb2f96', type: 'designer' },
    { id: 'team-tomek', title: 'Ekipa Tomka', color: '#52c41a', type: 'team' },
    { id: 'team-jozef', title: 'Ekipa Józefa', color: '#fa8c16', type: 'team' },
]

const MOCK_EVENTS: Omit<CalendarEvent, 'id'>[] = [
    {
        title: 'Projektowanie: Panel frontowy',
        start: new Date(2025, 8, 8, 10, 0, 0),
        end: new Date(2025, 8, 10, 14, 0, 0),
        resourceId: 'designer-kamil-a',
        designerId: 'designer-kamil-a',
        phase: 'projektowanie',
        eventType: 'task',
        meta: { projectId: 'P-001' },
    },
    {
        title: 'Montaż: Stoisko TVP',
        start: new Date(2025, 8, 9, 8, 0, 0),
        end: new Date(2025, 8, 12, 16, 0, 0),
        resourceId: 'team-tomek',
        teamId: 'team-tomek',
        phase: 'produkcja',
        eventType: 'task',
        meta: { projectId: 'P-002' },
    },
    {
        title: 'Wycinanie: Elementy dekoracyjne',
        start: new Date(2025, 8, 11, 9, 0, 0),
        end: new Date(2025, 8, 11, 17, 0, 0),
        resourceId: 'designer-anna-k',
        designerId: 'designer-anna-k',
        phase: 'wycinanie',
        eventType: 'task',
        meta: { projectId: 'P-001' },
    },
]

// FullCalendar setup uses interactionPlugin for selecting/dragging

export default function CalendarPage() {
    const { events, resources, setEvents, setResources, createEvent, updateEventTimes, updateEvent, deleteEvent } = useCalendarStore()
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<CalendarEvent | null>(null)
    const [pendingRange, setPendingRange] = useState<{ start: Date; end: Date } | null>(null)
    const [resourceFilter, setResourceFilter] = useState<string | undefined>(undefined)
    const [mainView, setMainView] = useState<'timeline' | 'month' | 'week'>('timeline')
    const [groupBy, setGroupBy] = useState<'designer' | 'team' | 'project'>('designer')
    const [currentDate, setCurrentDate] = useState<Date>(new Date())

    useEffect(() => {
        if (events.length === 0) {
            // seed with ids
            const seeded = MOCK_EVENTS.map(e => ({ id: crypto.randomUUID(), ...e }))
            setEvents(seeded)
            setResources(MOCK_RESOURCES)
        }
    }, [events.length, setEvents, setResources])

    // Colors are computed inline when mapping events

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

    const handleEventDrop = useCallback((arg: any) => {
        const { event } = arg
        updateEventTimes(event.id, event.start, event.end, (event as any).extendedProps.resourceId)
    }, [updateEventTimes])

    const handleEventResize = useCallback((arg: any) => {
        const { event } = arg
        updateEventTimes(event.id, event.start, event.end)
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

    function markConflicts(input: CalendarEvent[]): Array<CalendarEvent & { __conflict?: boolean }> {
        const arr = [...input].sort((a, b) => +a.start - +b.start)
        const result = arr.map(e => ({ ...e, __conflict: false as boolean }))
        for (let i = 0; i < result.length; i++) {
            for (let j = i + 1; j < result.length; j++) {
                if (result[j].start < result[i].end) {
                    result[i].__conflict = true
                    result[j].__conflict = true
                } else {
                    break
                }
            }
        }
        return result
    }

    // Helpers for timeline lanes
    const lanes = useMemo(() => {
        if (mainView !== 'timeline') return [] as { id: string; title: string; color?: string }[]
        if (groupBy === 'project') {
            const map = new Map<string, { id: string; title: string }>()
            filteredEvents.forEach(e => {
                const pid = (e.meta as any)?.projectId || 'unknown'
                if (!map.has(pid)) map.set(pid, { id: pid, title: `Projekt ${pid}` })
            })
            return Array.from(map.values())
        }
        const type = groupBy === 'designer' ? 'designer' : 'team'
        return resources.filter(r => r.type === type)
    }, [filteredEvents, resources, groupBy, mainView])

    return (
        <div>
            <Typography.Title level={4} style={{ marginTop: 0 }}>Kalendarz Planowania</Typography.Title>
            <div style={{ height: '75vh', backgroundColor: 'var(--bg-card)', padding: '1rem' }}>
                <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, width: '100%' }}>
                    <Space wrap>
                        <Segmented
                            options={[{ label: 'Oś Czasu', value: 'timeline' }, { label: 'Miesiąc', value: 'month' }, { label: 'Tydzień', value: 'week' }]}
                            value={mainView}
                            onChange={(val) => setMainView(val as any)}
                        />
                        {mainView === 'timeline' && (
                            <Segmented
                                options={[{ label: 'Projektant', value: 'designer' }, { label: 'Zespół', value: 'team' }, { label: 'Projekt', value: 'project' }]}
                                value={groupBy}
                                onChange={(val) => setGroupBy(val as any)}
                            />
                        )}
                        <Select
                            allowClear
                            placeholder={mainView === 'timeline' ? 'Filtr zasobu/projektu' : 'Filtr zasobu'}
                            style={{ minWidth: 260 }}
                            value={resourceFilter}
                            onChange={(v) => setResourceFilter(v)}
                            options={resources.map(r => ({
                                value: r.id, label: (
                                    <span><span style={{ display: 'inline-block', width: 10, height: 10, background: r.color, marginRight: 8 }} />{r.title}</span>
                                )
                            }))}
                        />
                    </Space>
                    <Space>
                        <Button onClick={() => setCurrentDate(new Date())}>Dziś</Button>
                        <DatePicker value={dayjs(currentDate)} onChange={(d) => d && setCurrentDate(d.toDate())} />
                        <Button type="primary" onClick={() => { setEditing(null); setPendingRange({ start: new Date(), end: new Date(new Date().getTime() + 60 * 60 * 1000) }); setModalOpen(true) }}>Dodaj</Button>
                    </Space>
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
                {mainView === 'timeline' ? (
                    <div style={{ display: 'grid', gap: 8 }}>
                        {lanes.map(lane => (
                            <div key={lane.id} style={{ border: '1px solid var(--border-subtle)', borderRadius: 6, overflow: 'hidden' }}>
                                <div style={{ padding: '6px 10px', background: 'var(--bg-elevated)' }}>
                                    <span style={{ fontWeight: 600 }}>
                                        {lane.title}
                                    </span>
                                </div>
                                <FullCalendar
                                    key={`${lane.id}-${currentDate.toDateString()}`}
                                    plugins={[timeGridPlugin, interactionPlugin]}
                                    initialView={'timeGridWeek'}
                                    headerToolbar={false}
                                    initialDate={currentDate}
                                    events={markConflicts(filteredEvents
                                        .filter(e => {
                                            if (groupBy === 'project') {
                                                return ((e.meta as any)?.projectId || 'unknown') === lane.id
                                            }
                                            return e.resourceId === lane.id
                                        }))
                                        .map(e => ({
                                            id: e.id,
                                            title: e.title,
                                            start: e.start,
                                            end: e.end,
                                            backgroundColor: e.__conflict ? '#ff4d4f' : (resources.find(r => r.id === (groupBy === 'project' ? e.resourceId : lane.id))?.color),
                                            borderColor: e.__conflict ? '#ff4d4f' : (resources.find(r => r.id === (groupBy === 'project' ? e.resourceId : lane.id))?.color),
                                            extendedProps: { ...e }
                                        }))}
                                    selectable
                                    editable
                                    selectMirror
                                    select={(info) => handleSelectSlot({ start: info.start, end: info.end })}
                                    eventClick={(info) => handleSelectEvent(info.event.extendedProps as CalendarEvent)}
                                    eventDrop={handleEventDrop}
                                    eventResize={handleEventResize}
                                    dayMaxEvents={true}
                                    height={220}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <FullCalendar
                        key={`${mainView}-${currentDate.toDateString()}`}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView={mainView === 'month' ? 'dayGridMonth' : 'timeGridWeek'}
                        headerToolbar={false}
                        initialDate={currentDate}
                        events={markConflicts(filteredEvents).map(e => ({
                            id: e.id,
                            title: e.title,
                            start: e.start,
                            end: e.end,
                            backgroundColor: e.__conflict ? '#ff4d4f' : (resources.find(r => r.id === e.resourceId)?.color),
                            borderColor: e.__conflict ? '#ff4d4f' : (resources.find(r => r.id === e.resourceId)?.color),
                            extendedProps: { ...e }
                        }))}
                        /* resource timeline options removed for non-timeline views */
                        selectable
                        editable
                        selectMirror
                        select={(info) => handleSelectSlot({ start: info.start, end: info.end })}
                        eventClick={(info) => handleSelectEvent(info.event.extendedProps as CalendarEvent)}
                        eventDrop={handleEventDrop}
                        eventResize={handleEventResize}
                        dayMaxEvents={true}
                        height={'auto'}
                        locale={'pl'}
                    />
                )}
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



