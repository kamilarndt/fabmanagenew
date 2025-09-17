import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  children: React.ReactNode;
}

export function Alert({
  className,
  variant = "default",
  children,
  ...props
}: AlertProps): React.ReactElement {
  const variantClasses = {
    default: "bg-background text-foreground border",
    destructive:
      "bg-red-50 text-red-900 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20",
    success:
      "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/20",
    warning:
      "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/10 dark:text-yellow-400 dark:border-yellow-900/20",
    info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/20",
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function AlertDescription({
  className,
  children,
  ...props
}: AlertDescriptionProps): React.ReactElement {
  return (
    <p className={cn("text-sm [&_p]:leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}
