import React from "react";
import { cn } from "@/new-ui/utils/cn";

interface PageLayoutProps {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  maxWidth?: number | string;
  className?: string;
  style?: React.CSSProperties;
  background?: "default" | "secondary" | "transparent";
}

export function PageLayout({
  children,
  padding = "md",
  maxWidth,
  className,
  style,
  background = "default",
}: PageLayoutProps) {
  const paddingClasses = {
    none: "tw-p-0",
    sm: "tw-p-3",
    md: "tw-p-6",
    lg: "tw-p-8",
  };

  const backgroundClasses = {
    default: "tw-bg-background",
    secondary: "tw-bg-muted",
    transparent: "tw-bg-transparent",
  };

  return (
    <div
      className={cn(
        "tw-min-h-screen tw-font-sans",
        paddingClasses[padding],
        backgroundClasses[background],
        className
      )}
      style={{
        ...(maxWidth && {
          maxWidth,
          margin: "0 auto",
          width: "100%",
        }),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebarCollapsed?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function MainLayout({
  children,
  sidebar,
  header,
  footer,
  sidebarCollapsed = false,
  className,
  style,
}: MainLayoutProps) {
  return (
    <div
      className={cn(
        "tw-flex tw-min-h-screen tw-font-sans",
        className
      )}
      style={style}
    >
      {sidebar}
      <div
        className={cn(
          "tw-flex tw-flex-1 tw-flex-col tw-transition-all",
          sidebar && !sidebarCollapsed ? "tw-ml-64" : sidebar ? "tw-ml-16" : "tw-ml-0"
        )}
      >
        {header}
        <main className="tw-flex-1">{children}</main>
        {footer}
      </div>
    </div>
  );
}

export default PageLayout;
