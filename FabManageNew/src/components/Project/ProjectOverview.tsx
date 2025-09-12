import { useState } from 'react'
import { FileManager } from '../Ui/FileManager'
import type { Project } from '../../types/projects.types'
import { Card, List, Avatar, Typography, Input, Button, Row, Col, Tag, Segmented, Empty } from 'antd'

interface ProjectComment {
    id: string
    author: string
    content: string
    timestamp: string
    avatar: string
}

interface ProjectDocument {
    id: string
    name: string
    type: string
    uploadedBy: string
    uploadedAt: string
    size: string
}

interface TeamMember {
    id: string
    name: string
    role: string
    avatar: string
    workload: number
}

interface ProjectOverviewProps {
    project: Project
    comments: ProjectComment[]
    documents: ProjectDocument[]
    teamMembers: TeamMember[]
    onAddComment: (comment: string) => void
}

export default function ProjectOverview({
    project,
    comments,
    documents,
    teamMembers,
    onAddComment
}: ProjectOverviewProps) {
    const [newComment, setNewComment] = useState('')
    const [viewMode, setViewMode] = useState<'activities' | 'updates'>('activities')

    const handleSubmitComment = () => {
        if (!newComment.trim()) return
        onAddComment(newComment.trim())
        setNewComment('')
    }

    return (
        <Row gutter={[12, 12]}>
            <Col xs={24} lg={16}>
                <Card style={{ marginBottom: 12 }}>
                    <Typography.Title level={5} style={{ marginBottom: 8 }}>About Project</Typography.Title>
                    <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                        {project.description || 'Brak opisu projektu.'}
                    </Typography.Paragraph>
                </Card>

                <Card style={{ marginBottom: 12 }}>
                    <Typography.Title level={5} style={{ marginBottom: 12 }}>Comments</Typography.Title>
                    <List
                        itemLayout="horizontal"
                        dataSource={comments}
                        style={{ marginBottom: 12 }}
                        renderItem={(comment) => (
                            <List.Item key={comment.id}>
                                <List.Item.Meta
                                    avatar={<Avatar src={comment.avatar} size={32} />}
                                    title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>{comment.author}</strong>
                                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>{comment.timestamp}</Typography.Text>
                                        </div>
                                    }
                                    description={<Typography.Text type="secondary">{comment.content}</Typography.Text>}
                                />
                            </List.Item>
                        )}
                    />
                    <Input.TextArea
                        rows={3}
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        style={{ marginBottom: 8 }}
                    />
                    <Button onClick={handleSubmitComment}>Post Comment</Button>
                </Card>

                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Typography.Title level={5} style={{ margin: 0 }}>Key Resources</Typography.Title>
                    </div>
                    <FileManager
                        files={documents.map(d => ({ id: d.id, name: d.name }))}
                        onUpload={(file) => { /* TODO: integrate storage */ console.warn('TODO: upload', file.name) }}
                    />
                </Card>
            </Col>
            <Col xs={24} lg={8}>
                <Card style={{ marginBottom: 12 }}>
                    <Typography.Title level={5} style={{ marginBottom: 12 }}>Member Roles</Typography.Title>
                    <List
                        dataSource={teamMembers}
                        renderItem={(m) => (
                            <List.Item key={m.id}>
                                <List.Item.Meta
                                    avatar={<Avatar src={m.avatar} size={36} />}
                                    title={<span style={{ fontWeight: 500 }}>{m.name}</span>}
                                    description={<Typography.Text type="secondary">{m.role}</Typography.Text>}
                                />
                                <Tag>Member</Tag>
                            </List.Item>
                        )}
                    />
                </Card>
                <Card>
                    <Typography.Title level={5} style={{ marginBottom: 12 }}>History</Typography.Title>
                    <Segmented
                        size="small"
                        options={[{ label: 'Activities', value: 'activities' }, { label: 'Updates', value: 'updates' }]}
                        value={viewMode}
                        onChange={(v) => setViewMode(v as typeof viewMode)}
                        style={{ marginBottom: 12 }}
                    />
                    <div style={{ paddingLeft: 8, borderLeft: '1px dashed var(--border-medium)' }}>
                        <Empty description={viewMode === 'activities' ? 'No activities yet' : 'No updates yet'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                </Card>
            </Col>
        </Row>
    )
}
