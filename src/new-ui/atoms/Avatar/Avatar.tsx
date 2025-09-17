import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Avatar({
  className,
  src,
  alt,
  children,
  size = "md",
  ...props
}: AvatarProps): React.ReactElement {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
          {children || "?"}
        </div>
      )}
    </div>
  );
}
