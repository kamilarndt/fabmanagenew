import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface SkeletonProps {
  active?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  title?: boolean | { width?: number | string };
  paragraph?: boolean | { rows?: number; width?: number | string | (number | string)[] };
  avatar?: boolean | { size?: number | "large" | "small" | "default"; shape?: "circle" | "square" };
  round?: boolean;
  className?: string;
}

export function Skeleton({
  active = true,
  loading = true,
  children,
  title = false,
  paragraph = true,
  avatar = false,
  round = false,
  className,
}: SkeletonProps): React.ReactElement {
  if (!loading && children) {
    return <>{children}</>;
  }

  const getAnimationClass = () => {
    return active ? "animate-pulse" : "";
  };

  const getBaseClasses = () => {
    return cn(
      "skeleton-base bg-gray-200 dark:bg-gray-700",
      getAnimationClass(),
      className
    );
  };

  const renderTitle = () => {
    if (!title) return null;

    const titleWidth = typeof title === "object" ? title.width : "60%";
    
    return (
      <div
        className={cn(getBaseClasses(), "h-4 mb-4", round && "rounded-full")}
        style={{ width: titleWidth }}
      />
    );
  };

  const renderParagraph = () => {
    if (!paragraph) return null;

    const paragraphConfig = typeof paragraph === "object" ? paragraph : {};
    const rows = paragraphConfig.rows || 3;
    const widths = paragraphConfig.width || ["100%", "80%", "60%"];

    return (
      <div className="space-y-2">
        {Array.from({ length: rows }, (_, index) => {
          const width = Array.isArray(widths) ? widths[index] || "100%" : widths;
          return (
            <div
              key={index}
              className={cn(
                getBaseClasses(),
                "h-3",
                round && "rounded-full"
              )}
              style={{ width }}
            />
          );
        })}
      </div>
    );
  };

  const renderAvatar = () => {
    if (!avatar) return null;

    const avatarConfig = typeof avatar === "object" ? avatar : {};
    const size = avatarConfig.size || "default";
    const shape = avatarConfig.shape || "circle";

    const getSizeClasses = () => {
      switch (size) {
        case "large":
          return "w-12 h-12";
        case "small":
          return "w-6 h-6";
        default:
          return "w-8 h-8";
      }
    };

    const getShapeClasses = () => {
      return shape === "circle" ? "rounded-full" : "rounded";
    };

    return (
      <div
        className={cn(
          getBaseClasses(),
          getSizeClasses(),
          getShapeClasses()
        )}
      />
    );
  };

  return (
    <div className="skeleton-container">
      {renderAvatar()}
      {renderTitle()}
      {renderParagraph()}
    </div>
  );
}

// Skeleton Button Component
export interface SkeletonButtonProps {
  active?: boolean;
  size?: "small" | "default" | "large";
  block?: boolean;
  className?: string;
}

export function SkeletonButton({
  active = true,
  size = "default",
  block = false,
  className,
}: SkeletonButtonProps): React.ReactElement {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-6 px-3";
      case "large":
        return "h-10 px-6";
      default:
        return "h-8 px-4";
    }
  };

  return (
    <div
      className={cn(
        "skeleton-button bg-gray-200 dark:bg-gray-700 rounded transition-colors",
        getSizeClasses(),
        block && "w-full",
        active && "animate-pulse",
        className
      )}
    />
  );
}

// Skeleton Input Component
export interface SkeletonInputProps {
  active?: boolean;
  size?: "small" | "default" | "large";
  className?: string;
}

export function SkeletonInput({
  active = true,
  size = "default",
  className,
}: SkeletonInputProps): React.ReactElement {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-6";
      case "large":
        return "h-10";
      default:
        return "h-8";
    }
  };

  return (
    <div
      className={cn(
        "skeleton-input bg-gray-200 dark:bg-gray-700 rounded transition-colors w-full",
        getSizeClasses(),
        active && "animate-pulse",
        className
      )}
    />
  );
}

// Skeleton Avatar Component
export interface SkeletonAvatarProps {
  active?: boolean;
  size?: number | "large" | "small" | "default";
  shape?: "circle" | "square";
  className?: string;
}

export function SkeletonAvatar({
  active = true,
  size = "default",
  shape = "circle",
  className,
}: SkeletonAvatarProps): React.ReactElement {
  const getSizeClasses = () => {
    switch (size) {
      case "large":
        return "w-12 h-12";
      case "small":
        return "w-6 h-6";
      default:
        return "w-8 h-8";
    }
  };

  const getShapeClasses = () => {
    return shape === "circle" ? "rounded-full" : "rounded";
  };

  return (
    <div
      className={cn(
        "skeleton-avatar bg-gray-200 dark:bg-gray-700 transition-colors",
        getSizeClasses(),
        getShapeClasses(),
        active && "animate-pulse",
        className
      )}
    />
  );
}

