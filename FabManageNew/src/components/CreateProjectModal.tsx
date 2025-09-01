import { useState } from 'react'
import { useProjectsStore, type ProjectModule } from '../stores/projectsStore'
import { showToast } from '../lib/toast'

const projectModules: { id: ProjectModule; name: string; description: string }[] = [
    { id: 'wycena', name: 'Wycena', description: 'Kalkulacja kosztów i przygotowanie oferty' },
    { id: 'koncepcja', name: 'Koncepcja', description: 'Projektowanie koncepcyjne i wizualizacje' },
    { id: 'projektowanie_techniczne', name: 'Projektowanie Techniczne', description: 'Szczegółowe projekty techniczne i dokumentacja' },
    { id: 'produkcja', name: 'Produkcja', description: 'Wycinka CNC i produkcja elementów' },
    { id: 'materialy', name: 'Materiały', description: 'Zarządzanie materiałami i zakupami' },
    { id: 'logistyka_montaz', name: 'Logistyka i Montaż', description: 'Transport i montaż na miejscu' }
]

export default function CreateProjectModal() {
    const { add } = useProjectsStore()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [client, setClient] = useState('')
    const [deadline, setDeadline] = useState('')
    const [selectedModules, setSelectedModules] = useState<ProjectModule[]>([])

    const toggleModule = (moduleId: ProjectModule) => {
        setSelectedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        )
    }

    const onSubmit = () => {
        if (!name || !client || !deadline) {
            showToast('Uzupełnij wszystkie wymagane pola', 'warning');
            return
        }
        if (selectedModules.length === 0) {
            showToast('Wybierz przynajmniej jeden moduł', 'warning')
            return
        }

        add({
            name,
            client,
            status: 'Active',
            deadline,
            modules: selectedModules
        })
        showToast('Projekt utworzony', 'success')
        setOpen(false)
        setName(''); setClient(''); setDeadline(''); setSelectedModules([])
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
                                        <input className="form-control" value={client} onChange={e => setClient(e.currentTarget.value)} />
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


