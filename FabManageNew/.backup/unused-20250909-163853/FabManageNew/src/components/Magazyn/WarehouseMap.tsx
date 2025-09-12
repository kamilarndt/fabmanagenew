import { useState } from 'react'
import type { MaterialData } from '../../data/materialsMockData'
import { useMaterialsStore } from '../../stores/materialsStore'

interface WarehouseZone {
    id: string
    name: string
    type: 'plates' | 'plexi' | 'composites' | 'electrical'
    color: string
    locations: WarehouseLocation[]
}

interface WarehouseLocation {
    id: string
    code: string
    zone: string
    capacity: number
    occupied: number
    materials: MaterialData[]
    row: number
    column: number
}

interface WarehouseMapProps {
    onLocationSelect?: (location: WarehouseLocation) => void
    selectedLocation?: string
}

// Mock warehouse layout data
const warehouseZones: WarehouseZone[] = [
    {
        id: 'zone-a',
        name: 'Strefa A - Płyty meblowe',
        type: 'plates',
        color: '#28a745',
        locations: [
            { id: 'A1-01', code: 'A1-01', zone: 'A', capacity: 100, occupied: 42, materials: [], row: 1, column: 1 },
            { id: 'A1-02', code: 'A1-02', zone: 'A', capacity: 100, occupied: 8, materials: [], row: 1, column: 2 },
            { id: 'A1-03', code: 'A1-03', zone: 'A', capacity: 100, occupied: 5, materials: [], row: 1, column: 3 },
            { id: 'A1-04', code: 'A1-04', zone: 'A', capacity: 100, occupied: 0, materials: [], row: 1, column: 4 },
            { id: 'A2-01', code: 'A2-01', zone: 'A', capacity: 100, occupied: 25, materials: [], row: 2, column: 1 },
            { id: 'A2-02', code: 'A2-02', zone: 'A', capacity: 100, occupied: 18, materials: [], row: 2, column: 2 },
            { id: 'A2-03', code: 'A2-03', zone: 'A', capacity: 100, occupied: 0, materials: [], row: 2, column: 3 },
            { id: 'A2-04', code: 'A2-04', zone: 'A', capacity: 100, occupied: 0, materials: [], row: 2, column: 4 },
        ]
    },
    {
        id: 'zone-b',
        name: 'Strefa B - Plexi/Akryl',
        type: 'plexi',
        color: '#007bff',
        locations: [
            { id: 'B1-01', code: 'B1-01', zone: 'B', capacity: 80, occupied: 35, materials: [], row: 1, column: 1 },
            { id: 'B1-02', code: 'B1-02', zone: 'B', capacity: 80, occupied: 12, materials: [], row: 1, column: 2 },
            { id: 'B1-03', code: 'B1-03', zone: 'B', capacity: 80, occupied: 0, materials: [], row: 1, column: 3 },
            { id: 'B2-01', code: 'B2-01', zone: 'B', capacity: 80, occupied: 0, materials: [], row: 2, column: 1 },
            { id: 'B2-02', code: 'B2-02', zone: 'B', capacity: 80, occupied: 0, materials: [], row: 2, column: 2 },
            { id: 'B2-03', code: 'B2-03', zone: 'B', capacity: 80, occupied: 0, materials: [], row: 2, column: 3 },
        ]
    },
    {
        id: 'zone-c',
        name: 'Strefa C - Kompozyty',
        type: 'composites',
        color: '#ffc107',
        locations: [
            { id: 'C1-01', code: 'C1-01', zone: 'C', capacity: 50, occupied: 22, materials: [], row: 1, column: 1 },
            { id: 'C1-02', code: 'C1-02', zone: 'C', capacity: 50, occupied: 0, materials: [], row: 1, column: 2 },
            { id: 'C2-01', code: 'C2-01', zone: 'C', capacity: 50, occupied: 0, materials: [], row: 2, column: 1 },
            { id: 'C2-02', code: 'C2-02', zone: 'C', capacity: 50, occupied: 0, materials: [], row: 2, column: 2 },
        ]
    },
    {
        id: 'zone-d',
        name: 'Strefa D - Elektryka',
        type: 'electrical',
        color: '#dc3545',
        locations: [
            { id: 'D1-01', code: 'D1-01', zone: 'D', capacity: 200, occupied: 45, materials: [], row: 1, column: 1 },
            { id: 'D1-02', code: 'D1-02', zone: 'D', capacity: 200, occupied: 38, materials: [], row: 1, column: 2 },
            { id: 'D2-01', code: 'D2-01', zone: 'D', capacity: 200, occupied: 0, materials: [], row: 2, column: 1 },
            { id: 'D2-02', code: 'D2-02', zone: 'D', capacity: 200, occupied: 0, materials: [], row: 2, column: 2 },
        ]
    }
]

export default function WarehouseMap({ onLocationSelect, selectedLocation }: WarehouseMapProps) {
    const materials = useMaterialsStore(state => state.materials)
    const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview')


    // Populate locations with actual materials
    const populatedZones = warehouseZones.map(zone => ({
        ...zone,
        locations: zone.locations.map(location => {
            const locationMaterials = materials.filter(m => m.location === location.code)
            const actualOccupied = locationMaterials.reduce((sum, material) => sum + material.stock, 0)

            return {
                ...location,
                materials: locationMaterials,
                occupied: actualOccupied
            }
        })
    }))

    const getLocationStatus = (location: WarehouseLocation) => {
        const utilizationRate = location.occupied / location.capacity
        if (utilizationRate === 0) return { status: 'empty', color: '#e9ecef', textColor: '#6c757d' }
        if (utilizationRate < 0.5) return { status: 'low', color: '#d4edda', textColor: '#155724' }
        if (utilizationRate < 0.8) return { status: 'optimal', color: '#fff3cd', textColor: '#856404' }
        if (utilizationRate < 1) return { status: 'high', color: '#f8d7da', textColor: '#721c24' }
        return { status: 'full', color: '#d1ecf1', textColor: '#0c5460' }
    }

    const renderZoneGrid = (zone: WarehouseZone) => {
        const maxRow = Math.max(...zone.locations.map(l => l.row))
        const maxCol = Math.max(...zone.locations.map(l => l.column))

        const grid = []
        for (let row = 1; row <= maxRow; row++) {
            const rowLocations = []
            for (let col = 1; col <= maxCol; col++) {
                const location = zone.locations.find(l => l.row === row && l.column === col)
                if (location) {
                    const status = getLocationStatus(location)
                    const isSelected = selectedLocation === location.id
                    const isHovered = hoveredLocation === location.id

                    rowLocations.push(
                        <div
                            key={location.id}
                            className={`warehouse-location ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                            style={{
                                backgroundColor: status.color,
                                color: status.textColor,
                                border: isSelected ? '2px solid #007bff' : '1px solid #dee2e6',
                                borderRadius: '4px',
                                padding: '8px',
                                margin: '2px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                minHeight: '60px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                                position: 'relative'
                            }}
                            onClick={() => onLocationSelect?.(location)}
                            onMouseEnter={() => setHoveredLocation(location.id)}
                            onMouseLeave={() => setHoveredLocation(null)}
                            title={`${location.code} - ${location.occupied}/${location.capacity} (${Math.round((location.occupied / location.capacity) * 100)}%)`}
                        >
                            <div className="fw-bold small">{location.code}</div>
                            <div className="x-small">{location.occupied}/{location.capacity}</div>
                            {location.materials.length > 0 && (
                                <div className="x-small text-truncate">
                                    {location.materials.length} mat.
                                </div>
                            )}

                            {/* Indicator dots for utilization */}
                            <div className="position-absolute top-0 end-0 p-1">
                                <div
                                    className="rounded-circle"
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        backgroundColor: zone.color,
                                        opacity: Math.max(0.3, location.occupied / location.capacity)
                                    }}
                                ></div>
                            </div>
                        </div>
                    )
                } else {
                    rowLocations.push(
                        <div key={`empty-${row}-${col}`} style={{ minHeight: '60px', margin: '2px' }}></div>
                    )
                }
            }
            grid.push(
                <div key={row} className="d-flex justify-content-center">
                    {rowLocations}
                </div>
            )
        }

        return grid
    }

    const renderLocationDetails = (location: WarehouseLocation) => {
        const status = getLocationStatus(location)
        const utilizationRate = (location.occupied / location.capacity) * 100

        return (
            <div className="card">
                <div className="card-header">
                    <h6 className="mb-0">
                        <i className="ri-map-pin-line me-2"></i>
                        Szczegóły lokalizacji: {location.code}
                    </h6>
                </div>
                <div className="card-body">
                    <div className="row g-3 mb-3">
                        <div className="col-6">
                            <div className="text-muted small">Strefa</div>
                            <div className="fw-medium">{location.zone}</div>
                        </div>
                        <div className="col-6">
                            <div className="text-muted small">Pojemność</div>
                            <div className="fw-medium">{location.capacity} jednostek</div>
                        </div>
                        <div className="col-6">
                            <div className="text-muted small">Zajęte</div>
                            <div className="fw-medium">{location.occupied} jednostek</div>
                        </div>
                        <div className="col-6">
                            <div className="text-muted small">Wykorzystanie</div>
                            <div className="fw-medium">{utilizationRate.toFixed(1)}%</div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="small text-muted">Wykorzystanie przestrzeni</span>
                            <span className={`badge bg-${status.status === 'optimal' ? 'success' :
                                status.status === 'high' ? 'warning' :
                                    status.status === 'full' ? 'danger' : 'secondary'}`}>
                                {status.status === 'empty' ? 'Pusta' :
                                    status.status === 'low' ? 'Niska' :
                                        status.status === 'optimal' ? 'Optymalna' :
                                            status.status === 'high' ? 'Wysoka' : 'Przepełniona'}
                            </span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                            <div
                                className={`progress-bar bg-${status.status === 'optimal' ? 'success' :
                                    status.status === 'high' ? 'warning' :
                                        status.status === 'full' ? 'danger' : 'primary'}`}
                                style={{ width: `${Math.min(100, utilizationRate)}%` }}
                            ></div>
                        </div>
                    </div>

                    {location.materials.length > 0 && (
                        <div>
                            <div className="text-muted small mb-2">Materiały w lokalizacji:</div>
                            <div className="list-group list-group-flush">
                                {location.materials.map(material => (
                                    <div key={material.id} className="list-group-item px-0 py-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="fw-medium">{material.name}</div>
                                                <div className="text-muted small">{material.code}</div>
                                            </div>
                                            <div className="text-end">
                                                <div className="fw-medium">{material.stock} {material.unit}</div>
                                                <div className={`badge bg-${material.stock < material.minStock ? 'danger' : 'success'} small`}>
                                                    {material.stock < material.minStock ? 'Niski' : 'OK'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="warehouse-map">
            {/* Controls */}
            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-6">
                            <div className="d-flex gap-2 align-items-center">
                                <button
                                    className={`btn btn-sm ${viewMode === 'overview' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setViewMode('overview')}
                                >
                                    <i className="ri-layout-grid-line me-1"></i>
                                    Przegląd
                                </button>
                                <button
                                    className={`btn btn-sm ${viewMode === 'detailed' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setViewMode('detailed')}
                                >
                                    <i className="ri-zoom-in-line me-1"></i>
                                    Szczegóły
                                </button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex gap-2 align-items-center justify-content-end">
                                <button className="btn btn-sm btn-outline-secondary">
                                    <i className="ri-printer-line me-1"></i>
                                    Drukuj etykiety
                                </button>
                                <button className="btn btn-sm btn-outline-secondary">
                                    <i className="ri-refresh-line me-1"></i>
                                    Odśwież
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="card mb-3">
                <div className="card-body py-2">
                    <div className="d-flex gap-4 align-items-center small">
                        <span>Legenda:</span>
                        <div className="d-flex align-items-center gap-1">
                            <div className="rounded" style={{ width: '12px', height: '12px', backgroundColor: '#e9ecef' }}></div>
                            <span>Puste</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <div className="rounded" style={{ width: '12px', height: '12px', backgroundColor: '#d4edda' }}></div>
                            <span>Niska (0-50%)</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <div className="rounded" style={{ width: '12px', height: '12px', backgroundColor: '#fff3cd' }}></div>
                            <span>Optymalna (50-80%)</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <div className="rounded" style={{ width: '12px', height: '12px', backgroundColor: '#f8d7da' }}></div>
                            <span>Wysoka (80-100%)</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <div className="rounded" style={{ width: '12px', height: '12px', backgroundColor: '#d1ecf1' }}></div>
                            <span>Przepełniona (100%+)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Warehouse Layout */}
            <div className="row g-3">
                {populatedZones.map(zone => (
                    <div key={zone.id} className="col-12 col-xl-6">
                        <div className="card h-100">
                            <div className="card-header">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">
                                        <span
                                            className="me-2 rounded-circle d-inline-block"
                                            style={{
                                                width: '12px',
                                                height: '12px',
                                                backgroundColor: zone.color
                                            }}
                                        ></span>
                                        {zone.name}
                                    </h6>
                                    <span className="badge bg-secondary">
                                        {zone.locations.reduce((sum, loc) => sum + loc.occupied, 0)} / {' '}
                                        {zone.locations.reduce((sum, loc) => sum + loc.capacity, 0)}
                                    </span>
                                </div>
                            </div>
                            <div className="card-body">
                                {renderZoneGrid(zone)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Location Details Panel */}
            {selectedLocation && (
                <div className="mt-3">
                    {renderLocationDetails(
                        populatedZones
                            .flatMap(zone => zone.locations)
                            .find(loc => loc.id === selectedLocation)!
                    )}
                </div>
            )}
        </div>
    )
}
