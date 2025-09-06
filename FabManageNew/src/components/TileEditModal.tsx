import { useState, useCallback, useRef } from 'react'
import { useMaterialsStore } from '../stores/materialsStore'
import type { Tile, BomItem } from '../stores/tilesStore'
import MaterialsSelectionModal from './MaterialsSelectionModal'
import SlideOver from './Ui/SlideOver'
import FileUploadZone from './Ui/FileUploadZone'
import DxfPreview from './DxfPreview'
import DxfFullscreenModal from './DxfFullscreenModal'
import { showToast } from '../lib/toast'
import { createTileDemand } from '../api/demands'

export default function TileEditModal({ tile, onClose, onSave }: { tile: Tile; onClose: () => void; onSave: (t: Partial<Tile>) => void }) {
    const [name, setName] = useState(tile.name)
    const [status, setStatus] = useState(tile.status)
    const [priority] = useState(tile.priority || 'Średni')
    const [technology, setTechnology] = useState(tile.technology || 'Frezowanie CNC')
    const [laborCost, setLaborCost] = useState<number>(tile.laborCost || 0)
    const [bom, setBom] = useState<BomItem[]>(tile.bom || [])
    const [assignee, setAssignee] = useState<string>(tile.assignee || '')
    const [dxfFile, setDxfFile] = useState<string | null>(tile.dxfFile || null)
    const [assemblyDrawing, setAssemblyDrawing] = useState<string | null>(tile.assemblyDrawing || null)
    const [dxfFileObj, setDxfFileObj] = useState<File | null>(null)
    const [showDxfFullscreen, setShowDxfFullscreen] = useState(false)
    const [showMaterials, setShowMaterials] = useState(false)
    const adjustMaterialStock = useMaterialsStore(s => s.adjustMaterialStock)
    const materials = useMaterialsStore(s => s.materials)
    const sessionAdjustmentsRef = useRef<Map<string, number>>(new Map())

    const isSheetUnit = (unit?: string) => (unit || '').toLowerCase().includes('ark')
    const applyStockDelta = (materialId: string, delta: number) => {
        if (!delta) return
        adjustMaterialStock(materialId, delta)
        const m = sessionAdjustmentsRef.current.get(materialId) || 0
        sessionAdjustmentsRef.current.set(materialId, m + delta)
    }

    const revertSessionAdjustments = () => {
        const entries = Array.from(sessionAdjustmentsRef.current.entries())
        for (const [materialId, delta] of entries) {
            if (delta) adjustMaterialStock(materialId, -delta)
        }
        sessionAdjustmentsRef.current.clear()
    }

    const addBom = useCallback(() => {
        const next: BomItem = { id: crypto.randomUUID(), type: 'Materiał surowy', name: '', quantity: 1, unit: 'szt', status: 'Na stanie' }
        setBom(prev => [...prev, next])
    }, [])

    const updateBom = useCallback((id: string, patch: Partial<BomItem>) => {
        setBom(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
    }, [])

    const removeBom = useCallback((id: string) => {
        setBom(prev => {
            const item = prev.find(i => i.id === id)
            if (item && item.materialId && isSheetUnit(item.unit)) {
                const qty = item.quantity || 0
                if (qty > 0) applyStockDelta(item.materialId, +qty)
            }
            return prev.filter(i => i.id !== id)
        })
    }, [])

    const handleCancel = () => {
        revertSessionAdjustments()
        onClose()
    }

    const createDemandsFromBom = async () => {
        try {
            const projectId = tile.project
            const bomList = bom || []
            let created = 0
            for (const item of bomList) {
                if (!item.materialId || !item.quantity) continue
                await createTileDemand(tile.id, {
                    materialId: item.materialId,
                    requiredQty: item.quantity,
                    projectId,
                    name: item.name
                })
                created++
            }
            if (created > 0) showToast(`Utworzono ${created} zapotrzebowań dla elementu ${tile.id}`, 'success')
        } catch {
            showToast('Nie udało się utworzyć zapotrzebowań', 'danger')
        }
    }

    const footer = (
        <>
            <button className="btn btn-outline-secondary" onClick={handleCancel}>Anuluj</button>
            <button className="btn btn-primary" onClick={() => onSave({ name, status, priority: priority as any, technology, laborCost, bom, assignee, dxfFile, assemblyDrawing })}>Zapisz</button>
        </>
    )

    return (
        <>
            <SlideOver open title={`Edycja kafelka ${tile.id}`} onClose={handleCancel} footer={footer}>
                <div className="mb-2">
                    <label className="form-label">Nazwa</label>
                    <input className="form-control" value={name} onChange={e => setName(e.currentTarget.value)} />
                </div>
                <div className="mb-2">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={status} onChange={e => setStatus(e.currentTarget.value as any)}>
                        <option value="do_review">Do review</option>
                        <option value="zaakceptowany">Zaakceptowany</option>
                        <option value="w_produkcji">W produkcji</option>
                        <option value="gotowy">Gotowy</option>
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
                    <div className="col-12">
                        <label className="form-label">Projektant</label>
                        <select className="form-select" value={assignee} onChange={e => setAssignee(e.currentTarget.value)}>
                            <option value="">— wybierz —</option>
                            <option>Anna</option>
                            <option>Paweł</option>
                            <option>Ola</option>
                            <option>Kamil</option>
                        </select>
                    </div>
                </div>

                {/* File uploads section */}
                <div className="row g-3 mb-3">
                    <div className="col-md-6">
                        <FileUploadZone
                            label="Plik DXF"
                            value={dxfFile}
                            onChange={setDxfFile}
                            onFileObjectChange={setDxfFileObj}
                            acceptedTypes=".dxf,.dwg"
                            placeholder="panel.dxf"
                            description="Plik do cięcia CNC"
                        />
                        {dxfFileObj && (
                            <div className="mt-2">
                                <DxfPreview file={dxfFileObj} />
                                <div className="text-end mt-2">
                                    <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => setShowDxfFullscreen(true)}>
                                        Podgląd DXF (pełny ekran)
                                    </button>
                                    <a
                                        className="btn btn-outline-primary btn-sm"
                                        href="https://github.com/vagran/dxf-viewer"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Silnik podglądu: dxf-viewer
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-md-6">
                        <FileUploadZone
                            label="Rysunek złożeniowy (PDF)"
                            value={assemblyDrawing}
                            onChange={setAssemblyDrawing}
                            acceptedTypes=".pdf"
                            placeholder="rysunek.pdf"
                            description="Instrukcja montażu"
                        />
                    </div>
                </div>
                <div className="mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <label className="form-label mb-0">Lista komponentów (BOM)</label>
                        <div className="btn-group">
                            <button className="btn btn-sm btn-outline-primary" onClick={addBom}>
                                <i className="ri-add-line me-1"></i>Dodaj pozycję
                            </button>
                            <button className="btn btn-sm btn-outline-success" onClick={() => setShowMaterials(true)}>
                                <i className="ri-database-2-line me-1"></i>Z katalogu
                            </button>
                            <button className="btn btn-sm btn-outline-warning" onClick={createDemandsFromBom}>
                                <i className="ri-shopping-cart-2-line me-1"></i>Generuj zapotrzebowanie
                            </button>
                        </div>
                    </div>

                    {bom.length === 0 ? (
                        <div className="text-center py-5 border border-dashed rounded">
                            <i className="ri-inbox-line fs-1 text-muted"></i>
                            <h6 className="text-muted mt-2">Brak komponentów</h6>
                            <p className="text-muted mb-3">Dodaj materiały do listy BOM</p>
                            <button className="btn btn-outline-primary btn-sm me-2" onClick={addBom}>
                                <i className="ri-add-line me-1"></i>Dodaj pozycję
                            </button>
                            <button className="btn btn-outline-success btn-sm" onClick={() => setShowMaterials(true)}>
                                <i className="ri-database-2-line me-1"></i>Z katalogu
                            </button>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {bom.map(item => {
                                const getTypeIcon = (type: string) => {
                                    switch (type) {
                                        case 'Materiał surowy': return '🪵'
                                        case 'Komponent gotowy': return '⚙️'
                                        case 'Usługa': return '🔧'
                                        default: return '📦'
                                    }
                                }

                                const getStatusColor = (status: string) => {
                                    switch (status) {
                                        case 'Na stanie': return 'success'
                                        case 'Do zamówienia': return 'warning'
                                        case 'Zamówione': return 'info'
                                        default: return 'secondary'
                                    }
                                }

                                const totalCost = (item.quantity || 0) * (item.unitCost || 0)

                                return (
                                    <div key={item.id} className="col-md-6 col-lg-4">
                                        <div className="card h-100">
                                            <div className="card-body p-3">
                                                {/* Header with icon and delete */}
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="d-flex align-items-center">
                                                        <span className="fs-4 me-2">{getTypeIcon(item.type)}</span>
                                                        <span className={`badge bg-${getStatusColor(item.status || 'Na stanie')}`}>
                                                            {item.status || 'Na stanie'}
                                                        </span>
                                                    </div>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => removeBom(item.id)}
                                                        aria-label="Usuń pozycję"
                                                    >
                                                        <i className="ri-delete-bin-line"></i>
                                                    </button>
                                                </div>

                                                {/* Type selector */}
                                                <div className="mb-2">
                                                    <label className="form-label small">Typ</label>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={item.type}
                                                        onChange={e => updateBom(item.id, { type: e.currentTarget.value as BomItem['type'] })}
                                                    >
                                                        <option>Materiał surowy</option>
                                                        <option>Komponent gotowy</option>
                                                        <option>Usługa</option>
                                                    </select>
                                                </div>

                                                {/* Name */}
                                                <div className="mb-2">
                                                    <label className="form-label small">Nazwa</label>
                                                    <input
                                                        className="form-control form-control-sm"
                                                        value={item.name}
                                                        onChange={e => updateBom(item.id, { name: e.currentTarget.value })}
                                                        placeholder="Nazwa materiału..."
                                                    />
                                                </div>

                                                {/* Quantity and Unit */}
                                                <div className="row g-2 mb-2">
                                                    <div className="col-7">
                                                        <label className="form-label small">Ilość</label>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm"
                                                            value={item.quantity}
                                                            onChange={e => {
                                                                const nextQty = parseFloat(e.currentTarget.value) || 0
                                                                const prevQty = item.quantity || 0
                                                                // Adjust inventory immediately if linked to a material (sheets only)
                                                                if (item.materialId && isSheetUnit(item.unit)) {
                                                                    const delta = -(nextQty - prevQty) // negative = consume
                                                                    if (delta < 0) {
                                                                        const m = materials.find(mm => mm.id === item.materialId)
                                                                        const need = -delta
                                                                        const available = m?.stock ?? 0
                                                                        if (available < need) {
                                                                            showToast(`Brak stanu: dostępne ${available}, potrzebne ${need}`, 'danger')
                                                                            // Revert input to prev value
                                                                            updateBom(item.id, { quantity: prevQty })
                                                                            return
                                                                        }
                                                                    }
                                                                    if (delta !== 0) applyStockDelta(item.materialId, delta)
                                                                }
                                                                updateBom(item.id, { quantity: nextQty })
                                                            }}
                                                            step="0.1"
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="col-5">
                                                        <label className="form-label small">J.m.</label>
                                                        <input
                                                            className="form-control form-control-sm"
                                                            value={item.unit}
                                                            onChange={e => updateBom(item.id, { unit: e.currentTarget.value })}
                                                            placeholder="szt"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Supplier */}
                                                <div className="mb-2">
                                                    <label className="form-label small">Dostawca</label>
                                                    <input
                                                        className="form-control form-control-sm"
                                                        value={item.supplier || ''}
                                                        onChange={e => updateBom(item.id, { supplier: e.currentTarget.value })}
                                                        placeholder="Nazwa dostawcy..."
                                                    />
                                                </div>

                                                {/* Status */}
                                                <div className="mb-2">
                                                    <label className="form-label small">Status</label>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={item.status || 'Na stanie'}
                                                        onChange={e => updateBom(item.id, { status: e.currentTarget.value as any })}
                                                    >
                                                        <option>Na stanie</option>
                                                        <option>Do zamówienia</option>
                                                        <option>Zamówione</option>
                                                    </select>
                                                </div>

                                                {/* Cost */}
                                                <div className="mb-2">
                                                    <label className="form-label small">Koszt jednostkowy (PLN)</label>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        value={item.unitCost || 0}
                                                        onChange={e => updateBom(item.id, { unitCost: parseFloat(e.currentTarget.value) || 0 })}
                                                        step="0.01"
                                                        min="0"
                                                    />
                                                </div>

                                                {/* Total cost display */}
                                                {totalCost > 0 && (
                                                    <div className="bg-light p-2 rounded">
                                                        <small className="text-muted">Łączny koszt:</small>
                                                        <div className="fw-bold text-primary">
                                                            {totalCost.toFixed(2)} PLN
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* BOM Summary */}
                    {bom.length > 0 && (
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="card bg-light">
                                    <div className="card-body p-3">
                                        <h6 className="card-title mb-2">
                                            <i className="ri-calculator-line me-2"></i>
                                            Podsumowanie BOM
                                        </h6>
                                        <div className="row g-3">
                                            <div className="col-md-3">
                                                <div className="text-center">
                                                    <div className="fs-4 fw-bold text-primary">{bom.length}</div>
                                                    <small className="text-muted">Pozycji</small>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="text-center">
                                                    <div className="fs-4 fw-bold text-success">
                                                        {bom.reduce((sum, item) => sum + (item.quantity || 0), 0).toFixed(1)}
                                                    </div>
                                                    <small className="text-muted">Łączna ilość</small>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="text-center">
                                                    <div className="fs-4 fw-bold text-info">
                                                        {bom.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitCost || 0)), 0).toFixed(2)}
                                                    </div>
                                                    <small className="text-muted">Koszt materiałów (PLN)</small>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="text-center">
                                                    <div className="fs-4 fw-bold text-warning">
                                                        {(bom.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitCost || 0)), 0) + laborCost).toFixed(2)}
                                                    </div>
                                                    <small className="text-muted">Koszt całkowity (PLN)</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <MaterialsSelectionModal
                    open={showMaterials}
                    onClose={useCallback(() => setShowMaterials(false), [])}
                    onSelect={useCallback((ids: string[]) => {
                        // Map IDs (MaterialData.id) to actual materials from store
                        const toAdd: BomItem[] = ids.map((id, idx) => {
                            const m = materials.find(mm => mm.id === id)
                            return {
                                id: `MAT-${id}-${idx}`,
                                type: 'Materiał surowy' as const,
                                name: m?.name || id,
                                quantity: 1,
                                unit: m?.unit || 'szt',
                                status: 'Na stanie' as const,
                                unitCost: m?.price || 0,
                                materialId: id
                            }
                        })
                        setBom(prev => [...prev, ...toAdd])
                        setShowMaterials(false)
                    }, [materials])}
                />
            </SlideOver>
            <DxfFullscreenModal open={showDxfFullscreen} onClose={() => setShowDxfFullscreen(false)} file={dxfFileObj} />
        </>
    )
}


