import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { cn } from "@/new-ui/utils/cn";
import { cva, type VariantProps } from "@/new-ui/utils/variants";
import * as React from "react";

const alertVariants = cva(
  "tw-relative tw-w-full tw-rounded-lg tw-border tw-p-4 [&>svg~*]:tw-pl-7 [&>svg+div]:tw-translate-y-[-3px] [&>svg]:tw-absolute [&>svg]:tw-left-4 [&:svg]:tw-top-4 [&>svg]:tw-text-foreground tw-transition-all tw-duration-200",
  {
    variants: {
      variant: {
        default:
          "tw-bg-background tw-text-foreground tw-border-border hover:tw-shadow-sm",
        destructive:
          "tw-border-destructive/50 tw-text-destructive dark:tw-border-destructive [&>svg]:tw-text-destructive hover:tw-bg-destructive/5",
        success:
          "tw-border-success/50 tw-text-success [&>svg]:tw-text-success hover:tw-bg-success/5",
        warning:
          "tw-border-warning/50 tw-text-warning [&>svg]:tw-text-warning hover:tw-bg-warning/5",
        info: "tw-border-blue-500/50 tw-text-blue-600 [&>svg]:tw-text-blue-600 hover:tw-bg-blue-50 dark:tw-text-blue-400 dark:hover:tw-bg-blue-950/20",
      },
      size: {
        sm: "tw-p-3 tw-text-sm",
        default: "tw-p-4 tw-text-sm",
        lg: "tw-p-6 tw-text-base",
      },
      interactive: {
        true: "tw-cursor-pointer hover:tw-shadow-md tw-transform hover:tw-scale-[1.02]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  loading?: boolean;
}

export function Alert({
  className,
  variant,
  size,
  interactive,
  icon,
  dismissible,
  onDismiss,
  loading,
  children,
  ...props
}: AlertProps): React.ReactElement {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getIcon = () => {
    if (loading) return "loader-2";
    if (icon) return icon;

    switch (variant) {
      case "destructive":
        return "alert-circle";
      case "success":
        return "check-circle";
      case "warning":
        return "alert-triangle";
      case "info":
        return "info";
      default:
        return "info";
    }
  };

  if (!isVisible) return <></>;

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant, size, interactive }), className)}
      {...props}
    >
      {icon && (
        <Icon
          name={getIcon()}
          className={cn(
            "tw-h-4 tw-w-4 tw-shrink-0",
            loading && "tw-animate-spin"
          )}
        />
      )}

      <div className="tw-flex tw-items-start tw-justify-between tw-gap-2">
        <div className="tw-flex-1">{children}</div>

        {dismissible && (
          <button
            onClick={handleDismiss}
            className="tw-shrink-0 tw-rounded-sm tw-opacity-70 tw-ring-offset-background tw-transition-opacity hover:tw-opacity-100 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-ring focus:tw-ring-offset-2"
            aria-label="Dismiss alert"
          >
            <Icon name="x" className="tw-h-4 tw-w-4" />
          </button>
        )}
      </div>
    </div>
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

// Enhanced Alert with Actions
export interface AlertWithActionsProps extends AlertProps {
  actions?: React.ReactNode;
}

export function AlertWithActions({
  actions,
  children,
  ...alertProps
}: AlertWithActionsProps): React.ReactElement {
  return (
    <Alert {...alertProps}>
      {children}
      {actions && <div className="tw-mt-3 tw-flex tw-gap-2">{actions}</div>}
    </Alert>
  );
}
