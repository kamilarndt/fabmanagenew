import { useEffect, useRef } from 'react'

// Lazy import to avoid increasing initial bundle too much
async function createViewer(container: HTMLElement, url: string) {
    const mod: any = await import('dxf-viewer')
    const DxfViewer = mod.DxfViewer || mod.default?.DxfViewer || mod
    const viewer = new DxfViewer(container, { autoResize: true, antialias: true, preserveDrawingBuffer: true })
    await viewer.Load({ url, fonts: null, progressCbk: null, workerFactory: null })
    viewer.FitView(0, 0, 0, 0, 20)
    return viewer
}

export default function DxfFullscreenModal({ open, onClose, file }: { open: boolean; onClose: () => void; file: File | null }) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, onClose])

    useEffect(() => {
        if (!open || !file || !containerRef.current) return
        let disposed = false
        const container = containerRef.current
        container.innerHTML = ''
        const mount = document.createElement('div')
        mount.style.width = '100%'
        mount.style.height = '100%'
        container.appendChild(mount)

        // Create an object URL to feed the viewer
        const objectUrl = URL.createObjectURL(file)
        createViewer(mount, objectUrl).then(viewer => {
            if (disposed) return
            // Close on double click background
            viewer.Subscribe?.('pointerdown', (ev: any) => {
                if (ev?.button === 1) onClose()
            })
        })
        return () => {
            disposed = true
            URL.revokeObjectURL(objectUrl)
            container.innerHTML = ''
        }
    }, [open, file, onClose])

    if (!open) return null

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1060 }}>
            <div className="w-100 h-100 bg-dark bg-opacity-75" onClick={onClose} />
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center p-2 bg-dark text-white">
                    <div className="fw-medium">Podgląd DXF</div>
                    <button className="btn btn-sm btn-outline-light" onClick={onClose} aria-label="Zamknij">
                        <i className="ri-close-line" />
                    </button>
                </div>
                <div ref={containerRef} className="flex-fill bg-black" />
            </div>
        </div>
    )
}


