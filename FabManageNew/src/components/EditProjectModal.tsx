import { useState, useEffect } from 'react'
import { useProjectsStore, type Project, type ProjectModule } from '../stores/projectsStore'
import { showToast } from '../lib/toast'

const projectModules: { id: ProjectModule; name: string; description: string }[] = [
    { id: 'wycena', name: 'Wycena', description: 'Kalkulacja kosztów i przygotowanie oferty' },
    { id: 'koncepcja', name: 'Koncepcja', description: 'Projektowanie koncepcyjne i wizualizacje' },
    { id: 'projektowanie_techniczne', name: 'Projektowanie Techniczne', description: 'Szczegółowe projekty techniczne i dokumentacja' },
    { id: 'produkcja', name: 'Produkcja', description: 'Wycinka CNC i produkcja elementów' },
    { id: 'materialy', name: 'Materiały', description: 'Zarządzanie materiałami i zakupami' },
    { id: 'logistyka_montaz', name: 'Logistyka i Montaż', description: 'Transport i montaż na miejscu' }
]

type Props = {
    open: boolean
    projectId: string | null
    onClose: () => void
}

export default function EditProjectModal({ open, projectId, onClose }: Props) {
    const { projects, update } = useProjectsStore()
    const project = projects.find(p => p.id === projectId)

    const [name, setName] = useState('')
    const [client, setClient] = useState('')
    const [status, setStatus] = useState<Project['status']>('Active')
    const [deadline, setDeadline] = useState('')
    const [selectedModules, setSelectedModules] = useState<ProjectModule[]>([])

    const toggleModule = (moduleId: ProjectModule) => {
        setSelectedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        )
    }

    useEffect(() => {
        if (project) {
            setName(project.name)
            setClient(project.client)
            setStatus(project.status)
            setDeadline(project.deadline)
            setSelectedModules(project.modules || [])
        }
    }, [project])

    if (!open || !project) return null

    const save = async () => {
        if (selectedModules.length === 0) {
            showToast('Wybierz przynajmniej jeden moduł', 'warning')
            return
        }
        await update(project.id, { name, client, status, deadline, modules: selectedModules })
        showToast('Zaktualizowano projekt', 'success')
        onClose()
    }

    return (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edytuj projekt</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label">Nazwa projektu</label>
                                <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Klient</label>
                                <input className="form-control" value={client} onChange={e => setClient(e.target.value)} />
                            </div>
                            <div className="row g-2">
                                <div className="col-6">
                                    <label className="form-label">Status</label>
                                    <select className="form-select" value={status} onChange={e => setStatus(e.target.value as Project['status'])}>
                                        <option value="Active">Active</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="form-label">Deadline</label>
                                    <input type="date" className="form-control" value={deadline} onChange={e => setDeadline(e.target.value)} />
                                </div>
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
                                                    id={`edit-module-${module.id}`}
                                                    checked={selectedModules.includes(module.id)}
                                                    onChange={() => toggleModule(module.id)}
                                                />
                                                <label className="form-check-label" htmlFor={`edit-module-${module.id}`}>
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
                        <button className="btn btn-outline-secondary" onClick={onClose}>Anuluj</button>
                        <button className="btn btn-primary" onClick={save}>Zapisz</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


