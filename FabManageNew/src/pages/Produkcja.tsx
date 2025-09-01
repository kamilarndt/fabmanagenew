import { useTileStatus } from '../stores/tilesStore'

export default function Produkcja() {
    const { tiles } = useTilesStore()

    // Filter tiles ready for assembly
    const assemblyTiles = tiles.filter(tile => tile.status === 'Gotowy do montażu')

    const orders = [
        { id: 'O-101', project: 'Linia A', name: 'Panel recepcji', progress: 75 },
        { id: 'O-102', project: 'Linia B', name: 'Stelaż LED', progress: 30 },
        { id: 'O-103', project: 'Linia C', name: 'Płyta tylna', progress: 50 },
        { id: 'O-104', project: 'Linia D', name: 'Zestaw montażowy', progress: 10 }
    ]
    // Live counters (mock)
    // const counters = [
    //     { label: 'Bieżąca wydajność', value: '87%', trend: '+2%' },
    //     { label: 'Czas cyklu', value: '3.2 min', trend: '-0.1' },
    //     { label: 'Przestoje dziś', value: '38 min', trend: '2 zdarzenia' },
    //     { label: 'Jakość (FPY)', value: '96.4%', trend: '+0.3%' },
    // ] as const
    return (
        <div>
            <h4 className="mb-3">Produkcja</h4>

            {/* KPI rows */}
            <div className="row g-3 mb-3">
                {[
                    { label: 'Plan vs Actual', value: '84%', extra: 'on track' },
                    { label: 'OLE', value: '76%', extra: '▲ 2%' },
                    { label: 'Scrap rate', value: '3.2%', extra: 'vs 4% target' },
                    { label: 'Labor productivity', value: '52 pcs/h', extra: 'good' },
                ].map((k, i) => (
                    <div className="col-6 col-lg-3" key={i}><div className="card h-100"><div className="card-body text-center"><div className="h4">{k.value}</div><div className="text-muted small">{k.label}</div><div className="text-success small">{k.extra}</div></div></div></div>
                ))}
            </div>
            <div className="row g-3 mb-3">
                {[
                    { label: 'Downtime today', value: '38 min' },
                    { label: 'MTTR', value: '12 min' },
                    { label: 'Energy efficiency', value: '1.9 kWh/pc' },
                    { label: 'Safety record', value: '27 dni' },
                ].map((k, i) => (
                    <div className="col-6 col-lg-3" key={i}><div className="card h-100"><div className="card-body text-center"><div className="h4">{k.value}</div><div className="text-muted small">{k.label}</div></div></div></div>
                ))}
            </div>

            {/* Plan vs Actual progress */}
            <div className="card mb-3">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="fw-semibold">Plan vs Actual</div>
                        <span className="text-muted small">84%</span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                        <div className="progress-bar" style={{ width: '84%' }}></div>
                    </div>
                </div>
            </div>

            {/* Assembly Queue */}
            <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Kolejka montażowa ({assemblyTiles.length})</h6>
                    <span className="badge bg-primary">Automatycznie z CNC</span>
                </div>
                <div className="card-body">
                    {assemblyTiles.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-sm align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nazwa</th>
                                        <th>Projekt</th>
                                        <th>Technologia</th>
                                        <th>Koszt</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assemblyTiles.map(tile => (
                                        <tr key={tile.id}>
                                            <td>{tile.id}</td>
                                            <td>{tile.name}</td>
                                            <td>{tile.project}</td>
                                            <td>{tile.technology}</td>
                                            <td>{(tile.laborCost || 0) + (tile.bom || []).reduce((sum, item) => sum + (item.quantity * (item.unitCost || 0)), 0)} PLN</td>
                                            <td>
                                                <span className="badge bg-success">Gotowy do montażu</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <i className="ri-inbox-line text-muted" style={{ fontSize: '2rem' }}></i>
                            <p className="text-muted mt-2">Brak elementów gotowych do montażu</p>
                            <small className="text-muted">Elementy automatycznie pojawią się po zakończeniu cięcia CNC</small>
                        </div>
                    )}
                </div>
            </div>

            {/* Schedule + Live + Quality */}
            <div className="row g-3">
                <div className="col-12 col-xl-6">
                    <div className="card h-100">
                        <div className="card-header fw-semibold">Harmonogram (Shift)</div>
                        <div className="card-body">
                            <div className="bg-light rounded w-100 mb-3" style={{ height: 12 }}></div>
                            <div className="table-responsive">
                                <table className="table table-sm align-middle">
                                    <thead><tr><th>Linia</th><th colSpan={6}>Godziny</th></tr></thead>
                                    <tbody>
                                        {['Linia A', 'Linia B', 'Linia C', 'Linia D'].map((l, i) => (
                                            <tr key={l}><td>{l}</td><td colSpan={6}><div className="bg-light rounded" style={{ height: 28, position: 'relative' }}><div className="bg-primary" style={{ position: 'absolute', left: `${i * 15}%`, width: '20%', height: '100%' }}></div></div></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-xl-3">
                    <div className="card h-100">
                        <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
                            <span>Live feed</span>
                            <span className="text-muted small">odświeżanie co 5s</span>
                        </div>
                        <div className="card-body" style={{ maxHeight: 280, overflowY: 'auto' }}>
                            <ul className="list-unstyled mb-0">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <li key={i} className="py-1 border-bottom">{i % 2 ? 'Start' : 'Complete'} • {orders[i % orders.length].name} • 08:{(10 + i) % 60}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-xl-3">
                    <div className="card h-100">
                        <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
                            <span>Quality panel</span>
                            <button className="btn btn-sm btn-outline-secondary"><i className="ri-refresh-line"></i></button>
                        </div>
                        <div className="card-body">
                            <div className="row g-2">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div className="col-4" key={i}><span className={`badge w-100 ${i % 5 === 0 ? 'bg-danger' : 'bg-success'}`}>{i % 5 === 0 ? 'FAIL' : 'PASS'}</span></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


