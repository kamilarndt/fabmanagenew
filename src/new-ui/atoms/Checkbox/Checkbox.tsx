import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Checkbox({
  className,
  ...props
}: CheckboxProps): React.ReactElement {
  return (
    <input
      type="checkbox"
      className={cn(
        "tw-h-4 tw-w-4 tw-rounded tw-border tw-border-input tw-bg-background focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring",
        className
      )}
      {...props}
    />
  );
}
