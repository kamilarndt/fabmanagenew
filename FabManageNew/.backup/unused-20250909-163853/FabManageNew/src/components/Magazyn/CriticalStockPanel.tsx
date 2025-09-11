import type { MaterialData } from '../../data/materialsMockData'

interface CriticalStockPanelProps {
  materials: MaterialData[]
  onMaterialSelect: (material: MaterialData) => void
  onQuickOrder: (material: MaterialData) => void
}

export default function CriticalStockPanel({
  materials,
  onMaterialSelect,
  onQuickOrder
}: CriticalStockPanelProps) {

  // Filtrowanie materiałów krytycznych i z niskim stanem
  const criticalMaterials = materials.filter(m => {
    const ratio = m.stock / m.minStock
    return ratio < 1
  }).sort((a, b) => {
    // Sortowanie według stopnia krytyczności
    const ratioA = a.stock / a.minStock
    const ratioB = b.stock / b.minStock
    return ratioA - ratioB
  })

  // Statystyki
  const stats = {
    critical: criticalMaterials.filter(m => m.stock / m.minStock < 0.5).length,
    low: criticalMaterials.filter(m => {
      const ratio = m.stock / m.minStock
      return ratio >= 0.5 && ratio < 1
    }).length,
    totalValue: criticalMaterials.reduce((sum, m) => sum + (m.minStock - m.stock) * m.price, 0)
  }

  // Renderowanie paska postępu z gradientem
  const renderStockBar = (material: MaterialData) => {
    const ratio = material.stock / material.minStock
    const percentage = Math.min(100, Math.round(ratio * 100))
    const missing = material.minStock - material.stock

    // Kolory w zależności od poziomu
    let barColor = 'bg-danger'
    let bgColor = 'bg-danger-subtle'
    if (ratio >= 0.5) {
      barColor = 'bg-warning'
      bgColor = 'bg-warning-subtle'
    }

    return (
      <div className="position-relative">
        <div className={`progress ${bgColor}`} style={{ height: '24px' }}>
          <div
            className={`progress-bar ${barColor}`}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span className="position-absolute w-100 text-center fw-medium" style={{ lineHeight: '24px' }}>
              {material.stock} / {material.minStock} {material.unit}
            </span>
          </div>
        </div>
        {missing > 0 && (
          <small className="text-muted d-block mt-1">
            Brakuje: {missing} {material.unit}
          </small>
        )}
      </div>
    )
  }

  return (
    <div className="critical-stock-panel">
      {/* Nagłówek z statystykami */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-1">Krytyczne zapasy</h5>
          <p className="text-muted mb-0">
            Materiały wymagające pilnego uzupełnienia
          </p>
        </div>

        <div className="d-flex gap-3">
          <div className="text-center">
            <div className="fs-4 fw-bold text-danger">{stats.critical}</div>
            <small className="text-muted">Krytyczne</small>
          </div>
          <div className="text-center">
            <div className="fs-4 fw-bold text-warning">{stats.low}</div>
            <small className="text-muted">Niskie</small>
          </div>
          <div className="text-center">
            <div className="fs-6 fw-bold">
              {stats.totalValue.toLocaleString('pl-PL', {
                style: 'currency',
                currency: 'PLN',
                maximumFractionDigits: 0
              })}
            </div>
            <small className="text-muted">Wartość braków</small>
          </div>
        </div>
      </div>

      {/* Alert dla krytycznych przypadków */}
      {stats.critical > 0 && (
        <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
          <i className="ri-error-warning-line fs-4 me-2"></i>
          <div>
            <strong>Uwaga!</strong> {stats.critical} materiał{stats.critical === 1 ? '' : stats.critical < 5 ? 'y' : 'ów'} poniżej 50% stanu minimalnego.
            Zalecane natychmiastowe złożenie zamówienia.
          </div>
        </div>
      )}

      {/* Lista materiałów */}
      {criticalMaterials.length > 0 ? (
        <div className="critical-materials-list">
          {criticalMaterials.map(material => {
            const ratio = material.stock / material.minStock
            const daysLeft = Math.max(0, Math.round(material.stock / 0.83)) // Założenie dziennego zużycia

            return (
              <div
                key={material.id}
                className="card mb-3 border-0 shadow-sm hover-shadow cursor-pointer"
                onClick={() => onMaterialSelect(material)}
              >
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-5">
                      <div className="d-flex align-items-start">
                        <div className={`badge ${ratio < 0.5 ? 'bg-danger' : 'bg-warning'} me-2 mt-1`}>
                          {ratio < 0.5 ? 'KRYTYCZNY' : 'NISKI'}
                        </div>
                        <div>
                          <h6 className="mb-1">{material.name}</h6>
                          <p className="text-muted small mb-0">
                            {material.code} • {material.supplier}
                          </p>
                          <p className="text-muted small mb-0">
                            <i className="ri-map-pin-line me-1"></i>
                            {material.location || 'Brak lokalizacji'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      {renderStockBar(material)}
                    </div>

                    <div className="col-md-3 text-end">
                      <div className="mb-2">
                        {daysLeft > 0 ? (
                          <span className={`badge ${daysLeft < 7 ? 'bg-danger' :
                              daysLeft < 14 ? 'bg-warning' :
                                'bg-info'
                            }`}>
                            <i className="ri-time-line me-1"></i>
                            ~{daysLeft} dni zapasu
                          </span>
                        ) : (
                          <span className="badge bg-danger">
                            <i className="ri-alert-line me-1"></i>
                            Brak zapasu!
                          </span>
                        )}
                      </div>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onQuickOrder(material)
                        }}
                      >
                        <i className="ri-shopping-cart-2-line me-1"></i>
                        Zamów teraz
                      </button>
                    </div>
                  </div>

                  {/* Dodatkowe informacje */}
                  {material.lastDelivery && (
                    <div className="mt-2 pt-2 border-top">
                      <small className="text-muted">
                        <i className="ri-truck-line me-1"></i>
                        Ostatnia dostawa: {new Date(material.lastDelivery).toLocaleDateString('pl-PL')}
                        {material.abcClass && (
                          <span className="ms-3">
                            <i className="ri-bar-chart-box-line me-1"></i>
                            Klasa ABC: <strong>{material.abcClass}</strong>
                          </span>
                        )}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="ri-checkbox-circle-line text-success" style={{ fontSize: '3rem' }}></i>
          <h6 className="mt-3">Wszystkie zapasy w normie</h6>
          <p className="text-muted">Nie ma materiałów wymagających pilnego uzupełnienia</p>
        </div>
      )}

      {/* Podsumowanie akcji */}
      {criticalMaterials.length > 0 && (
        <div className="card bg-light border-0 mt-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Akcje zbiorcze</h6>
                <p className="text-muted small mb-0">
                  Zamów wszystkie krytyczne materiały jednym kliknięciem
                </p>
              </div>
              <button className="btn btn-danger">
                <i className="ri-shopping-cart-fill me-2"></i>
                Zamów wszystkie ({criticalMaterials.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

