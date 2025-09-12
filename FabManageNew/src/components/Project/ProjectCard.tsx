import { Card, Progress, Tag, Avatar, Space, Typography, Button } from 'antd'
import { CalendarOutlined, UserOutlined, FileTextOutlined, LinkOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { ProjectWithStats } from '../../types/projects.types'
import { StatusBadge } from '../Ui/StatusBadge'

const { Text, Title } = Typography

interface ProjectCardProps {
    project: ProjectWithStats
    onEdit?: (project: ProjectWithStats) => void
    onDelete?: (project: ProjectWithStats) => void
}

export default function ProjectCard({ project, onEdit }: ProjectCardProps) {
    const navigate = useNavigate()

    const handleCardClick = () => {
        navigate(`/projekt/${project.id}`)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pl-PL')
    }

    const getProjectTypeColor = (typ: string) => {
        const colors: Record<string, string> = {
            'Targi': 'blue',
            'Scenografia TV': 'purple',
            'Muzeum': 'green',
            'Wystawa': 'orange',
            'Event': 'red',
            'Inne': 'default'
        }
        return colors[typ] || 'default'
    }

    return (
        <Card
            hoverable
            className="project-card"
            onClick={handleCardClick}
            cover={
                <div className="project-thumbnail">
                    {project.miniatura ? (
                        <img
                            alt={project.name}
                            src={project.miniatura}
                            style={{ width: '100%', height: 200, objectFit: 'cover' }}
                        />
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                height: 200,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '2rem'
                            }}
                        >
                            🖼️
                        </div>
                    )}
                </div>
            }
            actions={[
                <Button
                    type="text"
                    icon={<FileTextOutlined />}
                    onClick={(e) => {
                        e.stopPropagation()
                        onEdit?.(project)
                    }}
                >
                    Edytuj
                </Button>,
                <Button
                    type="text"
                    icon={<LinkOutlined />}
                    onClick={(e) => {
                        e.stopPropagation()
                        // Zawsze nawiguj do zakładki model_3d – nawet bez przypiętego linku
                        navigate(`/projekt/${project.id}?tab=model_3d`)
                    }}
                >
                    3D Model
                </Button>
            ]}
        >
            <div className="project-card-content">
                {/* Header with name and status */}
                <div className="project-header">
                    <div className="project-title-section">
                        <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                            {project.name}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                            Nr: {project.numer}
                        </Text>
                    </div>
                    <StatusBadge status={project.status} />
                </div>

                {/* Project type and location */}
                <div className="project-meta" style={{ marginBottom: 12 }}>
                    <Tag color={getProjectTypeColor(project.typ)}>
                        {project.typ}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                        📍 {project.lokalizacja}
                    </Text>
                </div>

                {/* Client and deadline */}
                <div className="project-info" style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                        <UserOutlined style={{ marginRight: 6, color: '#666' }} />
                        <Text strong>Klient: {project.client}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarOutlined style={{ marginRight: 6, color: '#666' }} />
                        <Text>Deadline: {formatDate(project.deadline)}</Text>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="project-progress" style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text strong>Postęp</Text>
                        <Text>{project.postep || project.progress || 0}%</Text>
                    </div>
                    <Progress
                        percent={project.postep || project.progress || 0}
                        size="small"
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                </div>

                {/* Project modules */}
                <div className="project-modules">
                    <Text strong style={{ fontSize: '0.9rem', marginBottom: 8, display: 'block' }}>
                        MODUŁY PROJEKTU:
                    </Text>
                    {project.modules && project.modules.length > 0 ? (
                        <div className="modules-list">
                            {project.modules.slice(0, 3).map((module) => (
                                <div key={module} className="module-item" style={{
                                    fontSize: '0.85rem',
                                    marginBottom: 2
                                }}>
                                    <Text>- {module.replace('_', ' ')}</Text>
                                </div>
                            ))}
                            {project.modules.length > 3 && (
                                <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                    + {project.modules.length - 3} więcej...
                                </Text>
                            )}
                        </div>
                    ) : (
                        <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                            Brak zdefiniowanych modułów
                        </Text>
                    )}

                    {/* Total elements count */}
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
                        <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                            Łącznie elementów: <Text strong>{project.tilesCount}</Text>
                        </Text>
                    </div>
                </div>

                {/* Manager info */}
                {project.manager && (
                    <div className="project-manager" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                        <Space>
                            <Avatar size="small" icon={<UserOutlined />} />
                            <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                                Manager: {project.manager}
                            </Text>
                        </Space>
                    </div>
                )}
            </div>
        </Card>
    )
}
