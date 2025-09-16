import { useEffect, useRef } from 'react'
// Using CDN variant of frappe-gantt; no module import

type Props = { tasks: any[]; viewMode?: 'Day' | 'Week' | 'Month' | 'Year' }

export default function GanttChart({ tasks, viewMode = 'Week' }: Props) {
    const ref = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        if (!ref.current) return
        ref.current.innerHTML = ''
        const G = (window as any).Gantt
        if (!G) {
            const warn = document.createElement('div')
            warn.style.cssText = 'padding:12px;color:#f66;'
            warn.textContent = 'Brak biblioteki Gantt (CDN)'
            ref.current.appendChild(warn)
            return
        }
        // Inject theme-aware styles once
        if (!ref.current.querySelector('style[data-gantt]')) {
            const style = document.createElement('style')
            style.setAttribute('data-gantt', 'true')
            style.innerHTML = `
                .gantt { width: 100%; }
                .gantt .grid-background { fill: var(--surface-1, #1b1e22); }
                .gantt .grid .grid-row { fill: var(--surface-2, #262a2f); }
                .gantt .grid .grid-row:nth-child(even) { fill: var(--surface-3, #2b3036); }
                .gantt .grid-header { fill: var(--surface-3, #2f343b); }
                .gantt .tick { stroke: var(--border-color, #3b4048); }
                .gantt .bar-label { fill: var(--text-secondary, #c2c6cc); font-size: 11px; }
                .gantt .lower-text, .gantt .upper-text { fill: var(--text-secondary, #c2c6cc); font-size: 10px; }
            `
            ref.current.appendChild(style)
        }
        const dayMs = 24 * 3600 * 1000
        const normalized = (tasks || []).map((t: any) => {
            const hasLegacy = !!(t.start_date || t.text)
            const start = hasLegacy ? t.start_date : t.start
            const end = hasLegacy
                ? new Date(new Date(start).getTime() + (Math.max(1, Number(t.duration) || 1)) * dayMs)
                    .toISOString().slice(0, 10)
                : t.end
            const name = t.name ?? t.text ?? ''
            const progressRaw = t.progress ?? 0
            const progress = progressRaw > 1 ? Math.round(progressRaw) : Math.round(progressRaw * 100)
            const dependencies = (t.dependencies || '')
            return { id: t.id, name, start, end, progress, dependencies }
        })
        const node = document.createElement('div')
        node.style.width = '100%'
        ref.current.appendChild(node)
        const gantt = new G(node, normalized, { view_mode: viewMode, bar_height: 25, padding: 18 })
        // Stretch SVG to container width and disable preserveAspectRatio
        const applyFullWidth = () => {
            const svg = node.querySelector('svg') as SVGSVGElement | null
            if (!svg) return
            svg.setAttribute('preserveAspectRatio', 'none')
                ; (svg.style as any).width = '100%'
            svg.setAttribute('width', '100%')
            const background = svg.querySelector('.grid-background') as SVGRectElement | null
            if (background) {
                background.setAttribute('width', String(svg.clientWidth || svg.getBoundingClientRect().width || 0))
            }
        }
        setTimeout(applyFullWidth, 0)
        window.addEventListener('resize', applyFullWidth)
        try {
            gantt.change_view_mode(viewMode)
        } catch (error) {
            console.warn('Failed to change Gantt view mode:', error)
        }
        return () => {
            window.removeEventListener('resize', applyFullWidth)
            if (ref.current) ref.current.innerHTML = ''
        }
    }, [tasks, viewMode])
    return <div ref={ref} style={{ width: '100%', minHeight: '60vh' }} />
}


