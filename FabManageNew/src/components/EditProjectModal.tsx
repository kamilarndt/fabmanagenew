import { useState, useEffect } from 'react'
import { useProjectsStore, type Project } from '../stores/projectsStore'
import { showToast } from '../lib/toast'

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

    useEffect(() => {
        if (project) {
            setName(project.name)
            setClient(project.client)
            setStatus(project.status)
            setDeadline(project.deadline)
        }
    }, [project])

    if (!open || !project) return null

    const save = async () => {
        await update(project.id, { name, client, status, deadline })
        showToast('Zaktualizowano projekt', 'success')
        onClose()
    }

    return (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edytuj projekt</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-2">
                            <label className="form-label">Nazwa</label>
                            <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="mb-2">
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


