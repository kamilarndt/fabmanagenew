import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface SpinProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  spinning?: boolean;
  size?: "sm" | "md" | "lg";
  tip?: string;
}

export function Spin({
  className,
  children,
  spinning = true,
  size = "md",
  tip,
  ...props
}: SpinProps): React.ReactElement {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  if (!children) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center space-y-2",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600",
            sizeClasses[size]
          )}
        />
        {tip && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{tip}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} {...props}>
      {spinning && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
          <div
            className={cn(
              "animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600",
              sizeClasses[size]
            )}
          />
          {tip && (
            <p className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {tip}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
