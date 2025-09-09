import { Card, Avatar, Tag, Rate, Typography, Space, Button } from 'antd'
import { PhoneOutlined, MailOutlined, GlobalOutlined, EyeOutlined } from '@ant-design/icons'
import type { SubcontractorWithStats } from '../../types/subcontractors.types'

const { Title, Text } = Typography

interface SubcontractorCardProps {
    subcontractor: SubcontractorWithStats
    onClick: () => void
}

export default function SubcontractorCard({ subcontractor, onClick }: SubcontractorCardProps) {
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
        <Card
            hoverable
            onClick={onClick}
            style={{ height: '100%' }}
            bodyStyle={{ padding: 16 }}
        >
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <Avatar
                    size={64}
                    src={subcontractor.logo}
                    icon={<GlobalOutlined />}
                    style={{ marginBottom: 8 }}
                />
                <Title level={4} style={{ margin: '8px 0 4px 0' }}>
                    {subcontractor.name}
                </Title>
                <Space>
                    <Tag color={getCategoryColor(subcontractor.category)}>
                        {subcontractor.category}
                    </Tag>
                    <Tag color={getStatusColor(subcontractor.status)}>
                        {subcontractor.status}
                    </Tag>
                </Space>
            </div>

            <div style={{ marginBottom: 12 }}>
                <Rate
                    disabled
                    value={subcontractor.rating}
                    style={{ fontSize: 14 }}
                />
                <Text type="secondary" style={{ marginLeft: 8 }}>
                    ({subcontractor.rating}/5)
                </Text>
            </div>

            <div style={{ marginBottom: 12 }}>
                <Text strong>Kontakt:</Text>
                <div style={{ marginTop: 4 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        <PhoneOutlined /> {subcontractor.phone}
                    </Text>
                </div>
                <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        <MailOutlined /> {subcontractor.email}
                    </Text>
                </div>
            </div>

            <div style={{ marginBottom: 12 }}>
                <Text strong>Specjalizacje:</Text>
                <div style={{ marginTop: 4 }}>
                    {subcontractor.specialties.slice(0, 2).map((specialty, index) => (
                        <Tag key={index} style={{ marginBottom: 2 }}>
                            {specialty}
                        </Tag>
                    ))}
                    {subcontractor.specialties.length > 2 && (
                        <Tag style={{ marginBottom: 2 }}>
                            +{subcontractor.specialties.length - 2} więcej
                        </Tag>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Zlecenia:</Text>
                    <Text style={{ fontSize: 12 }}>
                        {subcontractor.currentOrders.length}/{subcontractor.capacity.maxOrders}
                    </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Ukończone:</Text>
                    <Text style={{ fontSize: 12 }}>{subcontractor.completedOrders}</Text>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        Min. zamówienie: {subcontractor.pricing.minOrder} {subcontractor.pricing.currency}
                    </Text>
                </div>
                <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                        e.stopPropagation()
                        onClick()
                    }}
                >
                    Zobacz
                </Button>
            </div>
        </Card>
    )
}
