import { useState } from 'react'
import type { MaterialData } from '../../data/materialsMockData'
import type { MaterialMovement } from '../../types/magazyn.types'

interface MaterialDetailsPanelProps {
  material: MaterialData | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (material: MaterialData) => void
  onOrder?: (material: MaterialData) => void
}

export default function MaterialDetailsPanel({
  material,
  isOpen,
  onClose,
  onEdit,
  onOrder
}: MaterialDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'analytics'>('details')

  if (!material) return null

  const stockRatio = material.stock / material.minStock
  const stockPercentage = Math.min(100, Math.round(stockRatio * 100))

  // Mock historia ruchów
  const mockMovements: MaterialMovement[] = [
    {
      id: '1',
      materialId: material.id,
      documentNumber: 'PZ/2025/001',
      type: 'IN',
      quantity: 50,
      date: new Date('2025-01-10'),
      user: 'Jan Kowalski',
      notes: 'Dostawa planowa'
    },
    {
      id: '2',
      materialId: material.id,
      documentNumber: 'RW/2025/015',
      type: 'OUT',
      quantity: 12,
      date: new Date('2025-01-08'),
      user: 'Anna Nowak',
      notes: 'Projekt #2451'
    },
    {
      id: '3',
      materialId: material.id,
      documentNumber: 'RW/2025/012',
      type: 'OUT',
      quantity: 8,
      date: new Date('2025-01-05'),
      user: 'Piotr Wiśniewski',
      notes: 'Projekt #2448'
    }
  ]

  // Obliczenia analityczne
  const analytics = {
    avgMonthlyUsage: 25,
    daysOfStock: Math.round(material.stock / 0.83), // ~25/30 dni
    lastMonthUsage: 28,
    yearToDateUsage: 312,
    turnoverRate: 4.2,
    orderPoint: material.minStock * 1.5
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`material-details-panel position-fixed top-0 end-0 h-100 bg-white shadow-lg ${isOpen ? 'open' : ''
          }`}
        style={{
          width: '480px',
          maxWidth: '90vw',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          zIndex: 1050,
          overflowY: 'auto'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="material-details-title"
      >
        {/* Nagłówek */}
        <div className="sticky-top bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center p-3">
            <h5 id="material-details-title" className="mb-0">Szczegóły materiału</h5>
            <button
              className="btn btn-sm btn-ghost rounded-circle"
              onClick={onClose}
              aria-label="Zamknij panel szczegółów"
            >
              <i className="ri-close-line fs-5"></i>
            </button>
          </div>

          {/* Zakładki */}
          <ul className="nav nav-tabs px-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                <i className="ri-information-line me-1"></i>
                Szczegóły
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <i className="ri-history-line me-1"></i>
                Historia
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <i className="ri-bar-chart-box-line me-1"></i>
                Analityka
              </button>
            </li>
          </ul>
        </div>

        {/* Zawartość */}
        <div className="p-3">
          {activeTab === 'details' && (
            <>
              {/* Podstawowe informacje */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="text-muted small mb-1">{material.code}</h6>
                    <h4 className="mb-0">{material.name}</h4>
                  </div>
                  {material.abcClass && (
                    <span className={`badge bg-${material.abcClass === 'A' ? 'success' :
                      material.abcClass === 'B' ? 'warning' : 'danger'
                      }`}>
                      Klasa {material.abcClass}
                    </span>
                  )}
                </div>

                {/* Kategoria */}
                <div className="text-muted small">
                  <i className="ri-folder-line me-1"></i>
                  {material.category.join(' > ')}
                </div>
              </div>

              {/* Stan magazynowy */}
              <div className="card mb-3">
                <div className="card-body">
                  <h6 className="card-title">Stan magazynowy</h6>
                  <div className="row g-3">
                    <div className="col-4">
                      <div className="text-center">
                        <div className="fs-4 fw-bold text-primary">{material.stock}</div>
                        <div className="text-muted small">Aktualny stan</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="text-center">
                        <div className="fs-4 fw-bold text-warning">{material.minStock}</div>
                        <div className="text-muted small">Stan minimalny</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="text-center">
                        <div className="fs-4 fw-bold text-success">{material.maxStock}</div>
                        <div className="text-muted small">Stan maksymalny</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="progress" style={{ height: '10px' }}>
                      <div
                        className={`progress-bar ${stockRatio < 0.5 ? 'bg-danger' :
                          stockRatio < 1 ? 'bg-warning' :
                            'bg-success'
                          }`}
                        style={{ width: `${stockPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-center mt-2 small text-muted">
                      {stockPercentage}% stanu minimalnego
                    </div>
                  </div>
                </div>
              </div>

              {/* Informacje dodatkowe */}
              <div className="card mb-3">
                <div className="card-body">
                  <h6 className="card-title">Informacje dodatkowe</h6>
                  <dl className="row mb-0">
                    <dt className="col-5">Jednostka:</dt>
                    <dd className="col-7">{material.unit}</dd>

                    <dt className="col-5">Dostawca:</dt>
                    <dd className="col-7">{material.supplier}</dd>

                    <dt className="col-5">Cena jednostkowa:</dt>
                    <dd className="col-7">
                      {material.price.toLocaleString('pl-PL', {
                        style: 'currency',
                        currency: 'PLN'
                      })}
                    </dd>

                    <dt className="col-5">Wartość zapasu:</dt>
                    <dd className="col-7 fw-bold">
                      {(material.stock * material.price).toLocaleString('pl-PL', {
                        style: 'currency',
                        currency: 'PLN'
                      })}
                    </dd>

                    <dt className="col-5">Lokalizacja:</dt>
                    <dd className="col-7">
                      <i className="ri-map-pin-line me-1"></i>
                      {material.location || 'Nieprzypisana'}
                    </dd>

                    <dt className="col-5">Ostatnia dostawa:</dt>
                    <dd className="col-7">
                      {material.lastDelivery
                        ? new Date(material.lastDelivery).toLocaleDateString('pl-PL')
                        : 'Brak danych'
                      }
                    </dd>
                  </dl>
                </div>
              </div>

              {/* Właściwości */}
              {material.properties && (
                <div className="card mb-3">
                  <div className="card-body">
                    <h6 className="card-title">Właściwości</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {material.thickness && (
                        <span className="badge bg-secondary">
                          Grubość: {material.thickness}mm
                        </span>
                      )}
                      {material.properties.color && (
                        <span className="badge bg-secondary">
                          Kolor: {material.properties.color}
                        </span>
                      )}
                      {material.properties.finish && (
                        <span className="badge bg-secondary">
                          Wykończenie: {material.properties.finish}
                        </span>
                      )}
                      {material.properties.fireResistant && (
                        <span className="badge bg-danger">
                          <i className="ri-fire-line me-1"></i>Trudnopalny
                        </span>
                      )}
                      {material.properties.waterResistant && (
                        <span className="badge bg-info">
                          <i className="ri-drop-line me-1"></i>Wodoodporny
                        </span>
                      )}
                      {material.properties.flexible && (
                        <span className="badge bg-purple">
                          <i className="ri-curve-line me-1"></i>Do gięcia
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Akcje */}
              <div className="d-grid gap-2">
                {stockRatio < 1 && onOrder && (
                  <button
                    className="btn btn-danger"
                    onClick={() => onOrder(material)}
                  >
                    <i className="ri-shopping-cart-2-line me-2"></i>
                    Zamów materiał
                  </button>
                )}
                {onEdit && (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => onEdit(material)}
                  >
                    <i className="ri-edit-line me-2"></i>
                    Edytuj dane
                  </button>
                )}
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <>
              <h6 className="mb-3">Historia ruchów magazynowych</h6>
              <div className="timeline">
                {mockMovements.map((movement, index) => (
                  <div key={movement.id} className="timeline-item mb-3">
                    <div className="d-flex align-items-start">
                      <div className={`timeline-badge rounded-circle p-2 me-3 bg-${movement.type === 'IN' ? 'success' : 'danger'
                        }-subtle`}>
                        <i className={`ri-${movement.type === 'IN' ? 'download' : 'upload'
                          }-2-line text-${movement.type === 'IN' ? 'success' : 'danger'
                          }`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">
                              {movement.type === 'IN' ? 'Przyjęcie' : 'Wydanie'} - {movement.quantity} {material.unit}
                            </h6>
                            <p className="text-muted small mb-1">
                              {movement.documentNumber} • {movement.user}
                            </p>
                            {movement.notes && (
                              <p className="text-muted small mb-0">
                                <i className="ri-sticky-note-line me-1"></i>
                                {movement.notes}
                              </p>
                            )}
                          </div>
                          <span className="text-muted small">
                            {movement.date.toLocaleDateString('pl-PL')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index < mockMovements.length - 1 && (
                      <div className="timeline-connector"></div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <>
              <h6 className="mb-3">Analityka zużycia</h6>

              {/* Wskaźniki */}
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="card text-center">
                    <div className="card-body">
                      <div className="fs-4 fw-bold text-primary">{analytics.avgMonthlyUsage}</div>
                      <div className="text-muted small">Śr. miesięczne zużycie</div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card text-center">
                    <div className="card-body">
                      <div className="fs-4 fw-bold text-info">{analytics.daysOfStock}</div>
                      <div className="text-muted small">Dni zapasu</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wykres (placeholder) */}
              <div className="card mb-3">
                <div className="card-body">
                  <h6 className="card-title">Trend zużycia (ostatnie 6 miesięcy)</h6>
                  <div className="bg-light rounded" style={{ height: '200px' }}></div>
                </div>
              </div>

              {/* Dodatkowe metryki */}
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Metryki wydajności</h6>
                  <dl className="row mb-0">
                    <dt className="col-7">Rotacja zapasów:</dt>
                    <dd className="col-5 text-end">{analytics.turnoverRate}x/rok</dd>

                    <dt className="col-7">Punkt zamawiania:</dt>
                    <dd className="col-5 text-end">{analytics.orderPoint} {material.unit}</dd>

                    <dt className="col-7">Zużycie w tym roku:</dt>
                    <dd className="col-5 text-end">{analytics.yearToDateUsage} {material.unit}</dd>

                    <dt className="col-7">Zużycie ostatni miesiąc:</dt>
                    <dd className="col-5 text-end">{analytics.lastMonthUsage} {material.unit}</dd>
                  </dl>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

