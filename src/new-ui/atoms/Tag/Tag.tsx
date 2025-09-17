import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  color?: "default" | "primary" | "success" | "warning" | "error" | "info";
  closable?: boolean;
  onClose?: () => void;
}

export function Tag({
  className,
  children,
  color = "default",
  closable = false,
  onClose,
  ...props
}: TagProps): React.ReactElement {
  const colorClasses = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    primary:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
      {closable && (
        <button
          type="button"
          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10"
          onClick={onClose}
        >
          <span className="sr-only">Remove</span>
          <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
            <path d="m0 0 1 1 3-3 3 3 1-1-3-3 3-3-1-1-3 3-3-3z" />
          </svg>
        </button>
      )}
    </span>
  );
}
