import { useState, useEffect } from 'react'
import { layoutManager, type LayoutType } from '../lib/UltraWideLayoutManager'

/**
 * React Hook for detecting and responding to layout changes
 * Automatically updates when screen size changes
 */
export function useLayoutDetection() {
    const [layout, setLayout] = useState<LayoutType>(layoutManager.getCurrentLayout())

    useEffect(() => {
        const handleLayoutChange = (newLayout: LayoutType) => {
            setLayout(newLayout)
        }

        layoutManager.onLayoutChange(handleLayoutChange)

        return () => {
            // Cleanup is handled by the layout manager
        }
    }, [])

    return {
        layout,
        isUltraWide: layoutManager.isUltraWide(),
        optimalColumns: layoutManager.getOptimalColumns(),
        isWideDesktop: layout === 'wide-desktop',
        isSuperUltraWide: layout === 'super-ultra-wide',
        isExtremeWide: layout === 'extreme-wide'
    }
}

/**
 * Hook for responsive values based on current layout
 */
export function useResponsiveValue<T>(values: Partial<Record<LayoutType, T>>): T | undefined {
    const { layout } = useLayoutDetection()

    return values[layout] || values.desktop || values.mobile
}

/**
 * Hook for dynamic grid columns
 */
export function useResponsiveGrid(_minCardWidth = 300) {
    const { layout, optimalColumns } = useLayoutDetection()

    const getColumns = () => {
        switch (layout) {
            case 'extreme-wide': return Math.min(optimalColumns, 8)
            case 'super-ultra-wide': return Math.min(optimalColumns, 6)
            case 'ultra-wide': return Math.min(optimalColumns, 5)
            case 'wide-desktop': return 4
            case 'desktop': return 3
            case 'tablet': return 2
            default: return 1
        }
    }

    return {
        columns: getColumns(),
        gridClass: `cols-${getColumns()}`,
        isGrid: getColumns() > 1
    }
}
