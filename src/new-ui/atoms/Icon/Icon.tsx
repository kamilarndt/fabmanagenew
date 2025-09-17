import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface IconProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Icon({
  name,
  className,
  size = "md",
}: IconProps): React.ReactElement {
  const sizeClasses = {
    sm: "tw-h-3 tw-w-3",
    md: "tw-h-4 tw-w-4",
    lg: "tw-h-6 tw-w-6",
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
  };

  const iconContent = iconMap[name] || "?";

  return (
    <span
      className={cn(
        "tw-inline-flex tw-items-center tw-justify-center tw-font-mono",
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
    >
      {iconContent}
    </span>
  );
}
