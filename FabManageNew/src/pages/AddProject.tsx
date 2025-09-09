import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectsStore, type ProjectModule, type Project } from '../stores/projectsStore'
import { useClientDataStore } from '../stores/clientDataStore'

export default function AddProject() {
    const navigate = useNavigate()
    const { add } = useProjectsStore()
    const { clients } = useClientDataStore()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')
    const [clientId, setClientId] = useState('')
    const [budget, setBudget] = useState<number | ''>('')
    const [manager, setManager] = useState('')
    const [status, setStatus] = useState<'Active' | 'On Hold' | 'Done'>('Active')
    const [modules, setModules] = useState<ProjectModule[]>([])

    // Pobierz nazwę klienta na podstawie ID
    const selectedClient = useMemo(() =>
        clients.find((c: any) => c.id === clientId), [clients, clientId]
    )

    const isValid = useMemo(() => name.trim() && clientId && deadline.trim(), [name, clientId, deadline])

    const toggleModule = (m: ProjectModule) => {
        setModules(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
    }

    const handleSubmit = async () => {
        if (!isValid || !selectedClient) return

        await add({
            numer: `P-${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getDate()).padStart(2, '0')}`,
            name: name.trim(),
            typ: 'Inne',
            lokalizacja: 'Warszawa',
            clientId: clientId,
            client: selectedClient.companyName,
            status: status as Project['status'],
            data_utworzenia: new Date().toISOString().slice(0, 10),
            deadline: deadline,
            postep: 0,
            budget: budget || undefined,
            manager: manager || undefined,
            description: description || undefined,
            modules: modules.length ? modules : undefined,
            clientColor: selectedClient.cardColor
        })
        navigate('/projekty')
    }

    return (
        <div className="container-fluid py-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                        <li className="breadcrumb-item"><a href="/projekty">Projekty</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Dodaj projekt</li>
                    </ol>
                </nav>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Anuluj</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={!isValid}>Zapisz</button>
                </div>
            </div>

            <h4 className="mb-3">Dodaj projekt</h4>

            <div className="row g-3">
                <div className="col-12 col-xl-9">
                    <div className="card mb-3">
                        <div className="card-header fw-semibold">Informacje ogólne</div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Nazwa projektu</label>
                                <input className="form-control" placeholder="Wpisz nazwę projektu" value={name} onChange={e => setName(e.currentTarget.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Opis</label>
                                <textarea className="form-control" rows={4} placeholder="Krótki opis" value={description} onChange={e => setDescription(e.currentTarget.value)} />
                            </div>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <label className="form-label">Termin</label>
                                    <input type="date" className="form-control" value={deadline} onChange={e => setDeadline(e.currentTarget.value)} />
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label">Klient</label>
                                    <select
                                        className="form-select"
                                        value={clientId}
                                        onChange={e => setClientId(e.target.value)}
                                        required
                                    >
                                        <option value="">Wybierz klienta</option>
                                        {clients.map((client: any) => (
                                            <option key={client.id} value={client.id}>
                                                {client.companyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label">Budżet (PLN)</label>
                                    <input type="number" min={0} className="form-control" value={budget} onChange={e => setBudget(e.currentTarget.value === '' ? '' : Number(e.currentTarget.value))} />
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label">Kierownik projektu</label>
                                    <input className="form-control" placeholder="Imię i nazwisko" value={manager} onChange={e => setManager(e.currentTarget.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header fw-semibold">Zasoby</div>
                        <div className="card-body">
                            <div className="text-muted">Dodawanie plików i załączników będzie dostępne w kolejnej iteracji.</div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-3">
                    <div className="card mb-3">
                        <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
                            <span>Status</span>
                            <span className="badge bg-light text-dark">{status}</span>
                        </div>
                        <div className="card-body">
                            <label className="form-label">Status projektu</label>
                            <select className="form-select" value={status} onChange={e => setStatus(e.currentTarget.value as typeof status)}>
                                <option value="Active">Active</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-header fw-semibold">Moduły</div>
                        <div className="card-body">
                            {(['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy', 'logistyka_montaz'] as ProjectModule[]).map(m => (
                                <div className="form-check mb-1" key={m}>
                                    <input className="form-check-input" type="checkbox" id={`m-${m}`} checked={modules.includes(m)} onChange={() => toggleModule(m)} />
                                    <label className="form-check-label" htmlFor={`m-${m}`}>{m.replace('_', ' ')}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header fw-semibold">Obraz</div>
                        <div className="card-body">
                            <div className="border rounded d-flex align-items-center justify-content-center bg-light" style={{ height: 160 }}>
                                <div className="text-muted small text-center">
                                    Drag & drop / kliknij aby dodać (placeholder)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


