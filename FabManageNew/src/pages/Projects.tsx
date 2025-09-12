import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectsStore } from '../stores/projectsStore'
import { useTilesStore } from '../stores/tilesStore'
import { showToast } from '../lib/notifications'
import { StatusBadge } from '../components/Ui/StatusBadge'
import { PageHeader } from '../components/Ui/PageHeader'
import ProjectCard from '../components/Project/ProjectCard'
// zod removed after AntD Form migration
import type { Project, ProjectModule, ProjectWithStats } from '../types/projects.types'
import EditProjectModal from '../components/EditProjectModal'
import { Card, Form, Row, Col, Select, Input, Button, Segmented, Space, Table, Tag, Pagination, Dropdown, Modal, DatePicker } from 'antd'
import { createClient } from '../services/clients'

export default function Projects() {
    const navigate = useNavigate()
    // Use Zustand selectors to reduce re-renders
    const projects = useProjectsStore(s => s.projects)
    const update = useProjectsStore(s => s.update)
    const add = useProjectsStore(s => s.add)
    const remove = useProjectsStore(s => s.remove)
    const initialize = useProjectsStore(s => s.initialize)
    const isLoading = useProjectsStore(s => s.isLoading)
    const isInitialized = useProjectsStore(s => s.isInitialized)
    const tiles = useTilesStore(s => s.tiles)
    const setTileStatus = useTilesStore(s => s.setStatus)

    // DEBUG: Log projects data
    console.warn('📋 Projects DEBUG:', {
        projectsCount: projects.length,
        isLoading,
        isInitialized,
        sampleProject: projects[0],
        allProjectIds: projects.map(p => ({ id: p.id, name: p.name }))
    })

    // Basic filters
    const [status, setStatus] = useState<'All' | 'Nowy' | 'Wyceniany' | 'W realizacji' | 'Zakończony' | 'Wstrzymany'>('All')
    const [client, setClient] = useState<'All' | string>('All')
    const [query, setQuery] = useState('')
    const [view, setView] = useState<'Lista' | 'Kafelki' | 'Kanban' | 'Gantt' | 'Kalendarz'>('Kafelki')

    // Advanced filters
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
    const [managerFilter, setManagerFilter] = useState<'All' | string>('All')
    const [dateFilter, setDateFilter] = useState<'All' | 'This Week' | 'This Month' | 'Overdue'>('All')
    const [budgetRange, setBudgetRange] = useState([0, 500000])
    const [selectedProjects, setSelectedProjects] = useState<string[]>([])
    const [editId, setEditId] = useState<string | null>(null)
    const [ctxMenu, setCtxMenu] = useState<{ open: boolean; x: number; y: number; id: string | null }>({ open: false, x: 0, y: 0, id: null })
    const [createOpen, setCreateOpen] = useState(false)
    const [createForm, setCreateForm] = useState<Omit<Project, 'id'>>({
        numer: 'P-2025/01/NEW',
        name: '',
        typ: 'Inne',
        lokalizacja: '',
        clientId: 'C-NEW',
        client: '',
        status: 'Nowy',
        data_utworzenia: new Date().toISOString().slice(0, 10),
        deadline: new Date().toISOString().slice(0, 10),
        postep: 0,
        groups: [],
        modules: ['wycena', 'koncepcja'] as ProjectModule[]
    })

    // Legacy validation schema not used after AntD migration

    // Pagination and sorting
    const [currentPage, setCurrentPage] = useState(1)
    const [projectsPerPage] = useState(10)
    const [sortBy, setSortBy] = useState<'name' | 'client' | 'deadline' | 'status'>('name')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

    // Filter presets (unused for now)
    // const [presets, setPresets] = useState<string[]>(() => JSON.parse(localStorage.getItem('proj_presets') || '[]'))
    const [debouncedQuery, setDebouncedQuery] = useState('')

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 300)
        return () => clearTimeout(timer)
    }, [query])

    // Close context menu on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setCtxMenu({ open: false, x: 0, y: 0, id: null }) }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])


    // Derived data
    const uniqueClients = useMemo(() => Array.from(new Set(projects.map(p => p.client))), [projects])
    const uniqueManagers = useMemo(() => ['Anna Kowalska', 'Paweł Nowak', 'Maria Lis'], []) // Mock data

    // Calculate modules and tiles count for each project
    const projectsWithStats = useMemo((): ProjectWithStats[] => {
        return projects.map(project => {
            const projectTiles = tiles.filter(tile => tile.project === project.id)
            const modulesCount = project.modules?.length || 0
            const tilesCount = projectTiles.length

            return {
                ...project,
                modulesCount,
                tilesCount
            }
        })
    }, [projects, tiles])

    // Enhanced filtering logic
    const filtered = useMemo(() => {
        return projectsWithStats.filter(p => {
            // Basic filters
            const byStatus = status === 'All' ? true : p.status === status
            const byClient = client === 'All' ? true : p.client === client
            const byQuery = debouncedQuery.trim() === '' ? true :
                (p.name + ' ' + p.client + ' ' + p.id).toLowerCase().includes(debouncedQuery.toLowerCase())

            // Advanced filters
            const byManager = managerFilter === 'All' ? true : managerFilter === 'Anna Kowalska' // Mock

            // Date filter
            let byDate = true
            if (dateFilter !== 'All') {
                const deadline = new Date(p.deadline)
                const today = new Date()
                const oneWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                const oneMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

                switch (dateFilter) {
                    case 'This Week': {
                        byDate = deadline <= oneWeek
                        break
                    }
                    case 'This Month': {
                        byDate = deadline <= oneMonth
                        break
                    }
                    case 'Overdue': {
                        byDate = deadline < today && p.status !== 'Zakończony'
                        break
                    }
                }
            }

            // Budget range (mock budget data)
            const mockBudget = Math.floor(Math.random() * 500000)
            const byBudget = mockBudget >= budgetRange[0] && mockBudget <= budgetRange[1]

            return byStatus && byClient && byQuery && byManager && byDate && byBudget
        })
    }, [projectsWithStats, status, client, debouncedQuery, managerFilter, dateFilter, budgetRange])

    // Sorting
    const sortedAndFiltered = useMemo(() => {
        const sorted = [...filtered].sort((a, b) => {
            let aVal: unknown, bVal: unknown

            switch (sortBy) {
                case 'name':
                    aVal = (a.name || '').toLowerCase()
                    bVal = (b.name || '').toLowerCase()
                    break
                case 'client':
                    aVal = (a.client || '').toLowerCase()
                    bVal = (b.client || '').toLowerCase()
                    break
                case 'deadline':
                    aVal = new Date(a.deadline || 0)
                    bVal = new Date(b.deadline || 0)
                    break
                case 'status':
                    aVal = a.status || ''
                    bVal = b.status || ''
                    break
                default:
                    return 0
            }

            if ((aVal as any) < (bVal as any)) return sortOrder === 'asc' ? -1 : 1
            if ((aVal as any) > (bVal as any)) return sortOrder === 'asc' ? 1 : -1
            return 0
        })

        return sorted
    }, [filtered, sortBy, sortOrder])

    // Pagination
    const totalPages = Math.ceil(sortedAndFiltered.length / projectsPerPage)
    const startIndex = (currentPage - 1) * projectsPerPage
    const paginatedProjects = sortedAndFiltered.slice(startIndex, startIndex + projectsPerPage)

    const metrics = useMemo(() => {
        const total = sortedAndFiltered.length
        const today = new Date()
        const daysToDeadline = sortedAndFiltered.map(p => Math.ceil((new Date(p.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
        const avgDays = total ? Math.round(daysToDeadline.reduce((a, b) => a + b, 0) / total) : 0
        const done = sortedAndFiltered.filter(p => (p.status as any) === 'Zakończony').length
        const onTime = sortedAndFiltered.filter(p => (p.status as any) === 'Zakończony' && new Date(p.deadline) >= today).length
        const onTimePct = done ? Math.round((onTime / done) * 100) : 0
        const overdue = sortedAndFiltered.filter(p => new Date(p.deadline) < today && (p.status as any) !== 'Zakończony').length
        return { total, avgDays, onTimePct, overdue }
    }, [sortedAndFiltered])

    // Action handlers
    // sorting handled by column headers in future EntityTable; placeholder removed

    // select-all not used in EntityTable minimal integration

    const handleSelectProject = (id: string) => {
        setSelectedProjects(prev =>
            prev.includes(id)
                ? prev.filter(p => p !== id)
                : [...prev, id]
        )
    }

    const handleBulkAction = (action: 'delete' | 'export' | 'archive') => {
        if (selectedProjects.length === 0) {
            showToast('Wybierz przynajmniej jeden projekt', 'warning')
            return
        }

        switch (action) {
            case 'delete':
                if (confirm(`Czy na pewno chcesz usunąć ${selectedProjects.length} projektów?`)) {
                    selectedProjects.forEach(id => remove(id))
                    setSelectedProjects([])
                    showToast(`Usunięto ${selectedProjects.length} projektów`, 'success')
                }
                break
            case 'export': {
                const selectedData = paginatedProjects.filter(p => selectedProjects.includes(p.id))
                const csv = ['id,name,client,status,deadline', ...selectedData.map(r => `${r.id},"${r.name}",${r.client},${r.status},${r.deadline}`)].join('\n')
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a'); a.href = url; a.download = 'selected_projects.csv'; a.click(); URL.revokeObjectURL(url)
                showToast(`Wyeksportowano ${selectedProjects.length} projektów`, 'success')
                break
            }
            case 'archive': {
                selectedProjects.forEach(id => update(id, { status: 'done' as any }))
                setSelectedProjects([])
                showToast(`Zarchiwizowano ${selectedProjects.length} projektów`, 'success')
                break
            }
        }
    }

    const clearAllFilters = () => {
        setStatus('All')
        setClient('All')
        setQuery('')
        setManagerFilter('All')
        setDateFilter('All')
        setBudgetRange([0, 500000])
        setCurrentPage(1)
        showToast('Filtry zostały wyczyszczone', 'info')
    }

    // replaced by <StatusBadge />

    return (
        <div data-component="ProjectsPage">
            <PageHeader
                title="Projekty"
                subtitle="Zarządzaj wszystkimi projektami w firmie"
                actions={
                    <div className="d-flex gap-2">
                        {selectedProjects.length > 0 && (
                            <div className="d-flex gap-2">
                                <Button onClick={() => handleBulkAction('delete')}>Usuń ({selectedProjects.length})</Button>
                                <Button onClick={() => handleBulkAction('export')}>Export</Button>
                                <Button onClick={() => handleBulkAction('archive')}>Archiwizuj</Button>
                            </div>
                        )}
                        <Button type="primary" onClick={() => setCreateOpen(true)}>Nowy Projekt</Button>
                    </div>
                }
            />

            {/* Filters – pure Ant Design */}
            <Card style={{ marginBottom: 12 }}>
                <Form layout="vertical">
                    <Row gutter={[12, 12]}>
                        <Col xs={24} md={6}>
                            <Form.Item label="Status projektu">
                                <Select
                                    size="middle"
                                    value={status}
                                    onChange={(v) => setStatus(v as typeof status)}
                                    options={[
                                        { value: 'All', label: `Wszystkie (${projects.length})` },
                                        { value: 'Nowy', label: `Nowy (${projects.filter(p => (p.status as any) === 'Nowy').length})` },
                                        { value: 'Wyceniany', label: `Wyceniany (${projects.filter(p => (p.status as any) === 'Wyceniany').length})` },
                                        { value: 'W realizacji', label: `W realizacji (${projects.filter(p => (p.status as any) === 'W realizacji').length})` },
                                        { value: 'Zakończony', label: `Zakończony (${projects.filter(p => (p.status as any) === 'Zakończony').length})` },
                                        { value: 'Wstrzymany', label: `Wstrzymany (${projects.filter(p => (p.status as any) === 'Wstrzymany').length})` }
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                            <Form.Item label="Klient">
                                <Select
                                    size="middle"
                                    value={client}
                                    onChange={(v) => setClient(v)}
                                    options={[{ value: 'All', label: 'Wszyscy klienci' }, ...uniqueClients.map(c => ({ value: c, label: c }))]}
                                    showSearch
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label="Wyszukiwanie">
                                <Input.Search
                                    allowClear
                                    placeholder="Szukaj po nazwie, kliencie lub ID..."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item label="Widok">
                                <Segmented
                                    block
                                    value={view}
                                    onChange={(v) => setView(v as typeof view)}
                                    options={[{ label: 'Lista', value: 'Lista' }, { label: 'Kafelki', value: 'Kafelki' }]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => initialize()}
                                    loading={isLoading}
                                >
                                    🔄 Reload API ({projects.length})
                                </Button>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                    {isInitialized ? '✅ Zainicjalizowano' : '⏳ Ładowanie...'} | {projects.length} projektów
                                </span>
                                <Button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>{showAdvancedFilters ? 'Ukryj filtry' : 'Filtry zaawansowane'}</Button>
                                {(status !== 'All' || client !== 'All' || query || managerFilter !== 'All' || dateFilter !== 'All') && (
                                    <Button onClick={clearAllFilters}>Wyczyść filtry</Button>
                                )}
                                <Button onClick={() => {
                                    const csv = ['id,name,client,status,deadline', ...sortedAndFiltered.map(r => `${r.id},"${r.name}",${r.client},${r.status},${r.deadline}`)].join('\n')
                                    const blob = new Blob([csv], { type: 'text/csv' })
                                    const url = URL.createObjectURL(blob)
                                    const a = document.createElement('a'); a.href = url; a.download = 'projects.csv'; a.click(); URL.revokeObjectURL(url)
                                    showToast('Projekty wyeksportowane do CSV', 'success')
                                }}>Export CSV</Button>
                            </Space>
                        </Col>
                    </Row>

                    {showAdvancedFilters && (
                        <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                            <Col xs={24} md={6}>
                                <Form.Item label="Kierownik projektu">
                                    <Select value={managerFilter} onChange={v => setManagerFilter(v)} options={[{ value: 'All', label: 'Wszyscy kierownicy' }, ...uniqueManagers.map(m => ({ value: m, label: m }))]} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item label="Termin">
                                    <Select value={dateFilter} onChange={v => setDateFilter(v as typeof dateFilter)} options={[{ value: 'All', label: 'Wszystkie terminy' }, { value: 'This Week', label: 'Ten tydzień' }, { value: 'This Month', label: 'Ten miesiąc' }, { value: 'Overdue', label: 'Opóźnione' }]} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item label="Budżet (PLN)">
                                    <Space.Compact block>
                                        <Input type="number" placeholder="Od" value={budgetRange[0]} onChange={e => setBudgetRange([parseInt(e.target.value) || 0, budgetRange[1]])} />
                                        <Input type="number" placeholder="Do" value={budgetRange[1]} onChange={e => setBudgetRange([budgetRange[0], parseInt(e.target.value) || 500000])} />
                                    </Space.Compact>
                                </Form.Item>
                            </Col>
                        </Row>
                    )}
                </Form>
            </Card>

            {/* KPI Row */}
            <Row gutter={[12, 12]} style={{ marginBottom: 12 }} data-component="KPIRow">
                <Col xs={12} lg={6}>
                    <Card>
                        <div className="text-center">
                            <div className="h4 mb-1">{metrics.total}</div>
                            <div className="text-muted small">Wszystkich projektów</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card>
                        <div className="text-center">
                            <div className="h4 mb-1 text-warning">{metrics.overdue}</div>
                            <div className="text-muted small">Opóźnionych</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card>
                        <div className="text-center">
                            <div className="h4 mb-1">{metrics.avgDays}</div>
                            <div className="text-muted small">Śr. dni do deadline</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card>
                        <div className="text-center">
                            <div className="h4 mb-1 text-success">{metrics.onTimePct}%</div>
                            <div className="text-muted small">Na czas</div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Results Info */}
            <Space style={{ marginBottom: 12, width: '100%', justifyContent: 'space-between' }}>
                <span className="text-muted small">Pokazano {paginatedProjects.length} z {sortedAndFiltered.length} projektów {selectedProjects.length > 0 && ` • ${selectedProjects.length} zaznaczonych`}</span>
                <Space>
                    <span className="text-muted small">Sortuj:</span>
                    <Select<string> size="small" value={sortBy} style={{ width: 140 }} onChange={(v) => setSortBy(v as typeof sortBy)} options={[
                        { value: 'name', label: 'Nazwa' },
                        { value: 'client', label: 'Klient' },
                        { value: 'deadline', label: 'Deadline' },
                        { value: 'status', label: 'Status' }
                    ]} />
                    <Button size="small" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}> {sortOrder === 'asc' ? 'Rosnąco' : 'Malejąco'} </Button>
                </Space>
            </Space>

            {/* Empty state */}
            {sortedAndFiltered.length === 0 && (
                <Card style={{ marginBottom: 12 }}>
                    <div className="text-center">
                        <h5 className="mb-1">Brak wyników</h5>
                        <p className="text-muted mb-3">Dostosuj filtry lub utwórz nowy projekt.</p>
                        <Button type="primary" onClick={() => navigate('/projekty/nowy')} aria-label="Utwórz nowy projekt">
                            <i className="ri-add-line me-1"></i>Nowy projekt
                        </Button>
                    </div>
                </Card>
            )}

            {view === 'Lista' ? (
                <>
                    {/* Projects Table */}
                    <Card data-component="ProjectsTableCard">
                        <Table
                            rowKey={(p: Project) => p.id}
                            dataSource={paginatedProjects}
                            onRow={(record) => ({
                                onClick: () => {
                                    console.warn('🔗 Table row navigation:', { id: record.id, name: record.name, record })
                                    navigate(`/projekt/${record.id}`)
                                }
                            })}
                            pagination={false}
                            columns={[
                                {
                                    title: '', dataIndex: 'select', width: 40,
                                    render: (_: unknown, p: Project) => (
                                        <input type="checkbox" className="form-check-input" checked={selectedProjects.includes(p.id)} onChange={(e) => { e.stopPropagation(); handleSelectProject(p.id) }} />
                                    )
                                },
                                {
                                    title: 'Projekt', dataIndex: 'name',
                                    render: (_: unknown, p: Project) => (
                                        <div>
                                            <div className="fw-medium">{p.name}</div>
                                            <div className="text-muted small">{p.id}</div>
                                            <div className="text-muted small">
                                                {p.modules?.length || 0} modułów • {tiles.filter(t => t.project === p.id).length} elementów
                                            </div>
                                        </div>
                                    )
                                },
                                { title: 'Klient', dataIndex: 'client' },
                                { title: 'Status', dataIndex: 'status', render: (_: unknown, p: Project) => <StatusBadge status={p.status} /> },
                                {
                                    title: 'Deadline', dataIndex: 'deadline',
                                    render: (_: unknown, p: Project) => {
                                        const isOverdue = new Date(p.deadline) < new Date() && p.status !== 'Zakończony'
                                        return <span className={isOverdue ? 'text-danger fw-medium' : ''}>{p.deadline}</span>
                                    }
                                },
                            ]}
                        />
                    </Card>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            style={{ marginTop: 12, textAlign: 'right' }}
                            size="small"
                            current={currentPage}
                            total={sortedAndFiltered.length}
                            pageSize={projectsPerPage}
                            onChange={setCurrentPage}
                            showSizeChanger={false}
                        />
                    )}
                </>
            ) : view === 'Kafelki' ? (
                <>
                    {/* Project Cards */}
                    <Row gutter={[16, 16]} data-component="ProjectCards">
                        {paginatedProjects.map(project => {
                            const projectWithStats = projectsWithStats.find(p => p.id === project.id) || project

                            return (
                                <Col key={project.id} xs={24} sm={12} lg={8} xl={6}>
                                    <ProjectCard
                                        project={projectWithStats}
                                        onEdit={(project) => setEditId(project.id)}
                                        onDelete={(project) => {
                                            if (confirm(`Usunąć projekt "${project.name}"?`)) {
                                                remove(project.id)
                                                showToast('Projekt został usunięty', 'success')
                                            }
                                        }}
                                    />
                                </Col>
                            )
                        })}
                    </Row>

                    {/* Pagination for Tiles */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-4" data-component="TilesPaginationBar">
                            <div className="text-muted small">
                                Strona {currentPage} z {totalPages} • {paginatedProjects.length} z {sortedAndFiltered.length} projektów
                            </div>
                            <nav>
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <i className="ri-arrow-left-line"></i>
                                        </button>
                                    </li>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const page = i + 1
                                        return (
                                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        )
                                    })}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <i className="ri-arrow-right-line"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </>
            ) : (
                /* Kanban View */
                <Row gutter={[12, 12]} data-component="KanbanBoard">
                    {(['W realizacji', 'Wstrzymany', 'Zakończony'] as const).map(colStatus => (
                        <Col key={colStatus} xs={24} md={8}>
                            <Card
                                data-component="KanbanColumn"
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => {
                                    const id = e.dataTransfer.getData('text/plain')
                                    if (id) {
                                        update(id, { status: colStatus })
                                        // propagate to tiles for this project id
                                        const related = tiles.filter(t => t.project === id)
                                        if (colStatus === 'Zakończony') {
                                            related.forEach(t => setTileStatus(t.id, 'WYCIĘTE'))
                                        } else if (colStatus === 'W realizacji') {
                                            related.forEach(t => {
                                                if (t.status !== 'WYCIĘTE') setTileStatus(t.id, 'W KOLEJCE')
                                            })
                                        }
                                        showToast(`Zmieniono status projektu ${id} → ${colStatus}`, 'success')
                                    }
                                }}
                            >
                                <div className="fw-semibold" style={{ marginBottom: 8 }}>
                                    {colStatus}
                                    <Tag style={{ marginLeft: 8 }}>{filtered.filter(p => p.status === colStatus).length}</Tag>
                                </div>
                                <div style={{ minHeight: 300 }} data-component="KanbanColumnBody">
                                    {filtered.filter(p => p.status === colStatus).map(p => (
                                        <Card
                                            key={p.id}
                                            data-component="KanbanCard"
                                            draggable
                                            onDragStart={e => {
                                                e.dataTransfer.setData('text/plain', p.id)
                                            }}
                                        >
                                            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                                <div>
                                                    <div className="fw-medium">{p.name}</div>
                                                    <div className="text-muted small">{p.id} • {p.client}</div>
                                                </div>
                                                <Button size="small" onClick={() => {
                                                    console.warn('🔗 Navigating to project:', { id: p.id, name: p.name, fullProject: p })
                                                    navigate(`/projekt/${p.id}`)
                                                }} aria-label={`Otwórz projekt ${p.name}`}>Otwórz</Button>
                                            </Space>
                                            <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 8 }}>
                                                <Tag>{p.deadline}</Tag>
                                                <Dropdown
                                                    menu={{ items: (['W realizacji', 'Wstrzymany', 'Zakończony'] as const).map(s => ({ key: s, label: s, onClick: () => update(p.id, { status: s }) })) }}
                                                >
                                                    <Button size="small">Status</Button>
                                                </Dropdown>
                                            </Space>
                                        </Card>
                                    ))}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
            {/* Context menu */}
            {ctxMenu.open && ctxMenu.id && (
                <div
                    className="position-fixed bg-white border rounded shadow"
                    style={{ top: ctxMenu.y, left: ctxMenu.x, zIndex: 1080, minWidth: 200 }}
                    onMouseLeave={() => setCtxMenu({ open: false, x: 0, y: 0, id: null })}
                >
                    <button className="dropdown-item" onClick={() => { navigate(`/projekt/${ctxMenu.id}`); setCtxMenu({ open: false, x: 0, y: 0, id: null }) }}>
                        <i className="ri-eye-line me-2" /> Otwórz projekt
                    </button>
                    <button className="dropdown-item" onClick={() => { setEditId(ctxMenu.id); setCtxMenu({ open: false, x: 0, y: 0, id: null }) }}>
                        <i className="ri-edit-line me-2" /> Edytuj
                    </button>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item text-danger" onClick={() => {
                        const p = projects.find(pr => pr.id === ctxMenu.id)
                        if (p && confirm(`Usunąć projekt "${p.name}"?`)) { remove(p.id); showToast('Projekt został usunięty', 'success') }
                        setCtxMenu({ open: false, x: 0, y: 0, id: null })
                    }}>
                        <i className="ri-delete-bin-line me-2" /> Usuń
                    </button>
                </div>
            )}
            {/* Edit Modal */}
            <EditProjectModal open={!!editId} projectId={editId} onClose={() => setEditId(null)} />

            {/* Create Project Modal */}
            <Modal
                title="Nowy Projekt"
                open={createOpen}
                onCancel={() => setCreateOpen(false)}
                onOk={async () => {
                    // Ensure client exists; if no clientId but client name provided, create backend client
                    let clientId = createForm.clientId
                    if (!clientId && createForm.client.trim()) {
                        try {
                            const c = await createClient({ name: createForm.client.trim() })
                            clientId = c.id
                        } catch {
                            clientId = `c-${Date.now()}`
                        }
                    }
                    await add({ ...createForm, clientId })
                    showToast('Projekt utworzony', 'success')
                    setCreateOpen(false)
                    setCreateForm({ numer: 'P-2025/01/NEW', name: '', typ: 'Inne', lokalizacja: '', clientId: 'C-NEW', client: '', status: 'Nowy', data_utworzenia: new Date().toISOString().slice(0, 10), deadline: new Date().toISOString().slice(0, 10), postep: 0, groups: [], modules: ['wycena', 'koncepcja'] })
                }}
                okText="Zapisz"
                cancelText="Anuluj"
            >
                <Form layout="vertical">
                    <Form.Item label="Nazwa" required>
                        <Input value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} />
                    </Form.Item>
                    <Row gutter={[12, 12]}>
                        <Col xs={24} md={12}>
                            <Form.Item label="Nazwa klienta">
                                <Input value={createForm.client} placeholder="np. Teatr Narodowy" onChange={e => setCreateForm({ ...createForm, client: e.target.value })} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="ID klienta (opcjonalnie)">
                                <Input value={createForm.clientId} placeholder="Wypełni się po utworzeniu klienta" onChange={e => setCreateForm({ ...createForm, clientId: e.target.value })} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Deadline">
                                <DatePicker style={{ width: '100%' }} onChange={(_, v) => setCreateForm({ ...createForm, deadline: (v as string) || '' })} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Moduły projektu">
                                <Select
                                    mode="multiple"
                                    value={createForm.modules as ProjectModule[]}
                                    onChange={(vals) => setCreateForm({ ...createForm, modules: vals as ProjectModule[] })}
                                    options={[
                                        { value: 'wycena', label: 'Wycena' },
                                        { value: 'koncepcja', label: 'Koncepcja' },
                                        { value: 'projektowanie', label: 'Projektowanie' },
                                        { value: 'projektowanie_techniczne', label: 'Projektowanie techniczne' },
                                        { value: 'produkcja', label: 'Produkcja' },
                                        { value: 'materialy', label: 'Materiały' },
                                        { value: 'logistyka', label: 'Logistyka' },
                                        { value: 'logistyka_montaz', label: 'Logistyka + Montaż' },
                                        { value: 'zakwaterowanie', label: 'Zakwaterowanie' },
                                        { value: 'montaz', label: 'Montaż' },
                                        { value: 'model_3d', label: 'Model 3D' }
                                    ]}
                                    placeholder="Wybierz moduły (np. Model 3D)"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Status">
                                <Select value={createForm.status} onChange={v => setCreateForm({ ...createForm, status: v as any })} options={[{ value: 'Nowy', label: 'Nowy' }, { value: 'Wyceniany', label: 'Wyceniany' }, { value: 'W realizacji', label: 'W realizacji' }, { value: 'Zakończony', label: 'Zakończony' }, { value: 'Wstrzymany', label: 'Wstrzymany' }]} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    )
}
