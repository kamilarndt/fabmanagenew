import { Button } from "@/new-ui/atoms/Button/Button";
import { Icon } from "@/new-ui/atoms/Icon/Icon";
import {
  Breadcrumb,
  type BreadcrumbItem,
} from "@/new-ui/molecules/Breadcrumb/Breadcrumb";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface HeaderProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
  onMenuToggle?: () => void;
  showMenuToggle?: boolean;
  user?: {
    name: string;
    avatar?: string;
    email?: string;
  };
  onUserMenuClick?: () => void;
  notifications?: {
    count: number;
    onClick?: () => void;
  };
}

export function Header({
  title,
  breadcrumbs,
  actions,
  className,
  onMenuToggle,
  showMenuToggle = false,
  user,
  onUserMenuClick,
  notifications,
}: HeaderProps): React.ReactElement {
  return (
    <header className={cn("tw-border-b tw-bg-background", className)}>
      <div className="tw-flex tw-h-16 tw-items-center tw-justify-between tw-px-4">
        {/* Left Section */}
        <div className="tw-flex tw-items-center tw-gap-4">
          {showMenuToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="tw-h-9 tw-w-9"
            >
              <Icon name="menu" className="tw-h-4 tw-w-4" />
            </Button>
          )}

          {title && (
            <div className="tw-flex tw-items-center tw-gap-2">
              <h1 className="tw-text-lg tw-font-semibold tw-tracking-tight">
                {title}
              </h1>
            </div>
          )}
        </div>

        {/* Center Section - Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="tw-flex-1 tw-px-4">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}

        {/* Right Section */}
        <div className="tw-flex tw-items-center tw-gap-2">
          {actions && (
            <div className="tw-flex tw-items-center tw-gap-2">{actions}</div>
          )}

          {notifications && (
            <Button
              variant="ghost"
              size="sm"
              onClick={notifications.onClick}
              className="tw-relative tw-h-9 tw-w-9"
            >
              <Icon name="bell" className="tw-h-4 tw-w-4" />
              {notifications.count > 0 && (
                <span className="tw-absolute tw--top-1 tw--right-1 tw-flex tw-h-5 tw-w-5 tw-items-center tw-justify-center tw-rounded-full tw-bg-destructive tw-text-xs tw-text-destructive-foreground">
                  {notifications.count > 9 ? "9+" : notifications.count}
                </span>
              )}
            </Button>
          )}

          {user && (
            <Button
              variant="ghost"
              onClick={onUserMenuClick}
              className="tw-flex tw-h-9 tw-items-center tw-gap-2 tw-px-2"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="tw-h-6 tw-w-6 tw-rounded-full"
                />
              ) : (
                <div className="tw-flex tw-h-6 tw-w-6 tw-items-center tw-justify-center tw-rounded-full tw-bg-primary tw-text-primary-foreground tw-text-xs tw-font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="tw-hidden tw-text-left tw-sm:block">
                <p className="tw-text-sm tw-font-medium">{user.name}</p>
                {user.email && (
                  <p className="tw-text-xs tw-text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
              <Icon name="chevron-down" className="tw-h-4 tw-w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
