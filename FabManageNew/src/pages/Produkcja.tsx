import { useMemo, useState } from 'react'
import { useTilesStore } from '../stores/tilesStore'
import { PageHeader } from '../components/Ui/PageHeader'
import { Toolbar } from '../components/Ui/Toolbar'
import { EntityTable } from '../components/Ui/EntityTable'
import type { Column } from '../components/Ui/EntityTable'
import { Row, Col, Card, Select, Button, Space, Typography, Progress, Tag, Tabs, Empty } from 'antd'

export default function Produkcja() {
    const { tiles } = useTilesStore()

    const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'kanban' | 'quality' | 'maintenance'>('overview')
    const [lineFilter, setLineFilter] = useState<'Wszystkie' | string>('Wszystkie')
    const [techFilter, setTechFilter] = useState<'Wszystkie' | string>('Wszystkie')
    const [statusFilter, setStatusFilter] = useState<'Wszystkie' | 'Gotowy do montażu' | 'W TRAKCIE CIĘCIA' | 'WYCIĘTE' | 'W KOLEJCE'>('Wszystkie')

    const assemblyTiles = useMemo(() => tiles.filter(tile =>
        (statusFilter === 'Wszystkie' ? true : tile.status === statusFilter)
        && (lineFilter === 'Wszystkie' ? true : tile.project === lineFilter)
        && (techFilter === 'Wszystkie' ? true : tile.technology === techFilter)
    ), [tiles, lineFilter, techFilter, statusFilter])

    const orders = [
        { id: 'O-101', project: 'Linia A', name: 'Panel recepcji', progress: 75 },
        { id: 'O-102', project: 'Linia B', name: 'Stelaż LED', progress: 30 },
        { id: 'O-103', project: 'Linia C', name: 'Płyta tylna', progress: 50 },
        { id: 'O-104', project: 'Linia D', name: 'Zestaw montażowy', progress: 10 }
    ]

    const kanbanColumns = useMemo(() => [
        { id: 'W KOLEJCE', title: 'W KOLEJCE', color: '#ff9800' },
        { id: 'W TRAKCIE CIĘCIA', title: 'W TRAKCIE CIĘCIA', color: '#2196f3' },
        { id: 'WYCIĘTE', title: 'WYCIĘTE', color: '#4caf50' },
        { id: 'Gotowy do montażu', title: 'Gotowy do montażu', color: '#4caf50' }
    ], [])

    const queueColumns: Column<any>[] = useMemo(() => [
        { key: 'id', header: 'ID', width: 80 },
        { key: 'name', header: 'Nazwa', render: (tile) => <div style={{ fontWeight: 600 }}>{tile.name}</div> },
        { key: 'project', header: 'Projekt' },
        { key: 'technology', header: 'Technologia' },
        {
            key: 'cost',
            header: 'Koszt',
            render: (tile) => `${(tile.laborCost || 0) + (tile.bom || []).reduce((sum: number, item: any) => sum + (item.quantity * (item.unitCost || 0)), 0)} PLN`
        },
        {
            key: 'status',
            header: 'Status',
            render: (tile) => <Tag color="success">{tile.status}</Tag>
        }
    ], [])

    return (
        <div>
            <PageHeader
                title="Produkcja"
                subtitle="Monitoring produkcji, kolejka montażowa i kontrola jakości"
            />

            <Toolbar
                left={
                    <Space>
                        <Select size="middle" style={{ minWidth: 160 }} value={lineFilter} onChange={v => setLineFilter(v)} options={[{ value: 'Wszystkie', label: 'Wszystkie' }, ...['Linia A', 'Linia B', 'Linia C', 'Linia D'].map(l => ({ value: l, label: l }))]} />
                        <Select size="middle" style={{ minWidth: 160 }} value={techFilter} onChange={v => setTechFilter(v)} options={[{ value: 'Wszystkie', label: 'Wszystkie' }, ...Array.from(new Set(tiles.map(t => t.technology))).map(t => ({ value: t, label: t }))]} />
                        <Select size="middle" style={{ minWidth: 200 }} value={statusFilter} onChange={v => setStatusFilter(v as any)} options={['Wszystkie', 'W KOLEJCE', 'W TRAKCIE CIĘCIA', 'WYCIĘTE', 'Gotowy do montażu'].map(s => ({ value: s, label: s }))} />
                    </Space>
                }
                right={
                    <Space>
                        <Button size="small">
                            <i className="ri-download-line" style={{ marginRight: 6 }}></i>Eksport
                        </Button>
                    </Space>
                }
            />

            {/* KPI rows */}
            <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
                {[
                    { label: 'Plan vs Actual', value: '84%', extra: 'on track' },
                    { label: 'OLE', value: '76%', extra: '▲ 2%' },
                    { label: 'Scrap rate', value: '3.2%', extra: 'vs 4% target' },
                    { label: 'Labor productivity', value: '52 pcs/h', extra: 'good' },
                ].map((k, i) => (
                    <Col xs={12} lg={6} key={i}><Card><div style={{ textAlign: 'center' }}><div style={{ fontSize: 20 }}>{k.value}</div><Typography.Text type="secondary" style={{ display: 'block' }}>{k.label}</Typography.Text><Typography.Text style={{ color: 'var(--success-strong)' }}>{k.extra}</Typography.Text></div></Card></Col>
                ))}
            </Row>
            <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
                {[
                    { label: 'Downtime today', value: '38 min' },
                    { label: 'MTTR', value: '12 min' },
                    { label: 'Energy efficiency', value: '1.9 kWh/pc' },
                    { label: 'Safety record', value: '27 dni' },
                ].map((k, i) => (
                    <Col xs={12} lg={6} key={i}><Card><div style={{ textAlign: 'center' }}><div style={{ fontSize: 20 }}>{k.value}</div><Typography.Text type="secondary">{k.label}</Typography.Text></div></Card></Col>
                ))}
            </Row>

            {/* Tabs */}
            <Card style={{ marginBottom: 12 }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={(k) => setActiveTab(k as typeof activeTab)}
                    items={[
                        { key: 'overview', label: <span><i className="ri-dashboard-line" style={{ marginRight: 6 }}></i>Przegląd</span> },
                        { key: 'queue', label: <span><i className="ri-list-check" style={{ marginRight: 6 }}></i>Kolejka</span> },
                        { key: 'kanban', label: <span><i className="ri-layout-grid-line" style={{ marginRight: 6 }}></i>Kanban</span> },
                        { key: 'quality', label: <span><i className="ri-shield-check-line" style={{ marginRight: 6 }}></i>Jakość</span> },
                        { key: 'maintenance', label: <span><i className="ri-tools-line" style={{ marginRight: 6 }}></i>Utrzymanie ruchu</span> },
                    ]}
                />
            </Card>

            {activeTab === 'overview' && (
                <Card style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontWeight: 600 }}>Plan vs Actual</div>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>84%</Typography.Text>
                    </div>
                    <Progress percent={84} showInfo={false} strokeColor={'var(--primary-main)'} />
                </Card>
            )}

            {activeTab === 'queue' && (
                <Card style={{ marginBottom: 12 }} title={<span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Kolejka montażowa ({assemblyTiles.length})</span><Tag color="processing">Automatycznie z CNC</Tag></span>}>
                    {assemblyTiles.length > 0 ? (
                        <EntityTable
                            rows={assemblyTiles}
                            columns={queueColumns}
                            rowKey={(tile) => tile.id}
                        />
                    ) : (
                        <Empty description={
                            <div>
                                <div>Brak elementów w kolejce</div>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>Elementy automatycznie pojawią się po zakończeniu cięcia CNC</Typography.Text>
                            </div>
                        } />
                    )}
                </Card>
            )}

            {activeTab === 'kanban' && (
                <Card style={{ marginBottom: 12 }} title="Kanban">
                    <Row gutter={[12, 12]}>
                        {kanbanColumns.map((stage) => (
                            <Col xs={24} xl={6} key={stage.id}>
                                <Card size="small" bodyStyle={{ padding: 8 }} title={<span style={{ fontWeight: 600 }}>{stage.title}</span>}>
                                    <div style={{ minHeight: 260 }}>
                                        {tiles.filter(t => t.status === stage.id).map(t => (
                                            <Card key={t.id} size="small" style={{ marginBottom: 8 }}>
                                                <div style={{ fontWeight: 600 }}>{t.name}</div>
                                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>{t.project} • {t.technology}</Typography.Text>
                                            </Card>
                                        ))}
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>
            )}

            {activeTab === 'quality' && (
                <Row gutter={[12, 12]}>
                    <Col xs={24} xl={18}>
                        <Card title={<span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Live feed</span><Typography.Text type="secondary" style={{ fontSize: 12 }}>odświeżanie co 5s</Typography.Text></span>}>
                            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {Array.from({ length: 16 }).map((_, i) => (
                                        <li key={i} style={{ padding: '4px 0', borderBottom: '1px solid var(--border-medium)' }}>{i % 2 ? 'Start' : 'Complete'} • {orders[i % orders.length].name} • 08:{(10 + i) % 60}</li>
                                    ))}
                                </ul>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} xl={6}>
                        <Card title={<span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Quality panel</span><Button size="small" icon={<i className="ri-refresh-line"></i> as any} /></span>}>
                            <Row gutter={[8, 8]}>
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <Col span={8} key={i}><Tag color={i % 5 === 0 ? 'error' : 'success'} style={{ display: 'block', textAlign: 'center' }}>{i % 5 === 0 ? 'FAIL' : 'PASS'}</Tag></Col>
                                ))}
                            </Row>
                        </Card>
                    </Col>
                </Row>
            )}

            {activeTab === 'maintenance' && (
                <Card title={<span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Utrzymanie ruchu</span><Button size="small"><i className="ri-add-line" style={{ marginRight: 6 }}></i>Nowe zgłoszenie</Button></span>}>
                    <div className="table-responsive">
                        <table className="table table-sm align-middle">
                            <thead><tr><th>Maszyna</th><th>Priorytet</th><th>Status</th><th>Zgłoszono</th><th>Akcja</th></tr></thead>
                            <tbody>
                                {['CNC-01', 'CNC-02', 'MONTAŻ-01'].map((m, i) => (
                                    <tr key={m}><td>{m}</td><td><Tag color={i === 0 ? 'error' : 'warning'}>{i === 0 ? 'Wysoki' : 'Średni'}</Tag></td><td>{i === 2 ? 'Zamknięte' : 'Otwarte'}</td><td>2025-09-1{i + 1}</td><td><Button size="small">Szczegóły</Button></td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    )
}


