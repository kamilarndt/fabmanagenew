import { Label } from "@/new-ui/atoms/Label/Label";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  required,
  children,
  className,
  ...props
}: FormFieldProps): React.ReactElement {
  const childId = React.useId();
  const errorId = React.useId();

  return (
    <div className={cn("tw-space-y-2", className)} {...props}>
      {label && (
        <Label
          htmlFor={childId}
          className={
            required
              ? "tw-after:tw-content-['*'] tw-after:tw-text-destructive tw-after:tw-ml-1"
              : ""
          }
        >
          {label}
        </Label>
      )}
      {React.cloneElement(
        children as React.ReactElement,
        {
          id: childId,
          "aria-invalid": !!error,
          "aria-describedby": error ? errorId : undefined,
        } as any
      )}
      {error && (
        <p id={errorId} className="tw-text-sm tw-text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
