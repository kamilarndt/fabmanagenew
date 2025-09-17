import { cn } from "@/new-ui/utils/cn";
import React from "react";

interface SpaceProps {
  children: React.ReactNode;
  direction?: "horizontal" | "vertical";
  size?: "small" | "middle" | "large" | number;
  wrap?: boolean;
  align?: "start" | "end" | "center" | "baseline";
  className?: string;
  style?: React.CSSProperties;
}

export const Space: React.FC<SpaceProps> = ({
  children,
  direction = "horizontal",
  size = "middle",
  wrap = false,
  align,
  className,
  style,
}) => {
  const getSizeClass = () => {
    if (typeof size === "number") {
      return `gap-${size}`;
    }
    const sizeMap = {
      small: "gap-1",
      middle: "gap-2",
      large: "gap-4",
    };
    return sizeMap[size];
  };

  const getAlignClass = () => {
    if (!align) return "";
    const alignMap = {
      start: "items-start",
      end: "items-end",
      center: "items-center",
      baseline: "items-baseline",
    };
    return alignMap[align];
  };

  return (
    <div
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col" : "flex-row",
        getSizeClass(),
        getAlignClass(),
        wrap && "flex-wrap",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

// Space.Compact component for compact spacing
export const SpaceCompact: React.FC<{
  children: React.ReactNode;
  block?: boolean;
  className?: string;
}> = ({ children, block = false, className }) => {
  return (
    <div className={cn("flex", block && "w-full", className)}>{children}</div>
  );
};

Space.Compact = SpaceCompact;
