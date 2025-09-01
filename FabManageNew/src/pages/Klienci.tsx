import { useMemo, useState } from 'react'

type Client = {
    id: string
    name: string
    segment: 'Mały' | 'Średni' | 'Duży'
    region: string
    status: 'Aktywny' | 'Nieaktywny' | 'Lead'
    contact: string
    phone: string
    email: string
    ytd: number
}

const seed: Client[] = Array.from({ length: 10 }).map((_, i) => ({
    id: `C-${(i + 1).toString().padStart(3, '0')}`,
    name: `Klient ${i + 1}`,
    segment: (['Mały', 'Średni', 'Duży'] as const)[i % 3],
    region: ['Warszawa', 'Kraków', 'Poznań'][i % 3],
    status: (['Aktywny', 'Nieaktywny', 'Lead'] as const)[i % 3],
    contact: `Osoba ${i + 1}`,
    phone: `+48 600 000 0${i}`,
    email: `klient${i + 1}@example.com`,
    ytd: 10000 + i * 2500,
}))

export default function Klienci() {
    const [clients] = useState<Client[]>(seed)
    const [query, setQuery] = useState('')
    const [segment, setSegment] = useState<'Wszyscy' | Client['segment']>('Wszyscy')
    const [region, setRegion] = useState<'Wszystkie' | string>('Wszystkie')
    const [status, setStatus] = useState<'Wszyscy' | Client['status']>('Wszyscy')
    const [selected, setSelected] = useState<Client | null>(null)

    const filtered = useMemo(() => clients.filter(c => {
        const byQ = query.trim() === '' || (c.name + ' ' + c.contact + ' ' + c.email).toLowerCase().includes(query.toLowerCase())
        const bySeg = segment === 'Wszyscy' || c.segment === segment
        const byReg = region === 'Wszystkie' || c.region === region
        const byStat = status === 'Wszyscy' || c.status === status
        return byQ && bySeg && byReg && byStat
    }), [clients, query, segment, region, status])

    const metrics = useMemo(() => ({
        active: filtered.filter(c => c.status === 'Aktywny').length,
        ytd: filtered.reduce((a, b) => a + b.ytd, 0),
        avgOrder: filtered.length ? Math.round(filtered.reduce((a, b) => a + b.ytd, 0) / filtered.length) : 0,
        clv: filtered.length ? Math.round(filtered.reduce((a, b) => a + b.ytd, 0) / filtered.length * 3) : 0,
    }), [filtered])

    return (
        <div className="row g-3">
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <div className="row g-2 align-items-end">
                            <div className="col-12 col-lg-4">
                                <label className="form-label">Szukaj klientów…</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-transparent"><i className="ri-search-line"></i></span>
                                    <input className="form-control" value={query} onChange={e => setQuery(e.currentTarget.value)} placeholder="Nazwa, kontakt, email" />
                                </div>
                            </div>
                            <div className="col-6 col-lg-2">
                                <label className="form-label">Segment</label>
                                <select className="form-select" value={segment} onChange={e => setSegment(e.currentTarget.value as any)}>
                                    <option>Wszyscy</option>
                                    <option>Mały</option>
                                    <option>Średni</option>
                                    <option>Duży</option>
                                </select>
                            </div>
                            <div className="col-6 col-lg-2">
                                <label className="form-label">Region</label>
                                <select className="form-select" value={region} onChange={e => setRegion(e.currentTarget.value)}>
                                    <option>Wszystkie</option>
                                    {Array.from(new Set(clients.map(c => c.region))).map(r => <option key={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className="col-6 col-lg-2">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={status} onChange={e => setStatus(e.currentTarget.value as any)}>
                                    <option>Wszyscy</option>
                                    <option>Aktywny</option>
                                    <option>Nieaktywny</option>
                                    <option>Lead</option>
                                </select>
                            </div>
                            <div className="col-6 col-lg-2 d-grid">
                                <button className="btn btn-primary"><i className="ri-user-add-line me-1"></i>Nowy klient</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI row */}
            {[
                { label: 'Aktywni klienci', value: metrics.active },
                { label: 'Sprzedaż YTD (PLN)', value: metrics.ytd.toLocaleString('pl-PL') },
                { label: 'Średnia wartość zamówienia', value: metrics.avgOrder.toLocaleString('pl-PL') },
                { label: 'CLV (est.)', value: metrics.clv.toLocaleString('pl-PL') },
            ].map((k, i) => (
                <div className="col-6 col-lg-3" key={i}>
                    <div className="card h-100"><div className="card-body text-center">
                        <div className="h4">{k.value}</div>
                        <div className="text-muted small">{k.label}</div>
                    </div></div>
                </div>
            ))}

            {/* Grid + Detail */}
            <div className="col-12 col-lg-7">
                <div className="row g-2">
                    {filtered.map(c => (
                        <div className="col-12 col-md-6" key={c.id}>
                            <div className="card h-100" role="button" onClick={() => setSelected(c)}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="rounded bg-light me-2" style={{ width: 48, height: 48 }}></div>
                                        <div>
                                            <div className="fw-semibold">{c.name}</div>
                                            <div className="text-muted small">{c.contact} • {c.phone}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="badge bg-label-primary">{c.status}</span>
                                        <span className="text-muted small">YTD {c.ytd.toLocaleString('pl-PL')} PLN</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-12 col-lg-5">
                <div className="card">
                    <div className="card-header fw-semibold">Szczegóły klienta</div>
                    <div className="card-body">
                        {!selected && <div className="text-muted">Wybierz klienta z listy po lewej</div>}
                        {selected && (
                            <div>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="rounded bg-light me-3" style={{ width: 56, height: 56 }}></div>
                                    <div>
                                        <input className="form-control form-control-sm fw-semibold" defaultValue={selected.name} />
                                        <div className="text-muted small">{selected.segment} • {selected.region}</div>
                                    </div>
                                </div>
                                <div className="row g-2 mb-2">
                                    <div className="col-6"><div className="text-muted small">Kontakt</div><input className="form-control form-control-sm" defaultValue={selected.contact} /></div>
                                    <div className="col-6"><div className="text-muted small">Telefon</div><input className="form-control form-control-sm" defaultValue={selected.phone} /></div>
                                    <div className="col-12"><div className="text-muted small">Email</div><input className="form-control form-control-sm" defaultValue={selected.email} /></div>
                                </div>
                                <hr />
                                <div className="text-muted small mb-1 d-flex justify-content-between align-items-center">Historia projektów (ostatnie 10)
                                    <label className="btn btn-sm btn-outline-secondary">
                                        <input type="file" hidden /> Upload dokumentu
                                    </label>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead><tr><th>Projekt</th><th>Data</th><th>Wartość</th><th>Status</th></tr></thead>
                                        <tbody>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <tr key={i}><td>P-00{i + 1}</td><td>2025-09-0{i + 1}</td><td>{(5000 + i * 1200).toLocaleString('pl-PL')} PLN</td><td><span className="badge bg-label-success">Done</span></td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


