import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  error?: boolean;
}

export function Label({
  className,
  required = false,
  error = false,
  children,
  ...props
}: LabelProps): React.ReactElement {
  return (
    <label
      className={cn(
        "block text-sm font-medium",
        error
          ? "text-red-700 dark:text-red-400"
          : "text-gray-700 dark:text-gray-300",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}
