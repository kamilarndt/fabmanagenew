import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface TypographyOldProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5;
  type?: "secondary" | "success" | "warning" | "danger";
  disabled?: boolean;
  mark?: boolean;
  code?: boolean;
  keyboard?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  strong?: boolean;
  italic?: boolean;
}

export function TypographyOld({
  className,
  children,
  level = 1,
  type,
  disabled = false,
  mark = false,
  code = false,
  keyboard = false,
  underline = false,
  strikethrough = false,
  strong = false,
  italic = false,
  ...props
}: TypographyOldProps): React.ReactElement {
  const levelClasses = {
    1: "text-4xl font-bold",
    2: "text-3xl font-semibold",
    3: "text-2xl font-semibold",
    4: "text-xl font-semibold",
    5: "text-lg font-semibold",
  };

  const typeClasses = {
    secondary: "text-gray-500 dark:text-gray-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-red-600 dark:text-red-400",
  };

  const decorationClasses = {
    underline: "underline",
    strikethrough: "line-through",
    italic: "italic",
  };

  const weightClasses = {
    strong: "font-bold",
  };

  const backgroundClasses = {
    mark: "bg-yellow-200 dark:bg-yellow-800",
    code: "bg-gray-100 dark:bg-gray-800 font-mono text-sm px-1 py-0.5 rounded",
    keyboard:
      "bg-gray-100 dark:bg-gray-800 font-mono text-sm px-1 py-0.5 rounded border border-gray-300 dark:border-gray-600",
  };

  const Component = code ? "code" : keyboard ? "kbd" : "div";

  return (
    <Component
      className={cn(
        levelClasses[level],
        type && typeClasses[type],
        disabled && "opacity-50 cursor-not-allowed",
        mark && backgroundClasses.mark,
        code && backgroundClasses.code,
        keyboard && backgroundClasses.keyboard,
        underline && decorationClasses.underline,
        strikethrough && decorationClasses.strikethrough,
        italic && decorationClasses.italic,
        strong && weightClasses.strong,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
