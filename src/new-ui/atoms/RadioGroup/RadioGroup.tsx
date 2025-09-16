import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  options: Array<{ label: string; value: string; disabled?: boolean }>;
}

export function RadioGroup({
  value,
  onValueChange,
  options,
  className,
  ...props
}: RadioGroupProps): React.ReactElement {
  return (
    <div
      role="radiogroup"
      className={cn("tw-flex tw-gap-3", className)}
      {...props}
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className="tw-inline-flex tw-items-center tw-gap-2 tw-text-sm"
        >
          <input
            type="radio"
            className="tw-h-4 tw-w-4 tw-rounded-full tw-border tw-border-input tw-bg-background"
            checked={value === opt.value}
            onChange={() => onValueChange?.(opt.value)}
            disabled={opt.disabled}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
