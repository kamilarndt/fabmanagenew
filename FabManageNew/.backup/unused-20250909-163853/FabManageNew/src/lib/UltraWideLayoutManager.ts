/**
 * Ultra-Wide Layout Manager - Dynamic layout detection and optimization for wide screens
 * Supports all monitor types from standard desktop to extreme ultra-wide (5120px+)
 */

export type LayoutType = 'mobile' | 'tablet' | 'desktop' | 'wide-desktop' | 'ultra-wide' | 'super-ultra-wide' | 'extreme-wide'

interface Breakpoints {
    mobile: number
    tablet: number
    desktop: number
    wideDesktop: number
    ultraWide: number
    superUltraWide: number
    extremeWide: number
}

export class UltraWideLayoutManager {
    private breakpoints: Breakpoints = {
        mobile: 768,
        tablet: 1024,
        desktop: 1440,
        wideDesktop: 1440,
        ultraWide: 2560,
        superUltraWide: 3440,
        extremeWide: 5120
    }

    private currentLayout: LayoutType = 'mobile'
    private resizeTimer: number | null = null
    private callbacks: Array<(layout: LayoutType) => void> = []

    constructor() {
        this.init()
    }

    private init(): void {
        this.detectLayout()
        this.setupResizeListener()
        this.applyLayout()
        this.optimizeForCurrentLayout()
    }

    private detectLayout(): void {
        const width = window.innerWidth

        if (width >= this.breakpoints.extremeWide) {
            this.currentLayout = 'extreme-wide'
        } else if (width >= this.breakpoints.superUltraWide) {
            this.currentLayout = 'super-ultra-wide'
        } else if (width >= this.breakpoints.ultraWide) {
            this.currentLayout = 'ultra-wide'
        } else if (width >= this.breakpoints.wideDesktop) {
            this.currentLayout = 'wide-desktop'
        } else if (width >= this.breakpoints.desktop) {
            this.currentLayout = 'desktop'
        } else if (width >= this.breakpoints.tablet) {
            this.currentLayout = 'tablet'
        } else {
            this.currentLayout = 'mobile'
        }
    }

    private applyLayout(): void {
        // Set data attribute on body for CSS targeting
        document.body.setAttribute('data-layout', this.currentLayout)

        // Set CSS custom properties
        document.documentElement.style.setProperty('--current-layout', this.currentLayout)

        // Notify callbacks
        this.callbacks.forEach(callback => callback(this.currentLayout))
    }

    private optimizeForCurrentLayout(): void {
        switch (this.currentLayout) {
            case 'ultra-wide':
                this.optimizeUltraWide()
                break
            case 'super-ultra-wide':
                this.optimizeSuperUltraWide()
                break
            case 'extreme-wide':
                this.optimizeExtremeWide()
                break
            default:
                this.optimizeStandard()
        }
    }

    private optimizeUltraWide(): void {
        // Calculate optimal columns for ultra-wide
        const availableWidth = window.innerWidth - 750 // Minus sidebars
        const cardWidth = 400
        const gap = 24
        const columns = Math.floor(availableWidth / (cardWidth + gap))

        document.documentElement.style.setProperty(
            '--dynamic-columns',
            Math.min(columns, 5).toString()
        )

        // Enable additional features
        this.enableMultiPanelView()
    }

    private optimizeSuperUltraWide(): void {
        // Super ultra-wide specific optimizations
        const availableWidth = window.innerWidth - 900
        const cardWidth = 450
        const gap = 24
        const columns = Math.floor(availableWidth / (cardWidth + gap))

        document.documentElement.style.setProperty(
            '--dynamic-columns',
            Math.min(columns, 6).toString()
        )

        // Enable multi-zone layout
        this.enableMultiZoneLayout()
    }

    private optimizeExtremeWide(): void {
        // Extreme wide optimizations with center-focused approach
        const maxContentWidth = 5000
        const availableWidth = Math.min(window.innerWidth - 700, maxContentWidth)
        const cardWidth = 500
        const gap = 32
        const columns = Math.floor(availableWidth / (cardWidth + gap))

        document.documentElement.style.setProperty(
            '--dynamic-columns',
            Math.min(columns, 8).toString()
        )

        // Center-focused layout
        this.enableCenterFocusedLayout()
    }

    private optimizeStandard(): void {
        // Standard responsive behavior
        const columns = this.calculateStandardColumns()
        document.documentElement.style.setProperty('--dynamic-columns', columns.toString())
    }

    private calculateStandardColumns(): number {
        const width = window.innerWidth
        if (width >= 1440) return 4
        if (width >= 1024) return 3
        if (width >= 768) return 2
        return 1
    }

    private enableMultiPanelView(): void {
        document.body.classList.add('multi-panel-enabled')

        // Show additional sidebars
        const infoPanels = document.querySelectorAll('.info-panel')
        infoPanels.forEach(panel => {
            (panel as HTMLElement).style.display = 'block'
        })
    }

    private enableMultiZoneLayout(): void {
        document.body.classList.add('multi-zone-enabled')

        // Enable zone-based layout
        const dashboard = document.querySelector('.dashboard-container')
        dashboard?.classList.add('multi-zone-dashboard')
    }

    private enableCenterFocusedLayout(): void {
        document.body.classList.add('center-focused-enabled')

        // Apply center-focused wrapper
        const main = document.querySelector('.main-content')
        if (main && !main.closest('.center-focused')) {
            const wrapper = document.createElement('div')
            wrapper.className = 'center-focused'
            main.parentNode?.insertBefore(wrapper, main)
            wrapper.appendChild(main)
        }
    }

    private setupResizeListener(): void {
        window.addEventListener('resize', () => {
            if (this.resizeTimer) {
                clearTimeout(this.resizeTimer)
            }

            this.resizeTimer = setTimeout(() => {
                const oldLayout = this.currentLayout
                this.detectLayout()

                if (oldLayout !== this.currentLayout) {
                    this.applyLayout()
                    this.optimizeForCurrentLayout()
                }
            }, 100) as unknown as number
        })
    }

    // Public methods
    public getCurrentLayout(): LayoutType {
        return this.currentLayout
    }

    public isUltraWide(): boolean {
        return ['ultra-wide', 'super-ultra-wide', 'extreme-wide'].includes(this.currentLayout)
    }

    public onLayoutChange(callback: (layout: LayoutType) => void): void {
        this.callbacks.push(callback)
    }

    public getOptimalColumns(): number {
        const dynamicColumns = document.documentElement.style.getPropertyValue('--dynamic-columns')
        return parseInt(dynamicColumns) || 4
    }

    public enableResponsiveGrid(element: HTMLElement, minCardWidth = 300): void {
        const observer = new ResizeObserver(() => {
            const width = element.offsetWidth
            const gap = 24
            const columns = Math.floor(width / (minCardWidth + gap))

            element.style.setProperty('--grid-columns', Math.max(1, columns).toString())
        })

        observer.observe(element)
    }

    // Utility methods for components
    public getResponsiveValue(values: Record<LayoutType, any>): any {
        return values[this.currentLayout] || values.desktop || values.mobile
    }

    // Clean up
    public destroy(): void {
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer)
        }

        this.callbacks = []
        document.body.removeAttribute('data-layout')
    }
}

// Singleton instance
export const layoutManager = new UltraWideLayoutManager()

// React Hook for layout detection (will be created separately)
// This hook should be in a separate file due to React dependencies
