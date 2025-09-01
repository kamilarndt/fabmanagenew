import { useMemo, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectsStore } from '../stores/projectsStore'
import { showToast } from '../lib/toast'
import { useTilesStore, type Tile } from '../stores/tilesStore'
import TileEditModal from '../components/TileEditModal'
import EditProjectModal from '../components/EditProjectModal'
import { useDrag, useDrop } from 'react-dnd'

interface ProjectStage {
    id: string
    name: string
    status: 'completed' | 'active' | 'pending'
    startDate: string
    endDate: string
    assignedTo: string
    progress: number
}

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

const ItemTypes = { TILE: 'TILE' } as const

type DragItem = { id: string }

export default function Projekt() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { projects, update } = useProjectsStore()
    const { tiles, updateTile, addTile } = useTilesStore()
    const project = useMemo(() => projects.find(p => p.id === id), [projects, id])

    const [activeTab, setActiveTab] = useState<'overview' | 'list' | 'board' | 'timeline' | 'attachment' | 'tasks' | 'documents' | 'team' | 'elementy' | 'zakupy'>('overview')
    const [newComment, setNewComment] = useState('')
    const [showTileModal, setShowTileModal] = useState(false)
    const [editingTile, setEditingTile] = useState<Tile | null>(null)
    const [viewMode, setViewMode] = useState<'kanban' | 'groups'>('kanban')
    const [creatingGroup, setCreatingGroup] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [groupDesc, setGroupDesc] = useState('')
    const [groupThumb, setGroupThumb] = useState<string | undefined>(undefined)
    const [groupFiles, setGroupFiles] = useState<{ id: string; name: string; url: string; type: string }[]>([])
    const [showAddMember, setShowAddMember] = useState(false)
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
    const [showEditProject, setShowEditProject] = useState(false)

    // Mock data based on prototyp2 structure
    const stages: ProjectStage[] = [
        {
            id: 'stage-1',
            name: 'Analiza wymagań',
            status: 'completed',
            startDate: '2025-01-01',
            endDate: '2025-01-05',
            assignedTo: 'Anna Kowalska',
            progress: 100
        },
        {
            id: 'stage-2',
            name: 'Projektowanie',
            status: 'active',
            startDate: '2025-01-06',
            endDate: '2025-01-15',
            assignedTo: 'Paweł Nowak',
            progress: 65
        },
        {
            id: 'stage-3',
            name: 'Produkcja CNC',
            status: 'pending',
            startDate: '2025-01-16',
            endDate: '2025-01-25',
            assignedTo: 'Marek Wójcik',
            progress: 0
        },
        {
            id: 'stage-4',
            name: 'Montaż',
            status: 'pending',
            startDate: '2025-01-26',
            endDate: '2025-02-05',
            assignedTo: 'Tomasz Kowal',
            progress: 0
        },
        {
            id: 'stage-5',
            name: 'Kontrola jakości',
            status: 'pending',
            startDate: '2025-02-06',
            endDate: '2025-02-08',
            assignedTo: 'Maria Lis',
            progress: 0
        }
    ]

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
        },
        {
            id: 'doc-3',
            name: 'Panel_A1.dxf',
            type: 'DXF',
            uploadedBy: 'Paweł Nowak',
            uploadedAt: '2025-01-10 09:45',
            size: '850 KB'
        },
        {
            id: 'doc-4',
            name: 'Lista materiałów.xlsx',
            type: 'XLSX',
            uploadedBy: 'Maria Lis',
            uploadedAt: '2025-01-12 16:20',
            size: '124 KB'
        }
    ]

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
        },
        {
            id: 'comment-3',
            author: 'Maria Lis',
            content: 'Znaleziono problem z tolerancjami w sekcji C. Wysyłam poprawiony plik DXF.',
            timestamp: '2025-01-10 14:20',
            avatar: 'https://i.pravatar.cc/32?img=5'
        }
    ]

    if (!project) {
        return (
            <div className="text-center mt-5">
                <h4>Projekt nie znaleziony</h4>
                <p className="text-muted mb-3">Projekt o ID "{id}" nie istnieje lub został usunięty.</p>
                <button className="btn btn-primary" onClick={() => navigate('/projekty')}>
                    <i className="ri-arrow-left-line me-1"></i>Powrót do projektów
                </button>
            </div>
        )
    }

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-success'
            case 'On Hold': return 'bg-warning'
            case 'Done': return 'bg-info'
            case 'W KOLEJCE': return 'bg-secondary'
            case 'W TRAKCIE CIĘCIA': return 'bg-primary'
            case 'WYCIĘTE': return 'bg-info'
            case 'Projektowanie': return 'bg-warning'
            case 'W trakcie projektowania': return 'bg-warning'
            case 'Do akceptacji': return 'bg-warning'
            case 'Zaakceptowane': return 'bg-success'
            case 'Wymagają poprawek': return 'bg-danger'
            case 'Gotowy do montażu': return 'bg-success'
            default: return 'bg-secondary'
        }
    }

    const getStageBadgeClass = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-success'
            case 'active': return 'bg-primary'
            case 'pending': return 'bg-secondary'
            default: return 'bg-secondary'
        }
    }

    const getKanbanStatus = (status: string) => {
        switch (status) {
            case 'W KOLEJCE': return 'nowy'
            case 'Projektowanie':
            case 'W trakcie projektowania':
            case 'Do akceptacji':
            case 'Wymagają poprawek':
                return 'projektowanie'
            case 'W TRAKCIE CIĘCIA':
            case 'WYCIĘTE':
                return 'cnc'
            case 'Gotowy do montażu':
            case 'Zaakceptowane':
                return 'montaz'
            default: return 'nowy'
        }
    }

    const statusFromColumn = (columnId: 'nowy' | 'projektowanie' | 'cnc' | 'montaz'): Tile['status'] => {
        switch (columnId) {
            case 'nowy': return 'W KOLEJCE'
            case 'projektowanie': return 'Projektowanie'
            case 'cnc': return 'W TRAKCIE CIĘCIA'
            case 'montaz': return 'Gotowy do montażu'
        }
    }

    const handleAddComment = () => {
        if (!newComment.trim()) return
        showToast('Komentarz dodany', 'success')
        setNewComment('')
    }

    // Status change handled elsewhere in simplified header actions

    const handleAddTile = () => {
        setEditingTile(null)
        setShowTileModal(true)
    }

    const handleSaveTile = (tileData: Partial<Tile>) => {
        if (editingTile) {
            updateTile(editingTile.id, tileData)
            showToast('Kafelek zaktualizowany', 'success')
        } else {
            const newTile: Tile = {
                id: crypto.randomUUID(),
                name: tileData.name || 'Nowy kafelek',
                status: 'W KOLEJCE',
                project: project.id,
                priority: tileData.priority || 'Średni',
                technology: tileData.technology || 'Frezowanie CNC',
                laborCost: tileData.laborCost || 0,
                bom: tileData.bom || []
            }
            addTile(newTile)
        }
        setShowTileModal(false)
        setEditingTile(null)
    }

    const handleTileClick = (tile: Tile) => {
        setEditingTile(tile)
        setShowTileModal(true)
    }

    const overallProgress = Math.round(stages.reduce((acc, stage) => acc + stage.progress, 0) / stages.length)
    const projectTiles = tiles.filter(t => t.project === project.id)
    const tileCosts = projectTiles.map(t => (t.laborCost || 0) + (t.bom || []).reduce((a, b) => a + (b.unitCost || 0) * (b.quantity || 0), 0))
    const projectCost = tileCosts.reduce((a, b) => a + b, 0)
    const purchaseList = (() => {
        const map = new Map<string, { name: string; unit: string; quantity: number; supplier?: string }>()
        projectTiles.forEach(t => (t.bom || []).forEach(i => {
            if (i.status !== 'Do zamówienia') return
            const key = `${i.name}__${i.unit}__${i.supplier || ''}`
            const prev = map.get(key)
            if (prev) prev.quantity += (i.quantity || 0); else map.set(key, { name: i.name, unit: i.unit, quantity: i.quantity || 0, supplier: i.supplier })
        }))
        return Array.from(map.values())
    })()

    const groups = useMemo(() => {
        const m = new Map<string, { id: string; name: string; tiles: Tile[] }>()
        projectTiles.forEach(t => {
            const gid = t.group || 'ungrouped'
            const name = t.group || 'Bez grupy'
            const g = m.get(gid) || { id: gid, name, tiles: [] }
            g.tiles.push(t)
            m.set(gid, g)
        })
        return Array.from(m.values())
    }, [projectTiles])

    const addGroup = () => {
        if (!groupName.trim()) { showToast('Podaj nazwę grupy', 'danger'); return }
        const newGroup = { id: crypto.randomUUID(), name: groupName.trim(), description: groupDesc || undefined, thumbnail: groupThumb, files: groupFiles }
        const currentGroups = project.groups || []
        const next = { groups: [...currentGroups, newGroup] }
        // update project groups
        update(project.id, next)
        showToast('Grupa utworzona', 'success')
        setCreatingGroup(false)
        setGroupName(''); setGroupDesc(''); setGroupThumb(undefined); setGroupFiles([])
    }

    function TileCard({ tile }: { tile: Tile }) {
        const [{ isDragging }, drag] = useDrag(() => ({
            type: ItemTypes.TILE,
            item: { id: tile.id },
            collect: (monitor) => ({ isDragging: monitor.isDragging() })
        }), [tile.id])

        const dragRef = useCallback((el: HTMLDivElement | null) => {
            if (el) drag(el)
        }, [drag])

        return (
            <div ref={dragRef} className="card border-0 bg-light" style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }} onClick={() => handleTileClick(tile)}>
                <div className="card-body p-2">
                    <h6 className="mb-1 text-truncate">{tile.name}</h6>
                    <small className="text-muted d-block">{tile.id}</small>
                    <div className="d-flex justify-content-between align-items-center mt-1">
                        <span className={`badge ${getStatusBadgeClass(tile.status)}`}>{tile.status}</span>
                        <small className="text-muted">{tileCosts.find((_, idx) => projectTiles[idx]?.id === tile.id)?.toLocaleString('pl-PL')} PLN</small>
                    </div>
                </div>
            </div>
        )
    }

    function KanbanColumn({ columnId, title, color }: { columnId: 'nowy' | 'projektowanie' | 'cnc' | 'montaz'; title: string; color: string }) {
        const [, drop] = useDrop<DragItem>(() => ({
            accept: ItemTypes.TILE,
            drop: (item) => {
                const newStatus = statusFromColumn(columnId)
                updateTile(item.id, { status: newStatus })
            }
        }), [columnId])

        const dropRef = useCallback((el: HTMLDivElement | null) => {
            if (el) drop(el)
        }, [drop])

        const tilesInColumn = projectTiles.filter(t => getKanbanStatus(t.status) === columnId)
        return (
            <div className="col-12 col-md-6 col-lg-3">
                <div className="card h-100" ref={dropRef}>
                    <div className={`card-header ${color} text-white d-flex justify-content-between align-items-center`}>
                        <h6 className="mb-0">{title}</h6>
                        <span className="badge bg-light text-dark">{tilesInColumn.length}</span>
                    </div>
                    <div className="card-body">
                        <div className="d-flex flex-column gap-2">
                            {tilesInColumn.map(tile => (
                                <TileCard key={tile.id} tile={tile} />
                            ))}
                            {tilesInColumn.length === 0 && (
                                <div className="text-center text-muted small">Brak</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Modern Project Header */}
            <div className="mb-4">
                {/* Gradient Header Background */}
                <div
                    className="rounded-3 position-relative overflow-hidden mb-3 p-4"
                    style={{
                        height: 180,
                        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.1"%3E%3Cpath d="m0 40 40-40v40z"/%3E%3C/g%3E%3C/svg%3E")'
                    }}
                >
                    {/* Navigation Breadcrumb */}
                    <div className="d-flex align-items-center text-white mb-3">
                        <button className="btn btn-sm text-white p-0 me-2" onClick={() => navigate('/projekty')}>
                            <i className="ri-arrow-left-line"></i>
                        </button>
                        <nav className="text-white small opacity-75">
                            <span className="me-1">Dashboard</span>
                            <i className="ri-arrow-right-s-line mx-1"></i>
                            <span className="me-1">Project</span>
                            <i className="ri-arrow-right-s-line mx-1"></i>
                            <span>Project {project.id}</span>
                        </nav>
                    </div>

                    {/* Google Logo Style Icon */}
                    <div className="position-absolute" style={{ bottom: '20px', left: '20px' }}>
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center bg-white shadow"
                            style={{ width: 48, height: 48 }}
                        >
                            <i className="ri-briefcase-line h5 mb-0 text-primary"></i>
                        </div>
                    </div>
                </div>

                {/* Project Info Section */}
                <div className="position-relative" style={{ marginTop: '-40px', zIndex: 10 }}>
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center mb-2">
                                        <h3 className="mb-0 me-3">{project.name}</h3>
                                        <span className={`badge fs-6 px-3 py-2 ${getStatusBadgeClass(project.status)}`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className="d-flex align-items-center text-muted mb-3">
                                        <i className="ri-calendar-line me-2"></i>
                                        <span className="me-4">{project.deadline}</span>
                                        <i className="ri-user-line me-2"></i>
                                        <span>{project.manager || 'Anna Kowalska'}</span>
                                    </div>
                                </div>

                                {/* Team Avatars and Actions */}
                                <div className="d-flex align-items-center gap-3">
                                    <div className="d-flex align-items-center">
                                        {teamMembers.slice(0, 4).map((m, index) => (
                                            <img
                                                key={m.id}
                                                src={m.avatar}
                                                alt={m.name}
                                                className="rounded-circle border border-2 border-white shadow-sm"
                                                width="36"
                                                height="36"
                                                style={{
                                                    marginLeft: index > 0 ? -12 : 0,
                                                    zIndex: teamMembers.length - index
                                                }}
                                                title={m.name}
                                            />
                                        ))}
                                        {teamMembers.length > 4 && (
                                            <div
                                                className="rounded-circle bg-light border border-2 border-white d-flex align-items-center justify-content-center text-muted small fw-medium shadow-sm"
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    marginLeft: -12,
                                                    zIndex: 0
                                                }}
                                            >
                                                +{teamMembers.length - 4}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => setShowAddMember(true)}
                                    >
                                        <i className="ri-user-add-line me-1"></i>Invite
                                    </button>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => setShowEditProject(true)}
                                    >
                                        <i className="ri-edit-line me-1"></i>Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="text-center">
                                <div className="h2 mb-0">{overallProgress}%</div>
                                <div className="text-muted small">Ogólny Postęp</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="text-center">
                                <div className="h2 mb-0">{teamMembers.length}</div>
                                <div className="text-muted small">Członków Zespołu</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="text-center">
                                <div className="h2 mb-0">{stages.filter(s => s.status === 'completed').length}/{stages.length}</div>
                                <div className="text-muted small">Etapy Ukończone</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="text-center">
                                <div className="h2 mb-0">{documents.length}</div>
                                <div className="text-muted small">Dokumenty</div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row g-3 mt-1">
                        <div className="col-12 col-md-6">
                            <div className="text-muted small">Szacowany koszt projektu (kafelki)</div>
                            <div className="h4 mb-0">{projectCost.toLocaleString('pl-PL')} PLN</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Navigation Tabs */}
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom">
                    <nav className="nav nav-tabs border-0" style={{ marginBottom: '-1px' }}>
                        {[
                            { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line', requiredModule: null },
                            { id: 'list', label: 'List', icon: 'ri-list-check', requiredModule: null },
                            { id: 'board', label: 'Board', icon: 'ri-layout-column-line', requiredModule: null },
                            { id: 'timeline', label: 'Timeline', icon: 'ri-time-line', requiredModule: null },
                            { id: 'attachment', label: 'Attachment', icon: 'ri-attachment-line', requiredModule: null },
                            // legacy tabs kept for advanced views
                            { id: 'elementy', label: 'Elementy', icon: 'ri-layout-grid-line', requiredModule: 'projektowanie_techniczne' },
                            { id: 'zakupy', label: 'Zakupy', icon: 'ri-shopping-cart-line', requiredModule: 'materialy' }
                        ].filter(tab => {
                            // Always show main tabs, show other tabs only if required module is enabled
                            if (tab.requiredModule === null) return true
                            return project?.modules?.includes(tab.requiredModule as any)
                        }).map(tab => (
                            <button
                                key={tab.id}
                                className={`nav-link border-0 px-3 py-2 rounded-top ${activeTab === tab.id ? 'active bg-white text-primary border-bottom-0' : 'text-muted bg-transparent'}`}
                                onClick={() => setActiveTab(tab.id as any)}
                                style={{
                                    marginRight: '4px',
                                    borderBottom: activeTab === tab.id ? '2px solid #0d6efd' : '2px solid transparent',
                                    fontWeight: activeTab === tab.id ? '600' : '400'
                                }}
                            >
                                <i className={`${tab.icon} me-2`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="card-body">
                    {/* Modern Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="row g-4">
                            {/* Main Content */}
                            <div className="col-12 col-lg-8">
                                {/* About Project Section */}
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body p-4">
                                        <h5 className="mb-3">About Project</h5>
                                        <p className="text-muted mb-3">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl dui, fringilla ac venenatis
                                            ut, varius et arcu. Duis non mollis nisl. Praesellus a facilisis ligula, sit amet ultrices arcu.
                                            Vestibulum sit amet elit nisi. Vestibulum lacus massa, ultricies dictum accumsan gravida sit amet.
                                            rutrum ut odio. Nulla lorem diam, euismod et condimentum eu, luctortis nec ex.
                                        </p>

                                        {/* Attachment Section */}
                                        <div className="mb-4">
                                            <h6 className="mb-3">Attachment</h6>
                                            <div className="d-flex gap-3">
                                                <div className="d-flex align-items-center p-2 bg-light rounded">
                                                    <i className="ri-file-text-line text-primary me-2 h5 mb-0"></i>
                                                    <div>
                                                        <div className="fw-medium small">About Project.doc</div>
                                                        <small className="text-muted">300 KB</small>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center p-2 bg-light rounded">
                                                    <i className="ri-file-pdf-line text-danger me-2 h5 mb-0"></i>
                                                    <div>
                                                        <div className="fw-medium small">Requirement.pdf</div>
                                                        <small className="text-muted">300 KB</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Activity Section */}
                                        <h6 className="mb-3">Activity</h6>
                                        <div className="list-group list-group-flush">
                                            {[
                                                {
                                                    avatar: teamMembers[0]?.avatar,
                                                    action: 'New Task Added',
                                                    description: 'Doni Tan created new task',
                                                    time: '05/02/23, 14:00'
                                                },
                                                {
                                                    avatar: teamMembers[1]?.avatar,
                                                    action: 'Task Status Changed',
                                                    description: 'Josh Adam move Moodboard task to Done',
                                                    time: '02/02/23, 10:00',
                                                    badge: { from: 'In Progress', to: 'Done' }
                                                },
                                                {
                                                    avatar: teamMembers[2]?.avatar,
                                                    action: 'Comment Replied',
                                                    description: 'Lisa Whitaker commented "Oke Veronica thank you --" in Wireframe Task',
                                                    time: '28/01/23, 09:15'
                                                },
                                                {
                                                    avatar: teamMembers[3]?.avatar,
                                                    action: 'New File Uploaded',
                                                    description: 'Jay Hargudson upload new attachment',
                                                    time: '28/01/23, 09:15'
                                                }
                                            ].map((activity, index) => (
                                                <div key={index} className="list-group-item border-0 px-0 py-3">
                                                    <div className="d-flex">
                                                        <img
                                                            src={activity.avatar}
                                                            alt="User"
                                                            className="rounded-circle me-3"
                                                            width="36"
                                                            height="36"
                                                        />
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                                <h6 className="mb-0 small fw-semibold">{activity.action}</h6>
                                                                <small className="text-muted">{activity.time}</small>
                                                            </div>
                                                            <p className="text-muted small mb-0">{activity.description}</p>
                                                            {activity.badge && (
                                                                <div className="mt-2">
                                                                    <span className="badge bg-warning text-dark me-2">{activity.badge.from}</span>
                                                                    <i className="ri-arrow-right-line text-muted mx-1"></i>
                                                                    <span className="badge bg-success">{activity.badge.to}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="col-12 col-lg-4">
                                {/* Budget Card */}
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0">Budget</h6>
                                            <button className="btn btn-sm btn-outline-primary">
                                                <i className="ri-add-line me-1"></i>Add Transaction
                                            </button>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="h4 mb-0 text-warning">$28,000</span>
                                                <span className="text-muted">$50,000</span>
                                            </div>
                                            <div className="progress mt-2" style={{ height: 6 }}>
                                                <div className="progress-bar bg-warning" style={{ width: '56%' }}></div>
                                            </div>
                                        </div>

                                        <h6 className="mb-3">Transactions</h6>
                                        <div className="list-group list-group-flush">
                                            {[
                                                { name: 'Jira Subscription', type: 'Expenses', amount: '-$500', color: 'primary' },
                                                { name: 'Zoom Subscription', type: 'Expenses', amount: '-$500', color: 'success' },
                                                { name: 'Hiring New Designer', type: 'Expenses', amount: '-$8,000', color: 'danger' },
                                                { name: 'Cloud Server', type: 'Expenses', amount: '-$19,500', color: 'purple' }
                                            ].map((transaction, index) => (
                                                <div key={index} className="list-group-item border-0 px-0 py-2">
                                                    <div className="d-flex align-items-center">
                                                        <div
                                                            className={`rounded-circle me-3 d-flex align-items-center justify-content-center bg-${transaction.color}`}
                                                            style={{ width: 32, height: 32 }}
                                                        >
                                                            <i className="ri-arrow-down-line text-white small"></i>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="fw-medium small">{transaction.name}</div>
                                                            <small className="text-muted">{transaction.type}</small>
                                                        </div>
                                                        <div className="fw-medium">{transaction.amount}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Team Card */}
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0">Team ({teamMembers.length + 1})</h6>
                                            <button className="btn btn-sm btn-outline-primary">
                                                <i className="ri-add-line me-1"></i>Add New
                                            </button>
                                        </div>

                                        <div className="list-group list-group-flush">
                                            {teamMembers.slice(0, 5).map(member => (
                                                <div key={member.id} className="list-group-item border-0 px-0 py-2">
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={member.avatar}
                                                            alt={member.name}
                                                            className="rounded-circle me-3"
                                                            width="32"
                                                            height="32"
                                                        />
                                                        <div className="flex-grow-1">
                                                            <div className="fw-medium small">{member.name}</div>
                                                            <small className="text-muted">{member.role}</small>
                                                        </div>
                                                        <div className="d-flex gap-1">
                                                            <button className="btn btn-sm btn-outline-secondary">
                                                                <i className="ri-phone-line"></i>
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-secondary">
                                                                <i className="ri-mail-line"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* List Tab - grouped tasks */}
                    {activeTab === 'list' && (
                        <div className="row g-3">
                            {(['active', 'completed', 'pending'] as const).map(group => (
                                <div key={group} className="col-12">
                                    <div className="card">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <div className="fw-semibold text-capitalize">{group === 'active' ? 'In Progress' : group === 'completed' ? 'Done' : 'To Do'}</div>
                                            <span className="badge bg-label-secondary">{stages.filter(s => s.status === group).length}</span>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table align-middle mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Assign</th>
                                                        <th>Due Date</th>
                                                        <th>Priority</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stages.filter(s => s.status === group).map(s => (
                                                        <tr key={s.id}>
                                                            <td>{s.name}</td>
                                                            <td>{s.assignedTo}</td>
                                                            <td>{s.endDate}</td>
                                                            <td>
                                                                <span className={`badge ${getStageBadgeClass(s.status)}`}>{s.status}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {stages.filter(s => s.status === group).length === 0 && (
                                                        <tr><td colSpan={4} className="text-muted">Brak zadań</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Modern Board Tab */}
                    {activeTab === 'board' && (
                        <div>
                            {/* Board Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <button className="btn btn-sm btn-outline-secondary">
                                        <i className="ri-add-line me-1"></i>
                                        Add New
                                    </button>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <button className="btn btn-sm btn-outline-secondary">
                                        <i className="ri-equalizer-line me-1"></i>
                                        Filters
                                    </button>
                                    <button className="btn btn-sm btn-outline-secondary">
                                        <i className="ri-sort-desc me-1"></i>
                                        Sort by
                                    </button>
                                    <button className="btn btn-sm btn-outline-secondary">
                                        <i className="ri-more-line"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Kanban Columns */}
                            <div className="row g-4">
                                {([
                                    { key: 'pending', title: 'To Do', count: 3, color: '#6c757d', bgColor: '#f8f9fa' },
                                    { key: 'active', title: 'In Progress', count: 3, color: '#fd7e14', bgColor: '#fff3cd' },
                                    { key: 'completed', title: 'Done', count: 2, color: '#198754', bgColor: '#d1e7dd' },
                                    { key: 'pending', title: 'Pending', count: 3, color: '#dc3545', bgColor: '#f8d7da' }
                                ] as const).map((col, colIndex) => (
                                    <div key={`${col.key}-${colIndex}`} className="col-12 col-md-6 col-lg-3">
                                        {/* Column Header */}
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="rounded-circle me-2"
                                                    style={{
                                                        width: 12,
                                                        height: 12,
                                                        backgroundColor: col.color
                                                    }}
                                                ></div>
                                                <h6 className="mb-0">{col.title}</h6>
                                                <span className="badge bg-light text-muted ms-2">{col.count}</span>
                                            </div>
                                            <button className="btn btn-sm btn-outline-secondary">
                                                <i className="ri-add-line"></i>
                                            </button>
                                        </div>

                                        {/* Task Cards */}
                                        <div className="d-flex flex-column gap-3">
                                            {stages.filter(s => s.status === col.key).slice(0, 3).map((stage, index) => {
                                                const priorities = ['Medium', 'High', 'Medium', 'High', 'Low']
                                                const priority = priorities[index] || 'Medium'
                                                const progressColors = ['#dc3545', '#fd7e14', '#198754']
                                                const progressColor = progressColors[index % progressColors.length]
                                                const mockProgress = [90, 50, 100][index] || stage.progress

                                                return (
                                                    <div key={stage.id} className="card border-0 shadow-sm">
                                                        <div className="card-body p-3">
                                                            {/* Priority Badge */}
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <span className={`badge ${priority === 'High' ? 'bg-danger' :
                                                                    priority === 'Medium' ? 'bg-warning' : 'bg-success'
                                                                    } text-white small`}>
                                                                    {priority}
                                                                </span>
                                                                <button className="btn btn-sm btn-link text-muted p-0">
                                                                    <i className="ri-more-line"></i>
                                                                </button>
                                                            </div>

                                                            {/* Task Title */}
                                                            <h6 className="mb-2 fw-semibold">{stage.name}</h6>
                                                            <p className="text-muted small mb-3 lh-sm">
                                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut lorem et mauris tempor...
                                                            </p>

                                                            {/* Progress Bar */}
                                                            <div className="mb-3">
                                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                                    <small className="text-muted">Progress</small>
                                                                    <small className="fw-medium">{mockProgress}%</small>
                                                                </div>
                                                                <div className="progress" style={{ height: 6 }}>
                                                                    <div
                                                                        className="progress-bar"
                                                                        style={{
                                                                            width: `${mockProgress}%`,
                                                                            backgroundColor: progressColor
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                            </div>

                                                            {/* Footer with Team and Date */}
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="d-flex align-items-center">
                                                                    {teamMembers.slice(0, 3).map((member, memberIndex) => (
                                                                        <img
                                                                            key={member.id}
                                                                            src={member.avatar}
                                                                            alt={member.name}
                                                                            className="rounded-circle border border-2 border-white"
                                                                            width="24"
                                                                            height="24"
                                                                            style={{
                                                                                marginLeft: memberIndex > 0 ? -8 : 0,
                                                                                zIndex: 3 - memberIndex
                                                                            }}
                                                                            title={member.name}
                                                                        />
                                                                    ))}
                                                                    <span className="badge bg-light text-muted border border-2 border-white ms-1" style={{ marginLeft: -8 }}>
                                                                        +1
                                                                    </span>
                                                                </div>
                                                                <div className="d-flex align-items-center text-muted small">
                                                                    <i className="ri-calendar-line me-1"></i>
                                                                    21 Oct 2022
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}

                                            {/* Add New Card */}
                                            {colIndex === 0 && (
                                                <div className="card border-2 border-dashed border-secondary bg-light">
                                                    <div className="card-body p-3 text-center">
                                                        <button className="btn btn-sm btn-outline-secondary">
                                                            <i className="ri-add-line me-1"></i>
                                                            Add New Task
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Elementy Tab */}
                    {activeTab === 'elementy' && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 className="mb-0">Elementy Projektu</h5>
                                    <p className="text-muted small mb-0">Tablica Kanban lub widok grup</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-primary btn-sm" onClick={handleAddTile}>
                                        <i className="ri-add-line me-1"></i>Dodaj element
                                    </button>
                                    <div className="btn-group" role="group">
                                        <button className={`btn btn-outline-secondary btn-sm ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')}>
                                            <i className="ri-layout-grid-line me-1"></i>Kanban
                                        </button>
                                        <button className={`btn btn-outline-secondary btn-sm ${viewMode === 'groups' ? 'active' : ''}`} onClick={() => setViewMode('groups')}>
                                            <i className="ri-folder-line me-1"></i>Grupy
                                        </button>
                                    </div>
                                    <button className="btn btn-success btn-sm ms-2" onClick={() => setCreatingGroup(true)}>
                                        <i className="ri-add-circle-line me-1"></i>Stwórz grupę
                                    </button>
                                    {project.modules?.includes('produkcja') && (
                                        <button
                                            className="btn btn-warning btn-sm ms-2"
                                            onClick={() => {
                                                const { pushAcceptedTilesToQueue } = useTilesStore.getState()
                                                pushAcceptedTilesToQueue(project.id)
                                            }}
                                        >
                                            <i className="ri-send-plane-line me-1"></i>Wyślij do produkcji
                                        </button>
                                    )}
                                </div>
                            </div>

                            {viewMode === 'kanban' && (
                                <div className="row g-3">
                                    <KanbanColumn columnId="nowy" title="Nowy" color="bg-secondary" />
                                    <KanbanColumn columnId="projektowanie" title="Projektowanie" color="bg-warning" />
                                    <KanbanColumn columnId="cnc" title="Wycinanie CNC" color="bg-primary" />
                                    <KanbanColumn columnId="montaz" title="Składanie (Produkcja)" color="bg-success" />
                                </div>
                            )}

                            {viewMode === 'groups' && (
                                <div className="row g-3">
                                    {groups.map(group => (
                                        <div key={group.id} className="col-12 col-md-6 col-lg-4">
                                            <div className="card h-100">
                                                <div className="card-header d-flex justify-content-between align-items-center">
                                                    <h6 className="mb-0">{group.name}</h6>
                                                    <span className="badge bg-secondary">{group.tiles.length}</span>
                                                </div>
                                                <div className="card-body">
                                                    <div className="d-flex flex-column gap-2">
                                                        {group.tiles.map(tile => (
                                                            <TileCard key={tile.id} tile={tile} />
                                                        ))}
                                                        {group.tiles.length === 0 && (
                                                            <div className="text-center text-muted small">Brak elementów</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Zakupy Tab */}
                    {activeTab === 'zakupy' && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Lista zakupowa (Do zamówienia)</h5>
                                <button className="btn btn-sm btn-outline-info" onClick={() => {
                                    const rows = purchaseList.map(i => ({ name: i.name, unit: i.unit, quantity: i.quantity, supplier: i.supplier || '' }))
                                    const csv = ['name,unit,quantity,supplier', ...rows.map(r => `"${r.name}",${r.unit},${r.quantity},${r.supplier}`)].join('\n')
                                    const blob = new Blob([csv], { type: 'text/csv' })
                                    const url = URL.createObjectURL(blob)
                                    const a = document.createElement('a'); a.href = url; a.download = `zakupy_${project.id}.csv`; a.click(); URL.revokeObjectURL(url)
                                }}>
                                    <i className="ri-file-download-line me-1"></i>Export CSV
                                </button>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-sm align-middle">
                                    <thead><tr><th>Pozycja</th><th>Jm</th><th>Ilość</th><th>Dostawca</th></tr></thead>
                                    <tbody>
                                        {purchaseList.map((i, idx) => (
                                            <tr key={idx}><td>{i.name}</td><td>{i.unit}</td><td>{i.quantity}</td><td>{i.supplier || '-'}</td></tr>
                                        ))}
                                        {purchaseList.length === 0 && (
                                            <tr><td colSpan={4} className="text-muted text-center">Brak pozycji do zamówienia</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Tasks Tab */}
                    {activeTab === 'tasks' && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Zadania Projektu</h5>
                                <button className="btn btn-primary btn-sm">
                                    <i className="ri-add-line me-1"></i>Dodaj zadanie
                                </button>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Zadanie</th>
                                            <th>Przypisane do</th>
                                            <th>Status</th>
                                            <th>Deadline</th>
                                            <th>Postęp</th>
                                            <th>Akcje</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stages.map(stage => (
                                            <tr key={stage.id}>
                                                <td>{stage.name}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img src={`https://i.pravatar.cc/24?img=${Math.floor(Math.random() * 10)}`}
                                                            alt={stage.assignedTo} className="rounded-circle me-2" width="24" height="24" />
                                                        {stage.assignedTo}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStageBadgeClass(stage.status)}`}>
                                                        {stage.status}
                                                    </span>
                                                </td>
                                                <td>{stage.endDate}</td>
                                                <td>
                                                    <div className="progress" style={{ width: 80, height: 6 }}>
                                                        <div className="progress-bar bg-primary" style={{ width: `${stage.progress}%` }}></div>
                                                    </div>
                                                    <small>{stage.progress}%</small>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-primary me-1">
                                                        <i className="ri-edit-line"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger">
                                                        <i className="ri-delete-bin-line"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Modern Attachment Tab */}
                    {activeTab === 'attachment' && (
                        <div>
                            {/* Header with Search and Actions */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="input-group" style={{ maxWidth: 350 }}>
                                    <span className="input-group-text bg-transparent border-end-0">
                                        <i className="ri-search-line text-muted"></i>
                                    </span>
                                    <input
                                        className="form-control border-start-0"
                                        placeholder="Search..."
                                        style={{ boxShadow: 'none' }}
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-secondary btn-sm">
                                        <i className="ri-equalizer-line me-1"></i>Filters
                                    </button>
                                    <button className="btn btn-outline-secondary btn-sm">
                                        <i className="ri-sort-desc me-1"></i>Sort by
                                    </button>
                                    <button className="btn btn-outline-secondary btn-sm">
                                        <i className="ri-more-line"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Files Grid */}
                            <div className="row g-3">
                                {[
                                    {
                                        id: 'doc-1',
                                        name: 'Meeting MOM.doc',
                                        size: '300 KB',
                                        type: 'DOC',
                                        icon: 'ri-file-word-line',
                                        color: 'primary'
                                    },
                                    {
                                        id: 'doc-2',
                                        name: 'Requirement.pdf',
                                        size: '300 KB',
                                        type: 'PDF',
                                        icon: 'ri-file-pdf-line',
                                        color: 'danger'
                                    },
                                    {
                                        id: 'doc-3',
                                        name: 'Design Inspiration.zip',
                                        size: '300 KB',
                                        type: 'ZIP',
                                        icon: 'ri-file-zip-line',
                                        color: 'warning'
                                    },
                                    {
                                        id: 'doc-4',
                                        name: 'User Flows.eps',
                                        size: '300 KB',
                                        type: 'EPS',
                                        icon: 'ri-file-3-line',
                                        color: 'success'
                                    },
                                    {
                                        id: 'doc-5',
                                        name: 'Meeting MOM.doc',
                                        size: '300 KB',
                                        type: 'DOC',
                                        icon: 'ri-file-word-line',
                                        color: 'primary'
                                    },
                                    {
                                        id: 'doc-6',
                                        name: 'User Flows.eps',
                                        size: '300 KB',
                                        type: 'EPS',
                                        icon: 'ri-file-3-line',
                                        color: 'success'
                                    }
                                ].map(doc => (
                                    <div key={doc.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                        <div className="card border-0 shadow-sm h-100">
                                            <div className="card-body p-3">
                                                {/* File Icon and Checkbox */}
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div
                                                        className={`rounded d-flex align-items-center justify-content-center text-${doc.color}`}
                                                        style={{
                                                            width: 48,
                                                            height: 48,
                                                            backgroundColor: `rgba(var(--bs-${doc.color}-rgb), 0.1)`
                                                        }}
                                                    >
                                                        <i className={`${doc.icon} h4 mb-0`}></i>
                                                    </div>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" />
                                                    </div>
                                                </div>

                                                {/* File Info */}
                                                <div className="mb-3">
                                                    <h6 className="mb-1 fw-semibold small">{doc.name}</h6>
                                                    <small className="text-muted">{doc.size}</small>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="d-flex gap-1">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary flex-fill"
                                                        title="Download"
                                                    >
                                                        <i className="ri-download-line"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary flex-fill"
                                                        title="Preview"
                                                    >
                                                        <i className="ri-eye-line"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        title="More actions"
                                                    >
                                                        <i className="ri-more-line"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Documents Tab (legacy) */}
                    {activeTab === 'documents' && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Dokumenty Projektu</h5>
                                <button className="btn btn-primary btn-sm">
                                    <i className="ri-upload-line me-1"></i>Dodaj dokument
                                </button>
                            </div>
                            <div className="row g-3">
                                {documents.map(doc => (
                                    <div key={doc.id} className="col-12 col-md-6 col-lg-4">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className={`${doc.type === 'PDF' ? 'ri-file-pdf-line text-danger' :
                                                        doc.type === 'DWG' ? 'ri-file-3-line text-primary' :
                                                            doc.type === 'DXF' ? 'ri-file-code-line text-warning' :
                                                                'ri-file-excel-line text-success'
                                                        } me-2 h5 mb-0`}></i>
                                                    <div className="flex-grow-1">
                                                        <div className="fw-medium">{doc.name}</div>
                                                        <small className="text-muted">{doc.size}</small>
                                                    </div>
                                                </div>
                                                <div className="text-muted small mb-2">
                                                    Dodane przez {doc.uploadedBy}<br />
                                                    {doc.uploadedAt}
                                                </div>
                                                <div className="d-flex gap-1">
                                                    <button className="btn btn-sm btn-outline-primary">
                                                        <i className="ri-download-line"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-secondary">
                                                        <i className="ri-eye-line"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger">
                                                        <i className="ri-delete-bin-line"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Team Tab */}
                    {activeTab === 'team' && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Zespół Projektu</h5>
                                <button className="btn btn-primary btn-sm">
                                    <i className="ri-user-add-line me-1"></i>Dodaj członka
                                </button>
                            </div>
                            <div className="row g-3">
                                {teamMembers.map(member => (
                                    <div key={member.id} className="col-12 col-md-6 col-lg-4">
                                        <div className="card">
                                            <div className="card-body text-center">
                                                <img src={member.avatar} alt={member.name} className="rounded-circle mb-3" width="64" height="64" />
                                                <h6 className="mb-1">{member.name}</h6>
                                                <p className="text-muted small mb-3">{member.role}</p>
                                                <div className="mb-2">
                                                    <small className="text-muted">Obciążenie: {member.workload}%</small>
                                                    <div className="progress mt-1" style={{ height: 6 }}>
                                                        <div
                                                            className={`progress-bar ${member.workload > 80 ? 'bg-danger' : member.workload > 60 ? 'bg-warning' : 'bg-success'}`}
                                                            style={{ width: `${member.workload}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="d-flex gap-1 justify-content-center">
                                                    <button className="btn btn-sm btn-outline-primary">
                                                        <i className="ri-message-line"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-secondary">
                                                        <i className="ri-edit-line"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timeline Tab */}
                    {activeTab === 'timeline' && (
                        <div>
                            <h5 className="mb-3">Oś Czasu Projektu</h5>
                            <div className="timeline">
                                {stages.map((stage, index) => (
                                    <div key={stage.id} className="d-flex mb-4">
                                        <div className="flex-shrink-0 me-3">
                                            <div className={`rounded-circle d-flex align-items-center justify-content-center ${getStageBadgeClass(stage.status)}`}
                                                style={{ width: 40, height: 40 }}>
                                                {stage.status === 'completed' ? (
                                                    <i className="ri-check-line text-white"></i>
                                                ) : stage.status === 'active' ? (
                                                    <i className="ri-play-circle-line text-white"></i>
                                                ) : (
                                                    <span className="text-white small">{index + 1}</span>
                                                )}
                                            </div>
                                            {index < stages.length - 1 && (
                                                <div className="border-start border-2 ms-3" style={{ height: 60, marginTop: 8 }}></div>
                                            )}
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 className="mb-0">{stage.name}</h6>
                                                        <span className={`badge ${getStageBadgeClass(stage.status)}`}>
                                                            {stage.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-muted small mb-2">
                                                        <i className="ri-calendar-line me-1"></i>
                                                        {stage.startDate} - {stage.endDate}
                                                    </div>
                                                    <div className="text-muted small mb-2">
                                                        <i className="ri-user-line me-1"></i>
                                                        {stage.assignedTo}
                                                    </div>
                                                    <div className="progress" style={{ height: 6 }}>
                                                        <div
                                                            className={`progress-bar ${getStageBadgeClass(stage.status).replace('bg-', 'bg-')}`}
                                                            style={{ width: `${stage.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <small className="text-muted">{stage.progress}% ukończone</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Comments Section */}
            <div className="card mt-4">
                <div className="card-header">
                    <h5 className="mb-0">Komentarze</h5>
                </div>
                <div className="card-body">
                    {/* Add Comment */}
                    <div className="d-flex mb-3">
                        <img src="https://i.pravatar.cc/40" alt="Current User" className="rounded-circle me-3" width="40" height="40" />
                        <div className="flex-grow-1">
                            <textarea
                                className="form-control mb-2"
                                rows={3}
                                placeholder="Napisz komentarz..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            ></textarea>
                            <button className="btn btn-primary btn-sm" onClick={handleAddComment}>
                                <i className="ri-send-plane-line me-1"></i>Dodaj komentarz
                            </button>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="list-group list-group-flush">
                        {comments.map(comment => (
                            <div key={comment.id} className="list-group-item px-0">
                                <div className="d-flex">
                                    <img src={comment.avatar} alt={comment.author} className="rounded-circle me-3" width="40" height="40" />
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between">
                                            <strong className="text-primary">{comment.author}</strong>
                                            <small className="text-muted">{comment.timestamp}</small>
                                        </div>
                                        <p className="mb-0">{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tile Management Modal */}
            {showTileModal && (
                <TileEditModal
                    tile={editingTile || {
                        id: 'new',
                        name: '',
                        status: 'W KOLEJCE',
                        project: project.id,
                        priority: 'Średni',
                        technology: 'Frezowanie CNC',
                        laborCost: 0,
                        bom: []
                    }}
                    onClose={() => setShowTileModal(false)}
                    onSave={handleSaveTile}
                />
            )}

            {/* Add Member Modal */}
            {showAddMember && (
                <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Dodaj członków</h5>
                                <button className="btn-close" onClick={() => setShowAddMember(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <div className="text-muted small mb-1">Wybrani:</div>
                                    <div className="d-flex flex-wrap gap-1">
                                        {teamMembers.filter(m => selectedMemberIds.includes(m.id)).map(m => (
                                            <span key={m.id} className="badge bg-light text-dark border">{m.name}</span>
                                        ))}
                                        {selectedMemberIds.length === 0 && <span className="text-muted">Brak</span>}
                                    </div>
                                </div>
                                <div className="input-group mb-2">
                                    <span className="input-group-text"><i className="ri-search-line"></i></span>
                                    <input className="form-control" placeholder="Szukaj członków..." />
                                </div>
                                <div className="list-group" style={{ maxHeight: 360, overflowY: 'auto' }}>
                                    {teamMembers.map(m => (
                                        <label key={m.id} className="list-group-item d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <img src={m.avatar} alt={m.name} className="rounded-circle me-3" width="36" height="36" />
                                                <div>
                                                    <div className="fw-semibold">{m.name}</div>
                                                    <small className="text-muted">{m.role}</small>
                                                </div>
                                            </div>
                                            <input className="form-check-input" type="checkbox"
                                                checked={selectedMemberIds.includes(m.id)}
                                                onChange={() => setSelectedMemberIds(prev => prev.includes(m.id) ? prev.filter(id => id !== m.id) : [...prev, m.id])} />
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-secondary" onClick={() => setShowAddMember(false)}>Anuluj</button>
                                <button className="btn btn-primary" onClick={() => { setShowAddMember(false); showToast('Dodano członków', 'success') }}>Dodaj</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Project Modal */}
            {showEditProject && (
                <EditProjectModal open={showEditProject} projectId={project.id} onClose={() => setShowEditProject(false)} />
            )}

            {/* Create Group Modal */}
            {creatingGroup && (
                <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nowa grupa</h5>
                                <button className="btn-close" onClick={() => setCreatingGroup(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-2">
                                    <label className="form-label">Nazwa grupy</label>
                                    <input className="form-control" value={groupName} onChange={e => setGroupName(e.currentTarget.value)} />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Opis</label>
                                    <textarea className="form-control" rows={3} value={groupDesc} onChange={e => setGroupDesc(e.currentTarget.value)} />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Miniatura</label>
                                    <input type="file" accept="image/*" className="form-control" onChange={async e => {
                                        const f = e.currentTarget.files?.[0]; if (!f) return
                                        const reader = new FileReader(); reader.onload = () => setGroupThumb(reader.result as string); reader.readAsDataURL(f)
                                    }} />
                                    {groupThumb && <img src={groupThumb} alt="thumb" className="mt-2 rounded" style={{ maxWidth: '100%' }} />}
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Pliki/Dokumentacja</label>
                                    <input type="file" multiple className="form-control" onChange={async e => {
                                        const files = Array.from(e.currentTarget.files || [])
                                        const readers = await Promise.all(files.map(f => new Promise<string>((resolve) => { const r = new FileReader(); r.onload = () => resolve(r.result as string); r.readAsDataURL(f) })))
                                        const appended = files.map((f, idx) => ({ id: crypto.randomUUID(), name: f.name, url: readers[idx], type: f.type }))
                                        setGroupFiles(prev => [...prev, ...appended])
                                    }} />
                                    {groupFiles.length > 0 && (
                                        <ul className="list-group mt-2">
                                            {groupFiles.map(f => (
                                                <li key={f.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <span className="text-truncate" style={{ maxWidth: 280 }}>{f.name}</span>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => setGroupFiles(prev => prev.filter(x => x.id !== f.id))}><i className="ri-delete-bin-line"></i></button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-secondary" onClick={() => setCreatingGroup(false)}>Anuluj</button>
                                <button className="btn btn-primary" onClick={addGroup}>Zapisz</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}



