import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  percent?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showInfo?: boolean;
  strokeColor?: string;
}

export function Progress({
  className,
  value = 0,
  percent,
  max = 100,
  size = "md",
  showInfo = true,
  strokeColor,
  ...props
}: ProgressProps): React.ReactElement {
  const progressValue = percent !== undefined ? percent : value;
  const percentage = Math.min(Math.max((progressValue / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-secondary",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <div
          className="h-full w-full flex-1 transition-all duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${100 - percentage}%)`,
            backgroundColor: strokeColor || undefined,
            background: strokeColor ? undefined : "linear-gradient(to right, #6366f1, #8b5cf6)"
          }}
        />
      </div>
      {showInfo && (
        <div className="mt-1 text-right text-sm text-gray-600">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}
