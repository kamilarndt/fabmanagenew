import { useMemo, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectsStore } from '../stores/projectsStore'
import { showToast } from '../lib/notifications'
import { useTilesStore, type Tile } from '../stores/tilesStore'
import type { Project } from '../types/projects.types'
import TileEditModal from '../components/Tiles/TileEditModal'
import EditProjectModal from '../components/EditProjectModal'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card, Result, Button } from 'antd'

// New modular components
import ProjectHeader from '../components/Project/ProjectHeader'
import ProjectTabs from '../components/Project/ProjectTabs'
import ProjectOverview from '../components/Project/ProjectOverview'
import ProjectElements from '../components/Project/ProjectElements'
import ProjectMaterials from '../components/Project/ProjectMaterials'
import AddMemberModal from '../components/Modals/AddMemberModal'
import CreateGroupModal from '../components/Groups/CreateGroupModal'

// Hooks
import { useProjectData } from '../hooks/useProjectData'

// Lazy load heavy modules
import { Suspense, lazy } from 'react';
const ConceptBoard = lazy(() => import('../modules/Concept/ConceptBoard'))
const EstimateModule = lazy(() => import('../components/Estimate/EstimateModule'))
const LogisticsTab = lazy(() => import('../modules/Logistics/LogisticsTab'))
const AccommodationTab = lazy(() => import('../modules/Accommodation/AccommodationTab'))
import { StageStepper } from '../components/Ui/StageStepper'
import { ModuleLoading } from '../components/Ui/LoadingSpinner'
import { Calendar as RBCalendar, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { localizer } from '../lib/calendarLocalizer'
import { useCalendarStore, type CalendarEvent, type CalendarResource } from '../stores/calendarStore'



interface ProjectDocument {
    id: string
    name: string
    type: string
    uploadedBy: string
    uploadedAt: string
    size: string
}

interface ProjectComment {
    id: string
    author: string
    content: string
    timestamp: string
    avatar: string
}

interface TeamMember {
    id: string
    name: string
    role: string
    avatar: string
    workload: number
}

export default function Projekt() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { projects, update } = useProjectsStore()
    const { tiles, updateTile, addTile } = useTilesStore()
    const [activeTab, setActiveTab] = useState<'overview' | 'elementy' | 'zakupy' | 'koncepcja' | 'wycena' | 'logistyka' | 'zakwaterowanie' | 'kalendarz'>('overview')
    const [showTileModal, setShowTileModal] = useState(false)
    const [editingTile, setEditingTile] = useState<Tile | null>(null)
    const [showCreateGroup, setShowCreateGroup] = useState(false)
    const [showEditProject, setShowEditProject] = useState(false)
    const [showAddMember, setShowAddMember] = useState(false)

    const project = useMemo(() => projects.find(p => p.id === id), [projects, id])
    const { events, resources, updateEventTimes } = useCalendarStore()
    const DnDCalendar = withDragAndDrop<CalendarEvent, CalendarResource>(RBCalendar as any)

    // Move all hooks before conditional return
    const safeProject: Project = project ?? {
        id: 'unknown',
        numer: 'P-2025/01/UNK',
        name: 'Unknown',
        typ: 'Inne',
        lokalizacja: 'Nieznana',
        clientId: '',
        client: '',
        status: 'Nowy',
        data_utworzenia: new Date().toISOString().slice(0, 10),
        deadline: '',
        postep: 0,
        groups: [],
        modules: []
    }
    const {
        projectTiles,
        tileCosts,
        purchaseList,
    } = useProjectData(safeProject, tiles)

    const handleAddComment = useCallback(() => {
        showToast('Komentarz dodany', 'success')
        // TODO: Add comment to store
    }, [])

    const handleTileUpdate = useCallback(async (tileId: string, updates: Partial<Tile>) => {
        try {
            await updateTile(tileId, updates)
            showToast('Kafelek zaktualizowany', 'success')
        } catch {
            showToast('Błąd podczas aktualizacji kafelka', 'danger')
        }
    }, [updateTile])

    const handleTileClick = useCallback((tile: Tile) => {
        setEditingTile(tile)
        setShowTileModal(true)
    }, [])

    const handleAddTile = useCallback(() => {
        setEditingTile(null)
        setShowTileModal(true)
    }, [])

    const handleSaveTile = useCallback(async (tileData: Omit<Tile, 'id'>) => {
        try {
            if (editingTile) {
                await updateTile(editingTile.id, tileData)
                showToast('Kafelek zaktualizowany', 'success')
            } else {
                const newTile: Tile = {
                    ...tileData,
                    id: crypto.randomUUID(),
                    status: tileData.status || 'W KOLEJCE',
                    project: tileData.project || project?.id || ''
                }
                await addTile(newTile)
                showToast('Kafelek dodany', 'success')
            }
            setShowTileModal(false)
            setEditingTile(null)
        } catch {
            showToast('Błąd podczas zapisywania kafelka', 'danger')
        }
    }, [editingTile, updateTile, addTile, project?.id])

    const handleCreateGroup = useCallback((groupData: {
        name: string
        description?: string
        thumbnail?: string
        files: { id: string; name: string; url: string; type: string }[]
    }) => {
        const newGroup = {
            id: crypto.randomUUID(),
            name: groupData.name,
            description: groupData.description,
            thumbnail: groupData.thumbnail,
            files: groupData.files
        }

        const currentGroups = project?.groups || []
        update(project?.id || '', { groups: [...currentGroups, newGroup] })
        showToast('Grupa utworzona', 'success')
        setShowCreateGroup(false)
    }, [project?.groups, project?.id, update])

    const handlePushToProduction = useCallback(() => {
        // TODO: Implement push to production logic
        showToast('Elementy wysłane do produkcji', 'success')
    }, [])

    const handleAddMembers = useCallback((memberIds: string[]) => {
        // TODO: Implement add members logic
        showToast(`Dodano ${memberIds.length} członków`, 'success')
    }, [])

    const eventPropGetter = useCallback((event: CalendarEvent) => {
        const resource = resources.find(r => r.id === event.resourceId)
        if (resource) {
            return { style: { backgroundColor: resource.color, borderColor: resource.color } }
        }
        return {}
    }, [resources])

    if (!project) {
        return (
            <Result
                status="404"
                title="Projekt nie znaleziony"
                subTitle={`Projekt o ID "${id}" nie istnieje lub został usunięty.`}
                extra={<Button type="primary" onClick={() => navigate('/projekty')}>Powrót do projektów</Button>}
            />
        )
    }

    // Mock data - will be replaced with real data from stores
    const teamMembers: TeamMember[] = [
        { id: 'member-1', name: 'Anna Kowalska', role: 'Project Manager', avatar: 'https://i.pravatar.cc/40?img=1', workload: 85 },
        { id: 'member-2', name: 'Paweł Nowak', role: 'Designer', avatar: 'https://i.pravatar.cc/40?img=2', workload: 70 },
        { id: 'member-3', name: 'Marek Wójcik', role: 'CNC Operator', avatar: 'https://i.pravatar.cc/40?img=3', workload: 45 },
        { id: 'member-4', name: 'Tomasz Kowal', role: 'Assembly Technician', avatar: 'https://i.pravatar.cc/40?img=4', workload: 30 },
        { id: 'member-5', name: 'Maria Lis', role: 'Quality Control', avatar: 'https://i.pravatar.cc/40?img=5', workload: 55 }
    ]

    const comments: ProjectComment[] = [
        {
            id: 'comment-1',
            author: 'Anna Kowalska',
            content: 'Wymagania zostały zatwierdzone przez klienta. Możemy przejść do fazy projektowania.',
            timestamp: '2025-01-05 15:30',
            avatar: 'https://i.pravatar.cc/32?img=1'
        },
        {
            id: 'comment-2',
            author: 'Paweł Nowak',
            content: 'Pierwsza wersja rysunków gotowa. Proszę o weryfikację wymiarów panelu głównego.',
            timestamp: '2025-01-08 11:45',
            avatar: 'https://i.pravatar.cc/32?img=2'
        }
    ]

    const projectEvents = events.filter(e => e.meta?.projectId === (project?.id || safeProject.id))

    const documents: ProjectDocument[] = [
        {
            id: 'doc-1',
            name: 'Specyfikacja techniczna.pdf',
            type: 'PDF',
            uploadedBy: 'Anna Kowalska',
            uploadedAt: '2025-01-01 10:30',
            size: '2.4 MB'
        },
        {
            id: 'doc-2',
            name: 'Rysunek konstrukcyjny.dwg',
            type: 'DWG',
            uploadedBy: 'Paweł Nowak',
            uploadedAt: '2025-01-08 14:15',
            size: '1.8 MB'
        }
    ]

    const handleEventClick = (event: CalendarEvent) => {
        if (event.meta?.tileId) {
            const tile = tiles.find(t => t.id === event.meta!.tileId)
            if (tile) {
                setEditingTile(tile)
                setShowTileModal(true)
            }
        }
    }

    const handleEventDrop = ({ event, start, end, resourceId }: any) => {
        updateEventTimes(event.id, start, end, resourceId)
    }
    const handleEventResize = ({ event, start, end }: any) => {
        updateEventTimes(event.id, start, end)
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                {/* Project Header */}
                <ProjectHeader
                    project={project}
                    teamMembers={teamMembers}
                    onEditProject={() => setShowEditProject(true)}
                    onAddMember={() => setShowAddMember(true)}
                />

                {/* Project Tabs */}
                <ProjectTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    project={project}
                />

                {/* Tab Content */}
                <div>
                    <Card style={{ marginBottom: 12 }}>
                        <StageStepper
                            steps={[
                                { key: 'overview', label: 'Przegląd' },
                                { key: 'elementy', label: 'Elementy' },
                                { key: 'zakupy', label: 'Materiały' },
                                { key: 'koncepcja', label: 'Koncepcja' },
                                { key: 'wycena', label: 'Wycena' },
                                { key: 'logistyka', label: 'Logistyka' },
                                { key: 'zakwaterowanie', label: 'Zakwater.' },
                            ]}
                            currentKey={activeTab}
                        />
                    </Card>
                    {activeTab === 'overview' && (
                        <ProjectOverview
                            project={project}
                            comments={comments}
                            documents={documents}
                            teamMembers={teamMembers}
                            onAddComment={handleAddComment}
                        />
                    )}

                    {activeTab === 'elementy' && (
                        <ProjectElements
                            project={project}
                            projectTiles={projectTiles}
                            tileCosts={tileCosts}
                            onTileUpdate={handleTileUpdate}
                            onTileClick={handleTileClick}
                            onAddTile={handleAddTile}
                            onCreateGroup={() => setShowCreateGroup(true)}
                            onPushToProduction={project.modules?.includes('produkcja') ? handlePushToProduction : undefined}
                        />
                    )}

                    {activeTab === 'zakupy' && (
                        <ProjectMaterials purchaseList={purchaseList} projectId={project.id} />
                    )}

                    {activeTab === 'koncepcja' && project.modules?.includes('koncepcja') && (
                        <Suspense fallback={<ModuleLoading />}>
                            <ConceptBoard projectId={project.id} />
                        </Suspense>
                    )}

                    {activeTab === 'wycena' && (
                        <Suspense fallback={<ModuleLoading />}>
                            <EstimateModule projectId={project.id} />
                        </Suspense>
                    )}

                    {activeTab === 'logistyka' && (
                        <Suspense fallback={<ModuleLoading />}>
                            <LogisticsTab projectId={project.id} />
                        </Suspense>
                    )}

                    {activeTab === 'zakwaterowanie' && (
                        <Suspense fallback={<ModuleLoading />}>
                            <AccommodationTab projectId={project.id} />
                        </Suspense>
                    )}

                    {activeTab === 'kalendarz' && (
                        <Card style={{ marginTop: 12 }}>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <div style={{ width: 300 }}>
                                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Niezaplanowane kafelki</div>
                                    <div style={{ maxHeight: 480, overflow: 'auto', border: '1px solid var(--border-medium)', padding: 8 }}>
                                        {projectTiles.filter(t => !events.some(e => e.meta?.tileId === t.id)).map(t => (
                                            <div key={t.id} style={{ padding: 8, marginBottom: 8, background: 'var(--bg-card)', border: '1px dashed var(--border-medium)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 500 }}>{t.name}</div>
                                                        <div style={{ fontSize: 12, opacity: 0.8 }}>{t.id}</div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: 6 }}>
                                                        <Button size="small" draggable onDragStart={() => { (window as any)._dragTileId = t.id; (window as any)._dragPhase = 'projektowanie' }} title="Projektowanie">P</Button>
                                                        <Button size="small" draggable onDragStart={() => { (window as any)._dragTileId = t.id; (window as any)._dragPhase = 'wycinanie' }} title="Wycinanie">W</Button>
                                                        <Button size="small" type="primary" draggable onDragStart={() => { (window as any)._dragTileId = t.id; (window as any)._dragPhase = 'produkcja' }} title="Produkcja">Prod</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ flex: 1, height: '60vh' }}>
                                    <DnDCalendar
                                        localizer={localizer}
                                        events={projectEvents}
                                        startAccessor="start"
                                        endAccessor="end"
                                        defaultView={Views.WEEK}
                                        views={[Views.MONTH, Views.WEEK, Views.DAY]}
                                        eventPropGetter={eventPropGetter as any}
                                        selectable
                                        resizable
                                        onEventDrop={handleEventDrop as any}
                                        onEventResize={handleEventResize as any}
                                        onSelectEvent={handleEventClick as any}
                                        onDropFromOutside={({ start, end, allDay }) => {
                                            const tileId = (window as any)._dragTileId
                                            const phase = (window as any)._dragPhase as 'projektowanie' | 'wycinanie' | 'produkcja' | undefined
                                            if (tileId) {
                                                const title = projectTiles.find(t => t.id === tileId)?.name || 'Zadanie'
                                                const newEvent = {
                                                    title: `${(phase || 'produkcja').charAt(0).toUpperCase() + (phase || 'produkcja').slice(1)}: ${title}`,
                                                    start,
                                                    end,
                                                    allDay: !!allDay,
                                                    resourceId: resources[0]?.id,
                                                    phase: (phase || 'produkcja'),
                                                    meta: { tileId, projectId: project.id }
                                                }
                                                useCalendarStore.getState().createEvent(newEvent as any)
                                                    ; (window as any)._dragTileId = undefined; (window as any)._dragPhase = undefined
                                            }
                                        }}
                                        dragFromOutsideItem={() => {
                                            const tileId = (window as any)._dragTileId
                                            const phase = (window as any)._dragPhase
                                            if (!tileId) return { id: 'temp', title: 'Zadanie', start: new Date(), end: new Date(Date.now() + 60 * 60 * 1000) } as any
                                            const title = projectTiles.find(t => t.id === tileId)?.name || 'Zadanie'
                                            return { id: 'temp', title: `${(phase || 'produkcja')}: ${title}`, start: new Date(), end: new Date(Date.now() + 60 * 60 * 1000) } as any
                                        }}
                                        handleDragStart={(event) => void event}
                                    />
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Modals */}
                <TileEditModal
                    open={showTileModal}
                    onClose={() => setShowTileModal(false)}
                    onSave={handleSaveTile}
                    tile={editingTile || undefined}
                    projectId={project.id}
                />

                <AddMemberModal
                    isOpen={showAddMember}
                    onClose={() => setShowAddMember(false)}
                    currentMemberIds={teamMembers.map(m => m.id)}
                    onAddMembers={handleAddMembers}
                />

                <CreateGroupModal
                    isOpen={showCreateGroup}
                    onClose={() => setShowCreateGroup(false)}
                    onCreateGroup={handleCreateGroup}
                />

                {showEditProject && (
                    <EditProjectModal
                        open={showEditProject}
                        projectId={project.id}
                        onClose={() => setShowEditProject(false)}
                    />
                )}
            </div>
        </DndProvider>
    )
}



