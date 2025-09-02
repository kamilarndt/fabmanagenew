import { useEffect, useState } from 'react'
import { fetchMaterials } from '../../api/estimate'
import { useEstimateStore } from '../../stores/estimateStore'

export default function MaterialSelector() {
    const addLineItem = useEstimateStore(s => s.addLineItem)
    const setMaterials = useEstimateStore(s => s.setMaterials)
    const [materials, setLocalMaterials] = useState<{ id: string; name: string; category: string }[]>([])
    const [selected, setSelected] = useState('')

    useEffect(() => {
        fetchMaterials().then(list => {
            setLocalMaterials(list)
            setMaterials(list)
        }).catch(() => { })
    }, [setMaterials])

    return (
        <div className="d-flex gap-2 align-items-end">
            <div className="flex-grow-1">
                <label className="form-label">Dodaj materiał</label>
                <select className="form-select" value={selected} onChange={e => setSelected(e.target.value)}>
                    <option value="">Wybierz materiał...</option>
                    {materials.map(m => (
                        <option key={m.id} value={m.id}>{m.category} — {m.name}</option>
                    ))}
                </select>
            </div>
            <button
                className="btn btn-primary"
                onClick={() => {
                    if (!selected) return
                    addLineItem(selected)
                    setSelected('')
                }}
            >
                <i className="ri-add-line me-1"></i>Dodaj
            </button>
        </div>
    )
}


