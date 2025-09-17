import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function Progress({
  className,
  value = 0,
  max = 100,
  size = "md",
  ...props
}: ProgressProps): React.ReactElement {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-secondary",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 ease-in-out"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
