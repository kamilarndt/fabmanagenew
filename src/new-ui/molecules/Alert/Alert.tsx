import { cn } from "@/new-ui/utils/cn";
import { cva, type VariantProps } from "@/new-ui/utils/variants";
import * as React from "react";

const alertVariants = cva(
  "tw-relative tw-w-full tw-rounded-lg tw-border tw-p-4 [&>svg~*]:tw-pl-7 [&>svg+div]:tw-translate-y-[-3px] [&>svg]:tw-absolute [&>svg]:tw-left-4 [&>svg]:tw-top-4 [&>svg]:tw-text-foreground",
  {
    variants: {
      variant: {
        default: "tw-bg-background tw-text-foreground",
        destructive:
          "tw-border-destructive/50 tw-text-destructive dark:tw-border-destructive [&>svg]:tw-text-destructive",
        success: "tw-border-success/50 tw-text-success [&>svg]:tw-text-success",
        warning: "tw-border-warning/50 tw-text-warning [&>svg]:tw-text-warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({
  className,
  variant,
  ...props
}: AlertProps): React.ReactElement {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

export interface AlertTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export function AlertTitle({
  className,
  ...props
}: AlertTitleProps): React.ReactElement {
  return (
    <h5
      className={cn(
        "tw-mb-1 tw-font-medium tw-leading-none tw-tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function AlertDescription({
  className,
  ...props
}: AlertDescriptionProps): React.ReactElement {
  return (
    <div
      className={cn("tw-text-sm [&_p]:tw-leading-relaxed", className)}
      {...props}
    />
  );
}
