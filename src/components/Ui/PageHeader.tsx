import React from 'react'

type Props = {
    title: string
    subtitle?: string
    actions?: React.ReactNode
}

export function PageHeader({ title, subtitle, actions }: Props) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
                <h4 className="mb-1">{title}</h4>
                {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
            </div>
            <div className="d-flex gap-2">
                {actions}
            </div>
        </div>
    )
}
