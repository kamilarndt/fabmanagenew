import { Card, Progress, Avatar, Space, Typography, Button, Tooltip } from 'antd'
import { CalendarOutlined, UserOutlined, FileTextOutlined, EyeOutlined } from '@ant-design/icons'
import type { Tile } from '../../types/tiles.types'
import { StatusBadge } from '../Ui/StatusBadge'

const { Text, Title } = Typography

interface TileCardProps {
    tile: Tile
    onEdit?: (tile: Tile) => void
    onView?: (tile: Tile) => void
    onAssign?: (tile: Tile) => void
}

export default function TileCard({ tile, onEdit, onView, onAssign }: TileCardProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Brak terminu'
        return new Date(dateString).toLocaleDateString('pl-PL')
    }

    const getMaterialSummary = () => {
        if (!tile.bom || tile.bom.length === 0) {
            return 'Brak materiałów'
        }

        const totalMaterials = tile.bom.length
        const keyMaterials = tile.bom.slice(0, 2)

        return (
            <div className="material-summary">
                <div className="key-materials">
                    {keyMaterials.map((material, index) => (
                        <div key={index} className="material-item">
                            <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                - {material.name} ... {material.quantity} {material.unit}
                            </Text>
                        </div>
                    ))}
                </div>
                {totalMaterials > 2 && (
                    <Text type="secondary" style={{ fontSize: '0.75rem' }}>
                        + {totalMaterials - 2} więcej...
                    </Text>
                )}
            </div>
        )
    }

    const getProgressFromStatus = (status: string) => {
        const statusProgress: Record<string, number> = {
            'W KOLEJCE': 0,
            'Projektowanie': 10,
            'W trakcie projektowania': 25,
            'Do akceptacji': 50,
            'Zaakceptowane': 75,
            'W TRAKCIE CIĘCIA': 80,
            'W produkcji CNC': 85,
            'WYCIĘTE': 90,
            'Gotowy do montażu': 95,
            'Zakończony': 100,
            'Wymagają poprawek': 30,
            'Wstrzymany': 0
        }
        return statusProgress[status] || 0
    }

    return (
        <Card
            hoverable
            className="tile-card"
            cover={
                <div className="tile-preview">
                    {tile.link_model_3d ? (
                        <div
                            style={{
                                width: '100%',
                                height: 150,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '1.5rem',
                                cursor: 'pointer'
                            }}
                            onClick={() => window.open(tile.link_model_3d, '_blank')}
                        >
                            <Space direction="vertical" align="center">
                                <EyeOutlined />
                                <Text style={{ color: 'white', fontSize: '0.8rem' }}>Podgląd 3D</Text>
                            </Space>
                        </div>
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                height: 150,
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '1.5rem'
                            }}
                        >
                            🖼️
                        </div>
                    )}
                </div>
            }
            actions={[
                <Tooltip title="Otwórz szczegóły">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => onView?.(tile)}
                    />
                </Tooltip>,
                <Tooltip title="Przypisz projektanta">
                    <Button
                        type="text"
                        icon={<UserOutlined />}
                        onClick={() => onAssign?.(tile)}
                    />
                </Tooltip>,
                <Tooltip title="Edytuj">
                    <Button
                        type="text"
                        icon={<FileTextOutlined />}
                        onClick={() => onEdit?.(tile)}
                    />
                </Tooltip>
            ]}
        >
            <div className="tile-card-content">
                {/* Header with name and ID */}
                <div className="tile-header">
                    <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                        {tile.name}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                        ID: {tile.id}
                    </Text>
                </div>

                {/* Status and deadline */}
                <div className="tile-status" style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <StatusBadge status={tile.status} />
                        <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                            <CalendarOutlined style={{ marginRight: 4 }} />
                            {formatDate(tile.termin)}
                        </Text>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="tile-progress" style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text strong style={{ fontSize: '0.8rem' }}>Postęp</Text>
                        <Text style={{ fontSize: '0.8rem' }}>{getProgressFromStatus(tile.status)}%</Text>
                    </div>
                    <Progress
                        percent={getProgressFromStatus(tile.status)}
                        size="small"
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                </div>

                {/* Materials section */}
                <div className="tile-materials">
                    <Text strong style={{ fontSize: '0.8rem', marginBottom: 6, display: 'block' }}>
                        MATERIAŁY:
                    </Text>
                    {getMaterialSummary()}
                </div>

                {/* Module and assignee info */}
                <div className="tile-meta" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                    {tile.moduł_nadrzędny && (
                        <div style={{ marginBottom: 4 }}>
                            <Text type="secondary" style={{ fontSize: '0.75rem' }}>
                                Moduł: {tile.moduł_nadrzędny}
                            </Text>
                        </div>
                    )}
                    {tile.przypisany_projektant && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 6 }} />
                            <Text type="secondary" style={{ fontSize: '0.75rem' }}>
                                {tile.przypisany_projektant}
                            </Text>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}
