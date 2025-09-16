import { Card, Table, Tag, Typography, Button, Space, Spin, Alert } from 'antd'
import { useDemandsQuery, type Demand } from '../hooks/useDemandsQuery'

// Mockowe dane zaopatrzeń (fallback gdy API nie jest dostępne)
const mockDemands: Demand[] = [
    {
        id: "DEM_001",
        materialId: "MAT_R001",
        name: "MDF 6mm Standard",
        requiredQty: 15,
        createdAt: "2025-01-15T10:30:00Z",
        status: "pending",
        projectId: "PROJ_001",
        tileId: "TILE_A1"
    },
    {
        id: "DEM_002",
        materialId: "MAT_R004",
        name: "MDF 8mm Standard",
        requiredQty: 8,
        createdAt: "2025-01-14T14:20:00Z",
        status: "approved",
        projectId: "PROJ_002",
        tileId: "TILE_B3"
    },
    {
        id: "DEM_003",
        materialId: "MAT_R007",
        name: "Sklejka 12mm",
        requiredQty: 12,
        createdAt: "2025-01-13T09:15:00Z",
        status: "ordered",
        projectId: "PROJ_001",
        tileId: "TILE_C2"
    }
]

export default function Demands() {
    // Używamy TanStack Query zamiast useEffect
    const { data, isLoading, error, refetch } = useDemandsQuery({})

    // Fallback do mockowych danych jeśli API nie jest dostępne
    const items = data?.data || mockDemands
    const loading = isLoading
    const errorMessage = error ? (error as Error).message : null

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', render: (v: string) => <Typography.Text type="secondary">{v}</Typography.Text> },
        {
            title: 'Materiał', key: 'material', render: (_: unknown, d: Demand) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{d.name}</div>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>{d.materialId}</Typography.Text>
                </div>
            )
        },
        { title: 'Ilość', dataIndex: 'requiredQty', key: 'qty' },
        {
            title: 'Projekt / Element', key: 'refs', render: (_: unknown, d: Demand) => (
                <Space>
                    {d.projectId && <Tag>{d.projectId}</Tag>}
                    {d.tileId && <Tag color="default">{d.tileId}</Tag>}
                </Space>
            )
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => {
                const color = s === 'pending' ? 'warning' : s === 'approved' ? 'processing' : s === 'ordered' ? 'success' : 'default'
                const label = s === 'pending' ? 'Oczekujące' : s === 'approved' ? 'Zatwierdzone' : s === 'ordered' ? 'Zamówione' : s
                return <Tag color={color as any}>{label}</Tag>
            }
        },
        { title: 'Utworzone', key: 'createdAt', render: (_: unknown, d: Demand) => <Typography.Text type="secondary">{new Date(d.createdAt).toLocaleString('pl-PL')}</Typography.Text> }
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                    <Typography.Title level={4} style={{ marginBottom: 4 }}>Zapotrzebowania materiałowe</Typography.Title>
                    <Typography.Text type="secondary">Lista pozycji do zamówienia z Rhino/Projektów</Typography.Text>
                </div>
                <Space>
                    <Button onClick={() => refetch()} disabled={loading}>
                        <i className="ri-refresh-line" style={{ marginRight: 6 }}></i>
                        {loading ? 'Odświeżanie...' : 'Odśwież'}
                    </Button>
                </Space>
            </div>

            <Card>
                {errorMessage && <Alert type="error" showIcon message={errorMessage} style={{ marginBottom: 12 }} />}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
                        <Spin />
                    </div>
                ) : (
                    <Table rowKey={d => d.id} dataSource={items} columns={columns as any} pagination={{ pageSize: 10 }} />
                )}
            </Card>
        </div>
    )
}


