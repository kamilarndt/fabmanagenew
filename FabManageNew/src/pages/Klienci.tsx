import { useClientsStore } from '../stores/clientsStore'
import { useProjectsStore } from '../stores/projectsStore'
import { generateLogoFromName, getStatusColor, getSegmentColor, formatPhoneNumber } from '../lib/clientUtils'
import type { CompanyClient } from '../types/clients.types'

export default function Klienci() {
    const {
        selectedClient,
        filters,
        selectClient,
        setFilters,
        clearFilters,
        getFilteredClients,
        getClientStats,
        generateClientLogo
    } = useClientsStore()

    const { getProjectsByClient } = useProjectsStore()

    const filteredClients = getFilteredClients()
    const stats = getClientStats()

    // Pobierz projekty dla wybranego klienta
    const clientProjects = selectedClient ? getProjectsByClient(selectedClient.id) : []

    // Funkcja pomocnicza do generowania logo
    const renderClientLogo = (client: CompanyClient) => {
        if (client.logoUrl) {
            return (
                <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: 'white',
                        padding: '4px'
                    }}
                >
                    <img
                        src={client.logoUrl}
                        alt={`${client.companyName} logo`}
                        className="w-100 h-100 object-contain rounded-circle"
                    />
                </div>
            )
        }

        // Generuj logo z inicjałów
        const logo = generateLogoFromName(client.companyName)
        return (
            <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: logo.backgroundColor,
                    fontSize: '18px'
                }}
            >
                {logo.initials}
            </div>
        )
    }

    return (
        <div className="row g-3">
            {/* KPI Cards */}
            <div className="col-12">
                <div className="row g-3">
                    <div className="col-6 col-md-3">
                        <div className="card bg-primary text-white">
                            <div className="card-body text-center">
                                <h4 className="mb-1">{stats.total}</h4>
                                <small>Wszyscy klienci</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card bg-success text-white">
                            <div className="card-body text-center">
                                <h4 className="mb-1">{stats.active}</h4>
                                <small>Aktywni</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card bg-warning text-white">
                            <div className="card-body text-center">
                                <h4 className="mb-1">{stats.leads}</h4>
                                <small>Leady</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card bg-info text-white">
                            <div className="card-body text-center">
                                <h4 className="mb-1">{stats.totalRevenue.toLocaleString('pl-PL')} PLN</h4>
                                <small>YTD</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12 col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Szukaj klientów..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ search: e.target.value })}
                                />
                            </div>
                            <div className="col-6 col-md-2">
                                <select
                                    className="form-select"
                                    value={filters.segment}
                                    onChange={(e) => setFilters({ segment: e.target.value })}
                                >
                                    <option value="">Wszystkie segmenty</option>
                                    <option value="Mały">Mały</option>
                                    <option value="Średni">Średni</option>
                                    <option value="Duży">Duży</option>
                                </select>
                            </div>
                            <div className="col-6 col-md-2">
                                <select
                                    className="form-select"
                                    value={filters.region}
                                    onChange={(e) => setFilters({ region: e.target.value })}
                                >
                                    <option value="">Wszystkie regiony</option>
                                    <option value="Warszawa">Warszawa</option>
                                    <option value="Kraków">Kraków</option>
                                    <option value="Poznań">Poznań</option>
                                    <option value="Gdańsk">Gdańsk</option>
                                </select>
                            </div>
                            <div className="col-6 col-md-2">
                                <select
                                    className="form-select"
                                    value={filters.status}
                                    onChange={(e) => setFilters({ status: e.target.value })}
                                >
                                    <option value="">Wszystkie statusy</option>
                                    <option value="Aktywny">Aktywny</option>
                                    <option value="Nieaktywny">Nieaktywny</option>
                                    <option value="Lead">Lead</option>
                                </select>
                            </div>
                            <div className="col-6 col-md-2">
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-outline-secondary flex-grow-1"
                                        onClick={clearFilters}
                                    >
                                        Wyczyść
                                    </button>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => {
                                            if (confirm('Czy na pewno chcesz zresetować dane do stacji TV? To usunie wszystkie obecne dane.')) {
                                                useClientsStore.getState().resetToTVStations()
                                            }
                                        }}
                                        title="Resetuj do stacji TV"
                                    >
                                        <i className="ri-tv-line me-1"></i>TV
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="col-12 col-lg-7">
                <div className="row g-2">
                    {filteredClients.map(client => (
                        <div className="col-12 col-md-6" key={client.id}>
                            <div
                                className="card h-100"
                                role="button"
                                onClick={() => selectClient(client)}
                                style={{
                                    backgroundColor: client.cardColor,
                                    borderRadius: '16px',
                                    border: 'none',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)'
                                    e.currentTarget.style.boxShadow = `0 12px 30px ${client.cardColor}40`
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                <div className="card-body p-0 d-flex align-items-center h-100">
                                    {/* Left Section - Logo */}
                                    <div className="d-flex align-items-center justify-content-center p-3" style={{ minWidth: '80px' }}>
                                        {renderClientLogo(client)}
                                    </div>

                                    {/* Right Section - White Text Area */}
                                    <div
                                        className="flex-grow-1 h-100 d-flex flex-column justify-content-center p-3"
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '12px',
                                            margin: '8px',
                                            marginLeft: '0',
                                            flex: 1
                                        }}
                                    >
                                        {/* Company Name */}
                                        <h6
                                            className="mb-1 fw-bold"
                                            style={{
                                                color: '#1f2937',
                                                fontSize: '1.1rem',
                                                lineHeight: '1.2'
                                            }}
                                        >
                                            {client.companyName}
                                        </h6>

                                        {/* Contact Info */}
                                        <div
                                            className="text-muted"
                                            style={{
                                                fontSize: '0.9rem',
                                                color: '#6b7280'
                                            }}
                                        >
                                            {client.contacts.find(p => p.isPrimary)?.name || 'Brak kontaktu'}
                                            {client.contacts.length > 1 && ` +${client.contacts.length - 1} więcej`}
                                        </div>

                                        {/* Additional Info */}
                                        <div
                                            className="mt-2 d-flex align-items-center gap-2"
                                            style={{ fontSize: '0.8rem' }}
                                        >
                                            <span
                                                className="badge"
                                                style={{
                                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                    color: '#1d4ed8',
                                                    fontSize: '0.75rem',
                                                    padding: '4px 8px'
                                                }}
                                            >
                                                {client.segment}
                                            </span>
                                            <span
                                                className="badge"
                                                style={{
                                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                                    color: '#047857',
                                                    fontSize: '0.75rem',
                                                    padding: '4px 8px'
                                                }}
                                            >
                                                {client.region}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Client Details Panel */}
            <div className="col-12 col-lg-5">
                {selectedClient ? (
                    <div className="card h-100">
                        <div className="card-header">
                            <div className="d-flex align-items-center">
                                <div className="me-3">
                                    {renderClientLogo(selectedClient)}
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="mb-1">{selectedClient.companyName}</h5>
                                    <div className="small text-muted">
                                        ID: {selectedClient.id}
                                    </div>
                                </div>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => generateClientLogo(selectedClient.id)}
                                >
                                    <i className="ri-refresh-line"></i>
                                </button>
                            </div>
                        </div>

                        <div className="card-body">
                            {/* Status and Segment */}
                            <div className="row g-2 mb-3">
                                <div className="col-6">
                                    <span
                                        className="badge w-100"
                                        style={{
                                            backgroundColor: getStatusColor(selectedClient.status),
                                            color: 'white'
                                        }}
                                    >
                                        {selectedClient.status}
                                    </span>
                                </div>
                                <div className="col-6">
                                    <span
                                        className="badge w-100"
                                        style={{
                                            backgroundColor: getSegmentColor(selectedClient.segment),
                                            color: 'white'
                                        }}
                                    >
                                        {selectedClient.segment}
                                    </span>
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="mb-3">
                                <h6>Informacje o firmie</h6>
                                <div className="small">
                                    <div><strong>NIP:</strong> {selectedClient.nip || 'Brak'}</div>
                                    <div><strong>Adres:</strong> {selectedClient.address || 'Brak'}</div>
                                    <div><strong>Strona:</strong> {selectedClient.website || 'Brak'}</div>
                                    <div><strong>Branża:</strong> {selectedClient.industry || 'Brak'}</div>
                                    <div><strong>Region:</strong> {selectedClient.region}</div>
                                    <div><strong>YTD:</strong> {selectedClient.ytd.toLocaleString('pl-PL')} PLN</div>
                                </div>
                            </div>

                            <hr />

                            {/* Contacts */}
                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0">Osoby kontaktowe</h6>
                                    <button className="btn btn-sm btn-outline-primary">
                                        <i className="ri-user-add-line me-1"></i>Dodaj
                                    </button>
                                </div>

                                <div className="list-group list-group-flush">
                                    {selectedClient.contacts.map(contact => (
                                        <div key={contact.id} className="list-group-item d-flex justify-content-between align-items-center p-2">
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="rounded-circle me-2 d-flex align-items-center justify-content-center text-white fw-bold"
                                                        style={{
                                                            width: 32,
                                                            height: 32,
                                                            backgroundColor: selectedClient.cardColor,
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="fw-semibold">
                                                            {contact.name}
                                                            {contact.isPrimary && (
                                                                <span className="badge bg-success ms-2">Główny</span>
                                                            )}
                                                        </div>
                                                        <div className="small text-muted">
                                                            {contact.role || 'Kontakt'} • {contact.email}
                                                        </div>
                                                        <div className="small text-muted">
                                                            {formatPhoneNumber(contact.phone)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="btn-group btn-group-sm">
                                                <button className="btn btn-outline-secondary">
                                                    <i className="ri-edit-line"></i>
                                                </button>
                                                <button className="btn btn-outline-danger">
                                                    <i className="ri-delete-bin-line"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr />

                            {/* Notes */}
                            {selectedClient.notes && (
                                <div className="mb-3">
                                    <h6>Notatki</h6>
                                    <div className="small text-muted">
                                        {selectedClient.notes}
                                    </div>
                                </div>
                            )}

                            <hr />

                            {/* History Section */}
                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0">Historia</h6>
                                    <div className="btn-group btn-group-sm">
                                        <button className="btn btn-outline-secondary active">Aktywności</button>
                                        <button className="btn btn-outline-secondary">Aktualizacje</button>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="position-relative">
                                    {/* Vertical line */}
                                    <div
                                        className="position-absolute"
                                        style={{
                                            left: '20px',
                                            top: '0',
                                            bottom: '0',
                                            width: '2px',
                                            background: 'repeating-linear-gradient(to bottom, #e5e7eb 0px, #e5e7eb 8px, transparent 8px, transparent 16px)'
                                        }}
                                    ></div>

                                    {/* Activity items */}
                                    <div className="timeline-activities">
                                        {/* Activity 1 */}
                                        <div className="d-flex align-items-start mb-3">
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: selectedClient.cardColor,
                                                    fontSize: '14px',
                                                    zIndex: 1,
                                                    position: 'relative'
                                                }}
                                            >
                                                AK
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold">Anna Kowalska</div>
                                                <div className="text-muted small">
                                                    Zaktualizował status projektu "{selectedClient.companyName}" na "W trakcie realizacji"
                                                </div>
                                                <div className="text-muted small">
                                                    Pt, 9 Sty 2025 • 08:30
                                                </div>
                                            </div>
                                        </div>

                                        {/* Activity 2 */}
                                        <div className="d-flex align-items-start mb-3">
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: '#10b981',
                                                    fontSize: '14px',
                                                    zIndex: 1,
                                                    position: 'relative'
                                                }}
                                            >
                                                PN
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold">Piotr Nowak</div>
                                                <div className="text-muted small">
                                                    Dodał zadanie "Przygotowanie dokumentacji technicznej"
                                                </div>
                                                <div className="text-muted small">
                                                    Pon, 12 Sty 2025 • 09:15
                                                </div>
                                            </div>
                                        </div>

                                        {/* Activity 3 */}
                                        <div className="d-flex align-items-start mb-3">
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: selectedClient.cardColor,
                                                    fontSize: '14px',
                                                    zIndex: 1,
                                                    position: 'relative'
                                                }}
                                            >
                                                AK
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold">Anna Kowalska</div>
                                                <div className="text-muted small">
                                                    Przydzielił nowe zadania dla projektu "{selectedClient.companyName}"
                                                </div>
                                                <div className="text-muted small">
                                                    Wt, 13 Sty 2025 • 13:05
                                                </div>
                                            </div>
                                        </div>

                                        {/* Activity 4 */}
                                        <div className="d-flex align-items-start mb-3">
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: '#10b981',
                                                    fontSize: '14px',
                                                    zIndex: 1,
                                                    position: 'relative'
                                                }}
                                            >
                                                PN
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold">Piotr Nowak</div>
                                                <div className="text-muted small">
                                                    Zamknął zadanie "Projektowanie układu studia"
                                                </div>
                                                <div className="text-muted small">
                                                    Śr, 14 Sty 2025 • 11:20
                                                </div>
                                            </div>
                                        </div>

                                        {/* Activity 5 */}
                                        <div className="d-flex align-items-start mb-3">
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: '#8b5cf6',
                                                    fontSize: '14px',
                                                    zIndex: 1,
                                                    position: 'relative'
                                                }}
                                            >
                                                ML
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold">Maria Lis</div>
                                                <div className="text-muted small">
                                                    Edytował harmonogram projektu "{selectedClient.companyName}"
                                                </div>
                                                <div className="text-muted small">
                                                    Czw, 15 Sty 2025 • 10:45
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr />

                            {/* Projects */}
                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0">Projekty ({clientProjects.length})</h6>
                                    <button className="btn btn-sm btn-outline-primary">
                                        <i className="ri-add-line me-1"></i>Nowy projekt
                                    </button>
                                </div>

                                {clientProjects.length > 0 ? (
                                    <div className="list-group list-group-flush">
                                        {clientProjects.map(project => (
                                            <div key={project.id} className="list-group-item p-2">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="flex-grow-1">
                                                        <div className="fw-semibold">{project.name}</div>
                                                        <div className="small text-muted">
                                                            Status: <span className={`badge ${project.status === 'Active' ? 'bg-success' : project.status === 'On Hold' ? 'bg-warning' : 'bg-secondary'}`}>
                                                                {project.status === 'Active' ? 'Aktywny' : project.status === 'On Hold' ? 'Wstrzymany' : 'Zakończony'}
                                                            </span>
                                                        </div>
                                                        <div className="small text-muted">
                                                            Deadline: {new Date(project.deadline).toLocaleDateString('pl-PL')}
                                                        </div>
                                                        {project.budget && (
                                                            <div className="small text-muted">
                                                                Budżet: {project.budget.toLocaleString('pl-PL')} PLN
                                                            </div>
                                                        )}
                                                        {project.progress !== undefined && (
                                                            <div className="mt-2">
                                                                <div className="progress" style={{ height: '6px' }}>
                                                                    <div
                                                                        className="progress-bar"
                                                                        style={{
                                                                            width: `${project.progress}%`,
                                                                            backgroundColor: selectedClient.cardColor
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                                <small className="text-muted">{project.progress}%</small>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="btn-group btn-group-sm">
                                                        <button className="btn btn-outline-secondary btn-sm">
                                                            <i className="ri-eye-line"></i>
                                                        </button>
                                                        <button className="btn btn-outline-primary btn-sm">
                                                            <i className="ri-edit-line"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted py-3">
                                        <i className="ri-folder-line" style={{ fontSize: '2rem' }}></i>
                                        <p className="mt-2 mb-0">Brak projektów dla tego klienta</p>
                                    </div>
                                )}
                            </div>

                            {/* Dates */}
                            <div className="small text-muted">
                                <div>Utworzono: {selectedClient.createdAt}</div>
                                <div>Zaktualizowano: {selectedClient.updatedAt}</div>
                            </div>
                        </div>

                        <div className="card-footer">
                            <div className="btn-group w-100">
                                <button className="btn btn-outline-primary">
                                    <i className="ri-edit-line me-1"></i>Edytuj
                                </button>
                                <button className="btn btn-outline-secondary">
                                    <i className="ri-file-list-line me-1"></i>Projekty
                                </button>
                                <button className="btn btn-outline-danger">
                                    <i className="ri-delete-bin-line me-1"></i>Usuń
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card h-100">
                        <div className="card-body d-flex align-items-center justify-content-center">
                            <div className="text-center text-muted">
                                <i className="ri-building-line" style={{ fontSize: '3rem' }}></i>
                                <p className="mt-3">Wybierz klienta, aby zobaczyć szczegóły</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


