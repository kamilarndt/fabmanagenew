import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectsStore } from '../stores/projectsStore'
import { useTilesStore } from '../stores/tilesStore'
import CreateProjectModal from '../components/CreateProjectModal'
import { showToast } from '../lib/toast'
import EditProjectModal from '../components/EditProjectModal'

export default function Projects() {
    const navigate = useNavigate()
    const { projects, update, remove } = useProjectsStore()
    const { tiles, setStatus: setTileStatus } = useTilesStore()

    // Basic filters
    const [status, setStatus] = useState<'All' | 'Active' | 'On Hold' | 'Done'>('All')
    const [client, setClient] = useState<'All' | string>('All')
    const [query, setQuery] = useState('')
    const [view, setView] = useState<'Lista' | 'Kanban' | 'Gantt' | 'Kalendarz'>('Lista')

    // Advanced filters
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
    const [managerFilter, setManagerFilter] = useState<'All' | string>('All')
    const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All')
    const [dateFilter, setDateFilter] = useState<'All' | 'This Week' | 'This Month' | 'Overdue'>('All')
    const [budgetRange, setBudgetRange] = useState([0, 500000])
    const [selectedProjects, setSelectedProjects] = useState<string[]>([])
    const [editId, setEditId] = useState<string | null>(null)

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
                    case 'This Week':
                        byDate = deadline <= oneWeek
                        break
                    case 'This Month':
                        byDate = deadline <= oneMonth
                        break
                    case 'Overdue':
                        byDate = deadline < today && p.status !== 'Done'
                        break
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
            let aVal: any, bVal: any

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

            if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
            if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
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
    const handleSort = (column: 'name' | 'client' | 'deadline' | 'status') => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(column)
            setSortOrder('asc')
        }
    }

    const handleSelectAll = () => {
        if (selectedProjects.length === paginatedProjects.length) {
            setSelectedProjects([])
        } else {
            setSelectedProjects(paginatedProjects.map(p => p.id))
        }
    }

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
            case 'export':
                const selectedData = paginatedProjects.filter(p => selectedProjects.includes(p.id))
                const csv = ['id,name,client,status,deadline', ...selectedData.map(r => `${r.id},"${r.name}",${r.client},${r.status},${r.deadline}`)].join('\n')
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a'); a.href = url; a.download = 'selected_projects.csv'; a.click(); URL.revokeObjectURL(url)
                showToast(`Wyeksportowano ${selectedProjects.length} projektów`, 'success')
                break
            case 'archive':
                selectedProjects.forEach(id => update(id, { status: 'Done' }))
                setSelectedProjects([])
                showToast(`Zarchiwizowano ${selectedProjects.length} projektów`, 'success')
                break
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

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-success'
            case 'On Hold': return 'bg-warning'
            case 'Done': return 'bg-info'
            default: return 'bg-secondary'
        }
    }

    return (
        <div>
            {/* Header with Search and Actions */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="mb-1">Projekty</h4>
                    <p className="text-muted mb-0">Zarządzaj wszystkimi projektami w firmie</p>
                </div>
                <div className="d-flex gap-2">
                    {selectedProjects.length > 0 && (
                        <div className="btn-group">
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleBulkAction('delete')}
                            >
                                <i className="ri-delete-bin-line me-1"></i>Usuń ({selectedProjects.length})
                            </button>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleBulkAction('export')}
                            >
                                <i className="ri-download-line me-1"></i>Export
                            </button>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleBulkAction('archive')}
                            >
                                <i className="ri-archive-line me-1"></i>Archiwizuj
                            </button>
                        </div>
                    )}
                    <CreateProjectModal />
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-3">
                <div className="card-body">
                    {/* Basic Filters Row */}
                    <div className="row g-3 mb-3">
                        <div className="col-12 col-md-3">
                            <label className="form-label small">Status projektu</label>
                            <select value={status} onChange={e => setStatus(e.currentTarget.value as any)} className="form-select form-select-sm">
                                <option value="All">Wszystkie ({projects.length})</option>
                                <option value="Active">Active ({projects.filter(p => p.status === 'Active').length})</option>
                                <option value="On Hold">On Hold ({projects.filter(p => p.status === 'On Hold').length})</option>
                                <option value="Done">Done ({projects.filter(p => p.status === 'Done').length})</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-3">
                            <label className="form-label small">Klient</label>
                            <select value={client} onChange={e => setClient(e.currentTarget.value as any)} className="form-select form-select-sm">
                                <option value="All">Wszyscy klienci</option>
                                {uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col-12 col-md-4">
                            <label className="form-label small">Wyszukiwanie</label>
                            <div className="input-group input-group-sm">
                                <span className="input-group-text bg-transparent"><i className="ri-search-line"></i></span>
                                <input
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
                                {(['Lista', 'Kanban'] as const).map(v => (
                                    <button
                                        key={v}
                                        className={`btn btn-outline-secondary btn-sm ${view === v ? 'active' : ''}`}
                                        onClick={() => setView(v)}
                                    >
                                        <i className={`ri-${v === 'Lista' ? 'list-check' : 'layout-grid'}-line`}></i>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Advanced Filters Toggle */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        >
                            <i className={`ri-${showAdvancedFilters ? 'subtract' : 'add'}-line me-1`}></i>
                            Filtry zaawansowane
                        </button>
                        <div className="d-flex gap-2">
                            {(status !== 'All' || client !== 'All' || query || managerFilter !== 'All' || priorityFilter !== 'All' || dateFilter !== 'All') && (
                                <button className="btn btn-sm btn-outline-warning" onClick={clearAllFilters}>
                                    <i className="ri-refresh-line me-1"></i>Wyczyść filtry
                                </button>
                            )}
                            <button className="btn btn-sm btn-outline-info" onClick={() => {
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
                        <div className="border-top pt-3">
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
                                    <select value={priorityFilter} onChange={e => setPriorityFilter(e.currentTarget.value as any)} className="form-select form-select-sm">
                                        <option value="All">Wszystkie</option>
                                        <option value="High">Wysoki</option>
                                        <option value="Medium">Średni</option>
                                        <option value="Low">Niski</option>
                                    </select>
                                </div>
                                <div className="col-12 col-md-3">
                                    <label className="form-label small">Termin</label>
                                    <select value={dateFilter} onChange={e => setDateFilter(e.currentTarget.value as any)} className="form-select form-select-sm">
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
            <div className="row g-3 mb-3">
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
                        onChange={e => setSortBy(e.target.value as any)}
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
                    >
                        <i className={`ri-sort-${sortOrder === 'asc' ? 'asc' : 'desc'}-line`}></i>
                    </button>
                </div>
            </div>

            {view === 'Lista' ? (
                <>
                    {/* Projects Table */}
                    <div className="card">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: 40 }}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectedProjects.length === paginatedProjects.length && paginatedProjects.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th className="sortable" onClick={() => handleSort('name')}>
                                            Projekt
                                            {sortBy === 'name' && <i className={`ri-sort-${sortOrder === 'asc' ? 'asc' : 'desc'}-line ms-1`}></i>}
                                        </th>
                                        <th className="sortable" onClick={() => handleSort('client')}>
                                            Klient
                                            {sortBy === 'client' && <i className={`ri-sort-${sortOrder === 'asc' ? 'asc' : 'desc'}-line ms-1`}></i>}
                                        </th>
                                        <th className="sortable" onClick={() => handleSort('status')}>
                                            Status
                                            {sortBy === 'status' && <i className={`ri-sort-${sortOrder === 'asc' ? 'asc' : 'desc'}-line ms-1`}></i>}
                                        </th>
                                        <th className="sortable" onClick={() => handleSort('deadline')}>
                                            Deadline
                                            {sortBy === 'deadline' && <i className={`ri-sort-${sortOrder === 'asc' ? 'asc' : 'desc'}-line ms-1`}></i>}
                                        </th>
                                        <th>Postęp</th>
                                        <th>Zespół</th>
                                        <th style={{ width: 120 }}>Akcje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedProjects.map(project => {
                                        const isOverdue = new Date(project.deadline) < new Date() && project.status !== 'Done'
                                        const mockProgress = Math.floor(Math.random() * 100)

                                        return (
                                            <tr key={project.id} className={selectedProjects.includes(project.id) ? 'table-primary' : ''}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={selectedProjects.includes(project.id)}
                                                        onChange={() => handleSelectProject(project.id)}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="fw-medium">{project.name}</div>
                                                    <div className="text-muted small">{project.id}</div>
                                                </td>
                                                <td>{project.client}</td>
                                                <td>
                                                    <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                                                        {project.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className={isOverdue ? 'text-danger fw-medium' : ''}>
                                                        {project.deadline}
                                                        {isOverdue && <i className="ri-alarm-warning-line ms-1"></i>}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="progress me-2" style={{ width: 60, height: 6 }}>
                                                            <div className="progress-bar bg-primary" style={{ width: `${mockProgress}%` }}></div>
                                                        </div>
                                                        <small>{mockProgress}%</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        {Array.from({ length: 3 }).map((_, i) => (
                                                            <img
                                                                key={i}
                                                                src={`https://i.pravatar.cc/24?img=${i + 1}`}
                                                                alt="Team member"
                                                                className="rounded-circle me-1"
                                                                width="24"
                                                                height="24"
                                                                style={{ marginLeft: i > 0 ? -8 : 0 }}
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            onClick={() => navigate(`/projekt/${project.id}`)}
                                                            title="Zobacz szczegóły"
                                                        >
                                                            <i className="ri-eye-line"></i>
                                                        </button>
                                                        <button className="btn btn-outline-secondary" title="Edytuj" onClick={() => setEditId(project.id)}>
                                                            <i className="ri-edit-line"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => {
                                                                if (confirm(`Czy na pewno chcesz usunąć projekt \"${project.name}\"?`)) {
                                                                    remove(project.id)
                                                                    showToast('Projekt został usunięty', 'success')
                                                                }
                                                            }}
                                                            title="Usuń"
                                                        >
                                                            <i className="ri-delete-bin-line"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
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
            ) : (
                /* Kanban View */
                <div className="row g-3">
                    {(['Active', 'On Hold', 'Done'] as const).map(colStatus => (
                        <div key={colStatus} className="col-12 col-md-4">
                            <div
                                className="card h-100"
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
                                <div className="card-body" style={{ minHeight: 300 }}>
                                    {filtered.filter(p => p.status === colStatus).map(p => (
                                        <div
                                            key={p.id}
                                            className="card mb-2 border"
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
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/projekt/${p.id}`)}>
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
            {/* Edit Modal */}
            <EditProjectModal open={!!editId} projectId={editId} onClose={() => setEditId(null)} />
        </div>
    )
}
