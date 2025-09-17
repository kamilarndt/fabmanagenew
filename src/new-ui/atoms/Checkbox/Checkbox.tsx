import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

export function Checkbox({
  className,
  label,
  description,
  error,
  ...props
}: CheckboxProps): React.ReactElement {
  const id = React.useId();
  const checkboxId = `checkbox-${id}`;

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-3">
        <input
          id={checkboxId}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {(label || description) && (
          <div className="space-y-1">
            {label && (
              <label
                htmlFor={checkboxId}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
