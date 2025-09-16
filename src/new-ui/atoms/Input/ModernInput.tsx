import React from "react";
import { cn } from "../../../lib/utils";

export interface ModernInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outlined";
  size?: "sm" | "default" | "lg";
}

const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  (
    {
      className,
      type = "text",
      label,
      description,
      error,
      leftIcon,
      rightIcon,
      variant = "default",
      size = "default",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-quaternary">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              "input",
              {
                "pl-10": leftIcon,
                "pr-10": rightIcon,
                "input-error": error,
                "bg-tertiary": variant === "filled",
                "border-strong": variant === "outlined",
              },
              {
                "px-3 py-2 text-sm": size === "sm",
                "px-4 py-3": size === "default",
                "px-4 py-4 text-lg": size === "lg",
              },
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-quaternary">
              {rightIcon}
            </div>
          )}
        </div>
        {description && !error && (
          <p className="text-sm text-tertiary">{description}</p>
        )}
        {error && <p className="text-sm text-error-600">{error}</p>}
      </div>
    );
  }
);
ModernInput.displayName = "ModernInput";

export { ModernInput };
