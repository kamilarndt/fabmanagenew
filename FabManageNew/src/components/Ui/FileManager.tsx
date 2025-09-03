import React from 'react'

type FileItem = { id: string; name: string; url?: string; type?: string; size?: number }

type Props = {
    files: FileItem[]
    onUpload: (file: File) => void
    onRemove?: (id: string) => void
}

export function FileManager({ files, onUpload, onRemove }: Props) {
    const onChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const f = e.target.files?.[0]
        if (f) onUpload(f)
    }
    return (
        <div>
            <div className="mb-2">
                <input type="file" onChange={onChange} />
            </div>
            <ul className="list-group">
                {files.map(f => (
                    <li key={f.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <i className="ri-file-line me-2"></i>
                            {f.url ? <a href={f.url} target="_blank" rel="noreferrer">{f.name}</a> : f.name}
                        </div>
                        {onRemove && <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(f.id)}><i className="ri-delete-bin-line"></i></button>}
                    </li>
                ))}
            </ul>
        </div>
    )
}


