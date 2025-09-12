import { useEstimateStore } from '../../stores/estimateStore'

export default function EstimateSummary() {
    const { lineItems, materials, laborRate, discountRate, estimatedHours, setLaborRate, setDiscountRate, setEstimatedHours } = useEstimateStore()
    const materialsTotal = lineItems.reduce((sum, li) => {
        const m = materials[li.materialId]
        return sum + (m?.unitCost || 0) * (li.quantity || 0)
    }, 0)
    const laborTotal = laborRate * (estimatedHours || 0)
    const subtotal = materialsTotal + laborTotal
    const discount = subtotal * (discountRate / 100)
    const net = subtotal - discount
    const vat = net * 0.23
    const grandTotal = net + vat

    return (
        <div className="row g-3">
            <div className="col-12 col-lg-6">
                <div className="card h-100">
                    <div className="card-body">
                        <h6 className="mb-3">Parametry</h6>
                        <div className="mb-2">
                            <label className="form-label">Stawka roboczogodziny (PLN)</label>
                            <input type="number" min={0} className="form-control" value={laborRate} onChange={e => setLaborRate(Number(e.target.value || 0))} />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Szacowane godziny</label>
                            <input type="number" min={0} className="form-control" value={estimatedHours} onChange={e => setEstimatedHours(Number(e.target.value || 0))} />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Rabat (%)</label>
                            <input type="number" min={0} max={100} className="form-control" value={discountRate} onChange={e => setDiscountRate(Number(e.target.value || 0))} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-lg-6">
                <div className="card h-100">
                    <div className="card-body">
                        <h6 className="mb-3">Podsumowanie</h6>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Materiały</span><span>{materialsTotal.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Robocizna</span><span>{laborTotal.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Rabat</span><span>-{discount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Nettto</span><span>{net.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>VAT 23%</span><span>{vat.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between fw-semibold">
                                <span>Suma</span><span>{grandTotal.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}


