import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface DescriptionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  bordered?: boolean;
  column?: number;
}

export function Descriptions({
  className,
  children,
  title,
  bordered = false,
  column = 3,
  ...props
}: DescriptionsProps): React.ReactElement {
  return (
    <div className={cn("w-full", className)} {...props}>
      {title && <div className="mb-4 text-lg font-medium">{title}</div>}
      <div
        className={cn(
          "grid gap-4",
          bordered && "divide-y divide-border",
          `grid-cols-${column}`
        )}
        style={{ gridTemplateColumns: `repeat(${column}, 1fr)` }}
      >
        {children}
      </div>
    </div>
  );
}

export interface DescriptionsItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  label: string;
  span?: number;
}

export function DescriptionsItem({
  className,
  children,
  label,
  span = 1,
  ...props
}: DescriptionsItemProps): React.ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1",
        span > 1 && `col-span-${span}`,
        className
      )}
      style={{ gridColumn: `span ${span}` }}
      {...props}
    >
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}
