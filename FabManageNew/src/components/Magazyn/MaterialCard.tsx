import React from 'react'
import { MaterialData } from '../../data/materialsMockData'

interface MaterialCardProps {
  material: MaterialData
  onSelect: (material: MaterialData) => void
  onQuickOrder?: (material: MaterialData) => void
}

export default function MaterialCard({ material, onSelect, onQuickOrder }: MaterialCardProps) {
  const stockRatio = material.stock / material.minStock
  const stockPercentage = Math.min(100, Math.round(stockRatio * 100))
  
  // Określenie statusu i koloru
  const getStockStatus = () => {
    if (stockRatio < 0.5) return { color: 'danger', text: 'Krytyczny', icon: 'ri-error-warning-line' }
    if (stockRatio < 1) return { color: 'warning', text: 'Niski', icon: 'ri-alert-line' }
    if (stockRatio > material.maxStock / material.minStock) return { color: 'info', text: 'Nadmiar', icon: 'ri-information-line' }
    return { color: 'success', text: 'OK', icon: 'ri-check-line' }
  }
  
  const status = getStockStatus()
  
  // Kolor klasy ABC
  const abcColors = {
    'A': 'success',
    'B': 'warning', 
    'C': 'danger'
  }
  
  // Ikony dla kategorii
  const categoryIcons: Record<string, string> = {
    '_M': 'ri-stack-line',
    '_PLEXI': 'ri-rectangle-line',
    '_DIBOND': 'ri-layout-grid-line',
    '_ELEKTRYKA': 'ri-flashlight-line'
  }

  return (
    <div 
      className="material-card card h-100 border-0 shadow-sm hover-shadow-lg transition-all cursor-pointer"
      onClick={() => onSelect(material)}
      style={{ transition: 'all 0.3s ease' }}
    >
      {/* Nagłówek z kodem i klasą ABC */}
      <div className="card-header bg-transparent border-0 pb-0">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <span className="text-muted small">{material.code}</span>
            {material.abcClass && (
              <span className={`badge bg-${abcColors[material.abcClass]} ms-2`}>
                Klasa {material.abcClass}
              </span>
            )}
          </div>
          <i className={`${categoryIcons[material.category[0]] || 'ri-box-3-line'} fs-5 text-muted`}></i>
        </div>
      </div>
      
      <div className="card-body">
        {/* Nazwa materiału */}
        <h6 className="card-title fw-semibold mb-3 text-truncate" title={material.name}>
          {material.name}
        </h6>
        
        {/* Stan magazynowy */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small text-muted">Stan magazynowy</span>
            <span className={`badge bg-${status.color}-subtle text-${status.color}`}>
              <i className={`${status.icon} me-1`}></i>
              {status.text}
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="progress flex-grow-1" style={{ height: '8px' }}>
              <div 
                className={`progress-bar bg-${status.color}`}
                style={{ width: `${stockPercentage}%` }}
                role="progressbar"
                aria-valuenow={stockPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
            <span className="small fw-medium">
              {material.stock}/{material.minStock} {material.unit}
            </span>
          </div>
        </div>
        
        {/* Dodatkowe informacje */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div className="text-muted small">Dostawca</div>
            <div className="fw-medium small text-truncate" title={material.supplier}>
              {material.supplier}
            </div>
          </div>
          <div className="col-6">
            <div className="text-muted small">Lokalizacja</div>
            <div className="fw-medium small">
              <i className="ri-map-pin-line me-1"></i>
              {material.location || 'Brak'}
            </div>
          </div>
        </div>
        
        {/* Właściwości */}
        {material.properties && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {material.properties.fireResistant && (
              <span className="badge bg-danger-subtle text-danger small">
                <i className="ri-fire-line me-1"></i>Trudnopalny
              </span>
            )}
            {material.properties.waterResistant && (
              <span className="badge bg-info-subtle text-info small">
                <i className="ri-drop-line me-1"></i>Wodoodporny
              </span>
            )}
            {material.properties.flexible && (
              <span className="badge bg-purple-subtle text-purple small">
                <i className="ri-curve-line me-1"></i>Giętkispan>
            )}
            {material.thickness && (
              <span className="badge bg-secondary-subtle text-secondary small">
                {material.thickness}mm
              </span>
            )}
          </div>
        )}
        
        {/* Wartość */}
        <div className="d-flex justify-content-between align-items-end">
          <div>
            <div className="text-muted small">Wartość</div>
            <div className="fw-bold">
              {(material.stock * material.price).toLocaleString('pl-PL', {
                style: 'currency',
                currency: 'PLN'
              })}
            </div>
          </div>
          
          {/* Przycisk szybkiego zamówienia dla krytycznych */}
          {stockRatio < 1 && onQuickOrder && (
            <button 
              className="btn btn-sm btn-danger"
              onClick={(e) => {
                e.stopPropagation()
                onQuickOrder(material)
              }}
              title="Szybkie zamówienie"
            >
              <i className="ri-shopping-cart-2-line"></i>
            </button>
          )}
        </div>
      </div>
      
      {/* Stopka z datą ostatniej dostawy */}
      <div className="card-footer bg-transparent border-top-0 pt-0">
        <div className="d-flex justify-content-between align-items-center text-muted small">
          <span>
            <i className="ri-truck-line me-1"></i>
            Ostatnia dostawa
          </span>
          <span>
            {material.lastDelivery 
              ? new Date(material.lastDelivery).toLocaleDateString('pl-PL')
              : 'Brak danych'
            }
          </span>
        </div>
      </div>
    </div>
  )
}

// Style CSS dla efektu hover
const styles = `
  .material-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .material-card:hover {
    transform: translateY(-2px);
  }
  
  .hover-shadow-lg:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  
  .transition-all {
    transition: all 0.3s ease;
  }
  
  .bg-purple-subtle {
    background-color: rgba(102, 16, 242, 0.1);
  }
  
  .text-purple {
    color: #6610f2;
  }
`