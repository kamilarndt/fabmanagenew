import { useEffect, useRef, useState } from 'react'

// Lazy import to avoid increasing initial bundle too much
async function createViewer(container: HTMLElement, url: string) {
    const mod: any = await import('dxf-viewer')
    const DxfViewer = mod.DxfViewer || mod.default?.DxfViewer || mod
    const viewer = new DxfViewer(container, {
        autoResize: true,
        antialias: true,
        preserveDrawingBuffer: true
    })
    await viewer.Load({ url, fonts: null, progressCbk: null, workerFactory: null })
    // Fit view to full drawing bounds (zoom extents)
    try {
        const b = viewer.GetBounds?.()
        if (b) viewer.FitView(b.minX, b.maxX, b.minY, b.maxY, 0.1)
        viewer.Render?.()
    } catch (err) {
        console.warn('DXF viewer fit/render error', err)
    }
    return viewer
}

export default function DxfFullscreenModal({ open, onClose, file }: { open: boolean; onClose: () => void; file: File | null }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<any>(null)
    const [layers, setLayers] = useState<{ name: string; displayName?: string; color?: number; visible: boolean }[]>([])

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
        mount.style.background = '#ffffff'
        container.appendChild(mount)

        // Create an object URL to feed the viewer
        const objectUrl = URL.createObjectURL(file)
        createViewer(mount, objectUrl).then(viewer => {
            if (disposed) return
            viewerRef.current = viewer
            // Ensure layers panel and proper fit
            try {
                // Set white background for visibility
                const renderer: any = viewer.GetRenderer?.()
                if (renderer?.setClearColor) renderer.setClearColor(0xffffff, 1)
                const b = viewer.GetBounds?.()
                if (b) viewer.FitView(b.minX, b.maxX, b.minY, b.maxY, 0.1)
                viewer.Render?.()
                const arr: any[] = []
                for (const lyr of (viewer.GetLayers?.() as any) || []) {
                    arr.push({ name: lyr.name, displayName: (lyr as any).displayName, color: lyr.color, visible: true })
                }
                setLayers(arr)
            } catch (err) {
                console.warn('DXF viewer setup error', err)
            }
            // Close on middle click
            viewer.Subscribe?.('pointerdown', (ev: any) => {
                if (ev?.button === 1) onClose()
            })
            // Ensure fit after async internal build
            viewer.Subscribe?.('loaded', () => {
                try {
                    const renderer: any = viewer.GetRenderer?.()
                    if (renderer?.setClearColor) renderer.setClearColor(0xffffff, 1)
                    const b = viewer.GetBounds?.()
                    if (b) viewer.FitView(b.minX, b.maxX, b.minY, b.maxY, 0.1)
                    viewer.Render?.()
                } catch (e) { console.warn('DXF on loaded fit error', e) }
            })
        })
        return () => {
            disposed = true
            URL.revokeObjectURL(objectUrl)
            container.innerHTML = ''
            viewerRef.current = null
            setLayers([])
        }
    }, [open, file, onClose])

    const fitExtents = () => {
        const viewer = viewerRef.current
        if (!viewer) return
        try {
            const b = viewer.GetBounds?.()
            if (b) viewer.FitView(b.minX, b.maxX, b.minY, b.maxY, 0.1)
            viewer.Render?.()
        } catch (err) {
            console.warn('DXF fitExtents error', err)
        }
    }

    const toggleLayer = (name: string, next: boolean) => {
        const viewer = viewerRef.current
        if (!viewer) return
        try { viewer.ShowLayer?.(name, next) } catch (err) { console.warn('DXF toggleLayer error', err) }
        setLayers(prev => prev.map(l => l.name === name ? { ...l, visible: next } : l))
    }

    if (!open) return null

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1060 }} data-component="DxfFullscreenModal">
            <div className="w-100 h-100 bg-dark bg-opacity-75" onClick={onClose} />
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center p-2 bg-light" data-component="DxfModalHeader">
                    <div className="fw-medium">Podgląd DXF</div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={fitExtents} aria-label="Dopasuj widok">
                            <i className="ri-focus-2-line" /> Dopasuj
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={onClose} aria-label="Zamknij">
                            <i className="ri-close-line" />
                        </button>
                    </div>
                </div>
                <div className="flex-fill position-relative" data-component="DxfModalBody">
                    <div ref={containerRef} className="w-100 h-100 bg-white" data-component="DxfCanvasContainer" />
                    {layers.length > 0 && (
                        <div className="position-absolute top-0 end-0 m-2 card" style={{ width: 260, maxHeight: '80%', overflow: 'auto' }} data-component="DxfLayersPanel">
                            <div className="card-header py-2"><strong>Warstwy</strong></div>
                            <div className="list-group list-group-flush">
                                {layers.map(l => (
                                    <label key={l.name} className="list-group-item d-flex align-items-center gap-2 py-1">
                                        <input type="checkbox" className="form-check-input" checked={l.visible} onChange={e => toggleLayer(l.name, e.currentTarget.checked)} />
                                        <span className="small" title={l.name}>{l.displayName || l.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


