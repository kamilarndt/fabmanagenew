import { useState } from 'react'
import { useMaterialsStore } from '../../stores/materialsStore'

interface MaterialsTabProps {
  projectId: string
}

export default function MaterialsTab({ projectId }: MaterialsTabProps) {
  const [activeTab, setActiveTab] = useState<'purchase' | 'stock' | 'delivery'>('purchase')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)

  const { getPurchaseRequestsByProject, addPurchaseRequest, removePurchaseRequest } = useMaterialsStore()
  const { getReservationsByProject, addStockReservation, removeStockReservation } = useMaterialsStore()
  const { getDeliveriesByProject, addDeliveryTracking, removeDeliveryTracking } = useMaterialsStore()

  const purchaseRequests = getPurchaseRequestsByProject(projectId)
  const stockReservations = getReservationsByProject(projectId)
  const deliveries = getDeliveriesByProject(projectId)

  const handleAddPurchaseRequest = (formData: any) => {
    addPurchaseRequest({
      projectId,
      materialId: crypto.randomUUID(),
      materialName: formData.materialName,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      requestedBy: formData.requestedBy,
      priority: formData.priority,
      notes: formData.notes,
      status: 'pending'
    })
    setShowAddModal(false)
  }

  const handleAddStockReservation = (formData: any) => {
    addStockReservation({
      projectId,
      materialId: crypto.randomUUID(),
      materialName: formData.materialName,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      reservedBy: formData.reservedBy,
      status: 'reserved'
    })
    setShowAddModal(false)
  }

  const handleAddDelivery = (formData: any) => {
    addDeliveryTracking({
      projectId,
      materialId: crypto.randomUUID(),
      materialName: formData.materialName,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      supplierName: formData.supplierName,
      expectedDelivery: new Date(formData.expectedDelivery).getTime(),
      status: 'ordered',
      trackingNumber: formData.trackingNumber,
      notes: formData.notes
    })
    setShowAddModal(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'approved': return 'success'
      case 'rejected': return 'danger'
      case 'ordered': return 'info'
      case 'reserved': return 'primary'
      case 'released': return 'secondary'
      case 'consumed': return 'success'
      case 'in_transit': return 'info'
      case 'delivered': return 'success'
      case 'delayed': return 'danger'
      default: return 'secondary'
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pl-PL')
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Zarządzanie materiałami</h5>
            </div>
            <div className="card-body">
              {/* Tabs */}
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'purchase' ? 'active' : ''}`}
                    onClick={() => setActiveTab('purchase')}
                  >
                    <i className="ri-shopping-cart-line me-2"></i>
                    Zamówienia ({purchaseRequests.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'stock' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stock')}
                  >
                    <i className="ri-store-2-line me-2"></i>
                    Rezerwacje ({stockReservations.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'delivery' ? 'active' : ''}`}
                    onClick={() => setActiveTab('delivery')}
                  >
                    <i className="ri-truck-line me-2"></i>
                    Dostawy ({deliveries.length})
                  </button>
                </li>
              </ul>

              {/* Tab Content */}
              <div className="tab-content mt-3">
                {/* Purchase Requests Tab */}
                {activeTab === 'purchase' && (
                  <div className="tab-pane fade show active">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6>Zamówienia materiałów</h6>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setEditingItem(null)
                          setShowAddModal(true)
                        }}
                      >
                        <i className="ri-add-line me-1"></i>
                        Nowe zamówienie
                      </button>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Materiał</th>
                            <th>Ilość</th>
                            <th>Zamawiający</th>
                            <th>Priorytet</th>
                            <th>Status</th>
                            <th>Data</th>
                            <th>Akcje</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchaseRequests.map((request) => (
                            <tr key={request.id}>
                              <td>{request.materialName}</td>
                              <td>{request.quantity} {request.unit}</td>
                              <td>{request.requestedBy}</td>
                              <td>
                                <span className={`badge bg-${request.priority === 'high' ? 'danger' : request.priority === 'medium' ? 'warning' : 'success'}`}>
                                  {request.priority}
                                </span>
                              </td>
                              <td>
                                <span className={`badge bg-${getStatusColor(request.status)}`}>
                                  {request.status}
                                </span>
                              </td>
                              <td>{formatDate(request.requestedAt)}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary me-1"
                                  onClick={() => {
                                    setEditingItem(request)
                                    setShowAddModal(true)
                                  }}
                                >
                                  <i className="ri-edit-line"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removePurchaseRequest(request.id)}
                                >
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

                {/* Stock Reservations Tab */}
                {activeTab === 'stock' && (
                  <div className="tab-pane fade show active">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6>Rezerwacje magazynowe</h6>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setEditingItem(null)
                          setShowAddModal(true)
                        }}
                      >
                        <i className="ri-add-line me-1"></i>
                        Nowa rezerwacja
                      </button>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Materiał</th>
                            <th>Ilość</th>
                            <th>Rezerwujący</th>
                            <th>Status</th>
                            <th>Data rezerwacji</th>
                            <th>Akcje</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockReservations.map((reservation) => (
                            <tr key={reservation.id}>
                              <td>{reservation.materialName}</td>
                              <td>{reservation.quantity} {reservation.unit}</td>
                              <td>{reservation.reservedBy}</td>
                              <td>
                                <span className={`badge bg-${getStatusColor(reservation.status)}`}>
                                  {reservation.status}
                                </span>
                              </td>
                              <td>{formatDate(reservation.reservedAt)}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary me-1"
                                  onClick={() => {
                                    setEditingItem(reservation)
                                    setShowAddModal(true)
                                  }}
                                >
                                  <i className="ri-edit-line"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeStockReservation(reservation.id)}
                                >
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

                {/* Delivery Tracking Tab */}
                {activeTab === 'delivery' && (
                  <div className="tab-pane fade show active">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6>Śledzenie dostaw</h6>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setEditingItem(null)
                          setShowAddModal(true)
                        }}
                      >
                        <i className="ri-add-line me-1"></i>
                        Nowa dostawa
                      </button>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Materiał</th>
                            <th>Ilość</th>
                            <th>Dostawca</th>
                            <th>Status</th>
                            <th>Oczekiwana data</th>
                            <th>Nr śledzenia</th>
                            <th>Akcje</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deliveries.map((delivery) => (
                            <tr key={delivery.id}>
                              <td>{delivery.materialName}</td>
                              <td>{delivery.quantity} {delivery.unit}</td>
                              <td>{delivery.supplierName}</td>
                              <td>
                                <span className={`badge bg-${getStatusColor(delivery.status)}`}>
                                  {delivery.status}
                                </span>
                              </td>
                              <td>{formatDate(delivery.expectedDelivery)}</td>
                              <td>{delivery.trackingNumber || '-'}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary me-1"
                                  onClick={() => {
                                    setEditingItem(delivery)
                                    setShowAddModal(true)
                                  }}
                                >
                                  <i className="ri-edit-line"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeDeliveryTracking(delivery.id)}
                                >
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingItem ? 'Edytuj' : 'Dodaj'} {activeTab === 'purchase' ? 'zamówienie' : activeTab === 'stock' ? 'rezerwację' : 'dostawę'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const data = Object.fromEntries(formData.entries())

                  if (activeTab === 'purchase') {
                    handleAddPurchaseRequest(data)
                  } else if (activeTab === 'stock') {
                    handleAddStockReservation(data)
                  } else {
                    handleAddDelivery(data)
                  }
                }}>
                  <div className="mb-3">
                    <label className="form-label">Nazwa materiału</label>
                    <input
                      type="text"
                      className="form-control"
                      name="materialName"
                      defaultValue={editingItem?.materialName || ''}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Ilość</label>
                        <input
                          type="number"
                          className="form-control"
                          name="quantity"
                          step="0.01"
                          defaultValue={editingItem?.quantity || ''}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Jednostka</label>
                        <select className="form-select" name="unit" defaultValue={editingItem?.unit || 'szt'}>
                          <option value="szt">szt</option>
                          <option value="m">m</option>
                          <option value="m²">m²</option>
                          <option value="m³">m³</option>
                          <option value="kg">kg</option>
                          <option value="l">l</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {activeTab === 'purchase' && (
                    <>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Zamawiający</label>
                            <input
                              type="text"
                              className="form-control"
                              name="requestedBy"
                              defaultValue={editingItem?.requestedBy || ''}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Priorytet</label>
                            <select className="form-select" name="priority" defaultValue={editingItem?.priority || 'medium'}>
                              <option value="low">Niski</option>
                              <option value="medium">Średni</option>
                              <option value="high">Wysoki</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'stock' && (
                    <div className="mb-3">
                      <label className="form-label">Rezerwujący</label>
                      <input
                        type="text"
                        className="form-control"
                        name="reservedBy"
                        defaultValue={editingItem?.reservedBy || ''}
                        required
                      />
                    </div>
                  )}

                  {activeTab === 'delivery' && (
                    <>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Dostawca</label>
                            <input
                              type="text"
                              className="form-control"
                              name="supplierName"
                              defaultValue={editingItem?.supplierName || ''}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Oczekiwana data dostawy</label>
                            <input
                              type="date"
                              className="form-control"
                              name="expectedDelivery"
                              defaultValue={editingItem?.expectedDelivery ? new Date(editingItem.expectedDelivery).toISOString().split('T')[0] : ''}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Numer śledzenia</label>
                        <input
                          type="text"
                          className="form-control"
                          name="trackingNumber"
                          defaultValue={editingItem?.trackingNumber || ''}
                        />
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Uwagi</label>
                    <textarea
                      className="form-control"
                      name="notes"
                      rows={3}
                      defaultValue={editingItem?.notes || ''}
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAddModal(false)}
                    >
                      Anuluj
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingItem ? 'Zapisz' : 'Dodaj'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



