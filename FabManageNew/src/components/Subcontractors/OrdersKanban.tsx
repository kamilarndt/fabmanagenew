import { Card, Row, Col, Typography, Button, Tag, Progress, Space, Tooltip } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'
import { useSubcontractorsStore } from '../../stores/subcontractorsStore'
import type { OrderStatus } from '../../types/subcontractors.types'

const { Title, Text } = Typography

const orderStatuses: { status: OrderStatus; title: string; color: string }[] = [
    { status: 'Do zamówienia', title: 'Do Zamówienia', color: '#faad14' },
    { status: 'Zamówione', title: 'Zamówione', color: '#1890ff' },
    { status: 'W produkcji', title: 'W Produkcji', color: '#722ed1' },
    { status: 'W transporcie', title: 'W Transporcie', color: '#13c2c2' },
    { status: 'Dostarczone', title: 'Dostarczone', color: '#52c41a' },
    { status: 'Anulowane', title: 'Anulowane', color: '#ff4d4f' }
]

export default function OrdersKanban() {
    const { getOrdersByStatus, orders } = useSubcontractorsStore()


    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: currency === 'PLN' ? 'PLN' : 'EUR'
        }).format(amount)
    }

    const getDaysUntilDeadline = (deadline: string) => {
        const today = new Date()
        const deadlineDate = new Date(deadline)
        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const getDeadlineStatus = (deadline: string) => {
        const days = getDaysUntilDeadline(deadline)
        if (days < 0) return { color: 'red', text: 'Przeterminowane' }
        if (days <= 3) return { color: 'orange', text: `${days} dni` }
        if (days <= 7) return { color: 'blue', text: `${days} dni` }
        return { color: 'green', text: `${days} dni` }
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>
                    Kanban Zleceń Podwykonawców
                </Title>
                <Button type="primary" icon={<PlusOutlined />}>
                    Nowe Zlecenie
                </Button>
            </div>

            {/* Statystyki */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                                {orders.length}
                            </Title>
                            <div>Wszystkich zleceń</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                                {getOrdersByStatus('Dostarczone').length}
                            </Title>
                            <div>Dostarczonych</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={4} style={{ margin: 0, color: '#faad14' }}>
                                {getOrdersByStatus('W produkcji').length + getOrdersByStatus('W transporcie').length}
                            </Title>
                            <div>W realizacji</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={4} style={{ margin: 0, color: '#722ed1' }}>
                                {orders.reduce((sum, order) => sum + order.cost, 0).toLocaleString('pl-PL')} PLN
                            </Title>
                            <div>Wartość zleceń</div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Kanban Board */}
            <Row gutter={16}>
                {orderStatuses.map(({ status, title, color }) => {
                    const statusOrders = getOrdersByStatus(status)

                    return (
                        <Col key={status} xs={24} sm={12} lg={8} xl={4}>
                            <Card
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{title}</span>
                                        <Tag color={color}>{statusOrders.length}</Tag>
                                    </div>
                                }
                                size="small"
                                style={{ height: '100%' }}
                                headStyle={{
                                    backgroundColor: color,
                                    color: 'white',
                                    borderBottom: `2px solid ${color}`
                                }}
                                bodyStyle={{ padding: 8 }}
                            >
                                <div style={{ minHeight: 400 }}>
                                    {statusOrders.map((order) => {
                                        const deadlineInfo = getDeadlineStatus(order.deadline)

                                        return (
                                            <Card
                                                key={order.id}
                                                size="small"
                                                style={{
                                                    marginBottom: 8,
                                                    cursor: 'pointer',
                                                    border: '1px solid #f0f0f0'
                                                }}
                                                bodyStyle={{ padding: 12 }}
                                            >
                                                <div style={{ marginBottom: 8 }}>
                                                    <Text strong style={{ fontSize: 12 }}>
                                                        {order.title}
                                                    </Text>
                                                </div>

                                                <div style={{ marginBottom: 8 }}>
                                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                                        {order.subcontractorId}
                                                    </Text>
                                                </div>

                                                <div style={{ marginBottom: 8 }}>
                                                    <Text style={{ fontSize: 12, color: '#1890ff' }}>
                                                        {formatCurrency(order.cost, order.currency)}
                                                    </Text>
                                                </div>

                                                <div style={{ marginBottom: 8 }}>
                                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                                        Ilość: {order.quantity}
                                                    </Text>
                                                </div>

                                                {order.progress > 0 && (
                                                    <div style={{ marginBottom: 8 }}>
                                                        <Progress
                                                            percent={order.progress}
                                                            size="small"
                                                            showInfo={false}
                                                        />
                                                        <Text type="secondary" style={{ fontSize: 10 }}>
                                                            {order.progress}%
                                                        </Text>
                                                    </div>
                                                )}

                                                <div style={{ marginBottom: 8 }}>
                                                    <Tag
                                                        color={deadlineInfo.color}
                                                        style={{ fontSize: 10 }}
                                                    >
                                                        {deadlineInfo.text}
                                                    </Tag>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text type="secondary" style={{ fontSize: 10 }}>
                                                        {new Date(order.orderDate).toLocaleDateString('pl-PL')}
                                                    </Text>
                                                    <Space size="small">
                                                        <Tooltip title="Zobacz szczegóły">
                                                            <Button
                                                                type="text"
                                                                size="small"
                                                                icon={<EyeOutlined />}
                                                                style={{ padding: 0, height: 'auto' }}
                                                            />
                                                        </Tooltip>
                                                        <Tooltip title="Edytuj">
                                                            <Button
                                                                type="text"
                                                                size="small"
                                                                icon={<EditOutlined />}
                                                                style={{ padding: 0, height: 'auto' }}
                                                            />
                                                        </Tooltip>
                                                    </Space>
                                                </div>
                                            </Card>
                                        )
                                    })}

                                    {statusOrders.length === 0 && (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: 20,
                                            color: '#999',
                                            fontSize: 12
                                        }}>
                                            Brak zleceń
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </div>
    )
}
