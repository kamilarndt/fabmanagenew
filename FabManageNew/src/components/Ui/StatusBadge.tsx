import { getStatusBadgeClass, getStatusIcon, getStatusDescription } from '../../lib/statusUtils';

interface StatusBadgeProps {
    status: string;
    showIcon?: boolean;
    showTooltip?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function StatusBadge({
    status,
    showIcon = true,
    showTooltip = true,
    size = 'md',
    className = ''
}: StatusBadgeProps) {
    const badgeClass = getStatusBadgeClass(status);
    const icon = getStatusIcon(status);
    const description = getStatusDescription(status);

    const sizeClasses = {
        sm: 'badge-sm',
        md: '',
        lg: 'badge-lg'
    };

    const badgeClasses = `${badgeClass} ${sizeClasses[size]} ${className}`.trim();

    return (
        <span
            className={badgeClasses}
            title={showTooltip ? description : undefined}
        >
            {showIcon && <i className={`${icon} me-1`} />}
            {status}
        </span>
    );
}
