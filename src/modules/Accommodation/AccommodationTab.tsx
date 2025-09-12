import { useState } from 'react'

interface AccommodationItem {
    id: string
    type: 'hotel' | 'apartment' | 'camping' | 'other'
    name: string
    location: string
    checkIn: string
    checkOut: string
    guests: string[]
    cost: number
    status: 'booked' | 'confirmed' | 'cancelled' | 'pending'
    notes?: string
}

interface AccommodationTabProps {
    projectId: string
}

export default function AccommodationTab({ projectId }: AccommodationTabProps) {
    const [accommodationItems, setAccommodationItems] = useState<AccommodationItem[]>([
        {
            id: 'acc-1',
            type: 'hotel',
            name: 'Hotel Business Center',
            location: 'Warszawa, ul. Marszałkowska 123',
            checkIn: '2025-01-25',
            checkOut: '2025-01-27',
            guests: ['Marek Wójcik', 'Tomasz Kowal'],
            cost: 1200.00,
            status: 'confirmed',
            notes: 'Pokój dwuosobowy, śniadanie wliczone'
        },
        {
            id: 'acc-2',
            type: 'apartment',
            name: 'Apartamenty Centrum',
            location: 'Kraków, Rynek Główny 15',
            checkIn: '2025-02-01',
            checkOut: '2025-02-03',
            guests: ['Anna Kowalska'],
            cost: 800.00,
            status: 'booked',
            notes: 'Apartament jednopokojowy z kuchnią'
        }
    ])

    const [newItem, setNewItem] = useState({
        type: 'hotel' as AccommodationItem['type'],
        name: '',
        location: '',
        checkIn: '',
        checkOut: '',
        guests: [] as string[],
        cost: 0,
        notes: ''
    })

    const [newGuest, setNewGuest] = useState('')

    const handleAddItem = () => {
        if (!newItem.name.trim() || !newItem.location.trim() || !newItem.checkIn || !newItem.checkOut || newItem.guests.length === 0) return

        const item: AccommodationItem = {
            id: crypto.randomUUID(),
            type: newItem.type,
            name: newItem.name.trim(),
            location: newItem.location.trim(),
            checkIn: newItem.checkIn,
            checkOut: newItem.checkOut,
            guests: [...newItem.guests],
            cost: newItem.cost,
            status: 'pending',
            notes: newItem.notes || undefined
        }

        setAccommodationItems(prev => [...prev, item])
        setNewItem({
            type: 'hotel',
            name: '',
            location: '',
            checkIn: '',
            checkOut: '',
            guests: [],
            cost: 0,
            notes: ''
        })
    }

    const handleAddGuest = () => {
        if (!newGuest.trim() || newItem.guests.includes(newGuest.trim())) return
        setNewItem(prev => ({ ...prev, guests: [...prev.guests, newGuest.trim()] }))
        setNewGuest('')
    }

    const handleRemoveGuest = (guest: string) => {
        setNewItem(prev => ({ ...prev, guests: prev.guests.filter(g => g !== guest) }))
    }

    const handleStatusChange = (id: string, newStatus: AccommodationItem['status']) => {
        setAccommodationItems(prev => prev.map(item =>
            item.id === id ? { ...item, status: newStatus } : item
        ))
    }

    const getTypeLabel = (type: AccommodationItem['type']) => {
        switch (type) {
            case 'hotel': return 'Hotel'
            case 'apartment': return 'Apartament'
            case 'camping': return 'Kemping'
            case 'other': return 'Inne'
            default: return type
        }
    }

    const getTypeBadgeClass = (type: AccommodationItem['type']) => {
        switch (type) {
            case 'hotel': return 'bg-primary'
            case 'apartment': return 'bg-success'
            case 'camping': return 'bg-warning'
            case 'other': return 'bg-secondary'
            default: return 'bg-secondary'
        }
    }

    const getStatusBadgeClass = (status: AccommodationItem['status']) => {
        switch (status) {
            case 'pending': return 'bg-secondary'
            case 'booked': return 'bg-info'
            case 'confirmed': return 'bg-success'
            case 'cancelled': return 'bg-danger'
            default: return 'bg-secondary'
        }
    }

    const getStatusLabel = (status: AccommodationItem['status']) => {
        switch (status) {
            case 'pending': return 'Oczekujące'
            case 'booked': return 'Zarezerwowane'
            case 'confirmed': return 'Potwierdzone'
            case 'cancelled': return 'Anulowane'
            default: return 'Nieznany'
        }
    }

    const totalCost = accommodationItems.reduce((sum, item) => sum + item.cost, 0)

    return (
        <div data-project-id={projectId}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Zakwaterowanie</h5>
                <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addAccommodationItemModal">
                    <i className="ri-add-line me-1"></i>Dodaj zakwaterowanie
                </button>
            </div>

            {/* Summary Card */}
            <div className="card border-0 bg-dark text-white mb-4">
                <div className="card-body text-center">
                    <h6 className="mb-1">Koszt całkowity zakwaterowania</h6>
                    <h3 className="mb-0">{totalCost.toLocaleString('pl-PL')} PLN</h3>
                </div>
            </div>

            {/* Accommodation Items */}
            <div className="row g-3">
                {accommodationItems.map(item => (
                    <div key={item.id} className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div className="d-flex gap-1">
                                    <span className={`badge ${getTypeBadgeClass(item.type)}`}>
                                        {getTypeLabel(item.type)}
                                    </span>
                                    <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                                        {getStatusLabel(item.status)}
                                    </span>
                                </div>
                            </div>
                            <div className="card-body">
                                <h6 className="mb-2">{item.name}</h6>
                                <p className="text-muted small mb-2">
                                    <i className="ri-map-pin-line me-1"></i>
                                    {item.location}
                                </p>

                                <div className="row g-2 mb-2">
                                    <div className="col-6">
                                        <small className="text-muted d-block">Check-in</small>
                                        <strong>{item.checkIn}</strong>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted d-block">Check-out</small>
                                        <strong>{item.checkOut}</strong>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <small className="text-muted d-block">Goście</small>
                                    <div className="d-flex flex-wrap gap-1">
                                        {item.guests.map((guest, idx) => (
                                            <span key={idx} className="badge bg-light text-dark border small">
                                                {guest}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <small className="text-muted d-block">Koszt</small>
                                    <strong>{item.cost.toLocaleString('pl-PL')} PLN</strong>
                                </div>

                                {item.notes && (
                                    <div className="mb-2">
                                        <small className="text-muted d-block">Uwagi</small>
                                        <small>{item.notes}</small>
                                    </div>
                                )}

                                <div className="d-flex gap-1 mt-2">
                                    <select
                                        className="form-select form-select-sm"
                                        value={item.status}
                                        onChange={(e) => handleStatusChange(item.id, e.target.value as AccommodationItem['status'])}
                                    >
                                        <option value="pending">Oczekujące</option>
                                        <option value="booked">Zarezerwowane</option>
                                        <option value="confirmed">Potwierdzone</option>
                                        <option value="cancelled">Anulowane</option>
                                    </select>
                                    <button className="btn btn-sm btn-outline-primary">
                                        <i className="ri-edit-line"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Item Modal */}
            <div className="modal fade" id="addAccommodationItemModal" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Nowe zakwaterowanie</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label">Typ zakwaterowania *</label>
                                    <select
                                        className="form-select"
                                        value={newItem.type}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as AccommodationItem['type'] }))}
                                    >
                                        <option value="hotel">Hotel</option>
                                        <option value="apartment">Apartament</option>
                                        <option value="camping">Kemping</option>
                                        <option value="other">Inne</option>
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Nazwa obiektu *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newItem.name}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Nazwa hotelu/apartamentu"
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Lokalizacja *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newItem.location}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                                        placeholder="Adres lub lokalizacja"
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="form-label">Check-in *</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={newItem.checkIn}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, checkIn: e.target.value }))}
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="form-label">Check-out *</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={newItem.checkOut}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, checkOut: e.target.value }))}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Goście *</label>
                                    <div className="input-group mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newGuest}
                                            onChange={(e) => setNewGuest(e.target.value)}
                                            placeholder="Imię i nazwisko gościa"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={handleAddGuest}
                                            disabled={!newGuest.trim()}
                                        >
                                            <i className="ri-add-line"></i>
                                        </button>
                                    </div>
                                    <div className="d-flex flex-wrap gap-1">
                                        {newItem.guests.map((guest, idx) => (
                                            <span key={idx} className="badge bg-light text-dark border">
                                                {guest}
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link p-0 ms-1"
                                                    onClick={() => handleRemoveGuest(guest)}
                                                >
                                                    <i className="ri-close-line"></i>
                                                </button>
                                            </span>
                                        ))}
                                        {newItem.guests.length === 0 && (
                                            <span className="text-muted small">Brak gości</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <label className="form-label">Koszt (PLN)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={newItem.cost}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Uwagi</label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        value={newItem.notes}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                                        placeholder="Dodatkowe informacje"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Anuluj
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleAddItem}
                                disabled={!newItem.name.trim() || !newItem.location.trim() || !newItem.checkIn || !newItem.checkOut || newItem.guests.length === 0}
                            >
                                Dodaj zakwaterowanie
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
