import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface SegmentedProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: Array<{ label: string; value: string }>;
  value?: string;
  onChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
}

export function Segmented({
  className,
  options,
  value,
  onChange,
  size = "md",
  ...props
}: SegmentedProps): React.ReactElement {
  const sizeClasses = {
    sm: "h-8 text-xs",
    md: "h-10 text-sm",
    lg: "h-12 text-base",
  };

  return (
    <div
      className={cn(
        "inline-flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            "flex-1 rounded-md px-3 py-1 font-medium transition-colors",
            value === option.value
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          )}
          onClick={() => onChange?.(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
