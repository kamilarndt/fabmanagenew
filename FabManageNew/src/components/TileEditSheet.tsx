import { Drawer, Tabs, Form, Input, Select, Row, Col, Upload, Table, Statistic, Button, Space, Typography } from 'antd'
import type { TabsProps } from 'antd'
import type { Tile } from '../types/tiles.types'

interface TileEditSheetProps {
    tile: Tile | null
    open: boolean
    onClose: () => void
    onSave: (data: Partial<Tile>) => void
}

export default function TileEditSheet({ open, onClose, tile, onSave }: TileEditSheetProps) {
    const [form] = Form.useForm<Partial<Tile>>()

    const title = tile ? `Edycja elementu: ${tile.name}` : 'Nowy element'

    const items: TabsProps['items'] = [
        {
            key: 'main',
            label: 'Dane główne',
            children: (
                <Form form={form} layout="vertical" initialValues={tile || {}}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="Nazwa" rules={[{ required: true, message: 'Podaj nazwę' }]}>
                                <Input placeholder="np. Panel frontowy" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="status" label="Status">
                                <Select options={[
                                    { value: 'do_review', label: 'Do review' },
                                    { value: 'zaakceptowany', label: 'Zaakceptowany' },
                                    { value: 'w_produkcji', label: 'W produkcji' },
                                    { value: 'gotowy', label: 'Gotowy' },
                                ]} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="assignee" label="Projektant">
                                <Select options={[
                                    { value: 'Anna', label: 'Anna' },
                                    { value: 'Paweł', label: 'Paweł' },
                                    { value: 'Ola', label: 'Ola' },
                                    { value: 'Kamil', label: 'Kamil' },
                                ]} allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="technology" label="Technologia wiodąca">
                                <Input placeholder="np. Frezowanie CNC" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            )
        },
        {
            key: 'files',
            label: 'Pliki produkcyjne',
            children: (
                <Row gutter={16}>
                    <Col span={12}>
                        <Typography.Text>DXF/DWG</Typography.Text>
                        <Upload.Dragger multiple={false} accept=".dxf,.dwg" name="file" action="/api/upload" data={{ tileId: tile?.id }} height={200}>
                            <p>Upuść plik DXF/DWG lub kliknij</p>
                        </Upload.Dragger>
                    </Col>
                    <Col span={12}>
                        <Typography.Text>PDF (Rysunek złożeniowy)</Typography.Text>
                        <Upload.Dragger multiple={false} accept=".pdf" name="file" action="/api/upload" data={{ tileId: tile?.id }} height={200}>
                            <p>Upuść plik PDF lub kliknij</p>
                        </Upload.Dragger>
                    </Col>
                </Row>
            )
        },
        {
            key: 'bom',
            label: 'Lista materiałów (BOM)',
            children: (
                <div>
                    <Space style={{ marginBottom: 12 }}>
                        <Button type="primary">Dodaj pozycję</Button>
                        <Button>Z katalogu</Button>
                    </Space>
                    <Table
                        size="small"
                        rowKey="id"
                        dataSource={(tile?.bom as any) || []}
                        columns={[
                            { title: 'Nazwa', dataIndex: 'name' },
                            { title: 'Typ', dataIndex: 'type' },
                            { title: 'Ilość', dataIndex: 'quantity' },
                            { title: 'Jm', dataIndex: 'unit' },
                            { title: 'Cena jm', dataIndex: 'unitCost', render: (v: number) => (v || 0).toLocaleString('pl-PL') + ' PLN' },
                            { title: 'Wartość', render: (_: any, r: any) => (((r.quantity || 0) * (r.unitCost || 0)).toLocaleString('pl-PL') + ' PLN') },
                        ]}
                        pagination={false}
                        footer={() => (
                            <Row gutter={16}>
                                <Col xs={24} md={8}><Statistic title="Pozycje" value={(tile?.bom || []).length} /></Col>
                                <Col xs={24} md={8}><Statistic title="Koszt materiałów" value={(tile?.bom || []).reduce((s, i) => s + (i.quantity || 0) * (i.unitCost || 0), 0)} precision={2} suffix="PLN" /></Col>
                                <Col xs={24} md={8}><Statistic title="Koszt całkowity" value={((tile?.bom || []).reduce((s, i) => s + (i.quantity || 0) * (i.unitCost || 0), 0) + (tile?.laborCost || 0))} precision={2} suffix="PLN" /></Col>
                            </Row>
                        )}
                    />
                </div>
            )
        }
    ]

    const handleSave = async () => {
        const values = await form.validateFields().catch(() => null)
        if (!values) return
        onSave(values)
    }

    return (
        <Drawer
            title={title}
            placement="bottom"
            onClose={onClose}
            open={open}
            height="90%"
            extra={<Button type="primary" onClick={handleSave}>Zapisz</Button>}
        >
            <Tabs defaultActiveKey="main" items={items} />
        </Drawer>
    )
}



