import { useState, useMemo } from 'react'
import { Card, Row, Col, Tree, InputNumber, Button, Space, Typography, Divider, Statistic, Segmented, Tag } from 'antd'
import { SaveOutlined, FilePdfOutlined, SendOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import { useTilesStore } from '../../stores/tilesStore'
import { useProjectsStore } from '../../stores/projectsStore'
import { useProjectCosts } from '../../hooks/useProjectCosts'

const { Title, Text } = Typography

interface EstimateModuleProps {
    projectId: string
}

interface CostNode {
    title: string
    key: string
    children?: CostNode[]
    cost?: number
    type: 'module' | 'tile' | 'material' | 'labor' | 'overhead'
}

export default function EstimateModule({ projectId }: EstimateModuleProps) {
    const { tiles } = useTilesStore()
    const { projects } = useProjectsStore()

    const project = projects.find(p => p.id === projectId)
    const projectTiles = tiles.filter(tile => tile.project === projectId)

    // View mode toggle
    const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary')

    // Manager inputs for margin and discount
    const [additionalCosts, setAdditionalCosts] = useState({
        margin: 15, // percentage
        discount: 0 // percentage
    })

    // Use centralized cost calculation
    const projectCosts = useProjectCosts({
        projectId,
        marginPercent: additionalCosts.margin,
        discountPercent: additionalCosts.discount
    })

    // Build cost tree structure using real data
    const costTree = useMemo(() => {
        if (!project) return []

        const tree: CostNode[] = []

        // Materials node
        if (projectCosts.materials.breakdown.length > 0) {
            const materialsNode: CostNode = {
                title: `Materiały (${projectCosts.materials.breakdown.length} pozycji)`,
                key: 'materials',
                type: 'material',
                cost: projectCosts.materials.total,
                children: projectCosts.materials.breakdown.map((item, index) => ({
                    title: `${item.name} - ${item.quantity} ${item.unit}`,
                    key: `material-${index}`,
                    type: 'material',
                    cost: item.cost
                }))
            }
            tree.push(materialsNode)
        }

        // Labor node
        if (projectCosts.labor.breakdown.length > 0) {
            const laborNode: CostNode = {
                title: `Robocizna (${projectCosts.labor.breakdown.length} kafelków)`,
                key: 'labor',
                type: 'labor',
                cost: projectCosts.labor.total,
                children: projectCosts.labor.breakdown.map((item, index) => ({
                    title: item.tileName,
                    key: `labor-${index}`,
                    type: 'labor',
                    cost: item.cost
                }))
            }
            tree.push(laborNode)
        }

        // Logistics node
        if (projectCosts.logistics.breakdown.length > 0) {
            const logisticsNode: CostNode = {
                title: `Logistyka (${projectCosts.logistics.breakdown.length} tras)`,
                key: 'logistics',
                type: 'overhead',
                cost: projectCosts.logistics.total,
                children: projectCosts.logistics.breakdown.map((item, index) => ({
                    title: `${item.name} (${item.type})`,
                    key: `logistics-${index}`,
                    type: 'overhead',
                    cost: item.cost
                }))
            }
            tree.push(logisticsNode)
        }

        // Accommodation node
        if (projectCosts.accommodation.breakdown.length > 0) {
            const accommodationNode: CostNode = {
                title: `Zakwaterowanie (${projectCosts.accommodation.breakdown.length} miejsc)`,
                key: 'accommodation',
                type: 'overhead',
                cost: projectCosts.accommodation.total,
                children: projectCosts.accommodation.breakdown.map((item, index) => ({
                    title: `${item.name} - ${item.location}`,
                    key: `accommodation-${index}`,
                    type: 'overhead',
                    cost: item.cost
                }))
            }
            tree.push(accommodationNode)
        }

        return tree
    }, [project, projectCosts])

    // Build detailed cost tree (by elements/tiles)
    const detailedCostTree = useMemo(() => {
        if (!project) return []

        const tree: CostNode[] = []

        // Group by project modules or create general group
        const modules = project.modules || ['general']

        modules.forEach(module => {
            const moduleTiles = projectTiles.filter(tile =>
                module === 'general' ||
                (tile as any).moduł_nadrzędny === module ||
                tile.group === module
            )

            if (moduleTiles.length === 0) return

            const moduleNode: CostNode = {
                title: `${module === 'general' ? 'Elementy ogólne' : module.replace('_', ' ')} (${moduleTiles.length} elementów)`,
                key: `module-${module}`,
                type: 'module',
                children: moduleTiles.map(tile => {
                    const tileMaterialCost = tile.bom?.reduce((sum, item) =>
                        sum + ((item.unitCost || 0) * item.quantity), 0) || 0
                    const tileLaborCost = tile.laborCost || 0
                    const tileTotalCost = tileMaterialCost + tileLaborCost

                    return {
                        title: tile.name,
                        key: `tile-${tile.id}`,
                        type: 'tile',
                        cost: tileTotalCost,
                        children: [
                            // Materials for this tile
                            ...(tile.bom?.map((item, index) => ({
                                title: `${item.name} - ${item.quantity} ${item.unit}`,
                                key: `material-${tile.id}-${index}`,
                                type: 'material' as const,
                                cost: (item.unitCost || 0) * item.quantity
                            })) || []),
                            // Labor for this tile
                            ...(tileLaborCost > 0 ? [{
                                title: `Robocizna - ${tile.name}`,
                                key: `labor-${tile.id}`,
                                type: 'labor' as const,
                                cost: tileLaborCost
                            }] : [])
                        ]
                    }
                })
            }

            // Calculate module total
            const moduleTotal = moduleNode.children?.reduce((sum, tile) => sum + (tile.cost || 0), 0) || 0
            moduleNode.cost = moduleTotal
            tree.push(moduleNode)
        })

        // Add logistics as separate node
        if (projectCosts.logistics.total > 0) {
            tree.push({
                title: `Logistyka (${projectCosts.logistics.breakdown.length} tras)`,
                key: 'logistics-detailed',
                type: 'overhead',
                cost: projectCosts.logistics.total,
                children: projectCosts.logistics.breakdown.map((item, index) => ({
                    title: `${item.name} (${item.type})`,
                    key: `logistics-detailed-${index}`,
                    type: 'overhead',
                    cost: item.cost
                }))
            })
        }

        // Add accommodation as separate node
        if (projectCosts.accommodation.total > 0) {
            tree.push({
                title: `Zakwaterowanie (${projectCosts.accommodation.breakdown.length} miejsc)`,
                key: 'accommodation-detailed',
                type: 'overhead',
                cost: projectCosts.accommodation.total,
                children: projectCosts.accommodation.breakdown.map((item, index) => ({
                    title: `${item.name} - ${item.location}`,
                    key: `accommodation-detailed-${index}`,
                    type: 'overhead',
                    cost: item.cost
                }))
            })
        }

        return tree
    }, [project, projectTiles, projectCosts])

    // Use calculations from projectCosts
    const calculations = projectCosts.totals

    const handleSaveDraft = () => {
        // Save draft functionality
        console.log('Saving draft...', { calculations, additionalCosts })
    }

    const handleGeneratePDF = () => {
        // Generate PDF functionality
        console.log('Generating PDF...', { calculations, additionalCosts })
    }

    const handleSendToClient = () => {
        // Send to client functionality
        console.log('Sending to client...', { calculations, additionalCosts })
    }

    return (
        <div>
            {/* Header with view mode toggle */}
            <Card size="small" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0 }}>Wycena Projektu</Title>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span>Widok:</span>
                        <Segmented
                            value={viewMode}
                            onChange={setViewMode}
                            options={[
                                {
                                    label: 'Zbiorczy',
                                    value: 'summary',
                                    icon: <BarsOutlined />
                                },
                                {
                                    label: 'Szczegółowy',
                                    value: 'detailed',
                                    icon: <AppstoreOutlined />
                                }
                            ]}
                        />
                    </div>
                </div>
            </Card>

            <Row gutter={24}>
                {/* Lewa Kolumna - Struktura Wyceny Projektu */}
                <Col span={12}>
                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span>Struktura Wyceny</span>
                                <Tag color={viewMode === 'summary' ? 'blue' : 'green'}>
                                    {viewMode === 'summary' ? 'Widok zbiorczy' : 'Widok szczegółowy'}
                                </Tag>
                            </div>
                        }
                        className="h-100"
                    >
                        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                            <Tree
                                treeData={(viewMode === 'summary' ? costTree : detailedCostTree).map(node => ({
                                    ...node,
                                    title: (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>{node.title}</span>
                                            {node.cost && (
                                                <Text strong style={{ color: '#1890ff' }}>
                                                    {node.cost.toLocaleString('pl-PL')} PLN
                                                </Text>
                                            )}
                                        </div>
                                    )
                                }))}
                                defaultExpandAll
                                showLine
                            />
                        </div>

                        <Divider />

                        <div style={{ textAlign: 'center' }}>
                            <Statistic
                                title="Koszt bazowy projektu"
                                value={calculations.subtotal}
                                precision={2}
                                suffix="PLN"
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </div>
                    </Card>
                </Col>

                {/* Prawa Kolumna - Kalkulacja Końcowa */}
                <Col span={12}>
                    <Card title="Kalkulacja Końcowa" className="h-100">
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {/* Podsumowanie kosztów bazowych */}
                            <div>
                                <Title level={5}>Koszty Bazowe</Title>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Materiały:</Text>
                                        <Text strong>{projectCosts.materials.total.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Robocizna:</Text>
                                        <Text strong>{projectCosts.labor.total.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Logistyka:</Text>
                                        <Text strong>{projectCosts.logistics.total.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Zakwaterowanie:</Text>
                                        <Text strong>{projectCosts.accommodation.total.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                </Space>
                            </div>

                            <Divider />

                            {/* Marża i upusty */}
                            <div>
                                <Title level={5}>Marża i Upusty</Title>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>Marża (%):</Text>
                                        <InputNumber
                                            value={additionalCosts.margin}
                                            onChange={(value) => setAdditionalCosts(prev => ({ ...prev, margin: value || 0 }))}
                                            min={0}
                                            max={100}
                                            addonAfter="%"
                                            style={{ width: 150 }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>Upust (%):</Text>
                                        <InputNumber
                                            value={additionalCosts.discount}
                                            onChange={(value) => setAdditionalCosts(prev => ({ ...prev, discount: value || 0 }))}
                                            min={0}
                                            max={100}
                                            addonAfter="%"
                                            style={{ width: 150 }}
                                        />
                                    </div>
                                </Space>
                            </div>

                            <Divider />

                            {/* Podsumowanie finansowe */}
                            <div>
                                <Title level={5}>Podsumowanie</Title>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Suma netto:</Text>
                                        <Text>{calculations.subtotal.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Marża ({additionalCosts.margin}%):</Text>
                                        <Text style={{ color: '#52c41a' }}>+{calculations.margin.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Upust ({additionalCosts.discount}%):</Text>
                                        <Text style={{ color: '#f5222d' }}>-{calculations.discount.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text strong>Kwota netto:</Text>
                                        <Text strong>{(calculations.subtotal + calculations.margin - calculations.discount).toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>VAT (23%):</Text>
                                        <Text>{calculations.vat.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>RAZEM:</Title>
                                        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                                            {calculations.total.toLocaleString('pl-PL')} PLN
                                        </Title>
                                    </div>
                                </Space>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Pasek Akcji */}
            <Card style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Text type="secondary">
                            Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}
                        </Text>
                    </div>
                    <Space>
                        <Button
                            icon={<SaveOutlined />}
                            onClick={handleSaveDraft}
                        >
                            Zapisz wersję roboczą
                        </Button>
                        <Button
                            type="primary"
                            icon={<FilePdfOutlined />}
                            onClick={handleGeneratePDF}
                        >
                            Generuj Ofertę PDF
                        </Button>
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSendToClient}
                        >
                            Zatwierdź i wyślij do klienta
                        </Button>
                    </Space>
                </div>
            </Card>
        </div>
    )
}
