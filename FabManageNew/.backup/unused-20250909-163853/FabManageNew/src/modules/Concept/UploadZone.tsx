import { useConceptStore, type ConceptFile } from '../../stores/conceptStore'

export default function UploadZone({ projectId }: { projectId: string }) {
    const addFiles = useConceptStore(s => s.addFiles)
    const files = useConceptStore(s => s.byProject[projectId]?.files || [])

    const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const list = Array.from(e.target.files || [])
        if (list.length === 0) return
        const mapped: ConceptFile[] = list.map(f => ({
            id: crypto.randomUUID(),
            name: f.name,
            size: f.size,
            type: f.type,
            url: URL.createObjectURL(f)
        }))
        addFiles(projectId, mapped)
        e.currentTarget.value = ''
    }

    return (
        <div className="card mb-3">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="mb-1">Pliki od klienta</h6>
                        <small className="text-muted">Dodaj referencje, moodboardy, szkice</small>
                    </div>
                    <label className="btn btn-outline-primary mb-0">
                        <i className="ri-upload-2-line me-1"></i>Dodaj pliki
                        <input type="file" multiple hidden onChange={onPick} />
                    </label>
                </div>
                <div className="row g-2 mt-2">
                    {files.map(f => (
                        <div className="col-12 col-md-6 col-lg-4" key={f.id}>
                            <div className="border rounded p-2 h-100">
                                <div className="d-flex justify-content-between">
                                    <div className="text-truncate" title={f.name}>{f.name}</div>
                                    <a className="small" href={f.url} target="_blank" rel="noreferrer">Podgląd</a>
                                </div>
                                <small className="text-muted">{(f.size / 1024).toFixed(0)} KB</small>
                            </div>
                        </div>
                    ))}
                    {files.length === 0 && (
                        <div className="col-12">
                            <div className="text-muted small">Brak plików – dodaj powyżej.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}



