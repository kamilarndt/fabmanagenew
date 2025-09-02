import type { ReactNode } from 'react'
import { useEffect } from 'react'

type SlideOverProps = {
    open: boolean
    title?: string
    width?: number
    onClose: () => void
    headerExtra?: ReactNode
    footer?: ReactNode
    children: ReactNode
}

export default function SlideOver({ open, title, width = 520, onClose, headerExtra, footer, children }: SlideOverProps) {
    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        if (open) document.addEventListener('keydown', onEsc)
        return () => document.removeEventListener('keydown', onEsc)
    }, [open, onClose])

    if (!open) return null

    return (
        <div className="slideover-root" role="dialog" aria-modal="true">
            <div className="slideover-backdrop" onClick={onClose} />
            <aside className="slideover-panel" style={{ width }}>
                <div className="slideover-header">
                    <h5 className="mb-0">{title}</h5>
                    <div className="d-flex align-items-center gap-2">
                        {headerExtra}
                        <button className="btn-close" onClick={onClose} aria-label="Zamknij" />
                    </div>
                </div>
                <div className="slideover-body">
                    {children}
                </div>
                {footer && (
                    <div className="slideover-footer">
                        {footer}
                    </div>
                )}
            </aside>
            <style>{`
                .slideover-root { position: fixed; inset: 0; z-index: 1050; }
                .slideover-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.35); }
                .slideover-panel { position: absolute; top: 0; right: 0; height: 100%; background: #fff; box-shadow: -12px 0 24px rgba(0,0,0,0.12); display: flex; flex-direction: column; transform: translateX(0); animation: slideover-in 180ms ease-out; }
                .slideover-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e9ecef; }
                .slideover-body { padding: 16px 20px; overflow: auto; flex: 1; }
                .slideover-footer { padding: 12px 20px; border-top: 1px solid #e9ecef; background: #fafafa; display: flex; justify-content: flex-end; gap: 8px; }
                @keyframes slideover-in { from { transform: translateX(24px); opacity: 0.95; } to { transform: translateX(0); opacity: 1; } }
            `}</style>
        </div>
    )
}
