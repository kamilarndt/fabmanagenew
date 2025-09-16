import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { cn } from "@/new-ui/utils/cn";
import { cva, type VariantProps } from "@/new-ui/utils/variants";
import * as React from "react";

const buttonVariants = cva(
  "tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-whitespace-nowrap tw-rounded-md tw-text-sm tw-font-medium tw-transition-all tw-duration-200 focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 tw-ring-offset-background disabled:tw-pointer-events-none disabled:tw-opacity-50",
  {
    variants: {
      variant: {
        default:
          "tw-bg-primary tw-text-primary-foreground hover:tw-bg-primary/90 active:tw-bg-primary/95 tw-shadow-sm hover:tw-shadow-md",
        destructive:
          "tw-bg-destructive tw-text-destructive-foreground hover:tw-bg-destructive/90 active:tw-bg-destructive/95 tw-shadow-sm hover:tw-shadow-md",
        outline:
          "tw-border tw-border-input tw-bg-background hover:tw-bg-accent hover:tw-text-accent-foreground active:tw-bg-accent/80",
        secondary:
          "tw-bg-secondary tw-text-secondary-foreground hover:tw-bg-secondary/80 active:tw-bg-secondary/90",
        ghost:
          "hover:tw-bg-accent hover:tw-text-accent-foreground active:tw-bg-accent/80",
        link: "tw-text-primary tw-underline-offset-4 hover:tw-underline active:tw-underline-offset-2",
        success:
          "tw-bg-success tw-text-white hover:tw-bg-success/90 active:tw-bg-success/95 tw-shadow-sm hover:tw-shadow-md",
        warning:
          "tw-bg-warning tw-text-white hover:tw-bg-warning/90 active:tw-bg-warning/95 tw-shadow-sm hover:tw-shadow-md",
        gradient:
          "tw-bg-gradient-to-r tw-from-primary tw-to-primary/80 tw-text-primary-foreground hover:tw-from-primary/90 hover:tw-to-primary/70 active:tw-from-primary/95 active:tw-to-primary/60 tw-shadow-lg hover:tw-shadow-xl",
      },
      size: {
        default: "tw-h-10 tw-px-4 tw-py-2",
        sm: "tw-h-9 tw-rounded-md tw-px-3 tw-text-xs",
        lg: "tw-h-11 tw-rounded-md tw-px-8 tw-text-base",
        icon: "tw-h-10 tw-w-10",
        "icon-sm": "tw-h-8 tw-w-8",
        "icon-lg": "tw-h-12 tw-w-12",
      },
      loading: {
        true: "tw-relative tw-overflow-hidden",
        false: "",
      },
      fullWidth: {
        true: "tw-w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
  leftIcon?: string;
  rightIcon?: string;
  tooltip?: string;
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  loading,
  loadingText,
  leftIcon,
  rightIcon,
  tooltip,
  asChild = false,
  children,
  disabled,
  ...props
}: ButtonProps): React.ReactElement {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const buttonContent = (
    <>
      {loading && (
        <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-inherit">
          <Icon
            name="loader-2"
            className="tw-h-4 tw-w-4 tw-animate-spin"
            aria-hidden="true"
          />
        </div>
      )}

      <div
        className={cn(
          "tw-flex tw-items-center tw-gap-2",
          loading && "tw-opacity-0"
        )}
      >
        {leftIcon && !loading && (
          <Icon name={leftIcon} className="tw-h-4 tw-w-4" aria-hidden="true" />
        )}

        {loading && loadingText ? loadingText : children}

        {rightIcon && !loading && (
          <Icon name={rightIcon} className="tw-h-4 tw-w-4" aria-hidden="true" />
        )}
      </div>
    </>
  );

  if (asChild) {
    return (
      <span
        className={cn(
          buttonVariants({ variant, size, loading }),
          isPressed && "tw-scale-95",
          className
        )}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        title={tooltip}
      >
        {buttonContent}
      </span>
    );
  }

  return (
    <button
      className={cn(
        buttonVariants({ variant, size, loading }),
        isPressed && "tw-scale-95",
        className
      )}
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      title={tooltip}
      {...props}
    >
      {buttonContent}
    </button>
  );
}

// Button Group Component
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "default" | "lg";
  variant?: ButtonProps["variant"];
  attached?: boolean;
}

export function ButtonGroup({
  className,
  orientation = "horizontal",
  size = "default",
  variant = "outline",
  attached = false,
  children,
  ...props
}: ButtonGroupProps): React.ReactElement {
  const childrenArray = React.Children.toArray(children);

  return (
    <div
      className={cn(
        "tw-inline-flex",
        orientation === "vertical" ? "tw-flex-col" : "tw-flex-row",
        attached && "tw-divide-x tw-divide-border",
        className
      )}
      role="group"
      {...props}
    >
      {React.Children.map(childrenArray, (child, index) => {
        if (React.isValidElement<ButtonProps>(child)) {
          const isFirst = index === 0;
          const isLast = index === childrenArray.length - 1;

          return React.cloneElement(child, {
            variant: child.props.variant || variant,
            size: child.props.size || size,
            className: cn(
              child.props.className,
              attached &&
                orientation === "horizontal" &&
                !isFirst &&
                "tw-rounded-none tw-border-l-0",
              attached &&
                orientation === "horizontal" &&
                isFirst &&
                "tw-rounded-r-none",
              attached &&
                orientation === "horizontal" &&
                isLast &&
                "tw-rounded-l-none",
              attached &&
                orientation === "vertical" &&
                !isFirst &&
                "tw-rounded-none tw-border-t-0",
              attached &&
                orientation === "vertical" &&
                isFirst &&
                "tw-rounded-b-none",
              attached &&
                orientation === "vertical" &&
                isLast &&
                "tw-rounded-t-none"
            ),
          });
        }
        return child;
      })}
    </div>
  );
}

// Floating Action Button
export interface FloatingActionButtonProps extends Omit<ButtonProps, "size"> {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: "sm" | "default" | "lg";
}

export function FloatingActionButton({
  className,
  position = "bottom-right",
  size = "default",
  ...props
}: FloatingActionButtonProps): React.ReactElement {
  const positionClasses = {
    "bottom-right": "tw-fixed tw-bottom-6 tw-right-6",
    "bottom-left": "tw-fixed tw-bottom-6 tw-left-6",
    "top-right": "tw-fixed tw-top-6 tw-right-6",
    "top-left": "tw-fixed tw-top-6 tw-left-6",
  };

  const sizeClasses = {
    sm: "tw-h-12 tw-w-12",
    default: "tw-h-14 tw-w-14",
    lg: "tw-h-16 tw-w-16",
  };

  return (
    <Button
      className={cn(
        "tw-rounded-full tw-shadow-lg hover:tw-shadow-xl tw-z-50",
        positionClasses[position],
        sizeClasses[size],
        className
      )}
      size="icon"
      {...props}
    />
  );
}

// Toggle Button
export interface ToggleButtonProps extends Omit<ButtonProps, "variant"> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export function ToggleButton({
  className,
  pressed = false,
  onPressedChange,
  onClick,
  ...props
}: ToggleButtonProps): React.ReactElement {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onPressedChange?.(!pressed);
    onClick?.(e);
  };

  return (
    <Button
      className={cn(
        pressed && "tw-bg-primary tw-text-primary-foreground",
        className
      )}
      onClick={handleClick}
      aria-pressed={pressed}
      {...props}
    />
  );
}
