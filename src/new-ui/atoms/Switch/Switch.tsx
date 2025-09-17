import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({
  className,
  checked,
  onCheckedChange,
  ...props
}: SwitchProps): React.ReactElement {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />
      <div
        className={cn(
          "peer h-6 w-11 rounded-full bg-gray-200 transition-colors after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-indigo-800",
          className
        )}
      />
    </label>
  );
}
