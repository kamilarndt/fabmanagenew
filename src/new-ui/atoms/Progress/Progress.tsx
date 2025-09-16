import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0..100
}

export function Progress({
  value = 0,
  className,
  ...props
}: ProgressProps): React.ReactElement {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "tw-h-2 tw-w-full tw-overflow-hidden tw-rounded-full tw-bg-muted",
        className
      )}
      {...props}
    >
      <div
        className="tw-h-full tw-bg-primary tw-transition-[width]"
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
