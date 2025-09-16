import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, ...props }: LabelProps): React.ReactElement {
  return (
    <label
      className={cn(
        "tw-text-sm tw-font-medium tw-leading-none tw-peer-disabled:tw-cursor-not-allowed tw-peer-disabled:tw-opacity-70",
        className
      )}
      {...props}
    />
  );
}
