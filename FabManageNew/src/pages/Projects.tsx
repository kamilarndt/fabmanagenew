import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectsStore } from '../stores/projectsStore'
import { useTilesStore } from '../stores/tilesStore'
import { showToast } from '../lib/toast'
import { StatusBadge } from '../components/Ui/StatusBadge'
import { PageHeader } from '../components/Ui/PageHeader'
import { FormModal } from '../components/Ui/FormModal'
import { z } from 'zod'
import type { Project, ProjectModule } from '../types/projects.types'
import EditProjectModal from '../components/EditProjectModal'
import { EntityTable, type Column } from '../components/Ui/EntityTable'

export default function Projects() {
    const navigate = useNavigate()
    // Use Zustand selectors to reduce re-renders
    const projects = useProjectsStore(s => s.projects)
    const update = useProjectsStore(s => s.update)
    const add = useProjectsStore(s => s.add)
    const remove = useProjectsStore(s => s.remove)
    const tiles = useTilesStore(s => s.tiles)
    const setTileStatus = useTilesStore(s => s.setStatus)

    // Basic filters
    const [status, setStatus] = useState<'All' | 'Active' | 'On Hold' | 'Done'>('All')
    const [client, setClient] = useState<'All' | string>('All')
    const [query, setQuery] = useState('')
    const [view, setView] = useState<'Lista' | 'Kafelki' | 'Kanban' | 'Gantt' | 'Kalendarz'>('Lista')

    // Advanced filters
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
    const [managerFilter, setManagerFilter] = useState<'All' | string>('All')
    const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All')
    const [dateFilter, setDateFilter] = useState<'All' | 'This Week' | 'This Month' | 'Overdue'>('All')
    const [budgetRange, setBudgetRange] = useState([0, 500000])
    const [selectedProjects, setSelectedProjects] = useState<string[]>([])
    const [editId, setEditId] = useState<string | null>(null)
    const [ctxMenu, setCtxMenu] = useState<{ open: boolean; x: number; y: number; id: string | null }>({ open: false, x: 0, y: 0, id: null })
    const [createOpen, setCreateOpen] = useState(false)
    const [createForm, setCreateForm] = useState<Omit<Project, 'id'>>({
        name: '',
        clientId: 'C-NEW',
        client: '',
        status: 'Active',
        deadline: new Date().toISOString().slice(0, 10),
        groups: [],
        modules: ['wycena', 'koncepcja'] as ProjectModule[]
    })

    const ModuleEnum = z.enum(['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy', 'logistyka_montaz', 'zakwaterowanie'])
    const createSchema = z.object({
        name: z.string().min(2, 'Podaj nazwę'),
        clientId: z.string().min(1, 'clientId wymagany'),
        client: z.string().min(2, 'Podaj klienta'),
        status: z.enum(['Active', 'On Hold', 'Done']),
        deadline: z.string().min(4),
        groups: z.array(z.any()).optional(),
        modules: z.array(ModuleEnum).optional(),
        budget: z.number().optional(),
        manager: z.string().optional(),
        description: z.string().optional()
    })

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

    const openContextMenu = (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        setCtxMenu({ open: true, x: e.clientX, y: e.clientY, id })
    }

    // Derived data
    const uniqueClients = useMemo(() => Array.from(new Set(projects.map(p => p.client))), [projects])
    const uniqueManagers = useMemo(() => ['Anna Kowalska', 'Paweł Nowak', 'Maria Lis'], []) // Mock data

    // Enhanced filtering logic
    const filtered = useMemo(() => {
        return projects.filter(p => {
            // Basic filters
            const byStatus = status === 'All' ? true : p.status === status
            const byClient = client === 'All' ? true : p.client === client
            const byQuery = debouncedQuery.trim() === '' ? true :
                (p.name + ' ' + p.client + ' ' + p.id).toLowerCase().includes(debouncedQuery.toLowerCase())

            // Advanced filters
            const byManager = managerFilter === 'All' ? true : managerFilter === 'Anna Kowalska' // Mock
            const byPriority = priorityFilter === 'All' ? true : priorityFilter === 'High' // Mock

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
                        byDate = deadline < today && p.status !== 'Done'
                        break
                    }
                }
            }

            // Budget range (mock budget data)
            const mockBudget = Math.floor(Math.random() * 500000)
            const byBudget = mockBudget >= budgetRange[0] && mockBudget <= budgetRange[1]

            return byStatus && byClient && byQuery && byManager && byPriority && byDate && byBudget
        })
    }, [projects, status, client, debouncedQuery, managerFilter, priorityFilter, dateFilter, budgetRange])

    // Sorting
    const sortedAndFiltered = useMemo(() => {
        const sorted = [...filtered].sort((a, b) => {
            let aVal: unknown, bVal: unknown

            switch (sortBy) {
                case 'name':
                    aVal = a.name.toLowerCase()
                    bVal = b.name.toLowerCase()
                    break
                case 'client':
                    aVal = a.client.toLowerCase()
                    bVal = b.client.toLowerCase()
                    break
                case 'deadline':
                    aVal = new Date(a.deadline)
                    bVal = new Date(b.deadline)
                    break
                case 'status':
                    aVal = a.status
                    bVal = b.status
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
        const done = sortedAndFiltered.filter(p => p.status === 'Done').length
        const onTime = sortedAndFiltered.filter(p => p.status === 'Done' && new Date(p.deadline) >= today).length
        const onTimePct = done ? Math.round((onTime / done) * 100) : 0
        const overdue = sortedAndFiltered.filter(p => new Date(p.deadline) < today && p.status !== 'Done').length
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
                selectedProjects.forEach(id => update(id, { status: 'Done' }))
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
        setPriorityFilter('All')
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
                            <div className="btn-group">
                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleBulkAction('delete')}>
                                    <i className="ri-delete-bin-line me-1"></i>Usuń ({selectedProjects.length})
                                </button>
                                <button className="btn btn-outline-primary btn-sm" onClick={() => handleBulkAction('export')}>
                                    <i className="ri-download-line me-1"></i>Export
                                </button>
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleBulkAction('archive')}>
                                    <i className="ri-archive-line me-1"></i>Archiwizuj
                                </button>
                            </div>
                        )}
                        <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
                            <i className="ri-add-line me-1"></i>Nowy Projekt
                        </button>
                    </div>
                }
            />

            {/* Filters */}
            <div className="card mb-3" data-component="ProjectsFiltersCard">
                <div className="card-body" data-component="FiltersBody">
                    {/* Basic Filters Row */}
                    <div className="row g-3 mb-3" data-component="FiltersBasicRow">
                        <div className="col-12 col-md-3">
                            <label className="form-label small">Status projektu</label>
                            <select data-component="SelectStatus" value={status} onChange={e => setStatus(e.currentTarget.value as typeof status)} className="form-select form-select-sm">
                                <option value="All">Wszystkie ({projects.length})</option>
                                <option value="Active">Active ({projects.filter(p => p.status === 'Active').length})</option>
                                <option value="On Hold">On Hold ({projects.filter(p => p.status === 'On Hold').length})</option>
                                <option value="Done">Done ({projects.filter(p => p.status === 'Done').length})</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-3">
                            <label className="form-label small">Klient</label>
                            <select data-component="SelectClient" value={client} onChange={e => setClient(e.currentTarget.value)} className="form-select form-select-sm">
                                <option value="All">Wszyscy klienci</option>
                                {uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col-12 col-md-4">
                            <label className="form-label small">Wyszukiwanie</label>
                            <div className="input-group input-group-sm" data-component="SearchGroup">
                                <span className="input-group-text bg-transparent"><i className="ri-search-line"></i></span>
                                <input
                                    data-component="SearchInput"
                                    value={query}
                                    onChange={e => setQuery(e.currentTarget.value)}
                                    className="form-control"
                                    placeholder="Szukaj po nazwie, kliencie lub ID..."
                                />
                                {query && (
                                    <button className="btn btn-outline-secondary" onClick={() => setQuery('')}>
                                        <i className="ri-close-line"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-12 col-md-2">
                            <label className="form-label small">Widok</label>
                            <div className="btn-group w-100" role="group">
                                {(['Lista', 'Kafelki'] as const).map(v => (
                                    <button
                                        key={v}
                                        className={`btn btn-outline-secondary btn-sm ${view === v ? 'active' : ''}`}
                                        onClick={() => setView(v)}
                                    >
                                        <i className={`ri-${v === 'Lista' ? 'list-check' : 'grid-fill'}-line`}></i>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Advanced Filters Toggle */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <button
                            data-component="ToggleAdvancedFilters"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            aria-expanded={showAdvancedFilters}
                            aria-controls="advanced-filters"
                            aria-label="Pokaż lub ukryj filtry zaawansowane"
                        >
                            <i className={`ri-${showAdvancedFilters ? 'subtract' : 'add'}-line me-1`}></i>
                            Filtry zaawansowane
                        </button>
                        <div className="d-flex gap-2">
                            {(status !== 'All' || client !== 'All' || query || managerFilter !== 'All' || priorityFilter !== 'All' || dateFilter !== 'All') && (
                                <button data-component="ClearFilters" className="btn btn-sm btn-outline-warning" onClick={clearAllFilters} aria-label="Wyczyść wszystkie filtry">
                                    <i className="ri-refresh-line me-1"></i>Wyczyść filtry
                                </button>
                            )}
                            <button data-component="ExportProjectsCSV" className="btn btn-sm btn-outline-info" aria-label="Eksportuj projekty do CSV" onClick={() => {
                                const csv = ['id,name,client,status,deadline', ...sortedAndFiltered.map(r => `${r.id},"${r.name}",${r.client},${r.status},${r.deadline}`)].join('\n')
                                const blob = new Blob([csv], { type: 'text/csv' })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a'); a.href = url; a.download = 'projects.csv'; a.click(); URL.revokeObjectURL(url)
                                showToast('Projekty wyeksportowane do CSV', 'success')
                            }}>
                                <i className="ri-file-download-line me-1"></i>Export CSV
                            </button>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showAdvancedFilters && (
                        <div id="advanced-filters" className="border-top pt-3" data-component="AdvancedFilters">
                            <div className="row g-3">
                                <div className="col-12 col-md-3">
                                    <label className="form-label small">Kierownik projektu</label>
                                    <select value={managerFilter} onChange={e => setManagerFilter(e.currentTarget.value)} className="form-select form-select-sm">
                                        <option value="All">Wszyscy kierownicy</option>
                                        {uniqueManagers.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="col-12 col-md-3">
                                    <label className="form-label small">Priorytet</label>
                                    <select value={priorityFilter} onChange={e => setPriorityFilter(e.currentTarget.value as typeof priorityFilter)} className="form-select form-select-sm">
                                        <option value="All">Wszystkie</option>
                                        <option value="High">Wysoki</option>
                                        <option value="Medium">Średni</option>
                                        <option value="Low">Niski</option>
                                    </select>
                                </div>
                                <div className="col-12 col-md-3">
                                    <label className="form-label small">Termin</label>
                                    <select value={dateFilter} onChange={e => setDateFilter(e.currentTarget.value as typeof dateFilter)} className="form-select form-select-sm">
                                        <option value="All">Wszystkie terminy</option>
                                        <option value="This Week">Ten tydzień</option>
                                        <option value="This Month">Ten miesiąc</option>
                                        <option value="Overdue">Opóźnione</option>
                                    </select>
                                </div>
                                <div className="col-12 col-md-3">
                                    <label className="form-label small">Budżet (PLN)</label>
                                    <div className="d-flex gap-2">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            placeholder="Od"
                                            value={budgetRange[0]}
                                            onChange={e => setBudgetRange([parseInt(e.target.value) || 0, budgetRange[1]])}
                                        />
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            placeholder="Do"
                                            value={budgetRange[1]}
                                            onChange={e => setBudgetRange([budgetRange[0], parseInt(e.target.value) || 500000])}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* KPI Row */}
            <div className="row g-3 mb-3" data-component="KPIRow">
                <div className="col-6 col-lg-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="h4 mb-1">{metrics.total}</div>
                            <div className="text-muted small">Wszystkich projektów</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-lg-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="h4 mb-1 text-warning">{metrics.overdue}</div>
                            <div className="text-muted small">Opóźnionych</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-lg-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="h4 mb-1">{metrics.avgDays}</div>
                            <div className="text-muted small">Śr. dni do deadline</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-lg-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="h4 mb-1 text-success">{metrics.onTimePct}%</div>
                            <div className="text-muted small">Na czas</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Info */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="text-muted small">
                    Pokazano {paginatedProjects.length} z {sortedAndFiltered.length} projektów
                    {selectedProjects.length > 0 && ` • ${selectedProjects.length} zaznaczonych`}
                </div>
                <div className="d-flex align-items-center gap-2">
                    <label className="text-muted small">Sortuj:</label>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as typeof sortBy)}
                        className="form-select form-select-sm"
                        style={{ width: 'auto' }}
                    >
                        <option value="name">Nazwa</option>
                        <option value="client">Klient</option>
                        <option value="deadline">Deadline</option>
                        <option value="status">Status</option>
                    </select>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        aria-label="Zmień kierunek sortowania"
                    >
                        <i className={`ri-sort-${sortOrder === 'asc' ? 'asc' : 'desc'}-line`}></i>
                    </button>
                </div>
            </div>

            {/* Empty state */}
            {sortedAndFiltered.length === 0 && (
                <div className="card mb-3">
                    <div className="card-body text-center">
                        <h5 className="mb-1">Brak wyników</h5>
                        <p className="text-muted mb-3">Dostosuj filtry lub utwórz nowy projekt.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/projekty/nowy')} aria-label="Utwórz nowy projekt">
                            <i className="ri-add-line me-1"></i>Nowy projekt
                        </button>
                    </div>
                </div>
            )}

            {view === 'Lista' ? (
                <>
                    {/* Projects Table */}
                    <div className="card" data-component="ProjectsTableCard">
                        {(() => {
                            const columns: Column<Project>[] = [
                                {
                                    key: 'select', header: '', width: 40, render: (p) => (
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={selectedProjects.includes(p.id)}
                                            onChange={(e) => { e.stopPropagation(); handleSelectProject(p.id) }}
                                        />
                                    )
                                },
                                {
                                    key: 'name', header: 'Projekt', render: (p) => (
                                        <div>
                                            <div className="fw-medium">{p.name}</div>
                                            <div className="text-muted small">{p.id}</div>
                                        </div>
                                    )
                                },
                                { key: 'client', header: 'Klient' },
                                { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
                                {
                                    key: 'deadline', header: 'Deadline', render: (p) => {
                                        const isOverdue = new Date(p.deadline) < new Date() && p.status !== 'Done'
                                        return <div className={isOverdue ? 'text-danger fw-medium' : ''}>{p.deadline}{isOverdue && <i className="ri-alarm-warning-line ms-1"></i>}</div>
                                    }
                                },
                                {
                                    key: 'progress', header: 'Postęp', render: () => {
                                        const mock = Math.floor(Math.random() * 100)
                                        return (
                                            <div className="d-flex align-items-center">
                                                <div className="progress me-2" style={{ width: 60, height: 6 }}>
                                                    <div className="progress-bar bg-primary" style={{ width: `${mock}%` }}></div>
                                                </div>
                                                <small>{mock}%</small>
                                            </div>
                                        )
                                    }
                                },
                                {
                                    key: 'team', header: 'Zespół', render: () => (
                                        <div className="d-flex">
                                            {Array.from({ length: 3 }).map((_, i) => (
                                                <img key={i} src={`https://i.pravatar.cc/24?img=${i + 1}`} alt="Team member" className="rounded-circle me-1" width="24" height="24" style={{ marginLeft: i > 0 ? -8 : 0 }} />
                                            ))}
                                        </div>
                                    )
                                },
                            ]
                            return (
                                <EntityTable<Project>
                                    rows={paginatedProjects}
                                    columns={columns}
                                    rowKey={(p) => p.id}
                                    onRowClick={(p) => navigate(`/projekt/${p.id}`)}
                                />
                            )
                        })()}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-3" data-component="PaginationBar">
                            <div className="text-muted small">
                                Strona {currentPage} z {totalPages}
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
            ) : view === 'Kafelki' ? (
                <>
                    {/* Project Tiles */}
                    <div className="row g-3" data-component="ProjectTiles">
                        {paginatedProjects.map(project => {
                            const mockProgress = Math.floor(Math.random() * 100)
                            const isOverdue = new Date(project.deadline) < new Date() && project.status !== 'Done'
                            const mockBudget = Math.floor(Math.random() * 500000)

                            return (
                                <div key={project.id} className="col-12 col-md-6 col-lg-4">
                                    <div
                                        className="card h-100 shadow-sm border"
                                        data-component="ProjectTile"
                                        onClick={() => navigate(`/projekt/${project.id}`)}
                                        onContextMenu={(e) => openContextMenu(e, project.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input me-2"
                                                    checked={selectedProjects.includes(project.id)}
                                                    onChange={(e) => { e.stopPropagation(); handleSelectProject(project.id) }}
                                                    onClick={e => e.stopPropagation()}
                                                    onContextMenu={e => e.stopPropagation()}
                                                />
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: 32,
                                                            height: 32,
                                                            backgroundColor: project.status === 'Active' ? '#28a745' :
                                                                project.status === 'On Hold' ? '#ffc107' :
                                                                    project.status === 'Done' ? '#17a2b8' : '#6c757d'
                                                        }}
                                                    >
                                                        <i className={`ri-${project.status === 'Active' ? 'play' :
                                                            project.status === 'On Hold' ? 'pause' :
                                                                project.status === 'Done' ? 'check' : 'time'
                                                            }-fill text-white`}></i>
                                                    </div>
                                                    <span className="px-0 py-0"><StatusBadge status={project.status} /></span>
                                                </div>
                                            </div>
                                            <div className="dropdown" onClick={e => e.stopPropagation()} onContextMenu={e => e.stopPropagation()}>
                                                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                                    <i className="ri-more-line"></i>
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-end">
                                                    <li><a className="dropdown-item" href="#" onClick={() => navigate(`/projekt/${project.id}`)}>
                                                        <i className="ri-eye-line me-2"></i>Zobacz szczegóły
                                                    </a></li>
                                                    <li><a className="dropdown-item" href="#" onClick={() => setEditId(project.id)}>
                                                        <i className="ri-edit-line me-2"></i>Edytuj
                                                    </a></li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li><a className="dropdown-item text-danger" href="#" onClick={() => {
                                                        if (confirm(`Czy na pewno chcesz usunąć projekt "${project.name}"?`)) {
                                                            remove(project.id)
                                                            showToast('Projekt został usunięty', 'success')
                                                        }
                                                    }}>
                                                        <i className="ri-delete-bin-line me-2"></i>Usuń
                                                    </a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="card-body p-3" data-component="ProjectTileBody">
                                            <div className="mb-3">
                                                <h6 className="card-title mb-1 fw-bold">{project.name}</h6>
                                                <div className="text-muted small mb-2">{project.client}</div>
                                                <div className="text-muted small">{project.id}</div>
                                            </div>

                                            <div className="row g-2 mb-3 small">
                                                <div className="col-6">
                                                    <div className="text-muted">Postęp</div>
                                                    <div className="fw-medium text-primary">{mockProgress}%</div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="text-muted">Budżet</div>
                                                    <div className="fw-medium">${mockBudget.toLocaleString()}</div>
                                                </div>
                                            </div>

                                            <div className="progress mb-3" style={{ height: 8 }} data-component="TileProgress">
                                                <div
                                                    className={`progress-bar ${mockProgress >= 80 ? 'bg-success' :
                                                        mockProgress >= 50 ? 'bg-primary' :
                                                            mockProgress >= 25 ? 'bg-warning' : 'bg-danger'
                                                        }`}
                                                    style={{ width: `${mockProgress}%` }}
                                                ></div>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div>
                                                    <div className="text-muted small">Deadline</div>
                                                    <div className={`small fw-medium ${isOverdue ? 'text-danger' : ''}`}>
                                                        <i className={`ri-calendar-line me-1 ${isOverdue ? 'text-danger' : 'text-muted'}`}></i>
                                                        {project.deadline}
                                                        {isOverdue && <i className="ri-alarm-warning-line ms-1 text-danger"></i>}
                                                    </div>
                                                </div>
                                                <div className="d-flex">
                                                    {Array.from({ length: 4 }).map((_, i) => (
                                                        <img
                                                            key={i}
                                                            src={`https://i.pravatar.cc/28?img=${i + 1}`}
                                                            alt="Team member"
                                                            className="rounded-circle border border-2 border-white"
                                                            width="28"
                                                            height="28"
                                                            style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 4 - i }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

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
                <div className="row g-3" data-component="KanbanBoard">
                    {(['Active', 'On Hold', 'Done'] as const).map(colStatus => (
                        <div key={colStatus} className="col-12 col-md-4">
                            <div
                                className="card h-100"
                                data-component="KanbanColumn"
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => {
                                    const id = e.dataTransfer.getData('text/plain')
                                    if (id) {
                                        update(id, { status: colStatus })
                                        // propagate to tiles for this project id
                                        const related = tiles.filter(t => t.project === id)
                                        if (colStatus === 'Done') {
                                            related.forEach(t => setTileStatus(t.id, 'WYCIĘTE'))
                                        } else if (colStatus === 'Active') {
                                            related.forEach(t => {
                                                if (t.status !== 'WYCIĘTE') setTileStatus(t.id, 'W KOLEJCE')
                                            })
                                        }
                                        showToast(`Zmieniono status projektu ${id} → ${colStatus}`, 'success')
                                    }
                                }}
                            >
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <div className="fw-semibold">
                                        {colStatus}
                                        <span className="badge bg-secondary ms-2">
                                            {filtered.filter(p => p.status === colStatus).length}
                                        </span>
                                    </div>
                                </div>
                                <div className="card-body" style={{ minHeight: 300 }} data-component="KanbanColumnBody">
                                    {filtered.filter(p => p.status === colStatus).map(p => (
                                        <div
                                            key={p.id}
                                            className="card mb-2 border"
                                            data-component="KanbanCard"
                                            draggable
                                            onDragStart={e => {
                                                e.dataTransfer.setData('text/plain', p.id)
                                            }}
                                        >
                                            <div className="card-body py-2">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <div className="fw-medium">{p.name}</div>
                                                        <div className="text-muted small">{p.id} • {p.client}</div>
                                                    </div>
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/projekt/${p.id}`)} aria-label={`Otwórz projekt ${p.name}`}>
                                                        <i className="ri-eye-line"></i>
                                                    </button>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center mt-2">
                                                    <span className="badge bg-light text-dark">{p.deadline}</span>
                                                    <div className="dropdown">
                                                        <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">Status</button>
                                                        <ul className="dropdown-menu dropdown-menu-end">
                                                            {(['Active', 'On Hold', 'Done'] as const).map(s => (
                                                                <li key={s}>
                                                                    <a className="dropdown-item" href="#" onClick={() => update(p.id, { status: s })}>{s}</a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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
            <FormModal
                title="Nowy Projekt"
                isOpen={createOpen}
                initial={createForm}
                schema={createSchema}
                onCancel={() => setCreateOpen(false)}
                onSubmit={async (data) => {
                    await add(data)
                    showToast('Projekt utworzony', 'success')
                    setCreateOpen(false)
                    setCreateForm({
                        name: '', clientId: 'C-NEW', client: '', status: 'Active', deadline: new Date().toISOString().slice(0, 10), groups: [], modules: ['wycena', 'koncepcja']
                    })
                }}
            >
                {(form, setForm, errors) => (
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="form-label small">Nazwa</label>
                            <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={(form as any).name || ''} onChange={e => setForm({ name: e.currentTarget.value } as any)} />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                        <div className="col-6">
                            <label className="form-label small">Klient</label>
                            <input className={`form-control ${errors.client ? 'is-invalid' : ''}`} value={(form as any).client || ''} onChange={e => setForm({ client: e.currentTarget.value } as any)} />
                        </div>
                        <div className="col-6">
                            <label className="form-label small">clientId</label>
                            <input className={`form-control ${errors.clientId ? 'is-invalid' : ''}`} value={(form as any).clientId || ''} onChange={e => setForm({ clientId: e.currentTarget.value } as any)} />
                        </div>
                        <div className="col-6">
                            <label className="form-label small">Deadline</label>
                            <input type="date" className="form-control" value={(form as any).deadline?.slice(0, 10) || ''} onChange={e => setForm({ deadline: e.currentTarget.value } as any)} />
                        </div>
                        <div className="col-6">
                            <label className="form-label small">Status</label>
                            <select className="form-select" value={(form as any).status} onChange={e => setForm({ status: e.currentTarget.value } as any)}>
                                <option value="Active">Active</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                    </div>
                )}
            </FormModal>
        </div>
    )
}
