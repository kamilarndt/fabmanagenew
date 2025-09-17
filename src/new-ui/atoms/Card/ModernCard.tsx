import { cn } from "@/new-ui/utils/cn";
import React from "react";

export interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "glass" | "outlined";
  padding?: "none" | "sm" | "default" | "lg";
  hover?: boolean;
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  (
    {
      className,
      variant = "default",
      padding = "default",
      hover = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "modern-card",
          {
            "bg-elevated": variant === "elevated",
            "bg-glass": variant === "glass",
            "border-strong": variant === "outlined",
          },
          {
            "hover:shadow-lg hover:-translate-y-1": hover,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ModernCard.displayName = "ModernCard";

export interface ModernCardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const ModernCardHeader = React.forwardRef<
  HTMLDivElement,
  ModernCardHeaderProps
>(({ className, title, description, action, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("modern-card-header", className)} {...props}>
      {(title || description || action) && (
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-semibold text-primary">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-secondary">{description}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
});
ModernCardHeader.displayName = "ModernCardHeader";

export interface ModernCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "default" | "lg";
}

const ModernCardContent = React.forwardRef<
  HTMLDivElement,
  ModernCardContentProps
>(({ className, padding = "default", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "modern-card-content",
        {
          "p-0": padding === "none",
          "p-4": padding === "sm",
          "p-6": padding === "default",
          "p-8": padding === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
ModernCardContent.displayName = "ModernCardContent";

export interface ModernCardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "center" | "end" | "between";
}

const ModernCardFooter = React.forwardRef<
  HTMLDivElement,
  ModernCardFooterProps
>(({ className, justify = "end", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "modern-card-footer",
        {
          "justify-start": justify === "start",
          "justify-center": justify === "center",
          "justify-end": justify === "end",
          "justify-between": justify === "between",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
ModernCardFooter.displayName = "ModernCardFooter";

export { ModernCard, ModernCardContent, ModernCardFooter, ModernCardHeader };
