import { useState, useEffect } from 'react'
import { useProjectsStore, type Project, type ProjectModule } from '../stores/projectsStore'
import { PROJECT_MODULES, PROJECT_STATUS_LABELS, PROJECT_STATUSES } from '../types/enums'
import { showToast } from '../lib/notifications'
import SlideOver from './Ui/SlideOver'

const projectModules: { id: ProjectModule; name: string; description: string }[] = [
    { id: PROJECT_MODULES.PRICING, name: 'Wycena', description: 'Kalkulacja kosztów i przygotowanie oferty' },
    { id: PROJECT_MODULES.CONCEPT, name: 'Koncepcja', description: 'Projektowanie koncepcyjne i wizualizacje' },
    { id: PROJECT_MODULES.DESIGN, name: 'Projektowanie', description: 'Szczegółowe projekty techniczne i dokumentacja' },
    { id: PROJECT_MODULES.PRODUCTION, name: 'Produkcja', description: 'Wycinka CNC i produkcja elementów' },
    { id: PROJECT_MODULES.LOGISTICS, name: 'Logistyka', description: 'Transport i montaż na miejscu' },
    { id: PROJECT_MODULES.ACCOMMODATION, name: 'Zakwaterowanie', description: 'Rezerwacje hoteli i koszty' }
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
    const [status, setStatus] = useState<Project['status']>(PROJECT_STATUSES.NEW as any)
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

    const footer = (
        <>
            <button className="btn btn-outline-secondary" onClick={onClose}>Anuluj</button>
            <button className="btn btn-primary" onClick={save}>Zapisz</button>
        </>
    )

    return (
        <SlideOver open={open} onClose={onClose} title="Edytuj projekt" width={720} footer={footer}>
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
                            {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
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
        </SlideOver>
    )
}


