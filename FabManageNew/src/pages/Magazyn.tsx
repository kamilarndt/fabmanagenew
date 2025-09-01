import { useMemo, useState } from 'react'
import { showToast } from '../lib/toast'
import MaterialsModal from '../components/MaterialsModal'

type Material = { id: string; name: string; stock: number; unit: string; min: number; category: string; supplier: string }

const seed: Material[] = [
    { id: 'M-001', name: 'MDF 18mm', stock: 42, unit: 'szt', min: 20, category: 'Płyty', supplier: 'Drewex' },
    { id: 'M-002', name: 'Plexi 3mm', stock: 10, unit: 'ark', min: 15, category: 'Tworzywa', supplier: 'PlastPro' },
    { id: 'M-003', name: 'Taśma LED', stock: 120, unit: 'm', min: 50, category: 'Elektryka', supplier: 'LightCo' },
    { id: 'M-004', name: 'Aluminium 2mm', stock: 8, unit: 'ark', min: 12, category: 'Metale', supplier: 'MetalPol' },
]

export default function Magazyn() {
    const [materials] = useState<Material[]>(seed)
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState<'Wszystkie' | string>('Wszystkie')
    const [status, setStatus] = useState<'All' | 'Low' | 'OK' | 'Excess'>('All')
    const [supplier, setSupplier] = useState<'Wszyscy' | string>('Wszyscy')
    const [abc, setAbc] = useState<'All' | 'A' | 'B' | 'C'>('All')

    // ABC analysis (mock value by id hash) - declared before use
    function abcClass(m: Material): 'A' | 'B' | 'C' {
        const hash = m.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
        const mod = hash % 10
        if (mod < 3) return 'A'
        if (mod < 7) return 'B'
        return 'C'
    }

    const filtered = useMemo(() => materials.filter(m => {
        const byQ = query.trim() === '' || (m.id + ' ' + m.name).toLowerCase().includes(query.toLowerCase())
        const byC = category === 'Wszystkie' || m.category === category
        const byS = supplier === 'Wszyscy' || m.supplier === supplier
        const ratio = m.stock / Math.max(1, m.min)
        const stat = ratio < 1 ? 'Low' : ratio > 3 ? 'Excess' : 'OK'
        const byStatus = status === 'All' || stat === status
        const cls = abcClass(m)
        const byAbc = abc === 'All' || cls === abc
        return byQ && byC && byS && byStatus && byAbc
    }), [materials, query, category, status, supplier, abc])

    const [modalMat, setModalMat] = useState<string | null>(null)
    const kpis = useMemo(() => {
        const value = filtered.reduce((a, _b) => a + 1000, 0) // placeholder value
        const turnover = 3.2
        const fillRate = Math.round(92)
        const stockouts = filtered.filter(m => m.stock < m.min).length
        return { value, turnover, fillRate, stockouts }
    }, [filtered])

    return (
        <div>
            <h4 className="mb-3">Magazyn</h4>

            {/* Header filters */}
            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-2 align-items-end">
                        <div className="col-12 col-lg-4">
                            <label className="form-label">Szukaj materiałów</label>
                            <div className="input-group">
                                <span className="input-group-text bg-transparent"><i className="ri-search-line"></i></span>
                                <input className="form-control" value={query} onChange={e => setQuery(e.currentTarget.value)} placeholder="Kod / nazwa" />
                            </div>
                        </div>
                        <div className="col-6 col-lg-2">
                            <label className="form-label">Kategoria</label>
                            <select className="form-select" value={category} onChange={e => setCategory(e.currentTarget.value)}>
                                <option>Wszystkie</option>
                                {Array.from(new Set(materials.map(m => m.category))).map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col-6 col-lg-2">
                            <label className="form-label">Dostawca</label>
                            <select className="form-select" value={supplier} onChange={e => setSupplier(e.currentTarget.value)}>
                                <option>Wszyscy</option>
                                {Array.from(new Set(materials.map(m => m.supplier))).map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="col-6 col-lg-2">
                            <label className="form-label">Status zapasów</label>
                            <select className="form-select" value={status} onChange={e => setStatus(e.currentTarget.value as any)}>
                                <option value="All">All</option>
                                <option value="Low">Low</option>
                                <option value="OK">OK</option>
                                <option value="Excess">Excess</option>
                            </select>
                        </div>
                        <div className="col-6 col-lg-2">
                            <label className="form-label">ABC</label>
                            <select className="form-select" value={abc} onChange={e => setAbc(e.currentTarget.value as any)}>
                                <option value="All">All</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                        </div>
                        <div className="col-6 col-lg-2 d-flex gap-2">
                            <button className="btn btn-primary w-50" onClick={() => setModalMat('M-NEW')}><i className="ri-download-2-line me-1"></i>Przyjęcie</button>
                            <button className="btn btn-outline-primary w-50" onClick={() => setModalMat('M-NEW')}><i className="ri-upload-2-line me-1"></i>Wydanie</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI row */}
            <div className="row g-3 mb-3">
                <div className="col-6 col-lg-3"><div className="card h-100"><div className="card-body text-center"><div className="h4">{kpis.value.toLocaleString('pl-PL')} PLN</div><div className="text-muted small">Wartość magazynu</div></div></div></div>
                <div className="col-6 col-lg-3"><div className="card h-100"><div className="card-body text-center"><div className="h4">{kpis.turnover}</div><div className="text-muted small">Inventory turnover</div></div></div></div>
                <div className="col-6 col-lg-3"><div className="card h-100"><div className="card-body text-center"><div className="h4">{kpis.fillRate}%</div><div className="text-muted small">Fill rate</div></div></div></div>
                <div className="col-6 col-lg-3"><div className="card h-100"><div className="card-body text-center"><div className="h4">{kpis.stockouts}</div><div className="text-muted small">Stockout events</div></div></div></div>
            </div>

            {/* Main layout */}
            <div className="row g-3">
                {/* Critical materials */}
                <div className="col-12 col-xl-7">
                    <div className="card h-100">
                        <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
                            <span>Krytyczne materiały</span>
                            <button className="btn btn-sm btn-outline-secondary"><i className="ri-file-download-line me-1"></i>Export</button>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead><tr><th>Kod</th><th>Nazwa</th><th>Stan</th><th>Min</th><th>Status</th><th>Klasa ABC</th><th>Ostatnia dostawa</th><th>Dostawca</th><th>Akcja</th></tr></thead>
                                    <tbody>
                                        {filtered.map(m => {
                                            const ratio = m.stock / Math.max(1, m.min)
                                            const pct = Math.min(100, Math.round((m.stock / Math.max(m.min, 1)) * 100))
                                            const status = ratio < 1 ? 'bg-danger' : ratio > 3 ? 'bg-success' : 'bg-warning'
                                            return (
                                                <tr key={m.id}>
                                                    <td>{m.id}</td>
                                                    <td>{m.name}</td>
                                                    <td>{m.stock} {m.unit}</td>
                                                    <td>{m.min} {m.unit}</td>
                                                    <td style={{ minWidth: 140 }}>
                                                        <div className="progress" style={{ height: 6 }}>
                                                            <div className={`progress-bar ${status}`} style={{ width: `${pct}%` }}></div>
                                                        </div>
                                                    </td>
                                                    <td>{abcClass(m)}</td>
                                                    <td>2025-09-12</td>
                                                    <td>{m.supplier}</td>
                                                    <td>
                                                        {ratio < 1 ? (
                                                            <button className="btn btn-sm btn-danger" onClick={() => showToast(`Zamówienie materiału ${m.id} utworzone`, 'danger')}><i className="ri-shopping-cart-2-line me-1"></i>Zamów</button>
                                                        ) : (
                                                            <button className="btn btn-sm btn-outline-secondary" title="Pokaż szczegóły" onClick={() => setModalMat(m.id)}>Szczegóły</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overview / Movement tabs */}
                <div className="col-12 col-xl-5">
                    <div className="card h-100">
                        <div className="card-header fw-semibold">
                            <ul className="nav nav-tabs card-header-tabs" role="tablist">
                                <li className="nav-item" role="presentation"><button className="nav-link active" data-bs-toggle="tab" data-bs-target="#ov" type="button" role="tab">Overview</button></li>
                                <li className="nav-item" role="presentation"><button className="nav-link" data-bs-toggle="tab" data-bs-target="#mv" type="button" role="tab">Movement</button></li>
                            </ul>
                        </div>
                        <div className="card-body tab-content">
                            <div className="tab-pane fade show active" id="ov" role="tabpanel">
                                <div className="bg-light rounded w-100 mb-3" style={{ height: 160 }}></div>
                                <div className="bg-light rounded w-100" style={{ height: 160 }}></div>
                            </div>
                            <div className="tab-pane fade" id="mv" role="tabpanel">
                                <div className="bg-light rounded w-100 mb-3" style={{ height: 160 }}></div>
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead><tr><th>Dokument</th><th>Data</th><th>Typ</th><th>Pozycje</th></tr></thead>
                                        <tbody>
                                            {Array.from({ length: 6 }).map((_, i) => (
                                                <tr key={i}><td>RW-2025-0{i + 1}</td><td>2025-09-1{i}</td><td>{i % 2 ? 'PZ' : 'RW'}</td><td>{(i + 1) * 3}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom layout visualization */}
                <div className="col-12">
                    <div className="card">
                        <div className="card-header fw-semibold">Układ magazynu</div>
                        <div className="card-body">
                            <div className="bg-light rounded w-100" style={{ height: 180 }}></div>
                        </div>
                    </div>
                </div>
            </div>
            <MaterialsModal open={!!modalMat} materialId={modalMat || ''} onClose={() => setModalMat(null)} />
        </div>
    )
}


