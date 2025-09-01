import { useTilesStore } from '../stores/tilesStore'
import { useDrag, useDrop } from 'react-dnd'
import { useCallback, useMemo, useState } from 'react'
import TileEditModal from '../components/TileEditModal'
import { showToast } from '../lib/toast'

export default function CNC() {
    const { tiles, setStatus, updateTile } = useTilesStore()
    const [selectedMachine, setSelectedMachine] = useState<string | null>(null)
    const [editing, setEditing] = useState<any | null>(null)
    const columns: { key: 'W KOLEJCE' | 'W TRAKCIE CIĘCIA' | 'WYCIĘTE'; label: string }[] = [
        { key: 'W KOLEJCE', label: 'W KOLEJCE' },
        { key: 'W TRAKCIE CIĘCIA', label: 'W TRAKCIE CIĘCIA' },
        { key: 'WYCIĘTE', label: 'WYCIĘTE' }
    ]
    const machines = useMemo(() => (
        [
            { id: 'CNC-01', status: 'Praca', part: 'P-001', progress: 65, eta: '00:25' },
            { id: 'CNC-02', status: 'Postój', part: '-', progress: 0, eta: '-' },
            { id: 'CNC-03', status: 'Awaria', part: '-', progress: 0, eta: '-' },
            { id: 'CNC-04', status: 'Setup', part: 'P-003', progress: 10, eta: '01:10' },
            { id: 'CNC-05', status: 'Praca', part: 'P-002', progress: 42, eta: '00:40' },
            { id: 'CNC-06', status: 'Praca', part: 'P-004', progress: 80, eta: '00:12' },
        ] as const
    ), [])
    const kpis = useMemo(() => {
        const total = tiles.length
        const inQueue = tiles.filter(t => t.status === 'W KOLEJCE').length
        const inCut = tiles.filter(t => t.status === 'W TRAKCIE CIĘCIA').length
        const done = tiles.filter(t => t.status === 'WYCIĘTE').length
        const completion = total ? Math.round((done / total) * 100) : 0
        return { inQueue, inCut, done, completion }
    }, [tiles])

    const handleTileDrop = (tileId: string, newStatus: 'W KOLEJCE' | 'W TRAKCIE CIĘCIA' | 'WYCIĘTE') => {
        if (newStatus === 'WYCIĘTE') {
            // Automatically change status to "Gotowy do montażu" when dropped in "WYCIĘTE"
            updateTile(tileId, { status: 'Gotowy do montażu' })
            showToast(`Kafelek ${tileId} gotowy do montażu`, 'success')
        } else {
            // Normal status change for other columns
            setStatus(tileId, newStatus)
        }
    }

    return (
        <div>
            <h4 className="mb-3">CNC - Monitoring i kolejka</h4>

            <div className="card mb-3">
                <div className="card-body d-flex flex-wrap gap-2">
                    {machines.map(m => (
                        <button key={m.id} className={`btn btn-sm ${selectedMachine === m.id ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedMachine(m.id)} title={`${m.status} • Część: ${m.part} • ETA ${m.eta}`}>
                            <span className={`badge me-2 ${m.status === 'Praca' ? 'bg-success' : m.status === 'Postój' ? 'bg-warning' : m.status === 'Awaria' ? 'bg-danger' : 'bg-info'}`}> </span>
                            {m.id}
                        </button>
                    ))}
                    <span className="ms-auto">
                        <button className="btn btn-sm btn-outline-danger me-2" onClick={() => alert('Alarmy potwierdzone')} title="Potwierdź alarmy"><i className="ri-alarm-warning-line me-1"></i>Alarms: 2</button>
                        <span className="badge bg-label-secondary"><i className="ri-time-line me-1"></i>Zmiana: 03:12</span>
                    </span>
                </div>
            </div>

            <div className="row g-3 mb-3">
                <div className="col-6 col-lg-3"><div className="card h-100"><div className="card-body text-center"><div className="h4">{kpis.inQueue}</div><div className="text-muted small">W kolejce</div></div></div></div>
                <div className="col-6 col-lg-3"><div className="card h-100"><div className="card-body text-center"><div className="h4">{kpis.inCut}</div><div className="text-muted small">W trakcie cięcia</div></div></div></div>
                <div className="col-6 col-lg-3"><div className="card h-100"><div className="card-body text-center"><div className="h4">{kpis.done}</div><div className="text-muted small">Wycięte</div></div></div></div>
                <div className="col-6 col-lg-3"><div className="card h-100"><div className="card-body text-center"><div className="h4">{kpis.completion}%</div><div className="text-muted small">Ukończenie</div></div></div></div>
            </div>

            <div className="row g-3 mb-3">
                <div className="col-12 col-lg-8">
                    <div className="card">
                        <div className="card-header fw-semibold">Kolejka priorytetowa</div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead><tr><th>#</th><th>Nazwa</th><th>Qty</th><th>Maszyna</th><th>Start</th><th>Materiał</th><th>Priorytet</th></tr></thead>
                                    <tbody>
                                        {tiles.map((t, i) => (
                                            <tr key={t.id}>
                                                <td>{i + 1}</td>
                                                <td>{t.name}</td>
                                                <td>{(Math.abs(t.id.charCodeAt(0) - 64) % 5) + 1}</td>
                                                <td>{machines[i % machines.length].id}</td>
                                                <td>08:{(10 + i * 3) % 60}</td>
                                                <td><span className={`badge ${(i % 2) ? 'bg-success' : 'bg-warning'}`}>{(i % 2) ? 'ready' : 'pending'}</span></td>
                                                <td><span className={`badge ${i % 3 === 0 ? 'bg-danger' : i % 3 === 1 ? 'bg-warning' : 'bg-secondary'}`}>{i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Normal'}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="card h-100">
                        <div className="card-header fw-semibold">Szczegóły maszyny</div>
                        <div className="card-body">
                            {!selectedMachine && <div className="text-muted">Wybierz maszynę powyżej</div>}
                            {selectedMachine && (
                                <div>
                                    <div className="h5 mb-2">{selectedMachine}</div>
                                    <div className="row g-2 mb-2">
                                        <div className="col-6"><div className="text-muted small">Spindle</div><div>12 500 rpm</div></div>
                                        <div className="col-6"><div className="text-muted small">Feed</div><div>1.8 m/min</div></div>
                                        <div className="col-6"><div className="text-muted small">Temp</div><div>54°C</div></div>
                                        <div className="col-6"><div className="text-muted small">Tool wear</div><div>23%</div></div>
                                    </div>
                                    <hr />
                                    <div className="text-muted small mb-1">Ostatnie alarmy</div>
                                    <ul className="list-unstyled mb-0">
                                        <li className="py-1 border-bottom"><span className="badge bg-danger me-2">CRIT</span>Overheat • 08:15</li>
                                        <li className="py-1 border-bottom"><span className="badge bg-warning me-2">WARN</span>Low coolant • 07:40</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3">
                {columns.map(col => (
                    <div className="col-12 col-md-4" key={col.key}>
                        <div className="card h-100">
                            <div className="card-header fw-semibold">{col.label}</div>
                            <DropZone onDrop={(id) => handleTileDrop(id, col.key)}>
                                {tiles.filter(t => t.status === col.key).map(t => (
                                    <DraggableTile key={t.id} id={t.id} name={t.name} onEdit={() => setEditing(t)} />
                                ))}
                                {tiles.filter(t => t.status === col.key).length === 0 && (
                                    <p className="text-muted">Brak zadań</p>
                                )}
                            </DropZone>
                        </div>
                    </div>
                ))}
            </div>
            {editing && <TileEditModal tile={editing} onClose={() => setEditing(null)} onSave={(patch) => { setStatus(editing.id, (patch.status || editing.status) as any); setEditing(null) }} />}
        </div>
    )
}

function DraggableTile({ id, name, onEdit }: { id: string; name: string; onEdit?: () => void }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'CNC_TILE',
        item: { id },
        collect: m => ({ isDragging: m.isDragging() })
    }), [id])
    const dragRef = useCallback((el: HTMLDivElement | null) => { if (el) drag(el) }, [drag])
    return (
        <div ref={dragRef} className="card mb-2 border" style={{ opacity: isDragging ? 0.5 : 1 }} onDoubleClick={onEdit}>
            <div className="card-body py-2 d-flex justify-content-between align-items-center">
                <span>{id} • {name}</span>
                <button className="btn btn-sm btn-outline-secondary" title="Edytuj" onClick={onEdit}><i className="ri-edit-line"></i></button>
            </div>
        </div>
    )
}

function DropZone({ onDrop, children }: { onDrop: (id: string) => void; children: React.ReactNode }) {
    const [, drop] = useDrop(() => ({
        accept: 'CNC_TILE',
        drop: (item: any) => onDrop(item.id)
    }), [onDrop])
    const dropRef = useCallback((el: HTMLDivElement | null) => { if (el) drop(el) }, [drop])
    return <div ref={dropRef} className="card-body">{children}</div>
}


