import { useNavigate } from 'react-router-dom'
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
    
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-success'
            case 'On Hold': return 'bg-warning'
            case 'Done': return 'bg-info'
            case 'W KOLEJCE': return 'bg-secondary'
            case 'W TRAKCIE CIĘCIA': return 'bg-primary'
            case 'WYCIĘTE': return 'bg-info'
            case 'Projektowanie': return 'bg-warning'
            case 'W trakcie projektowania': return 'bg-warning'
            case 'Do akceptacji': return 'bg-warning'
            case 'Zaakceptowane': return 'bg-success'
            case 'Wymagają poprawek': return 'bg-danger'
            case 'Gotowy do montażu': return 'bg-success'
            default: return 'bg-secondary'
        }
    }
    
    return (
        <div className="mb-4">
            {/* Gradient Header Background */}
            <div
                className="rounded-3 position-relative overflow-hidden mb-3 p-4"
                style={{
                    height: 180,
                    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.1"%3E%3Cpath d="m0 40 40-40v40z"/%3E%3C/g%3E%3C/svg%3E")'
                }}
            >
                {/* Navigation Breadcrumb */}
                <div className="d-flex align-items-center text-white mb-3">
                    <button className="btn btn-sm text-white p-0 me-2" onClick={() => navigate('/projekty')}>
                        <i className="ri-arrow-left-line"></i>
                    </button>
                    <nav className="text-white small opacity-75">
                        <span className="me-1">Dashboard</span>
                        <i className="ri-arrow-right-s-line mx-1"></i>
                        <span className="me-1">Project</span>
                        <i className="ri-arrow-right-s-line mx-1"></i>
                        <span>Project {project.id}</span>
                    </nav>
                </div>

                {/* Google Logo Style Icon */}
                <div className="position-absolute" style={{ bottom: '20px', left: '20px' }}>
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center bg-white shadow"
                        style={{ width: 48, height: 48 }}
                    >
                        <i className="ri-briefcase-line h5 mb-0 text-primary"></i>
                    </div>
                </div>
            </div>

            {/* Project Info Section */}
            <div className="position-relative" style={{ marginTop: '-40px', zIndex: 10 }}>
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                                <div className="d-flex align-items-center mb-2">
                                    <h3 className="mb-0 me-3">{project.name}</h3>
                                    <span className={`badge fs-6 px-3 py-2 ${getStatusBadgeClass(project.status)}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center text-muted mb-3">
                                    <i className="ri-calendar-line me-2"></i>
                                    <span className="me-4">{project.deadline}</span>
                                    <i className="ri-user-line me-2"></i>
                                    <span>{project.manager || 'Anna Kowalska'}</span>
                                </div>
                            </div>

                            {/* Team Avatars and Actions */}
                            <div className="d-flex align-items-center gap-3">
                                <div className="d-flex align-items-center">
                                    {teamMembers.slice(0, 4).map((m, index) => (
                                        <img
                                            key={m.id}
                                            src={m.avatar}
                                            alt={m.name}
                                            className="rounded-circle border border-2 border-white shadow-sm"
                                            width="36"
                                            height="36"
                                            style={{
                                                marginLeft: index > 0 ? -12 : 0,
                                                zIndex: teamMembers.length - index
                                            }}
                                            title={m.name}
                                        />
                                    ))}
                                    {teamMembers.length > 4 && (
                                        <div
                                            className="rounded-circle bg-light border border-2 border-white d-flex align-items-center justify-content-center text-muted small fw-medium shadow-sm"
                                            style={{
                                                width: 36,
                                                height: 36,
                                                marginLeft: -12,
                                                zIndex: 0
                                            }}
                                        >
                                            +{teamMembers.length - 4}
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={onAddMember}
                                >
                                    <i className="ri-user-add-line me-1"></i>Invite
                                </button>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={onEditProject}
                                >
                                    <i className="ri-edit-line me-1"></i>Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
