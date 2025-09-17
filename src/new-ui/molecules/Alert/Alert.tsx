import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
  description?: string;
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
}

export function Alert({
  className,
  variant = "info",
  title,
  description,
  showIcon = true,
  closable = false,
  onClose,
  children,
  ...props
}: AlertProps): React.ReactElement {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) {
    return <></>;
  }

  const variantClasses = {
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
    success:
      "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
    warning:
      "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
    danger:
      "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
  };

  const iconClasses = {
    info: "text-blue-400",
    success: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-red-400",
  };

  const icons = {
    info: "ℹ",
    success: "✓",
    warning: "⚠",
    danger: "✕",
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <div className="flex">
        {showIcon && (
          <div className={cn("mr-3 flex-shrink-0", iconClasses[variant])}>
            <span className="text-lg">{icons[variant]}</span>
          </div>
        )}
        <div className="flex-1">
          {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
          {description && <p className="text-sm">{description}</p>}
          {children}
        </div>
        {closable && (
          <button
            onClick={handleClose}
            className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Close</span>
            <span className="text-lg">×</span>
          </button>
        )}
      </div>
    </div>
  );
}
