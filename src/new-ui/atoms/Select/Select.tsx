import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  error?: boolean;
}

export function Select({
  className,
  error,
  children,
  ...props
}: SelectProps): React.ReactElement {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
