import { Button } from "@/new-ui/atoms/Button/Button";
import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";
import { Link, useLocation } from "react-router-dom";

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
  const location = useLocation();
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
    const isActive =
      activeItem === item.id || (item.href && location.pathname === item.href);
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    const itemContent = (
      <>
        {item.icon && <Icon name={item.icon} className="h-4 w-4" />}
        {!collapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span
                className="rounded-full px-2 py-0.5 text-xs"
                style={{
                  backgroundColor: "var(--color-sidebar-primary)",
                  color: "var(--color-sidebar-primary-foreground)",
                }}
              >
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <Icon
                name={isExpanded ? "chevron-down" : "chevron-right"}
                className="h-4 w-4"
              />
            )}
          </>
        )}
      </>
    );

    return (
      <div key={item.id} className="space-y-1">
        {item.href ? (
          <Link
            to={item.href}
            onClick={() => handleItemClick(item)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-all duration-200 hover-lift",
              level > 0 && "pl-8",
              isActive
                ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            )}
          >
            {itemContent}
          </Link>
        ) : (
          <button
            onClick={() => handleItemClick(item)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-all duration-200 hover-lift",
              level > 0 && "pl-8",
              isActive
                ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            )}
          >
            {itemContent}
          </button>
        )}

        {hasChildren && isExpanded && !collapsed && (
          <div className="space-y-1">
            {item.children!.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col",
        collapsed ? "w-16" : "w-64",
        className
      )}
      data-testid="sidebar"
    >
      {/* Header */}
      {header && <div className="p-6 border-b border-white/10">{header}</div>}

      {/* Toggle Button */}
      {onToggleCollapse && (
        <div className="p-4 border-b border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-full glass-button hover-lift"
          >
            <Icon
              name={collapsed ? "chevron-right" : "chevron-left"}
              className="h-4 w-4"
            />
          </Button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2 p-4">
        {items.map((item) => renderItem(item))}
      </nav>

      {/* Footer */}
      {footer && <div className="p-4 border-t border-white/10">{footer}</div>}
    </div>
  );
}
