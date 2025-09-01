import { useState } from 'react'
import { showToast } from '../lib/toast'
import { useProjects } from '../state/ProjectsContext'

export default function CreateProjectModal() {
    const { add } = useProjects()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [client, setClient] = useState('')
    const [deadline, setDeadline] = useState('')

    const onSubmit = () => {
        if (!name || !client || !deadline) { showToast('Uzupełnij wszystkie pola', 'warning'); return }
        add({ name, client, status: 'Active', deadline })
        showToast('Projekt utworzony', 'success')
        setOpen(false)
        setName(''); setClient(''); setDeadline('')
    }

    return (
        <>
            <button className="btn btn-primary" onClick={() => setOpen(true)}><i className="ri-add-line me-1"></i>Nowy projekt</button>
            {open && (
                <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nowy projekt</h5>
                                <button type="button" className="btn-close" onClick={() => setOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-2">
                                    <label className="form-label">Nazwa</label>
                                    <input className="form-control" value={name} onChange={e => setName(e.currentTarget.value)} />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Klient</label>
                                    <input className="form-control" value={client} onChange={e => setClient(e.currentTarget.value)} />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Deadline</label>
                                    <input type="date" className="form-control" value={deadline} onChange={e => setDeadline(e.currentTarget.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-secondary" onClick={() => setOpen(false)}>Anuluj</button>
                                <button className="btn btn-primary" onClick={onSubmit}>Utwórz</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


