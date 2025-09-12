import React from 'react';
import { cn } from '../../lib/utils';

interface ConstructorButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
}

export const ConstructorButton: React.FC<ConstructorButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    onClick,
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
}) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
        outline: 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md'
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const widthClasses = fullWidth ? 'w-full' : '';

    const iconElement = icon && (
        <span className={cn(
            'flex-shrink-0',
            loading && 'animate-spin'
        )}>
            {icon}
        </span>
    );

    return (
        <button
            className={cn(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                widthClasses,
                className
            )}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {iconPosition === 'left' && iconElement}
            {loading ? 'Ładowanie...' : children}
            {iconPosition === 'right' && iconElement}
        </button>
    );
};

// Specialized button variants for our application
export const ActionButton: React.FC<{
    children: React.ReactNode;
    action: 'add' | 'edit' | 'delete' | 'save' | 'cancel';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
}> = ({ children, action, size = 'md', className, onClick, disabled, loading }) => {
    const actionConfig = {
        add: { variant: 'success' as const, icon: '➕' },
        edit: { variant: 'primary' as const, icon: '✏️' },
        delete: { variant: 'danger' as const, icon: '🗑️' },
        save: { variant: 'success' as const, icon: '💾' },
        cancel: { variant: 'outline' as const, icon: '❌' }
    };

    const config = actionConfig[action];

    return (
        <ConstructorButton
            variant={config.variant}
            size={size}
            className={className}
            onClick={onClick}
            disabled={disabled}
            loading={loading}
            icon={config.icon}
        >
            {children}
        </ConstructorButton>
    );
};

export const IconButton: React.FC<{
    icon: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    title?: string;
}> = ({ icon, variant = 'ghost', size = 'md', className, onClick, disabled, title }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    return (
        <ConstructorButton
            variant={variant}
            size={size}
            className={cn(sizeClasses[size], 'p-0', className)}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {icon}
        </ConstructorButton>
    );
};

export const FloatingActionButton: React.FC<{
    icon: React.ReactNode;
    onClick?: () => void;
    className?: string;
    title?: string;
}> = ({ icon, onClick, className, title }) => {
    return (
        <button
            className={cn(
                'fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-700',
                className
            )}
            onClick={onClick}
            title={title}
        >
            <span className="flex items-center justify-center w-full h-full">
                {icon}
            </span>
        </button>
    );
};
