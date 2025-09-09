import { Card, Row, Col, Avatar, Tag, Rate, Typography, Space, Button, Divider, Timeline, Progress } from 'antd'
import { PhoneOutlined, MailOutlined, GlobalOutlined, EnvironmentOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { SubcontractorWithStats } from '../../types/subcontractors.types'

const { Title, Text, Paragraph } = Typography

interface SubcontractorProfileProps {
    subcontractor: SubcontractorWithStats
}

export default function SubcontractorProfile({ subcontractor }: SubcontractorProfileProps) {
    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Stal': 'blue',
            'Tworzywa sztuczne': 'green',
            'Tapicer': 'orange',
            'Szklarz': 'purple',
            'Drukarnia': 'red',
            'Inne': 'default'
        }
        return colors[category] || 'default'
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'Aktywny': 'green',
            'Nieaktywny': 'red',
            'Zawieszony': 'orange'
        }
        return colors[status] || 'default'
    }

    return (
        <div>
            {/* Header */}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={24} align="middle">
                    <Col xs={24} sm={6} style={{ textAlign: 'center' }}>
                        <Avatar
                            size={120}
                            src={subcontractor.logo}
                            icon={<GlobalOutlined />}
                            style={{ marginBottom: 16 }}
                        />
                        <div>
                            <Rate
                                disabled
                                value={subcontractor.rating}
                                style={{ fontSize: 16 }}
                            />
                            <Text type="secondary" style={{ marginLeft: 8 }}>
                                ({subcontractor.rating}/5)
                            </Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Title level={2} style={{ marginBottom: 8 }}>
                            {subcontractor.name}
                        </Title>
                        <Space wrap style={{ marginBottom: 16 }}>
                            <Tag color={getCategoryColor(subcontractor.category)}>
                                {subcontractor.category}
                            </Tag>
                            <Tag color={getStatusColor(subcontractor.status)}>
                                {subcontractor.status}
                            </Tag>
                        </Space>
                        <Paragraph style={{ marginBottom: 16 }}>
                            {subcontractor.description}
                        </Paragraph>
                        <Space>
                            <Button type="primary" icon={<PlusOutlined />}>
                                Nowe Zlecenie
                            </Button>
                            <Button icon={<EditOutlined />}>
                                Edytuj Profil
                            </Button>
                        </Space>
                    </Col>
                    <Col xs={24} sm={6}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ marginBottom: 16 }}>
                                <Text type="secondary">Kontakt</Text>
                                <div style={{ marginTop: 8 }}>
                                    <div style={{ marginBottom: 4 }}>
                                        <PhoneOutlined /> {subcontractor.phone}
                                    </div>
                                    <div style={{ marginBottom: 4 }}>
                                        <MailOutlined /> {subcontractor.email}
                                    </div>
                                    {subcontractor.website && (
                                        <div>
                                            <GlobalOutlined /> {subcontractor.website}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Text type="secondary">Adres</Text>
                                <div style={{ marginTop: 8 }}>
                                    <EnvironmentOutlined /> {subcontractor.address}<br />
                                    {subcontractor.postalCode} {subcontractor.city}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>

            <Row gutter={16}>
                {/* Lewa kolumna */}
                <Col xs={24} lg={16}>
                    {/* Specjalizacje */}
                    <Card title="Specjalizacje" style={{ marginBottom: 16 }}>
                        <Space wrap>
                            {subcontractor.specialties.map((specialty, index) => (
                                <Tag key={index} color="blue" style={{ marginBottom: 8 }}>
                                    {specialty}
                                </Tag>
                            ))}
                        </Space>
                    </Card>

                    {/* Aktualne zlecenia */}
                    <Card title="Aktualne Zlecenia" style={{ marginBottom: 16 }}>
                        {subcontractor.currentOrders.length > 0 ? (
                            <div>
                                {subcontractor.currentOrders.map((order, index) => (
                                    <div key={index} style={{ marginBottom: 16, padding: 12, border: '1px solid #f0f0f0', borderRadius: 6 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                            <Text strong>{order.title}</Text>
                                            <Tag color="blue">{order.status}</Tag>
                                        </div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Termin: {new Date(order.deadline).toLocaleDateString('pl-PL')}
                                        </Text>
                                        <div style={{ marginTop: 8 }}>
                                            <Progress
                                                percent={order.progress}
                                                size="small"
                                                status={order.progress === 100 ? 'success' : 'active'}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Text type="secondary">Brak aktualnych zleceń</Text>
                        )}
                    </Card>

                    {/* Notatki */}
                    <Card title="Notatki">
                        {subcontractor.notes.length > 0 ? (
                            <Timeline>
                                {subcontractor.notes.map((note, index) => (
                                    <Timeline.Item key={index}>
                                        {note}
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        ) : (
                            <Text type="secondary">Brak notatek</Text>
                        )}
                    </Card>
                </Col>

                {/* Prawa kolumna */}
                <Col xs={24} lg={8}>
                    {/* Statystyki */}
                    <Card title="Statystyki" style={{ marginBottom: 16 }}>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text>Wszystkich zleceń:</Text>
                                <Text strong>{subcontractor.totalOrders}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text>Ukończonych:</Text>
                                <Text strong style={{ color: '#52c41a' }}>{subcontractor.completedOrders}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text>W trakcie:</Text>
                                <Text strong style={{ color: '#1890ff' }}>{subcontractor.currentOrders.length}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text>Współczynnik sukcesu:</Text>
                                <Text strong>
                                    {subcontractor.totalOrders > 0
                                        ? Math.round((subcontractor.completedOrders / subcontractor.totalOrders) * 100)
                                        : 0
                                    }%
                                </Text>
                            </div>
                        </div>
                    </Card>

                    {/* Cennik */}
                    <Card title="Cennik" style={{ marginBottom: 16 }}>
                        <div style={{ marginBottom: 12 }}>
                            <Text type="secondary">Minimalne zamówienie:</Text>
                            <div>
                                <Text strong style={{ fontSize: 16 }}>
                                    {subcontractor.pricing.minOrder} {subcontractor.pricing.currency}
                                </Text>
                            </div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <Text type="secondary">Średni koszt:</Text>
                            <div>
                                <Text strong style={{ fontSize: 16 }}>
                                    {subcontractor.pricing.averageCost} {subcontractor.pricing.currency}
                                </Text>
                            </div>
                        </div>
                        <Divider />
                        <div>
                            <Text type="secondary">Czas realizacji:</Text>
                            <div style={{ marginTop: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>Standardowy:</Text>
                                    <Text>{subcontractor.deliveryTime.standard} dni</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>Ekspresowy:</Text>
                                    <Text>{subcontractor.deliveryTime.rush} dni</Text>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Pojemność */}
                    <Card title="Pojemność">
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text>Aktualne zlecenia:</Text>
                                <Text strong>{subcontractor.capacity.currentOrders}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text>Maksymalna pojemność:</Text>
                                <Text strong>{subcontractor.capacity.maxOrders}</Text>
                            </div>
                        </div>
                        <Progress
                            percent={Math.round((subcontractor.capacity.currentOrders / subcontractor.capacity.maxOrders) * 100)}
                            status={subcontractor.capacity.currentOrders >= subcontractor.capacity.maxOrders ? 'exception' : 'active'}
                        />
                        <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                            {subcontractor.capacity.maxOrders - subcontractor.capacity.currentOrders} wolnych miejsc
                        </Text>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
