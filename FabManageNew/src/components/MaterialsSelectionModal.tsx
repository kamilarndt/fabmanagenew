type Material = { id: string; name: string; unit: string }

const catalog: Material[] = [
    { id: 'M-001', name: 'MDF 18mm', unit: 'szt' },
    { id: 'M-002', name: 'Plexi 3mm', unit: 'ark' },
    { id: 'M-003', name: 'Taśma LED', unit: 'm' },
    { id: 'M-004', name: 'Aluminium 2mm', unit: 'ark' },
]

export default function MaterialsSelectionModal({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (ids: string[]) => void }) {
    if (!open) return null
    const pick = (id: string) => onSelect([id])
    return (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Wybierz materiały</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead><tr><th>Kod</th><th>Nazwa</th><th>Jednostka</th><th></th></tr></thead>
                                <tbody>
                                    {catalog.map(m => (
                                        <tr key={m.id}>
                                            <td>{m.id}</td>
                                            <td>{m.name}</td>
                                            <td>{m.unit}</td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-primary" onClick={() => pick(m.id)}>
                                                    <i className="ri-add-line me-1"></i>Dodaj
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-outline-secondary" onClick={onClose}>Zamknij</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


