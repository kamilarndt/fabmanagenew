import { Button } from "@/new-ui/atoms/Button/Button";
import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  badge?: string | number;
  children?: SidebarItem[];
  onClick?: () => void;
}

export interface SidebarProps {
  items: SidebarItem[];
  activeItem?: string;
  onItemClick?: (item: SidebarItem) => void;
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Sidebar({
  items,
  activeItem,
  onItemClick,
  className,
  collapsed = false,
  onToggleCollapse,
  header,
  footer,
}: SidebarProps): React.ReactElement {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set()
  );

  const handleItemClick = (item: SidebarItem) => {
    if (item.children && item.children.length > 0) {
      setExpandedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(item.id)) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
        return newSet;
      });
    }
    onItemClick?.(item);
    item.onClick?.();
  };

  const renderItem = (item: SidebarItem, level = 0) => {
    const isActive = activeItem === item.id;
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="tw-space-y-1">
        <button
          onClick={() => handleItemClick(item)}
          className={cn(
            "tw-flex tw-w-full tw-items-center tw-gap-2 tw-rounded-md tw-px-3 tw-py-2 tw-text-left tw-text-sm tw-transition-colors hover:tw-bg-accent hover:tw-text-accent-foreground",
            isActive && "tw-bg-accent tw-text-accent-foreground",
            level > 0 && "tw-pl-6"
          )}
        >
          {item.icon && <Icon name={item.icon} className="tw-h-4 tw-w-4" />}
          {!collapsed && (
            <>
              <span className="tw-flex-1">{item.label}</span>
              {item.badge && (
                <span className="tw-rounded-full tw-bg-primary tw-px-2 tw-py-0.5 tw-text-xs tw-text-primary-foreground">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <Icon
                  name={isExpanded ? "chevron-down" : "chevron-right"}
                  className="tw-h-4 tw-w-4"
                />
              )}
            </>
          )}
        </button>

        {hasChildren && isExpanded && !collapsed && (
          <div className="tw-space-y-1">
            {item.children!.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "tw-flex tw-h-full tw-flex-col tw-border-r tw-bg-background",
        collapsed ? "tw-w-16" : "tw-w-64",
        className
      )}
    >
      {/* Header */}
      {header && <div className="tw-border-b tw-p-4">{header}</div>}

      {/* Toggle Button */}
      {onToggleCollapse && (
        <div className="tw-border-b tw-p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="tw-w-full"
          >
            <Icon
              name={collapsed ? "chevron-right" : "chevron-left"}
              className="tw-h-4 tw-w-4"
            />
          </Button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="tw-flex-1 tw-space-y-1 tw-p-4">
        {items.map((item) => renderItem(item))}
      </nav>

      {/* Footer */}
      {footer && <div className="tw-border-t tw-p-4">{footer}</div>}
    </div>
  );
}
