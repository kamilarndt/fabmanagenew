import React from 'react'
import { Collapse, Select, Button, Space, Tag, Divider, Statistic, Row, Col } from 'antd'
import { FilterOutlined, ClearOutlined } from '@ant-design/icons'
import type { MaterialsFilters } from '../../hooks/useMaterialsQuery'
import { useCategoriesQuery, useSuppliersQuery } from '../../hooks/useMaterialsQuery'

const { Panel } = Collapse

interface FilterPanelV3Props {
  filters: MaterialsFilters
  onFiltersChange: (filters: Partial<MaterialsFilters>) => void
  onClearFilters: () => void
  className?: string
}

export const FilterPanelV3: React.FC<FilterPanelV3Props> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className
}) => {
  const { data: categories, isLoading: categoriesLoading } = useCategoriesQuery()
  const { data: suppliers, isLoading: suppliersLoading } = useSuppliersQuery()

  // Liczba aktywnych filtrów
  const activeFiltersCount = React.useMemo(() => {
    let count = 0
    if (filters.category) count++
    if (filters.supplier) count++
    if (filters.status) count++
    if (filters.unit) count++
    if (filters.thicknessMin != null || filters.thicknessMax != null) count++
    if (filters.priceMin != null || filters.priceMax != null) count++
    return count
  }, [filters.category, filters.supplier, filters.status, filters.unit, filters.thicknessMin, filters.thicknessMax, filters.priceMin, filters.priceMax])

  // Statusy zapasów
  const stockStatuses = [
    { value: 'critical', label: 'Krytyczne', color: '#ff4d4f', icon: '🚨' },
    { value: 'low', label: 'Niskie', color: '#faad14', icon: '⚠️' },
    { value: 'normal', label: 'W normie', color: '#52c41a', icon: '✅' },
    { value: 'excess', label: 'Nadmiar', color: '#1890ff', icon: '📈' }
  ]

  return (
    <div className={className} style={{ height: '100%', backgroundColor: 'var(--bg-primary)' }}>
      {/* Nagłówek */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FilterOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            <span style={{ fontWeight: '600', fontSize: '14px' }}>Filtry</span>
            {activeFiltersCount > 0 && (
              <Tag
                color="blue"
                style={{ marginLeft: '8px', fontSize: '10px' }}
              >
                {activeFiltersCount}
              </Tag>
            )}
          </div>
          <Button
            type="link"
            size="small"
            icon={<ClearOutlined />}
            onClick={onClearFilters}
            disabled={activeFiltersCount === 0}
          >
            Wyczyść
          </Button>
        </div>
      </div>

      {/* Filtry */}
      <div style={{ padding: '16px', height: 'calc(100% - 73px)', overflowY: 'auto' }}>
        <Collapse
          defaultActiveKey={['categories', 'status']}
          ghost
          size="small"
        >
          {/* Kategorie główne */}
          <Panel
            header="Kategorie główne"
            key="categories"
            extra={filters.category && <Tag color="blue" style={{ fontSize: '10px' }}>1</Tag>}
          >
            <Select
              placeholder="Wybierz kategorię"
              value={filters.category}
              onChange={(value) => onFiltersChange({ category: value })}
              style={{ width: '100%' }}
              loading={categoriesLoading}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {Array.isArray(categories) && categories.map((cat: any) => (
                <Select.Option key={cat.category} value={cat.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{cat.category}</span>
                    <span style={{ color: '#8c8c8c', fontSize: '12px' }}>
                      ({cat.count})
                    </span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Panel>

          {/* Statusy zapasów */}
          <Panel
            header="Status zapasu"
            key="status"
            extra={filters.status && <Tag color="blue" style={{ fontSize: '10px' }}>1</Tag>}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              {stockStatuses.map((status) => (
                <Button
                  key={status.value}
                  type={filters.status === status.value ? 'primary' : 'default'}
                  block
                  size="small"
                  onClick={() => onFiltersChange({
                    status: filters.status === status.value ? '' : status.value as any
                  })}
                  style={{
                    textAlign: 'left',
                    height: 'auto',
                    padding: '8px 12px',
                    border: filters.status === status.value ? undefined : `1px solid ${status.color}20`,
                    color: filters.status === status.value ? '#fff' : status.color
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px' }}>{status.icon}</span>
                    <span>{status.label}</span>
                  </div>
                </Button>
              ))}
            </Space>
          </Panel>

          {/* Dostawcy */}
          <Panel
            header="Dostawcy"
            key="suppliers"
            extra={filters.supplier && <Tag color="blue" style={{ fontSize: '10px' }}>1</Tag>}
          >
            <Select
              placeholder="Wybierz dostawcę"
              value={filters.supplier}
              onChange={(value) => onFiltersChange({ supplier: value })}
              style={{ width: '100%' }}
              loading={suppliersLoading}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {Array.isArray(suppliers) && suppliers.map((supplier: any) => (
                <Select.Option key={supplier.supplier} value={supplier.supplier}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{supplier.supplier}</span>
                    <span style={{ color: '#8c8c8c', fontSize: '12px' }}>
                      ({supplier.count})
                    </span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Panel>

          {/* Jednostka */}
          <Panel
            header="Jednostka"
            key="unit"
            extra={filters.unit && <Tag color="blue" style={{ fontSize: '10px' }}>1</Tag>}
          >
            <Select
              placeholder="Wybierz jednostkę"
              value={filters.unit}
              onChange={(value) => onFiltersChange({ unit: value })}
              style={{ width: '100%' }}
              allowClear
            >
              {['szt', 'mb', 'm²', 'm³', 'kg', 'ark'].map(u => (
                <Select.Option key={u} value={u}>{u}</Select.Option>
              ))}
            </Select>
          </Panel>

          {/* Zakres grubości i ceny */}
          <Panel header="Parametry" key="params" extra={((filters.thicknessMin != null || filters.thicknessMax != null) || (filters.priceMin != null || filters.priceMax != null)) && <Tag color="blue" style={{ fontSize: '10px' }}>1</Tag>}>
            <Row gutter={8} style={{ marginBottom: 8 }}>
              <Col span={12}>
                <Select
                  placeholder="Grubość min (mm)"
                  value={filters.thicknessMin as any}
                  onChange={(v) => onFiltersChange({ thicknessMin: v })}
                  style={{ width: '100%' }}
                  allowClear
                  showSearch
                >
                  {[0, 3, 6, 8, 10, 12, 15, 16, 18, 22, 25, 30, 36, 40, 50].map(v => (
                    <Select.Option key={`tmin-${v}`} value={v}>{v}</Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={12}>
                <Select
                  placeholder="Grubość max (mm)"
                  value={filters.thicknessMax as any}
                  onChange={(v) => onFiltersChange({ thicknessMax: v })}
                  style={{ width: '100%' }}
                  allowClear
                  showSearch
                >
                  {[3, 6, 8, 10, 12, 15, 16, 18, 22, 25, 30, 36, 40, 50, 80].map(v => (
                    <Select.Option key={`tmax-${v}`} value={v}>{v}</Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Select
                  placeholder="Cena min (PLN)"
                  value={filters.priceMin as any}
                  onChange={(v) => onFiltersChange({ priceMin: v })}
                  style={{ width: '100%' }}
                  allowClear
                  showSearch
                >
                  {[0, 10, 20, 50, 100, 200, 500].map(v => (
                    <Select.Option key={`pmin-${v}`} value={v}>{v}</Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={12}>
                <Select
                  placeholder="Cena max (PLN)"
                  value={filters.priceMax as any}
                  onChange={(v) => onFiltersChange({ priceMax: v })}
                  style={{ width: '100%' }}
                  allowClear
                  showSearch
                >
                  {[10, 20, 50, 100, 200, 500, 1000].map(v => (
                    <Select.Option key={`pmax-${v}`} value={v}>{v}</Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Panel>

          {/* Statystyki (dodatkowy panel) */}
          <Panel header="Statystyki" key="stats">
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Kategorie"
                    value={Array.isArray(categories) ? categories.length : 0}
                    valueStyle={{ fontSize: '16px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Dostawcy"
                    value={Array.isArray(suppliers) ? suppliers.length : 0}
                    valueStyle={{ fontSize: '16px' }}
                  />
                </Col>
              </Row>
            </Space>
          </Panel>
        </Collapse>

        {/* Aktywne filtry */}
        {activeFiltersCount > 0 && (
          <>
            <Divider style={{ margin: '16px 0' }} />
            <div>
              <div style={{
                fontSize: '12px',
                color: '#8c8c8c',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Aktywne filtry:
              </div>
              <Space size={[4, 4]} wrap>
                {filters.category && (
                  <Tag
                    closable
                    onClose={() => onFiltersChange({ category: '' })}
                    color="blue"
                    style={{ fontSize: '11px' }}
                  >
                    {filters.category}
                  </Tag>
                )}
                {filters.supplier && (
                  <Tag
                    closable
                    onClose={() => onFiltersChange({ supplier: '' })}
                    color="green"
                    style={{ fontSize: '11px' }}
                  >
                    {filters.supplier}
                  </Tag>
                )}
                {filters.status && (
                  <Tag
                    closable
                    onClose={() => onFiltersChange({ status: '' })}
                    color="orange"
                    style={{ fontSize: '11px' }}
                  >
                    {stockStatuses.find(s => s.value === filters.status)?.label}
                  </Tag>
                )}
                {filters.unit && (
                  <Tag closable onClose={() => onFiltersChange({ unit: '' })} color="purple" style={{ fontSize: '11px' }}>{filters.unit}</Tag>
                )}
                {(filters.thicknessMin != null || filters.thicknessMax != null) && (
                  <Tag closable onClose={() => onFiltersChange({ thicknessMin: undefined, thicknessMax: undefined })} color="gold" style={{ fontSize: '11px' }}>
                    Grubość: {filters.thicknessMin ?? '—'}–{filters.thicknessMax ?? '—'} mm
                  </Tag>
                )}
                {(filters.priceMin != null || filters.priceMax != null) && (
                  <Tag closable onClose={() => onFiltersChange({ priceMin: undefined, priceMax: undefined })} color="volcano" style={{ fontSize: '11px' }}>
                    Cena: {filters.priceMin ?? '—'}–{filters.priceMax ?? '—'} PLN
                  </Tag>
                )}
              </Space>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
