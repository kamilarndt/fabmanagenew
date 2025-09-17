import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({
  className,
  size = "md",
  text,
  ...props
}: LoadingSpinnerProps): React.ReactElement {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

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
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
}
