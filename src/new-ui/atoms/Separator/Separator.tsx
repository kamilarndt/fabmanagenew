import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  orientation = "horizontal",
  className,
  ...props
}: SeparatorProps): React.ReactElement {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "tw-bg-border",
        orientation === "horizontal"
          ? "tw-h-px tw-w-full"
          : "tw-h-full tw-w-px",
        className
      )}
      {...props}
    />
  );
}
