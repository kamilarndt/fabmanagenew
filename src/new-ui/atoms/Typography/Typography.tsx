import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  children: React.ReactNode;
}

export function Typography({
  className,
  variant = "p",
  children,
  ...props
}: TypographyProps): React.ReactElement {
  const variantClasses = {
    h1: "text-4xl font-bold tracking-tight",
    h2: "text-3xl font-semibold tracking-tight",
    h3: "text-2xl font-semibold tracking-tight",
    h4: "text-xl font-semibold tracking-tight",
    h5: "text-lg font-semibold tracking-tight",
    h6: "text-base font-semibold tracking-tight",
    p: "text-base leading-7",
    span: "text-base",
    div: "text-base",
  };

  const Component = variant as keyof React.JSX.IntrinsicElements;

  return React.createElement(
    Component,
    { className: cn(variantClasses[variant], className), ...props },
    children
  );
}
