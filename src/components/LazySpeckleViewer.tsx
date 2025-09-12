import { Suspense, lazy } from 'react'
import { Spin } from 'antd'

// Lazy load SpeckleViewer component
const SpeckleViewer = lazy(() => import('./SpeckleViewer'))

interface LazySpeckleViewerProps {
    initialStreamUrl?: string | string[]
    authToken?: string
    style?: React.CSSProperties
    className?: string
    height?: number | string
    enableSelection?: boolean
    enableMaterialAssignment?: boolean
    onObjectSelected?: (objects: Array<{ id?: string; object?: { id: string } }>) => void
    onObjectDoubleClicked?: (objects: Array<{ id?: string; object?: { id: string } }>) => void
    onSelectionChange?: (ids: string[]) => void
    onScreenshot?: (screenshotData: string) => void
    onError?: (error: Error) => void
    onLoadComplete?: () => void
    onLoadStart?: () => void
    showControls?: boolean
    showStats?: boolean
    enableZoom?: boolean
    enablePan?: boolean
    enableRotate?: boolean
    backgroundColor?: string
    showGrid?: boolean
    gridSize?: number
    gridColor?: string
    showAxes?: boolean
    axesSize?: number
    enableFullscreen?: boolean
    enableScreenshot?: boolean
    enableIsolation?: boolean
    customControls?: React.ReactNode
    loadingText?: string
    errorText?: string
}

export default function LazySpeckleViewer(props: LazySpeckleViewerProps) {
    return (
        <Suspense
            fallback={
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: props.height || 400,
                    flexDirection: 'column',
                    gap: 16
                }}>
                    <Spin size="large" />
                    <div>{props.loadingText || 'Ładowanie modelu 3D...'}</div>
                </div>
            }
        >
            <SpeckleViewer {...props} />
        </Suspense>
    )
}
