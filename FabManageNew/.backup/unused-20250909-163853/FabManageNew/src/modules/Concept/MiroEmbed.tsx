type Props = {
    url: string
    open: boolean
    onClose: () => void
}

export default function MiroEmbed({ url, open, onClose }: Props) {
    if (!open) return null
    return (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.55)' }}>
            <div className="modal-dialog modal-xl" style={{ maxWidth: '95vw' }}>
                <div className="modal-content" style={{ height: '90vh' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Miro Board</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-0" style={{ height: '100%' }}>
                        <iframe
                            title="Miro"
                            src={url}
                            style={{ border: 0, width: '100%', height: '100%' }}
                            allow="fullscreen; clipboard-read; clipboard-write"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}



