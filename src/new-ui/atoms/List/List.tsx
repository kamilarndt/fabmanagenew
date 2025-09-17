import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  dataSource?: any[];
  renderItem?: (item: any, index: number) => React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  bordered?: boolean;
  size?: "sm" | "md" | "lg";
}

export function List({
  className,
  children,
  dataSource,
  renderItem,
  header,
  footer,
  bordered = false,
  size = "md",
  ...props
}: ListProps): React.ReactElement {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("w-full", sizeClasses[size], className)} {...props}>
      {header && (
        <div className="mb-4 border-b border-gray-200 pb-2 dark:border-gray-700">
          {header}
        </div>
      )}
      <div
        className={cn(
          "space-y-2",
          bordered && "divide-y divide-gray-200 dark:divide-gray-700"
        )}
      >
        {dataSource && renderItem
          ? dataSource.map((item, index) => (
              <div key={index} className="py-2">
                {renderItem(item, index)}
              </div>
            ))
          : children}
      </div>
      {footer && (
        <div className="mt-4 border-t border-gray-200 pt-2 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  actions?: React.ReactNode[];
  extra?: React.ReactNode;
}

export function ListItem({
  className,
  children,
  actions,
  extra,
  ...props
}: ListItemProps): React.ReactElement {
  return (
    <div
      className={cn("flex items-center justify-between py-2", className)}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {actions && (
        <div className="ml-4 flex space-x-2">
          {actions.map((action, index) => (
            <div key={index}>{action}</div>
          ))}
        </div>
      )}
      {extra && <div className="ml-4">{extra}</div>}
    </div>
  );
}
