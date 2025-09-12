import React from 'react';
import { cn } from '../../lib/utils';

// Container with consistent max-widths and padding
export const ConstructorContainer: React.FC<{
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}> = ({ children, size = 'lg', className, padding = 'md' }) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'px-4 py-4',
    md: 'px-6 py-6',
    lg: 'px-8 py-8'
  };
  
  return (
    <div className={cn(
      'mx-auto',
      sizeClasses[size],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};

// Section with consistent spacing
export const ConstructorSection: React.FC<{
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}> = ({ children, title, subtitle, className, spacing = 'md' }) => {
  const spacingClasses = {
    none: '',
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8'
  };
  
  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
};

// Grid layout with responsive breakpoints
export const ConstructorGrid: React.FC<{
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ children, cols = 3, gap = 'md', className }) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
  };
  
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };
  
  return (
    <div className={cn(
      'grid',
      colsClasses[cols],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

// Flexbox layout with consistent spacing
export const ConstructorFlex: React.FC<{
  children: React.ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: 'wrap' | 'wrap-reverse' | 'nowrap';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ 
  children, 
  direction = 'row', 
  justify = 'start', 
  align = 'start', 
  wrap = 'nowrap',
  gap = 'none',
  className 
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  };
  
  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };
  
  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  };
  
  const wrapClasses = {
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
    nowrap: 'flex-nowrap'
  };
  
  const gapClasses = {
    none: '',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };
  
  return (
    <div className={cn(
      'flex',
      directionClasses[direction],
      justifyClasses[justify],
      alignClasses[align],
      wrapClasses[wrap],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

// Stack layout for vertical spacing
export const ConstructorStack: React.FC<{
  children: React.ReactNode;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ children, spacing = 'md', className }) => {
  const spacingClasses = {
    none: '',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8'
  };
  
  return (
    <div className={cn(spacingClasses[spacing], className)}>
      {children}
    </div>
  );
};

// Divider with consistent styling
export const ConstructorDivider: React.FC<{
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}> = ({ className, orientation = 'horizontal', size = 'md' }) => {
  const orientationClasses = {
    horizontal: 'w-full border-t',
    vertical: 'h-full border-l'
  };
  
  const sizeClasses = {
    sm: 'border-gray-200',
    md: 'border-gray-300',
    lg: 'border-gray-400'
  };
  
  return (
    <div className={cn(
      orientationClasses[orientation],
      sizeClasses[size],
      className
    )} />
  );
};
