import { useState, useMemo, useCallback, useEffect } from 'react'
import { calculateMaterialStats } from '../data/materialsMockData'
import type { MaterialData } from '../data/materialsMockData'
import { useMaterialsStore } from '../stores/materialsStore'
// consolidated styles are loaded via index.css -> styles/theme.css
import OperationForm from '../components/Magazyn/OperationForm'
import CategorySidebar from '../components/Magazyn/CategorySidebar'
import { MaterialCard } from '../components/Magazyn/MaterialCard'
import { PageHeader } from '../components/Ui/PageHeader'
import { Toolbar } from '../components/Ui/Toolbar'
import { showToast } from '../lib/notifications'
import { EntityTable, type Column } from '../components/Ui/EntityTable'
import { Row, Col, Card, Button, Space, Typography, Tag, Empty, Segmented, Input, Select, Modal } from 'antd'
import { Checkbox } from 'antd'
import { AppstoreOutlined, BarsOutlined, SearchOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons'

export default function MagazynNew() {
  // Stan główny
  const materials = useMaterialsStore(state => state.materials)
  const syncFromBackend = useMaterialsStore(state => state.syncFromBackend)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards')

  // Filtry i wyszukiwanie
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'category'>('category')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [advancedFiltersVisible, setAdvancedFiltersVisible] = useState(false)

  // Zaawansowane filtry
  const [selectedSupplier, setSelectedSupplier] = useState<string>('')
  const [selectedAbcClass, setSelectedAbcClass] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  // Automatyczne ładowanie materiałów przy wejściu
  useEffect(() => {
    if (materials.length === 0) {
      syncFromBackend()
    }
  }, [materials.length, syncFromBackend])

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

  // Filtrowanie i sortowanie materiałów
  const filteredMaterials = useMemo(() => {
    let result = [...materials]

    // Filtr po kategoriach
    if (selectedCategories.length > 0) {
      result = result.filter(material => {
        if (!Array.isArray(material.category)) return false

        const [mainCat, subCat] = material.category
        const materialCategoryKey = subCat ? `${mainCat}_${subCat}` : mainCat

        return selectedCategories.some(selectedCat => {
          if (selectedCat === mainCat) return true
          if (selectedCat === materialCategoryKey) return true
          return false
        })
      })
    }

    // Filtr wyszukiwania
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(material =>
        material.name.toLowerCase().includes(query) ||
        material.code.toLowerCase().includes(query) ||
        ((material as any).typ && (material as any).typ.toLowerCase().includes(query)) ||
        ((material as any).rodzaj && (material as any).rodzaj.toLowerCase().includes(query)) ||
        (material.supplier && material.supplier.toLowerCase().includes(query))
      )
    }

    // Zaawansowane filtry
    if (selectedSupplier) {
      result = result.filter(material => material.supplier === selectedSupplier)
    }

    if (selectedAbcClass) {
      result = result.filter(material => material.abcClass === selectedAbcClass)
    }

    if (selectedStatus) {
      result = result.filter(material => {
        const ratio = material.stock / material.minStock
        if (selectedStatus === 'critical') return ratio < 0.5
        if (selectedStatus === 'low') return ratio >= 0.5 && ratio < 1
        if (selectedStatus === 'normal') return ratio >= 1 && ratio <= material.maxStock / material.minStock
        if (selectedStatus === 'excess') return ratio > material.maxStock / material.minStock
        return true
      })
    }

    // Sortowanie
    result.sort((a, b) => {
      let aVal: any, bVal: any

      switch (sortBy) {
        case 'name':
          aVal = a.name
          bVal = b.name
          break
        case 'price':
          aVal = (a as any).cena || a.price || 0
          bVal = (b as any).cena || b.price || 0
          break
        case 'stock':
          aVal = a.stock
          bVal = b.stock
          break
        case 'category':
          aVal = Array.isArray(a.category) ? a.category.join(' ') : a.category || ''
          bVal = Array.isArray(b.category) ? b.category.join(' ') : b.category || ''
          break
        default:
          return 0
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const result = aVal.localeCompare(bVal, 'pl', { sensitivity: 'base' })
        return sortOrder === 'desc' ? -result : result
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        const result = aVal - bVal
        return sortOrder === 'desc' ? -result : result
      }

      return 0
    })

    return result
  }, [materials, selectedCategories, searchQuery, selectedSupplier, selectedAbcClass, selectedStatus, sortBy, sortOrder])

  // Statystyki
  const stats = useMemo(() => calculateMaterialStats(filteredMaterials), [filteredMaterials])

  return (
    <div className="magazyn-new">
      <Row gutter={[12, 12]}>
        {/* Lewa kolumna - Sidebar z nawigacją kategorii (25%) */}
        <Col xs={24} lg={6}>
          <CategorySidebar
            materials={materials}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />
        </Col>

        {/* Prawa kolumna - Główny obszar roboczy (75%) */}
        <Col xs={24} lg={18}>
          <div className="main-workspace" style={{ padding: 12 }}>
            {/* Nagłówek obszaru roboczego */}
            <div style={{ marginBottom: 12 }}>
              <PageHeader
                title="FabrykaStock - Magazyn"
                subtitle={
                  selectedCategories.length > 0
                    ? `Materiały w wybranych kategoriach (${filteredMaterials.length} z ${materials.length})`
                    : `Wszystkie materiały (${materials.length})`
                }
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

              {/* Ulepszone paski narzędzi */}
              {/* Górny pasek - wyszukiwanie i filtry */}
              <Card size="small" style={{ marginBottom: 12 }}>
                <Row gutter={12} align="middle">
                  <Col flex="auto">
                    <Input.Search
                      placeholder="Szukaj materiałów po nazwie, kodzie, typie..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ maxWidth: 400 }}
                      size="middle"
                      enterButton={<SearchOutlined />}
                    />
                  </Col>
                  <Col>
                    <Space>
                      <Select
                        placeholder="Sortuj po"
                        value={`${sortBy}_${sortOrder}`}
                        onChange={(value) => {
                          const [field, order] = value.split('_')
                          setSortBy(field as any)
                          setSortOrder(order as any)
                        }}
                        style={{ width: 140 }}
                        size="middle"
                        suffixIcon={<SortAscendingOutlined />}
                      >
                        <Select.Option value="category_asc">Kategoria ↑</Select.Option>
                        <Select.Option value="category_desc">Kategoria ↓</Select.Option>
                        <Select.Option value="name_asc">Nazwa ↑</Select.Option>
                        <Select.Option value="name_desc">Nazwa ↓</Select.Option>
                        <Select.Option value="price_asc">Cena ↑</Select.Option>
                        <Select.Option value="price_desc">Cena ↓</Select.Option>
                        <Select.Option value="stock_asc">Stan ↑</Select.Option>
                        <Select.Option value="stock_desc">Stan ↓</Select.Option>
                      </Select>

                      <Button
                        icon={<FilterOutlined />}
                        onClick={() => setAdvancedFiltersVisible(true)}
                      >
                        Filtry
                      </Button>

                      <Segmented
                        value={viewMode}
                        onChange={setViewMode}
                        options={[
                          { value: 'table', icon: <BarsOutlined />, label: 'Tabela' },
                          { value: 'cards', icon: <AppstoreOutlined />, label: 'Karty' }
                        ]}
                      />
                    </Space>
                  </Col>
                </Row>
              </Card>

              {/* Pasek akcji operacyjnych */}
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
                Znaleziono <strong>{filteredMaterials.length}</strong> materiałów
                {selectedCategories.length > 0 && (
                  <span> (z {materials.length} ogółem)</span>
                )}
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
              {viewMode === 'table' ? (
                /* Widok tabeli */
                <Card>
                  {(() => {
                    const columns: Column<MaterialData & { valuePln: number }>[] = [
                      {
                        key: 'select', header: '', width: 36, render: (m) => (
                          <Checkbox aria-label={`Zaznacz ${m.name}`} checked={selectedIds.includes(m.id)} onChange={() => toggleSelect(m.id)} />
                        )
                      },
                      {
                        key: 'code',
                        header: 'KOD',
                        sortable: true,
                        render: (m) => <code style={{ fontWeight: 600 }}>{m.code}</code>
                      },
                      {
                        key: 'name',
                        header: 'NAZWA MATERIAŁU',
                        sortable: true,
                        render: (m) => (
                          <div>
                            <div style={{ fontWeight: 500 }}>{m.name}</div>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}><i className="ri-map-pin-line" style={{ marginRight: 4 }}></i>{m.location || 'Brak lokalizacji'}</Typography.Text>
                          </div>
                        )
                      },
                      {
                        key: 'category',
                        header: 'KATEGORIA',
                        sortable: true,
                        render: (m) => {
                          const categoryPath = Array.isArray(m.category) ? m.category.join(' / ') : (m.category || 'Brak kategorii')
                          return (
                            <div>
                              <Tag color="blue" style={{ fontSize: 11 }}>
                                {categoryPath}
                              </Tag>
                            </div>
                          )
                        },
                        sorter: (a, b) => {
                          const aCategory = Array.isArray(a.category) ? a.category.join(' ') : (a.category || '')
                          const bCategory = Array.isArray(b.category) ? b.category.join(' ') : (b.category || '')
                          return aCategory.localeCompare(bCategory, 'pl', { sensitivity: 'base' })
                        }
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
                        rows={filteredMaterials as any}
                        columns={columns as any}
                        rowKey={(m) => (m as MaterialData).id}
                        onRowClick={(m) => handleMaterialSelect(m as unknown as MaterialData)}
                        defaultSortKey="category"
                        defaultSortDirection="asc"
                      />
                    )
                  })()}
                </Card>
              ) : (
                /* Widok kart */
                <Row gutter={[16, 16]}>
                  {filteredMaterials.map(material => (
                    <Col xs={24} sm={12} md={8} lg={6} xl={4} key={material.id}>
                      <MaterialCard
                        material={material}
                        selected={selectedIds.includes(material.id)}
                        onSelect={(m) => {
                          handleMaterialSelect(m)
                          toggleSelect(m.id)
                        }}
                        onQuickOrder={handleQuickOrder}
                        onAddToProject={(m) => {
                          // TODO: Implementuj dodawanie do projektu
                          console.log('Dodaj do projektu:', m.name)
                        }}
                      />
                    </Col>
                  ))}
                </Row>
              )}

              {/* Brak wyników */}
              {filteredMaterials.length === 0 && materials.length > 0 && (
                <Card style={{ marginTop: 12 }}>
                  <Empty description="Brak materiałów w wybranych kategoriach" />
                </Card>
              )}
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

      {/* Modal z zaawansowanymi filtrami */}
      <Modal
        title="Filtry zaawansowane"
        open={advancedFiltersVisible}
        onCancel={() => setAdvancedFiltersVisible(false)}
        footer={[
          <Button key="clear" onClick={() => {
            setSelectedSupplier('')
            setSelectedAbcClass('')
            setSelectedStatus('')
          }}>
            Wyczyść filtry
          </Button>,
          <Button key="close" type="primary" onClick={() => setAdvancedFiltersVisible(false)}>
            Zastosuj
          </Button>
        ]}
        width={500}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <Typography.Text strong>Dostawca:</Typography.Text>
            <Select
              placeholder="Wybierz dostawcę"
              value={selectedSupplier}
              onChange={setSelectedSupplier}
              style={{ width: '100%', marginTop: 8 }}
              allowClear
            >
              {Array.from(new Set(materials.map(m => m.supplier))).map(supplier => (
                <Select.Option key={supplier} value={supplier}>
                  {supplier}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <Typography.Text strong>Klasa ABC:</Typography.Text>
            <Select
              placeholder="Wybierz klasę ABC"
              value={selectedAbcClass}
              onChange={setSelectedAbcClass}
              style={{ width: '100%', marginTop: 8 }}
              allowClear
            >
              <Select.Option value="A">Klasa A (Krytyczne)</Select.Option>
              <Select.Option value="B">Klasa B (Ważne)</Select.Option>
              <Select.Option value="C">Klasa C (Standardowe)</Select.Option>
            </Select>
          </div>

          <div>
            <Typography.Text strong>Status zapasu:</Typography.Text>
            <Select
              placeholder="Wybierz status"
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: '100%', marginTop: 8 }}
              allowClear
            >
              <Select.Option value="critical">
                <Tag color="#ff4d4f">Krytyczny (&lt; 50% min)</Tag>
              </Select.Option>
              <Select.Option value="low">
                <Tag color="#faad14">Niski stan (&lt; min)</Tag>
              </Select.Option>
              <Select.Option value="normal">
                <Tag color="#52c41a">OK</Tag>
              </Select.Option>
              <Select.Option value="excess">
                <Tag color="#1890ff">Nadmiar (&gt; max)</Tag>
              </Select.Option>
            </Select>
          </div>

          {/* Podsumowanie aktywnych filtrów */}
          {(selectedSupplier || selectedAbcClass || selectedStatus) && (
            <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Aktywne filtry:
              </Typography.Text>
              <div style={{ marginTop: 4 }}>
                {selectedSupplier && (
                  <Tag closable onClose={() => setSelectedSupplier('')} style={{ marginBottom: 4 }}>
                    Dostawca: {selectedSupplier}
                  </Tag>
                )}
                {selectedAbcClass && (
                  <Tag closable onClose={() => setSelectedAbcClass('')} style={{ marginBottom: 4 }}>
                    Klasa: {selectedAbcClass}
                  </Tag>
                )}
                {selectedStatus && (
                  <Tag closable onClose={() => setSelectedStatus('')} style={{ marginBottom: 4 }}>
                    Status: {selectedStatus}
                  </Tag>
                )}
              </div>
            </div>
          )}
        </Space>
      </Modal>
    </div>
  )
}