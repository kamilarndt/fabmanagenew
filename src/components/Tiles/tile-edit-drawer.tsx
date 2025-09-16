import { useState, useEffect } from 'react'
import { Drawer, Form, Input, Button, Space } from 'antd'
import { SaveOutlined, CloseOutlined, FileTextOutlined } from '@ant-design/icons'
import type { Tile } from '../../types/tiles.types'
import { useTilesStore } from '../../stores/tilesStore'
import { showToast } from '../../lib/notifications'

interface TileEditDrawerProps {
    open: boolean
    onClose: () => void
    onSave?: (tileData: Omit<Tile, 'id'>) => void | Promise<void>
    tile?: Tile | null
    projectId?: string
}

function TileEditDrawer({ open, onClose, onSave, tile, projectId }: TileEditDrawerProps) {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const { updateTile, addTile } = useTilesStore()

    useEffect(() => {
        if (tile) {
            form.setFieldsValue({
                name: tile.name,
                opis: tile.opis,
                status: tile.status
            })
        } else {
            form.resetFields()
        }
    }, [tile, form])

    const handleSave = async () => {
        try {
            setLoading(true)
            const values = await form.validateFields()

            const tileData: Partial<Tile> = {
                ...values,
                project: projectId || tile?.project
            }

            if (tile?.id) {
                await updateTile(tile.id, tileData)
                showToast('Kafelek został zaktualizowany', 'success')
            } else {
                const newTile = { ...tileData, id: `temp-${Date.now()}` } as Tile
                await addTile(newTile)
                showToast('Kafelek został utworzony', 'success')
            }

            // Call external onSave if provided
            if (onSave) {
                await onSave(tileData as Omit<Tile, 'id'>)
            }

            onClose()
        } catch (error) {
            console.error('Error saving tile:', error)
            showToast('Błąd podczas zapisywania kafelka', 'danger')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Drawer
            title={
                <Space>
                    <FileTextOutlined />
                    {tile?.id ? 'Edytuj kafelek' : 'Nowy kafelek'}
                </Space>
            }
            width={600}
            open={open}
            onClose={onClose}
            footer={
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} icon={<CloseOutlined />}>
                        Anuluj
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSave}
                        loading={loading}
                        icon={<SaveOutlined />}
                    >
                        Zapisz
                    </Button>
                </Space>
            }
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    status: 'Projektowanie'
                }}
            >
                <Form.Item
                    name="name"
                    label="Nazwa kafelka"
                    rules={[{ required: true, message: 'Nazwa jest wymagana' }]}
                >
                    <Input placeholder="Wprowadź nazwę kafelka" />
                </Form.Item>

                <Form.Item
                    name="opis"
                    label="Opis"
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Opis kafelka, wymagania, uwagi..."
                    />
                </Form.Item>
            </Form>
        </Drawer>
    )
}

export default TileEditDrawer