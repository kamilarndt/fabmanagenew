import { useState, useMemo } from 'react'
import { Card, Row, Col, Tree, InputNumber, Button, Space, Typography, Divider, Statistic } from 'antd'
import { SaveOutlined, FilePdfOutlined, SendOutlined } from '@ant-design/icons'
import { useTilesStore } from '../../stores/tilesStore'
import { useProjectsStore } from '../../stores/projectsStore'

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

    // Manager inputs for additional costs
    const [additionalCosts, setAdditionalCosts] = useState({
        logistics: 0,
        assembly: 0,
        management: 0,
        margin: 15, // percentage
        discount: 0 // percentage
    })

    // Build cost tree structure
    const costTree = useMemo(() => {
        if (!project) return []

        const tree: CostNode[] = []

        // Add project modules
        if (project.modules) {
            project.modules.forEach(module => {
                const moduleTiles = projectTiles.filter(tile =>
                    (tile as any).moduł_nadrzędny === module || tile.group === module
                )

                const moduleNode: CostNode = {
                    title: `${module.replace('_', ' ')} (${moduleTiles.length} elementów)`,
                    key: `module-${module}`,
                    type: 'module',
                    children: moduleTiles.map(tile => ({
                        title: `${tile.name} (${tile.id})`,
                        key: `tile-${tile.id}`,
                        type: 'tile',
                        cost: tile.laborCost || 0,
                        children: tile.bom?.map((item, index) => ({
                            title: `${item.name} - ${item.quantity} ${item.unit}`,
                            key: `material-${tile.id}-${index}`,
                            type: 'material',
                            cost: (item.unitCost || 0) * item.quantity
                        })) || []
                    }))
                }

                // Calculate module total
                const moduleTotal = moduleNode.children?.reduce((sum, tile) => {
                    const tileCost = tile.cost || 0
                    const materialCost = tile.children?.reduce((matSum, mat) => matSum + (mat.cost || 0), 0) || 0
                    return sum + tileCost + materialCost
                }, 0) || 0

                moduleNode.cost = moduleTotal
                tree.push(moduleNode)
            })
        }

        // Add labor costs
        const laborNode: CostNode = {
            title: 'Robocizna',
            key: 'labor',
            type: 'labor',
            cost: projectTiles.reduce((sum, tile) => sum + (tile.laborCost || 0), 0)
        }
        tree.push(laborNode)

        return tree
    }, [project, projectTiles])

    // Calculate totals
    const calculations = useMemo(() => {
        const baseCost = costTree.reduce((sum, node) => sum + (node.cost || 0), 0)
        const additionalCostsTotal = additionalCosts.logistics + additionalCosts.assembly + additionalCosts.management
        const subtotal = baseCost + additionalCostsTotal
        const marginAmount = subtotal * (additionalCosts.margin / 100)
        const discountAmount = (subtotal + marginAmount) * (additionalCosts.discount / 100)
        const finalAmount = subtotal + marginAmount - discountAmount
        const vatAmount = finalAmount * 0.23
        const totalWithVat = finalAmount + vatAmount

        return {
            baseCost,
            additionalCostsTotal,
            subtotal,
            marginAmount,
            discountAmount,
            finalAmount,
            vatAmount,
            totalWithVat
        }
    }, [costTree, additionalCosts])

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
            <Row gutter={24}>
                {/* Lewa Kolumna - Struktura Wyceny Projektu */}
                <Col span={12}>
                    <Card title="Struktura Wyceny Projektu" className="h-100">
                        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                            <Tree
                                treeData={costTree.map(node => ({
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
                                value={calculations.baseCost}
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
                            {/* Koszty dodatkowe */}
                            <div>
                                <Title level={5}>Koszty Dodatkowe</Title>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>Logistyka:</Text>
                                        <InputNumber
                                            value={additionalCosts.logistics}
                                            onChange={(value) => setAdditionalCosts(prev => ({ ...prev, logistics: value || 0 }))}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                            parser={value => parseFloat(value!.replace(/\s?PLN|,/g, '')) || 0}
                                            addonAfter="PLN"
                                            style={{ width: 150 }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>Montaż:</Text>
                                        <InputNumber
                                            value={additionalCosts.assembly}
                                            onChange={(value) => setAdditionalCosts(prev => ({ ...prev, assembly: value || 0 }))}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                            parser={value => parseFloat(value!.replace(/\s?PLN|,/g, '')) || 0}
                                            addonAfter="PLN"
                                            style={{ width: 150 }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>Zarządzanie:</Text>
                                        <InputNumber
                                            value={additionalCosts.management}
                                            onChange={(value) => setAdditionalCosts(prev => ({ ...prev, management: value || 0 }))}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                            parser={value => parseFloat(value!.replace(/\s?PLN|,/g, '')) || 0}
                                            addonAfter="PLN"
                                            style={{ width: 150 }}
                                        />
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
                                        <Text>Koszt bazowy:</Text>
                                        <Text>{calculations.baseCost.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Koszty dodatkowe:</Text>
                                        <Text>{calculations.additionalCostsTotal.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Suma netto:</Text>
                                        <Text>{calculations.subtotal.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Marża ({additionalCosts.margin}%):</Text>
                                        <Text>{calculations.marginAmount.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Upust ({additionalCosts.discount}%):</Text>
                                        <Text style={{ color: '#52c41a' }}>-{calculations.discountAmount.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text strong>Kwota netto:</Text>
                                        <Text strong>{calculations.finalAmount.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>VAT (23%):</Text>
                                        <Text>{calculations.vatAmount.toLocaleString('pl-PL')} PLN</Text>
                                    </div>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>RAZEM:</Title>
                                        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                                            {calculations.totalWithVat.toLocaleString('pl-PL')} PLN
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
