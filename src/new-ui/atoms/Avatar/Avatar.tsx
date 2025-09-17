import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  children?: React.ReactNode;
  src?: string;
  icon?: React.ReactNode;
  shape?: "circle" | "square";
  size?: number | "small" | "default" | "large";
  className?: string;
  style?: React.CSSProperties;
}

export const Avatar: React.FC<AvatarProps> = ({
  children,
  src,
  icon,
  shape = "circle",
  size = "default",
  className,
  style,
}) => {
  const getSizeClass = () => {
    if (typeof size === "number") {
      return "";
    }
    const sizeMap = {
      small: "w-8 h-8 text-xs",
      default: "w-10 h-10 text-sm",
      large: "w-12 h-12 text-base",
    };
    return sizeMap[size];
  };

  const getShapeClass = () => {
    return shape === "circle" ? "rounded-full" : "rounded-md";
  };

  const sizeStyle = typeof size === "number" ? { width: size, height: size } : {};

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gray-300 text-gray-600 font-medium",
        getSizeClass(),
        getShapeClass(),
        className
      )}
      style={{ ...sizeStyle, ...style }}
    >
      {src ? (
        <img
          src={src}
          alt="Avatar"
          className={cn("w-full h-full object-cover", getShapeClass())}
        />
      ) : icon ? (
        icon
      ) : (
        children
      )}
    </div>
  );
};