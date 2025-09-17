import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface AppDividerOldProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  type?: "horizontal" | "vertical";
  color?: string;
  variant?: "solid" | "dashed" | "dotted";
  spacing?: "sm" | "md" | "lg";
}

export function AppDividerOld({
  className,
  children,
  type = "horizontal",
  color,
  variant = "solid",
  spacing = "md",
  ...props
}: AppDividerOldProps): React.ReactElement {
  const spacingClasses = {
    sm: "my-2",
    md: "my-4",
    lg: "my-6",
  };

  const variantClasses = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
  };

  if (type === "vertical") {
    return (
      <div
        className={cn(
          "h-full w-px border-l border-gray-300 dark:border-gray-600",
          variantClasses[variant],
          className
        )}
        style={color ? { borderColor: color } : undefined}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center",
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex-1 border-t border-gray-300 dark:border-gray-600",
          variantClasses[variant]
        )}
        style={color ? { borderColor: color } : undefined}
      />
      {children && (
        <div className="px-4 text-sm text-gray-500 dark:text-gray-400">
          {children}
        </div>
      )}
      <div
        className={cn(
          "flex-1 border-t border-gray-300 dark:border-gray-600",
          variantClasses[variant]
        )}
        style={color ? { borderColor: color } : undefined}
      />
    </div>
  );
}
