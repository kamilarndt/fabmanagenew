import { useEffect, useState } from 'react'

type Demand = {
    id: string
    materialId: string
    name: string
    requiredQty: number
    createdAt: string
    status: string
    projectId?: string | null
    tileId?: string | null
}

// Mockowe dane zaopatrzeń
const mockDemands: Demand[] = [
    {
        id: "DEM_001",
        materialId: "MAT_R001",
        name: "MDF 6mm Standard",
        requiredQty: 15,
        createdAt: "2025-01-15T10:30:00Z",
        status: "pending",
        projectId: "PROJ_001",
        tileId: "TILE_A1"
    },
    {
        id: "DEM_002",
        materialId: "MAT_R004",
        name: "MDF 8mm Standard",
        requiredQty: 8,
        createdAt: "2025-01-14T14:20:00Z",
        status: "approved",
        projectId: "PROJ_002",
        tileId: "TILE_B3"
    },
    {
        id: "DEM_003",
        materialId: "MAT_R007",
        name: "Sklejka 12mm",
        requiredQty: 12,
        createdAt: "2025-01-13T09:15:00Z",
        status: "ordered",
        projectId: "PROJ_001",
        tileId: "TILE_C2"
    }
]

export default function Demands() {
    const [items, setItems] = useState<Demand[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const load = async () => {
        setLoading(true)
        setError(null)
        try {
            // Symulacja opóźnienia sieciowego
            await new Promise(resolve => setTimeout(resolve, 500))

            // Używamy mockowych danych zamiast API
            setItems([...mockDemands])
        } catch (e: any) {
            setError(e?.message || 'Load failed')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="mb-1">Zapotrzebowania materiałowe</h4>
                    <p className="text-muted mb-0">Lista pozycji do zamówienia z Rhino/Projektów</p>
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={load}
                        disabled={loading}
                    >
                        <i className={`ri-refresh-line me-1 ${loading ? 'ri-spin' : ''}`}></i>
                        {loading ? 'Odświeżanie...' : 'Odśwież'}
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Materiał</th>
                                <th>Ilość</th>
                                <th>Projekt / Element</th>
                                <th>Status</th>
                                <th>Utworzone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr><td colSpan={6} className="text-center py-3">
                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                    Ładowanie…
                                </td></tr>
                            )}
                            {!loading && error && (
                                <tr><td colSpan={6} className="text-danger text-center py-3">{error}</td></tr>
                            )}
                            {!loading && !error && items.length === 0 && (
                                <tr><td colSpan={6} className="text-muted text-center py-3">Brak zapotrzebowań</td></tr>
                            )}
                            {!loading && !error && items.map(d => (
                                <tr key={d.id}>
                                    <td className="text-muted small">{d.id}</td>
                                    <td>
                                        <div className="fw-medium">{d.name}</div>
                                        <div className="text-muted small">{d.materialId}</div>
                                    </td>
                                    <td>{d.requiredQty}</td>
                                    <td>
                                        {d.projectId && <span className="badge bg-light text-dark me-1">{d.projectId}</span>}
                                        {d.tileId && <span className="badge bg-secondary">{d.tileId}</span>}
                                    </td>
                                    <td>
                                        <span className={`badge ${d.status === 'pending' ? 'bg-warning' :
                                                d.status === 'approved' ? 'bg-info' :
                                                    d.status === 'ordered' ? 'bg-success' :
                                                        'bg-secondary'
                                            }`}>
                                            {d.status === 'pending' ? 'Oczekujące' :
                                                d.status === 'approved' ? 'Zatwierdzone' :
                                                    d.status === 'ordered' ? 'Zamówione' :
                                                        d.status}
                                        </span>
                                    </td>
                                    <td className="text-muted small">{new Date(d.createdAt).toLocaleString('pl-PL')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}


