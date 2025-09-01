import React from 'react';
import { cn } from '../ui/utils';

interface ConstructorCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  selected?: boolean;
}

export const ConstructorCard: React.FC<ConstructorCardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  onClick,
  hover = true,
  selected = false,
}) => {
  const baseClasses = 'rounded-xl border transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white border-gray-200 shadow-sm',
    elevated: 'bg-white border-gray-200 shadow-lg',
    outlined: 'bg-transparent border-gray-300',
    ghost: 'bg-transparent border-transparent'
  };
  
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const hoverClasses = hover ? 'hover:shadow-md hover:border-gray-300' : '';
  const selectedClasses = selected ? 'ring-2 ring-blue-500 border-blue-500' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        hoverClasses,
        selectedClasses,
        clickableClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Specialized card variants for our use cases
export const ProjectTileCard: React.FC<{
  children: React.ReactNode;
  priority: string;
  status: string;
  onClick?: () => void;
  className?: string;
}> = ({ children, priority, status, onClick, className }) => {
  const priorityColors = {
    'Wysoki': 'border-l-red-500',
    'Średni': 'border-l-yellow-500',
    'Niski': 'border-l-green-500'
  };
  
  const statusColors = {
    'W KOLEJCE': 'bg-blue-50 border-blue-200',
    'W TRAKCIE CIĘCIA': 'bg-orange-50 border-orange-200',
    'WYCIĘTE': 'bg-green-50 border-green-200',
    'Zakończony': 'bg-green-50 border-green-200'
  };
  
  return (
    <ConstructorCard
      variant="elevated"
      size="md"
      onClick={onClick}
      hover={true}
      className={cn(
        'border-l-4',
        priorityColors[priority as keyof typeof priorityColors] || 'border-l-gray-500',
        statusColors[status as keyof typeof statusColors] || 'bg-gray-50 border-gray-200',
        className
      )}
    >
      {children}
    </ConstructorCard>
  );
};

export const DashboardCard: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, icon, children, className }) => {
  return (
    <ConstructorCard variant="elevated" size="lg" className={className}>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      {children}
    </ConstructorCard>
  );
};
