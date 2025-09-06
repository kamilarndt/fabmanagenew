import { useEffect, useMemo, useState } from 'react'
import { Table, Button, Drawer, Form, Input, Select, Space, Tag, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useTilesStore, type Tile } from '../stores/tilesStore'

type BackendTile = Partial<Tile> & { quantity?: number; material?: string; description?: string; files?: { name: string; path: string }[] };

const STATUS_OPTIONS = [
    { value: 'do_review', label: 'Do review' },
    { value: 'zaakceptowany', label: 'Zaakceptowany' },
    { value: 'w_produkcji', label: 'W produkcji' },
    { value: 'gotowy', label: 'Gotowy' },
]

export default function TilesPage() {
    const { tiles, initialize, addTile, updateTile } = useTilesStore()
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<BackendTile | null>(null)
    const [form] = Form.useForm<BackendTile>()

    useEffect(() => { initialize() }, [initialize])

    const data = useMemo(() => tiles, [tiles])

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 160 },
        { title: 'Nazwa', dataIndex: 'name', key: 'name' },
        { title: 'Ilość', dataIndex: 'quantity', key: 'quantity', width: 90 },
        { title: 'Materiał', dataIndex: 'material', key: 'material', width: 160 },
        { title: 'Projekt', dataIndex: 'project', key: 'project', width: 140 },
        { title: 'Status', dataIndex: 'status', key: 'status', width: 160, render: (s: string) => <Tag color={s === 'gotowy' ? 'green' : s === 'w_produkcji' ? 'blue' : s === 'zaakceptowany' ? 'gold' : 'default'}>{s}</Tag> },
        {
            title: 'Akcje', key: 'actions', width: 160,
            render: (_: unknown, record: Tile) => (
                <Space>
                    <Button size="small" onClick={() => onEdit(record)}>Edytuj</Button>
                </Space>
            )
        }
    ]

    const onAdd = () => {
        setEditing(null)
        form.resetFields()
        setOpen(true)
    }

    const onEdit = (t: Tile) => {
        const initial: BackendTile = {
            id: t.id,
            name: t.name,
            project: t.project,
            status: t.status as any,
            description: '',
        }
        setEditing(initial)
        form.setFieldsValue(initial)
        setOpen(true)
    }

    const submit = async () => {
        const values = await form.validateFields()
        if (editing && editing.id) {
            await updateTile(editing.id, values as Partial<Tile>)
            message.success('Zaktualizowano kafelek')
        } else {
            const newTile: Tile = {
                id: crypto.randomUUID(),
                name: values.name || 'Nowy kafelek',
                status: 'W KOLEJCE',
                project: values.project,
                priority: 'Średni',
                technology: 'Frezowanie CNC',
                laborCost: 0,
                bom: []
            }
            await addTile(newTile)
            message.success('Dodano kafelek')
        }
        setOpen(false)
    }

    const uploadProps = {
        name: 'file',
        action: '/api/upload',
        data: () => ({ tileId: editing?.id }),
        onChange(info: any) {
            if (info.file.status === 'done') message.success('Przesłano plik')
            else if (info.file.status === 'error') message.error('Błąd uploadu')
        }
    }

    return (
        <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>Kafelki</h3>
                <Button type="primary" onClick={onAdd}>Dodaj</Button>
            </div>
            <Table rowKey="id" dataSource={data as any} columns={columns as any} pagination={{ pageSize: 10 }} />

            <Drawer title={editing ? `Edytuj ${editing.id}` : 'Nowy kafelek'} open={open} onClose={() => setOpen(false)} width={520}
                extra={<Space><Button onClick={() => setOpen(false)}>Anuluj</Button><Button type="primary" onClick={submit}>Zapisz</Button></Space>}>
                <Form form={form} layout="vertical">
                    <Form.Item label="Nazwa" name="name" rules={[{ required: true, message: 'Wpisz nazwę' }]}>
                        <Input placeholder="np. Panel frontowy" />
                    </Form.Item>
                    <Form.Item label="Projekt" name="project">
                        <Input placeholder="ID projektu" />
                    </Form.Item>
                    <Form.Item label="Status" name="status" initialValue={'do_review'}>
                        <Select options={STATUS_OPTIONS} />
                    </Form.Item>
                    <Form.Item label="Opis" name="description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    {editing?.id && (
                        <Form.Item label="Załącz plik (DXF/PDF)">
                            <Upload {...uploadProps} accept=".pdf,.dxf,.dwg" maxCount={1}>
                                <Button icon={<UploadOutlined />}>Wybierz plik</Button>
                            </Upload>
                        </Form.Item>
                    )}
                </Form>
            </Drawer>
        </div>
    )
}


