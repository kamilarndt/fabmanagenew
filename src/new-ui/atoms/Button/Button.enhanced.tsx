import {
  designTokens,
  getBackground,
  getColor,
  getRadius,
} from "@/design-system";
import { cn } from "@/new-ui/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

// Enhanced Button variants using design tokens
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-white hover:opacity-90",
        destructive: "text-white hover:opacity-90",
        outline:
          "border bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary: "text-secondary-foreground hover:opacity-80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "text-white hover:opacity-90",
        warning: "text-white hover:opacity-90",
        gradient:
          "bg-gradient-to-r from-primary to-primary/80 text-white hover:opacity-90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        fab: "h-14 w-14 rounded-full shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Get colors from design tokens
    const getVariantStyles = () => {
      switch (variant) {
        case "default":
          return {
            backgroundColor: getColor("primary"),
            color: designTokens.colors.foreground.accent,
          };
        case "destructive":
          return {
            backgroundColor: getColor("destructive"),
            color: designTokens.colors.foreground.accent,
          };
        case "success":
          return {
            backgroundColor: getColor("success"),
            color: designTokens.colors.foreground.accent,
          };
        case "warning":
          return {
            backgroundColor: getColor("warning"),
            color: designTokens.colors.foreground.accent,
          };
        case "outline":
          return {
            borderColor: designTokens.colors.border.default,
            backgroundColor: "transparent",
            color: getColor("primary"),
          };
        case "secondary":
          return {
            backgroundColor: getBackground("secondary"),
            color: designTokens.colors.foreground.secondary,
          };
        case "ghost":
          return {
            backgroundColor: "transparent",
            color: getColor("primary"),
          };
        case "link":
          return {
            backgroundColor: "transparent",
            color: getColor("primary"),
          };
        case "gradient":
          return {
            background: `linear-gradient(135deg, ${getColor(
              "primary"
            )}, ${getColor("primary")}80)`,
            color: designTokens.colors.foreground.accent,
          };
        default:
          return {
            backgroundColor: getColor("primary"),
            color: designTokens.colors.foreground.accent,
          };
      }
    };

    const variantStyles = getVariantStyles();
    const borderRadius = size === "fab" ? "50%" : getRadius("md");

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        style={{
          ...variantStyles,
          borderRadius,
          ...props.style,
        }}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
