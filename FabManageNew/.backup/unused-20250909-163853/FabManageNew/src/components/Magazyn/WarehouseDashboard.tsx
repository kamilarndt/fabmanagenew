import { useMemo } from 'react'

import { calculateMaterialStats } from '../../data/materialsMockData'
import { useMaterialsStore } from '../../stores/materialsStore'

interface AlertItem {
    id: string
    type: 'critical' | 'warning' | 'info'
    title: string
    description: string
    materialsCount?: number
    action?: {
        label: string
        onClick: () => void
    }
}

interface RecentOperation {
    id: string
    type: 'IN' | 'OUT' | 'TRANSFER'
    documentNumber: string
    materialName: string
    quantity: number
    unit: string
    timestamp: Date
    user: string
}

interface WarehouseDashboardProps {
    onNavigateToMaterials?: () => void
    onNavigateToCritical?: () => void
}

export default function WarehouseDashboard({
    onNavigateToMaterials,
    onNavigateToCritical
}: WarehouseDashboardProps) {
    const materials = useMaterialsStore(state => state.materials)
    const syncFromBackend = useMaterialsStore(state => state.syncFromBackend)
    // refresh when dashboard mounts
    // eslint-disable-next-line react-hooks/rules-of-hooks
    require('react').useEffect(() => { syncFromBackend() }, [])

    // Calculate comprehensive statistics
    const stats = useMemo(() => calculateMaterialStats(materials as any), [materials])

    // Enhanced statistics
    const enhancedStats = useMemo(() => {
        const totalValue = materials.reduce((sum, m: any) => sum + (m.stock * (m.price || 0)), 0)
        const criticalMaterials = materials.filter(m => m.stock < m.minStock * 0.5)
        const lowStockMaterials = materials.filter(m => m.stock < m.minStock && m.stock >= m.minStock * 0.5)
        const normalMaterials = materials.filter(m => m.stock >= m.minStock && m.stock <= m.maxStock)
        const excessMaterials = materials.filter(m => m.stock > m.maxStock)

        // Calculate growth (mock data)
        const valueGrowth = 5.2 // %
        const newItemsThisMonth = 12
        const turnoverRate = 3.4
        const fillRate = 92 // %

        return {
            totalValue,
            valueGrowth,
            totalItems: materials.length,
            newItemsThisMonth,
            criticalCount: criticalMaterials.length,
            lowCount: lowStockMaterials.length,
            normalCount: normalMaterials.length,
            excessCount: excessMaterials.length,
            turnoverRate,
            fillRate,
            criticalMaterials,
            lowStockMaterials,
            excessMaterials
        }
    }, [materials])

    // Mock recent operations
    const recentOperations: RecentOperation[] = [
        {
            id: '1',
            type: 'IN',
            documentNumber: 'PZ-2025/001',
            materialName: 'MDF 18mm Standard',
            quantity: 50,
            unit: 'arkusz',
            timestamp: new Date('2025-01-15T14:23:00'),
            user: 'Jan Kowalski'
        },
        {
            id: '2',
            type: 'OUT',
            documentNumber: 'WZ-2025/004',
            materialName: 'Plexi 3mm bezbarwna',
            quantity: 12,
            unit: 'arkusz',
            timestamp: new Date('2025-01-15T13:15:00'),
            user: 'Anna Nowak'
        },
        {
            id: '3',
            type: 'IN',
            documentNumber: 'PZ-2025/002',
            materialName: 'Dibond 3mm biały',
            quantity: 25,
            unit: 'arkusz',
            timestamp: new Date('2025-01-15T11:45:00'),
            user: 'Piotr Wiśniewski'
        },
        {
            id: '4',
            type: 'OUT',
            documentNumber: 'WZ-2025/003',
            materialName: 'Taśma LED RGB',
            quantity: 8,
            unit: 'rolka',
            timestamp: new Date('2025-01-15T10:30:00'),
            user: 'Maria Kowalczyk'
        }
    ]

    // Generate alerts
    const alerts: AlertItem[] = [
        ...(enhancedStats.criticalMaterials.length > 0 ? [{
            id: 'critical-stock',
            type: 'critical' as const,
            title: `${enhancedStats.criticalMaterials.length} materiały w stanie krytycznym`,
            description: enhancedStats.criticalMaterials.slice(0, 2).map(m => m.name).join(', ') +
                (enhancedStats.criticalMaterials.length > 2 ? ` i ${enhancedStats.criticalMaterials.length - 2} więcej` : ''),
            materialsCount: enhancedStats.criticalMaterials.length,
            action: {
                label: 'Zobacz szczegóły',
                onClick: () => onNavigateToCritical?.()
            }
        }] : []),
        ...(enhancedStats.lowStockMaterials.length > 0 ? [{
            id: 'low-stock',
            type: 'warning' as const,
            title: `${enhancedStats.lowStockMaterials.length} materiały o niskim stanie`,
            description: 'Materiały poniżej poziomu minimalnego wymagają uwagi',
            materialsCount: enhancedStats.lowStockMaterials.length,
            action: {
                label: 'Przejdź do listy',
                onClick: () => onNavigateToMaterials?.()
            }
        }] : []),
        ...(enhancedStats.excessMaterials.length > 0 ? [{
            id: 'excess-stock',
            type: 'info' as const,
            title: `${enhancedStats.excessMaterials.length} materiały w nadmiarze`,
            description: 'Rozważ optymalizację zamówień lub wykorzystanie zapasów',
            materialsCount: enhancedStats.excessMaterials.length
        }] : []),
        {
            id: 'delivery-delay',
            type: 'warning' as const,
            title: 'Opóźnienie dostawy',
            description: 'Dibond 3mm od Aluprint - spóźnienie 3 dni',
            action: {
                label: 'Skontaktuj się z dostawcą',
                onClick: () => console.log('Contact supplier')
            }
        }
    ]

    return (
        <div className="warehouse-dashboard">
            {/* KPI Cards */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Wartość magazynu</p>
                                    <h4 className="mb-0">
                                        {enhancedStats.totalValue.toLocaleString('pl-PL', {
                                            style: 'currency',
                                            currency: 'PLN',
                                            maximumFractionDigits: 0
                                        })}
                                    </h4>
                                    <div className="text-success small">
                                        <i className="ri-arrow-up-s-line"></i>
                                        +{enhancedStats.valueGrowth}%
                                    </div>
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
                                    <h4 className="mb-0">{enhancedStats.totalItems}</h4>
                                    <div className="text-info small">
                                        <i className="ri-add-line"></i>
                                        +{enhancedStats.newItemsThisMonth} nowe
                                    </div>
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
                                    <h4 className="mb-0 text-danger">{enhancedStats.criticalCount}</h4>
                                    <div className="text-warning small">
                                        <i className="ri-alert-line"></i>
                                        +{enhancedStats.lowCount} niskie
                                    </div>
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
                                    <p className="text-muted small mb-1">Fill Rate</p>
                                    <h4 className="mb-0">{enhancedStats.fillRate}%</h4>
                                    <div className="text-muted small">
                                        <i className="ri-refresh-line"></i>
                                        Rotacja: {enhancedStats.turnoverRate}x
                                    </div>
                                </div>
                                <div className="bg-success-subtle rounded p-2">
                                    <i className="ri-pie-chart-2-line text-success fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3">
                {/* Charts and Analytics */}
                <div className="col-12 col-xl-8">
                    <div className="card h-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">
                                <i className="ri-bar-chart-2-line me-2"></i>
                                Analiza rotacji ABC
                            </h6>
                            <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-secondary active">30 dni</button>
                                <button className="btn btn-outline-secondary">3 miesiące</button>
                                <button className="btn btn-outline-secondary">12 miesięcy</button>
                            </div>
                        </div>
                        <div className="card-body">
                            {/* ABC Analysis Chart */}
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-medium">Klasa A (wysokoobrotowe)</span>
                                            <span className="badge bg-success">{stats.byAbcClass.A} pozycji</span>
                                        </div>
                                        <div className="progress" style={{ height: '12px' }}>
                                            <div
                                                className="progress-bar bg-success"
                                                style={{ width: '60%' }}
                                                title="60% wartości"
                                            ></div>
                                        </div>
                                        <div className="text-muted small mt-1">60% wartości magazynu</div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-medium">Klasa B (średnioobrotowe)</span>
                                            <span className="badge bg-warning">{stats.byAbcClass.B} pozycji</span>
                                        </div>
                                        <div className="progress" style={{ height: '12px' }}>
                                            <div
                                                className="progress-bar bg-warning"
                                                style={{ width: '30%' }}
                                                title="30% wartości"
                                            ></div>
                                        </div>
                                        <div className="text-muted small mt-1">30% wartości magazynu</div>
                                    </div>

                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-medium">Klasa C (niskoobrotowe)</span>
                                            <span className="badge bg-danger">{stats.byAbcClass.C} pozycji</span>
                                        </div>
                                        <div className="progress" style={{ height: '12px' }}>
                                            <div
                                                className="progress-bar bg-danger"
                                                style={{ width: '10%' }}
                                                title="10% wartości"
                                            ></div>
                                        </div>
                                        <div className="text-muted small mt-1">10% wartości magazynu</div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    {/* Pie chart placeholder */}
                                    <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{ height: '200px' }}>
                                        <div className="text-center text-muted">
                                            <i className="ri-pie-chart-2-line fs-1 d-block mb-2"></i>
                                            <div>Wykres kołowy ABC</div>
                                            <small>Graficzna reprezentacja rozkładu</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stock Status Overview */}
                            <div className="row g-2">
                                <div className="col-3">
                                    <div className="text-center p-2 bg-success-subtle rounded">
                                        <div className="fw-bold text-success">{enhancedStats.normalCount}</div>
                                        <div className="small text-success">W normie</div>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="text-center p-2 bg-warning-subtle rounded">
                                        <div className="fw-bold text-warning">{enhancedStats.lowCount}</div>
                                        <div className="small text-warning">Niskie</div>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="text-center p-2 bg-danger-subtle rounded">
                                        <div className="fw-bold text-danger">{enhancedStats.criticalCount}</div>
                                        <div className="small text-danger">Krytyczne</div>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="text-center p-2 bg-info-subtle rounded">
                                        <div className="fw-bold text-info">{enhancedStats.excessCount}</div>
                                        <div className="small text-info">Nadmiar</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Operations */}
                <div className="col-12 col-xl-4">
                    <div className="card h-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">
                                <i className="ri-history-line me-2"></i>
                                Ostatnie operacje
                            </h6>
                            <button className="btn btn-sm btn-outline-secondary">
                                <i className="ri-external-link-line"></i>
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="operations-timeline">
                                {recentOperations.map((operation) => (
                                    <div key={operation.id} className="d-flex mb-3">
                                        <div className={`timeline-indicator rounded-circle me-3 d-flex align-items-center justify-content-center ${operation.type === 'IN' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                                            }`} style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                                            <i className={`ri-${operation.type === 'IN' ? 'download' : 'upload'}-2-line small`}></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <div className="fw-medium small">{operation.documentNumber}</div>
                                                    <div className="text-muted x-small">{operation.materialName}</div>
                                                    <div className={`small ${operation.type === 'IN' ? 'text-success' : 'text-danger'}`}>
                                                        {operation.type === 'IN' ? '+' : '-'}{operation.quantity} {operation.unit}
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <div className="text-muted x-small">
                                                        {operation.timestamp.toLocaleTimeString('pl-PL', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alerts and Notifications */}
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">
                                <i className="ri-notification-2-line me-2"></i>
                                Alerty wymagające działania
                            </h6>
                            <span className="badge bg-danger">{alerts.filter(a => a.type === 'critical').length}</span>
                        </div>
                        <div className="card-body">
                            {alerts.length > 0 ? (
                                <div className="row g-3">
                                    {alerts.map(alert => (
                                        <div key={alert.id} className="col-12 col-md-6 col-xl-4">
                                            <div className={`alert alert-${alert.type === 'critical' ? 'danger' :
                                                alert.type === 'warning' ? 'warning' : 'info'
                                                } mb-0 h-100 d-flex flex-column`}>
                                                <div className="d-flex align-items-start">
                                                    <i className={`ri-${alert.type === 'critical' ? 'error-warning' :
                                                        alert.type === 'warning' ? 'alert' : 'information'
                                                        }-line me-2 mt-1`}></i>
                                                    <div className="flex-grow-1">
                                                        <div className="fw-medium">{alert.title}</div>
                                                        <div className="small">{alert.description}</div>
                                                        {alert.action && (
                                                            <button
                                                                className={`btn btn-sm btn-${alert.type === 'critical' ? 'danger' :
                                                                    alert.type === 'warning' ? 'warning' : 'info'
                                                                    } mt-2`}
                                                                onClick={alert.action.onClick}
                                                            >
                                                                {alert.action.label}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted py-3">
                                    <i className="ri-check-double-line fs-1 d-block mb-2"></i>
                                    <div>Brak alertów</div>
                                    <small>Wszystkie systemy działają prawidłowo</small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
