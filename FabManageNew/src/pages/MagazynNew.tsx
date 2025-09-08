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
import { Row, Col, Card, Button, Space, Typography, Tag, Empty } from 'antd'
import { Checkbox } from 'antd'

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
      <Row gutter={[12, 12]}>
        {/* Lewa kolumna - Sidebar z nawigacją kategorii (25%) */}
        <Col xs={24} lg={6}>
          <Card style={{ minHeight: '100%' }}>
            <Typography.Title level={5} style={{ marginTop: 0 }}>Kategorie materiałów</Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Wszystkie materiały: <strong>{materials.length}</strong>
            </Typography.Text>
          </Card>
        </Col>

        {/* Prawa kolumna - Główny obszar roboczy (75%) */}
        <Col xs={24} lg={18}>
          <div className="main-workspace" style={{ padding: 12 }}>
            {/* Nagłówek obszaru roboczego */}
            <div style={{ marginBottom: 12 }}>
              <PageHeader
                title="FabrykaStock - Magazyn"
                subtitle={`Wszystkie materiały (${materials.length})`}
                actions={
                  <Space>
                    <Button onClick={() => syncFromBackend()}>
                      <i className="ri-refresh-line" style={{ marginRight: 6 }}></i>
                      Sync z Rhino
                    </Button>
                    <Button type="primary" onClick={() => handleOpenOperationForm('receive')}>
                      <i className="ri-add-line" style={{ marginRight: 6 }}></i>
                      Dodaj Nowy Materiał
                    </Button>
                  </Space>
                }
              />

              {/* Szybkie akcje operacyjne */}
              <Toolbar
                left={
                  <Space>
                    <Button type="primary" onClick={() => handleOpenOperationForm('receive')}>
                      <i className="ri-download-2-line" style={{ marginRight: 6 }}></i>
                      Przyjęcie towaru
                    </Button>
                    <Button danger onClick={() => handleOpenOperationForm('issue')}>
                      <i className="ri-upload-2-line" style={{ marginRight: 6 }}></i>
                      Wydanie towaru
                    </Button>
                  </Space>
                }
                right={
                  <Space>
                    <Button>
                      <i className="ri-file-excel-2-line" style={{ marginRight: 6 }}></i>
                      Eksport
                    </Button>
                    <Button>
                      <i className="ri-printer-line" style={{ marginRight: 6 }}></i>
                      Etykiety
                    </Button>
                  </Space>
                }
              />
            </div>

            {/* Status i statystyki */}
            <div style={{ marginBottom: 12 }}>
              <Typography.Text type="secondary">
                Znaleziono <strong>{materials.length}</strong> materiałów
              </Typography.Text>
              <Space style={{ marginLeft: 12 }}>
                {stats.criticalCount > 0 && (
                  <Tag color="error"><i className="ri-error-warning-line" style={{ marginRight: 4 }}></i>{stats.criticalCount} krytyczne</Tag>
                )}
                {stats.lowCount > 0 && (
                  <Tag color="warning"><i className="ri-alert-line" style={{ marginRight: 4 }}></i>{stats.lowCount} niskie</Tag>
                )}
              </Space>
            </div>

            {/* Główna lista materiałów */}
            <div className="materials-content">
              {/* Lista materiałów */}
              <Card>
                {(() => {
                  const columns: Column<MaterialData & { valuePln: number }>[] = [
                    {
                      key: 'select', header: '', width: 36, render: (m) => (
                        <Checkbox aria-label={`Zaznacz ${m.name}`} checked={selectedIds.includes(m.id)} onChange={() => toggleSelect(m.id)} />
                      )
                    },
                    { key: 'code', header: 'KOD', render: (m) => <code style={{ fontWeight: 600 }}>{m.code}</code> },
                    {
                      key: 'name', header: 'NAZWA MATERIAŁU', render: (m) => (
                        <div>
                          <div style={{ fontWeight: 500 }}>{m.name}</div>
                          <Typography.Text type="secondary" style={{ fontSize: 12 }}><i className="ri-map-pin-line" style={{ marginRight: 4 }}></i>{m.location || 'Brak lokalizacji'}</Typography.Text>
                        </div>
                      )
                    },
                    { key: 'stock', header: 'DOSTĘPNE', render: (m) => <div style={{ fontWeight: 600 }}>{m.stock} {m.unit}</div> },
                    {
                      key: 'status', header: 'STATUS', render: (m) => {
                        const ratio = m.stock / m.minStock
                        const color = ratio < 0.5 ? 'error' : ratio < 1 ? 'warning' : 'success'
                        const label = ratio < 0.5 ? 'Krytyczny' : ratio < 1 ? 'Niski' : 'OK'
                        return <Tag color={color as any}>{label}</Tag>
                      }
                    },
                    { key: 'supplier', header: 'DOSTAWCA' },
                    { key: 'valuePln', header: 'WARTOŚĆ', render: (m) => <span style={{ fontWeight: 500 }}>{(m.stock * m.price).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 })}</span> },
                    {
                      key: 'actions', header: 'AKCJE', render: (m) => {
                        const ratio = m.stock / m.minStock
                        return ratio < 1 ? (
                          <Button danger size="small" aria-label={`Szybkie zamówienie: ${m.name}`} onClick={(e) => { e.stopPropagation(); handleQuickOrder(m) }}>
                            <i className="ri-shopping-cart-2-line"></i>
                          </Button>
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
              </Card>

              {/* Brak wyników */}
              {materials.length === 0 && (
                <Card style={{ marginTop: 12 }}>
                  <Empty description="Brak materiałów" />
                </Card>
              )}
            </div>
          </div>
        </Col>
      </Row>

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