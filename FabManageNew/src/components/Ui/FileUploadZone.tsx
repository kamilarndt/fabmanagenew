import { useState, useRef } from 'react'

interface FileUploadZoneProps {
    label: string
    value: string | null
    onChange: (value: string | null) => void
    acceptedTypes?: string
    placeholder?: string
    description?: string
    onFileObjectChange?: (file: File | null) => void
}

export default function FileUploadZone({
    label,
    value,
    onChange,
    acceptedTypes = ".pdf,.dxf,.dwg",
    placeholder = "link lub nazwa pliku",
    description,
    onFileObjectChange
}: FileUploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            const file = files[0]
            onChange(file.name)
            onFileObjectChange?.(file)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            onChange(file.name)
            onFileObjectChange?.(file)
        }
    }

    const openFileDialog = () => {
        fileInputRef.current?.click()
    }

    const getFileIcon = (filename: string) => {
        const ext = filename?.toLowerCase().split('.').pop()
        switch (ext) {
            case 'pdf': return '📄'
            case 'dxf':
            case 'dwg': return '📐'
            default: return '📎'
        }
    }

    const clearFile = () => {
        onChange(null)
        onFileObjectChange?.(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="mb-2">
            <label className="form-label">{label}</label>

            {/* File preview if exists */}
            {value && (
                <div className="mb-2">
                    <div className="card border-success">
                        <div className="card-body p-2">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <span className="fs-4 me-2">{getFileIcon(value)}</span>
                                    <div>
                                        <div className="fw-medium">{value}</div>
                                        {description && (
                                            <small className="text-muted">{description}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="btn-group">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => window.open(`/files/${value}`, '_blank')}
                                        title="Podgląd"
                                    >
                                        <i className="ri-eye-line"></i>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={openFileDialog}
                                        title="Zmień plik"
                                    >
                                        <i className="ri-edit-line"></i>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={clearFile}
                                        title="Usuń plik"
                                    >
                                        <i className="ri-delete-bin-line"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload zone */}
            <div
                className={`border border-2 border-dashed rounded p-3 text-center ${isDragging ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'
                    } ${!value ? '' : 'opacity-75'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ minHeight: '120px' }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes}
                    onChange={handleFileSelect}
                    className="d-none"
                />

                {isDragging ? (
                    <div className="text-primary">
                        <i className="ri-upload-cloud-line fs-1"></i>
                        <div className="mt-2">Upuść plik tutaj</div>
                    </div>
                ) : (
                    <div>
                        <i className="ri-upload-cloud-2-line fs-1 text-muted"></i>
                        <div className="mt-2">
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm me-2"
                                onClick={openFileDialog}
                            >
                                <i className="ri-file-add-line me-1"></i>
                                Wybierz plik
                            </button>
                            <span className="text-muted">lub przeciągnij i upuść</span>
                        </div>
                        <small className="text-muted d-block mt-1">
                            Obsługiwane formaty: PDF, DXF, DWG
                        </small>
                    </div>
                )}
            </div>

            {/* Manual input fallback */}
            <div className="mt-2">
                <div className="input-group input-group-sm">
                    <span className="input-group-text">
                        <i className="ri-link"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder={placeholder}
                        value={value || ''}
                        onChange={e => onChange(e.target.value || null)}
                    />
                    {value && (
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={clearFile}
                        >
                            <i className="ri-close-line"></i>
                        </button>
                    )}
                </div>
                <small className="text-muted">
                    Możesz również wpisać link lub nazwę pliku ręcznie
                </small>
            </div>
        </div>
    )
}
