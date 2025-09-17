import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface EmptyProps {
  description?: React.ReactNode;
  image?: React.ReactNode;
  imageStyle?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
}

export function Empty({
  description = "No Data",
  image,
  imageStyle,
  children,
  className,
}: EmptyProps): React.ReactElement {
  const defaultImage = (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={imageStyle}
    >
      <rect width="64" height="64" fill="#F3F4F6" />
      <path
        d="M20 20H44V44H20V20Z"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 32L36 24L44 32"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div
      className={cn(
        "empty-container flex flex-col items-center justify-center p-8",
        className
      )}
      style={{
        color: "var(--color-foreground-secondary)",
      }}
    >
      {/* Image */}
      <div className="mb-4">
        {image || defaultImage}
      </div>

      {/* Description */}
      {description && (
        <div
          className="text-sm text-center mb-4"
          style={{ color: "var(--color-foreground-secondary)" }}
        >
          {description}
        </div>
      )}

      {/* Children (usually action buttons) */}
      {children && (
        <div className="flex flex-col items-center space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}