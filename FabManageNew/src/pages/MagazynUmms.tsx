// Magazyn zgodny z Universal Material Management System (UMMS)
// Pokazuje tylko materiały na stanie + podkategorię Zamówienia

import { useState, useMemo, useEffect } from 'react'
import { Row, Col, Card, Button, Space, Segmented, Tabs, Tag, Statistic, Empty, Select, Input } from 'antd'
import { 
  PlusOutlined, 
  ReloadOutlined,
  FilterOutlined,
  ShoppingCartOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { useUmmsStore } from '../stores/ummsStore'
import { PageHeader } from '../components/Ui/PageHeader'
import { Toolbar } from '../components/Ui/Toolbar'
import { showToast } from '../lib/notifications'
import type { MaterialCategory, OrderStatus } from '../types/umms.types'

const { TabPane } = Tabs
const { Search } = Input

export default function MagazynUmms() {
  // UMMS Store
  const {
    materialCatalog,
    inventoryData,
    materialOrders,
    syncFromBackend,
    getMaterialsInStock,
    calculateStats
  } = useUmmsStore()

  // Local state
  const [activeTab, setActiveTab] = useState<'warehouse' | 'orders'>('warehouse')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'ALL'>('ALL')
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [showFilters, setShowFilters] = useState(false)

  // Initialize data
  useEffect(() => {
    if (materialCatalog.length === 0) {
      syncFromBackend()
    }
  }, [materialCatalog.length, syncFromBackend])

  // Calculate materials and stats
  const materialsInStock = useMemo(() => getMaterialsInStock(), [getMaterialsInStock])
  const stats = useMemo(() => calculateStats(), [calculateStats])

  // Filter materials based on search and category
  const filteredMaterials = useMemo(() => {
    let materials = materialsInStock

    if (searchQuery) {
      materials = materials.filter(material =>
        material.universalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.fabManageCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'ALL') {
      materials = materials.filter(material => material.category === selectedCategory)
    }

    return materials
  }, [materialsInStock, searchQuery, selectedCategory])

  // Filter orders
  const filteredOrders = useMemo(() => {
    return materialOrders.filter(order => {
      if (searchQuery) {
        return order.materialName.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return true
    })
  }, [materialOrders, searchQuery])

  // Get order counts by status
  const orderCounts = useMemo(() => {
    const counts = {
      TO_ORDER: 0,
      ORDERED: 0,
      RECEIVED: 0,
      USED: 0
    }
    materialOrders.forEach(order => {
      counts[order.status]++
    })
    return counts
  }, [materialOrders])

  // Handlers
  const handleSync = async () => {
    try {
      await syncFromBackend()
      showToast('Dane zsynchronizowane pomyślnie', 'success')
    } catch (error) {
      showToast('Błąd synchronizacji danych', 'danger')
    }
  }

  const handleAddMaterial = () => {
    showToast('Funkcja dodawania materiału będzie dostępna wkrótce', 'info')
  }

  const handleQuickOrder = (materialId: string) => {
    const material = materialCatalog.find(m => m.id === materialId)
    if (material) {
      showToast(`Utworzono szybkie zamówienie dla ${material.universalName}`, 'success')
    }
  }

  const getMaterialInventory = (materialId: string) => {
    return inventoryData.find(inv => inv.materialId === materialId)
  }

  const getStockStatus = (materialId: string) => {
    const inventory = getMaterialInventory(materialId)
    if (!inventory) return 'out-of-stock'
    
    if (inventory.availableQuantity <= 0) return 'out-of-stock'
    if (inventory.availableQuantity <= inventory.reorderPoint) return 'low-stock'
    if (inventory.availableQuantity >= inventory.maxStockLevel) return 'excess-stock'
    return 'in-stock'
  }

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'out-of-stock': return 'red'
      case 'low-stock': return 'orange'
      case 'excess-stock': return 'blue'
      case 'in-stock': return 'green'
      default: return 'default'
    }
  }

  const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'TO_ORDER': return <ExclamationCircleOutlined style={{ color: '#faad14' }} />
      case 'ORDERED': return <ShoppingCartOutlined style={{ color: '#1677ff' }} />
      case 'RECEIVED': return <CheckCircleOutlined style={{ color: '#52c41a' }} />
      case 'USED': return <CheckCircleOutlined style={{ color: '#8c8c8c' }} />
      default: return null
    }
  }

  return (
    <div className="magazyn-umms">
      {/* Header */}
      <PageHeader
        title="Magazyn UMMS"
        subtitle={`${stats.warehouseItems} materiałów na stanie • ${stats.ordersCount} zamówień`}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleSync}>
              Synchronizuj
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMaterial}>
              Dodaj materiał
            </Button>
          </Space>
        }
      />

      {/* Toolbar */}
      <Toolbar
        left={
          <Space>
            <Search
              placeholder="Szukaj materiałów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 200 }}
              placeholder="Kategoria"
            >
              <Select.Option value="ALL">Wszystkie kategorie</Select.Option>
              <Select.Option value="SHEET_MATERIAL">Płyty</Select.Option>
              <Select.Option value="HARDWARE">Okucia</Select.Option>
              <Select.Option value="LIGHTING">Oświetlenie</Select.Option>
              <Select.Option value="ELECTRONICS">Elektronika</Select.Option>
              <Select.Option value="METAL_PROFILES">Profile metalowe</Select.Option>
              <Select.Option value="TEXTILES">Tkaniny</Select.Option>
            </Select>
            <Button 
              icon={<FilterOutlined />} 
              onClick={() => setShowFilters(!showFilters)}
              type={showFilters ? 'primary' : 'default'}
            >
              Filtry
            </Button>
          </Space>
        }
        right={
          <Space>
            <Segmented
              value={viewMode}
              onChange={setViewMode}
              options={[
                { label: 'Karty', value: 'cards' },
                { label: 'Tabela', value: 'table' }
              ]}
            />
          </Space>
        }
      />

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Wartość magazynu"
              value={stats.totalValue}
              precision={0}
              suffix="PLN"
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Materiały na stanie"
              value={stats.warehouseItems}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Niski stan"
              value={stats.lowCount + stats.criticalCount}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Zamówienia"
              value={orderCounts.TO_ORDER + orderCounts.ORDERED}
              valueStyle={{ color: '#722ed1' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={(key) => setActiveTab(key as 'warehouse' | 'orders')}
          type="card"
        >
          <TabPane tab={`Magazyn (${filteredMaterials.length})`} key="warehouse">
            {filteredMaterials.length === 0 ? (
              <Empty description="Brak materiałów spełniających kryteria" />
            ) : (
              <Row gutter={[16, 16]}>
                {filteredMaterials.map((material) => {
                  const inventory = getMaterialInventory(material.id)
                  const stockStatus = getStockStatus(material.id)
                  
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={material.id}>
                      <Card
                        size="small"
                        title={
                          <div style={{ fontSize: '14px', fontWeight: 500 }}>
                            {material.universalName}
                          </div>
                        }
                        extra={
                          <Tag color={getStockStatusColor(stockStatus)}>
                            {inventory?.availableQuantity || 0} {inventory?.unit || 'szt'}
                          </Tag>
                        }
                        actions={[
                          <Button 
                            key="order" 
                            size="small" 
                            type="link"
                            icon={<ShoppingCartOutlined />}
                            onClick={() => handleQuickOrder(material.id)}
                          >
                            Zamów
                          </Button>
                        ]}
                      >
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            {material.fabManageCode}
                          </div>
                          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            {material.type} • {material.category}
                          </div>
                          {inventory?.location && (
                            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                              📍 {inventory.location}
                            </div>
                          )}
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{ fontSize: '14px', fontWeight: 500 }}>
                            {material.costData.costPerUnit.toFixed(2)} {material.costData.currency}
                          </div>
                          {inventory && (
                            <Tag 
                              color={inventory.abcClass === 'A' ? 'red' : inventory.abcClass === 'B' ? 'orange' : 'green'}
                            >
                              {inventory.abcClass}
                            </Tag>
                          )}
                        </div>
                      </Card>
                    </Col>
                  )
                })}
              </Row>
            )}
          </TabPane>

          <TabPane tab={`Zamówienia (${filteredOrders.length})`} key="orders">
            {filteredOrders.length === 0 ? (
              <Empty description="Brak zamówień" />
            ) : (
              <Row gutter={[16, 16]}>
                {filteredOrders.map((order) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={order.id}>
                    <Card
                      size="small"
                      title={
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>
                          {order.materialName}
                        </div>
                      }
                      extra={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {getOrderStatusIcon(order.status)}
                          <span style={{ fontSize: '12px' }}>{order.status}</span>
                        </div>
                      }
                    >
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                          Ilość: {order.quantity} {order.unit}
                        </div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                          Zamówił: {order.requestedBy}
                        </div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                          Data: {new Date(order.requestedAt).toLocaleDateString('pl-PL')}
                        </div>
                        {order.projectId && (
                          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            Projekt: {order.projectId}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>
                          {order.estimatedCost?.toFixed(2) || '0.00'} PLN
                        </div>
                        <Tag 
                          color={order.priority === 'high' ? 'red' : order.priority === 'medium' ? 'orange' : 'green'}
                        >
                          {order.priority}
                        </Tag>
                      </div>
                      
                      {order.notes && (
                        <div style={{ 
                          marginTop: 8, 
                          fontSize: '12px', 
                          color: '#8c8c8c',
                          fontStyle: 'italic'
                        }}>
                          {order.notes}
                        </div>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}
