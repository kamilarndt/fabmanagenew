import { useState, useMemo, useCallback, useEffect } from 'react'
import { filterMaterials, calculateMaterialStats } from '../data/materialsMockData'
import type { MaterialData } from '../data/materialsMockData'
import { useMaterialsStore } from '../stores/materialsStore'
import '../styles/warehouse.css'
import CategoryTree from '../components/Magazyn/CategoryTree'
import MaterialCard from '../components/Magazyn/MaterialCard'

import MaterialDetailsPanel from '../components/Magazyn/MaterialDetailsPanel'
import OperationForm from '../components/Magazyn/OperationForm'
import type { ViewMode, SortField, SortOrder } from '../types/magazyn.types'
import { showToast } from '../lib/toast'

export default function MagazynNew() {
    // Stan główny
    const materials = useMaterialsStore(state => state.materials)
    const syncFromBackend = useMaterialsStore(state => state.syncFromBackend)
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialData | null>(null)
    const [detailsPanelOpen, setDetailsPanelOpen] = useState(false)

    // Filtry i widok
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedSupplier, setSelectedSupplier] = useState<string>('')
    const [selectedStatus, setSelectedStatus] = useState<'all' | 'critical' | 'low' | 'normal' | 'excess'>('all')
    const [selectedAbcClass, setSelectedAbcClass] = useState<'all' | 'A' | 'B' | 'C'>('all')

    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [sortField, setSortField] = useState<SortField>('name')
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Operation form state
    const [operationFormOpen, setOperationFormOpen] = useState(false)
    const [operationType, setOperationType] = useState<'receive' | 'issue' | 'transfer' | 'adjust'>('receive')

    // Stan synchronizacji
    const [isSyncing, setIsSyncing] = useState(false)

    // Automatyczne ładowanie materiałów z backendu przy starcie
    useEffect(() => {
        if (materials.length === 0) {
            syncFromBackend()
        }
    }, [materials.length, syncFromBackend])

    // Funkcja synchronizacji z backendem
    const handleSyncFromBackend = async () => {
        setIsSyncing(true)
        try {
            await syncFromBackend()
            showToast('Materiały zostały zsynchronizowane z backendem', 'success')
        } catch {
            showToast('Błąd synchronizacji materiałów', 'danger')
        } finally {
            setIsSyncing(false)
        }
    }

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
            let aVal: number | string, bVal: number | string

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

    const toggleSelect = useCallback((id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }, [])

    const toggleSelectAll = useCallback((ids: string[]) => {
        const allSelected = ids.every(id => selectedIds.includes(id))
        setSelectedIds(allSelected ? selectedIds.filter(id => !ids.includes(id)) : Array.from(new Set([...selectedIds, ...ids])))
    }, [selectedIds])

    const handleOpenOperationForm = useCallback((type: 'receive' | 'issue') => {
        setOperationType(type)
        setOperationFormOpen(true)
    }, [])

    const handleOperationSubmit = useCallback((operation: { type: 'receive' | 'issue' | 'transfer' | 'adjust';[key: string]: unknown }) => {
        setOperationFormOpen(false)
        showToast(`${operation.type === 'receive' ? 'Przyjęcie' : 'Wydanie'} zostało zapisane`, 'success')
    }, [])

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
            <div className="row g-0">
                {/* Lewa kolumna - Sidebar z nawigacją kategorii (25%) */}
                <div className="col-12 col-lg-3">
                    <div className="sidebar-navigation bg-light border-end d-none d-lg-block" style={{ minHeight: '100vh' }}>
                        <div className="p-3">
                            <CategoryTree
                                materials={materials}
                                selectedCategories={selectedCategories}
                                onCategorySelect={setSelectedCategories}
                            />
                        </div>
                    </div>

                    {/* Mobile category toggle */}
                    <div className="d-lg-none mb-3">
                        <button
                            className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-between"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#mobileCategoryTree"
                        >
                            <span>
                                <i className="ri-folder-line me-2"></i>
                                {selectedCategories.length > 0
                                    ? selectedCategories.join(' > ')
                                    : 'Wszystkie kategorie'
                                }
                            </span>
                            <i className="ri-arrow-down-s-line"></i>
                        </button>
                        <div className="collapse mt-2" id="mobileCategoryTree">
                            <div className="card">
                                <div className="card-body">
                                    <CategoryTree
                                        materials={materials}
                                        selectedCategories={selectedCategories}
                                        onCategorySelect={setSelectedCategories}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prawa kolumna - Główny obszar roboczy (75%) */}
                <div className="col-12 col-lg-9">
                    <div className="main-workspace p-4">
                        {/* Nagłówek obszaru roboczego */}
                        <div className="workspace-header mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h4 className="mb-1">FabrykaStock - Magazyn</h4>
                                    <p className="text-muted mb-0">
                                        {selectedCategories.length > 0
                                            ? `Kategoria: ${selectedCategories.join(' > ')}`
                                            : 'Wszystkie materiały'
                                        }
                                    </p>
                                </div>
                                <div className="btn-group">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={handleSyncFromBackend}
                                        disabled={isSyncing}
                                    >
                                        <i className="ri-refresh-line me-2"></i>
                                        {isSyncing ? 'Synchronizacja...' : 'Sync z Rhino'}
                                    </button>
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={() => handleOpenOperationForm('receive')}
                                    >
                                        <i className="ri-add-line me-2"></i>
                                        Dodaj Nowy Materiał
                                    </button>
                                </div>
                            </div>

                            {/* Główna wyszukiwarka */}
                            <div className="search-section mb-3">
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-white">
                                        <i className="ri-search-line"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder={`Wyszukaj w '${selectedCategories.length > 0
                                            ? selectedCategories.join(' > ')
                                            : 'Wszystkie materiały'}'...`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button className="btn btn-outline-secondary" type="button">
                                        <i className="ri-barcode-line me-1"></i>
                                        Skanuj kod
                                    </button>
                                </div>
                            </div>

                            {/* Szybkie akcje operacyjne */}
                            <div className="quick-actions d-flex gap-2 mb-3">
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleOpenOperationForm('receive')}
                                >
                                    <i className="ri-download-2-line me-1"></i>
                                    Przyjęcie towaru
                                </button>
                                <button
                                    className="btn btn-warning"
                                    onClick={() => handleOpenOperationForm('issue')}
                                >
                                    <i className="ri-upload-2-line me-1"></i>
                                    Wydanie towaru
                                </button>
                                <button className="btn btn-outline-secondary">
                                    <i className="ri-file-excel-2-line me-1"></i>
                                    Eksport
                                </button>
                                <button className="btn btn-outline-secondary">
                                    <i className="ri-printer-line me-1"></i>
                                    Etykiety
                                </button>
                            </div>
                        </div>

                        {/* Status i statystyki */}
                        <div className="stats-bar d-flex justify-content-between align-items-center mb-4">
                            <div className="results-info">
                                <span className="text-muted">
                                    Znaleziono <strong>{filteredMaterials.length}</strong> z {materials.length} materiałów
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

                            <div className="view-controls d-flex gap-2 align-items-center">
                                <small className="text-muted me-2">Widok:</small>
                                <div className="btn-group btn-group-sm">
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
                                        title="Widok tabeli"
                                    >
                                        <i className="ri-list-check"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Dodatkowe filtry */}
                        <div className="filters-section mb-4">
                            <div className="row g-3">
                                <div className="col-md-3">
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

                                <div className="col-md-3">
                                    <select
                                        className="form-select"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
                                    >
                                        <option value="all">Wszystkie stany</option>
                                        <option value="critical">Krytyczne</option>
                                        <option value="low">Niskie</option>
                                        <option value="normal">W normie</option>
                                        <option value="excess">Nadmiar</option>
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <select
                                        className="form-select"
                                        value={selectedAbcClass}
                                        onChange={(e) => setSelectedAbcClass(e.target.value as typeof selectedAbcClass)}
                                    >
                                        <option value="all">Wszystkie klasy ABC</option>
                                        <option value="A">Klasa A</option>
                                        <option value="B">Klasa B</option>
                                        <option value="C">Klasa C</option>
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    {viewMode === 'list' && (
                                        <div className="btn-group w-100">
                                            <button
                                                className={`btn btn-sm ${sortField === 'name' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                onClick={() => handleSort('name')}
                                            >
                                                Nazwa {sortField === 'name' && (
                                                    <i className={`ri-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-s-line ms-1`}></i>
                                                )}
                                            </button>
                                            <button
                                                className={`btn btn-sm ${sortField === 'stock' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                onClick={() => handleSort('stock')}
                                            >
                                                Stan {sortField === 'stock' && (
                                                    <i className={`ri-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-s-line ms-1`}></i>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Główna lista materiałów */}
                        <div className="materials-content">
                            {/* Lista/Siatka materiałów */}
                            {viewMode === 'grid' ? (
                                <div className="row g-3">
                                    {sortedMaterials.map(material => (
                                        <div key={material.id} className="col-12 col-md-6 col-xl-4">
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
                                                    <th style={{ width: 36 }}>
                                                        <input
                                                            type="checkbox"
                                                            aria-label="Zaznacz wszystko"
                                                            checked={sortedMaterials.length > 0 && sortedMaterials.every(m => selectedIds.includes(m.id))}
                                                            onChange={() => toggleSelectAll(sortedMaterials.map(m => m.id))}
                                                        />
                                                    </th>
                                                    <th>KOD</th>
                                                    <th>NAZWA MATERIAŁU</th>
                                                    <th>DOSTĘPNE</th>
                                                    <th>STATUS</th>
                                                    <th>DOSTAWCA</th>
                                                    <th>WARTOŚĆ</th>
                                                    <th>AKCJE</th>
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
                                                            <td onClick={e => e.stopPropagation()}>
                                                                <input
                                                                    type="checkbox"
                                                                    aria-label={`Zaznacz ${material.name}`}
                                                                    checked={selectedIds.includes(material.id)}
                                                                    onChange={() => toggleSelect(material.id)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <code className="fw-bold">{material.code}</code>
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
                                                                <div>
                                                                    <div className="fw-bold">
                                                                        {material.stock} {material.unit}
                                                                    </div>
                                                                    <div className="progress" style={{ height: '4px' }}>
                                                                        <div
                                                                            className={`progress-bar ${stockRatio < 0.5 ? 'bg-danger' :
                                                                                stockRatio < 1 ? 'bg-warning' :
                                                                                    'bg-success'
                                                                                }`}
                                                                            style={{ width: `${stockPercentage}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${stockRatio < 0.5 ? 'bg-danger' :
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
                                                                        aria-label={`Szybkie zamówienie: ${material.name}`}
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

                            {/* Brak wyników */}
                            {sortedMaterials.length === 0 && (
                                <div className="text-center py-5">
                                    <i className="ri-inbox-line display-4 text-muted d-block mb-3"></i>
                                    <h5 className="text-muted">Brak materiałów</h5>
                                    <p className="text-muted">
                                        Nie znaleziono materiałów odpowiadających kryteriom wyszukiwania.
                                    </p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setSearchQuery('')
                                            setSelectedCategories([])
                                            setSelectedSupplier('')
                                            setSelectedStatus('all')
                                            setSelectedAbcClass('all')
                                        }}
                                    >
                                        Wyczyść filtry
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel szczegółów */}
            <MaterialDetailsPanel
                material={selectedMaterial}
                isOpen={detailsPanelOpen}
                onClose={() => setDetailsPanelOpen(false)}
                onOrder={handleQuickOrder}
            />

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