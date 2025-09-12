import { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Card, Button, Space, message, Spin, Alert } from 'antd'
import { EyeOutlined, SelectOutlined, CameraOutlined, BuildOutlined } from '@ant-design/icons'
// import { log } from '../lib/logger'

interface SpeckleViewerInstance {
    init(): Promise<void>
    loadObject(url: string, authToken?: string): Promise<void>
    zoomExtents(): Promise<void>
    dispose(): void
    getScreenshot?(): Promise<HTMLCanvasElement>
    getSelectedObjects?(): Promise<Array<{ id?: string; object?: { id: string } }>>
    selectObjects?(ids: string[]): Promise<void>
    setSelection?(ids: string[]): Promise<void>
    clearSelection?(): Promise<void>
    isolateObjects?(ids: string[]): Promise<void>
    on?(event: string, callback: () => void): void
    DomEvents?: unknown
    renderer?: { domElement: HTMLCanvasElement }
}

type SpeckleViewerProps = {
    // Accept single URL or an array of URLs to render composite model
    initialStreamUrl?: string | string[]
    authToken?: string
    style?: React.CSSProperties
    className?: string
    height?: number | string
    enableSelection?: boolean
    enableMaterialAssignment?: boolean
    enableScreenshot?: boolean
    onSelectionChange?: (selectedObjectIds: string[]) => void
    onMaterialAssignment?: (objectIds: string[], materialId: string) => void
    onScreenshot?: (screenshotData: string) => void
    onReady?: (api: {
        highlight: (ids: string[]) => Promise<void>
        clearHighlight: () => Promise<void>
        isolate: (ids: string[]) => Promise<void>
        clearIsolation: () => Promise<void>
        captureScreenshot: () => Promise<string | null>
        getSelectedObjects: () => Promise<string[]>
    }) => void
    // Tile context for material assignment
    projectId?: string
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

export function SpeckleViewer({
    initialStreamUrl,
    authToken,
    style,
    className,
    height = 400,
    enableSelection = false,
    enableMaterialAssignment = false,
    enableScreenshot = false,
    onSelectionChange,
    onMaterialAssignment: _onMaterialAssignment,
    onScreenshot,
    onReady,
    projectId: _projectId
}: SpeckleViewerProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [failed, setFailed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedObjects, setSelectedObjects] = useState<string[]>([])
    const [viewer, setViewer] = useState<SpeckleViewerInstance | null>(null)
    const [isComponentReady, setIsComponentReady] = useState(false)

    const normalizedUrls = useMemo(() => normalizeUrlList(initialStreamUrl), [initialStreamUrl])
    const primaryUrl = normalizedUrls[0]
    const embedUrl = useMemo(() => buildEmbedUrl(primaryUrl), [primaryUrl])

    // Set component ready after mount
    useEffect(() => {
        setIsComponentReady(true)
    }, [])

    // Debug environment variables
    console.warn('🔧 SpeckleViewer Environment Debug:', {
        VITE_SPECKLE_SERVER: import.meta.env.VITE_SPECKLE_SERVER,
        VITE_SPECKLE_TOKEN: import.meta.env.VITE_SPECKLE_TOKEN ? '***TOKEN_SET***' : 'NOT_SET',
        NODE_ENV: import.meta.env.NODE_ENV,
        MODE: import.meta.env.MODE,
        initialStreamUrl,
        authToken: authToken ? '***AUTH_TOKEN_SET***' : 'NOT_SET',
        normalizedUrls: normalizedUrls,
        containerRef: containerRef.current ? 'READY' : 'NOT_READY',
        isComponentReady
    })

    const handleSelectionChange = useCallback((ids: string[]) => {
        setSelectedObjects(ids)
        if (onSelectionChange) {
            onSelectionChange(ids)
        }
        // Store in global for backward compatibility
        ; (window as any).__speckleSelection = ids
    }, [onSelectionChange])

    const captureScreenshot = useCallback(async (): Promise<string | null> => {
        if (!viewer) return null

        try {
            // Use Speckle viewer's built-in screenshot capability
            const canvas = await viewer.getScreenshot?.() || await viewer.renderer?.domElement
            if (canvas) {
                const dataUrl = canvas.toDataURL('image/png', 0.9)
                if (onScreenshot) {
                    onScreenshot(dataUrl)
                }
                return dataUrl
            }
        } catch (err) {
            console.warn('Screenshot capture failed:', err)
        }
        return null
    }, [viewer, onScreenshot])

    const getSelectedObjects = useCallback(async (): Promise<string[]> => {
        if (!viewer) return []

        try {
            const selection = await viewer.getSelectedObjects?.() || []
            return selection.map((s: { id?: string; object?: { id: string } }) => s?.id || s?.object?.id).filter((id): id is string => Boolean(id))
        } catch {
            return []
        }
    }, [viewer])

    useLayoutEffect(() => {
        let disposed = false
        let viewerInstance: SpeckleViewerInstance | null = null
        let initTimeout: NodeJS.Timeout | undefined

        async function init() {
            // Add a small delay to ensure DOM is fully ready
            await new Promise(resolve => setTimeout(resolve, 100))

            if (disposed) return

            if (!isComponentReady || !containerRef.current || normalizedUrls.length === 0) {
                console.warn('🔧 SpeckleViewer: Component not ready', {
                    isComponentReady,
                    containerRef: !!containerRef.current,
                    containerElement: containerRef.current,
                    normalizedUrls: normalizedUrls.length,
                    urls: normalizedUrls,
                    authToken: authToken ? 'SET' : 'NOT_SET'
                })
                return
            }

            setLoading(true)
            setError(null)

            try {
                // Check if container has proper dimensions
                const containerWidth = containerRef.current.offsetWidth
                const containerHeight = containerRef.current.offsetHeight

                console.warn('🔧 SpeckleViewer: Initializing viewer...', {
                    containerElement: containerRef.current,
                    containerWidth,
                    containerHeight,
                    urls: normalizedUrls,
                    isConnected: containerRef.current.isConnected
                })

                if (containerWidth === 0 || containerHeight === 0) {
                    // Try to wait a bit more for the container to be properly sized
                    console.warn('🔧 SpeckleViewer: Container has zero dimensions, waiting...', {
                        containerWidth,
                        containerHeight,
                        computedStyle: containerRef.current ? window.getComputedStyle(containerRef.current) : null
                    })

                    // Wait a bit more and try again
                    await new Promise(resolve => setTimeout(resolve, 500))

                    if (disposed) return

                    if (!containerRef.current) {
                        throw new Error('Container became unavailable during retry')
                    }

                    const retryWidth = containerRef.current.offsetWidth
                    const retryHeight = containerRef.current.offsetHeight

                    console.warn('🔧 SpeckleViewer: Retry dimensions:', {
                        retryWidth,
                        retryHeight
                    })

                    if (retryWidth === 0 || retryHeight === 0) {
                        throw new Error(`Container still has invalid dimensions after retry: ${retryWidth}x${retryHeight}. Make sure the container is visible and has proper CSS dimensions.`)
                    }
                }

                if (!containerRef.current.isConnected) {
                    throw new Error('Container element is not connected to DOM')
                }

                const [{ Viewer }] = await Promise.all([
                    import('@speckle/viewer') as unknown as Promise<{ Viewer: new (container: HTMLElement, options?: any) => SpeckleViewerInstance }>
                ])

                if (disposed) return

                // Triple-check container is still available and connected
                if (!containerRef.current || !containerRef.current.isConnected) {
                    console.warn('🔧 SpeckleViewer: Container became unavailable, retrying...', {
                        containerRef: !!containerRef.current,
                        isConnected: containerRef.current?.isConnected
                    })

                    // Wait a bit and try to find the container again
                    await new Promise(resolve => setTimeout(resolve, 200))

                    if (disposed) return

                    if (!containerRef.current || !containerRef.current.isConnected) {
                        throw new Error('Container element became unavailable during initialization and retry failed')
                    }

                    console.warn('🔧 SpeckleViewer: Container recovered after retry')
                }

                // Final check before creating viewer
                if (!containerRef.current || !containerRef.current.isConnected) {
                    throw new Error('Container element became unavailable just before viewer creation')
                }

                viewerInstance = new Viewer(containerRef.current, {
                    showStats: false,
                    verbose: false,
                    // Enable selection mode if needed
                    selection: enableSelection
                })

                // Verify viewer was created successfully
                if (!viewerInstance) {
                    throw new Error('Failed to create SpeckleViewer instance')
                }

                await viewerInstance.init()

                // Check if viewer is still valid after init
                if (disposed || !viewerInstance) {
                    console.warn('🔧 SpeckleViewer: Viewer became invalid after init')
                    return
                }

                setViewer(viewerInstance)

                // Load one or multiple models
                for (const url of normalizedUrls) {
                    if (disposed || !viewerInstance) {
                        console.warn('🔧 SpeckleViewer: Viewer became invalid during model loading')
                        return
                    }
                    await viewerInstance.loadObject(url, authToken)
                }
                await viewerInstance.zoomExtents()

                if (enableSelection) {
                    try {
                        // const _selectionHelper = viewerInstance.getExtension?.('SelectionExtension')
                        //     || viewerInstance.extensions?.selection

                        const onSelect = async () => {
                            try {
                                const selection = await getSelectedObjects()
                                handleSelectionChange(selection)
                            } catch {
                                // ignore
                            }
                        }

                        const evtOn = viewerInstance.on as undefined | ((evt: string, cb: () => void) => void)
                        if (evtOn) {
                            evtOn('selection-changed', onSelect)
                        }

                        const domEvents = viewerInstance.DomEvents
                        if (domEvents && typeof (domEvents as any).addEventListener === 'function') {
                            (domEvents as any).addEventListener('click', onSelect)
                        }
                    } catch {
                        // selection not available, ignore
                    }
                }

                // Expose API
                if (onReady) {
                    const api = {
                        highlight: async (ids: string[]) => {
                            try {
                                if (!ids || ids.length === 0) return
                                if (viewerInstance?.selectObjects) await viewerInstance.selectObjects(ids)
                                else if (viewerInstance?.setSelection) await viewerInstance.setSelection(ids)
                            } catch { /* noop */ }
                        },
                        clearHighlight: async () => {
                            try {
                                if (viewerInstance?.clearSelection) await viewerInstance.clearSelection()
                                else if (viewerInstance?.setSelection) await viewerInstance.setSelection([])
                            } catch { /* noop */ }
                        },
                        isolate: async (ids: string[]) => {
                            try {
                                if (viewerInstance?.isolateObjects) await viewerInstance.isolateObjects(ids)
                            } catch { /* noop */ }
                        },
                        clearIsolation: async () => {
                            try {
                                if (viewerInstance?.isolateObjects) await viewerInstance.isolateObjects([])
                            } catch { /* noop */ }
                        },
                        captureScreenshot,
                        getSelectedObjects
                    }
                    onReady(api)
                }
            } catch (err) {
                console.error('🔧 SpeckleViewer initialization failed:', err)
                console.error('🔧 Error details:', {
                    error: err,
                    message: err instanceof Error ? err.message : String(err),
                    stack: err instanceof Error ? err.stack : undefined,
                    containerRef: !!containerRef.current,
                    normalizedUrls: normalizedUrls.length
                })

                const errorMessage = err instanceof Error ? err.message : 'Failed to load 3D model'
                setError(errorMessage)
                setFailed(true)
            } finally {
                setLoading(false)
            }
        }

        init()

        return () => {
            disposed = true
            if (initTimeout) clearTimeout(initTimeout)
            try {
                if (viewerInstance) {
                    console.warn('🔧 SpeckleViewer: Disposing viewer instance')
                    viewerInstance.dispose()
                }
            } catch (err) {
                console.warn('🔧 SpeckleViewer: Error disposing viewer:', err)
            }
        }
    }, [normalizedUrls, authToken, enableSelection, handleSelectionChange, getSelectedObjects, captureScreenshot, onReady, isComponentReady])

    if (normalizedUrls.length === 0) {
        return (
            <Card style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }} className={className}>
                <Alert
                    message="Brak modelu 3D"
                    description="Dodaj link do modelu Speckle w ustawieniach projektu"
                    type="info"
                    showIcon
                />
            </Card>
        )
    }

    if (loading) {
        return (
            <Card style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }} className={className}>
                <Spin size="large" tip="Ładowanie modelu 3D..." />
            </Card>
        )
    }

    if (error) {
        return (
            <Card style={{ height, ...style }} className={className}>
                <Alert
                    message="Błąd ładowania modelu"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <Button size="small" onClick={() => window.location.reload()}>
                            Odśwież
                        </Button>
                    }
                />
            </Card>
        )
    }

    if (failed && embedUrl) {
        return (
            <Card style={{ ...style }} className={className}>
                <div style={{ marginBottom: 8 }}>
                    <Space>
                        <Button
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => window.open(primaryUrl, '_blank')}
                        >
                            Otwórz w Speckle
                        </Button>
                        {enableScreenshot && (
                            <Button
                                size="small"
                                icon={<CameraOutlined />}
                                onClick={captureScreenshot}
                            >
                                Zrób screenshot
                            </Button>
                        )}
                    </Space>
                </div>
                <iframe
                    title="Speckle 3D Viewer"
                    src={embedUrl}
                    style={{
                        width: '100%',
                        height: typeof height === 'number' ? `${height - 40}px` : height,
                        border: 0,
                        borderRadius: 8
                    }}
                    allow="fullscreen; xr-spatial-tracking"
                />
            </Card>
        )
    }

    return (
        <Card style={{ ...style }} className={className}>
            {/* Control Panel */}
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                    {enableSelection && (
                        <Button
                            size="small"
                            icon={<SelectOutlined />}
                            type={selectedObjects.length > 0 ? 'primary' : 'default'}
                        >
                            Zaznaczone: {selectedObjects.length}
                        </Button>
                    )}
                    {enableMaterialAssignment && selectedObjects.length > 0 && (
                        <Button
                            size="small"
                            icon={<BuildOutlined />}
                            onClick={() => {
                                // This would open material assignment modal
                                message.info('Funkcja przypisywania materiałów będzie dostępna wkrótce')
                            }}
                        >
                            Przypisz materiał
                        </Button>
                    )}
                </Space>
                <Space>
                    {enableScreenshot && (
                        <Button
                            size="small"
                            icon={<CameraOutlined />}
                            onClick={captureScreenshot}
                        >
                            Screenshot
                        </Button>
                    )}
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => window.open(primaryUrl, '_blank')}
                    >
                        Otwórz w Speckle
                    </Button>
                </Space>
            </div>

            {/* 3D Viewer Container */}
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    minWidth: '300px',
                    height: typeof height === 'number' ? `${height - 40}px` : height,
                    minHeight: '200px',
                    borderRadius: 8,
                    background: '#0b0f14',
                    display: 'block',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            />
        </Card>
    )
}

export default SpeckleViewer
