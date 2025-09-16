import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface SwitchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({
  checked,
  onCheckedChange,
  className,
  ...props
}: SwitchProps): React.ReactElement {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "tw-inline-flex tw-h-6 tw-w-10 tw-items-center tw-rounded-full tw-bg-input tw-transition-colors",
        checked && "tw-bg-primary",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "tw-inline-block tw-h-5 tw-w-5 tw-translate-x-0.5 tw-rounded-full tw-bg-background tw-transition-transform",
          checked && "tw-translate-x-4"
        )}
      />
    </button>
  );
}
