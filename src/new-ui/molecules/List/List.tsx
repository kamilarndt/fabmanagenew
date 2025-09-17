import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface ListItem {
  key?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  avatar?: React.ReactNode;
  actions?: React.ReactNode[];
  extra?: React.ReactNode;
  children?: React.ReactNode;
}

export interface ListProps {
  dataSource?: ListItem[];
  renderItem?: (item: ListItem, index: number) => React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "default" | "large" | "small";
  split?: boolean;
  loading?: boolean;
  className?: string;
  itemLayout?: "horizontal" | "vertical";
  pagination?: React.ReactNode;
}

export function List({
  dataSource = [],
  renderItem,
  header,
  footer,
  size = "default",
  split = true,
  loading = false,
  className,
  itemLayout = "horizontal",
  pagination,
}: ListProps): React.ReactElement {
  const getSizeClasses = () => {
    switch (size) {
      case "large":
        return "p-6";
      case "small":
        return "p-3";
      default:
        return "p-4";
    }
  };

  const renderListItem = (item: ListItem, index: number) => {
    if (renderItem) {
      return renderItem(item, index);
    }

    return (
      <ListItemComponent
        key={item.key || index}
        title={item.title}
        description={item.description}
        avatar={item.avatar}
        actions={item.actions}
        extra={item.extra}
        itemLayout={itemLayout}
        size={size}
      >
        {item.children}
      </ListItemComponent>
    );
  };

  if (loading) {
    return (
      <div className={cn("list-container", className)}>
        {header && (
          <div
            className="p-4 border-b"
            style={{
              backgroundColor: "var(--color-card-background)",
              borderColor: "var(--color-border-primary)",
            }}
          >
            {header}
          </div>
        )}
        <div className="space-y-4 p-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
        {footer && (
          <div
            className="p-4 border-t"
            style={{
              backgroundColor: "var(--color-card-background)",
              borderColor: "var(--color-border-primary)",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("list-container", className)}>
      {header && (
        <div
          className="p-4 border-b"
          style={{
            backgroundColor: "var(--color-card-background)",
            borderColor: "var(--color-border-primary)",
          }}
        >
          {header}
        </div>
      )}
      
      <div
        className="divide-y"
        style={{
          backgroundColor: "var(--color-card-background)",
          borderColor: split ? "var(--color-border-primary)" : "transparent",
        }}
      >
        {dataSource.map((item, index) => renderListItem(item, index))}
      </div>

      {footer && (
        <div
          className="p-4 border-t"
          style={{
            backgroundColor: "var(--color-card-background)",
            borderColor: "var(--color-border-primary)",
          }}
        >
          {footer}
        </div>
      )}

      {pagination && (
        <div className="p-4 border-t" style={{ borderColor: "var(--color-border-primary)" }}>
          {pagination}
        </div>
      )}
    </div>
  );
}

// Individual List Item Component
export interface ListItemProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  avatar?: React.ReactNode;
  actions?: React.ReactNode[];
  extra?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  size?: "default" | "large" | "small";
  itemLayout?: "horizontal" | "vertical";
}

export function ListItemComponent({
  title,
  description,
  avatar,
  actions,
  extra,
  children,
  className,
  size = "default",
  itemLayout = "horizontal",
}: ListItemProps): React.ReactElement {
  const getSizeClasses = () => {
    switch (size) {
      case "large":
        return "p-6";
      case "small":
        return "p-3";
      default:
        return "p-4";
    }
  };

  if (itemLayout === "vertical") {
    return (
      <div
        className={cn(
          "list-item-vertical",
          getSizeClasses(),
          className
        )}
        style={{
          backgroundColor: "var(--color-card-background)",
          color: "var(--color-foreground-primary)",
        }}
      >
        {title && (
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-medium">{title}</div>
            {extra && <div>{extra}</div>}
          </div>
        )}
        {description && (
          <div
            className="text-sm mb-3"
            style={{ color: "var(--color-foreground-secondary)" }}
          >
            {description}
          </div>
        )}
        {avatar && (
          <div className="mb-3">
            {typeof avatar === "string" ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {avatar}
              </div>
            )}
          </div>
        )}
        {children && <div className="mb-3">{children}</div>}
        {actions && actions.length > 0 && (
          <div className="flex items-center space-x-4">
            {actions.map((action, index) => (
              <span key={index} className="text-sm">{action}</span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Horizontal layout
  return (
    <div
      className={cn(
        "list-item-horizontal flex items-center",
        getSizeClasses(),
        className
      )}
      style={{
        backgroundColor: "var(--color-card-background)",
        color: "var(--color-foreground-primary)",
      }}
    >
      {/* Avatar */}
      {avatar && (
        <div className="flex-shrink-0 mr-4">
          {typeof avatar === "string" ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {avatar}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-medium truncate">{title}</div>
            {extra && <div className="flex-shrink-0 ml-2">{extra}</div>}
          </div>
        )}
        {description && (
          <div
            className="text-xs truncate"
            style={{ color: "var(--color-foreground-secondary)" }}
          >
            {description}
          </div>
        )}
        {children && <div className="mt-2">{children}</div>}
      </div>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
          {actions.map((action, index) => (
            <span key={index} className="text-sm">{action}</span>
          ))}
        </div>
      )}
    </div>
  );
}