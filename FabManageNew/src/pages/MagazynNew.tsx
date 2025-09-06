import { useState, useMemo, useCallback } from 'react'
import { calculateMaterialStats } from '../data/materialsMockData'
import type { MaterialData } from '../data/materialsMockData'
import { useMaterialsStore } from '../stores/materialsStore'
// consolidated styles are loaded via index.css -> styles/theme.css
import OperationForm from '../components/Magazyn/OperationForm'
import { PageHeader } from '../components/Ui/PageHeader'
import { Toolbar } from '../components/Ui/Toolbar'
import { showToast } from '../lib/toast'
import { EntityTable, type Column } from '../components/Ui/EntityTable'

export default function MagazynNew() {
  // Stan główny
  const materials = useMaterialsStore(state => state.materials)
  const syncFromBackend = useMaterialsStore(state => state.syncFromBackend)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Operation form state
  const [operationFormOpen, setOperationFormOpen] = useState(false)
  const [operationType, setOperationType] = useState<'receive' | 'issue' | 'transfer' | 'adjust'>('receive')

  // Handlers
  const handleMaterialSelect = (material: MaterialData) => {
    void material
    // optional: open details drawer in future
  }

  const handleQuickOrder = (material: MaterialData) => {
    showToast(`Zamówienie dla ${material.name} zostało utworzone`, 'success')
  }

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }, [])

  // select-all disabled in EntityTable variant

  const handleOpenOperationForm = useCallback((type: 'receive' | 'issue') => {
    setOperationType(type)
    setOperationFormOpen(true)
  }, [])

  const handleOperationSubmit = useCallback((operation: { type: 'receive' | 'issue' | 'transfer' | 'adjust';[key: string]: unknown }) => {
    setOperationFormOpen(false)
    showToast(`${operation.type === 'receive' ? 'Przyjęcie' : 'Wydanie'} zostało zapisane`, 'success')
  }, [])

  // Statystyki
  const stats = useMemo(() => calculateMaterialStats(materials), [materials])

  return (
    <div className="magazyn-new">
      <div className="row g-0">
        {/* Lewa kolumna - Sidebar z nawigacją kategorii (25%) */}
        <div className="col-12 col-lg-3">
          <div className="sidebar-navigation bg-light border-end d-none d-lg-block" style={{ minHeight: '100vh' }}>
            <div className="p-3">
              <h6 className="mb-3">Kategorie materiałów</h6>
              <div className="text-muted small">
                Wszystkie materiały: <strong>{materials.length}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Prawa kolumna - Główny obszar roboczy (75%) */}
        <div className="col-12 col-lg-9">
          <div className="main-workspace p-4">
            {/* Nagłówek obszaru roboczego */}
            <div className="workspace-header mb-4">
              <PageHeader
                title="FabrykaStock - Magazyn"
                subtitle={`Wszystkie materiały (${materials.length})`}
                actions={
                  <div className="btn-group">
                    <button className="btn btn-outline-secondary" onClick={() => syncFromBackend()}>
                      <i className="ri-refresh-line me-2"></i>
                      Sync z Rhino
                    </button>
                    <button className="btn btn-primary btn-lg" onClick={() => handleOpenOperationForm('receive')}>
                      <i className="ri-add-line me-2"></i>
                      Dodaj Nowy Materiał
                    </button>
                  </div>
                }
              />

              {/* Szybkie akcje operacyjne */}
              <Toolbar
                left={
                  <>
                    <button className="btn btn-success" onClick={() => handleOpenOperationForm('receive')}>
                      <i className="ri-download-2-line me-1"></i>
                      Przyjęcie towaru
                    </button>
                    <button className="btn btn-warning" onClick={() => handleOpenOperationForm('issue')}>
                      <i className="ri-upload-2-line me-1"></i>
                      Wydanie towaru
                    </button>
                  </>
                }
                right={
                  <>
                    <button className="btn btn-outline-secondary">
                      <i className="ri-file-excel-2-line me-1"></i>
                      Eksport
                    </button>
                    <button className="btn btn-outline-secondary">
                      <i className="ri-printer-line me-1"></i>
                      Etykiety
                    </button>
                  </>
                }
              />
            </div>

            {/* Status i statystyki */}
            <div className="stats-bar d-flex justify-content-between align-items-center mb-4">
              <div className="results-info">
                <span className="text-muted">
                  Znaleziono <strong>{materials.length}</strong> materiałów
                  {stats.criticalCount > 0 && (
                    <span className="text-danger ms-3">
                      <i className="ri-error-warning-line me-1"></i>
                      <strong>{stats.criticalCount}</strong> krytyczne
                    </span>
                  )}
                  {stats.lowCount > 0 && (
                    <span className="text-warning ms-2">
                      <i className="ri-alert-line me-1"></i>
                      <strong>{stats.lowCount}</strong> niskie
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Główna lista materiałów */}
            <div className="materials-content">
              {/* Lista materiałów */}
              <div className="card">
                {(() => {
                  const columns: Column<MaterialData & { valuePln: number }>[] = [
                    {
                      key: 'select', header: '', width: 36, render: (m) => (
                        <input type="checkbox" aria-label={`Zaznacz ${m.name}`} checked={selectedIds.includes(m.id)} onChange={() => toggleSelect(m.id)} />
                      )
                    },
                    { key: 'code', header: 'KOD', render: (m) => <code className="fw-bold">{m.code}</code> },
                    {
                      key: 'name', header: 'NAZWA MATERIAŁU', render: (m) => (
                        <div>
                          <div className="fw-medium">{m.name}</div>
                          <small className="text-muted"><i className="ri-map-pin-line me-1"></i>{m.location || 'Brak lokalizacji'}</small>
                        </div>
                      )
                    },
                    { key: 'stock', header: 'DOSTĘPNE', render: (m) => <div className="fw-bold">{m.stock} {m.unit}</div> },
                    {
                      key: 'status', header: 'STATUS', render: (m) => {
                        const ratio = m.stock / m.minStock
                        return <span className={`badge ${ratio < 0.5 ? 'bg-danger' : ratio < 1 ? 'bg-warning' : 'bg-success'}`}>{ratio < 0.5 ? 'Krytyczny' : ratio < 1 ? 'Niski' : 'OK'}</span>
                      }
                    },
                    { key: 'supplier', header: 'DOSTAWCA' },
                    { key: 'valuePln', header: 'WARTOŚĆ', render: (m) => <span className="fw-medium">{(m.stock * m.price).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 })}</span> },
                    {
                      key: 'actions', header: 'AKCJE', render: (m) => {
                        const ratio = m.stock / m.minStock
                        return ratio < 1 ? (
                          <button className="btn btn-sm btn-danger" aria-label={`Szybkie zamówienie: ${m.name}`} onClick={(e) => { e.stopPropagation(); handleQuickOrder(m) }}>
                            <i className="ri-shopping-cart-2-line"></i>
                          </button>
                        ) : null
                      }
                    },
                  ]
                  return (
                    <EntityTable<MaterialData & { valuePln: number }>
                      rows={materials as any}
                      columns={columns as any}
                      rowKey={(m) => (m as MaterialData).id}
                      onRowClick={(m) => handleMaterialSelect(m as unknown as MaterialData)}
                    />
                  )
                })()}
              </div>

              {/* Brak wyników */}
              {materials.length === 0 && (
                <div className="text-center py-5">
                  <i className="ri-inbox-line display-4 text-muted d-block mb-3"></i>
                  <h5 className="text-muted">Brak materiałów</h5>
                  <p className="text-muted">
                    Nie ma żadnych materiałów w systemie.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Operation Form */}
      <OperationForm
        type={operationType}
        isOpen={operationFormOpen}
        onSubmit={handleOperationSubmit}
        onCancel={() => setOperationFormOpen(false)}
      />
    </div>
  )
}