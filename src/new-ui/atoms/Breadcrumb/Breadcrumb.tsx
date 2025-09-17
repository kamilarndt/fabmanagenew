import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Breadcrumb({
  className,
  children,
  ...props
}: BreadcrumbProps): React.ReactElement {
  return (
    <nav className={cn("flex", className)} {...props}>
      <ol className="flex items-center space-x-1 md:space-x-3">{children}</ol>
    </nav>
  );
}

export interface BreadcrumbItemProps
  extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  href?: string;
}

export function BreadcrumbItem({
  className,
  children,
  href,
  ...props
}: BreadcrumbItemProps): React.ReactElement {
  return (
    <li className="inline-flex items-center" {...props}>
      {href ? (
        <a
          href={href}
          className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {children}
        </a>
      ) : (
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {children}
        </span>
      )}
    </li>
  );
}

export interface BreadcrumbSeparatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

export function BreadcrumbSeparator({
  className,
  children = "/",
  ...props
}: BreadcrumbSeparatorProps): React.ReactElement {
  return (
    <span
      className={cn("mx-1 text-gray-400 dark:text-gray-500", className)}
      {...props}
    >
      {children}
    </span>
  );
}
