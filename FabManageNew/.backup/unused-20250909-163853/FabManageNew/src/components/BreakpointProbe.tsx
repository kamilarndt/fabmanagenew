import useBreakpoint, { type Breakpoints } from '../hooks/useBreakpoint'

const DEFAULTS: Breakpoints = {
    mobile: 0,
    tablet: 768,
    desktop: 1280,
    wide: 1440,
    ultrawide: 1920,
    superwide: 2560,
    extremewide: 3440,
}

export default function BreakpointProbe({ breakpoints = DEFAULTS }: { breakpoints?: Breakpoints }) {
    const { breakpoint, width, height, orientation } = useBreakpoint(breakpoints, 'desktop')
    return (
        <div style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 2000, opacity: 0.8 }}>
            <span className="badge bg-secondary">{breakpoint} • {width}×{height} • {orientation}</span>
        </div>
    )
}
