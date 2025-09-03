import { useState } from 'react'
import { FileManager } from '../Ui/FileManager'
import type { Project } from '../../types/projects.types'

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
        <div className="row g-3">
            <div className="col-12 col-lg-8">
                <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body p-4">
                        <h5 className="mb-2">About Project</h5>
                        <p className="text-muted mb-0">{project.description || 'Brak opisu projektu.'}</p>
                    </div>
                </div>

                <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body p-4">
                        <h5 className="mb-3">Comments</h5>
                        <div className="list-group list-group-flush mb-3">
                            {comments.map(comment => (
                                <div key={comment.id} className="list-group-item px-0">
                                    <div className="d-flex">
                                        <img src={comment.avatar} alt={comment.author} className="rounded-circle me-3" width="32" height="32" />
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between">
                                                <strong>{comment.author}</strong>
                                                <small className="text-muted">{comment.timestamp}</small>
                                            </div>
                                            <p className="mb-1 small text-muted">{comment.content}</p>
                                            <button className="btn btn-sm btn-link p-0">Reply</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <textarea
                            className="form-control mb-2"
                            rows={3}
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                        />
                        <button className="btn btn-outline-primary" onClick={handleSubmitComment}>
                            Post Comment
                        </button>
                    </div>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0">Key Resources</h5>
                        </div>
                        <FileManager
                            files={documents.map(d => ({ id: d.id, name: d.name }))}
                            onUpload={(file) => { /* TODO: integrate storage */ console.log('upload', file.name) }}
                        />
                    </div>
                </div>
            </div>
            <div className="col-12 col-lg-4">
                <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body p-4">
                        <h5 className="mb-3">Member Roles</h5>
                        <div className="list-group list-group-flush">
                            {teamMembers.map(m => (
                                <div key={m.id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <img src={m.avatar} alt={m.name} className="rounded-circle me-3" width="36" height="36" />
                                        <div>
                                            <div className="fw-medium">{m.name}</div>
                                            <small className="text-muted">{m.role}</small>
                                        </div>
                                    </div>
                                    <span className="badge bg-light text-dark">Member</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        <h5 className="mb-3">History</h5>
                        <div className="d-flex gap-2 mb-3">
                            <button
                                className={`btn btn-sm ${viewMode === 'activities' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setViewMode('activities')}
                            >
                                Activities
                            </button>
                            <button
                                className={`btn btn-sm ${viewMode === 'updates' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setViewMode('updates')}
                            >
                                Updates
                            </button>
                        </div>
                        <div className="position-relative ps-4" style={{ borderLeft: '2px dashed #e5e7eb' }}>
                            {/* Placeholder for activities/updates */}
                            <div className="text-center text-muted small">
                                {viewMode === 'activities' ? 'No activities yet' : 'No updates yet'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
