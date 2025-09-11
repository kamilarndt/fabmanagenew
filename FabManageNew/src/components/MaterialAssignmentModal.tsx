import { useState, useEffect } from 'react'
import { Modal, Form, Select, Button, Space, Typography, Card, Tag, Divider, Alert, Spin } from 'antd'
import { BuildOutlined, CalculatorOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useMaterialsStore } from '../stores/materialsStore'
import { assignMaterialToObjects, getObjectGeometry, calculatePlateEstimation } from '../services/speckleMaterials'
import type { SpeckleObjectGeometry } from '../services/speckleMaterials'

interface MaterialAssignmentModalProps {
    open: boolean
    onClose: () => void
    onSuccess: (assignments: any[]) => void
    selectedObjectIds: string[]
    streamUrl?: string
    tileId?: string
    projectId?: string
}

interface Material {
    id: string
    name: string
    code?: string
    dimensions?: {
        width: number
        height: number
        thickness?: number
    }
    unitCost?: number
}

export default function MaterialAssignmentModal({
    open,
    onClose,
    onSuccess,
    selectedObjectIds,
    streamUrl,
    tileId,
    projectId: _projectId
}: MaterialAssignmentModalProps) {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [geometryData, setGeometryData] = useState<SpeckleObjectGeometry[]>([])
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
    const [calculations, setCalculations] = useState<{
        totalVolume: number
        totalArea: number
        estimatedPlates: number
        wasteArea: number
    } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const materials = useMaterialsStore((s: any) => s.materials) as Material[]

    useEffect(() => {
        if (open && streamUrl && selectedObjectIds.length > 0) {
            loadGeometryData()
        }
    }, [open, streamUrl, selectedObjectIds])

    useEffect(() => {
        if (selectedMaterial && geometryData.length > 0) {
            calculateEstimations()
        }
    }, [selectedMaterial, geometryData])

    const loadGeometryData = async () => {
        if (!streamUrl) return

        setLoading(true)
        setError(null)

        try {
            const geometry = await getObjectGeometry(streamUrl, selectedObjectIds)
            setGeometryData(geometry)
        } catch (err) {
            setError('Nie udało się pobrać danych geometrii obiektów')
            console.error('Failed to load geometry:', err)
        } finally {
            setLoading(false)
        }
    }

    const calculateEstimations = () => {
        if (!selectedMaterial?.dimensions || geometryData.length === 0) {
            setCalculations(null)
            return
        }

        let totalVolume = 0
        let totalArea = 0
        let totalEstimatedPlates = 0
        let totalWasteArea = 0

        geometryData.forEach(geometry => {
            const { bbox } = geometry

            if (bbox) {
                const dx = Math.max(0, bbox.maxX - bbox.minX)
                const dy = Math.max(0, bbox.maxY - bbox.minY)
                const dz = Math.max(0, bbox.maxZ - bbox.minZ)

                const volume = dx * dy * dz
                const area = 2 * (dx * dy + dx * dz + dy * dz)

                totalVolume += volume
                totalArea += area

                const plateEstimation = calculatePlateEstimation(
                    geometry,
                    selectedMaterial.dimensions!,
                    15 // 15% waste
                )

                totalEstimatedPlates += plateEstimation.estimatedPlates
                totalWasteArea += plateEstimation.wasteArea
            }
        })

        setCalculations({
            totalVolume,
            totalArea,
            estimatedPlates: totalEstimatedPlates,
            wasteArea: totalWasteArea
        })
    }

    const handleSubmit = async () => {
        if (!selectedMaterial || !tileId) return

        setLoading(true)
        setError(null)

        try {
            const response = await assignMaterialToObjects(
                tileId,
                selectedObjectIds,
                selectedMaterial.id,
                streamUrl,
                geometryData
            )

            if (response.success) {
                onSuccess(response.assignments)
                onClose()
            } else {
                setError(response.error || 'Nie udało się przypisać materiału')
            }
        } catch (err) {
            setError('Błąd podczas przypisywania materiału')
            console.error('Assignment error:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatNumber = (num: number, decimals: number = 2) => {
        return num.toFixed(decimals)
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={
                <Space>
                    <BuildOutlined />
                    Przypisz materiał do obiektów 3D
                </Space>
            }
            width={600}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Anuluj
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    disabled={!selectedMaterial}
                    onClick={handleSubmit}
                >
                    Przypisz materiał
                </Button>
            ]}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* Selection Info */}
                <Card size="small">
                    <Space>
                        <InfoCircleOutlined />
                        <Typography.Text>
                            Zaznaczono <Tag color="blue">{selectedObjectIds.length}</Tag> obiektów
                        </Typography.Text>
                    </Space>
                </Card>

                {error && (
                    <Alert
                        message="Błąd"
                        description={error}
                        type="error"
                        showIcon
                    />
                )}

                {/* Material Selection */}
                <Form form={form} layout="vertical">
                    <Form.Item label="Wybierz materiał" required>
                        <Select
                            showSearch
                            placeholder="Wybierz materiał z magazynu"
                            value={selectedMaterial?.id}
                            onChange={(value) => {
                                const material = materials.find(m => m.id === value)
                                setSelectedMaterial(material || null)
                            }}
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {materials.map((material) => (
                                <Select.Option
                                    key={material.id}
                                    value={material.id}
                                    label={`${material.code || ''} ${material.name}`}
                                >
                                    <Space>
                                        {material.code && (
                                            <Tag color="blue">{material.code}</Tag>
                                        )}
                                        <span>{material.name}</span>
                                        {material.dimensions && (
                                            <Tag color="green">
                                                {material.dimensions.width}×{material.dimensions.height}
                                                {material.dimensions.thickness && `×${material.dimensions.thickness}`}
                                            </Tag>
                                        )}
                                    </Space>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>

                {/* Geometry Loading */}
                {loading && (
                    <Card size="small">
                        <Space>
                            <Spin size="small" />
                            <Typography.Text>Pobieranie danych geometrii...</Typography.Text>
                        </Space>
                    </Card>
                )}

                {/* Calculations */}
                {calculations && selectedMaterial && (
                    <Card
                        size="small"
                        title={
                            <Space>
                                <CalculatorOutlined />
                                Szacunki materiałowe
                            </Space>
                        }
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography.Text>Całkowita objętość:</Typography.Text>
                                <Typography.Text strong>
                                    {formatNumber(calculations.totalVolume, 3)} m³
                                </Typography.Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography.Text>Całkowita powierzchnia:</Typography.Text>
                                <Typography.Text strong>
                                    {formatNumber(calculations.totalArea, 2)} m²
                                </Typography.Text>
                            </div>
                            <Divider style={{ margin: '8px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography.Text>Szacowana liczba płyt:</Typography.Text>
                                <Typography.Text strong style={{ color: '#1890ff' }}>
                                    {calculations.estimatedPlates} szt
                                </Typography.Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography.Text>Powierzchnia odpadu (15%):</Typography.Text>
                                <Typography.Text>
                                    {formatNumber(calculations.wasteArea, 2)} m²
                                </Typography.Text>
                            </div>
                            {selectedMaterial.unitCost && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography.Text>Szacowany koszt materiału:</Typography.Text>
                                    <Typography.Text strong style={{ color: '#52c41a' }}>
                                        {formatNumber(calculations.estimatedPlates * selectedMaterial.unitCost)} PLN
                                    </Typography.Text>
                                </div>
                            )}
                        </Space>
                    </Card>
                )}

                {/* Instructions */}
                <Alert
                    message="Instrukcje"
                    description={
                        <div>
                            <p>1. Wybierz materiał z listy powyżej</p>
                            <p>2. System automatycznie obliczy wymagane ilości</p>
                            <p>3. Uwzględniony zostanie 15% margines na odpad</p>
                            <p>4. Kliknij "Przypisz materiał" aby zapisać</p>
                        </div>
                    }
                    type="info"
                    showIcon
                />
            </Space>
        </Modal>
    )
}


