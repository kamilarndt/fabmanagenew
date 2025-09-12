import { useTilesStore } from '../stores/tilesStore'
import { useDrag } from 'react-dnd'
import { useCallback, useMemo, useState } from 'react'
import TileEditDrawer from '../components/Tiles/tile-edit-drawer'
import { PageHeader } from '../components/Ui/PageHeader'
import { Toolbar } from '../components/Ui/Toolbar'
import { Row, Col, Card, Button, Space, Typography, Tag } from 'antd'

export default function CNC() {
    const { tiles, setStatus } = useTilesStore()
    const [selectedMachine, setSelectedMachine] = useState<string | null>(null)
    const [editing, setEditing] = useState<any | null>(null)

    const kanbanColumns = useMemo(() => [
        {
            id: 'W KOLEJCE',
            title: 'W KOLEJCE',
            color: '#ff9800'
        },
        {
            id: 'W TRAKCIE CIĘCIA',
            title: 'W TRAKCIE CIĘCIA',
            color: '#2196f3'
        },
        {
            id: 'WYCIĘTE',
            title: 'WYCIĘTE',
            color: '#4caf50'
        }
    ], [])

    const machines = useMemo(() => (
        [
            { id: 'CNC-01', status: 'Praca', part: 'P-001', progress: 65, eta: '00:25' },
            { id: 'CNC-02', status: 'Postój', part: '-', progress: 0, eta: '-' },
            { id: 'CNC-03', status: 'Awaria', part: '-', progress: 0, eta: '-' },
            { id: 'CNC-04', status: 'Setup', part: 'P-003', progress: 10, eta: '01:10' },
            { id: 'CNC-05', status: 'Praca', part: 'P-002', progress: 42, eta: '00:40' },
            { id: 'CNC-06', status: 'Praca', part: 'P-004', progress: 80, eta: '00:12' },
        ] as const
    ), [])

    const kpis = useMemo(() => {
        const total = tiles.length
        const inQueue = tiles.filter(t => t.status === 'W KOLEJCE').length
        const inCut = tiles.filter(t => t.status === 'W TRAKCIE CIĘCIA').length
        const done = tiles.filter(t => t.status === 'WYCIĘTE').length
        const completion = total ? Math.round((done / total) * 100) : 0
        return { inQueue, inCut, done, completion }
    }, [tiles])

    return (
        <div>
            <PageHeader
                title="CNC - Monitoring i kolejka"
                subtitle="Zarządzanie produkcją CNC i monitoring maszyn"
            />

            <Toolbar
                left={
                    <Space>
                        <Tag>
                            <i className="ri-time-line" style={{ marginRight: 6 }}></i>Zmiana: 03:12
                        </Tag>
                    </Space>
                }
                right={
                    <Space>
                        <Button size="small" danger onClick={() => alert('Alarmy potwierdzone')} title="Potwierdź alarmy">
                            <i className="ri-alarm-warning-line" style={{ marginRight: 6 }}></i>Alarms: 2
                        </Button>
                    </Space>
                }
            />

            <Card style={{ marginBottom: 12 }}>
                <Space wrap>
                    {machines.map(m => (
                        <Button key={m.id} size="small" type={selectedMachine === m.id ? 'primary' : 'default'} onClick={() => setSelectedMachine(m.id)} title={`${m.status} • Część: ${m.part} • ETA ${m.eta}`}>
                            <Tag color={m.status === 'Praca' ? 'success' : m.status === 'Postój' ? 'warning' : m.status === 'Awaria' ? 'error' : 'processing'} style={{ marginRight: 6 }} />
                            {m.id}
                        </Button>
                    ))}
                </Space>
            </Card>

            <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
                <Col xs={12} lg={6}><Card><div style={{ textAlign: 'center' }}><div style={{ fontSize: 20 }}>{kpis.inQueue}</div><Typography.Text type="secondary">W kolejce</Typography.Text></div></Card></Col>
                <Col xs={12} lg={6}><Card><div style={{ textAlign: 'center' }}><div style={{ fontSize: 20 }}>{kpis.inCut}</div><Typography.Text type="secondary">W trakcie cięcia</Typography.Text></div></Card></Col>
                <Col xs={12} lg={6}><Card><div style={{ textAlign: 'center' }}><div style={{ fontSize: 20 }}>{kpis.done}</div><Typography.Text type="secondary">Wycięte</Typography.Text></div></Card></Col>
                <Col xs={12} lg={6}><Card><div style={{ textAlign: 'center' }}><div style={{ fontSize: 20 }}>{kpis.completion}%</div><Typography.Text type="secondary">Ukończenie</Typography.Text></div></Card></Col>
            </Row>

            <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
                <Col xs={24} lg={16}>
                    <Card title="Kolejka priorytetowa">
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead><tr><th>#</th><th>Nazwa</th><th>Qty</th><th>Maszyna</th><th>Start</th><th>Materiał</th><th>Priorytet</th></tr></thead>
                                <tbody>
                                    {tiles.map((t, i) => (
                                        <tr key={t.id}>
                                            <td>{i + 1}</td>
                                            <td>{t.name}</td>
                                            <td>{(Math.abs(t.id.charCodeAt(0) - 64) % 5) + 1}</td>
                                            <td>{machines[i % machines.length].id}</td>
                                            <td>08:{(10 + i * 3) % 60}</td>
                                            <td><Tag color={(i % 2) ? 'success' : 'warning'}>{(i % 2) ? 'ready' : 'pending'}</Tag></td>
                                            <td><Tag color={i % 3 === 0 ? 'error' : i % 3 === 1 ? 'warning' : 'default'}>{i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Normal'}</Tag></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Szczegóły maszyny">
                        {!selectedMachine && <Typography.Text type="secondary">Wybierz maszynę powyżej</Typography.Text>}
                        {selectedMachine && (
                            <div>
                                <Typography.Title level={5} style={{ marginTop: 0 }}>{selectedMachine}</Typography.Title>
                                <Row gutter={[8, 8]} style={{ marginBottom: 8 }}>
                                    <Col span={12}><Typography.Text type="secondary" style={{ fontSize: 12 }}>Spindle</Typography.Text><div>12 500 rpm</div></Col>
                                    <Col span={12}><Typography.Text type="secondary" style={{ fontSize: 12 }}>Feed</Typography.Text><div>1.8 m/min</div></Col>
                                    <Col span={12}><Typography.Text type="secondary" style={{ fontSize: 12 }}>Temp</Typography.Text><div>54°C</div></Col>
                                    <Col span={12}><Typography.Text type="secondary" style={{ fontSize: 12 }}>Tool wear</Typography.Text><div>23%</div></Col>
                                </Row>
                                <div style={{ borderTop: '1px solid var(--border-medium)', margin: '8px 0' }} />
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>Ostatnie alarmy</Typography.Text>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <li style={{ padding: '4px 0', borderBottom: '1px solid var(--border-medium)' }}><Tag color='error' style={{ marginRight: 8 }}>CRIT</Tag>Overheat • 08:15</li>
                                    <li style={{ padding: '4px 0', borderBottom: '1px solid var(--border-medium)' }}><Tag color='warning' style={{ marginRight: 8 }}>WARN</Tag>Low coolant • 07:40</li>
                                </ul>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            <div style={{ marginBottom: 12 }}>
                <Row gutter={[12, 12]}>
                    {kanbanColumns.map(col => (
                        <Col xs={24} md={8} key={col.id}>
                            <Card title={col.title}>
                                {tiles.filter(t => t.status === col.id).map(t => (
                                    <DraggableTile key={t.id} id={t.id} name={t.name} onEdit={() => setEditing(t)} />
                                ))}
                                {tiles.filter(t => t.status === col.id).length === 0 && (
                                    <Typography.Text type="secondary">Brak zadań</Typography.Text>
                                )}
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <TileEditDrawer
                open={!!editing}
                onClose={() => setEditing(null)}
                onSave={(tileData: any) => {
                    if (editing) {
                        setStatus(editing.id, (tileData.status || editing.status) as any)
                    }
                    setEditing(null)
                }}
                tile={editing || undefined}
                projectId={editing?.project}
            />
        </div>
    )
}

function DraggableTile({ id, name, onEdit }: { id: string; name: string; onEdit?: () => void }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'CNC_TILE',
        item: { id },
        collect: m => ({ isDragging: m.isDragging() })
    }), [id])
    const dragRef = useCallback((el: HTMLDivElement | null) => { if (el) drag(el) }, [drag])
    return (
        <Card ref={dragRef as any} size="small" style={{ marginBottom: 8, border: '1px solid var(--border-medium)', opacity: isDragging ? 0.5 : 1 }} onDoubleClick={onEdit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{id} • {name}</span>
                <Button size="small" onClick={onEdit} title="Edytuj"><i className="ri-edit-line"></i></Button>
            </div>
        </Card>
    )
}


