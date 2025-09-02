import { useState } from 'react'
import SlideOver from '../Ui/SlideOver'

interface TeamMember {
    id: string
    name: string
    role: string
    avatar: string
    workload: number
}

interface AddMemberModalProps {
    isOpen: boolean
    onClose: () => void
    teamMembers: TeamMember[]
    onAddMembers: (memberIds: string[]) => void
}

export default function AddMemberModal({ isOpen, onClose, teamMembers, onAddMembers }: AddMemberModalProps) {
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState('')

    const filteredMembers = teamMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleToggleMember = (memberId: string) => {
        setSelectedMemberIds(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        )
    }

    const handleSubmit = () => {
        onAddMembers(selectedMemberIds)
        setSelectedMemberIds([])
        setSearchTerm('')
        onClose()
    }

    if (!isOpen) return null

    const footer = (
        <>
            <button className="btn btn-outline-secondary" onClick={onClose}>Anuluj</button>
            <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={selectedMemberIds.length === 0}
            >
                Dodaj ({selectedMemberIds.length})
            </button>
        </>
    )

    return (
        <SlideOver open={isOpen} onClose={onClose} title="Dodaj członków" footer={footer}>
            <div className="mb-3">
                <div className="text-muted small mb-1">Wybrani:</div>
                <div className="d-flex flex-wrap gap-1">
                    {teamMembers.filter(m => selectedMemberIds.includes(m.id)).map(m => (
                        <span key={m.id} className="badge bg-light text-dark border">
                            {m.name}
                        </span>
                    ))}
                    {selectedMemberIds.length === 0 && (
                        <span className="text-muted">Brak</span>
                    )}
                </div>
            </div>
            <div className="input-group mb-2">
                <span className="input-group-text">
                    <i className="ri-search-line"></i>
                </span>
                <input
                    className="form-control"
                    placeholder="Szukaj członków..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="list-group" style={{ maxHeight: 360, overflowY: 'auto' }}>
                {filteredMembers.map(member => (
                    <label
                        key={member.id}
                        className="list-group-item d-flex align-items-center justify-content-between"
                    >
                        <div className="d-flex align-items-center">
                            <img
                                src={member.avatar}
                                alt={member.name}
                                className="rounded-circle me-3"
                                width="36"
                                height="36"
                            />
                            <div>
                                <div className="fw-semibold">{member.name}</div>
                                <small className="text-muted">{member.role}</small>
                            </div>
                        </div>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedMemberIds.includes(member.id)}
                            onChange={() => handleToggleMember(member.id)}
                        />
                    </label>
                ))}
            </div>
        </SlideOver>
    )
}
