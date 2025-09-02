import { useEstimateStore } from '../../stores/estimateStore'

export default function EstimateLineItem({ materialId }: { materialId: string }) {
    const { materials, lineItems, updateQuantity, removeLineItem } = useEstimateStore()
    const row = lineItems.find(li => li.materialId === materialId)!
    const m = materials[materialId]
    const qty = row?.quantity ?? 0
    const unitCost = m?.unitCost ?? 0
    const total = unitCost * qty

    return (
        <tr>
            <td className="text-muted small">{m?.category || '-'}</td>
            <td className="fw-medium">{m?.name || materialId}</td>
            <td style={{ width: 140 }}>
                <input
                    type="number"
                    min={0}
                    className="form-control"
                    value={qty}
                    onChange={e => updateQuantity(materialId, Number(e.target.value || 0))}
                />
            </td>
            <td className="text-muted">{m?.unit || '-'}</td>
            <td>{unitCost.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</td>
            <td className="fw-semibold">{total.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</td>
            <td>
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeLineItem(materialId)}>
                    <i className="ri-delete-bin-6-line"></i>
                </button>
            </td>
        </tr>
    )
}


