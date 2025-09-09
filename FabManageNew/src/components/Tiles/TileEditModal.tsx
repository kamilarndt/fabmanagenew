import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, Button, Row, Col, Space, DatePicker, Upload, Typography, Divider } from 'antd'
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import type { Tile, BomItem } from '../../types/tiles.types'
import { useMaterialsStore } from '../../stores/materialsStore'

const { TextArea } = Input
const { Text } = Typography

interface TileEditModalProps {
    open: boolean
    onClose: () => void
    onSave: (tile: Omit<Tile, 'id'>) => void
    tile?: Tile
    projectId?: string
}

export default function TileEditModal({ open, onClose, onSave, tile, projectId }: TileEditModalProps) {
    const [form] = Form.useForm()
    const materials = useMaterialsStore(state => state.materials)
    const syncMaterials = useMaterialsStore(state => state.syncFromBackend)

    const [bomItems, setBomItems] = useState<BomItem[]>([])
    const [attachments, setAttachments] = useState<string[]>([])

    // Ensure materials are available when modal opens
    useEffect(() => {
        if (open && materials.length === 0) {
            syncMaterials()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    useEffect(() => {
        if (tile) {
            form.setFieldsValue({
                name: tile.name,
                moduł_nadrzędny: tile.moduł_nadrzędny,
                opis: tile.opis,
                link_model_3d: tile.link_model_3d,
                przypisany_projektant: tile.przypisany_projektant,
                termin: tile.termin ? new Date(tile.termin) : undefined
            })
            setBomItems(tile.bom || [])
            setAttachments(tile.załączniki || [])
        } else {
            form.resetFields()
            setBomItems([])
            setAttachments([])
        }
    }, [tile, form])

    const handleSave = async () => {
        try {
            const values = await form.validateFields()
            const tileData: Omit<Tile, 'id'> = {
                name: values.name,
                status: tile?.status || 'W KOLEJCE',
                project: projectId,
                moduł_nadrzędny: values.moduł_nadrzędny,
                opis: values.opis,
                link_model_3d: values.link_model_3d,
                załączniki: attachments,
                przypisany_projektant: values.przypisany_projektant,
                termin: values.termin?.toISOString().slice(0, 10),
                bom: bomItems
            }
            onSave(tileData)
            onClose()
        } catch (error) {
            console.error('Validation failed:', error)
        }
    }

    const addMaterialFromDatabase = () => {
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

    const patchBomItem = (index: number, patch: Partial<BomItem>) => {
        setBomItems(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], ...patch }
            return updated
        })
    }

    const updateBomItem = (index: number, field: keyof BomItem, value: any) => {
        patchBomItem(index, { [field]: value } as Partial<BomItem>)
    }

    const removeBomItem = (index: number) => {
        setBomItems(bomItems.filter((_, i) => i !== index))
    }

    const handleFileUpload = (_info: any) => {
        // Mock file upload - in real app this would upload to server
        const newAttachments = [...attachments, `file-${Date.now()}.pdf`]
        setAttachments(newAttachments)
    }

    return (
        <Modal
            title={tile ? 'Edytuj Kafelek' : 'Dodaj Nowy Kafelek'}
            open={open}
            onCancel={onClose}
            onOk={handleSave}
            width={800}
            okText="Zapisz"
            cancelText="Anuluj"
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    {/* Lewa Kolumna - Dane Podstawowe */}
                    <Col span={12}>
                        <Text strong style={{ marginBottom: 16, display: 'block' }}>
                            Dane Podstawowe:
                        </Text>

                        <Form.Item
                            name="name"
                            label="Nazwa Kafelka"
                            rules={[{ required: true, message: 'Nazwa jest wymagana' }]}
                        >
                            <Input placeholder="Wprowadź nazwę kafelka" />
                        </Form.Item>

                        <Form.Item
                            name="moduł_nadrzędny"
                            label="Moduł nadrzędny"
                        >
                            <Select placeholder="Wybierz moduł">
                                <Select.Option value="Scena Główna">Scena Główna</Select.Option>
                                <Select.Option value="Strefa Wejściowa">Strefa Wejściowa</Select.Option>
                                <Select.Option value="Zaplecze Techniczne">Zaplecze Techniczne</Select.Option>
                                <Select.Option value="Strefa VIP">Strefa VIP</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="opis"
                            label="Opis"
                        >
                            <TextArea rows={3} placeholder="Opis kafelka" />
                        </Form.Item>

                        <Form.Item
                            name="link_model_3d"
                            label="Link do modelu 3D"
                        >
                            <Input placeholder="https://speckle.xyz/streams/..." />
                        </Form.Item>

                        <Form.Item
                            name="załączniki"
                            label="Załączniki"
                        >
                            <Upload
                                multiple
                                onChange={handleFileUpload}
                                beforeUpload={() => false} // Prevent auto upload
                            >
                                <Button icon={<UploadOutlined />}>Prześlij pliki</Button>
                            </Upload>
                            {attachments.length > 0 && (
                                <div style={{ marginTop: 8 }}>
                                    {attachments.map((file, index) => (
                                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text type="secondary">{file}</Text>
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<DeleteOutlined />}
                                                onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Form.Item>

                        <Form.Item
                            name="przypisany_projektant"
                            label="Przypisany projektant"
                        >
                            <Select placeholder="Wybierz projektanta">
                                <Select.Option value="K. Arndt">K. Arndt</Select.Option>
                                <Select.Option value="A. Kowalska">A. Kowalska</Select.Option>
                                <Select.Option value="P. Nowak">P. Nowak</Select.Option>
                                <Select.Option value="M. Wiśniewski">M. Wiśniewski</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="termin"
                            label="Termin"
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="Wybierz datę" />
                        </Form.Item>
                    </Col>

                    {/* Prawa Kolumna - Zarządzanie Materiałami */}
                    <Col span={12}>
                        <Text strong style={{ marginBottom: 16, display: 'block' }}>
                            Zarządzanie Materiałami:
                        </Text>

                        <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                            <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={addMaterialFromDatabase}
                                style={{ width: '100%' }}
                            >
                                [+ Dodaj materiał z bazy]
                            </Button>
                            <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={createNewMaterial}
                                style={{ width: '100%' }}
                            >
                                [+ Utwórz nowy materiał]
                            </Button>
                        </Space>

                        <Divider />

                        <Text strong style={{ marginBottom: 12, display: 'block' }}>
                            Lista materiałów:
                        </Text>

                        <div className="bom-list" style={{ maxHeight: 300, overflowY: 'auto' }}>
                            {bomItems.map((item, index) => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginBottom: 8,
                                    padding: 8,
                                    border: '1px solid #f0f0f0',
                                    borderRadius: 4
                                }}>
                                    <Select
                                        showSearch
                                        placeholder="Nazwa materiału..."
                                        optionFilterProp="label"
                                        value={item.materialId || undefined}
                                        onChange={(value) => {
                                            const m = materials.find(mm => mm.id === value)
                                            patchBomItem(index, {
                                                materialId: value as string,
                                                name: m?.name || item.name,
                                                unit: (m?.unit as string) || item.unit
                                            })
                                        }}
                                        style={{ flex: 1 }}
                                        options={materials.map(m => ({
                                            value: m.id,
                                            label: `${m.code ?? ''}${m.code ? ' — ' : ''}${m.name}`
                                        }))}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Ilość"
                                        value={item.quantity}
                                        onChange={(e) => updateBomItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                        style={{ width: 80 }}
                                    />
                                    <Select
                                        value={item.unit}
                                        onChange={(value) => updateBomItem(index, 'unit', value)}
                                        style={{ width: 80 }}
                                    >
                                        <Select.Option value="szt">szt</Select.Option>
                                        <Select.Option value="mb">mb</Select.Option>
                                        <Select.Option value="m²">m²</Select.Option>
                                        <Select.Option value="m³">m³</Select.Option>
                                        <Select.Option value="kg">kg</Select.Option>
                                        <Select.Option value="ark">ark</Select.Option>
                                    </Select>
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeBomItem(index)}
                                    />
                                </div>
                            ))}

                            {bomItems.length === 0 && (
                                <Text type="secondary" style={{ textAlign: 'center', display: 'block', padding: 20 }}>
                                    Brak materiałów. Dodaj materiały używając przycisków powyżej.
                                </Text>
                            )}
                        </div>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}
