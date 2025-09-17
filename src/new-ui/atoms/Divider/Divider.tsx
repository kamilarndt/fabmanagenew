import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  children?: React.ReactNode;
}

export function Divider({
  className,
  orientation = "horizontal",
  children,
  ...props
}: DividerProps): React.ReactElement {
  if (orientation === "vertical") {
    return (
      <div className={cn("h-full w-px bg-border", className)} {...props} />
    );
  }

  return (
    <div className={cn("relative", className)} {...props}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      {children && (
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {children}
          </span>
        </div>
      )}
    </div>
  );
}
