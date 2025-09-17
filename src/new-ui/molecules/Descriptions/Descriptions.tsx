import React from "react";
import { cn } from "../../utils/cn";

interface DescriptionsProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  column?: number;
  bordered?: boolean;
  size?: "default" | "middle" | "small";
}

interface DescriptionsItemProps {
  label: string;
  children: React.ReactNode;
  span?: number;
  className?: string;
}

export const Descriptions: React.FC<DescriptionsProps> = ({
  title,
  children,
  className,
  column = 3,
  bordered = false,
  size = "default",
}) => {
  const sizeClasses = {
    small: "text-sm",
    middle: "text-base",
    default: "text-base",
  };

  return (
    <div className={cn("w-full", className)}>
      {title && (
        <div className="text-lg font-semibold text-gray-900 mb-4">
          {title}
        </div>
      )}
      <div
        className={cn(
          "grid gap-4",
          bordered && "border border-gray-200 rounded-lg p-4",
          sizeClasses[size]
        )}
        style={{ gridTemplateColumns: `repeat(${column}, 1fr)` }}
      >
        {children}
      </div>
    </div>
  );
};

export const DescriptionsItem: React.FC<DescriptionsItemProps> = ({
  label,
  children,
  span = 1,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1",
        span > 1 && `col-span-${span}`,
        className
      )}
    >
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{children}</dd>
    </div>
  );
};
