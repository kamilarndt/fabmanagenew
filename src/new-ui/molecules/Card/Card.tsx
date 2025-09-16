import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps): React.ReactElement {
  return (
    <div
      className={cn(
        "tw-rounded-lg tw-border tw-bg-card tw-text-card-foreground tw-shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({
  className,
  ...props
}: CardHeaderProps): React.ReactElement {
  return (
    <div
      className={cn("tw-flex tw-flex-col tw-space-y-1.5 tw-p-6", className)}
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
        "tw-text-2xl tw-font-semibold tw-leading-none tw-tracking-tight",
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
  return (
    <p
      className={cn("tw-text-sm tw-text-muted-foreground", className)}
      {...props}
    />
  );
}

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({
  className,
  ...props
}: CardContentProps): React.ReactElement {
  return <div className={cn("tw-p-6 tw-pt-0", className)} {...props} />;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({
  className,
  ...props
}: CardFooterProps): React.ReactElement {
  return (
    <div
      className={cn("tw-flex tw-items-center tw-p-6 tw-pt-0", className)}
      {...props}
    />
  );
}
