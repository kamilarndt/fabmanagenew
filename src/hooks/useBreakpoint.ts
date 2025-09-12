import { useEffect, useMemo, useState } from 'react'

export type Breakpoints = Record<string, number>

export interface BreakpointState {
    breakpoint: string
    width: number
    height: number
    orientation: 'portrait' | 'landscape'
    isAtLeast: (key: string) => boolean
    isAtMost: (key: string) => boolean
}

const getActiveKey = (bps: Breakpoints, width: number): string => {
    const entries = Object.entries(bps).sort((a, b) => a[1] - b[1])
    let active = entries[0]?.[0] ?? 'unknown'
    for (const [key, val] of entries) {
        if (width >= val) active = key
    }
    return active
}

export function useBreakpoint(breakpoints: Breakpoints, fallback: string = 'desktop'): BreakpointState {
    const bps = useMemo(() => breakpoints, [breakpoints])
    const [size, setSize] = useState(() => ({ w: typeof window !== 'undefined' ? window.innerWidth : 0, h: typeof window !== 'undefined' ? window.innerHeight : 0 }))

    useEffect(() => {
        const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
        onResize()
        window.addEventListener('resize', onResize)
        window.addEventListener('orientationchange', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
            window.removeEventListener('orientationchange', onResize)
        }
    }, [])

    const active = useMemo(() => {
        if (!size.w) return fallback
        return getActiveKey(bps, size.w)
    }, [bps, size.w, fallback])

    const isAtLeast = (key: string) => size.w >= (bps[key] ?? Number.MAX_SAFE_INTEGER)
    const isAtMost = (key: string) => size.w <= (bps[key] ?? 0)
    const orientation: 'portrait' | 'landscape' = size.w >= size.h ? 'landscape' : 'portrait'

    return {
        breakpoint: active,
        width: size.w,
        height: size.h,
        orientation,
        isAtLeast,
        isAtMost,
    }
}

export default useBreakpoint
