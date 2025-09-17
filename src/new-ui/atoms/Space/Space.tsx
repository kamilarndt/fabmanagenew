import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  wrap?: boolean;
}

export function Space({
  className,
  children,
  direction = "horizontal",
  size = "md",
  wrap = false,
  ...props
}: SpaceProps): React.ReactElement {
  const sizeClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  const directionClasses = {
    horizontal: "flex-row",
    vertical: "flex-col",
  };

  return (
    <div
      className={cn(
        "flex",
        directionClasses[direction],
        sizeClasses[size],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
