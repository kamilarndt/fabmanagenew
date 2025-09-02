import { useState, useMemo } from 'react'
import SlideOver from './Ui/SlideOver'
import { mockMaterials, type MaterialData } from '../data/materialsMockData'

type PickerMaterial = {
    id: string
    name: string
    unit: string
    categoryPath: string
    description?: string
    unitCost: number
    inStock: number
    image?: string
}

const materialsFromWarehouse: PickerMaterial[] = mockMaterials.map((m: MaterialData): PickerMaterial => ({
    id: m.id,
    name: m.name,
    unit: m.unit,
    categoryPath: m.category.join(' > '),
    description: [m.code, m.thickness ? `${m.thickness}mm` : undefined, m.supplier].filter(Boolean).join(' · '),
    unitCost: m.price,
    inStock: m.stock,
    image: '📦'
}))

const categories = ['Wszystkie', ...Array.from(new Set(materialsFromWarehouse.map(m => m.categoryPath)))]

export default function MaterialsSelectionModal({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (ids: string[]) => void }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Wszystkie')
    const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set())

    const filteredMaterials = useMemo(() => {
        return materialsFromWarehouse.filter(material => {
            const hay = [material.name, material.description, material.id, material.categoryPath].filter(Boolean).join(' ').toLowerCase()
            const matchesSearch = hay.includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === 'Wszystkie' || material.categoryPath === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [searchTerm, selectedCategory])

    const toggleMaterial = (id: string) => {
        const newSelected = new Set(selectedMaterials)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedMaterials(newSelected)
    }

    const handleAddSelected = () => {
        if (selectedMaterials.size > 0) {
            onSelect(Array.from(selectedMaterials))
            setSelectedMaterials(new Set())
        }
    }

    const quickAdd = (id: string) => {
        onSelect([id])
    }

    const body = (
        <div>
            {/* Search and Filter Bar */}
            <div className="mb-4">
                <div className="row g-3">
                    <div className="col-md-8">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="ri-search-line"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Szukaj materiałów..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Selected Materials Counter */}
            {selectedMaterials.size > 0 && (
                <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
                    <span>
                        <i className="ri-checkbox-line me-2"></i>
                        Wybrano: {selectedMaterials.size} materiał(ów)
                    </span>
                    <button className="btn btn-sm btn-primary" onClick={handleAddSelected}>
                        <i className="ri-add-line me-1"></i>Dodaj wybrane
                    </button>
                </div>
            )}

            {/* Materials Grid */}
            <div className="row g-3">
                {filteredMaterials.map(material => (
                    <div key={material.id} className="col-md-6 col-lg-4">
                        <div className={`card h-100 ${selectedMaterials.has(material.id) ? 'border-primary bg-primary bg-opacity-10' : ''}`}>
                            <div className="card-body">
                                <div className="d-flex align-items-start justify-content-between mb-2">
                                    <div className="d-flex align-items-center">
                                        <span className="fs-2 me-2">{material.image}</span>
                                        <div>
                                            <h6 className="card-title mb-0">{material.name}</h6>
                                            <small className="text-muted">{material.id}</small>
                                            <div className="small text-muted">{material.categoryPath}</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectedMaterials.has(material.id)}
                                        onChange={() => toggleMaterial(material.id)}
                                    />
                                </div>

                                <div className="mb-2">
                                    <span className="badge bg-secondary mb-1">{material.unit}</span>
                                </div>

                                {material.description && (
                                    <p className="card-text small text-muted mb-2">{material.description}</p>
                                )}

                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <strong className="text-primary">{material.unitCost.toFixed(2)} PLN</strong>
                                        <small className="text-muted">/{material.unit}</small>
                                    </div>
                                    <div className="text-end">
                                        <small className={`text-${material.inStock > 10 ? 'success' : material.inStock > 0 ? 'warning' : 'danger'}`}>
                                            <i className={`ri-${material.inStock > 10 ? 'checkbox-circle' : material.inStock > 0 ? 'error-warning' : 'close-circle'}-line me-1`}></i>
                                            {material.inStock} {material.unit}
                                        </small>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-sm btn-outline-primary w-100"
                                    onClick={() => quickAdd(material.id)}
                                >
                                    <i className="ri-add-line me-1"></i>Dodaj teraz
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredMaterials.length === 0 && (
                <div className="text-center py-5">
                    <i className="ri-search-line fs-1 text-muted"></i>
                    <h5 className="text-muted mt-2">Brak wyników</h5>
                    <p className="text-muted">Spróbuj zmienić kryteria wyszukiwania</p>
                </div>
            )}
        </div>
    )

    const footer = (
        <div className="d-flex justify-content-between w-100">
            <button className="btn btn-outline-secondary" onClick={onClose}>
                Anuluj
            </button>
            {selectedMaterials.size > 0 && (
                <button className="btn btn-primary" onClick={handleAddSelected}>
                    <i className="ri-add-line me-1"></i>
                    Dodaj wybrane ({selectedMaterials.size})
                </button>
            )}
        </div>
    )

    return (
        <SlideOver open={open} onClose={onClose} title="Katalog materiałów" footer={footer} width={800}>
            {body}
        </SlideOver>
    )
}


