import { Avatar } from "@/new-ui/atoms/Avatar/Avatar";
import { Badge } from "@/new-ui/atoms/Badge/Badge";
import { Button } from "@/new-ui/atoms/Button/Button";
import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface NavigationItem {
  key: string;
  label: string;
  icon?: string;
  href?: string;
  badge?: string | number;
  children?: NavigationItem[];
  disabled?: boolean;
  external?: boolean;
}

export interface NavigationProps {
  items: NavigationItem[];
  activeKey?: string;
  onItemClick?: (key: string, item: NavigationItem) => void;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "default" | "lg";
  variant?: "default" | "pills" | "tabs" | "underline";
  className?: string;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  showCollapseButton?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  onUserMenuClick?: () => void;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Navigation({
  items,
  activeKey,
  onItemClick,
  orientation = "horizontal",
  size = "default",
  variant = "default",
  className,
  collapsed = false,
  onCollapse,
  showCollapseButton = false,
  user,
  onUserMenuClick,
  logo,
  actions,
}: NavigationProps): React.ReactElement {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set()
  );

  const sizeClasses = {
    sm: "tw-text-sm tw-px-3 tw-py-2",
    default: "tw-text-sm tw-px-4 tw-py-2",
    lg: "tw-text-base tw-px-6 tw-py-3",
  };

  const variantClasses = {
    default:
      "tw-text-muted-foreground hover:tw-text-foreground hover:tw-bg-muted/50",
    pills:
      "tw-rounded-md tw-text-muted-foreground hover:tw-text-foreground hover:tw-bg-muted/50",
    tabs: "tw-border-b-2 tw-border-transparent tw-text-muted-foreground hover:tw-text-foreground hover:tw-border-muted-foreground/50",
    underline:
      "tw-text-muted-foreground hover:tw-text-foreground tw-relative hover:tw-after:tw-content-[''] hover:tw-after:tw-absolute hover:tw-after:tw-bottom-0 hover:tw-after:tw-left-0 hover:tw-after:tw-right-0 hover:tw-after:tw-h-0.5 hover:tw-after:tw-bg-primary",
  };

  const activeClasses = {
    default: "tw-text-foreground tw-bg-muted/50",
    pills: "tw-text-foreground tw-bg-primary",
    tabs: "tw-text-foreground tw-border-primary",
    underline:
      "tw-text-foreground tw-after:tw-content-[''] tw-after:tw-absolute tw-after:tw-bottom-0 tw-after:tw-left-0 tw-after:tw-right-0 tw-after:tw-h-0.5 tw-after:tw-bg-primary",
  };

  const handleItemClick = (item: NavigationItem) => {
    if (item.disabled) return;

    if (item.children) {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(item.key)) {
        newExpanded.delete(item.key);
      } else {
        newExpanded.add(item.key);
      }
      setExpandedItems(newExpanded);
    }

    onItemClick?.(item.key, item);
  };

  const renderItem = (item: NavigationItem, level = 0) => {
    const isActive = activeKey === item.key;
    const isExpanded = expandedItems.has(item.key);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.key} className="tw-relative">
        <button
          className={cn(
            "tw-flex tw-items-center tw-gap-2 tw-transition-all tw-duration-200 tw-whitespace-nowrap",
            sizeClasses[size],
            variantClasses[variant],
            isActive && activeClasses[variant],
            item.disabled && "tw-opacity-50 tw-cursor-not-allowed",
            level > 0 && "tw-pl-8"
          )}
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
        >
          {item.icon && (
            <Icon
              name={item.icon}
              className={cn(
                "tw-shrink-0",
                size === "sm" ? "tw-h-4 tw-w-4" : "tw-h-5 tw-w-5"
              )}
            />
          )}

          {!collapsed && (
            <>
              <span className="tw-flex-1 tw-text-left">{item.label}</span>

              {item.badge && (
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className="tw-text-xs"
                >
                  {item.badge}
                </Badge>
              )}

              {hasChildren && (
                <Icon
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  className="tw-h-4 tw-w-4 tw-transition-transform tw-duration-200"
                />
              )}
            </>
          )}
        </button>

        {hasChildren && isExpanded && !collapsed && (
          <div className="tw-mt-1 tw-space-y-1">
            {item.children!.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      className={cn(
        "tw-flex tw-items-center tw-gap-1",
        orientation === "vertical" && "tw-flex-col tw-items-stretch tw-gap-0",
        className
      )}
    >
      {logo && (
        <div className="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2">
          {logo}
          {collapsed && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onCollapse?.(!collapsed)}
              className="tw-ml-auto"
            >
              <Icon name="chevron-right" className="tw-h-4 tw-w-4" />
            </Button>
          )}
        </div>
      )}

      <div
        className={cn(
          "tw-flex tw-items-center tw-gap-1",
          orientation === "vertical" &&
            "tw-flex-col tw-items-stretch tw-gap-0 tw-w-full"
        )}
      >
        {items.map((item) => renderItem(item))}
      </div>

      {actions && (
        <div className="tw-ml-auto tw-flex tw-items-center tw-gap-2">
          {actions}
        </div>
      )}

      {user && (
        <div className="tw-ml-auto tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2">
          {!collapsed && (
            <div className="tw-text-right">
              <div className="tw-text-sm tw-font-medium">{user.name}</div>
              {user.role && (
                <div className="tw-text-xs tw-text-muted-foreground">
                  {user.role}
                </div>
              )}
            </div>
          )}
          <button
            onClick={onUserMenuClick}
            className="tw-flex tw-items-center tw-gap-2 tw-rounded-full tw-p-1 hover:tw-bg-muted/50 tw-transition-colors"
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              size={collapsed ? "sm" : "default"}
            />
            {!collapsed && (
              <Icon name="chevron-down" className="tw-h-4 tw-w-4" />
            )}
          </button>
        </div>
      )}

      {showCollapseButton && orientation === "vertical" && (
        <div className="tw-border-t tw-pt-2 tw-mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCollapse?.(!collapsed)}
            className="tw-w-full tw-justify-start"
          >
            <Icon
              name={collapsed ? "chevron-right" : "chevron-left"}
              className="tw-h-4 tw-w-4"
            />
            {!collapsed && <span>Collapse</span>}
          </Button>
        </div>
      )}
    </nav>
  );
}

// Breadcrumb Navigation
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export function Breadcrumb({
  items,
  separator = (
    <Icon
      name="chevron-right"
      className="tw-h-4 tw-w-4 tw-text-muted-foreground"
    />
  ),
  className,
  onItemClick,
}: BreadcrumbProps): React.ReactElement {
  return (
    <nav
      className={cn(
        "tw-flex tw-items-center tw-space-x-1 tw-text-sm",
        className
      )}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="tw-mx-1">{separator}</span>}
          <div className="tw-flex tw-items-center tw-gap-1">
            {item.icon && <Icon name={item.icon} className="tw-h-4 tw-w-4" />}
            {item.href ? (
              <button
                onClick={() => onItemClick?.(item, index)}
                className="tw-text-muted-foreground hover:tw-text-foreground tw-transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className="tw-text-foreground tw-font-medium">
                {item.label}
              </span>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
}

// Tab Navigation
export interface TabItem {
  key: string;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeKey?: string;
  onTabClick?: (key: string, item: TabItem) => void;
  variant?: "default" | "pills" | "underline";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function Tabs({
  items,
  activeKey,
  onTabClick,
  variant = "default",
  size = "default",
  className,
}: TabsProps): React.ReactElement {
  const sizeClasses = {
    sm: "tw-text-sm tw-px-3 tw-py-2",
    default: "tw-text-sm tw-px-4 tw-py-2",
    lg: "tw-text-base tw-px-6 tw-py-3",
  };

  const variantClasses = {
    default:
      "tw-border-b-2 tw-border-transparent tw-text-muted-foreground hover:tw-text-foreground hover:tw-border-muted-foreground/50",
    pills:
      "tw-rounded-md tw-text-muted-foreground hover:tw-text-foreground hover:tw-bg-muted/50",
    underline:
      "tw-text-muted-foreground hover:tw-text-foreground tw-relative hover:tw-after:tw-content-[''] hover:tw-after:tw-absolute hover:tw-after:tw-bottom-0 hover:tw-after:tw-left-0 hover:tw-after:tw-right-0 hover:tw-after:tw-h-0.5 hover:tw-after:tw-bg-primary",
  };

  const activeClasses = {
    default: "tw-text-foreground tw-border-primary",
    pills: "tw-text-foreground tw-bg-primary",
    underline:
      "tw-text-foreground tw-after:tw-content-[''] tw-after:tw-absolute tw-after:tw-bottom-0 tw-after:tw-left-0 tw-after:tw-right-0 tw-after:tw-h-0.5 tw-after:tw-bg-primary",
  };

  return (
    <div className={cn("tw-flex tw-items-center tw-gap-1", className)}>
      {items.map((item) => (
        <button
          key={item.key}
          className={cn(
            "tw-flex tw-items-center tw-gap-2 tw-transition-all tw-duration-200 tw-whitespace-nowrap",
            sizeClasses[size],
            variantClasses[variant],
            activeKey === item.key && activeClasses[variant],
            item.disabled && "tw-opacity-50 tw-cursor-not-allowed"
          )}
          onClick={() => !item.disabled && onTabClick?.(item.key, item)}
          disabled={item.disabled}
        >
          {item.icon && (
            <Icon
              name={item.icon}
              className={cn(
                "tw-shrink-0",
                size === "sm" ? "tw-h-4 tw-w-4" : "tw-h-5 tw-w-5"
              )}
            />
          )}
          <span>{item.label}</span>
          {item.badge && (
            <Badge
              variant={activeKey === item.key ? "default" : "secondary"}
              className="tw-text-xs"
            >
              {item.badge}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
}
