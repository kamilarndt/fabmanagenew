import { useState } from 'react'
import type { ReactNode } from 'react'

interface ProgressiveDisclosureProps {
    title: string
    defaultExpanded?: boolean
    children: ReactNode
    className?: string
}

export default function ProgressiveDisclosure({
    title,
    defaultExpanded = false,
    children,
    className = ''
}: ProgressiveDisclosureProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)

    return (
        <div className={`progressive-disclosure ${className}`}>
            <button
                className="btn btn-link d-flex align-items-center p-0 text-start w-100"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-controls="disclosure-content"
            >
                <i className={`ri-arrow-${isExpanded ? 'down' : 'right'}-s-line me-2`}></i>
                <span className="fw-medium">{title}</span>
            </button>

            <div
                id="disclosure-content"
                className={`disclosure-content ${isExpanded ? 'expanded' : 'collapsed'}`}
                aria-hidden={!isExpanded}
            >
                <div className="pt-2">
                    {children}
                </div>
            </div>
        </div>
    )
}
