import { useState, useMemo, useEffect } from 'react'
import { useEstimateStore } from '../../stores/estimateStore'
import { fetchMaterials, postEstimate } from '../../api/estimate'
import { Card, Statistic, Row, Col, Space, Typography } from 'antd'

interface EstimateItem {
    id: string
    name: string
    category: 'materials' | 'labor' | 'equipment' | 'overhead' | 'logistics'
    quantity: number
    unit: string
    unitCost: number
    totalCost: number
    notes?: string
}

interface ProjectLocation {
    departure: string // Miejsce wyjazdu (fabryka)
    destination: string // Miejsce realizacji (klient)
    distance: number // km
    travelTime: number // godziny
}

interface TeamRequirements {
    peopleCount: number // Ilość osób
    duration: number // Czas realizacji w dniach
    workHoursPerDay: number // Godziny pracy dziennie
}

export default function EstimateBuilder() {
    const {
        lineItems,
        addLineItem,
        removeLineItem,
        setLaborRate,
        setDiscountRate,
        laborRate,
        discountRate,
        materials,
        setMaterials,
        updateQuantity
    } = useEstimateStore()

    const [newItem, setNewItem] = useState({
        name: '',
        category: 'materials' as EstimateItem['category'],
        quantity: 1,
        unit: '',
        unitCost: 0,
        notes: ''
    })

    // Load materials from API once (if empty)
    useEffect(() => {
        if (Object.keys(materials).length > 0) return
            ; (async () => {
                try {
                    const list = await fetchMaterials()
                    setMaterials(list)
                } catch {
                    // ignore
                }
            })()
    }, [materials, setMaterials])

    // Material picker state
    const [selectedMaterialId, setSelectedMaterialId] = useState('')

    // Mapping helpers
    const toItemCategory = (storeCategory?: string): EstimateItem['category'] => {
        if (!storeCategory) return 'materials'
        const c = storeCategory.toLowerCase()
        if (c.includes('usług') || c.includes('robociz')) return 'labor'
        if (c.includes('sprzęt') || c.includes('equipment')) return 'equipment'
        if (c.includes('ogóln') || c.includes('overhead')) return 'overhead'
        if (c.includes('logistyk')) return 'logistics'
        return 'materials'
    }

    const toStoreCategory = (uiCategory: EstimateItem['category']): string => {
        switch (uiCategory) {
            case 'labor': return 'Usługi'
            case 'equipment': return 'Sprzęt'
            case 'overhead': return 'Koszty ogólne'
            case 'logistics': return 'Logistyka'
            default: return 'Materiały'
        }
    }

    // Build display items by joining lineItems with materials map
    const estimateItems: EstimateItem[] = useMemo(() => {
        return lineItems.map((li, index) => {
            const m = materials[li.materialId]
            const name = m?.name || `Pozycja ${index + 1}`
            const unit = m?.unit || 'szt'
            const unitCost = m?.unitCost ?? 0
            const notes = m?.description || ''
            const category = toItemCategory(m?.category)
            return {
                id: li.materialId,
                name,
                category,
                quantity: li.quantity,
                unit,
                unitCost,
                totalCost: unitCost * li.quantity,
                notes
            }
        })
    }, [lineItems, materials])

    const totalCost = useMemo(() =>
        estimateItems.reduce((sum, item) => sum + item.totalCost, 0),
        [estimateItems]
    )

    const categoryTotals = useMemo(() => {
        const totals = { materials: 0, labor: 0, equipment: 0, overhead: 0, logistics: 0 }
        estimateItems.forEach(item => {
            totals[item.category] += item.totalCost
        })
        return totals
    }, [estimateItems])

    // Logistics state and calculations
    const [projectLocation, setProjectLocation] = useState<ProjectLocation>({
        departure: 'Fabryka - Warszawa',
        destination: '',
        distance: 0,
        travelTime: 0
    })

    const [teamRequirements, setTeamRequirements] = useState<TeamRequirements>({
        peopleCount: 2,
        duration: 3,
        workHoursPerDay: 8
    })

    const [logisticsCosts] = useState({
        fuelCostPerKm: 2.50,
        accommodationCostPerPerson: 150,
        mealCostPerPerson: 80,
        transportRentalPerDay: 300,
        driverCostPerHour: 25
    })

    const calculatedLogisticsCosts = useMemo(() => {
        if (!projectLocation.destination || projectLocation.distance === 0) return null
        const totalDistance = projectLocation.distance * 2
        const totalTravelTime = projectLocation.travelTime * 2
        const fuelCost = totalDistance * logisticsCosts.fuelCostPerKm
        const transportRentalCost = logisticsCosts.transportRentalPerDay * Math.ceil(teamRequirements.duration)
        const driverCost = totalTravelTime * logisticsCosts.driverCostPerHour
        const accommodationCost = teamRequirements.peopleCount * teamRequirements.duration * logisticsCosts.accommodationCostPerPerson
        const mealCost = teamRequirements.peopleCount * teamRequirements.duration * logisticsCosts.mealCostPerPerson
        const onSiteLaborCost = teamRequirements.peopleCount * teamRequirements.duration * teamRequirements.workHoursPerDay * (laborRate || 120)
        return {
            fuelCost,
            transportRentalCost,
            driverCost,
            accommodationCost,
            mealCost,
            onSiteLaborCost,
            totalLogisticsCost: fuelCost + transportRentalCost + driverCost + accommodationCost + mealCost + onSiteLaborCost
        }
    }, [projectLocation, teamRequirements, logisticsCosts, laborRate])

    const handleAddItem = () => {
        if (selectedMaterialId) {
            addLineItem(selectedMaterialId)
            setSelectedMaterialId('')
            return
        }
        if (!newItem.name.trim() || !newItem.unit.trim() || newItem.unitCost <= 0) return
        const newMaterialId = crypto.randomUUID()
        const material = {
            id: newMaterialId,
            category: toStoreCategory(newItem.category),
            name: newItem.name.trim(),
            unit: newItem.unit.trim(),
            unitCost: newItem.unitCost,
            description: newItem.notes || ''
        }
        const currentList = Object.values(materials)
        setMaterials([...currentList, material])
        addLineItem(newMaterialId)
        setNewItem({ name: '', category: 'materials', quantity: 1, unit: '', unitCost: 0, notes: '' })
    }

    const handleDeleteItem = (id: string) => {
        removeLineItem(id)
    }

    const generatePdf = async () => {
        try {
            const blob = await postEstimate({
                projectId: 'unknown',
                lineItems,
                laborRate,
                discountRate
            })
            const url = URL.createObjectURL(blob)
            window.open(url, '_blank')
        } catch {
            // ignore for now
        }
    }

    const getCategoryLabel = (category: EstimateItem['category']) => {
        switch (category) {
            case 'materials': return 'Materiały'
            case 'labor': return 'Robocizna'
            case 'equipment': return 'Sprzęt'
            case 'overhead': return 'Koszty ogólne'
            case 'logistics': return 'Logistyka'
            default: return category
        }
    }

    const getCategoryBadgeClass = (category: EstimateItem['category']) => {
        switch (category) {
            case 'materials': return 'bg-primary'
            case 'labor': return 'bg-success'
            case 'equipment': return 'bg-warning'
            case 'overhead': return 'bg-info'
            case 'logistics': return 'bg-purple'
            default: return 'bg-secondary'
        }
    }

    const calculateDistance = (destination: string) => {
        const mockDistances: { [key: string]: number } = {
            'Kraków': 300,
            'Gdańsk': 350,
            'Wrocław': 350,
            'Poznań': 300,
            'Łódź': 130,
            'Katowice': 250,
            'Lublin': 150,
            'Białystok': 200
        }
        const distance = mockDistances[destination] || Math.random() * 500 + 100
        const travelTime = Math.ceil(distance / 80)
        setProjectLocation(prev => ({ ...prev, destination, distance, travelTime }))
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Wycena Projektu z Automatyczną Logistyką</h5>
                <div>
                    <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => setDiscountRate((discountRate || 0))}>
                        Rabat: {discountRate.toFixed(1)}%
                    </button>
                    <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addEstimateItemModal">
                        <i className="ri-add-line me-1"></i>Dodaj pozycję
                    </button>
                </div>
            </div>

            {/* LOGISTICS AUTOMATION PANEL */}
            <Card className="mb-4" title={<span><i className="ri-route-line me-2"></i>Automatyczne Obliczenia Logistyczne</span>}>
                <div className="row g-3">
                    {/* Project Location */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Miejsce wyjazdu:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={projectLocation.departure}
                            onChange={(e) => setProjectLocation(prev => ({ ...prev, departure: e.target.value }))}
                            placeholder="Fabryka - Warszawa"
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Miejsce realizacji:</label>
                        <select
                            className="form-select"
                            value={projectLocation.destination}
                            onChange={(e) => calculateDistance(e.target.value)}
                        >
                            <option value="">Wybierz miasto...</option>
                            <option value="Kraków">Kraków</option>
                            <option value="Gdańsk">Gdańsk</option>
                            <option value="Wrocław">Wrocław</option>
                            <option value="Poznań">Poznań</option>
                            <option value="Łódź">Łódź</option>
                            <option value="Katowice">Katowice</option>
                            <option value="Lublin">Lublin</option>
                            <option value="Białystok">Białystok</option>
                        </select>
                    </div>

                    {/* Distance and Travel Time Display */}
                    {projectLocation.distance > 0 && (
                        <div className="col-12">
                            <div className="row g-2">
                                <div className="col-md-3">
                                    <div className="text-center p-2 bg-light rounded">
                                        <small className="text-muted d-block">Odległość</small>
                                        <strong className="text-primary">{projectLocation.distance} km</strong>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="text-center p-2 bg-light rounded">
                                        <small className="text-muted d-block">Czas podróży</small>
                                        <strong className="text-info">{projectLocation.travelTime} h</strong>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="text-center p-2 bg-light rounded">
                                        <small className="text-muted d-block">Koszt paliwa</small>
                                        <strong className="text-success">
                                            {calculatedLogisticsCosts?.fuelCost.toLocaleString('pl-PL')} PLN
                                        </strong>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="text-center p-2 bg-light rounded">
                                        <small className="text-muted d-block">Koszt transportu</small>
                                        <strong className="text-warning">
                                            {calculatedLogisticsCosts?.transportRentalCost.toLocaleString('pl-PL')} PLN
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* TEAM REQUIREMENTS PANEL */}
            <Card className="mb-4" title={<span><i className="ri-team-line me-2"></i>Wymagania Zespołu i Automatyczne Obliczenia</span>}>
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Ilość osób:</label>
                        <input
                            type="number"
                            className="form-control"
                            value={teamRequirements.peopleCount}
                            onChange={(e) => setTeamRequirements(prev => ({ ...prev, peopleCount: parseInt(e.target.value) || 1 }))}
                            min="1"
                            max="20"
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Czas realizacji (dni):</label>
                        <input
                            type="number"
                            className="form-control"
                            value={teamRequirements.duration}
                            onChange={(e) => setTeamRequirements(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                            min="1"
                            max="30"
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Godziny pracy/dzień:</label>
                        <input
                            type="number"
                            className="form-control"
                            value={teamRequirements.workHoursPerDay}
                            onChange={(e) => setTeamRequirements(prev => ({ ...prev, workHoursPerDay: parseInt(e.target.value) || 8 }))}
                            min="4"
                            max="12"
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Stawka robocizny:</label>
                        <input
                            type="number"
                            className="form-control"
                            value={laborRate || 120}
                            onChange={(e) => setLaborRate(parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                {/* Automatic Calculations Display */}
                {calculatedLogisticsCosts && (
                    <div className="row g-3 mt-3">
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted d-block">Koszt zakwaterowania</small>
                                <strong className="text-primary h5 mb-0">
                                    {calculatedLogisticsCosts.accommodationCost.toLocaleString('pl-PL')} PLN
                                </strong>
                                <small className="text-muted">
                                    {teamRequirements.peopleCount} os. × {teamRequirements.duration} dni × {logisticsCosts.accommodationCostPerPerson} PLN
                                </small>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted d-block">Koszt posiłków</small>
                                <strong className="text-success h5 mb-0">
                                    {calculatedLogisticsCosts.mealCost.toLocaleString('pl-PL')} PLN
                                </strong>
                                <small className="text-muted">
                                    {teamRequirements.peopleCount} os. × {teamRequirements.duration} dni × {logisticsCosts.mealCostPerPerson} PLN
                                </small>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted d-block">Robocizna na miejscu</small>
                                <strong className="text-info h5 mb-0">
                                    {calculatedLogisticsCosts.onSiteLaborCost.toLocaleString('pl-PL')} PLN
                                </strong>
                                <small className="text-muted">
                                    {teamRequirements.peopleCount} os. × {teamRequirements.duration} dni × {teamRequirements.workHoursPerDay} h × {laborRate || 120} PLN
                                </small>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Logistics Button */}
                {calculatedLogisticsCosts && (
                    <div className="text-center mt-3">
                        <button
                            className="btn btn-success btn-lg"
                            onClick={() => {
                                if (calculatedLogisticsCosts) {
                                    addLineItem(crypto.randomUUID());
                                }
                            }}
                        >
                            <i className="ri-add-line me-2"></i>
                            Dodaj Koszty Logistyczne do Wyceny
                        </button>
                        <div className="mt-2">
                            <small className="text-muted">
                                Całkowity koszt logistyki: <strong>{calculatedLogisticsCosts?.totalLogisticsCost.toLocaleString('pl-PL')} PLN</strong>
                            </small>
                        </div>
                    </div>
                )}
            </Card>

            {/* Summary - Ant Design Card + Statistics */}
            <Card className="mb-4" title="Podsumowanie wyceny">
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <div style={{ textAlign: 'center' }}>
                        <Typography.Text type="secondary">KOSZT CAŁKOWITY PROJEKTU</Typography.Text>
                        <div>
                            <Statistic value={totalCost} suffix="PLN" valueStyle={{ fontSize: 32 }} precision={2} />
                        </div>
                    </div>
                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Card><Statistic title="Materiały" value={categoryTotals.materials} suffix="PLN" precision={2} /></Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card><Statistic title="Robocizna" value={categoryTotals.labor} suffix="PLN" precision={2} /></Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card><Statistic title="Sprzęt" value={categoryTotals.equipment} suffix="PLN" precision={2} /></Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card><Statistic title="Koszty ogólne" value={categoryTotals.overhead} suffix="PLN" precision={2} /></Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card><Statistic title="Logistyka" value={categoryTotals.logistics} suffix="PLN" precision={2} /></Card>
                        </Col>
                    </Row>
                </Space>
            </Card>

            {/* Estimate Items Table */}
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Szczegółowa wycena</h6>
                    <button className="btn btn-sm btn-success" onClick={generatePdf}>
                        <i className="ri-file-pdf-line me-1"></i> Generuj PDF
                    </button>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>Pozycja</th>
                                    <th>Kategoria</th>
                                    <th style={{ width: 120 }}>Ilość</th>
                                    <th>Jm</th>
                                    <th>Cena jm</th>
                                    <th>Wartość</th>
                                    <th>Uwagi</th>
                                    <th>Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estimateItems.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>
                                            <span className={`badge ${getCategoryBadgeClass(item.category)}`}>
                                                {getCategoryLabel(item.category)}
                                            </span>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value) || 0)}
                                                min="0"
                                                step="0.01"
                                            />
                                        </td>
                                        <td>{item.unit}</td>
                                        <td>{item.unitCost.toLocaleString('pl-PL')} PLN</td>
                                        <td><strong>{item.totalCost.toLocaleString('pl-PL')} PLN</strong></td>
                                        <td>{item.notes || '-'}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDeleteItem(item.id)}
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Item Modal */}
            <div className="modal fade" id="addEstimateItemModal" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Dodaj pozycję</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Wybierz materiał z bazy</label>
                                <select
                                    className="form-select"
                                    value={selectedMaterialId}
                                    onChange={(e) => setSelectedMaterialId(e.target.value)}
                                >
                                    <option value="">— wybierz —</option>
                                    {Object.values(materials).map(m => (
                                        <option key={m.id} value={m.id}>{m.name} • {m.unit} • {m.unitCost} PLN</option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-center text-muted">lub dodaj ręcznie</div>
                            <div className="row g-3 mt-1">
                                <div className="col-12">
                                    <label className="form-label">Nazwa pozycji *</label>
                                    <input type="text" className="form-control" value={newItem.name} onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label">Kategoria *</label>
                                    <select className="form-select" value={newItem.category} onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value as EstimateItem['category'] }))}>
                                        <option value="materials">Materiały</option>
                                        <option value="labor">Robocizna</option>
                                        <option value="equipment">Sprzęt</option>
                                        <option value="overhead">Koszty ogólne</option>
                                        <option value="logistics">Logistyka</option>
                                    </select>
                                </div>
                                <div className="col-3">
                                    <label className="form-label">Ilość *</label>
                                    <input type="number" className="form-control" value={newItem.quantity} onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))} min="0" step="0.01" />
                                </div>
                                <div className="col-3">
                                    <label className="form-label">Jm *</label>
                                    <input type="text" className="form-control" value={newItem.unit} onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))} placeholder="m², h, szt" />
                                </div>
                                <div className="col-6">
                                    <label className="form-label">Cena jednostkowa (PLN) *</label>
                                    <input type="number" className="form-control" value={newItem.unitCost} onChange={(e) => setNewItem(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))} min="0" step="0.01" />
                                </div>
                                <div className="col-6">
                                    <label className="form-label">Wartość całkowita</label>
                                    <input type="text" className="form-control" value={(newItem.quantity * newItem.unitCost).toLocaleString('pl-PL') + ' PLN'} disabled />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Uwagi</label>
                                    <textarea className="form-control" rows={2} value={newItem.notes} onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Anuluj</button>
                            <button type="button" className="btn btn-primary" onClick={handleAddItem} disabled={!selectedMaterialId && (!newItem.name.trim() || !newItem.unit.trim() || newItem.unitCost <= 0)}>Dodaj pozycję</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Styles cleanup: gradients removed in favor of AntD Cards */}
        </div>
    )
}


