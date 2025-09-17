import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export function Form({
  className,
  children,
  ...props
}: FormProps): React.ReactElement {
  return (
    <form className={cn("space-y-6", className)} {...props}>
      {children}
    </form>
  );
}

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function FormItem({
  className,
  children,
  ...props
}: FormItemProps): React.ReactElement {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {children}
    </div>
  );
}

export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function FormLabel({
  className,
  children,
  ...props
}: FormLabelProps): React.ReactElement {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function FormControl({
  className,
  children,
  ...props
}: FormControlProps): React.ReactElement {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export interface FormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function FormMessage({
  className,
  children,
  ...props
}: FormMessageProps): React.ReactElement {
  return (
    <p
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  );
}
