import { useState, useEffect, useMemo } from 'react'
import {
    Modal,
    Form,
    Input,
    Select,
    Button,
    Row,
    Col,
    Space,
    DatePicker,
    Upload,
    Typography,
    Tabs,
    Tag,
    Table,
    InputNumber,
    Segmented,
    Card,
    message,
    Popconfirm,
    Avatar,
    Statistic
} from 'antd'
import {
    PlusOutlined,
    DeleteOutlined,
    UploadOutlined,
    FileTextOutlined,
    EyeOutlined,
    DownloadOutlined,
    LinkOutlined,
    UserOutlined,
    CalendarOutlined,
    DollarOutlined,
    BarChartOutlined,
    InboxOutlined
} from '@ant-design/icons'
import type { Tile, BomItem } from '../../types/tiles.types'
import { useTilesStore } from '../../stores/tilesStore'
import { useMaterialsStore } from '../../stores/materialsStore'
import dayjs from 'dayjs'
import SpeckleViewer from '../SpeckleViewer'
import { getTileObjectMaterials } from '../../services/materials'

const { TextArea } = Input
const { Text, Title } = Typography
const { TabPane } = Tabs
const { Dragger } = Upload

interface TileEditModalV3Props {
    open: boolean
    onClose: () => void
    onSave: (tile: Omit<Tile, 'id'>) => void
    tile?: Tile
    projectId?: string
}

interface FileAttachment {
    uid: string
    name: string
    status: 'done' | 'uploading' | 'error' | 'removed'
    url?: string
    size?: number
    type?: string
    category: 'production' | 'documentation'
}


// Status options for tiles
const statusOptions = [
    { label: 'W KOLEJCE', value: 'W KOLEJCE', color: 'default' },
    { label: 'W TRAKCIE CIĘCIA', value: 'W TRAKCIE CIĘCIA', color: 'processing' },
    { label: 'W TRAKCIE PROJEKTOWANIA', value: 'W TRAKCIE PROJEKTOWANIA', color: 'blue' },
    { label: 'DO AKCEPTACJI', value: 'DO AKCEPTACJI', color: 'warning' },
    { label: 'ZAAKCEPTOWANE', value: 'ZAAKCEPTOWANE', color: 'success' },
    { label: 'WYMAGAJĄ POPRAWEK', value: 'WYMAGAJĄ POPRAWEK', color: 'error' },
    { label: 'GOTOWE', value: 'GOTOWE', color: 'success' }
]

// Priority options
const priorityOptions = [
    { label: 'Niski', value: 'low' },
    { label: 'Średni', value: 'medium' },
    { label: 'Wysoki', value: 'high' }
]

// Designer options
const designerOptions = [
    { label: 'K. Arndt', value: 'K. Arndt' },
    { label: 'A. Kowalska', value: 'A. Kowalska' },
    { label: 'P. Nowak', value: 'P. Nowak' },
    { label: 'M. Wiśniewski', value: 'M. Wiśniewski' }
]

export default function TileEditModalV3({ open, onClose, onSave, tile, projectId }: TileEditModalV3Props) {
    const [form] = Form.useForm()
    const materials = useMaterialsStore(state => state.materials)
    const syncMaterials = useMaterialsStore(state => state.syncFromBackend)

    const [bomItems, setBomItems] = useState<BomItem[]>([])
    const [attachments, setAttachments] = useState<FileAttachment[]>([])
    const [activeTab, setActiveTab] = useState('main')
    const [depsInput, setDepsInput] = useState('')
    const addDependency = useTilesStore(s => s.addDependency)
    const removeDependency = useTilesStore(s => s.removeDependency)
    const [materialSearchVisible, setMaterialSearchVisible] = useState(false)

    // Ensure materials are available when modal opens
    useEffect(() => {
        if (open && materials.length === 0) {
            syncMaterials()
        }
    }, [open, materials.length, syncMaterials])

    // Initialize form when tile changes
    useEffect(() => {
        if (tile) {
            form.setFieldsValue({
                ...tile,
                termin: tile.termin ? dayjs(tile.termin) : null,
                priority: tile.priority || 'medium',
                estimated_cost: tile.estimated_cost || 0
            })
            setBomItems(tile.bom || [])

            // Convert attachments to FileAttachment format
            const fileAttachments: FileAttachment[] = (tile.załączniki || []).map((fileName, index) => ({
                uid: `existing-${index}`,
                name: fileName,
                status: 'done' as const,
                category: fileName.toLowerCase().includes('.dxf') || fileName.toLowerCase().includes('.dwg') ? 'production' as const : 'documentation' as const
            }))
            setAttachments(fileAttachments)
        } else {
            form.setFieldsValue({
                name: '',
                project: projectId,
                moduł_nadrzędny: '',
                opis: '',
                link_model_3d: '',
                przypisany_projektant: '',
                termin: null,
                status: 'W KOLEJCE',
                priority: 'medium',
                estimated_cost: 0
            })
            setBomItems([])
            setAttachments([])
        }
    }, [tile, projectId, form])

    // Aggregate 3D object-material mappings into BOM when modal opens for a specific tile
    useEffect(() => {
        const run = async () => {
            try {
                if (!open) return
                if (!tile?.id) return
                const rows = (await getTileObjectMaterials(tile.id)) as unknown as any[]
                if (!Array.isArray(rows) || rows.length === 0) return
                // Aggregate by material_id
                const agg = new Map<string, { qty: number; unit?: string }>()
                for (const r of rows) {
                    const key = String(r.material_id)
                    const prev = agg.get(key) || { qty: 0, unit: r.unit || undefined }
                    const add = Number(r.quantity_per_object || 0)
                    const nextQty = prev.qty + (Number.isFinite(add) ? add : 0)
                    agg.set(key, { qty: nextQty, unit: prev.unit || r.unit || undefined })
                }
                // Merge with current bomItems
                const merged: BomItem[] = [...bomItems]
                agg.forEach((v, matId) => {
                    const material = materials.find(m => String(m.id) === String(matId))
                    const name = material?.name || matId
                    const unit = (v.unit as string) || (material?.unit as string) || 'szt'
                    const existing = merged.find(b => String(b.materialId) === String(matId))
                    if (existing) {
                        existing.quantity = (existing.quantity || 0) + v.qty
                        existing.unit = existing.unit || unit
                    } else {
                        merged.push({
                            id: `BOM-${matId}`,
                            type: 'Materiał surowy',
                            materialId: matId,
                            name,
                            quantity: v.qty,
                            unit,
                            status: 'Do zamówienia'
                        })
                    }
                })
                setBomItems(merged)
            } catch {
                // ignore fetch aggregation errors
            }
        }
        run()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, tile?.id])

    // Calculate total material cost
    const totalMaterialCost = useMemo(() => {
        return bomItems.reduce((total, item) => {
            const material = materials.find(m => m.id === item.materialId)
            const price = (item.unitCost != null ? item.unitCost : material?.price) || 0
            return total + (price * (item.quantity || 0))
        }, 0)
    }, [bomItems, materials])

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            const tileData: Omit<Tile, 'id'> = {
                name: values.name,
                status: values.status || 'W KOLEJCE',
                project: values.project || projectId || '',
                moduł_nadrzędny: values.moduł_nadrzędny,
                opis: values.opis,
                link_model_3d: values.link_model_3d,
                załączniki: attachments.filter(f => f.status === 'done').map(f => f.name),
                przypisany_projektant: values.przypisany_projektant,
                termin: values.termin ? values.termin.format('YYYY-MM-DD') : undefined,
                priority: values.priority,
                estimated_cost: values.estimated_cost,
                bom: bomItems
            }
            onSave(tileData)
            onClose()
            message.success('Kafelek został zapisany pomyślnie')
        } catch (error) {
            console.error('Form validation failed:', error)
            message.error('Wypełnij wszystkie wymagane pola')
        }
    }

    const dependencies = (tile?.dependencies || []) as string[]
    const handleAddDependency = () => {
        const targetId = (depsInput || '').trim()
        if (!tile?.id || !targetId) return
        addDependency(tile.id, targetId)
        setDepsInput('')
    }
    const handleRemoveDependency = (targetId: string) => {
        if (!tile?.id) return
        removeDependency(tile.id, targetId)
    }

    const addMaterialFromDatabase = () => {
        setMaterialSearchVisible(true)
    }

    const handleMaterialSelect = (materialId: string) => {
        const material = materials.find(m => m.id === materialId)
        if (material) {
            const newItem: BomItem = {
                id: `BOM-${Date.now()}`,
                type: 'Materiał surowy',
                materialId: material.id,
                name: material.name,
                quantity: 1,
                unit: material.unit as string,
                status: 'Do zamówienia'
            }
            setBomItems([...bomItems, newItem])
        }
        setMaterialSearchVisible(false)
    }

    const createNewMaterial = () => {
        const newItem: BomItem = {
            id: `BOM-${Date.now()}`,
            type: 'Materiał surowy',
            name: '',
            quantity: 1,
            unit: 'szt',
            status: 'Do zamówienia'
        }
        setBomItems([...bomItems, newItem])
    }

    const updateBomItem = (id: string, updates: Partial<BomItem>) => {
        setBomItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ))
    }

    const removeBomItem = (id: string) => {
        setBomItems(prev => prev.filter(item => item.id !== id))
    }

    const handleFileUpload = (info: any, category: 'production' | 'documentation') => {
        const { fileList } = info
        const updatedFiles = fileList.map((file: any) => ({
            ...file,
            category
        }))

        setAttachments(prev => {
            const filtered = prev.filter(f => f.category !== category)
            return [...filtered, ...updatedFiles]
        })
    }

    const removeAttachment = (uid: string) => {
        setAttachments(prev => prev.filter(f => f.uid !== uid))
    }

    // BOM Table columns
    const bomColumns = [
        {
            title: 'Nazwa Materiału',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
            render: (_text: string, record: BomItem) => (
                <Select
                    showSearch
                    placeholder="Wybierz materiał..."
                    value={record.materialId || undefined}
                    onChange={(value) => {
                        const material = materials.find(m => m.id === value)
                        updateBomItem(record.id, {
                            materialId: value,
                            name: material?.name || '',
                            unit: material?.unit as string || record.unit
                        })
                    }}
                    style={{ width: '100%' }}
                    optionFilterProp="label"
                >
                    {materials.map(m => (
                        <Select.Option key={m.id} value={m.id} label={`${m.code || ''} ${m.name}`}>
                            {m.code && <Text type="secondary">{m.code} — </Text>}
                            {m.name}
                        </Select.Option>
                    ))}
                </Select>
            )
        },
        {
            title: 'Ilość',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '15%',
            render: (value: number, record: BomItem) => (
                <InputNumber
                    min={0}
                    step={0.1}
                    value={value}
                    onChange={(val) => updateBomItem(record.id, { quantity: val || 0 })}
                    style={{ width: '100%' }}
                />
            )
        },
        {
            title: 'J.m.',
            dataIndex: 'unit',
            key: 'unit',
            width: '10%',
            render: (value: string, record: BomItem) => (
                <Select
                    value={value}
                    onChange={(val) => updateBomItem(record.id, { unit: val })}
                    style={{ width: '100%' }}
                >
                    <Select.Option value="szt">szt</Select.Option>
                    <Select.Option value="mb">mb</Select.Option>
                    <Select.Option value="m²">m²</Select.Option>
                    <Select.Option value="m³">m³</Select.Option>
                    <Select.Option value="kg">kg</Select.Option>
                    <Select.Option value="ark">ark</Select.Option>
                </Select>
            )
        },
        {
            title: 'Cena jedn.',
            dataIndex: 'price',
            key: 'price',
            width: '15%',
            render: (_: any, record: BomItem) => {
                const material = materials.find(m => m.id === record.materialId)
                const price = (record.unitCost != null ? record.unitCost : material?.price)
                return (
                    <InputNumber
                        min={0}
                        step={0.01}
                        value={price || 0}
                        onChange={(val) => updateBomItem(record.id, { unitCost: Number(val || 0) })}
                        style={{ width: '100%' }}
                    />
                )
            }
        },
        {
            title: 'Wartość',
            key: 'total',
            width: '15%',
            render: (_: any, record: BomItem) => {
                const material = materials.find(m => m.id === record.materialId)
                const price = (record.unitCost != null ? record.unitCost : material?.price) || 0
                const total = price * (record.quantity || 0)
                return total > 0 ? `${total.toFixed(2)} PLN` : '-'
            }
        },
        {
            title: 'Akcje',
            key: 'actions',
            width: '5%',
            render: (_: any, record: BomItem) => (
                <Popconfirm
                    title="Czy na pewno chcesz usunąć ten materiał?"
                    onConfirm={() => removeBomItem(record.id)}
                    okText="Tak"
                    cancelText="Nie"
                >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            )
        }
    ]

    // Get current tile status
    const currentStatus = form.getFieldValue('status') || 'W KOLEJCE'
    const statusOption = statusOptions.find(s => s.value === currentStatus)

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                        <Text strong>{tile ? 'Edycja Kafelka' : 'Nowy Kafelek'}</Text>
                        {tile && <Text type="secondary">#{tile.id}</Text>}
                    </Space>
                    {statusOption && (
                        <Tag color={statusOption.color}>{statusOption.label}</Tag>
                    )}
                </div>
            }
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            width={1200}
            okText="Zapisz"
            cancelText="Anuluj"
            bodyStyle={{ padding: 0 }}
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                style={{ padding: '0 24px' }}
            >
                <TabPane
                    tab={
                        <Space>
                            <BarChartOutlined />
                            Dane Główne i Produkcja
                        </Space>
                    }
                    key="main"
                >
                    <Form form={form} layout="vertical" style={{ padding: '16px 0' }}>
                        <Row gutter={24}>
                            {/* Lewa Kolumna - Identyfikacja */}
                            <Col span={12}>
                                <Card title="Identyfikacja" size="small" style={{ marginBottom: 16 }}>
                                    <Form.Item
                                        label="Nazwa Kafelka"
                                        name="name"
                                        rules={[{ required: true, message: 'Nazwa jest wymagana' }]}
                                    >
                                        <Input
                                            placeholder="Wprowadź nazwę kafelka"
                                            size="large"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Moduł Nadrzędny"
                                        name="moduł_nadrzędny"
                                    >
                                        <Select
                                            placeholder="Wybierz moduł"
                                            allowClear
                                            size="large"
                                        >
                                            <Select.Option value="Scena Główna">Scena Główna</Select.Option>
                                            <Select.Option value="Strefa Wejściowa">Strefa Wejściowa</Select.Option>
                                            <Select.Option value="Zaplecze Techniczne">Zaplecze Techniczne</Select.Option>
                                            <Select.Option value="Strefa VIP">Strefa VIP</Select.Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Opis"
                                        name="opis"
                                    >
                                        <TextArea
                                            rows={3}
                                            placeholder="Opis kafelka"
                                            showCount
                                            maxLength={500}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Link do modelu 3D"
                                        name="link_model_3d"
                                    >
                                        <Input
                                            placeholder="https://speckle.xyz/streams/..."
                                            prefix={<LinkOutlined />}
                                        />
                                    </Form.Item>
                                </Card>
                            </Col>

                            {/* Prawa Kolumna - Parametry Produkcyjne */}
                            <Col span={12}>
                                <Card title="Parametry Produkcyjne" size="small" style={{ marginBottom: 16 }}>
                                    <Form.Item
                                        label="Status"
                                        name="status"
                                    >
                                        <Select size="large">
                                            {statusOptions.map(option => (
                                                <Select.Option key={option.value} value={option.value}>
                                                    <Tag color={option.color} style={{ marginRight: 8 }}>
                                                        {option.label}
                                                    </Tag>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Przypisany Projektant"
                                        name="przypisany_projektant"
                                    >
                                        <Select
                                            placeholder="Wybierz projektanta"
                                            allowClear
                                            size="large"
                                        >
                                            {designerOptions.map(option => (
                                                <Select.Option key={option.value} value={option.value}>
                                                    <Space>
                                                        <Avatar size="small" icon={<UserOutlined />} />
                                                        {option.label}
                                                    </Space>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Termin"
                                        name="termin"
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder="Wybierz datę"
                                            size="large"
                                            suffixIcon={<CalendarOutlined />}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Szacowany koszt robocizny"
                                        name="estimated_cost"
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            placeholder="0.00"
                                            min={0}
                                            step={10}
                                            formatter={value => `${value} PLN`}
                                            parser={(value) => (value ? Number(value.replace(' PLN', '')) : 0) as any}
                                            size="large"
                                            prefix={<DollarOutlined />}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Priorytet"
                                        name="priority"
                                    >
                                        <Segmented
                                            options={priorityOptions}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </TabPane>

                <TabPane
                    tab={
                        <Space>
                            <LinkOutlined />
                            Zależności
                            {dependencies.length > 0 && (<Tag>{dependencies.length}</Tag>)}
                        </Space>
                    }
                    key="deps"
                >
                    <div style={{ padding: '16px 0' }}>
                        <Row gutter={12} style={{ marginBottom: 12 }}>
                            <Col span={20}>
                                <Input placeholder="ID kafelka (koniec → start)" value={depsInput} onChange={e => setDepsInput(e.target.value)} />
                            </Col>
                            <Col span={4}>
                                <Button block icon={<LinkOutlined />} onClick={handleAddDependency}>Dodaj</Button>
                            </Col>
                        </Row>
                        <Table
                            size="small"
                            pagination={false}
                            dataSource={dependencies.map(id => ({ id }))}
                            rowKey="id"
                            columns={[
                                { title: 'Zależny od', dataIndex: 'id' },
                                {
                                    title: 'Akcje',
                                    render: (_: any, r: any) => (
                                        <Popconfirm title="Usunąć zależność?" onConfirm={() => handleRemoveDependency(r.id)}>
                                            <Button size="small" icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                    )
                                }
                            ]}
                        />
                    </div>
                </TabPane>

                <TabPane
                    tab={
                        <Space>
                            <FileTextOutlined />
                            Materiały (BOM)
                            {bomItems.length > 0 && (
                                <Tag>{bomItems.length}</Tag>
                            )}
                        </Space>
                    }
                    key="materials"
                >
                    <div style={{ padding: '16px 0' }}>
                        {/* Pasek Akcji */}
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={12}>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={addMaterialFromDatabase}
                                    size="large"
                                >
                                    Dodaj materiał z bazy
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    type="dashed"
                                    icon={<PlusOutlined />}
                                    onClick={createNewMaterial}
                                    size="large"
                                    style={{ width: '100%' }}
                                >
                                    Utwórz nowy materiał
                                </Button>
                            </Col>
                        </Row>

                        {/* Podsumowanie kosztów */}
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={8}>
                                <Statistic
                                    title="Łączny koszt materiałów"
                                    value={totalMaterialCost}
                                    precision={2}
                                    suffix="PLN"
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Liczba pozycji"
                                    value={bomItems.length}
                                    suffix="szt"
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Szacowany koszt całkowity"
                                    value={totalMaterialCost + (form.getFieldValue('estimated_cost') || 0)}
                                    precision={2}
                                    suffix="PLN"
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Col>
                        </Row>

                        {/* Tabela Materiałów */}
                        <Table
                            columns={bomColumns}
                            dataSource={bomItems}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            locale={{
                                emptyText: (
                                    <div style={{ padding: 40, textAlign: 'center' }}>
                                        <Text type="secondary">
                                            Brak materiałów. Dodaj materiały używając przycisków powyżej.
                                        </Text>
                                    </div>
                                )
                            }}
                            scroll={{ y: 400 }}
                        />
                    </div>
                </TabPane>

                <TabPane
                    tab={
                        <Space>
                            <UploadOutlined />
                            Pliki i Dokumentacja
                            {attachments.length > 0 && (
                                <Tag>{attachments.length}</Tag>
                            )}
                        </Space>
                    }
                    key="files"
                >
                    <div style={{ padding: '16px 0' }}>
                        <Row gutter={16}>
                            {/* Pliki Produkcyjne */}
                            <Col span={12}>
                                <Card title="Pliki Produkcyjne" size="small">
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                                        DXF, DWG, pliki CNC
                                    </Text>
                                    <Dragger
                                        multiple
                                        accept=".dxf,.dwg,.nc,.tap"
                                        onChange={(info) => handleFileUpload(info, 'production')}
                                        style={{ marginBottom: 16 }}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">
                                            Przeciągnij pliki tutaj lub kliknij aby wybrać
                                        </p>
                                        <p className="ant-upload-hint">
                                            Obsługiwane formaty: DXF, DWG, NC, TAP
                                        </p>
                                    </Dragger>

                                    {/* Lista plików produkcyjnych */}
                                    {attachments.filter(f => f.category === 'production').map(file => (
                                        <div key={file.uid} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: 8,
                                            border: '1px solid #f0f0f0',
                                            borderRadius: 4,
                                            marginBottom: 8
                                        }}>
                                            <Space>
                                                <FileTextOutlined />
                                                <Text>{file.name}</Text>
                                                {file.size && (
                                                    <Text type="secondary">
                                                        ({(file.size / 1024).toFixed(1)} KB)
                                                    </Text>
                                                )}
                                            </Space>
                                            <Space>
                                                <Button type="text" icon={<EyeOutlined />} size="small" />
                                                <Button type="text" icon={<DownloadOutlined />} size="small" />
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                    onClick={() => removeAttachment(file.uid)}
                                                />
                                            </Space>
                                        </div>
                                    ))}
                                </Card>
                            </Col>

                            {/* Dokumentacja */}
                            <Col span={12}>
                                <Card title="Dokumentacja" size="small">
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                                        PDF, zdjęcia, dokumenty
                                    </Text>
                                    <Dragger
                                        multiple
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        onChange={(info) => handleFileUpload(info, 'documentation')}
                                        style={{ marginBottom: 16 }}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">
                                            Przeciągnij pliki tutaj lub kliknij aby wybrać
                                        </p>
                                        <p className="ant-upload-hint">
                                            Obsługiwane formaty: PDF, JPG, PNG, DOC
                                        </p>
                                    </Dragger>

                                    {/* Lista plików dokumentacji */}
                                    {attachments.filter(f => f.category === 'documentation').map(file => (
                                        <div key={file.uid} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: 8,
                                            border: '1px solid #f0f0f0',
                                            borderRadius: 4,
                                            marginBottom: 8
                                        }}>
                                            <Space>
                                                <FileTextOutlined />
                                                <Text>{file.name}</Text>
                                                {file.size && (
                                                    <Text type="secondary">
                                                        ({(file.size / 1024).toFixed(1)} KB)
                                                    </Text>
                                                )}
                                            </Space>
                                            <Space>
                                                <Button type="text" icon={<EyeOutlined />} size="small" />
                                                <Button type="text" icon={<DownloadOutlined />} size="small" />
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                    onClick={() => removeAttachment(file.uid)}
                                                />
                                            </Space>
                                        </div>
                                    ))}
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </TabPane>

                <TabPane
                    tab={
                        <Space>
                            <EyeOutlined />
                            Podgląd 3D
                        </Space>
                    }
                    key="preview"
                >
                    <div style={{ padding: '16px 0', textAlign: 'center', minHeight: 400 }}>
                        {form.getFieldValue('link_model_3d') ? (
                            <Card>
                                <Title level={4}>Podgląd modelu 3D</Title>
                                <SpeckleViewer initialStreamUrl={form.getFieldValue('link_model_3d')} height={420} />
                                <div style={{ textAlign: 'right', marginTop: 12 }}>
                                    <Button
                                        type="default"
                                        href={form.getFieldValue('link_model_3d')}
                                        target="_blank"
                                        icon={<LinkOutlined />}
                                    >
                                        Otwórz w nowej karcie
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <Card>
                                <div style={{ padding: 60 }}>
                                    <EyeOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                                    <Title level={4} type="secondary">
                                        Brak linku do modelu 3D
                                    </Title>
                                    <Text type="secondary">
                                        Dodaj link do modelu 3D w zakładce "Dane Główne i Produkcja"
                                    </Text>
                                    <br />
                                    <Button
                                        type="primary"
                                        style={{ marginTop: 16 }}
                                        onClick={() => setActiveTab('main')}
                                    >
                                        Przejdź do edycji danych
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>
                </TabPane>
            </Tabs>

            {/* Material Search Modal */}
            <Modal
                title="Wybierz materiał z bazy"
                open={materialSearchVisible}
                onCancel={() => setMaterialSearchVisible(false)}
                footer={null}
                width={800}
            >
                <Input.Search
                    placeholder="Szukaj materiału..."
                    style={{ marginBottom: 16 }}
                />
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                    {materials.map(material => (
                        <Card
                            key={material.id}
                            size="small"
                            style={{ marginBottom: 8, cursor: 'pointer' }}
                            onClick={() => handleMaterialSelect(material.id)}
                            hoverable
                        >
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Space direction="vertical" size="small">
                                        <Text strong>{material.name}</Text>
                                        {material.code && (
                                            <Text type="secondary">{material.code}</Text>
                                        )}
                                    </Space>
                                </Col>
                                <Col>
                                    <Space>
                                        <Text>{material.unit}</Text>
                                        {material.price && (
                                            <Text strong>{material.price} PLN</Text>
                                        )}
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            </Modal>
        </Modal>
    )
}
