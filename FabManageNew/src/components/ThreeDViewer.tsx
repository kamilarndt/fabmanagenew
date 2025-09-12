import { useEffect, useMemo, useRef, useState } from 'react'

interface SpeckleViewerInstance {
    init(): Promise<void>
    loadObject(url: string, authToken?: string): Promise<void>
    zoomExtents(): Promise<void>
    dispose(): void
}

type ThreeDViewerProps = {
    // Accept single URL or an array of URLs to render composite model
    initialStreamUrl?: string | string[]
    authToken?: string
    style?: React.CSSProperties
    className?: string
    height?: number | string
    enableSelection?: boolean
    onSelectionChange?: (selectedObjectIds: string[]) => void
    onReady?: (api: {
        highlight: (ids: string[]) => Promise<void>
        clearHighlight: () => Promise<void>
        isolate: (ids: string[]) => Promise<void>
        clearIsolation: () => Promise<void>
    }) => void
}

function normalizeUrl(url?: string): string | undefined {
    if (!url) return undefined
    try {
        const u = new URL(url)
        return u.toString()
    } catch {
        return undefined
    }
}

function normalizeUrlList(urls?: string | string[]): string[] {
    if (!urls) return []
    if (Array.isArray(urls)) return urls.map(u => normalizeUrl(u)).filter(Boolean) as string[]
    const single = normalizeUrl(urls)
    return single ? [single] : []
}

function buildEmbedUrl(streamUrl?: string): string | undefined {
    if (!streamUrl) return undefined
    try {
        const u = new URL(streamUrl)
        const parts = u.pathname.split('/').filter(Boolean)
        const server = `${u.protocol}//${u.host}`

        let streamId: string | undefined
        let commitId: string | undefined
        let objectId: string | undefined

        for (let i = 0; i < parts.length; i++) {
            if (parts[i] === 'streams' && parts[i + 1]) streamId = parts[i + 1]
            if (parts[i] === 'commits' && parts[i + 1]) commitId = parts[i + 1]
            if (parts[i] === 'objects' && parts[i + 1]) objectId = parts[i + 1]
        }

        const params = new URLSearchParams()
        if (streamId) params.set('stream', streamId)
        if (commitId) params.set('commit', commitId)
        if (objectId) params.set('object', objectId)

        return `${server}/embed?${params.toString()}`
    } catch {
        return undefined
    }
}

export function ThreeDViewer({ initialStreamUrl, authToken, style, className, height = 400, enableSelection = false, onSelectionChange, onReady }: ThreeDViewerProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [failed, setFailed] = useState(false)

    const normalizedUrls = useMemo(() => normalizeUrlList(initialStreamUrl), [initialStreamUrl])
    const primaryUrl = normalizedUrls[0]
    const embedUrl = useMemo(() => buildEmbedUrl(primaryUrl), [primaryUrl])

    useEffect(() => {
        let disposed = false
        let viewer: SpeckleViewerInstance | null = null

        async function init() {
            if (!containerRef.current || normalizedUrls.length === 0) return

            try {
                const [{ Viewer }] = await Promise.all([
                    import('@speckle/viewer') as unknown as Promise<{ Viewer: new (container: HTMLElement, options?: any) => SpeckleViewerInstance }>
                ])

                if (disposed) return

                viewer = new Viewer(containerRef.current, {
                    showStats: false,
                    verbose: false
                })

                await viewer.init()

                // Many Speckle servers support passing a full URL directly
                // Fallbacks to iframe below if not supported.
                // Load one or multiple models
                for (const url of normalizedUrls) {
                    await viewer.loadObject(url, authToken)
                }
                await viewer.zoomExtents()

                if (enableSelection) {
                    try {
                        const selectionHelper = (viewer as any).getExtension?.('SelectionExtension')
                            || (viewer as any).extensions?.selection
                        // Fallback to internal events
                        const onSelect = async () => {
                            try {
                                const selection = await (viewer as any).getSelectedObjects?.()
                                    || (selectionHelper && selectionHelper.getSelectedObjects?.())
                                    || []
                                const ids: string[] = selection.map((s: any) => s?.id || s?.object?.id).filter(Boolean)
                                if (onSelectionChange) {
                                    onSelectionChange(ids)
                                }
                            } catch {
                                // ignore
                            }
                        }
                        const evtOn = (viewer as any).on as undefined | ((evt: string, cb: () => void) => void)
                        if (evtOn) {
                            evtOn('selection-changed', onSelect)
                        }
                        const domEvents = (viewer as any).DomEvents
                        if (domEvents && typeof domEvents.addEventListener === 'function') {
                            domEvents.addEventListener('click', onSelect)
                        }
                    } catch {
                        // selection not available, ignore
                    }
                }

                // Expose basic highlight/isolate API
                if (onReady) {
                    const api = {
                        highlight: async (ids: string[]) => {
                            try {
                                if (!ids || ids.length === 0) return
                                if ((viewer as any).selectObjects) await (viewer as any).selectObjects(ids)
                                else if ((viewer as any).setSelection) await (viewer as any).setSelection(ids)
                            } catch { /* noop */ }
                        },
                        clearHighlight: async () => {
                            try {
                                if ((viewer as any).clearSelection) await (viewer as any).clearSelection()
                                else if ((viewer as any).setSelection) await (viewer as any).setSelection([])
                            } catch { /* noop */ }
                        },
                        isolate: async (ids: string[]) => {
                            try {
                                if ((viewer as any).isolateObjects) await (viewer as any).isolateObjects(ids)
                            } catch { /* noop */ }
                        },
                        clearIsolation: async () => {
                            try {
                                if ((viewer as any).isolateObjects) await (viewer as any).isolateObjects([])
                            } catch { /* noop */ }
                        }
                    }
                    onReady(api)
                }
            } catch (err) {
                console.warn('ThreeDViewer fallback to iframe due to error:', err)
                setFailed(true)
            }
        }

        init()

        return () => {
            disposed = true
            try {
                if (viewer) viewer.dispose()
            } catch { /* noop */ }
        }
    }, [normalizedUrls, authToken])

    if (normalizedUrls.length === 0) {
        return (
            <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }} className={className}>
                Brak poprawnego linku do modelu 3D
            </div>
        )
    }

    if (failed && embedUrl) {
        return (
            <iframe
                title="Speckle 3D Viewer"
                src={embedUrl}
                style={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height, border: 0, borderRadius: 8, ...style }}
                className={className}
                allow="fullscreen; xr-spatial-tracking"
            />
        )
    }

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height, borderRadius: 8, background: '#0b0f14', ...style }}
        />
    )
}

export default ThreeDViewer


