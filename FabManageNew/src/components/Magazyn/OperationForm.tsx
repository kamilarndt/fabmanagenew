import { useState, useEffect } from 'react'
import type { MaterialData } from '../../data/materialsMockData'
import { useMaterialsStore } from '../../stores/materialsStore'
import { showToast } from '../../lib/notifications'

interface OperationItem {
    materialId: string
    materialName: string
    materialCode: string
    unit: string
    quantityOrdered?: number
    quantityDelivered: number
    location: string
    notes?: string
}

interface OperationFormProps {
    type: 'receive' | 'issue' | 'transfer' | 'adjust'
    materials?: MaterialData[]
    onSubmit: (operation: any) => void
    onCancel: () => void
    isOpen: boolean
    autoFillFromOrder?: boolean
}

export default function OperationForm({
    type,
    materials: prefilledMaterials,
    onSubmit,
    onCancel,
    isOpen,
    autoFillFromOrder = false
}: OperationFormProps) {
    const materials = useMaterialsStore(state => state.materials)
    const adjustMaterialStock = useMaterialsStore(state => state.adjustMaterialStock)

    const [formData, setFormData] = useState({
        documentNumber: '',
        supplier: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    })

    const [operationItems, setOperationItems] = useState<OperationItem[]>([])
    const [selectedMaterial, setSelectedMaterial] = useState('')

    // Generowanie numeru dokumentu
    useEffect(() => {
        if (isOpen) {
            const currentYear = new Date().getFullYear()
            const docType = type === 'receive' ? 'PZ' : type === 'issue' ? 'WZ' : 'KOR'
            const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')

            setFormData(prev => ({
                ...prev,
                documentNumber: `${docType}-${currentYear}/${randomNum}`
            }))
        }
    }, [isOpen, type])

    // Autouzupełnienie z zamówień
    useEffect(() => {
        if (prefilledMaterials && autoFillFromOrder) {
            const items: OperationItem[] = prefilledMaterials.map(material => ({
                materialId: material.id,
                materialName: material.name,
                materialCode: material.code,
                unit: material.unit,
                quantityOrdered: material.minStock,
                quantityDelivered: material.minStock,
                location: material.location || '',
                notes: ''
            }))
            setOperationItems(items)
        }
    }, [prefilledMaterials, autoFillFromOrder])

    const handleAddItem = () => {
        if (!selectedMaterial) return

        const material = materials.find(m => m.id === selectedMaterial)
        if (!material) return

        const newItem: OperationItem = {
            materialId: material.id,
            materialName: material.name,
            materialCode: material.code,
            unit: material.unit,
            quantityDelivered: 1,
            location: material.location || '',
            notes: ''
        }

        setOperationItems(prev => [...prev, newItem])
        setSelectedMaterial('')
    }

    const handleUpdateItem = (index: number, field: keyof OperationItem, value: any) => {
        setOperationItems(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ))
    }

    const handleRemoveItem = (index: number) => {
        setOperationItems(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (operationItems.length === 0) {
            showToast('Dodaj przynajmniej jedną pozycję', 'danger')
            return
        }

        // Aktualizacja stanów magazynowych
        operationItems.forEach(item => {
            const delta = type === 'receive' ? item.quantityDelivered : -item.quantityDelivered
            adjustMaterialStock(item.materialId, delta)
        })

        const operation = {
            ...formData,
            type,
            items: operationItems,
            createdAt: new Date()
        }

        onSubmit(operation)
        showToast(`${getFormTitle()} zostało zapisane`, 'success')
        handleReset()
    }

    const handleReset = () => {
        setFormData({
            documentNumber: '',
            supplier: '',
            date: new Date().toISOString().split('T')[0],
            notes: ''
        })
        setOperationItems([])
        setSelectedMaterial('')
    }

    const getFormTitle = () => {
        switch (type) {
            case 'receive': return 'Przyjęcie towaru (PZ)'
            case 'issue': return 'Wydanie towaru (WZ)'
            case 'transfer': return 'Przeniesienie magazynowe'
            case 'adjust': return 'Korekta stanu'
            default: return 'Operacja magazynowa'
        }
    }

    const getFormIcon = () => {
        switch (type) {
            case 'receive': return 'ri-download-2-line'
            case 'issue': return 'ri-upload-2-line'
            case 'transfer': return 'ri-exchange-line'
            case 'adjust': return 'ri-edit-line'
            default: return 'ri-file-line'
        }
    }

    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                style={{ zIndex: 1040 }}
                onClick={onCancel}
            />

            {/* Modal */}
            <div
                className="modal-dialog modal-xl position-fixed top-50 start-50 translate-middle"
                style={{ zIndex: 1050, maxHeight: '90vh' }}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className={`${getFormIcon()} me-2`}></i>
                            {getFormTitle()}
                        </h5>
                        <button type="button" className="btn-close" onClick={onCancel}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {/* Podstawowe informacje */}
                            <div className="row g-3 mb-4">
                                <div className="col-md-3">
                                    <label className="form-label">Nr dokumentu</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.documentNumber}
                                        onChange={(e) => setFormData(prev => ({ ...prev, documentNumber: e.target.value }))}
                                        required
                                    />
                                </div>

                                {type === 'receive' && (
                                    <div className="col-md-3">
                                        <label className="form-label">Dostawca</label>
                                        <select
                                            className="form-select"
                                            value={formData.supplier}
                                            onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                                            required
                                        >
                                            <option value="">Wybierz dostawcę</option>
                                            <option value="Kronopol">Kronopol</option>
                                            <option value="PlastPro">PlastPro</option>
                                            <option value="Aluprint">Aluprint</option>
                                            <option value="LightCo">LightCo</option>
                                            <option value="Egger">Egger</option>
                                            <option value="Swiss Krono">Swiss Krono</option>
                                        </select>
                                    </div>
                                )}

                                <div className="col-md-3">
                                    <label className="form-label">Data</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={formData.date}
                                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Typ operacji</label>
                                    <div className={`badge bg-${type === 'receive' ? 'success' : 'danger'} fs-6 p-2`}>
                                        <i className={`${getFormIcon()} me-1`}></i>
                                        {type === 'receive' ? 'Przyjęcie' : 'Wydanie'}
                                    </div>
                                </div>
                            </div>

                            {/* Pozycje do przyjęcia/wydania */}
                            <div className="card mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">
                                        <i className="ri-list-check me-1"></i>
                                        Pozycje do {type === 'receive' ? 'przyjęcia' : 'wydania'}
                                    </h6>
                                    <span className="badge bg-secondary">{operationItems.length} pozycji</span>
                                </div>

                                <div className="card-body">
                                    {/* Dodawanie nowej pozycji */}
                                    <div className="row g-2 mb-3 p-3 bg-light rounded">
                                        <div className="col-md-8">
                                            <select
                                                className="form-select"
                                                value={selectedMaterial}
                                                onChange={(e) => setSelectedMaterial(e.target.value)}
                                            >
                                                <option value="">Wybierz materiał do dodania...</option>
                                                {materials
                                                    .filter(m => !operationItems.some(item => item.materialId === m.id))
                                                    .map(material => (
                                                        <option key={material.id} value={material.id}>
                                                            {material.code} - {material.name}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <button
                                                type="button"
                                                className="btn btn-primary w-100"
                                                onClick={handleAddItem}
                                                disabled={!selectedMaterial}
                                            >
                                                <i className="ri-add-line me-1"></i>
                                                Dodaj
                                            </button>
                                        </div>
                                        <div className="col-md-2">
                                            <button type="button" className="btn btn-outline-secondary w-100">
                                                <i className="ri-qr-scan-line me-1"></i>
                                                Skanuj
                                            </button>
                                        </div>
                                    </div>

                                    {/* Lista pozycji */}
                                    {operationItems.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-sm align-middle">
                                                <thead>
                                                    <tr>
                                                        <th>Kod</th>
                                                        <th>Nazwa materiału</th>
                                                        {type === 'receive' && <th>Zamówione</th>}
                                                        <th>{type === 'receive' ? 'Dostarczone' : 'Wydawane'}</th>
                                                        <th>Jednostka</th>
                                                        <th>Lokalizacja</th>
                                                        <th>Status</th>
                                                        <th>Akcje</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {operationItems.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <code>{item.materialCode}</code>
                                                            </td>
                                                            <td>{item.materialName}</td>
                                                            {type === 'receive' && (
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control form-control-sm"
                                                                        value={item.quantityOrdered || ''}
                                                                        onChange={(e) => handleUpdateItem(index, 'quantityOrdered', Number(e.target.value))}
                                                                        style={{ width: '80px' }}
                                                                    />
                                                                </td>
                                                            )}
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm"
                                                                    value={item.quantityDelivered}
                                                                    onChange={(e) => handleUpdateItem(index, 'quantityDelivered', Number(e.target.value))}
                                                                    min="0"
                                                                    required
                                                                    style={{ width: '80px' }}
                                                                />
                                                            </td>
                                                            <td>{item.unit}</td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    value={item.location}
                                                                    onChange={(e) => handleUpdateItem(index, 'location', e.target.value)}
                                                                    placeholder="A1-01"
                                                                    style={{ width: '80px' }}
                                                                />
                                                            </td>
                                                            <td>
                                                                {type === 'receive' && item.quantityOrdered ? (
                                                                    <span className={`badge ${item.quantityDelivered === item.quantityOrdered
                                                                        ? 'bg-success'
                                                                        : item.quantityDelivered > item.quantityOrdered
                                                                            ? 'bg-warning'
                                                                            : 'bg-danger'
                                                                        }`}>
                                                                        {item.quantityDelivered === item.quantityOrdered
                                                                            ? '✓ Komplet'
                                                                            : item.quantityDelivered > item.quantityOrdered
                                                                                ? '⚠ Nadmiar'
                                                                                : '⚠ Niedobór'
                                                                        }
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge bg-success">✓ OK</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleRemoveItem(index)}
                                                                    title="Usuń pozycję"
                                                                >
                                                                    <i className="ri-delete-bin-line"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted py-4">
                                            <i className="ri-inbox-line fs-1 d-block mb-2"></i>
                                            <p>Brak pozycji do {type === 'receive' ? 'przyjęcia' : 'wydania'}</p>
                                            <p className="small">Dodaj materiały używając formularza powyżej</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Uwagi */}
                            <div className="mb-3">
                                <label className="form-label">Uwagi</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Dodatkowe informacje o operacji..."
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="d-flex justify-content-between w-100 align-items-center">
                                <div className="text-muted small">
                                    <i className="ri-information-line me-1"></i>
                                    Zmiany w stanach zostaną zastosowane po zapisaniu
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                                        <i className="ri-close-line me-1"></i>
                                        Anuluj
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={operationItems.length === 0}
                                    >
                                        <i className="ri-save-line me-1"></i>
                                        Zapisz i zamknij
                                    </button>
                                    <button type="button" className="btn btn-outline-primary">
                                        <i className="ri-printer-line me-1"></i>
                                        Drukuj etykiety
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
