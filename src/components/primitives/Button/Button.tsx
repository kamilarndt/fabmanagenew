import React from 'react';
import { cn } from '../../../lib/utils';
import { getColor, getBackground, getRadius, getSpacing, brandColors } from '../../../design-system/tokens';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'default' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      loading = false,
      leftIcon,
      rightIcon,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? 'span' : 'button';
    const isDisabled = disabled || loading;

    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: brandColors.primary,
            color: 'var(--color-white)',
            border: 'none',
          };
        case 'secondary':
          return {
            backgroundColor: getBackground('secondary'),
            color: getColor('default'),
            border: 'none',
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: getColor('default'),
            border: 'none',
          };
        case 'destructive':
          return {
            backgroundColor: 'var(--color-background-destructive)',
            color: 'var(--color-foreground-default)',
            border: 'none',
          };
        case 'outline':
          return {
            backgroundColor: 'transparent',
            color: getColor('default'),
            border: `1px solid var(--color-border-default)`,
          };
        default:
          return {};
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return {
            height: '2rem',
            padding: `0 ${getSpacing('sm')}`,
            fontSize: '0.875rem',
          };
        case 'lg':
          return {
            height: '3rem',
            padding: `0 ${getSpacing('lg')}`,
            fontSize: '1rem',
          };
        case 'xl':
          return {
            height: '3.5rem',
            padding: `0 ${getSpacing('xl')}`,
            fontSize: '1.125rem',
          };
        default:
          return {
            height: '2.5rem',
            padding: `0 ${getSpacing('md')}`,
            fontSize: '0.875rem',
          };
      }
    };

    return (
      <Comp
        className={cn(
          'btn',
          `btn-${variant}`,
          `btn-${size}`,
          {
            'btn-loading': loading,
            'btn-disabled': isDisabled,
          },
          className
        )}
        style={{
          ...getVariantStyles(),
          ...getSizeStyles(),
          borderRadius: getRadius('md'),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '500',
          transition: 'all 0.2s ease-in-out',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
          outline: 'none',
          textDecoration: 'none',
        }}
        ref={ref}
        disabled={isDisabled}
        onMouseEnter={(e) => {
          if (!isDisabled && variant === 'primary') {
            e.currentTarget.style.opacity = '0.9';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled && variant === 'primary') {
            e.currentTarget.style.opacity = '1';
          }
        }}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button };
