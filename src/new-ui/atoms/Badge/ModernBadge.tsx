import React from "react";
import { cn } from "../../../lib/utils";

export interface ModernBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "default" | "lg";
  dot?: boolean;
}

const ModernBadge = React.forwardRef<HTMLDivElement, ModernBadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      dot = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-medium",
          {
            "bg-primary-100 text-primary-800": variant === "default",
            "status-success": variant === "success",
            "status-warning": variant === "warning",
            "status-error": variant === "error",
            "status-info": variant === "info",
            "border border-medium text-primary": variant === "outline",
          },
          {
            "px-2 py-0.5 text-xs": size === "sm",
            "px-2.5 py-1 text-sm": size === "default",
            "px-3 py-1.5 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {dot && (
          <div
            className={cn("h-1.5 w-1.5 rounded-full", {
              "bg-primary-600": variant === "default",
              "bg-success-600": variant === "success",
              "bg-warning-600": variant === "warning",
              "bg-error-600": variant === "error",
              "bg-info-600": variant === "info",
              "bg-outline-600": variant === "outline",
            })}
          />
        )}
        {children}
      </div>
    );
  }
);
ModernBadge.displayName = "ModernBadge";

export { ModernBadge };
