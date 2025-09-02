import { useState } from 'react'

interface ConceptItem {
    id: string
    title: string
    description: string
    status: 'draft' | 'review' | 'approved' | 'rejected'
    createdBy: string
    createdAt: string
    attachments: string[]
}

interface ConceptBoardProps {
    projectId: string
}

export default function ConceptBoard({ projectId: _projectId }: ConceptBoardProps) {
    const [concepts, setConcepts] = useState<ConceptItem[]>([
        {
            id: 'concept-1',
            title: 'Wstępna koncepcja architektoniczna',
            description: 'Podstawowe założenia projektowe i układ funkcjonalny',
            status: 'approved',
            createdBy: 'Anna Kowalska',
            createdAt: '2025-01-05',
            attachments: ['concept_v1.pdf', 'sketches.dwg']
        },
        {
            id: 'concept-2',
            title: 'Koncepcja techniczna',
            description: 'Rozwiązania konstrukcyjne i materiałowe',
            status: 'review',
            createdBy: 'Paweł Nowak',
            createdAt: '2025-01-08',
            attachments: ['technical_concept.pdf']
        }
    ])

    const [newConcept, setNewConcept] = useState({
        title: '',
        description: '',
        attachments: [] as string[]
    })

    const handleAddConcept = () => {
        if (!newConcept.title.trim() || !newConcept.description.trim()) return

        const concept: ConceptItem = {
            id: crypto.randomUUID(),
            title: newConcept.title.trim(),
            description: newConcept.description.trim(),
            status: 'draft',
            createdBy: 'Current User',
            createdAt: new Date().toISOString().split('T')[0],
            attachments: newConcept.attachments
        }

        setConcepts(prev => [...prev, concept])
        setNewConcept({ title: '', description: '', attachments: [] })
    }

    const getStatusBadgeClass = (status: ConceptItem['status']) => {
        switch (status) {
            case 'draft': return 'bg-secondary'
            case 'review': return 'bg-warning'
            case 'approved': return 'bg-success'
            case 'rejected': return 'bg-danger'
            default: return 'bg-secondary'
        }
    }

    const getStatusLabel = (status: ConceptItem['status']) => {
        switch (status) {
            case 'draft': return 'Szkic'
            case 'review': return 'W recenzji'
            case 'approved': return 'Zatwierdzone'
            case 'rejected': return 'Odrzucone'
            default: return 'Nieznany'
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Koncepcja Projektu</h5>
                <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addConceptModal">
                    <i className="ri-add-line me-1"></i>Dodaj koncepcję
                </button>
            </div>

            <div className="row g-3">
                {concepts.map(concept => (
                    <div key={concept.id} className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">{concept.title}</h6>
                                <span className={`badge ${getStatusBadgeClass(concept.status)}`}>
                                    {getStatusLabel(concept.status)}
                                </span>
                            </div>
                            <div className="card-body">
                                <p className="text-muted small mb-2">{concept.description}</p>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <small className="text-muted">Autor: {concept.createdBy}</small>
                                    <small className="text-muted">{concept.createdAt}</small>
                                </div>
                                {concept.attachments.length > 0 && (
                                    <div className="mb-2">
                                        <small className="text-muted">Załączniki:</small>
                                        <div className="d-flex flex-wrap gap-1 mt-1">
                                            {concept.attachments.map((file, idx) => (
                                                <span key={idx} className="badge bg-light text-dark border small">
                                                    {file}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="d-flex gap-1">
                                    <button className="btn btn-sm btn-outline-primary">
                                        <i className="ri-eye-line me-1"></i>Podgląd
                                    </button>
                                    <button className="btn btn-sm btn-outline-secondary">
                                        <i className="ri-edit-line me-1"></i>Edytuj
                                    </button>
                                    <button className="btn btn-sm btn-outline-success">
                                        <i className="ri-check-line me-1"></i>Zatwierdź
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Concept Modal */}
            <div className="modal fade" id="addConceptModal" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Nowa koncepcja</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Tytuł koncepcji *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newConcept.title}
                                    onChange={(e) => setNewConcept(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Wprowadź tytuł koncepcji"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Opis *</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={newConcept.description}
                                    onChange={(e) => setNewConcept(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Opisz koncepcję"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Anuluj
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleAddConcept}
                                disabled={!newConcept.title.trim() || !newConcept.description.trim()}
                            >
                                Dodaj koncepcję
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



