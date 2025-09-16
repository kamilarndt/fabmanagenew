import { cn } from "@/new-ui/utils/cn";
import { cva, type VariantProps } from "@/new-ui/utils/variants";
import * as React from "react";

const badgeVariants = cva(
  "tw-inline-flex tw-items-center tw-rounded-md tw-border tw-px-2.5 tw-py-0.5 tw-text-xs tw-font-semibold",
  {
    variants: {
      variant: {
        default: "tw-bg-secondary tw-text-secondary-foreground",
        destructive:
          "tw-border-transparent tw-bg-destructive tw-text-destructive-foreground",
        outline: "tw-text-foreground",
        success: "tw-bg-success tw-text-success-foreground",
        warning: "tw-bg-warning tw-text-warning-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  variant,
  ...props
}: BadgeProps): React.ReactElement {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
