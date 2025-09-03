import { useMemo, useState } from 'react'
import { useTilesStore } from '../stores/tilesStore'
import { PageHeader } from '../components/Ui/PageHeader'
import { Toolbar } from '../components/Ui/Toolbar'
import { EntityTable } from '../components/Ui/EntityTable'
import type { Column } from '../components/Ui/EntityTable'

export default function Produkcja() {
    const { tiles } = useTilesStore()

    const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'kanban' | 'quality' | 'maintenance'>('overview')
    const [lineFilter, setLineFilter] = useState<'Wszystkie' | string>('Wszystkie')
    const [techFilter, setTechFilter] = useState<'Wszystkie' | string>('Wszystkie')
    const [statusFilter, setStatusFilter] = useState<'Wszystkie' | 'Gotowy do montażu' | 'W TRAKCIE CIĘCIA' | 'WYCIĘTE' | 'W KOLEJCE'>('Wszystkie')

    const assemblyTiles = useMemo(() => tiles.filter(tile =>
        (statusFilter === 'Wszystkie' ? true : tile.status === statusFilter)
        && (lineFilter === 'Wszystkie' ? true : tile.project === lineFilter)
        && (techFilter === 'Wszystkie' ? true : tile.technology === techFilter)
    ), [tiles, lineFilter, techFilter, statusFilter])

    const orders = [
        { id: 'O-101', project: 'Linia A', name: 'Panel recepcji', progress: 75 },
        { id: 'O-102', project: 'Linia B', name: 'Stelaż LED', progress: 30 },
        { id: 'O-103', project: 'Linia C', name: 'Płyta tylna', progress: 50 },
        { id: 'O-104', project: 'Linia D', name: 'Zestaw montażowy', progress: 10 }
    ]

    const kanbanColumns = useMemo(() => [
        { id: 'W KOLEJCE', title: 'W KOLEJCE', color: '#ff9800' },
        { id: 'W TRAKCIE CIĘCIA', title: 'W TRAKCIE CIĘCIA', color: '#2196f3' },
        { id: 'WYCIĘTE', title: 'WYCIĘTE', color: '#4caf50' },
        { id: 'Gotowy do montażu', title: 'Gotowy do montażu', color: '#4caf50' }
    ], [])

    const queueColumns: Column<any>[] = useMemo(() => [
        { key: 'id', header: 'ID', width: 80 },
        { key: 'name', header: 'Nazwa', render: (tile) => <div className="fw-semibold">{tile.name}</div> },
        { key: 'project', header: 'Projekt' },
        { key: 'technology', header: 'Technologia' },
        {
            key: 'cost',
            header: 'Koszt',
            render: (tile) => `${(tile.laborCost || 0) + (tile.bom || []).reduce((sum: number, item: any) => sum + (item.quantity * (item.unitCost || 0)), 0)} PLN`
        },
        {
            key: 'status',
            header: 'Status',
            render: (tile) => <span className="badge bg-success">{tile.status}</span>
        }
    ], [])

    return (
        <div>
            <PageHeader
                title="Produkcja"
                subtitle="Monitoring produkcji, kolejka montażowa i kontrola jakości"
            />

            <Toolbar
                left={
                    <div className="d-flex gap-2">
                        <select className="form-select form-select-sm" style={{ minWidth: 160 }} value={lineFilter} onChange={e => setLineFilter(e.currentTarget.value)}>
                            <option>Wszystkie</option>
                            {['Linia A', 'Linia B', 'Linia C', 'Linia D'].map(l => <option key={l}>{l}</option>)}
                        </select>
                        <select className="form-select form-select-sm" style={{ minWidth: 160 }} value={techFilter} onChange={e => setTechFilter(e.currentTarget.value)}>
                            <option>Wszystkie</option>
                            {Array.from(new Set(tiles.map(t => t.technology))).map(t => <option key={t}>{t}</option>)}
                        </select>
                        <select className="form-select form-select-sm" style={{ minWidth: 180 }} value={statusFilter} onChange={e => setStatusFilter(e.currentTarget.value as any)}>
                            {['Wszystkie', 'W KOLEJCE', 'W TRAKCIE CIĘCIA', 'WYCIĘTE', 'Gotowy do montażu'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                }
                right={
                    <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary">
                            <i className="ri-download-line me-1"></i>Eksport
                        </button>
                    </div>
                }
            />

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

            {/* Tabs */}
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item"><button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><i className="ri-dashboard-line me-1"></i>Przegląd</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'queue' ? 'active' : ''}`} onClick={() => setActiveTab('queue')}><i className="ri-list-check me-1"></i>Kolejka</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'kanban' ? 'active' : ''}`} onClick={() => setActiveTab('kanban')}><i className="ri-layout-grid-line me-1"></i>Kanban</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'quality' ? 'active' : ''}`} onClick={() => setActiveTab('quality')}><i className="ri-shield-check-line me-1"></i>Jakość</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}><i className="ri-tools-line me-1"></i>Utrzymanie ruchu</button></li>
            </ul>

            {activeTab === 'overview' && (
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
            )}

            {activeTab === 'queue' && (
                <div className="card mb-3">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Kolejka montażowa ({assemblyTiles.length})</h6>
                        <span className="badge bg-primary">Automatycznie z CNC</span>
                    </div>
                    <div className="card-body">
                        {assemblyTiles.length > 0 ? (
                            <EntityTable
                                rows={assemblyTiles}
                                columns={queueColumns}
                                rowKey={(tile) => tile.id}
                            />
                        ) : (
                            <div className="text-center py-4">
                                <i className="ri-inbox-line text-muted" style={{ fontSize: '2rem' }}></i>
                                <p className="text-muted mt-2">Brak elementów w kolejce</p>
                                <small className="text-muted">Elementy automatycznie pojawią się po zakończeniu cięcia CNC</small>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'kanban' && (
                <div className="card mb-3">
                    <div className="card-header fw-semibold">Kanban</div>
                    <div className="card-body">
                        <div className="row g-3">
                            {kanbanColumns.map((stage, idx) => (
                                <div className="col-12 col-xl-3" key={stage.id}>
                                    <div className="border rounded h-100">
                                        <div className={`p-2 border-bottom fw-semibold ${['bg-secondary-subtle', 'bg-primary-subtle', 'bg-info-subtle', 'bg-success-subtle'][idx]}`}>{stage.title}</div>
                                        <div className="p-2" style={{ minHeight: 260 }}>
                                            {tiles.filter(t => t.status === stage.id).map(t => (
                                                <div key={t.id} className="card mb-2">
                                                    <div className="card-body py-2">
                                                        <div className="fw-semibold">{t.name}</div>
                                                        <div className="text-muted small">{t.project} • {t.technology}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'quality' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-9">
                        <div className="card h-100">
                            <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
                                <span>Live feed</span>
                                <span className="text-muted small">odświeżanie co 5s</span>
                            </div>
                            <div className="card-body" style={{ maxHeight: 360, overflowY: 'auto' }}>
                                <ul className="list-unstyled mb-0">
                                    {Array.from({ length: 16 }).map((_, i) => (
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
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div className="col-4" key={i}><span className={`badge w-100 ${i % 5 === 0 ? 'bg-danger' : 'bg-success'}`}>{i % 5 === 0 ? 'FAIL' : 'PASS'}</span></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'maintenance' && (
                <div className="card">
                    <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
                        <span>Utrzymanie ruchu</span>
                        <button className="btn btn-sm btn-outline-secondary"><i className="ri-add-line me-1"></i>Nowe zgłoszenie</button>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-sm align-middle">
                                <thead><tr><th>Maszyna</th><th>Priorytet</th><th>Status</th><th>Zgłoszono</th><th>Akcja</th></tr></thead>
                                <tbody>
                                    {['CNC-01', 'CNC-02', 'MONTAŻ-01'].map((m, i) => (
                                        <tr key={m}><td>{m}</td><td><span className={`badge ${i === 0 ? 'bg-danger' : 'bg-warning'}`}>{i === 0 ? 'Wysoki' : 'Średni'}</span></td><td>{i === 2 ? 'Zamknięte' : 'Otwarte'}</td><td>2025-09-1{i + 1}</td><td><button className="btn btn-sm btn-outline-primary">Szczegóły</button></td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


