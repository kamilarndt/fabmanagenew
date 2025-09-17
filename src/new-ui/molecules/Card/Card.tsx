import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode[];
  size?: "small" | "default";
}

export function Card({
  className,
  actions,
  size = "default",
  children,
  ...props
}: CardProps): React.ReactElement {
  const sizeClasses = {
    small: "p-3",
    default: "p-4",
  };

  return (
    <div
      className={cn(
        "rounded-lg border bg-white text-gray-900 shadow-sm",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
      {actions && actions.length > 0 && (
        <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-200">
          {actions}
        </div>
      )}
    </div>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({
  className,
  ...props
}: CardHeaderProps): React.ReactElement {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({
  className,
  ...props
}: CardTitleProps): React.ReactElement {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({
  className,
  ...props
}: CardDescriptionProps): React.ReactElement {
  return <p className={cn("text-sm text-gray-500", className)} {...props} />;
}

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({
  className,
  ...props
}: CardContentProps): React.ReactElement {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({
  className,
  ...props
}: CardFooterProps): React.ReactElement {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
  );
}
