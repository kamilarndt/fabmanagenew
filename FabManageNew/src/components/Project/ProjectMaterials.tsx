interface PurchaseItem {
    name: string
    unit: string
    quantity: number
    supplier?: string
}

interface ProjectMaterialsProps {
    purchaseList: PurchaseItem[]
}

export default function ProjectMaterials({ purchaseList }: ProjectMaterialsProps) {
    const handleExportCSV = () => {
        const rows = purchaseList.map(i => ({ 
            name: i.name, 
            unit: i.unit, 
            quantity: i.quantity, 
            supplier: i.supplier || '' 
        }))
        const csv = [
            'name,unit,quantity,supplier', 
            ...rows.map(r => `"${r.name}",${r.unit},${r.quantity},${r.supplier}`)
        ].join('\n')
        
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `zakupy_${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Lista zakupowa (Do zamówienia)</h5>
                <button className="btn btn-sm btn-outline-info" onClick={handleExportCSV}>
                    <i className="ri-file-download-line me-1"></i>Export CSV
                </button>
            </div>
            <div className="table-responsive">
                <table className="table table-sm align-middle">
                    <thead>
                        <tr>
                            <th>Pozycja</th>
                            <th>Jm</th>
                            <th>Ilość</th>
                            <th>Dostawca</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseList.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.name}</td>
                                <td>{item.unit}</td>
                                <td>{item.quantity}</td>
                                <td>{item.supplier || '-'}</td>
                            </tr>
                        ))}
                        {purchaseList.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-muted text-center">
                                    Brak pozycji do zamówienia
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
