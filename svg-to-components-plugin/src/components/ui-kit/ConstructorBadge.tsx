import React from 'react';
import { cn } from '../../lib/utils';

interface ConstructorBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export const ConstructorBadge: React.FC<ConstructorBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  icon,
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border border-gray-200',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    outline: 'bg-transparent text-gray-600 border border-gray-300'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };
  
  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

// Specialized badge variants for our application
export const StatusBadge: React.FC<{
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ status, size = 'md', className }) => {
  const statusConfig = {
    'W KOLEJCE': { variant: 'info' as const, text: 'W kolejce CNC' },
    'W TRAKCIE CIĘCIA': { variant: 'warning' as const, text: 'W produkcji CNC' },
    'WYCIĘTE': { variant: 'success' as const, text: 'Gotowy do montażu' },
    'Zakończony': { variant: 'success' as const, text: 'Zakończony' },
    'Planowanie': { variant: 'default' as const, text: 'Planowanie' },
    'W trakcie': { variant: 'warning' as const, text: 'W trakcie' },
    'Konserwacja': { variant: 'error' as const, text: 'Konserwacja' },
    'Oczekiwanie': { variant: 'outline' as const, text: 'Oczekiwanie' }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || { 
    variant: 'default' as const, 
    text: status 
  };
  
  return (
    <ConstructorBadge
      variant={config.variant}
      size={size}
      className={cn('font-medium', className)}
    >
      {config.text}
    </ConstructorBadge>
  );
};

export const PriorityBadge: React.FC<{
  priority: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ priority, size = 'md', className }) => {
  const priorityConfig = {
    'Wysoki': { variant: 'error' as const, text: 'Wysoki' },
    'Średni': { variant: 'warning' as const, text: 'Średni' },
    'Niski': { variant: 'success' as const, text: 'Niski' }
  };
  
  const config = priorityConfig[priority as keyof typeof priorityConfig] || { 
    variant: 'default' as const, 
    text: priority 
  };
  
  return (
    <ConstructorBadge
      variant={config.variant}
      size={size}
      className={cn('font-medium', className)}
    >
      {config.text}
    </ConstructorBadge>
  );
};

export const ZoneBadge: React.FC<{
  zone: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ zone, size = 'sm', className }) => {
  return (
    <ConstructorBadge
      variant="outline"
      size={size}
      className={cn('bg-purple-50 text-purple-700 border-purple-200', className)}
    >
      {zone}
    </ConstructorBadge>
  );
};
