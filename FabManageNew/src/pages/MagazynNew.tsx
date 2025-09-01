import React, { useState, useMemo, useEffect } from 'react'
import { mockMaterials, MaterialData, filterMaterials, calculateMaterialStats } from '../data/materialsMockData'
import CategoryTree from '../components/Magazyn/CategoryTree'
import MaterialCard from '../components/Magazyn/MaterialCard'
import TagFilter from '../components/Magazyn/TagFilter'
import MaterialDetailsPanel from '../components/Magazyn/MaterialDetailsPanel'
import CriticalStockPanel from '../components/Magazyn/CriticalStockPanel'
import { ViewMode, SortField, SortOrder } from '../types/magazyn.types'
import { showToast } from '../lib/toast'

export default function MagazynNew() {
  // Stan główny
  const [materials] = useState<MaterialData[]>(mockMaterials)
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialData | null>(null)
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false)
  
  // Filtry i widok
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'critical' | 'low' | 'normal' | 'excess'>('all')
  const [selectedAbcClass, setSelectedAbcClass] = useState<'all' | 'A' | 'B' | 'C'>('all')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'critical' | 'movement'>('overview')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  
  // Przetwarzanie tagów na filtry
  useEffect(() => {
    activeTags.forEach(tagId => {
      if (tagId.startsWith('cat-')) {
        const category = tagId.replace('cat-', '')
        setSelectedCategories([category])
      } else if (tagId === 'status-critical') {
        setSelectedStatus('critical')
      } else if (tagId === 'status-low') {
        setSelectedStatus('low')
      }
    })
  }, [activeTags])
  
  // Filtrowane materiały
  const filteredMaterials = useMemo(() => {
    return filterMaterials(materials, {
      search: searchQuery,
      category: selectedCategories,
      status: selectedStatus,
      supplier: selectedSupplier || undefined,
      abcClass: selectedAbcClass !== 'all' ? selectedAbcClass : undefined
    })
  }, [materials, searchQuery, selectedCategories, selectedStatus, selectedSupplier, selectedAbcClass])
  
  // Sortowane materiały
  const sortedMaterials = useMemo(() => {
    const sorted = [...filteredMaterials]
    sorted.sort((a, b) => {
      let aVal: any, bVal: any
      
      switch (sortField) {
        case 'code':
          aVal = a.code
          bVal = b.code
          break
        case 'name':
          aVal = a.name
          bVal = b.name
          break
        case 'stock':
          aVal = a.stock / a.minStock
          bVal = b.stock / b.minStock
          break
        case 'supplier':
          aVal = a.supplier
          bVal = b.supplier
          break
        case 'lastDelivery':
          aVal = a.lastDelivery ? new Date(a.lastDelivery).getTime() : 0
          bVal = b.lastDelivery ? new Date(b.lastDelivery).getTime() : 0
          break
        case 'value':
          aVal = a.stock * a.price
          bVal = b.stock * b.price
          break
        default:
          aVal = a.name
          bVal = b.name
      }
      
      const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortOrder === 'asc' ? result : -result
    })
    
    return sorted
  }, [filteredMaterials, sortField, sortOrder])
  
  // Statystyki
  const stats = useMemo(() => calculateMaterialStats(filteredMaterials), [filteredMaterials])
  
  // Lista unikalnych dostawców
  const suppliers = useMemo(() => {
    const uniqueSuppliers = new Set(materials.map(m => m.supplier))
    return Array.from(uniqueSuppliers).sort()
  }, [materials])
  
  // Handlers
  const handleMaterialSelect = (material: MaterialData) => {
    setSelectedMaterial(material)
    setDetailsPanelOpen(true)
  }
  
  const handleQuickOrder = (material: MaterialData) => {
    showToast(`Zamówienie dla ${material.name} zostało utworzone`, 'success')
  }
  
  const handleTagToggle = (tagId: string) => {
    setActiveTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }
  
  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setSelectedSupplier('')
    setSelectedStatus('all')
    setSelectedAbcClass('all')
    setActiveTags([])
  }
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="magazyn-new">
      <div className="row g-4">
        {/* Sidebar z drzewem kategorii */}
        <div className="col-12 col-lg-3 col-xl-2">
          <div className="card h-100">
            <div className="card-body p-0">
              <CategoryTree
                materials={materials}
                selectedCategories={selectedCategories}
                onCategorySelect={setSelectedCategories}
                className="p-3"
              />
            </div>
          </div>
        </div>
        
        {/* Główna treść */}
        <div className="col-12 col-lg-9 col-xl-10">
          {/* Nagłówek */}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h4 className="mb-1">Magazyn materiałów</h4>
              <p className="text-muted mb-0">
                Zarządzaj stanami magazynowymi i monitoruj zapasy
              </p>
            </div>
            
            <div className="d-flex gap-2">
              <button className="btn btn-primary">
                <i className="ri-download-2-line me-2"></i>
                Przyjęcie towaru
              </button>
              <button className="btn btn-outline-primary">
                <i className="ri-upload-2-line me-2"></i>
                Wydanie towaru
              </button>
              <button className="btn btn-outline-secondary">
                <i className="ri-file-excel-2-line me-2"></i>
                Eksport
              </button>
            </div>
          </div>
          
          {/* Zakładki nawigacyjne */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="ri-dashboard-line me-1"></i>
                Przegląd
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'materials' ? 'active' : ''}`}
                onClick={() => setActiveTab('materials')}
              >
                <i className="ri-stack-line me-1"></i>
                Lista materiałów
                <span className="badge bg-secondary ms-2">{filteredMaterials.length}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'critical' ? 'active' : ''} ${
                  stats.criticalCount > 0 ? 'text-danger' : ''
                }`}
                onClick={() => setActiveTab('critical')}
              >
                <i className="ri-error-warning-line me-1"></i>
                Krytyczne zapasy
                {stats.criticalCount > 0 && (
                  <span className="badge bg-danger ms-2">{stats.criticalCount}</span>
                )}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'movement' ? 'active' : ''}`}
                onClick={() => setActiveTab('movement')}
              >
                <i className="ri-exchange-line me-1"></i>
                Ruch magazynowy
              </button>
            </li>
          </ul>
          
          {/* Zawartość zakładek */}
          {activeTab === 'overview' && (
            <>
              {/* KPI Cards */}
              <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="text-muted small mb-1">Wartość magazynu</p>
                          <h4 className="mb-0">
                            {stats.totalValue.toLocaleString('pl-PL', {
                              style: 'currency',
                              currency: 'PLN',
                              maximumFractionDigits: 0
                            })}
                          </h4>
                        </div>
                        <div className="bg-primary-subtle rounded p-2">
                          <i className="ri-money-dollar-circle-line text-primary fs-4"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-6 col-md-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="text-muted small mb-1">Pozycje magazynowe</p>
                          <h4 className="mb-0">{stats.totalItems}</h4>
                        </div>
                        <div className="bg-info-subtle rounded p-2">
                          <i className="ri-stack-line text-info fs-4"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-6 col-md-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="text-muted small mb-1">Krytyczne braki</p>
                          <h4 className="mb-0 text-danger">{stats.criticalCount}</h4>
                        </div>
                        <div className="bg-danger-subtle rounded p-2">
                          <i className="ri-error-warning-line text-danger fs-4"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-6 col-md-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="text-muted small mb-1">Niskie stany</p>
                          <h4 className="mb-0 text-warning">{stats.lowCount}</h4>
                        </div>
                        <div className="bg-warning-subtle rounded p-2">
                          <i className="ri-alert-line text-warning fs-4"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Wykresy i podsumowania */}
              <div className="row g-3">
                <div className="col-12 col-xl-8">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Rozkład wartości magazynu</h6>
                    </div>
                    <div className="card-body">
                      <div className="bg-light rounded" style={{ height: '300px' }}>
                        {/* Tu będzie wykres */}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-12 col-xl-4">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Podział ABC</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Klasa A</span>
                          <span className="badge bg-success">{stats.byAbcClass.A} pozycji</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div className="progress-bar bg-success" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Klasa B</span>
                          <span className="badge bg-warning">{stats.byAbcClass.B} pozycji</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div className="progress-bar bg-warning" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Klasa C</span>
                          <span className="badge bg-danger">{stats.byAbcClass.C} pozycji</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div className="progress-bar bg-danger" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'materials' && (
            <>
              {/* Filtry i wyszukiwanie */}
              <div className="card mb-3">
                <div className="card-body">
                  {/* Pasek wyszukiwania i filtry */}
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="ri-search-line"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Szukaj po kodzie, nazwie lub dostawcy..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="col-6 col-md-2">
                      <select
                        className="form-select"
                        value={selectedSupplier}
                        onChange={(e) => setSelectedSupplier(e.target.value)}
                      >
                        <option value="">Wszyscy dostawcy</option>
                        {suppliers.map(supplier => (
                          <option key={supplier} value={supplier}>{supplier}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-6 col-md-2">
                      <select
                        className="form-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as any)}
                      >
                        <option value="all">Wszystkie stany</option>
                        <option value="critical">Krytyczne</option>
                        <option value="low">Niskie</option>
                        <option value="normal">W normie</option>
                        <option value="excess">Nadmiar</option>
                      </select>
                    </div>
                    
                    <div className="col-6 col-md-2">
                      <select
                        className="form-select"
                        value={selectedAbcClass}
                        onChange={(e) => setSelectedAbcClass(e.target.value as any)}
                      >
                        <option value="all">Wszystkie klasy</option>
                        <option value="A">Klasa A</option>
                        <option value="B">Klasa B</option>
                        <option value="C">Klasa C</option>
                      </select>
                    </div>
                    
                    <div className="col-6 col-md-2">
                      <div className="btn-group w-100">
                        <button
                          className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setViewMode('grid')}
                          title="Widok kafelkowy"
                        >
                          <i className="ri-grid-line"></i>
                        </button>
                        <button
                          className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setViewMode('list')}
                          title="Widok listy"
                        >
                          <i className="ri-list-check"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tagi filtrujące */}
                  <TagFilter
                    materials={materials}
                    activeTags={activeTags}
                    onTagToggle={handleTagToggle}
                    onClearAll={() => setActiveTags([])}
                  />
                </div>
              </div>
              
              {/* Informacja o wynikach */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted mb-0">
                  Znaleziono <strong>{sortedMaterials.length}</strong> z {materials.length} materiałów
                </p>
                
                {viewMode === 'list' && (
                  <div className="d-flex gap-2">
                    <small className="text-muted">Sortuj po:</small>
                    <div className="btn-group btn-group-sm">
                      <button
                        className={`btn ${sortField === 'name' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => handleSort('name')}
                      >
                        Nazwa {sortField === 'name' && (
                          <i className={`ri-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-s-line ms-1`}></i>
                        )}
                      </button>
                      <button
                        className={`btn ${sortField === 'stock' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => handleSort('stock')}
                      >
                        Stan {sortField === 'stock' && (
                          <i className={`ri-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-s-line ms-1`}></i>
                        )}
                      </button>
                      <button
                        className={`btn ${sortField === 'value' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => handleSort('value')}
                      >
                        Wartość {sortField === 'value' && (
                          <i className={`ri-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-s-line ms-1`}></i>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Lista/Siatka materiałów */}
              {viewMode === 'grid' ? (
                <div className="row g-3">
                  {sortedMaterials.map(material => (
                    <div key={material.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                      <MaterialCard
                        material={material}
                        onSelect={handleMaterialSelect}
                        onQuickOrder={handleQuickOrder}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Kod</th>
                          <th>Nazwa</th>
                          <th>Kategoria</th>
                          <th>Stan</th>
                          <th>Status</th>
                          <th>Dostawca</th>
                          <th>Wartość</th>
                          <th>Akcje</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedMaterials.map(material => {
                          const stockRatio = material.stock / material.minStock
                          const stockPercentage = Math.min(100, Math.round(stockRatio * 100))
                          
                          return (
                            <tr 
                              key={material.id}
                              className="cursor-pointer"
                              onClick={() => handleMaterialSelect(material)}
                            >
                              <td>
                                <code>{material.code}</code>
                              </td>
                              <td>
                                <div>
                                  <div className="fw-medium">{material.name}</div>
                                  <small className="text-muted">
                                    <i className="ri-map-pin-line me-1"></i>
                                    {material.location || 'Brak lokalizacji'}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <small>{material.category.join(' > ')}</small>
                              </td>
                              <td>
                                <div>
                                  <div className="small mb-1">
                                    {material.stock} / {material.minStock} {material.unit}
                                  </div>
                                  <div className="progress" style={{ height: '6px' }}>
                                    <div 
                                      className={`progress-bar ${
                                        stockRatio < 0.5 ? 'bg-danger' : 
                                        stockRatio < 1 ? 'bg-warning' : 
                                        'bg-success'
                                      }`}
                                      style={{ width: `${stockPercentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${
                                  stockRatio < 0.5 ? 'bg-danger' : 
                                  stockRatio < 1 ? 'bg-warning' : 
                                  'bg-success'
                                }`}>
                                  {stockRatio < 0.5 ? 'Krytyczny' : 
                                   stockRatio < 1 ? 'Niski' : 
                                   'OK'}
                                </span>
                              </td>
                              <td>{material.supplier}</td>
                              <td className="fw-medium">
                                {(material.stock * material.price).toLocaleString('pl-PL', {
                                  style: 'currency',
                                  currency: 'PLN',
                                  maximumFractionDigits: 0
                                })}
                              </td>
                              <td>
                                {stockRatio < 1 && (
                                  <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleQuickOrder(material)
                                    }}
                                  >
                                    <i className="ri-shopping-cart-2-line"></i>
                                  </button>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'critical' && (
            <CriticalStockPanel
              materials={materials}
              onMaterialSelect={handleMaterialSelect}
              onQuickOrder={handleQuickOrder}
            />
          )}
          
          {activeTab === 'movement' && (
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">Historia ruchów magazynowych</h6>
              </div>
              <div className="card-body">
                <p className="text-muted">Funkcjonalność w przygotowaniu...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Panel szczegółów */}
      <MaterialDetailsPanel
        material={selectedMaterial}
        isOpen={detailsPanelOpen}
        onClose={() => setDetailsPanelOpen(false)}
        onOrder={handleQuickOrder}
      />
    </div>
  )
}