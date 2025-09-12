import { Tag } from 'antd';
import { getStatusColor } from '../../lib/statusUtils';

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
    const color = getStatusColor(status as any);
    const icon: string | undefined = undefined;
    const description = status;

    const sizeStyles: Record<'sm' | 'md' | 'lg', React.CSSProperties> = {
        sm: { fontSize: 12, paddingInline: 6, height: 22 },
        md: { fontSize: 12, paddingInline: 8, height: 24 },
        lg: { fontSize: 14, paddingInline: 10, height: 28 }
    };

    return (
        <Tag
            color={color}
            style={{ borderRadius: 0, ...sizeStyles[size] }}
            title={showTooltip ? description : undefined}
            className={className}
        >
            {showIcon && <i className={`${icon} me-1`} />}
            {status}
        </Tag>
    );
}
