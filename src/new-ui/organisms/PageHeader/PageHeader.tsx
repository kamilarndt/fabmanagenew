import { Separator } from "@/new-ui/atoms/Separator/Separator";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps): React.ReactElement {
  return (
    <div className={cn("tw-space-y-4", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="tw-flex tw-items-center tw-space-x-1 tw-text-sm tw-text-muted-foreground">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {item.href ? (
                <a
                  href={item.href}
                  className="tw-hover:tw-text-foreground tw-transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="tw-text-foreground">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="tw-flex tw-items-start tw-justify-between">
        <div className="tw-space-y-1">
          <h1 className="tw-text-3xl tw-font-bold tw-tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="tw-text-muted-foreground">{description}</p>
          )}
        </div>

        {actions && (
          <div className="tw-flex tw-items-center tw-space-x-2">{actions}</div>
        )}
      </div>

      <Separator />
    </div>
  );
}
