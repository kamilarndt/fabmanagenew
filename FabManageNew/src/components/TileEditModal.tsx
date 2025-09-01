import { useState } from 'react'
import type { Tile, BomItem } from '../stores/tilesStore'
import MaterialsSelectionModal from './MaterialsSelectionModal'

export default function TileEditModal({ tile, onClose, onSave }: { tile: Tile; onClose: () => void; onSave: (t: Partial<Tile>) => void }) {
    const [name, setName] = useState(tile.name)
    const [status, setStatus] = useState(tile.status)
    const [priority, setPriority] = useState(tile.priority || 'Średni')
    const [technology, setTechnology] = useState(tile.technology || 'Frezowanie CNC')
    const [laborCost, setLaborCost] = useState<number>(tile.laborCost || 0)
    const [bom, setBom] = useState<BomItem[]>(tile.bom || [])
    const [assignee, setAssignee] = useState<string>(tile.assignee || '')
    const [dxfFile, setDxfFile] = useState<string | null>(tile.dxfFile || null)
    const [assemblyDrawing, setAssemblyDrawing] = useState<string | null>(tile.assemblyDrawing || null)
    const [showMaterials, setShowMaterials] = useState(false)

    const addBom = () => {
        const next: BomItem = { id: crypto.randomUUID(), type: 'Materiał surowy', name: '', quantity: 1, unit: 'szt', status: 'Na stanie' }
        setBom(prev => [...prev, next])
    }
    const updateBom = (id: string, patch: Partial<BomItem>) => {
        setBom(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
    }
    const removeBom = (id: string) => setBom(prev => prev.filter(i => i.id !== id))
    return (
        <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edycja kafelka {tile.id}</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-2">
                            <label className="form-label">Nazwa</label>
                            <input className="form-control" value={name} onChange={e => setName(e.currentTarget.value)} />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Status</label>
                            <select className="form-select" value={status} onChange={e => setStatus(e.currentTarget.value as any)}>
                                <option value="W KOLEJCE">W KOLEJCE</option>
                                <option value="W TRAKCIE CIĘCIA">W TRAKCIE CIĘCIA</option>
                                <option value="WYCIĘTE">WYCIĘTE</option>
                            </select>
                        </div>
                        <div className="row g-2 mb-2">
                            <div className="col-8">
                                <label className="form-label">Technologia wiodąca</label>
                                <input className="form-control" value={technology} onChange={e => setTechnology(e.currentTarget.value)} />
                            </div>
                            <div className="col-4">
                                <label className="form-label">Koszt robocizny (PLN)</label>
                                <input type="number" className="form-control" value={laborCost} onChange={e => setLaborCost(parseFloat(e.currentTarget.value) || 0)} />
                            </div>
                        </div>
                        <div className="row g-2 mb-2">
                            <div className="col-6">
                                <label className="form-label">Projektant</label>
                                <select className="form-select" value={assignee} onChange={e => setAssignee(e.currentTarget.value)}>
                                    <option value="">— wybierz —</option>
                                    <option>Anna</option>
                                    <option>Paweł</option>
                                    <option>Ola</option>
                                    <option>Kamil</option>
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="form-label">Plik DXF</label>
                                <div className="input-group">
                                    <input className="form-control" placeholder="link lub nazwa" value={dxfFile || ''} onChange={e => setDxfFile(e.currentTarget.value || null)} />
                                    <button className="btn btn-outline-secondary" onClick={() => setDxfFile('panel.dxf')}>Przypisz</button>
                                </div>
                            </div>
                        </div>
                        <div className="row g-2 mb-2">
                            <div className="col-12">
                                <label className="form-label">Rysunek złożeniowy (PDF)</label>
                                <div className="input-group">
                                    <input className="form-control" placeholder="link lub nazwa" value={assemblyDrawing || ''} onChange={e => setAssemblyDrawing(e.currentTarget.value || null)} />
                                    <button className="btn btn-outline-secondary" onClick={() => setAssemblyDrawing('rysunek.pdf')}>Przypisz</button>
                                </div>
                            </div>
                        </div>
                        <div className="mb-2">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="form-label mb-0">Lista komponentów (BOM)</label>
                                <div className="btn-group">
                                    <button className="btn btn-sm btn-outline-primary" onClick={addBom}><i className="ri-add-line me-1"></i>Dodaj pozycję</button>
                                    <button className="btn btn-sm btn-outline-success" onClick={() => setShowMaterials(true)}><i className="ri-database-2-line me-1"></i>Z katalogu</button>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-sm align-middle">
                                    <thead><tr><th>Typ</th><th>Nazwa</th><th>Ilość</th><th>Jm</th><th>Dostawca</th><th>Status</th><th>Koszt/szt.</th><th></th></tr></thead>
                                    <tbody>
                                        {bom.map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    <select className="form-select form-select-sm" value={item.type} onChange={e => updateBom(item.id, { type: e.currentTarget.value as BomItem['type'] })}>
                                                        <option>Materiał surowy</option>
                                                        <option>Komponent gotowy</option>
                                                        <option>Usługa</option>
                                                    </select>
                                                </td>
                                                <td><input className="form-control form-control-sm" value={item.name} onChange={e => updateBom(item.id, { name: e.currentTarget.value })} /></td>
                                                <td style={{ maxWidth: 90 }}><input type="number" className="form-control form-control-sm" value={item.quantity} onChange={e => updateBom(item.id, { quantity: parseFloat(e.currentTarget.value) || 0 })} /></td>
                                                <td style={{ maxWidth: 90 }}><input className="form-control form-control-sm" value={item.unit} onChange={e => updateBom(item.id, { unit: e.currentTarget.value })} /></td>
                                                <td><input className="form-control form-control-sm" value={item.supplier || ''} onChange={e => updateBom(item.id, { supplier: e.currentTarget.value })} /></td>
                                                <td>
                                                    <select className="form-select form-select-sm" value={item.status || 'Na stanie'} onChange={e => updateBom(item.id, { status: e.currentTarget.value as any })}>
                                                        <option>Na stanie</option>
                                                        <option>Do zamówienia</option>
                                                        <option>Zamówione</option>
                                                    </select>
                                                </td>
                                                <td style={{ maxWidth: 120 }}><input type="number" className="form-control form-control-sm" value={item.unitCost || 0} onChange={e => updateBom(item.id, { unitCost: parseFloat(e.currentTarget.value) || 0 })} /></td>
                                                <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={() => removeBom(item.id)}><i className="ri-delete-bin-line"></i></button></td>
                                            </tr>
                                        ))}
                                        {bom.length === 0 && (<tr><td colSpan={8} className="text-muted text-center">Brak pozycji</td></tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Priorytet</label>
                            <select className="form-select" value={priority} onChange={e => setPriority(e.currentTarget.value as any)}>
                                <option>Wysoki</option>
                                <option>Średni</option>
                                <option>Niski</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-outline-secondary" onClick={onClose}>Anuluj</button>
                        <button className="btn btn-primary" onClick={() => onSave({ name, status, priority: priority as any, technology, laborCost, bom, assignee, dxfFile, assemblyDrawing })}>Zapisz</button>
                    </div>
                </div>
            </div>
            <MaterialsSelectionModal open={showMaterials} onClose={() => setShowMaterials(false)} onSelect={(ids) => {
                const toAdd: BomItem[] = ids.map((id, idx) => ({ id: `CAT-${id}-${idx}`, type: 'Materiał surowy', name: id, quantity: 1, unit: 'szt', status: 'Na stanie' }))
                setBom(prev => [...prev, ...toAdd])
                setShowMaterials(false)
            }} />
        </div>
    )
}


