import { useState } from 'react'

interface LogisticsItem {
  id: string
  type: 'transport' | 'assembly' | 'packaging' | 'delivery'
  name: string
  description: string
  status: 'planned' | 'in_progress' | 'completed' | 'delayed'
  startDate: string
  endDate: string
  assignedTo: string
  cost: number
  notes?: string
}

interface LogisticsTabProps {
  projectId: string
}

export default function LogisticsTab({ projectId }: LogisticsTabProps) {
  const [logisticsItems, setLogisticsItems] = useState<LogisticsItem[]>([
    {
      id: 'log-1',
      type: 'transport',
      name: 'Transport materiałów z magazynu',
      description: 'Przewóz płyt MDF i komponentów do hali produkcyjnej',
      status: 'completed',
      startDate: '2025-01-10',
      endDate: '2025-01-10',
      assignedTo: 'Jan Kowalski',
      cost: 150.00,
      notes: 'Użyto wózka widłowego'
    },
    {
      id: 'log-2',
      type: 'assembly',
      name: 'Montaż na miejscu',
      description: 'Składanie elementów w lokalu klienta',
      status: 'planned',
      startDate: '2025-01-25',
      endDate: '2025-01-27',
      assignedTo: 'Marek Wójcik',
      cost: 800.00,
      notes: 'Wymagane 2 osoby'
    },
    {
      id: 'log-3',
      type: 'packaging',
      name: 'Pakowanie elementów',
      description: 'Zabezpieczenie przed transportem',
      status: 'in_progress',
      startDate: '2025-01-20',
      endDate: '2025-01-22',
      assignedTo: 'Tomasz Kowal',
      cost: 200.00,
      notes: 'Użyto folii bąbelkowej'
    }
  ])

  const [newItem, setNewItem] = useState({
    type: 'transport' as LogisticsItem['type'],
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    assignedTo: '',
    cost: 0,
    notes: ''
  })

  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.description.trim() || !newItem.startDate || !newItem.endDate || !newItem.assignedTo.trim()) return

    const item: LogisticsItem = {
      id: crypto.randomUUID(),
      type: newItem.type,
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      status: 'planned',
      startDate: newItem.startDate,
      endDate: newItem.endDate,
      assignedTo: newItem.assignedTo.trim(),
      cost: newItem.cost,
      notes: newItem.notes || undefined
    }

    setLogisticsItems(prev => [...prev, item])
    setNewItem({
      type: 'transport',
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      assignedTo: '',
      cost: 0,
      notes: ''
    })
  }

  const handleStatusChange = (id: string, newStatus: LogisticsItem['status']) => {
    setLogisticsItems(prev => prev.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    ))
  }

  const getTypeLabel = (type: LogisticsItem['type']) => {
    switch (type) {
      case 'transport': return 'Transport'
      case 'assembly': return 'Montaż'
      case 'packaging': return 'Pakowanie'
      case 'delivery': return 'Dostawa'
      default: return type
    }
  }

  const getTypeBadgeClass = (type: LogisticsItem['type']) => {
    switch (type) {
      case 'transport': return 'bg-primary'
      case 'assembly': return 'bg-success'
      case 'packaging': return 'bg-warning'
      case 'delivery': return 'bg-info'
      default: return 'bg-secondary'
    }
  }

  const getStatusBadgeClass = (status: LogisticsItem['status']) => {
    switch (status) {
      case 'planned': return 'bg-secondary'
      case 'in_progress': return 'bg-warning'
      case 'completed': return 'bg-success'
      case 'delayed': return 'bg-danger'
      default: return 'bg-secondary'
    }
  }

  const getStatusLabel = (status: LogisticsItem['status']) => {
    switch (status) {
      case 'planned': return 'Zaplanowane'
      case 'in_progress': return 'W trakcie'
      case 'completed': return 'Zakończone'
      case 'delayed': return 'Opóźnione'
      default: return 'Nieznany'
    }
  }

  const totalCost = logisticsItems.reduce((sum, item) => sum + item.cost, 0)

  return (
    <div data-project-id={projectId}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Logistyka i Montaż</h5>
        <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addLogisticsItemModal">
          <i className="ri-add-line me-1"></i>Dodaj zadanie
        </button>
      </div>

      {/* Summary Card */}
      <div className="card border-0 bg-dark text-white mb-4">
        <div className="card-body text-center">
          <h6 className="mb-1">Koszt całkowity logistyki</h6>
          <h3 className="mb-0">{totalCost.toLocaleString('pl-PL')} PLN</h3>
        </div>
      </div>

      {/* Logistics Items */}
      <div className="row g-3">
        {logisticsItems.map(item => (
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
                <p className="text-muted small mb-2">{item.description}</p>

                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <small className="text-muted d-block">Data rozpoczęcia</small>
                    <strong>{item.startDate}</strong>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Data zakończenia</small>
                    <strong>{item.endDate}</strong>
                  </div>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <small className="text-muted d-block">Przypisane do</small>
                    <strong>{item.assignedTo}</strong>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Koszt</small>
                    <strong>{item.cost.toLocaleString('pl-PL')} PLN</strong>
                  </div>
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
                    onChange={(e) => handleStatusChange(item.id, e.target.value as LogisticsItem['status'])}
                  >
                    <option value="planned">Zaplanowane</option>
                    <option value="in_progress">W trakcie</option>
                    <option value="completed">Zakończone</option>
                    <option value="delayed">Opóźnione</option>
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
      <div className="modal fade" id="addLogisticsItemModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Nowe zadanie logistyczne</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Typ zadania *</label>
                  <select
                    className="form-select"
                    value={newItem.type}
                    onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as LogisticsItem['type'] }))}
                  >
                    <option value="transport">Transport</option>
                    <option value="assembly">Montaż</option>
                    <option value="packaging">Pakowanie</option>
                    <option value="delivery">Dostawa</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Nazwa zadania *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nazwa zadania"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Opis *</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Opis zadania"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Data rozpoczęcia *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newItem.startDate}
                    onChange={(e) => setNewItem(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Data zakończenia *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newItem.endDate}
                    onChange={(e) => setNewItem(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Przypisane do *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newItem.assignedTo}
                    onChange={(e) => setNewItem(prev => ({ ...prev, assignedTo: e.target.value }))}
                    placeholder="Imię i nazwisko"
                  />
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
                disabled={!newItem.name.trim() || !newItem.description.trim() || !newItem.startDate || !newItem.endDate || !newItem.assignedTo.trim()}
              >
                Dodaj zadanie
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



