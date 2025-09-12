import { useNavigate } from 'react-router-dom'
import { Card, Button, Tag, Avatar, Space } from 'antd'
import type { Project } from '../../types/projects.types'

interface TeamMember {
    id: string
    name: string
    role: string
    avatar: string
    workload: number
}

interface ProjectHeaderProps {
    project: Project
    teamMembers: TeamMember[]
    onEditProject: () => void
    onAddMember: () => void
}

export default function ProjectHeader({ project, teamMembers, onEditProject, onAddMember }: ProjectHeaderProps) {
    const navigate = useNavigate()


    return (
        <div style={{ marginBottom: 16 }}>
            {/* Navigation Breadcrumb */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 16,
                color: 'var(--text-primary)'
            }}>
                <Button
                    type="text"
                    icon={<i className="ri-arrow-left-line" />}
                    onClick={() => navigate('/projekty')}
                    style={{ marginRight: 8 }}
                />
                <nav style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span style={{ marginRight: 4 }}>Dashboard</span>
                    <i className="ri-arrow-right-s-line" style={{ margin: '0 4px' }} />
                    <span style={{ marginRight: 4 }}>Project</span>
                    <i className="ri-arrow-right-s-line" style={{ margin: '0 4px' }} />
                    <span>Project {project.id}</span>
                </nav>
            </div>

            {/* Project Info Card */}
            <Card
                bordered
                style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)'
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                }}>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 8
                        }}>
                            <h3 style={{
                                margin: 0,
                                marginRight: 12,
                                color: 'var(--text-primary)'
                            }}>
                                {project.name}
                            </h3>
                            <Tag
                                color={project.status === 'W realizacji' ? 'success' :
                                    project.status === 'Wstrzymany' ? 'warning' :
                                        project.status === 'Zakończony' ? 'blue' : 'default'}
                                style={{ fontSize: '0.875rem', padding: '4px 12px' }}
                            >
                                {project.status}
                            </Tag>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'var(--text-muted)',
                            marginBottom: 16
                        }}>
                            <i className="ri-calendar-line" style={{ marginRight: 8 }} />
                            <span style={{ marginRight: 16 }}>{project.deadline}</span>
                            <i className="ri-user-line" style={{ marginRight: 8 }} />
                            <span>{project.manager || 'Anna Kowalska'}</span>
                        </div>
                    </div>

                    {/* Team Avatars and Actions */}
                    <Space size="middle" align="center">
                        <Avatar.Group
                            maxCount={4}
                            size="default"
                            maxStyle={{
                                color: 'var(--text-primary)',
                                backgroundColor: 'var(--bg-hover)'
                            }}
                        >
                            {teamMembers.map((m) => (
                                <Avatar
                                    key={m.id}
                                    src={m.avatar}
                                    alt={m.name}
                                />
                            ))}
                        </Avatar.Group>
                        <Button
                            type="default"
                            icon={<i className="ri-user-add-line" />}
                            onClick={onAddMember}
                        >
                            Invite
                        </Button>
                        <Button
                            type="primary"
                            icon={<i className="ri-edit-line" />}
                            onClick={onEditProject}
                        >
                            Edit
                        </Button>
                    </Space>
                </div>
            </Card>
        </div>
    )
}
