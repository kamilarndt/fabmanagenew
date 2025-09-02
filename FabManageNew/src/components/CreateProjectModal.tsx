import { useState } from 'react'
import { useProjectsStore, type ProjectModule } from '../stores/projectsStore'
import { useClientsStore } from '../stores/clientsStore'
import { showToast } from '../lib/toast'

const projectModules: { id: ProjectModule; name: string; description: string }[] = [
    { id: 'wycena', name: 'Wycena', description: 'Przygotowanie wyceny projektu' },
    { id: 'koncepcja', name: 'Koncepcja', description: 'Opracowanie koncepcji projektowej' },
    { id: 'projektowanie_techniczne', name: 'Projektowanie techniczne', description: 'Szczegółowe projektowanie techniczne' },
    { id: 'produkcja', name: 'Produkcja', description: 'Wytwarzanie elementów projektu' },
    { id: 'materialy', name: 'Materiały', description: 'Zakup i zarządzanie materiałami' },
    { id: 'logistyka_montaz', name: 'Logistyka i montaż', description: 'Transport i montaż na miejscu' }
]

export default function CreateProjectModal() {
    const { add } = useProjectsStore()
    const { clients } = useClientsStore()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [clientId, setClientId] = useState('')
    const [deadline, setDeadline] = useState('')
    const [selectedModules, setSelectedModules] = useState<ProjectModule[]>([])

    // Pobierz nazwę klienta na podstawie ID
    const selectedClient = clients.find(c => c.id === clientId)

    const toggleModule = (moduleId: ProjectModule) => {
        setSelectedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        )
    }

    const onSubmit = () => {
        if (!name || !clientId || !deadline) {
            showToast('Uzupełnij wszystkie wymagane pola', 'warning');
            return
        }
        if (selectedModules.length === 0) {
            showToast('Wybierz przynajmniej jeden moduł', 'warning')
            return
        }
        if (!selectedClient) {
            showToast('Wybrany klient nie istnieje', 'danger')
            return
        }

        add({
            name,
            clientId: clientId,
            client: selectedClient.companyName,
            status: 'Active',
            deadline,
            modules: selectedModules,
            clientColor: selectedClient.cardColor
        })
        showToast('Projekt utworzony', 'success')
        setOpen(false)
        setName(''); setClientId(''); setDeadline(''); setSelectedModules([])
    }

    return (
        <>
            <button className="btn btn-primary" onClick={() => setOpen(true)}><i className="ri-add-line me-1"></i>Nowy projekt</button>
            {open && (
                <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nowy projekt</h5>
                                <button type="button" className="btn-close" onClick={() => setOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label">Nazwa projektu *</label>
                                        <input className="form-control" value={name} onChange={e => setName(e.currentTarget.value)} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Klient *</label>
                                        <div className="mb-3">
                                            <label className="form-label">Klient</label>
                                            <select
                                                className="form-select"
                                                value={clientId}
                                                onChange={e => setClientId(e.target.value)}
                                                required
                                            >
                                                <option value="">Wybierz klienta</option>
                                                {clients.map(client => (
                                                    <option key={client.id} value={client.id}>
                                                        {client.companyName} ({client.segment}, {client.region})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Deadline *</label>
                                        <input type="date" className="form-control" value={deadline} onChange={e => setDeadline(e.currentTarget.value)} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Moduły projektu *</label>
                                        <div className="row g-2">
                                            {projectModules.map((module) => (
                                                <div key={module.id} className="col-md-6">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`module-${module.id}`}
                                                            checked={selectedModules.includes(module.id)}
                                                            onChange={() => toggleModule(module.id)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`module-${module.id}`}>
                                                            <strong>{module.name}</strong>
                                                            <br />
                                                            <small className="text-muted">{module.description}</small>
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-2">
                                            <small className="text-muted">
                                                Wybrano {selectedModules.length} z {projectModules.length} dostępnych modułów
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-secondary" onClick={() => setOpen(false)}>Anuluj</button>
                                <button className="btn btn-primary" onClick={onSubmit}>Utwórz projekt</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


