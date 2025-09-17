import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
}

export function FormField({
  className,
  label,
  required = false,
  error,
  description,
  children,
  ...props
}: FormFieldProps): React.ReactElement {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      {children}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
