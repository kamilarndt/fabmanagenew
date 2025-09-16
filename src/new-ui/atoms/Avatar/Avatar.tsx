import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: number;
}

export function Avatar({
  src,
  alt,
  fallback,
  size = 32,
  className,
  ...props
}: AvatarProps): React.ReactElement {
  const dimension = { width: size, height: size } as const;
  return (
    <div
      className={cn(
        "tw-inline-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-muted tw-text-foreground tw-overflow-hidden",
        className
      )}
      style={dimension}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          src={src}
          alt={alt ?? "avatar"}
          className="tw-h-full tw-w-full tw-object-cover"
        />
      ) : (
        <span className="tw-text-xs tw-font-medium">
          {fallback?.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}
