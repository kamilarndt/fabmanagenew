import { Header } from "@/new-ui/organisms/Header/Header";
import { Sidebar, type SidebarItem } from "@/new-ui/organisms/Sidebar/Sidebar";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface AppShellProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  activeSidebarItem?: string;
  onSidebarItemClick?: (item: SidebarItem) => void;
  headerTitle?: string;
  headerActions?: React.ReactNode;
  headerBreadcrumbs?: Array<{ label: string; href?: string }>;
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
  className?: string;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export function AppShell({
  children,
  sidebarItems,
  activeSidebarItem,
  onSidebarItemClick,
  headerTitle,
  headerActions,
  headerBreadcrumbs,
  user,
  onUserMenuClick,
  notifications,
  className,
  sidebarCollapsed = false,
  onSidebarToggle,
}: AppShellProps): React.ReactElement {
  return (
    <div className={cn("tw-flex tw-h-screen tw-bg-background", className)}>
      {/* Sidebar */}
      <Sidebar
        items={sidebarItems}
        activeItem={activeSidebarItem}
        onItemClick={onSidebarItemClick}
        collapsed={sidebarCollapsed}
        onToggleCollapse={onSidebarToggle}
        header={
          <div className="tw-flex tw-items-center tw-gap-2">
            <div className="tw-h-8 tw-w-8 tw-rounded tw-bg-primary tw-flex tw-items-center tw-justify-center">
              <span className="tw-text-primary-foreground tw-font-bold tw-text-sm">
                F
              </span>
            </div>
            {!sidebarCollapsed && (
              <span className="tw-font-semibold">FabManage</span>
            )}
          </div>
        }
      />

      {/* Main Content */}
      <div className="tw-flex tw-flex-1 tw-flex-col tw-overflow-hidden">
        {/* Header */}
        <Header
          title={headerTitle}
          breadcrumbs={headerBreadcrumbs}
          actions={headerActions}
          onMenuToggle={onSidebarToggle}
          showMenuToggle={true}
          user={user}
          onUserMenuClick={onUserMenuClick}
          notifications={notifications}
        />

        {/* Page Content */}
        <main className="tw-flex-1 tw-overflow-auto tw-p-6">{children}</main>
      </div>
    </div>
  );
}
