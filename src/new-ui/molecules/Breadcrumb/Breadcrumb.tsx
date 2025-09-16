import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export function Breadcrumb({
  items,
  className,
  separator = (
    <Icon
      name="chevron-right"
      className="tw-h-4 tw-w-4 tw-text-muted-foreground"
    />
  ),
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
