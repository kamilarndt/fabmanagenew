import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  status?: "success" | "warning" | "error" | "info" | "default";
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({
  className,
  children,
  status = "default",
  size = "md",
  ...props
}: StatusBadgeProps): React.ReactElement {
  const statusClasses = {
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        statusClasses[status],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
