import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface StatusBadgeOldProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  status?: "success" | "warning" | "error" | "info" | "default";
  size?: "sm" | "md" | "lg";
  color?: string;
  count?: number;
  showZero?: boolean;
  overflowCount?: number;
  dot?: boolean;
  offset?: [number, number];
  title?: string;
}

export function StatusBadgeOld({
  className,
  children,
  status = "default",
  size = "md",
  color,
  count,
  showZero = false,
  overflowCount = 99,
  dot = false,
  offset,
  title,
  ...props
}: StatusBadgeOldProps): React.ReactElement {
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

  const displayCount =
    count !== undefined
      ? count > overflowCount
        ? `${overflowCount}+`
        : count
      : undefined;
  const shouldShow = count !== undefined ? showZero || count > 0 : true;

  if (!shouldShow) {
    return <></>;
  }

  if (dot) {
    return (
      <span
        className={cn(
          "inline-block h-2 w-2 rounded-full",
          statusClasses[status],
          className
        )}
        style={color ? { backgroundColor: color } : undefined}
        title={title}
        {...props}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        statusClasses[status],
        sizeClasses[size],
        className
      )}
      style={color ? { backgroundColor: color } : undefined}
      title={title}
      {...props}
    >
      {displayCount !== undefined ? displayCount : children}
    </span>
  );
}
