import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectsStore } from '../stores/projectsStore'
import { showToast } from '../lib/toast'
import { useTilesStore, type Tile } from '../stores/tilesStore'
import TileEditModal from '../components/TileEditModal'
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

    const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'documents' | 'team' | 'timeline' | 'elementy' | 'zakupy'>('overview')
    const [newComment, setNewComment] = useState('')
    const [showTileModal, setShowTileModal] = useState(false)
    const [editingTile, setEditingTile] = useState<Tile | null>(null)
    const [viewMode, setViewMode] = useState<'kanban' | 'groups'>('kanban')
    const [creatingGroup, setCreatingGroup] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [groupDesc, setGroupDesc] = useState('')
    const [groupThumb, setGroupThumb] = useState<string | undefined>(undefined)
    const [groupFiles, setGroupFiles] = useState<{ id: string; name: string; url: string; type: string }[]>([])

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

    const handleStatusChange = async (newStatus: 'Active' | 'On Hold' | 'Done') => {
        await update(project.id, { status: newStatus })
        showToast(`Status projektu zmieniony na: ${newStatus}`, 'success')
    }

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
        return (
            <div ref={drag} className="card border-0 bg-light" style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }} onClick={() => handleTileClick(tile)}>
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
        const tilesInColumn = projectTiles.filter(t => getKanbanStatus(t.status) === columnId)
        return (
            <div className="col-12 col-md-6 col-lg-3">
                <div className="card h-100" ref={drop}>
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
            {/* Project Header */}
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <div className="d-flex align-items-center mb-2">
                        <button className="btn btn-sm btn-outline-secondary me-3" onClick={() => navigate('/projekty')}>
                            <i className="ri-arrow-left-line"></i>
                        </button>
                        <h4 className="mb-0">{project.name}</h4>
                        <span className={`badge ms-2 ${getStatusBadgeClass(project.status)}`}>{project.status}</span>
                    </div>
                    <div className="text-muted">
                        <span className="me-3"><i className="ri-building-line me-1"></i>{project.client}</span>
                        <span className="me-3"><i className="ri-calendar-line me-1"></i>Deadline: {project.deadline}</span>
                        <span><i className="ri-user-line me-1"></i>PM: Anna Kowalska</span>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <div className="dropdown">
                        <button className="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
                            Zmień status
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#" onClick={() => handleStatusChange('Active')}>Active</a></li>
                            <li><a className="dropdown-item" href="#" onClick={() => handleStatusChange('On Hold')}>On Hold</a></li>
                            <li><a className="dropdown-item" href="#" onClick={() => handleStatusChange('Done')}>Done</a></li>
                        </ul>
                    </div>
                    <button className="btn btn-primary">
                        <i className="ri-edit-line me-1"></i>Edytuj
                    </button>
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

            {/* Navigation Tabs */}
            <div className="card">
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                        {[
                            { id: 'overview', label: 'Przegląd', icon: 'ri-dashboard-line' },
                            { id: 'elementy', label: 'Elementy', icon: 'ri-layout-grid-line' },
                            { id: 'zakupy', label: 'Zakupy', icon: 'ri-shopping-cart-line' },
                            { id: 'tasks', label: 'Zadania', icon: 'ri-task-line' },
                            { id: 'documents', label: 'Dokumenty', icon: 'ri-folder-line' },
                            { id: 'team', label: 'Zespół', icon: 'ri-team-line' },
                            { id: 'timeline', label: 'Oś Czasu', icon: 'ri-time-line' }
                        ].map(tab => (
                            <li className="nav-item" key={tab.id}>
                                <button
                                    className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id as any)}
                                >
                                    <i className={`${tab.icon} me-1`}></i>{tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card-body">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="row g-4">
                            <div className="col-12 col-lg-8">
                                <h5 className="mb-3">Etapy Projektu</h5>
                                <div className="list-group">
                                    {stages.map(stage => (
                                        <div key={stage.id} className="list-group-item">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="d-flex align-items-center">
                                                    <span className={`badge me-2 ${getStageBadgeClass(stage.status)}`}>
                                                        {stage.status === 'completed' ? '✓' : stage.status === 'active' ? '●' : '○'}
                                                    </span>
                                                    <strong>{stage.name}</strong>
                                                </div>
                                                <span className="text-muted small">{stage.progress}%</span>
                                            </div>
                                            <div className="progress mb-2" style={{ height: 6 }}>
                                                <div
                                                    className={`progress-bar ${getStageBadgeClass(stage.status).replace('bg-', 'bg-')}`}
                                                    style={{ width: `${stage.progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="d-flex justify-content-between text-muted small">
                                                <span><i className="ri-user-line me-1"></i>{stage.assignedTo}</span>
                                                <span>{stage.startDate} - {stage.endDate}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-12 col-lg-4">
                                <h5 className="mb-3">Ostatnie Komentarze</h5>
                                <div className="list-group list-group-flush">
                                    {comments.slice(0, 3).map(comment => (
                                        <div key={comment.id} className="list-group-item px-0">
                                            <div className="d-flex">
                                                <img src={comment.avatar} alt={comment.author} className="rounded-circle me-3" width="32" height="32" />
                                                <div className="flex-grow-1">
                                                    <div className="d-flex justify-content-between">
                                                        <strong className="text-primary">{comment.author}</strong>
                                                        <small className="text-muted">{comment.timestamp}</small>
                                                    </div>
                                                    <p className="mb-0 small">{comment.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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

                    {/* Documents Tab */}
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



