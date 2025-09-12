import { useState, useCallback, useMemo } from 'react'
import { Row, Col, Select, Segmented, Space, Pagination, Spin, Alert, Card } from 'antd'
import { AppstoreOutlined, BarsOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'
import { usePageSearch } from '../contexts/SearchContext'
import { useMaterialsQuery, type MaterialsFilters } from '../hooks/useMaterialsQuery'
import { FilterPanelV3 } from '../components/Magazyn/FilterPanelV3'
import { SimpleMaterialsGrid } from '../components/Magazyn/SimpleMaterialsGrid'
import MaterialDetailDrawer from '../components/Magazyn/MaterialDetailDrawer'
import { EntityTable, type Column } from '../components/Ui/EntityTable'
import { showToast } from '../lib/notifications'
// import { useWindowSize } from '../hooks/useWindowSize'

export default function MagazynV3() {
  // Hooks dla rozmiaru okna
  // const windowSize = useWindowSize()

  // Stan filtrów i ustawień
  const [filters, setFilters] = useState<MaterialsFilters>({
    page: 1,
    limit: 24,
    search: '',
    category: '',
    supplier: '',
    status: '',
    sortBy: 'category',
    sortOrder: 'asc'
  })

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [selectedIds] = useState<string[]>([])
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null)

  // Kontekstowa wyszukiwarka
  usePageSearch({
    placeholder: 'Szukaj materiałów po nazwie, kodzie, kategorii...',
    onSearch: useCallback((value: string) => {
      setFilters(prev => ({
        ...prev,
        search: value,
        page: 1 // Reset strony przy nowym wyszukiwaniu
      }))
    }, [])
  })

  // Zapytanie o materiały z React Query
  const {
    data: materialsResponse,
    isLoading,
    isError,
    error
  } = useMaterialsQuery(filters)

  const materials = materialsResponse?.data || []
  const pagination = materialsResponse?.pagination

  // Handlers
  const handleFiltersChange = useCallback((newFilters: Partial<MaterialsFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset strony przy zmianie filtrów
    }))
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      category: '',
      supplier: '',
      status: '',
      page: 1
    }))
  }, [])

  const handleSortChange = useCallback((sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1
    }))
  }, [])

  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setFilters(prev => ({
      ...prev,
      page,
      ...(pageSize && { limit: pageSize })
    }))
  }, [])

  const handleMaterialSelect = useCallback((material: any) => {
    setSelectedMaterial(material)
    setDetailOpen(true)
  }, [])

  const handleQuickOrder = useCallback((material: any) => {
    showToast(`Szybkie zamówienie dla ${material.name} zostało utworzone`, 'success')
  }, [])

  const handleAddToProject = useCallback((material: any) => {
    showToast(`Materiał ${material.name} został dodany do projektu`, 'success')
  }, [])

  // Oblicz rozmiary dla wirtualizacji
  // const containerDimensions = useMemo(() => {
  //   const siderWidth = 300
  //   const padding = 32
  //   const availableWidth = (windowSize.width || 1200) - siderWidth - padding
  //   const availableHeight = (windowSize.height || 800) - 200 // Header + toolbar + pagination
  //   
  //   return {
  //     width: Math.max(availableWidth, 400),
  //     height: Math.max(availableHeight, 400)
  //   }
  // }, [windowSize])

  // Kolumny dla widoku tabeli
  const tableColumns: Column<any>[] = useMemo(() => [
    {
      key: 'name',
      header: 'NAZWA',
      sortable: true,
      render: (material) => (
        <div>
          <div style={{ fontWeight: 600 }}>{material.category}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {material.type} {material.name && `• ${material.name}`}
          </div>
        </div>
      )
    },
    {
      key: 'unit',
      header: 'J.M.',
      sortable: true,
      render: (material) => material.unit || '—'
    },
    {
      key: 'thickness_mm',
      header: 'GRUBOŚĆ',
      sortable: true,
      render: (material) => material.thickness_mm ? `${material.thickness_mm}mm` : '—'
    },
    {
      key: 'stock',
      header: 'STAN',
      sortable: true,
      render: (material) => {
        const ratio = (material.quantity || 0) / Math.max(1, material.min_quantity || 1)
        const color = ratio < 0.5 ? '#ff4d4f' : ratio < 1 ? '#faad14' : (material.quantity > (material.max_quantity || Infinity) ? '#1677ff' : '#52c41a')
        const pct = Math.min(100, Math.round(ratio * 100))
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span>{material.quantity} / {material.min_quantity}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{material.unit}</span>
            </div>
            <div style={{ height: 6, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden', marginTop: 4 }}>
              <div style={{ width: `${pct}%`, height: '100%', background: color }} />
            </div>
          </div>
        )
      }
    },
    {
      key: 'price',
      header: 'CENA',
      sortable: true,
      render: (material) => (
        <div>
          <div style={{ fontWeight: 600 }}>{(material.unitCost || 0).toFixed(2)} PLN</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>/ {material.unit}</div>
        </div>
      )
    },
    {
      key: 'supplier',
      header: 'DOSTAWCA',
      render: (material) => material.supplier || '—'
    },
    {
      key: 'location',
      header: 'LOKALIZACJA',
      render: (material) => material.location || '—'
    }
  ], [])

  // Error state
  if (isError) {
    return (
      <Alert
        message="Błąd ładowania materiałów"
        description={error?.message || 'Wystąpił nieoczekiwany błąd'}
        type="error"
        showIcon
        style={{ margin: '24px 0' }}
      />
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Row gutter={16}>
        {/* Panel filtrowania */}
        <Col xs={24} lg={6}>
          <Card
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRight: '1px solid var(--border-color)',
              marginBottom: 16
            }}
            bodyStyle={{ padding: 16 }}
          >
            <FilterPanelV3
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </Card>
        </Col>

        {/* Główna zawartość */}
        <Col xs={24} lg={18}>
          {/* Pasek narzędzi */}
          <Card
            style={{
              marginBottom: 16,
              backgroundColor: 'var(--bg-secondary)'
            }}
            bodyStyle={{ padding: '16px 24px' }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Space size="middle">
                  {/* Sortowanie */}
                  <Select
                    value={filters.sortBy}
                    onChange={handleSortChange}
                    style={{ width: 120 }}
                    size="small"
                    suffixIcon={
                      filters.sortOrder === 'asc' ?
                        <SortAscendingOutlined /> :
                        <SortDescendingOutlined />
                    }
                  >
                    <Select.Option value="category">Kategoria</Select.Option>
                    <Select.Option value="name">Nazwa</Select.Option>
                    <Select.Option value="price">Cena</Select.Option>
                    <Select.Option value="stock">Stan</Select.Option>
                  </Select>

                  {/* Przełącznik widoku */}
                  <Segmented
                    value={viewMode}
                    onChange={setViewMode}
                    options={[
                      { label: 'Karty', value: 'cards', icon: <AppstoreOutlined /> },
                      { label: 'Tabela', value: 'table', icon: <BarsOutlined /> }
                    ]}
                    size="small"
                  />
                </Space>
              </Col>

              <Col>
                <Space size="small">
                  {/* Informacje o wynikach */}
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {isLoading ? (
                      <Spin size="small" />
                    ) : (
                      `${materials.length} z ${pagination?.total || 0} materiałów`
                    )}
                  </span>

                  {/* Rozmiar strony */}
                  <Select
                    value={filters.limit}
                    onChange={(limit) => handleFiltersChange({ limit })}
                    style={{ width: 80 }}
                    size="small"
                  >
                    <Select.Option value={12}>12</Select.Option>
                    <Select.Option value={24}>24</Select.Option>
                    <Select.Option value={48}>48</Select.Option>
                    <Select.Option value={96}>96</Select.Option>
                  </Select>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Zawartość główna */}
          <Card bodyStyle={{ padding: '16px 24px' }}>
            <Spin spinning={isLoading}>
              {viewMode === 'cards' ? (
                <SimpleMaterialsGrid
                  materials={materials}
                  loading={isLoading}
                  onMaterialSelect={handleMaterialSelect}
                  onQuickOrder={handleQuickOrder}
                  onAddToProject={handleAddToProject}
                  selectedIds={selectedIds}
                />
              ) : (
                <EntityTable
                  rows={materials}
                  columns={tableColumns}
                  rowKey={(material) => material.id}
                  onRowClick={handleMaterialSelect}
                  initialHiddenColumns={['supplier', 'location']}
                />
              )}
            </Spin>

            {/* Paginacja */}
            {pagination && pagination.totalPages > 1 && (
              <div style={{
                marginTop: '24px',
                padding: '16px 0',
                borderTop: '1px solid #f0f0f0',
                textAlign: 'center'
              }}>
                <Pagination
                  current={pagination.page}
                  total={pagination.total}
                  pageSize={pagination.limit}
                  onChange={handlePageChange}
                  onShowSizeChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} z ${total} materiałów`
                  }
                  pageSizeOptions={['12', '24', '48', '96']}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <MaterialDetailDrawer
        open={detailOpen}
        material={selectedMaterial}
        onClose={() => setDetailOpen(false)}
        onSaved={(next) => {
          if (!selectedMaterial) return
          // Optimistic merge for the selected item in client state
          setSelectedMaterial({ ...selectedMaterial, ...next })
        }}
      />
    </div>
  )
}
