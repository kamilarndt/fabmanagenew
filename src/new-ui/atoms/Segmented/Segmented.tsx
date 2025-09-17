import { cn } from "@/new-ui/utils/cn";
import React from "react";

interface SegmentedProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    label: string;
    value: string;
  }>;
  block?: boolean;
  className?: string;
}

export const Segmented: React.FC<SegmentedProps> = ({
  value,
  onChange,
  options,
  block = false,
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg bg-gray-100 p-1",
        block && "w-full",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === option.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
