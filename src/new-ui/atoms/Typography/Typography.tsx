import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
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
  copyable?: boolean | { text?: string; onCopy?: () => void };
  editable?:
    | boolean
    | {
        onChange?: (text: string) => void;
        onStart?: () => void;
        onEnd?: () => void;
      };
  ellipsis?:
    | boolean
    | { rows?: number; expandable?: boolean; onExpand?: () => void };
  style?: React.CSSProperties;
}

export function Typography({
  variant = "p",
  children,
  level,
  type,
  disabled = false,
  mark = false,
  code = false,
  keyboard = false,
  underline = false,
  strikethrough = false,
  strong = false,
  italic = false,
  copyable = false,
  editable = false,
  ellipsis = false,
  className,
  ...props
}: TypographyProps): React.ReactElement {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(children?.toString() || "");

  const getVariantClasses = () => {
    if (level) {
      switch (level) {
        case 1:
          return "text-4xl font-bold";
        case 2:
          return "text-3xl font-bold";
        case 3:
          return "text-2xl font-semibold";
        case 4:
          return "text-xl font-semibold";
        case 5:
          return "text-lg font-medium";
        default:
          return "text-base";
      }
    }

    switch (variant) {
      case "h1":
        return "text-4xl font-bold";
      case "h2":
        return "text-3xl font-bold";
      case "h3":
        return "text-2xl font-semibold";
      case "h4":
        return "text-xl font-semibold";
      case "h5":
        return "text-lg font-medium";
      case "h6":
        return "text-base font-medium";
      case "p":
        return "text-base";
      case "span":
        return "text-base";
      case "div":
        return "text-base";
      default:
        return "text-base";
    }
  };

  const getTypeClasses = () => {
    switch (type) {
      case "secondary":
        return "text-gray-500 dark:text-gray-400";
      case "success":
        return "text-green-600 dark:text-green-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "danger":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-900 dark:text-gray-100";
    }
  };

  const getModifierClasses = () => {
    const classes = [];

    if (disabled) classes.push("opacity-50 cursor-not-allowed");
    if (mark) classes.push("bg-yellow-200 dark:bg-yellow-800");
    if (code)
      classes.push(
        "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono"
      );
    if (keyboard)
      classes.push(
        "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono border border-gray-300 dark:border-gray-600"
      );
    if (underline) classes.push("underline");
    if (strikethrough) classes.push("line-through");
    if (strong) classes.push("font-bold");
    if (italic) classes.push("italic");

    return classes.join(" ");
  };

  const handleCopy = async () => {
    const textToCopy =
      typeof copyable === "object"
        ? copyable.text || children?.toString()
        : children?.toString();
    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        if (typeof copyable === "object" && copyable.onCopy) {
          copyable.onCopy();
        }
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  const handleEditStart = () => {
    if (typeof editable === "object" && editable.onStart) {
      editable.onStart();
    }
    setIsEditing(true);
    setEditText(children?.toString() || "");
  };

  const handleEditEnd = () => {
    if (typeof editable === "object" && editable.onChange) {
      editable.onChange(editText);
    }
    setIsEditing(false);
    if (typeof editable === "object" && editable.onEnd) {
      editable.onEnd();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditEnd();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditText(children?.toString() || "");
    }
  };

  const getElement = () => {
    if (level) {
      switch (level) {
        case 1:
          return "h1";
        case 2:
          return "h2";
        case 3:
          return "h3";
        case 4:
          return "h4";
        case 5:
          return "h5";
        default:
          return "div";
      }
    }
    return variant as keyof JSX.IntrinsicElements;
  };

  const Element = getElement() as any;

  const content = isEditing ? (
    <input
      type="text"
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
      onBlur={handleEditEnd}
      onKeyDown={handleKeyDown}
      className="bg-transparent border-none outline-none w-full"
      autoFocus
    />
  ) : (
    children
  );

  return (
    <Element
      className={cn(
        getVariantClasses(),
        getTypeClasses(),
        getModifierClasses(),
        className
      )}
      {...props}
    >
      {content}
      {copyable && (
        <button
          onClick={handleCopy}
          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="Copy"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      )}
      {editable && !isEditing && (
        <button
          onClick={handleEditStart}
          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="Edit"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
      )}
    </Element>
  );
}

// Convenience components
export const Paragraph = ({
  className,
  ...props
}: Omit<TypographyProps, "variant">) => {
  return <Typography variant="p" className={className} {...props} />;
};

export const Text = ({
  className,
  ...props
}: Omit<TypographyProps, "variant">) => {
  return <Typography variant="span" className={className} {...props} />;
};

export const Title = ({
  className,
  ...props
}: Omit<TypographyProps, "variant">) => {
  return <Typography variant="h1" className={className} {...props} />;
};
