import { useState } from 'react'

export default function MaterialsModal({ open, onClose, materialId }: { open: boolean; onClose: () => void; materialId: string }) {
    const [qty, setQty] = useState(1)
    if (!open) return null
    return (
        <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header"><h5 className="modal-title">Przyjęcie/Wydanie {materialId}</h5><button className="btn-close" onClick={onClose}></button></div>
                    <div className="modal-body">
                        <div className="mb-2">
                            <label className="form-label">Ilość</label>
                            <input type="number" className="form-control" value={qty} onChange={e => setQty(parseInt(e.currentTarget.value || '0', 10))} />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Operacja</label>
                            <select className="form-select"><option>Przyjęcie</option><option>Wydanie</option></select>
                        </div>
                    </div>
                    <div className="modal-footer"><button className="btn btn-outline-secondary" onClick={onClose}>Zamknij</button><button className="btn btn-primary" onClick={onClose}>Zapisz</button></div>
                </div>
            </div>
        </div>
    )
}


