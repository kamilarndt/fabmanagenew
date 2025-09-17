import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "link"
    | "default";
  size?: "sm" | "md" | "lg" | "icon" | "small";
  loading?: boolean;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset" | "text";
  icon?: React.ReactNode;
  danger?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  icon,
  danger = false,
  ...props
}: ButtonProps): React.ReactElement {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    outline:
      "border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
    destructive:
      "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
    link: "text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400",
    default:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    small: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10 p-0",
  };

  const finalVariant = danger ? "destructive" : variant;
  const finalType = type === "text" ? "button" : type;

  return (
    <button
      type={finalType}
      className={cn(
        baseClasses,
        variantClasses[finalVariant],
        sizeClasses[size],
        loading && "opacity-50 cursor-not-allowed",
        type === "text" &&
          "bg-transparent border-none shadow-none hover:bg-gray-100",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
