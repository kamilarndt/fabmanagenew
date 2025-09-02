import { useState } from 'react'

interface GroupFile {
    id: string
    name: string
    url: string
    type: string
}

interface CreateGroupModalProps {
    isOpen: boolean
    onClose: () => void
    onCreateGroup: (groupData: {
        name: string
        description?: string
        thumbnail?: string
        files: GroupFile[]
    }) => void
}

export default function CreateGroupModal({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) {
    const [groupName, setGroupName] = useState('')
    const [groupDesc, setGroupDesc] = useState('')
    const [groupThumb, setGroupThumb] = useState<string | undefined>(undefined)
    const [groupFiles, setGroupFiles] = useState<GroupFile[]>([])

    const handleSubmit = () => {
        if (!groupName.trim()) return

        onCreateGroup({
            name: groupName.trim(),
            description: groupDesc || undefined,
            thumbnail: groupThumb,
            files: groupFiles
        })

        // Reset form
        setGroupName('')
        setGroupDesc('')
        setGroupThumb(undefined)
        setGroupFiles([])
        onClose()
    }

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => setGroupThumb(reader.result as string)
        reader.readAsDataURL(file)
    }

    const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const newFiles: GroupFile[] = []

        for (const file of files) {
            const reader = new FileReader()
            const fileData = await new Promise<string>((resolve) => {
                reader.onload = () => resolve(reader.result as string)
                reader.readAsDataURL(file)
            })

            newFiles.push({
                id: crypto.randomUUID(),
                name: file.name,
                url: fileData,
                type: file.type
            })
        }

        setGroupFiles(prev => [...prev, ...newFiles])
    }

    const removeFile = (fileId: string) => {
        setGroupFiles(prev => prev.filter(f => f.id !== fileId))
    }

    if (!isOpen) return null

    return (
        <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Nowa grupa</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-2">
                            <label className="form-label">Nazwa grupy *</label>
                            <input
                                className="form-control"
                                value={groupName}
                                onChange={e => setGroupName(e.target.value)}
                                placeholder="Wprowadź nazwę grupy"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Opis</label>
                            <textarea
                                className="form-control"
                                rows={3}
                                value={groupDesc}
                                onChange={e => setGroupDesc(e.target.value)}
                                placeholder="Opcjonalny opis grupy"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Miniatura</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                onChange={handleThumbnailUpload}
                            />
                            {groupThumb && (
                                <img
                                    src={groupThumb}
                                    alt="Podgląd miniatury grupy"
                                    className="mt-2 rounded"
                                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                                />
                            )}
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Pliki/Dokumentacja</label>
                            <input
                                type="file"
                                multiple
                                className="form-control"
                                onChange={handleFilesUpload}
                            />
                            {groupFiles.length > 0 && (
                                <ul className="list-group mt-2">
                                    {groupFiles.map(file => (
                                        <li key={file.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span className="text-truncate" style={{ maxWidth: 280 }}>
                                                {file.name}
                                            </span>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => removeFile(file.id)}
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-outline-secondary" onClick={onClose}>
                            Anuluj
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={!groupName.trim()}
                        >
                            Utwórz grupę
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
