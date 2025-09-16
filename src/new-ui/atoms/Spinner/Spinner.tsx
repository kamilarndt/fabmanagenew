import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
}

export function Spinner({
  size = 16,
  className,
  ...props
}: SpinnerProps): React.ReactElement {
  const style = { width: size, height: size } as const;
  return (
    <span
      aria-hidden
      className={cn(
        "tw-inline-block tw-animate-spin tw-rounded-full tw-border-2 tw-border-current tw-border-r-transparent",
        className
      )}
      style={style}
      {...props}
    />
  );
}
