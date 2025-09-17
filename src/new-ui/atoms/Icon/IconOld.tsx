import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface IconOldProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  className?: string;
  size?: "small" | "default" | "large";
  spin?: boolean;
  rotate?: number;
  twoToneColor?: [string, string];
}

export function IconOld({
  className,
  name,
  size = "default",
  spin = false,
  rotate,
  twoToneColor,
  ...props
}: IconOldProps): React.ReactElement {
  const sizeClasses = {
    small: "h-3 w-3",
    default: "h-4 w-4",
    large: "h-6 w-6",
  };

  // Simple icon mapping - in a real app, you'd use a proper icon library like Lucide React
  const iconMap: Record<string, string> = {
    // Navigation
    menu: "☰",
    "chevron-left": "‹",
    "chevron-right": "›",
    "chevron-up": "ˆ",
    "chevron-down": "ˇ",
    "chevrons-left": "«",
    "chevrons-right": "»",

    // Actions
    search: "🔍",
    x: "✕",
    check: "✓",
    plus: "+",
    minus: "−",
    edit: "✏",
    delete: "🗑",
    save: "💾",

    // UI
    "loader-2": "⟳",
    bell: "🔔",
    settings: "⚙",
    user: "👤",
    home: "🏠",
    folder: "📁",
    file: "📄",
    image: "🖼",

    // Status
    success: "✓",
    warning: "⚠",
    error: "✕",
    info: "ℹ",

    // Objects
    square: "⬜",
    circle: "⭕",
    "dollar-sign": "$",
    activity: "📊",

    // Sidebar Icons (z Figmy)
    house: "🏠",
    files: "📁",
    users: "👥",
    "calendar-days": "📅",
    "pencil-ruler": "📏",
    drill: "🔧",
    factory: "🏭",
    warehouse: "🏪",
    "hard-hat": "⛑️",
    package: "📦",

    // Dashboard Icons
    "check-circle": "✅",
    clock: "🕐",
    "currency-dollar": "💰",
    "arrow-trending-up": "📈",
    "arrow-trending-down": "📉",
    cog: "⚙️",
    "shopping-cart": "🛒",
  };

  const iconContent = iconMap[name] || "?";

  const transformStyle = React.useMemo(() => {
    const transforms = [];
    if (rotate) transforms.push(`rotate(${rotate}deg)`);
    return transforms.length > 0 ? transforms.join(" ") : undefined;
  }, [rotate]);

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-mono",
        sizeClasses[size],
        spin && "animate-spin",
        className
      )}
      style={transformStyle ? { transform: transformStyle } : undefined}
      aria-hidden="true"
      {...props}
    >
      {iconContent}
    </span>
  );
}
